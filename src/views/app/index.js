import React, { Component } from 'react';
import { Route, withRouter, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import AppLayout from "../../layout/AppLayout";
import blankPage from "./blank-page";

class App extends Component {
  render() {
    const { match } = this.props;
    return (
      <AppLayout>
        <Switch>
          <Redirect exact from={`${match.url}/`} to={`${match.url}/blank-page`} />
          <Route path={`${match.url}/blank-page`} component={blankPage} />
          <Redirect to="/error" />
        </Switch>
      </AppLayout>
    );
  }
}
export default App;