// DeviceData.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSeriesData } from './redux/actions/seriesActions';
import AWS from './aws.config.js';
import extractData from './js/extractData';

var iotdata = new AWS.IotData({endpoint: 'a3fu7wrc8e12x7-ats.iot.us-east-1.amazonaws.com'});

const DeviceData = ({deviceId}) => {
  //console.log(deviceId)
  // shadow
  /*
  iotdata.getThingShadow({thingName: deviceId}, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
  */
  
  const dispatch = useDispatch();
  //const seriesData = useSelector((state) => state.series.seriesData);

  useEffect(() => {
    // Create a DynamoDB instance
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    let params = {}

    // Define your query parameters
    params = {
      TableName: 'vim_realtime_data',
      ScanIndexForward: false,
      Limit: 10,
      KeyConditionExpression: 'device_id = :value', // Replace with your partition key name
      ExpressionAttributeValues: {
        ':value': deviceId, // Replace with the partition key value you want to query
      },
    };

    // Scan DynamoDB table
    dynamodb.query(params, (err, pastData) => {
      if (err) {
        console.error('Error querying DynamoDB table:', err);
      } else {
        const series = pastData.Items.map(extractData);
        console.log('Query result:', pastData, series);
        dispatch(updateSeriesData(series)); // Update Redux store
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

  }, [dispatch]);
  return (
    <div>
    </div>
  );
};

export default DeviceData;
