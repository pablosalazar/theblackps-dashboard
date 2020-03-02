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
  } from "reactstrap";

import { getVehicle, deleteVehicle } from "../../../api/vehicleApi";

export default class EditVehicle extends Component {
    constructor(props) {
        super(props);
        this.state = {
          vehicle: {},
          customers: [],
          customerName: '',
          isLoading: true,
          error: null,
          modalOpen: false,
          showCustomerModal: false,
          redirect: false,
        }
    }

    componentDidMount(){
        const vehicleId = this.props.match.params.vehicleId;
        this.getVehicle(vehicleId);
    }
    getVehicle = async(vehicleId) =>{
        try{
            const vehicle = await getVehicle(vehicleId);
            this.setState({
              vehicle,
              isLoading: false,
            })
        }catch(error) {
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
    deleteCustomerVehicle = () =>{
        console.log("relation deleted")
        this.setState({
            customerName: '',
            showCustomerModal: !this.state.showCustomerModal
        })
    }
    toggleModal = () => {
        this.setState({
          modalOpen: !this.state.modalOpen
        });
    }
    toggleCustomerModal = (customerName) =>{
        this.setState({
            customerName: customerName,
            showCustomerModal: !this.state.showCustomerModal
        })
    }
    render() {
        const { vehicle, isLoading, customerName, error, modalOpen, showCustomerModal, redirect } = this.state;
        if (redirect) {
            return <Redirect to='/vehiculos/lista'/>;
        }
        return isLoading ? (
            <div className="loading" />
        ) : (
            <Fragment>
            <Row>
            <Colxx xxs="12">
                <Breadcrumb heading="Nuevo vehículo" match={this.props.match} />
                <div className="text-zero top-right-button-container">
                    <button type="button" className="btn btn-sm btn-secondary mr-5" onClick={this.toggleModal}>Eliminar vehículo </button>
                    <NavLink to="/vehiculos/lista" className="btn btn-sm btn-outline-dark mr-3">Salir </NavLink>
                </div>
                <Separator className="mb-5" />
            </Colxx>
            </Row>
            <Row>
                <Colxx xs="6" md="6" className="mb-3">
                    <FormVehicle vehicle={vehicle}/>
                </Colxx>
                <Colxx xs="6" md="6" className="mb-3">
                    <Card>
                        <CardBody>
                            <h6 className="mb-4 text-primary">Clientes asociados al vehículo</h6>
                            <div className="dashboard-list-with-user">
                                {vehicle.customers.map( (customer, index) => {
                                    return (
                                        <div key={index} className="d-flex flex-row mb-3 pb-3 border-bottom">
                                         <Avatar name={customer.name} size="30" round={true}/>
                                          <div className="pl-3 pr-2">
                                              <p className="font-weight-medium mb-0 ">{customer.name}</p>
                                              <p className="text-muted mb-0 text-small">
                                                {customer.updated_at} | <NavLink to="#" onClick={() => this.toggleCustomerModal(customer.name)} className=" btn-link mr-3">Eliminar </NavLink>
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
            <Modal isOpen={showCustomerModal} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle}>
                    Borrar vehículo
                </ModalHeader>
                <ModalBody>
                    ¿Desea borrar la relación de <span className="text-primary">{customerName}</span> con este vehículo?
                </ModalBody>
                <ModalFooter>
                    <Button color="dark" outline onClick={() => this.toggleCustomerModal('')}>No, Cancelar</Button>
                    <Button color="secondary" onClick={this.deleteCustomerVehicle}>Sí­, Eliminar</Button>
                </ModalFooter>
            </Modal>
        </Fragment>
        );
    }
}