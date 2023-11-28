// DeviceData.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSeriesData, updateSeriesShadow } from './redux/actions/seriesActions';
import extractData from './js/extractData';
import awsConfig from './aws.config.js';

import { DynamoDBDocument, QueryCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
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

    // count the records
    // Define your query parameters
    params = {
      TableName: 'vim_realtime_data',
      KeyConditionExpression: 'device_id = :value AND #timestamp >= :timestamp',
      ExpressionAttributeValues: {
        ':value': deviceId,
        ':timestamp': initialTime,
      },
      ExpressionAttributeNames: {
        '#timestamp': 'timestamp',
      },
      Select: 'COUNT',  // Specify that you want to get the count of matching items
      // ProjectionExpression: 'deviceInfo, #timestamp', // You can omit the ProjectionExpression for counting
    };

    // Query DynamoDB table for count
    dynamodb.query(params, (err, countResult) => {
      if (err) {
        console.error('Error querying DynamoDB table:', err);
      } else {
        const itemCount = countResult.Count;
        console.log('Count result:', itemCount);
        // You might want to dispatch or handle the itemCount as needed
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
    
        for (const r of result.Items) console.log(r.bms.bmsState[1]);
    
        console.log(result);
    
        const points = result.Items.map(item => ({
          bmsState: item.bms.bmsState[1],
          timestamp: item.timestamp,
          totalDistance: item.gps[8]
        })).reverse();
        console.log(points);
    
        const events = [];
    
        let currentEvent = null;
        // point: {timestamp, bmsState, totalDistance}
        for (const point of points) {
          const bmsState = point.bmsState;
          const timestamp = point.timestamp;

          console.log(bmsState);

          if (currentEvent === null || currentEvent.type !== bmsState) {
            // Start a new event
            if (currentEvent !== null) {
              // Calculate distance for the current event
              currentEvent.distance = currentEvent.end_totalDistance - currentEvent.start_totalDistance;

              events.push(currentEvent);
            }

            currentEvent = {
              device_id: deviceId,
              type: bmsState,
              start_timestamp: timestamp,
              end_timestamp: timestamp,
              start_totalDistance: point.totalDistance, // Store the total distance of the first datapoint
              end_totalDistance: point.totalDistance,   // Initialize end_totalDistance with the total distance of the first datapoint
              datapoints: 1,
            };
          } else {
            // Continue the current event
            currentEvent.end_timestamp = timestamp;
            currentEvent.end_totalDistance = point.totalDistance; // Update the total distance of the last datapoint within the event
            currentEvent.datapoints += 1;
          }
        }

        // After the loop, handle the last event if it exists
        if (currentEvent !== null) {
          // Calculate distance for the last event
          currentEvent.distance = currentEvent.end_totalDistance - currentEvent.start_totalDistance;
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
            //await dynamodb.send(new BatchWriteCommand(params));
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
