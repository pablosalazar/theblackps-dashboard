import React, { Component, Fragment } from "react";
import { Row, Alert } from "reactstrap";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import { Redirect, NavLink } from 'react-router-dom';
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import DeleteEmployeeModal from "../../../containers/modals/DeleteEmployeeModal";

import { getEmployee, deleteEmployee } from "../../../api/employeeApi";
import { getUser } from "../../../api/userApi";
import { getContact } from "../../../api/contactApi";
import FormEmployee from '../../../containers/forms/FormEmployee';
import { async } from "q";

class EditEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employee: {},
      user: {},
      contact: {},
      isLoading: true,
      error: null,
      modalOpen: false,
      redirect: false,
    }
  }
  
  componentDidMount() {
    const employeeId = this.props.match.params.employeeId;
    this.getEmployee(employeeId);
  }

  getEmployee = async(id) => {
    try {
      const employee = await getEmployee(id);
  
      this.setState({
        employee,
        isLoading: false,
      })
    } catch (error) {
      this.setState({
        error,
        isLoading: false
      })
    }
  }

  deleteEmployee = async (id) => {
    try {
      await deleteEmployee(id);
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
    const { employee, isLoading, error, modalOpen, redirect } = this.state;
    if (redirect) {
      return <Redirect to='/empleados/lista'/>;
    }
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="Detalle del empleado" match={this.props.match} />
            <div className="text-zero top-right-button-container">
              <button type="button" className="btn btn-sm btn-secondary mr-5" onClick={this.toggleModal}>Eliminar empleado </button>
              <NavLink to="/empleados/lista" className="btn btn-sm btn-outline-dark mr-3">Salir </NavLink>
            </div>
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
              <FormEmployee employee={employee} />
            }
          </Colxx>    
        </Row>
        <DeleteEmployeeModal 
          employee={employee} 
          toggleModal={this.toggleModal} 
          modalOpen={modalOpen}
          handleSubmit={this.deleteEmployee}
        />
      </Fragment>
    );
  }
}

export default EditEmployee;