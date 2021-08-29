import React, { Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Layout from './components/layout/Layout';
import MatrixPage from './components/pages/MatrixPage';
import SignInPage from './components/pages/SignInPage';
import LoadingSpinner from './components/util/LoadingSpinner';
import useAuth from './hooks/use-auth';

const ProfilePage = React.lazy(() => import('./components/pages/ProfilePage'));

function App() {
  const auth = useAuth();

  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Switch>
          {!auth.isSignedIn && (
            <Route path="/" exact>
              <SignInPage></SignInPage>
            </Route>
          )}
          {auth.isSignedIn && (
            <Route path="/matrix">
              <MatrixPage></MatrixPage>
            </Route>
          )}
          {auth.isSignedIn && (
            <Route path="/profiles/:userId">
              <ProfilePage></ProfilePage>
            </Route>
          )}
          <Route path="*">
            {auth.isSignedIn === false && <Redirect to="/" />}
            {auth.isSignedIn === true && <Redirect to="/matrix" />}
          </Route>
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default App;
