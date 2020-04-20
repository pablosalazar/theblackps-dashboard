import React, { Component } from 'react';
import { Route, withRouter, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import AppLayout from "../../layout/AppLayout";
import ParkingServices from "./parking-services";

class App extends Component {
  render() {
    const { match } = this.props;
    return (
      <AppLayout>
        <Switch>
          <Redirect exact from={`${match.url}/`} to={`${match.url}/servicio-de-parqueo`} />
          <Route path={`${match.url}/servicio-de-parqueo`} component={ParkingServices} />
          <Redirect to="/error" />
        </Switch>
      </AppLayout>
    );
  }
}
export default App;