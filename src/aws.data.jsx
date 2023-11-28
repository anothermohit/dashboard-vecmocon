// AwsData.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDataItems } from './redux/actions/dataActions';
import awsConfig from './aws.config.js';

import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { IoTDataPlaneClient, GetThingShadowCommand  } from "@aws-sdk/client-iot-data-plane";

// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.
// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.

/*
var iotdata = new IoTDataPlaneClient(awsConfig);
iotdata.GetThingShadowCommand({thingName: 'V15000860181063868530'}, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
*/

const AwsData = () => {
  const dispatch = useDispatch();
  const dataItems = useSelector((state) => state.data.dataItems);

  useEffect(() => {
    // Create a DynamoDB instance
    const dynamodb = DynamoDBDocument.from(new DynamoDB(awsConfig));
    let params = {}

    const credentials = localStorage.getItem('credentials');
    const { email } = JSON.parse(credentials);

    console.log(email)
  params = {
      TableName: 'clientInfo',
      Limit: 100
    };

    // Scan DynamoDB table
    dynamodb.scan(params, (err, data) => {
      if (err) {
        console.error('Error scanning DynamoDB table:', err);
      } else {
        //console.log('Scan result:', data);
        dispatch(updateDataItems(data.Items)); // Update Redux store
      }
    });

    /*
    params = {
      TableName: 'clientInfo',
      FilterExpression: 'contains(email, :email)', // Assuming 'emails' is the attribute name for the email array
      ExpressionAttributeValues: {
        ':email': 'gurpal.singh@vecmocon.com',
      },
      Limit: 100,
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
    */
  }, [dispatch]);

  return (
    <div>
    </div>
  );
};

export default AwsData;
