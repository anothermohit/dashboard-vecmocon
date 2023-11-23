// DeviceData.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSeriesData, updateSeriesShadow } from './redux/actions/seriesActions';
import extractData from './js/extractData';
import awsConfig from './aws.config.js';

import { DynamoDBDocument, ScanCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
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
    initialTime = new Date(0).getTime();; //Math.floor(tenYearsAgo.getTime() / 1000); // Convert to epoch format

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
      Limit: 1000,
      ScanIndexForward: false, // Sort in descending order based on timestamp
      FilterExpression: 'device_id = :value AND #timestamp >= :timestamp',
      ExpressionAttributeValues: {
        ':value': deviceId,
        ':timestamp': initialTime,
      },
      ExpressionAttributeNames: {
        '#timestamp': 'timestamp',
      },
    };

(async () => {
  try {
    const result = await dynamodb.send(new ScanCommand(params));

    for (const r of result.Items) console.log(r.bms.bmsState[1]);

    console.log(result.Items);

    const points = result.Items.map(item => ({
      bmsState: item.bms.bmsState[1],
      timestamp: item.timestamp,
    })).reverse();
    console.log(points);

    const events = [];

    let currentEvent = null;
    
    for (const point of points) {
      const bmsState = point.bmsState;
      const timestamp = point.timestamp;

      console.log(bmsState)
    
      if (currentEvent === null || currentEvent.type !== bmsState) {
        // Start a new event
        if (currentEvent !== null) {
          events.push(currentEvent);
        }
    
        currentEvent = {
          device_id: deviceId,
          type: bmsState,
          start_timestamp: timestamp,
          end_timestamp: timestamp,
          datapoints: 1,
        };
      } else {
        // Continue the current event
        currentEvent.end_timestamp = timestamp;
        currentEvent.datapoints += 1;
      }
    }
    
    // Add the last event to the events array
    if (currentEvent !== null) {
      events.push(currentEvent);
    }
    
    // Print the resulting events array
    console.log(events);

    // Calculate the sum of all datapoints
    const totalDatapointsSum = events.reduce((sum, event) => sum + event.datapoints, 0);
    console.log(events, totalDatapointsSum );
    // Write events to "Events" table in batches of 25
    
    const batchSize = 25;
    for (let i = 0; i < events.length; i += batchSize) {
      const batch = events.slice(i, i + batchSize);

      const putRequests = batch.map((event) => ({
        PutRequest: {
          Item: event,
        },
      }));

      const params = {
        RequestItems: {
          [destinationTableName]: putRequests,
        },
      };

      try {
        await dynamodb.send(new BatchWriteCommand(params));
        console.log(`Batch write successful for items ${i + 1} to ${i + batchSize}.`);
      } catch (error) {
        console.error(`Error during batch write for items ${i + 1} to ${i + batchSize}:`, error);
      }
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
