import React, { Component, Fragment } from 'react';
import { Formik, Form, Field } from 'formik';
import { Redirect, NavLink } from 'react-router-dom';
import { Alert, Row, Card, CardBody, FormGroup, Label, Button } from "reactstrap";
import Select from 'react-select'

import { getCustomers } from "../../api/customerApi";
import { createVehicle, updateVehicle } from '../../api/vehicleApi';

import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import { scrollToTop } from '../../helpers/utils';

export default class FormVehicle extends Component {

    constructor(props){
        super(props);

        let data = props.vehicle || { brand:'', plate:'', color:'', customer_id:''}

        this.state = {
            data,
            loading: false,
            error: null,
            redirect: false,
            action: props.vehicle ? 'edit' : 'create',
            customerList: null
        }
    }

    componentDidMount(){
        this.getCustomerList()
    }

    getCustomerList = async () =>{
        try {
            const response = await getCustomers(50, 1, 'name', '');

            let customerList = response.data.map( customer =>{
                return {value: customer.id, label: customer.name, target: {name: 'customer_id'} }
            });

            this.setState({
                customerList: customerList,
                isLoading: false,
            })
        } catch (error) {
            this.setState({
            error,
            isLoading: false
            })
        }
    }

    validate = () => {
        const values = this.state.data;
        let errors = {};

        Object.keys(values).forEach((value) => {
            if(!values[value] && value != 'customer_id'){
                errors[value] = 'Este campo es obligatorio'
            }
        })
        return errors;
    }

    handleSubmit = async () =>{
        const { data, action } = this.state;
        this.setState({
            loading: true,
        })

        if(action == 'create'){
            try{
                await createVehicle(data)
                this.setState({loading: false, redirect: true});
            }catch(error){
                this.setState({ error, loading: false });
                scrollToTop(500);
            }
        }else if(action == 'edit'){
            try{
                await updateVehicle(data.id, data)
                this.setState({loading: false, redirect: true});
            }catch(error){
                this.setState({ error, loading: false });
                scrollToTop(500);
            }
        }
    }

    handleOnChange = (e) => {
        this.setState({
            data : {
            ...this.state.data,
            [e.target.name]: e.target.value
            }
        })
    }

    showErrorMessages = () =>{
        const { error } = this.state;
        if (typeof error === 'string' ) {
            return error + '';
        }

        const messages = Object.values(error);
        return (
            <Fragment>
                <h5>Se presentaron los siguientes problemas: </h5>
                <ul>
                {messages.map((message, index) => {
                    return <li key={index}>{message[0]}</li>
                })}
                </ul>
            </Fragment>
        )
    }

    render() {
        const { data, loading, error, redirect, action, customerList } = this.state;
        if (redirect) {
            return <Redirect to='/vehiculos/lista'/>;
        }
        return(
            <Row className="mb-4">
                <Colxx xxs="12">
                    {loading && <div className="loading" />}
                    {error && (
                        <Alert color="danger" className="mb-4" toggle={this.onDismiss}>
                            {this.showErrorMessages()}
                        </Alert>
                    )}

                    <Card>
                        <CardBody>
                            <Formik
                                initialValues={data}
                                validate={this.validate}
                                onSubmit={this.handleSubmit}
                            >
                                {({ errors, touched }) => (
                                    <Form className="av-tooltip tooltip-label-right" autoComplete="off">
                                        <Row>
                                        <Colxx sm={12}>
                                            <p className="text-right">Los campos marcados con (<span className="req">*</span>) son obligatorios</p>
                                        </Colxx>
                                        <Colxx sm={12}>
                                        <FormGroup>
                                            <Label>Marca <span className="req">*</span></Label>
                                            <Field className="form-control" name="brand" value={data.brand} onChange={this.handleOnChange} />
                                            {errors.brand && touched.brand && <div className="invalid-feedback d-block">{errors.brand}</div>}
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Placa <span className="req">*</span></Label>
                                            <Field className="form-control" name="plate" value={data.plate} onChange={this.handleOnChange} />
                                            {errors.plate && touched.plate && <div className="invalid-feedback d-block">{errors.plate}</div>}
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Color <span className="req">*</span></Label>
                                            <Field className="form-control" name="color" value={data.color} onChange={this.handleOnChange} />
                                            {errors.color && touched.color && <div className="invalid-feedback d-block">{errors.color}</div>}
                                        </FormGroup>
                                        {action == 'create' &&
                                            <FormGroup>
                                                <Label>Cliente</Label>
                                                <Select className="form-control" name="customer_id" options={customerList} value={data.customer_id} onChange={this.handleOnChange}/>
                                                {errors.customer_id && touched.customer_id && <div className="invalid-feedback d-block">{errors.customer_id}</div>}
                                            </FormGroup>
                                        }
                                        </Colxx>
                                        </Row>
                                        <div className="mt-5 text-right">
                                            <NavLink to="/vehiculos/lista" className="btn btn-outline-dark mr-3">Salir</NavLink>
                                            <Button color="primary" type="submit" disabled={loading}>{ action === 'create'? 'Agregar vehículo': 'Guardar cambios'}</Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </CardBody>
                    </Card>
                </Colxx>
            </Row>
        );
    }
}