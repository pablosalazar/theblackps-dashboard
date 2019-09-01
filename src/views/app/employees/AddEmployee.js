import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { NavLink } from 'react-router-dom';
import FormEmployee from '../../../containers/forms/FormEmployee';

class AddEmployee extends Component {
  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="Nuevo empleado" match={this.props.match} />
            <div className="text-zero top-right-button-container">
              <NavLink to="/empleados/lista" className="btn btn-sm btn-outline-dark mr-3">Salir </NavLink>
            </div>
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        
        <Row>
          <Colxx xs="12" md="12" className="mb-3">
            <FormEmployee />
          </Colxx>    
        </Row>
        
      </Fragment>
    );
  }
}

export default AddEmployee;