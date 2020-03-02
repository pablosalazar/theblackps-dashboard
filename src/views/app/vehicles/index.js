import React, { Component } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";

import AppLayout from "../../../layout/AppLayout";
import ListVehicles from "./ListVehicles";
import AddVehicle from "./AddVehicle";
import EditVehicle from "./EditVehicle";

class Vehicles extends Component {
    render() {
        const { match } = this.props;
        return (
            <AppLayout>
                <Switch>
                    <Redirect exact from={`${match.url}/`} to={`${match.url}/lista`} />
                    <Route path={`${match.url}/lista`} component={ListVehicles} />
                    <Route path={`${match.url}/nuevo`} component={AddVehicle} />
                    <Route path={`${match.url}/detalle/:vehicleId`} component={EditVehicle} />
                </Switch>
            </AppLayout>
        );
    }
}
export default Vehicles;