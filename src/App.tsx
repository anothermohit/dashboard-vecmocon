import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ECommerce from './pages/Dashboard/ECommerce';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Loader from './common/Loader';
import routes from './routes';

// aws
// aws-sdk requires global to exist
(window as any).global = window;


import * as AWS from 'aws-sdk';
AWS.config.update({
  accessKeyId: "AKIAQMM3NAM36KLKHP6N",
  secretAccessKey: "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",
  endpoint: "dynamodb.us-east-1.amazonaws.com",
  region: "us-east-1"
});

const onRead = () => {
    var dynamodb = new AWS.DynamoDB();
    var docClient = new AWS.DynamoDB.DocumentClient();

    let params = {
        TableName: "basil_fct_data"
    };

    docClient.scan(params, function(err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
        localStorage.setItem('data', data.Items[0].iccid
);
    }
});
};

onRead();

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
    <Toaster position='top-right' reverseOrder={false} containerClassName='overflow-auto'/>

      <Routes>
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route element={<DefaultLayout />}>
          <Route index element={<ECommerce />} />
          {routes.map(({ path, component: Component }) => (
            <Route
              path={path}
              element={
                <Suspense fallback={<Loader />}>
                  <Component />
                </Suspense>
              }
            />
          ))}
        </Route>
      </Routes>
    </>
  );
}

export default App;
