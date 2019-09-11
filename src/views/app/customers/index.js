import React, { Component } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";

import AppLayout from "../../../layout/AppLayout";
import ListCustomers from "./ListCustomers";
import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";


class Customers extends Component {
  render() {
    const { match } = this.props;
    return (
      <AppLayout>
        <Switch>
          <Redirect exact from={`${match.url}/`} to={`${match.url}/lista`} />
          <Route path={`${match.url}/lista`} component={ListCustomers} />
          <Route path={`${match.url}/nuevo`} component={AddCustomer} />
          <Route path={`${match.url}/detalle/:employeeId`} component={EditCustomer} />
          <Redirect to="/error" />
        </Switch>
      </AppLayout>
    );
  }
}
export default Customers;