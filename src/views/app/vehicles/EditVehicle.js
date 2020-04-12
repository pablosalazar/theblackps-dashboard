import React, { Component, Fragment } from 'react'
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { Redirect, NavLink } from 'react-router-dom';
import FormVehicle from '../../../containers/forms/FormVehicle';
import Avatar from 'react-avatar';
import {
  Row,
  Card,
  CardBody,
  Alert,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label
} from "reactstrap";
import Select from 'react-select'

import { getCustomers } from "../../../api/customerApi";
import { getVehicle, deleteVehicle, addCustomer, deleteCustomer } from "../../../api/vehicleApi";

export default class EditVehicle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicle: {},
      currentCustomer: '',
      isLoading: true,
      error: null,
      showError: false,
      isNewVehicle: false,
      modalOpen: false,
      showAddCustomerModal: false,
      showDeleteCustomerModal: false,
      redirect: false,
      customerList: null
    }
  }

  componentDidMount() {
    const vehicleId = this.props.match.params.vehicleId;
    const paramsString = this.props.location.search;
    const queryParams = new URLSearchParams(paramsString);

    this.setState({ isNewVehicle: queryParams.get("new") == 'true' || false });
    this.getVehicle(vehicleId);
  }

  getVehicle = async (vehicleId) => {
    try {
      const vehicle = await getVehicle(vehicleId);
      this.setState({
        vehicle,
        isLoading: false,
      })
    } catch (error) {
      this.setState({
        error,
        isLoading: false
      })
    }
  }

  deleteVehicle = async () => {
    const { vehicle } = this.state;
    try {
      await deleteVehicle(vehicle.id);
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

  addCustomerVehicle = async () => {
    const { vehicle, currentCustomer } = this.state;
    const customerId = currentCustomer ? currentCustomer.id : null

    if (!customerId) return;

    try {
      await addCustomer(vehicle.id, customerId);
      this.setState({
        currentCustomer: null,
        showAddCustomerModal: !this.state.showAddCustomerModal,
      })
      this.getVehicle(vehicle.id);
    } catch (error) {

      this.setState({
        showAddCustomerModal: !this.state.showAddCustomerModal,
        error,
        showError: true
      })
    }
  }

  deleteCustomerVehicle = async () => {
    const { vehicle, currentCustomer } = this.state;
    const customerId = currentCustomer ? currentCustomer.id : null

    if (!customerId) return;

    try {
      await deleteCustomer(vehicle.id, customerId);
      this.setState({
        currentCustomer: null,
        showDeleteCustomerModal: !this.state.showDeleteCustomerModal,
        isLoading: true
      })
      this.getVehicle(vehicle.id);
    } catch (error) {
      this.setState({
        error,
      })
    }
  }

  getCustomerList = async () => {
    try {
      const response = await getCustomers(50, 1, 'name', '');

      let customerList = response.data.map(customer => {
        return { value: customer.id, label: customer.name, target: { name: 'customer_id' } }
      });

      this.setState({
        customerList: customerList,
      })
    } catch (error) {
      this.setState({
        error,
      })
    }
  }

  customerSelected = (e) => {
    this.setState({
      currentCustomer: { id: e.value }
    })
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  toggleAddCustomerModal = () => {
    const { customerList } = this.state

    if (!customerList) this.getCustomerList()

    this.setState({
      showAddCustomerModal: !this.state.showAddCustomerModal
    })
  }

  toggleDeleteCustomerModal = (customer) => {
    this.setState({
      currentCustomer: customer,
      showDeleteCustomerModal: !this.state.showDeleteCustomerModal
    })
  }

  onDismissErrorAlert = () => {
    this.setState({
      error: null,
      showError: false
    })
  }

  onDismissNewVehicleAlert = () => {
    let history = this.props.history;

    this.setState({
      isNewVehicle: false
    })
    history.push("/vehiculos/detalle/" + this.props.match.params.vehicleId);
  }

  render() {
    const { vehicle, isLoading, currentCustomer, error, showError, isNewVehicle, modalOpen, showAddCustomerModal, showDeleteCustomerModal, redirect, customerList } = this.state;
    if (redirect) {
      return <Redirect to='/vehiculos/lista' />;
    }
    return isLoading ? (
      <div className="loading" />
    ) : (
        <Fragment>
          <Row>
            <Colxx xxs="12">
              <Breadcrumb heading="Editar vehículo" match={this.props.match} />
              <div className="text-zero top-right-button-container">
                <button type="button" className="btn btn-sm btn-secondary mr-5" onClick={this.toggleModal}>Eliminar vehículo </button>
                <NavLink to="/vehiculos/lista" className="btn btn-sm btn-outline-dark mr-3">Salir </NavLink>
              </div>
              <Separator className="mb-5" />
            </Colxx>
          </Row>
          <Row>
            <Colxx xs="12" md="12" className="mb-3">
              {isNewVehicle &&
                <Alert
                  color="success"
                  className="mb-4"
                  isOpen={isNewVehicle}
                  toggle={this.onDismissNewVehicleAlert}
                >
                  Vehículo creado correctamente
                </Alert>
              }
            </Colxx>
          </Row>
          <Row>
            <Colxx xs="6" md="6" className="mb-3">
              <FormVehicle vehicle={vehicle} />
            </Colxx>
            <Colxx xs="6" md="6" className="mb-3">
              {error &&
                <Alert
                  color="danger"
                  className="mb-4"
                  isOpen={showError}
                  toggle={this.onDismissErrorAlert}
                >
                  {error}
                </Alert>
              }
              <Card>
                <CardBody>
                  <Row>
                    <Colxx md="9">
                      <h6 className="mb-4 text-primary">Clientes asociados al vehículo</h6>
                    </Colxx>
                    <Colxx md="3" className="text-right">
                      <Button color="primary" size="sm" onClick={this.toggleAddCustomerModal}>Añadir</Button>
                    </Colxx>
                  </Row>
                  <div>
                    {vehicle.customers.map((customer, index) => {
                      return (
                        <div key={index} className="d-flex flex-row mb-3 pb-3 border-bottom">
                          <Avatar name={customer.name} size="30" round={true} />
                          <div className="pl-3 pr-2">
                            <NavLink to={"/clientes/detalle/" + customer.id}>
                              <p className="font-weight-medium mb-0 ">{customer.name}</p>
                            </NavLink>
                            <p className="text-muted mb-0 text-small">
                              {customer.updated_at} | <NavLink to="#" onClick={() => this.toggleDeleteCustomerModal(customer)} className=" btn-link text-danger mr-3">Eliminar </NavLink>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            </Colxx>
          </Row>
          <Modal isOpen={modalOpen} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>
              Borrar vehículo
                    </ModalHeader>
            <ModalBody>
              ¿Desea borrar la información de este vehículo?
                    </ModalBody>
            <ModalFooter>
              <Button color="dark" outline onClick={this.toggleModal}>No, Cancelar</Button>
              <Button color="secondary" onClick={this.deleteVehicle}>Sí­, Eliminar</Button>
            </ModalFooter>
          </Modal>
          <Modal isOpen={showAddCustomerModal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>
              Añadir cliente
                    </ModalHeader>
            <ModalBody>
              {customerList && customerList.length > 0 &&
                <Fragment>
                  <Label>Cliente</Label>
                  <Select className="form-control" name="customer_id" options={customerList} onChange={this.customerSelected} />
                </Fragment>
              }
              {!customerList && <Fragment>Cargando lista...</Fragment>}
            </ModalBody>
            <ModalFooter>
              <Button color="dark" outline onClick={() => this.toggleAddCustomerModal()}>Cancelar</Button>
              <Button color="primary" onClick={this.addCustomerVehicle}>Añadir</Button>
            </ModalFooter>
          </Modal>
          <Modal isOpen={showDeleteCustomerModal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>
              Borrar cliente
                    </ModalHeader>
            <ModalBody>
              ¿Desea borrar la relación de <span className="text-primary">{currentCustomer ? currentCustomer.name : ''}</span> con este vehículo?
                    </ModalBody>
            <ModalFooter>
              <Button color="dark" outline onClick={() => this.toggleDeleteCustomerModal(null)}>No, Cancelar</Button>
              <Button color="secondary" onClick={this.deleteCustomerVehicle}>Sí­, Eliminar</Button>
            </ModalFooter>
          </Modal>
        </Fragment>
      );
  }
}