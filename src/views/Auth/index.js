import React from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";

import login from "./login";

const index = ({match}) => {
  return (
    <AuthLayout>
      <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/login`} />
        <Route path={`${match.url}/login`} component={login} />
        <Redirect to="/error" />
      </Switch>
    </AuthLayout>
  );
};

export default index;