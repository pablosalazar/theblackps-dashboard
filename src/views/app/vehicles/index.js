import React, { Component } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";

import AppLayout from "../../../layout/AppLayout";
import ListVehicles from "./ListVehicles"

class Vehicles extends Component {
    render() {
        const { match } = this.props;
        return (
            <AppLayout>
                <Switch>
                    <Redirect exact from={`${match.url}/`} to={`${match.url}/lista`} />
                    <Route path={`${match.url}/lista`} component={ListVehicles} />
                </Switch>
            </AppLayout>
        );
    }
}
export default Vehicles;