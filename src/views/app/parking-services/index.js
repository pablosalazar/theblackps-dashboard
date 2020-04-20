import React, { Component } from 'react';
import { Route, withRouter, Switch, Redirect } from "react-router-dom";

import AppLayout from "../../../layout/AppLayout";
import ListParkingServices from "./ListParkingServices";

class Employees extends Component {
  render() {
    const { match } = this.props;
    return (
      <AppLayout>
        <Switch>
          <Redirect exact from={`${match.url}/`} to={`${match.url}/lista`} />
          <Route path={`${match.url}/lista`} component={ListParkingServices} />
          <Redirect to="/error" />
        </Switch>
      </AppLayout>
    );
  }
}
export default Employees;