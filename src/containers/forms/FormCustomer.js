import React, { Component, Fragment } from 'react';
import { Formik, Form, Field } from 'formik';
import { Redirect, NavLink } from 'react-router-dom';
import { scrollToTop } from '../../helpers/utils';
import {
  Alert,
  Row,
  Card,
  CardBody,
  FormGroup,
  Label,
  Button
} from "reactstrap";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";

import { createCustomer, updateCustomer } from '../../api/customerApi';

export default class FormCustomer extends Component {

  constructor(props) {
    
    super(props);
    let data = {
      name: '',
      document_type: '',
      document_number: '',
      phone: '',
    };
    
    if (props.customer) {
      data = props.customer;
    }
    
    this.state = {
      data,
      loading: false,
      error: null,
      redirect: false,
      action: props.customer? 'edit': 'create',
    }
  }

  handleSubmit = async () => {
    const { data, action } = this.state;
    this.setState({
      loading: true,
    })

    if (action === 'create') {
      try {
        await createCustomer(data);
        this.setState({loading: false, redirect:true});
      } catch (error) {
        this.setState({ error, loading: false });
        scrollToTop(500);
      }

    } else if (action === 'edit') {
      try {
        await updateCustomer(data.id, data);
        this.setState({loading: false, redirect:true});
        
      } catch (error) {
        this.setState({ error, loading: false });
        console.log(error);
        scrollToTop(500);
      }
    }
  }

  

  validate = () => {
    const values = this.state.data;
    let errors = {};
    
    Object.keys(values).forEach((value) => {
      if (values[value] === '' && value !== 'phone' && value !== 'address') {
        errors[value] = 'Este campo es obligatorio';
      }
    });
    
    if (!/^[0-9]+$/i.test(values.document_number)) {
      errors.document_number = "Ingresa solo números";
    }

    return errors;
  }

  showErrorMessages = () => {
    const { error } = this.state;
    if (typeof error === 'string' ) {
      return error + '';
    }

    const messages = Object.values(error);
    return (
      <Fragment>
        <h5>Se presentó un problema con los siguientes campos: </h5>
        <ul>
          {messages.map((message, index) => {
            return <li key={index}>{message[0]}</li>
          })}
        </ul>
      </Fragment>
    )
  }

  handleOnChange = (e) => {
    this.setState({
      data : {
        ...this.state.data,
        [e.target.name]: e.target.value
      }
    })
  }

  render() {
    const { data, loading, error, redirect, action } = this.state;
    if (redirect) {
      return <Redirect to='/clientes/lista'/>;
    }
    return (
      <Row className="mb-4">
        <Colxx xxs="12">
          {loading && <div className="loading" />}
          {error && 
            <Alert 
              color="danger" 
              className="mb-4"
              toggle={this.onDismiss}
            >
              {this.showErrorMessages()}
            </Alert>}
          <Card>
            <CardBody>
              <Formik
                validate={this.validate}
                initialValues={data}
                onSubmit={this.handleSubmit}
              >
                {({ errors, touched }) => (
                  <Form className="av-tooltip tooltip-label-right" autoComplete="off">
                    <Row>
                      <Colxx sm={12}>
                        <p className="text-right">Los campos marcados con (<span className="req">*</span>) son obligatorios</p>
                      </Colxx>             
                      <Colxx sm={12}>
                        <h6 className="mb-4 text-primary">Datos personales</h6>

                        <FormGroup>
                          <Label>Nombre <span className="req">*</span></Label>
                          <Field className="form-control" name="name" value={data.name} onChange={this.handleOnChange} />
                          {errors.name && touched.name && <div className="invalid-feedback d-block">{errors.name}</div>}
                        </FormGroup>

                        <FormGroup>
                          <Label>Tipo de documento <span className="req">*</span></Label>
                          <Field className="form-control" component="select" name="document_type" value={data.document_type} onChange={this.handleOnChange}>
                            <option value="">-- Seleccione una opción --</option>
                            <option value="CC">CC</option>
                            <option value="TI">TI</option>
                            <option value="CE">CE</option>
                          </Field>
                          {errors.document_type && touched.document_type && <div className="invalid-feedback d-block">{errors.document_type}</div>}
                        </FormGroup>

                        <FormGroup>
                          <Label>Número de documento <span className="req">*</span></Label>
                          <Field className="form-control" name="document_number" value={data.document_number} onChange={this.handleOnChange} />
                          {errors.document_number && touched.document_number && <div className="invalid-feedback d-block">{errors.document_number}</div>}
                        </FormGroup>

                        <FormGroup>
                          <Label>Teléfono</Label>
                          <Field className="form-control" name="phone" value={data.phone} onChange={this.handleOnChange} />
                          {errors.phone && touched.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
                        </FormGroup>

                      </Colxx>                      
                    </Row>
                    <div className="mt-5 text-right">
                      <NavLink to="/clientes/lista" className="btn btn-outline-dark mr-3">Salir </NavLink>
                      <Button color="primary" type="submit" disabled={loading}>{ action === 'create'? 'Agregar cliente': 'Guardar cambios'}</Button>
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
