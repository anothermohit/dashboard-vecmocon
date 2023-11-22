// DeviceData.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSeriesData, updateSeriesShadow } from './redux/actions/seriesActions';
import extractData from './js/extractData';
import awsConfig from './aws.config.js';

import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
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

// Query DynamoDB table to get the count
dynamodb.query(params, (err, result) => {
  if (err) {
    console.error('Error querying DynamoDB table:', err);
  } else {
    console.log(result)
    const bmsKeyExistsCount = result.Count;
    console.log('Count of records where "bms" key exists:', bmsKeyExistsCount);
  }
});

/*
    params = {
      TableName: 'clientInfo',
      Limit: 100
    };

    // Scan DynamoDB table
    dynamodb.scan(params, (err, data) => {
      if (err) {
        console.error('Error scanning DynamoDB table:', err);
      } else {
        console.log('Scan result:', data);
        dispatch(updateSeriesData(data.Items)); // Update Redux store
      }
    });
    */

  }, [dispatch, time]);
  return (
    <div>
    </div>
  );
};

export default DeviceData;
