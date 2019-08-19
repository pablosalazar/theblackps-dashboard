import React, { Component, Fragment } from "react";
import { Row, Alert } from "reactstrap";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import axios from "axios";

import FormEmployee from '../../../containers/forms/FormEmployee';

class EditEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employee: {},
      isLoading: true,
      error: null,
    }
  }
  
  componentDidMount() {
    const employeeId = this.props.match.params.employeeId;
    axios.get('http://localhost/theblackps/public/api/employees/' + employeeId)
      .then(response => {
        this.setState({
          employee: response.data,
          isLoading: false,
        })
      })
      .catch(error => {
        this.setState({
          error: error.response ? error.response.data.error : String(error),
          isLoading: false,
        })
      });
  }

  render() {
    const { isLoading, error } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="Detalle del empleado" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        
        <Row>
          <Colxx xs="12" md="12" className="mb-3">
            {error? 
              <Alert
                color="danger"
              >
                {error}
              </Alert>
              :
              <FormEmployee employee={this.state.employee} />
            }
            
          </Colxx>    
        </Row>
        
      </Fragment>
    );
  }
}

export default EditEmployee;