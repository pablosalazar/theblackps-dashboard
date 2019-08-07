import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
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
    this.validate = this.validate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      data : {
        code: '',
        firstname: '',
        lastname: '',
        document_type: '',
        document_number: '',
        email: '',
        phone: '',
        email: '',
        username: '',
        password: '',
        role: '',
      }
    }
  }

  handleSubmit(values) {
    
    // axios.post('http://localhost/theblackps/public/api/employees', values)
    // .then(function (response) {
    //   console.log(values);
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
  }

  validate(values) {
    let errors = {};
    
    // Object.keys(values).forEach((value) => {
    //   if (values[value] === '' && value !== 'password_confirmation') {
    //     errors[value] = 'Este campo es obligatorio';
    //   }
    // });

    // if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    //   errors.email = 'Escribe una dirección de correo electrónico valida';
    // }

    // if (values.password !== values.password_confirmation) {
    //   errors.password_confirmation = 'El password no coincide';
    // }

    return errors;
  }

  handleOnChange = (e) => {
    
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
    
    first_firstname = firstname.trim().split(" ")[0];
    second_firstname = firstname.trim().split(" ")[1];
   
    first_lastname = lastname.trim().split(" ")[0];
    second_lastname = lastname.trim().split(" ")[1];
    
    
    let username = firstname.substring(0, 2) + first_lastname.substring(0, 2);
    if (second_lastname) {
      username += second_lastname.substring(0, 2);
    } 

    username += code;
    username = username.toLowerCase();

    
    this.setState({
      data: {
        ...data,
        username,
      }
    })
  }

  render() {
    const { data } = this.state;
    return (
      <Row className="mb-4">
        <Colxx xxs="12">
          <Alert color="danger" className="rounded mb-4">
            Corrige los siguientes campos:
          </Alert>
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
                          <Label>Username</Label>
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
                            <option value="Empleado">Empleado</option>
                            <option value="Admin">Admin</option>
                          </Field>
                          {errors.role && touched.role && <div className="invalid-feedback d-block">{errors.role}</div>}
                        </FormGroup>
                       
                        {/* <div className="alert alert-info">
                          Debes ingresar el codigo el nombre y el apellido
                        </div> */}
                        <div className="text-right">
                          <Button color="info" onClick={this.generateCredentials}>Generar credenciales</Button>
                        </div>
                      </Colxx>
                    </Row>
                    <div className="mt-5 text-right">
                      <Button color="primary" type="submit">Guardar</Button>
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