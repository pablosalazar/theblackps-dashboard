import React, { Component, Fragment } from "react";
import { Row} from "reactstrap";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";

import FormEmployee from '../../../containers/forms/FormEmployee';

class AddEmployees extends Component {
  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb
              heading="Nuevo"
              match={this.props.match}
            />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
          
        <Row>
          <Colxx xs="12" md="12" className="mb-3">
            <h5 className="mb-5">
              Agrear un nuevo empleado
            </h5>
            <FormEmployee />
          </Colxx>    
        </Row>
      </Fragment>
    );
  }
}

export default AddEmployees;