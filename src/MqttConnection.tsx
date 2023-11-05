import { useEffect } from 'react';
import { mqtt, iot, CrtError, auth } from 'aws-iot-device-sdk-v2';
import AWS from 'aws-sdk';
import { AWS_REGION, AWS_COGNITO_IDENTITY_POOL_ID, AWS_IOT_ENDPOINT } from './settings';

export class AWSCognitoCredentialsProvider extends auth.CredentialsProvider{
  private options: AWSCognitoCredentialOptions;
  private source_provider : AWS.CognitoIdentityCredentials;
  private aws_credentials : auth.AWSCredentials;
  constructor(options: AWSCognitoCredentialOptions, expire_interval_in_ms? : number)
  {
      super();
      this.options = options;
      AWS.config.region = options.Region;
      this.source_provider = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: options.IdentityPoolId
      });
      this.aws_credentials =
      {
          aws_region: options.Region,
          aws_access_id : this.source_provider.accessKeyId,
          aws_secret_key: this.source_provider.secretAccessKey,
          aws_sts_token: this.source_provider.sessionToken
      }

      setInterval(async ()=>{
          await this.refreshCredentialAsync();
      },expire_interval_in_ms?? 3600*1000);
  }

  getCredentials(){
      return this.aws_credentials;
  }

  async refreshCredentialAsync()
  {
      return new Promise<AWSCognitoCredentialsProvider>((resolve, reject) => {
          this.source_provider.get((err)=>{
              if(err)
              {
                  reject("Failed to get cognito credentials.")
              }
              else
              {
                  this.aws_credentials.aws_access_id = this.source_provider.accessKeyId;
                  this.aws_credentials.aws_secret_key = this.source_provider.secretAccessKey;
                  this.aws_credentials.aws_sts_token = this.source_provider.sessionToken;
                  this.aws_credentials.aws_region = this.options.Region;
                  resolve(this);
              }
          });
      });
  }
}

function MqttConnection() {
  async function connectWebsocket(provider: auth.CredentialsProvider) {
    return new Promise<mqtt.MqttClientConnection>((resolve, reject) => {
      const config = iot.AwsIotMqttConnectionConfigBuilder.newBuilderForWebsocket({
        cleanSession: true,
        clientId: `pub_sub_sample(${new Date()})`,
        endpoint: AWS_IOT_ENDPOINT,
        credentialProvider: provider,
        useWebsockets: true,
        keepAliveSeconds: 30,
      }).build();

      const client = new mqtt.MqttClient();
      const connection = client.newConnection(config);

      connection.on('connect', (sessionPresent) => {
        resolve(connection);
      });

      connection.on('interrupt', (error: CrtError) => {
        console.error(`Connection interrupted: error=${error}`);
      });

      connection.on('resume', (returnCode: number, sessionPresent: boolean) => {
        console.log(`Resumed: rc: ${returnCode} existing session: ${sessionPresent}`);
      });

      connection.on('disconnect', () => {
        console.log('Disconnected');
      });

      connection.on('error', (error) => {
        reject(error);
      });

      connection.connect();
    });
  }

  // This component will only handle the MQTT connection setup
  useEffect(() => {
    // Set up the credentials provider
    const provider = new AWSCognitoCredentialsProvider({
      IdentityPoolId: AWS_COGNITO_IDENTITY_POOL_ID,
      Region: AWS_REGION,
    });

    // Ensure the credentials provider is fetched before setting up the connection
    provider.refreshCredentialAsync().then(() => {
      // Connect to AWS MQTT
      connectWebsocket(provider)
        .then((connection) => {
          // You can do something with the connection here if needed
        })
        .catch((reason) => {
          console.error(`Error while connecting: ${reason}`);
        });
    });
  }, []);

  return null; // This component doesn't render anything
}

export default MqttConnection;
