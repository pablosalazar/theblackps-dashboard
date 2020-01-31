import React, { Component, Fragment } from 'react'
import { Row } from "reactstrap";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { NavLink } from 'react-router-dom';

export default class AddVehicle extends Component {
    render() {
        return(
            <Fragment>
            <Row>
            <Colxx xxs="12">
                <Breadcrumb heading="Nuevo vehículo" match={this.props.match} />
                <div className="text-zero top-right-button-container">
                    <NavLink to="/vehiculos/lista" className="btn btn-sm btn-outline-dark mr-3">Salir </NavLink>
                </div>
                <Separator className="mb-5" />
            </Colxx>
            </Row>
            <Row>
                <Colxx xs="6" md="6" className="mb-3">
                    <h1>The form goes here</h1>
                </Colxx>
            </Row>
        </Fragment>
        );
    }
}