import React, { Component } from 'react';
import { Route, withRouter, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import AppLayout from "../../../layout/AppLayout";
import ListEmployees from "./ListEmployees";
import AddEmployees from './AddEmployees';

class Employees extends Component {
  render() {
    const { match } = this.props;
    return (
      <AppLayout>
        <Switch>
          <Redirect exact from={`${match.url}/`} to={`${match.url}/lista`} />
          <Route path={`${match.url}/lista`} component={ListEmployees} />
          <Route path={`${match.url}/nuevo`} component={AddEmployees} />
          <Redirect to="/error" />
        </Switch>
      </AppLayout>
    );
  }
}
export default Employees;