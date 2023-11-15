import React, { useState, useEffect } from 'react';
import { mqtt, iot, CrtError, auth } from "aws-iot-device-sdk-v2";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import {
    AuthenticationDetails,
    CognitoUser,
    CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AWS_REGION, AWS_COGNITO_IDENTITY_POOL_ID, AWS_IOT_ENDPOINT } from './settings';
import TableTwo from './components/TableTwo.tsx';
import DeviceMap from './components/DeviceMap.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { updateDeviceState } from './redux/actions/deviceActions';
import { updateSeriesShadow } from './redux/actions/seriesActions';
import extractData from './js/extractData';

function log(msg: string) {
    // Assuming you have an element with id 'message' to log messages
    document.getElementById('message').innerHTML += `<pre>${msg}</pre>`;
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
        console.log(this.aws_credentials);
        return this.aws_credentials;
    }

    async refreshCredentialAsync() {
        try {
            const credentials = await fromCognitoIdentityPool({
                client: new CognitoIdentityClient({ region: this.options.Region }),
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

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isPasswordChangeRequired, setIsPasswordChangeRequired] = useState(false);

    const handleLogin = async () => {
        const poolData = {
            UserPoolId: 'us-east-1_vBr9qRmmd',
            ClientId: '5dngq7m5g8qsi91ephbp1lovn0',
        };
        const userPool = new CognitoUserPool(poolData);

        const authenticationData = {
            Username: email,
            Password: password,
        };
        const authenticationDetails = new AuthenticationDetails(authenticationData);

        const userData = {
            Username: email,
            Pool: userPool,
        };
        const cognitoUser = new CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (session) => {
                console.log('Authentication successful:', session);
                onLogin();
            },
            onFailure: (err) => {
                console.error('Authentication failed:', err);
            },
            newPasswordRequired: (userAttributes, requiredAttributes) => {
                console.log('New password required:', userAttributes, requiredAttributes);
                setIsPasswordChangeRequired(true);
            },
        });
    };

    const handleNewPasswordChange = async () => {
        const poolData = {
            UserPoolId: 'us-east-1_vBr9qRmmd',
            ClientId: '5dngq7m5g8qsi91ephbp1lovn0',
        };
        const userPool = new CognitoUserPool(poolData);
    
        console.log(userPool);
        const userData = {
            Username: email,
            Pool: userPool,
        };
        
        console.log(userData);
        const authenticationData = {
            Username: email,
            Password: password,
        };
        console.log(authenticationData);
        
        const authenticationDetails = new AuthenticationDetails(authenticationData);
        console.log(authenticationDetails);
        const cognitoUser = new CognitoUser(userData);
        console.log(cognitoUser);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (session) => {
                console.log(session)
                cognitoUser.completeNewPasswordChallenge(newPassword, {}, {
                    onSuccess: (session) => {
                        console.log('New password set successfully:', session);
                        // After setting the new password, you can redirect the user to the main application
                        onLogin();
                    },
                    onFailure: (err) => {
                        console.error('Failed to set new password:', err);
                        // Handle the failure scenario, e.g., show an error message to the user
                    },
                });
            },
            onFailure: (err) => {
                console.error('Authentication failed:', err);
                // Handle the failure scenario, e.g., show an error message to the user
            },
            newPasswordRequired: (userAttributes, requiredAttributes) => {
                console.log(userAttributes, requiredAttributes);
                        // Continue with setting the new password
                cognitoUser.completeNewPasswordChallenge(newPassword, {}, {
                    onSuccess: (session) => {
                        console.log('New password set successfully:', session);
                        // After setting the new password, you can redirect the user to the main application
                        onLogin();
                    },
                    onFailure: (err) => {
                        console.error('Failed to set new password:', err);
                        // Handle the failure scenario, e.g., show an error message to the user
                    },
                });
                // Additional logic may be needed here if additional attributes are required
                // For example, you might prompt the user to enter additional information.
            },
        });
    };
    
    

    return (
        <div>
            <h2>{isPasswordChangeRequired ? 'Set New Password' : 'Login'}</h2>
            {isPasswordChangeRequired ? (
                <>
                    <label>New Password:</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <br />
                    <button onClick={handleNewPasswordChange}>Set New Password</button>
                </>
            ) : (
                <>
                    <label>Email:</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <br />
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <br />
                    <button onClick={handleLogin}>Login</button>
                </>
            )}
        </div>
    );
}

// ... (rest of the code)


function Mqtt311(arg) {
    const dispatch = useDispatch();
    let seriesData = useSelector((state) => state.series.seriesData);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        if (isLoggedIn) {
            PubSub(); // initial execution
        }
    }, [isLoggedIn]);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

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
        <div>
            {isLoggedIn ? (
                <>
                    {/* Render components when the user is logged in */}
                </>
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </div>
    );
}

export default Mqtt311;
