import { useEffect } from 'react';
import { mqtt, iot, CrtError, auth } from "aws-iot-device-sdk-v2";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient, GetIdCommand } from "@aws-sdk/client-cognito-identity";
import { AWS_REGION, AWS_COGNITO_IDENTITY_POOL_ID, AWS_IOT_ENDPOINT } from './settings';
import jquery from "jquery";
import TableTwo from './components/TableTwo.tsx';
import DeviceMap from './components/DeviceMap.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { updateDeviceState } from './redux/actions/deviceActions';
import { updateSeriesShadow } from './redux/actions/seriesActions';
import extractData from './js/extractData';

const $: JQueryStatic = jquery;

function log(msg: string) {
    $('#message').append(`<pre>${msg}</pre>`);
}

interface AWSCognitoCredentialOptions {
    IdentityPoolId: string;
    Region: string;
}

export class AWSCognitoCredentialsProvider extends auth.CredentialsProvider {
    private options: AWSCognitoCredentialOptions;
    private aws_credentials: auth.AWSCredentials;

    constructor(options: AWSCognitoCredentialOptions, expire_interval_in_ms?: number) {
        super();
        this.options = options;
        this.aws_credentials = {
            aws_region: options.Region,
            aws_access_id: "",
            aws_secret_key: "",
            aws_sts_token: "",
        };

        setInterval(async () => {
            await this.refreshCredentialAsync();
        }, expire_interval_in_ms ?? 3600 * 1000);
    }

    getCredentials() {
        return this.aws_credentials;
    }

    async refreshCredentialAsync() {
        try {
            const credentials = await fromCognitoIdentityPool({
                client: new CognitoIdentityClient({ region: this.options.Region }), // Add the region option here
                identityPoolId: this.options.IdentityPoolId,
            })();

            if (!credentials || !credentials.accessKeyId || !credentials.secretAccessKey) {
                throw new Error("Invalid credentials received.");
            }

            this.aws_credentials.aws_access_id = credentials.accessKeyId;
            this.aws_credentials.aws_secret_key = credentials.secretAccessKey;
            this.aws_credentials.aws_sts_token = credentials.sessionToken;
            this.aws_credentials.aws_region = this.options.Region;

            return this;
        } catch (error) {
            console.error("Error refreshing credentials:", error);
            throw error;
        }
    }
}

async function connect_websocket(provider: auth.CredentialsProvider) {
    return new Promise<mqtt.MqttClientConnection>((resolve, reject) => {
        let config = iot.AwsIotMqttConnectionConfigBuilder.new_builder_for_websocket()
            .with_clean_session(true)
            .with_client_id(`pub_sub_sample(${new Date()})`)
            .with_endpoint(AWS_IOT_ENDPOINT)
            .with_credential_provider(provider)
            .with_use_websockets()
            .with_keep_alive_seconds(30)
            .build();

        const client = new mqtt.MqttClient();
        const connection = client.new_connection(config);

        connection.on('connect', (session_present) => {
            resolve(connection);
        });

        connection.on('interrupt', (error: CrtError) => {
            // Handle connection interruption
        });

        connection.on('resume', (return_code: number, session_present: boolean) => {
            // Handle connection resume
        });

        connection.on('disconnect', () => {
            // Handle disconnection
        });

        connection.on('error', (error) => {
            reject(error);
        });

        connection.connect();
    });
}

function Mqtt311(arg) {
    const dispatch = useDispatch();
    let seriesData = useSelector((state) => state.series.seriesData);

    var connectionPromise: Promise<mqtt.MqttClientConnection>;
    var sample_msg_count = 0;
    var user_msg_count = 0;
    var test_topic = "/test/topic";

    async function PubSub() {
        const provider = new AWSCognitoCredentialsProvider({
            IdentityPoolId: AWS_COGNITO_IDENTITY_POOL_ID,
            Region: AWS_REGION,
        });

        await provider.refreshCredentialAsync();

        connectionPromise = connect_websocket(provider);

        connectionPromise.then((connection) => {
            if (arg.deviceId) {
                const topic = `$aws/things/${arg.deviceId}/shadow/update`;

                connection.subscribe(topic, mqtt.QoS.AtLeastOnce, (topic, payload) => {
                    const decoder = new TextDecoder('utf8');
                    let message = decoder.decode(new Uint8Array(payload));
                    let state = JSON.parse(message).state;
                    let newData = extractData(state.reported);

                    dispatch(updateSeriesShadow(newData));
                });
            } else if (arg.dataItems) {
                arg.dataItems.forEach((client) => {
                    client.deviceRegistered.forEach((deviceId) => {
                        const topic = `$aws/things/${deviceId}/shadow/update`;

                        connection.subscribe(topic, mqtt.QoS.AtLeastOnce, (topic, payload) => {
                            const decoder = new TextDecoder('utf8');
                            let message = decoder.decode(new Uint8Array(payload));
                            let state = JSON.parse(message).state;
                            dispatch(updateDeviceState(deviceId, state));
                        });
                    });
                });
            }
        }).catch((reason) => {
            console.log(`Error while connecting: ${reason}`);
        });
    }

    useEffect(() => {
        PubSub(); // initial execution
    }, []);

    async function PublishMessage() {
        const msg = `BUTTON CLICKED {${user_msg_count}}`;

        connectionPromise.then((connection) => {
            connection.publish(test_topic, msg, mqtt.QoS.AtLeastOnce).catch((reason) => {
                console.log(`Error publishing: ${reason}`);
            });
        });

        user_msg_count++;
    }

    async function CloseConnection() {
        await connectionPromise.then((connection) => {
            connection.disconnect().catch((reason) => {
                console.log(`Error publishing: ${reason}`);
            });
        });
    }

    return (
        <>
            {/*<TableTwo deviceState={deviceState} />*/}
            {/*<DeviceMap deviceState={deviceState} />*/}
        </>
    );
}

export default Mqtt311;
