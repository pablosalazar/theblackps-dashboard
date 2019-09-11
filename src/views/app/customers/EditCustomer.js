import React, { Component, Fragment } from "react";
import { Row, Alert } from "reactstrap";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import { Redirect, NavLink } from 'react-router-dom';
import Breadcrumb from "../../../containers/navs/Breadcrumb";
// import DeleteEmployeeModal from "../../../containers/modals/DeleteEmployeeModal";

import { getCustomer, deleteCustomer } from "../../../api/customerApi";
import FormEmployee from '../../../containers/forms/FormEmployee';
import FormCustomer from "../../../containers/forms/FormCustomer";

class EditCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customer: {},
      isLoading: true,
      error: null,
      modalOpen: false,
      redirect: false,
    }
  }
  
  componentDidMount() {
    const id = this.props.match.params.customerId;
    this.getCustomer(id);
  }

  getCustomer = async (id) => {
    try {
      const response = await getCustomer(id);
      this.setState({
        customer: response,
        isLoading: false,
      })
    } catch (error) {
      this.setState({
        error,
        isLoading: false
      })
    }
  }

  deleteCustomer = async (id) => {
    try {
      const response = await deleteCustomer(id);
      this.setState({
        modalOpen: false,
        redirect: true,
      })
    } catch (error) {
      this.setState({
        error,
      })
    }
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  render() {
    const { customer, isLoading, error, modalOpen, redirect } = this.state;
    if (redirect) {
      return <Redirect to='/clientes/lista'/>;
    }
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="Detalle del empleado" match={this.props.match} />
            <div className="text-zero top-right-button-container">
              <button type="button" className="btn btn-sm btn-secondary mr-5" onClick={this.toggleModal}>Borrar empleado </button>
              <NavLink to="/clientes/lista" className="btn btn-sm btn-outline-dark mr-3">Salir </NavLink>
            </div>
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row>
          <Colxx xs="6" md="6" className="mb-3">
            {error? 
              <Alert
                color="danger"
              >
                {error}
              </Alert>
              :
              <FormCustomer customer={customer} />
            }
          </Colxx>    
        </Row>
        {/* <DeleteEmployeeModal 
          customer={customer} 
          toggleModal={this.toggleModal} 
          modalOpen={modalOpen}
          handleSubmit={this.deleteEmployee}
        /> */}
      </Fragment>

      
    );
  }
}

export default EditCustomer;