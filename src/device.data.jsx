// DeviceData.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSeriesData, updateSeriesShadow } from './redux/actions/seriesActions';
import extractData from './js/extractData';
import awsConfig from './aws.config.js';

import { DynamoDBDocument, QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
//import AWS from 'aws-sdk'
// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.

//var iotdata = new AWS.IotData({endpoint: 'a3fu7wrc8e12x7-ats.iot.us-east-1.amazonaws.com'});

const DeviceData = ({deviceId, time}) => { // time - Hour, Day, Week, Month
  // shadow
  /*
  iotdata.getThingShadow({thingName: deviceId}, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); //dispatch(updateSeriesShadow(extractData(JSON.parse(data.payload).state.reported)));          // successful response
  });
  */
  
  const dispatch = useDispatch();
  //const seriesData = useSelector((state) => state.series.seriesData);

  useEffect(() => {
    // Create a DynamoDB instance
    const dynamodb = DynamoDBDocument.from(new DynamoDB(awsConfig));
    let params = {}

    const now = new Date().getTime();
    const oneHourAgo = now - 60 * 60 * 1000;
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000; // 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000; 
    
    let startTime; 
    if (time == 'Hour') startTime = oneHourAgo;
    else if (time == 'Day') startTime = oneDayAgo; 
    else if (time == 'Week') startTime = oneWeekAgo;
    else if (time == 'Month') startTime = oneMonthAgo;
    else startTime = null;

    let initialTime;
    // Calculate startTime for 10 years ago
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
    initialTime = Math.floor(tenYearsAgo.getTime() / 1000); // Convert to epoch format

    // Define your query parameters
    params = {
      TableName: 'vim_realtime_data',
      ScanIndexForward: false,
      Limit: 10,
      KeyConditionExpression: 'device_id = :value AND #timestamp >= :timestamp',
      ExpressionAttributeValues: {
        ':value': deviceId,
        ':timestamp': startTime,
      },
      ExpressionAttributeNames: {
        '#timestamp': 'timestamp', // 'timestamp' is a reserved word in DynamoDB, so use ExpressionAttributeNames to specify it
      },
      //ProjectionExpression: 'deviceInfo, #timestamp', // Specify the attributes you want to retrieve
    };

    // Scan DynamoDB table
    dynamodb.query(params, (err, pastData) => {
      if (err) {
        console.error('Error querying DynamoDB table:', err);
      } else {
        const series = pastData.Items.map(extractData);
        //console.log('Query result:', pastData, series);
        dispatch(updateSeriesData(series)); // Update Redux store
      }
    });

    const destinationTableName = 'Events'; // replace with your destination DynamoDB table name

 params = {
  TableName: 'vim_realtime_data',
  ScanIndexForward: false,
  Limit: 1000,
  KeyConditionExpression: 'device_id = :value AND #timestamp >= :timestamp',
  ExpressionAttributeValues: {
    ':value': deviceId,
    ':timestamp': initialTime,
  },
  ExpressionAttributeNames: {
    '#timestamp': 'timestamp', // 'timestamp' is a reserved word in DynamoDB, so use ExpressionAttributeNames to specify it
  },
  FilterExpression: 'attribute_exists(bms)',
};

(async () => {
  try {
    const result = await dynamodb.send(new QueryCommand(params));

    console.log(result.Items);

    const isTransitionToCharging = (prevState, currentState) => currentState === 1 && (prevState === 0 || prevState === -1);
    const isTransitionToEndCharging = (prevState, currentState) => currentState === 0 && prevState === 1;
    const isTransitionToDischarging = (prevState, currentState) => currentState === -1 && (prevState === 0 || prevState === 1);
    const isTransitionToEndDischarging = (prevState, currentState) => currentState === 0 && prevState === -1;
    
    const isIdleState = (currentState) => currentState === 0;

    let prevState = 0;
    let chargingStartTime = null;
    let dischargingStartTime = null;
    let idleStartTime = null;

    const events = [];
    let totalDatapointsInEvent = 0;

    // Function to handle the end of an event
    const handleEndEvent = (eventType, startTime, endTime) => {
      if (startTime !== null) {
        events.push({
          device_id: deviceId,
          start_timestamp: startTime,
          end_timestamp: endTime,
          type: eventType,
          total_datapoints: totalDatapointsInEvent,
        });
        startTime = null;
        totalDatapointsInEvent = 0;
      }
    };

    result.Items.forEach((record, index) => {
      const bmsState = record.bms.bmsState[1];
      console.log(bmsState);

      if (isTransitionToCharging(prevState, bmsState)) {
        handleEndEvent(0, idleStartTime, record.timestamp);
        chargingStartTime = record.timestamp;
        totalDatapointsInEvent = 1;
      } else if (isTransitionToEndCharging(prevState, bmsState)) {
        handleEndEvent(1, chargingStartTime, record.timestamp);
        chargingStartTime = null;
      } else if (isTransitionToDischarging(prevState, bmsState)) {
        handleEndEvent(0, idleStartTime, record.timestamp);
        dischargingStartTime = record.timestamp;
        totalDatapointsInEvent = 1;
      } else if (isTransitionToEndDischarging(prevState, bmsState)) {
        handleEndEvent(-1, dischargingStartTime, record.timestamp);
        dischargingStartTime = null;
      } else if (isIdleState(bmsState)) {
        if (idleStartTime === null) {
          idleStartTime = record.timestamp;
        }
        totalDatapointsInEvent += 1;
      } else {
        totalDatapointsInEvent += 1;
      }

      // If this is the last record, handle the end of the last event
      if (index === result.Items.length - 1) {
        handleEndEvent(0, idleStartTime, record.timestamp);
      }

      prevState = bmsState;
    });

    // Calculate the sum of all datapoints
    const totalDatapointsSum = events.reduce((sum, event) => sum + event.total_datapoints, 0);
    console.log(events, totalDatapointsSum );

    // Write events to "Events" table
    for (const event of events) {
      const putParams = {
        TableName: destinationTableName,
        Item: event,
      };

      // await dynamodb.send(new PutCommand(putParams));
    }

    console.log('Stored deviceId and startTimestamp in "Events" table successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
})();
}, [dispatch, deviceId, time]);

  return (
    <div>
    </div>
  );
};

export default DeviceData;
