import React, { useEffect, useState } from 'react';
import AWS from './aws.config.js';
import MQTT311 from './PubSub.tsx';

var iotdata = new AWS.IotData({endpoint: 'a3fu7wrc8e12x7-ats.iot.us-east-1.amazonaws.com'});
iotdata.getThingShadow({thingName: 'V15000860181063868530'}, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});

const AwsData = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Create a DynamoDB instance
    const dynamodb = new AWS.DynamoDB.DocumentClient();

    // Define your query parameters
    const params = {
      TableName: 'vim_data',
  
    };
  
  // Scan DynamoDB table
  dynamodb.scan(params, (err, data) => {
    if (err) {
      console.error('Error scanning DynamoDB table:', err);
    } else {
      console.log('Scan result:', data);
      setItems(data.Items); // Update the state with the scan results
    }
  });
  }, []);

  return (
    <div>
      {/*<MQTT311 />*/}
    </div>
  );
};
  
  export default AwsData;