import React, { Component, Fragment } from 'react';
import { Formik, Form, Field } from 'formik';
import { Redirect, NavLink, Link } from 'react-router-dom';
import axios from "axios";

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

class FormEmployee extends Component {
  constructor(props) {
    
    super(props);
    let data;
    if (props.employee) {
      data = props.employee;
    }
    else {
      data = {
        code: '',
        firstname: '',
        lastname: '',
        document_type: '',
        document_number: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        role: '',
      }
    }
    
    this.state = {
      data,
      loading: false,
      error: null,
      error_generate_credentials: false,
      redirect: false,
      action: props.employee? 'edit': 'create',
    }
  }

  handleSubmit = () => {
    const { data, action } = this.state;

    this.setState({
      loading: true,
    })

    if (action === 'create') {
      axios.post('http://localhost/theblackps/public/api/employees', data)
      .then((response) => {
        this.setState({loading: false, redirect:true});
      })
      .catch((error) => {
        this.handleError(error);
      });

    } else if (action === 'edit') {
      axios.put('http://localhost/theblackps/public/api/employees/' + data.id, data)
      .then((response) => {
        this.setState({loading: false, redirect:true});
      })
      .catch((error) => {
        this.handleError(error);
      });
    }
  }

  handleError = (error) => {
    this.setState({
      error: error.response ? error.response.data.error : String(error),
      loading: false,
    });
    window.scrollTo(100, 0);
  }

  validate = () => {
    const values = this.state.data;
    let errors = {};
    
    Object.keys(values).forEach((value) => {
      if (values[value] === '') {
        errors[value] = 'Este campo es obligatorio';
      }
    });

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Escribe una dirección de correo electrónico valida';
    }

    if (values.document_number && !Number.isInteger(parseInt(values.document_number, 10))) {
      errors.document_number = "Ingresa solo números";
    }
    return errors;
  }

  handleOnChange = (e) => {
    const { data, error_generate_credentials } = this.state;
    const { firstname, lastname, document_number, code } = data;

    if(error_generate_credentials && firstname && lastname && document_number && code) {
      this.setState({
        error_generate_credentials: false,
      })
    }

    this.setState({
      data : {
        ...this.state.data,
        [e.target.name]: e.target.value
      }
    })
  }

  generateCredentials = () => {
    const { data } = this.state;
    const { firstname, lastname, document_number, code } = data;
    let first_firstname, second_firstname, first_lastname, second_lastname;

    if(!firstname || !lastname || !document_number || !code) {
      this.setState({
        error_generate_credentials: true,
      })
      return null;
    }
    
    first_firstname = firstname.trim().split(" ")[0];
    second_firstname = firstname.trim().split(" ")[1];
   
    first_lastname = lastname.trim().split(" ")[0];
    second_lastname = lastname.trim().split(" ")[1];
    
    // Create username
    let username = firstname.substring(0, 2) + first_lastname.substring(0, 2);
    if (second_lastname) {
      username += second_lastname.substring(0, 2);
    } 

    username += code;
    username = username.toLowerCase();

    // Create password
    let initialsName = first_firstname.substring(0, 1);
    if (second_firstname) {
      initialsName += second_firstname.substring(0, 1);
    }
    initialsName += first_lastname.substring(0, 1);
    if (second_lastname) {
      initialsName += second_lastname.substring(0, 1);
    }
    const password = document_number + initialsName.toUpperCase();
   
    this.setState({
      data: {
        ...data,
        username,
        password,
      }
    })
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
          })

          }
        </ul>
      </Fragment>
    )
  }

  onDismiss =()=> {
    this.setState({ error: null });
  }

  routeChange = () => {
    let path = `newPath`;
    this.props.history.push(path);
  }

  render() {
    const { data, loading, error, error_generate_credentials, redirect, action } = this.state;
    if (redirect) {
      return <Redirect to='/empleados/lista'/>;
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
                      <Colxx sm={6}>
                        <h6 className="mb-4">Datos personales</h6>
                        <FormGroup>
                          <Label>Código</Label>
                          <Field className="form-control" name="code" value={data.code} onChange={this.handleOnChange}/>
                          {errors.code && touched.code && <div className="invalid-feedback d-block">{errors.code}</div>}
                        </FormGroup>

                        <FormGroup>
                          <Label>Nombre</Label>
                          <Field className="form-control" name="firstname" value={data.firstname} onChange={this.handleOnChange} />
                          {errors.firstname && touched.firstname && <div className="invalid-feedback d-block">{errors.firstname}</div>}
                        </FormGroup>

                        <FormGroup>
                          <Label>Apellidos</Label>
                          <Field className="form-control" name="lastname" value={data.lastname} onChange={this.handleOnChange} />
                          {errors.lastname && touched.lastname && <div className="invalid-feedback d-block">{errors.lastname}</div>}
                        </FormGroup>

                        <FormGroup>
                          <Label>Tipo de documento</Label>
                          <Field className="form-control" component="select" name="document_type" value={data.document_type} onChange={this.handleOnChange}>
                            <option value="">-- Seleccione una opción --</option>
                            <option value="CC">CC</option>
                            <option value="TI">TI</option>
                            <option value="CE">CE</option>
                          </Field>
                          {errors.document_type && touched.document_type && <div className="invalid-feedback d-block">{errors.document_type}</div>}
                        </FormGroup>

                        <FormGroup>
                          <Label>Número de documento</Label>
                          <Field className="form-control" name="document_number" value={data.document_number} onChange={this.handleOnChange} />
                          {errors.document_number && touched.document_number && <div className="invalid-feedback d-block">{errors.document_number}</div>}
                        </FormGroup>
                        
                        <FormGroup>
                            <Label>Email</Label>
                            <Field className="form-control" name="email" value={data.email} onChange={this.handleOnChange} />
                            {errors.email && touched.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                        </FormGroup>

                        <FormGroup>
                          <Label>Teléfono</Label>
                          <Field className="form-control" name="phone" value={data.phone} onChange={this.handleOnChange} />
                          {errors.phone && touched.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
                        </FormGroup>
                      </Colxx>
                      <Colxx sm={6}>
                        <h6 className="mb-4">Datos de la cuenta</h6>
                        <FormGroup>
                          <Label>Usuario</Label>
                          <Field className="form-control" name="username" value={data.username} onChange={this.handleOnChange} />
                          {errors.username && touched.username && <div className="invalid-feedback d-block">{errors.username}</div>}
                        </FormGroup>

                        <FormGroup>
                          <Label>Contraseña</Label>
                          <Field className="form-control" name="password" value={data.password} onChange={this.handleOnChange} />
                          {errors.password && touched.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                        </FormGroup>

                        <FormGroup>
                          <Label>Rol</Label>
                          <Field className="form-control" component="select" name="role" value={data.role} onChange={this.handleOnChange}>
                            <option value="">-- Seleccione una opción --</option>
                            <option value="EMPLEADO">Empleado</option>
                            <option value="ADMIN">Admin</option>
                          </Field>
                          {errors.role && touched.role && <div className="invalid-feedback d-block">{errors.role}</div>}
                        </FormGroup>

                        {error_generate_credentials &&
                          <div className="alert alert-info">
                            Para generar el usuario y la contraseña primero debes ingresar el código, nombre, apellidos y número de documento del empleado.
                          </div>
                        }
                        <div className="text-right">
                          <Button outline color="dark" onClick={this.generateCredentials} disabled={loading}>Generar credenciales</Button>
                        </div>
                      </Colxx>
                    </Row>
                    <div className="mt-5 text-right">
                      <NavLink to="/empleados/lista" className="btn btn-outline-dark mr-3">Salir </NavLink>
                      <Button color="primary" type="submit" disabled={loading}>{action==='create'? 'Agregar empleado': 'Guardar cambios'}</Button>
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

export default FormEmployee;