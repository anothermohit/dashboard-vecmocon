// AwsData.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDataItems } from './redux/actions/dataActions';
import AWS from './aws.config.js';

const AwsData = () => {
  const dispatch = useDispatch();
  const dataItems = useSelector((state) => state.data.dataItems);

  useEffect(() => {
    // Create a DynamoDB instance
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    let params = {}
/*
    // Define your query parameters
    params = {
      TableName: 'vim_realtime_data',
      ScanIndexForward: false,
      Limit: 10,
      KeyConditionExpression: 'device_id = :value', // Replace with your partition key name
      ExpressionAttributeValues: {
        ':value': 'V14000860057065002148', // Replace with the partition key value you want to query
      },
    };

    // Scan DynamoDB table
    dynamodb.query(params, (err, data) => {
      if (err) {
        console.error('Error querying DynamoDB table:', err);
      } else {
        console.log('Query result:', data);
        //dispatch(updateDataItems(data.Items)); // Update Redux store
      }
    });
*/

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
        dispatch(updateDataItems(data.Items)); // Update Redux store
      }
    });
  }, [dispatch]);

  return (
    <div>
      <ul>
        {dataItems.map((item, index) => (
          <li key={index}>{item.someProperty /* Replace with the actual property you want to display */}</li>
        ))}
      </ul>
    </div>
  );
};

export default AwsData;
