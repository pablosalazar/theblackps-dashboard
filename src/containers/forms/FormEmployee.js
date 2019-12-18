import React, { Component, Fragment } from 'react';
import { Formik, Form, Field } from 'formik';
import { Redirect, NavLink } from 'react-router-dom';
import Resizer from 'react-image-file-resizer';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import { RESOURCE_URL } from "../../constants/defaultValues";

import { scrollToTop } from '../../helpers/utils';
import avatar from '../../assets/avatar.png';

import { createEmployee, updateEmployee } from '../../api/employeeApi';

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
    let data = {
      photo: '',
      code: '',
      first_name: '',
      last_name: '',
      gender: '',
      birthdate: '',
      document_type: '',
      document_number: '',
      nacionality: '',
      email: '',
      phone: '',
      address: '',
      username: '',
      password: '',
      job_title: '',
      active: true,
      contact_name: '',
      contact_relationship: '',
      contact_number: '',
    };
    
    if (props.employee) {
      data = props.employee;
    }
    
    this.state = {
      data,
      currentImage: props.employee ? `${data.photo}` : avatar,
      imageToShow: props.employee ? `${data.photo}` : avatar,
      loading: false,
      error: null,
      error_generate_credentials: false,
      redirect: false,
      action: props.employee? 'edit': 'create',
      rotate: 90,
    }
  }

  handleSubmit = async () => {
    const { data, action } = this.state;
    this.setState({
      loading: true,
    })

    if (action === 'create') {
      try {
        await createEmployee(data);
        this.setState({loading: false, redirect: true});
      } catch (error) {
        this.setState({ error, loading: false });
        scrollToTop(500);
      }

    } else if (action === 'edit') {
      try {
        await updateEmployee(data.id, data);
        this.setState({loading: false, redirect: true});
      } catch (error) {
        this.setState({ error, loading: false });
        scrollToTop(500);
      }
    }
  }

  

  validate = () => {
    const values = this.state.data;
    let errors = {};
    
    Object.keys(values).forEach((value) => {
      if (values[value] === '' && 
        value !== 'phone' && 
        value !== 'address' && 
        value !== 'photo' &&
        value !== 'contact_name' &&
        value !== 'contact_relationship' &&
        value !== 'contact_number'
      ) {
        errors[value] = 'Este campo es obligatorio';
      }
    });

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Escribe una dirección de correo electrónico valida';
    }
    
    if (!/^[0-9]+$/i.test(values.document_number)) {
      errors.document_number = "Ingresa solo números";
    }

    return errors;
  }

  handleOnChange = (e) => {
    const { data, error_generate_credentials } = this.state;
    const { first_name, last_name, document_number, code } = data;

    if (error_generate_credentials && first_name && last_name && document_number && code) {
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
    const { first_name, last_name, document_number, code } = data;
    let first_firstname, second_firstname, first_lastname, second_lastname;

    if(!first_name || !last_name || !document_number || !code) {
      this.setState({
        error_generate_credentials: true,
      })
      return null;
    }
    
    first_firstname = first_name.trim().split(" ")[0];
    second_firstname = first_name.trim().split(" ")[1];
   
    first_lastname = last_name.trim().split(" ")[0];
    second_lastname = last_name.trim().split(" ")[1];
    
    // Create username
    let username = first_name.substring(0, 2) + first_lastname.substring(0, 2);
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
          })}
        </ul>
      </Fragment>
    )
  }

  onDismiss =()=> {
    this.setState({ error: null });
  }

  resizeFile = (file, rotate = 0) => {
    if (rotate === 360 ) rotate = 0;
    const { data } = this.state;
    Resizer.imageFileResizer(
      file,
      300,
      300,
      'jpg',
      100,
      rotate,
      uri => {
        this.setState({
          data: {
            ...data,
            photo: uri,
            
          },
          rotate,
          imageToShow: URL.createObjectURL(uri)
        })
      },
      'blob'
    );
  }

  handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      this.resizeFile(file);
    }
  }

  handleChangeDate = date => {
    const { data } = this.state;
    this.setState({
      data: {
        ...data,
        birthdate: moment(date).format('L'),
      } 
    });
  };

  openFileWindow = () => {
    document.getElementById('image-file').click();
  }

  clearImage = () => {
    const { data } = this.state;
    this.setState({
      data: {
        ...data,
        photo: '',
      },
      imageToShow: this.state.currentImage
    })
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
                  <Form className="employee-form av-tooltip tooltip-label-right" autoComplete="off">
                    <Row>
                      <Colxx sm={12}>
                        <p className="text-right">Los campos marcados con (<span className="req">*</span>) son obligatorios</p>
                      </Colxx>             
                      <Colxx sm={4}>

                        <h6 className="mb-4 text-primary">Datos personales</h6>
                        <FormGroup>
                          <Label>Nombre <span className="req">*</span></Label>
                          <Field className="form-control" name="first_name" value={data.first_name} onChange={this.handleOnChange} />
                          {errors.first_name && touched.first_name && <div className="invalid-feedback d-block">{errors.first_name}</div>}
                        </FormGroup>

                        <FormGroup>
                          <Label>Apellidos <span className="req">*</span></Label>
                          <Field className="form-control" name="last_name" value={data.last_name} onChange={this.handleOnChange} />
                          {errors.last_name && touched.last_name && <div className="invalid-feedback d-block">{errors.last_name}</div>}
                        </FormGroup>

                        <FormGroup>
                          <Label>Género <span className="req">*</span></Label>
                          <Field className="form-control" component="select" name="gender" value={data.gender} onChange={this.handleOnChange}>
                            <option value="">-- Seleccione una opción --</option>
                            <option value="Hombre">Hombre</option>
                            <option value="Mujer">Mujer</option>
                          </Field>
                          {errors.gender && touched.gender && <div className="invalid-feedback d-block">{errors.gender}</div>}
                        </FormGroup>

                        <FormGroup>
                          <Label>Fecha de nacimiento <span className="req">*</span></Label>
                          <DatePicker
                            selected={data.birthdate ? moment(data.birthdate) : null}
                            name="birthdate"
                            onChange={this.handleChangeDate}
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            maxDate={moment()}
                            placeholderText={"DD/MM/YYYY"}
                          />
                          {errors.birthdate && touched.birthdate && <div className="invalid-feedback d-block">{errors.birthdate}</div>}
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
                          <Label>Nacionalidad <span className="req">*</span></Label>
                          <Field className="form-control" name="nacionality" value={data.nacionality} onChange={this.handleOnChange} />
                          {errors.nacionality && touched.nacionality && <div className="invalid-feedback d-block">{errors.nacionality}</div>}
                        </FormGroup>
                        
                        <h6 className="mb-4 text-primary">Datos de contacto</h6>
                        <FormGroup>
                            <Label>Email <span className="req">*</span></Label>
                            <Field className="form-control" name="email" value={data.email} onChange={this.handleOnChange} />
                            {errors.email && touched.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                        </FormGroup>

                        <FormGroup>
                          <Label>Teléfono</Label>
                          <Field className="form-control" name="phone" value={data.phone} onChange={this.handleOnChange} />
                          {errors.phone && touched.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
                        </FormGroup>

                        <FormGroup>
                          <Label>Dirección</Label>
                          <Field className="form-control" name="address" value={data.address} onChange={this.handleOnChange} />
                          {errors.address && touched.address && <div className="invalid-feedback d-block">{errors.address}</div>}
                        </FormGroup>

                      </Colxx>

                      <Colxx sm={4}>
                        <h6 className="mb-4 text-primary">Datos del empleado</h6>
                        <FormGroup>
                          <Label>Código de empleado <span className="req">*</span></Label>
                          <Field className="form-control" name="code" value={data.code} onChange={this.handleOnChange}/>
                          {errors.code && touched.code && <div className="invalid-feedback d-block">{errors.code}</div>}
                        </FormGroup>

                        <FormGroup>
                          <Label>Cargo <span className="req">*</span></Label>
                          <Field className="form-control" component="select" name="job_title" value={data.job_title} onChange={this.handleOnChange}>
                            <option value="">-- Seleccione una opción --</option>
                            <option value="Administrativo">Administrativo</option>
                            <option value="Analista">Analista</option>
                            <option value="Jefe de operaciones">Jefe de operaciones</option>
                            <option value="Coordinador logístico">Coordinador logístico </option>
                            <option value="Supervisor">Supervisor</option>
                            <option value="Líder de punto">Líder de punto</option>
                            <option value="Operario">Operario</option>
                          </Field>
                          {errors.job_title && touched.job_title && <div className="invalid-feedback d-block">{errors.job_title}</div>}
                        </FormGroup>
                        <br/>

                        <h6 className="mb-4 text-primary">Datos de la cuenta</h6>
                        <FormGroup>
                          <Label>Usuario <span className="req">*</span></Label>
                          <Field className="form-control" name="username" value={data.username} onChange={this.handleOnChange} />
                          {errors.username && touched.username && <div className="invalid-feedback d-block">{errors.username}</div>}
                        </FormGroup>

                        <FormGroup>
                          <Label>Contraseña <span className="req">*</span></Label>
                          <Field className="form-control" name="password" value={data.password} onChange={this.handleOnChange} />
                          {errors.password && touched.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                        </FormGroup>
                        {error_generate_credentials &&
                          <div className="alert alert-info">
                            Para generar el usuario y la contraseña primero debes ingresar el código, nombre, apellidos y número de documento del empleado.
                          </div>
                        }
                        <div className="text-right">
                          <Button outline color="dark" onClick={this.generateCredentials} disabled={loading}>Generar credenciales</Button>
                        </div>
                        <br/>
                        <br/>
                        <FormGroup>
                          <h6 className="mb-4 text-primary">Estado de la cuenta</h6>
                          <div className="d-flex">
                            <Switch
                              className="custom-switch custom-switch-primary-inverse"
                              checked={Boolean(data.active)}
                              onChange={() => {
                                this.setState({ data: { ...data, active: !data.active} });
                              }}
                            />
                            { Boolean(data.active) ? <p className="mt-1 text-primary mt-1">ACTIVO</p> : <p className="mt-1 text-muted">INACTIVO</p>}
                          </div>
                        </FormGroup>
                      </Colxx>

                      <Colxx sm={4}>
                        <h6 className="mb-5 text-primary">Foto</h6>
                        <p>Elegir foto</p>
                        <div className="avatar mb-2 mr-4">
                          <figure className="image-avatar" style={{backgroundImage: `url(${this.state.imageToShow})`}}></figure>
                        </div>
                        <button type="button" className="btn btn-sm btn-warning mr-2" onClick={this.openFileWindow}>Cambiar</button>
                        {this.state.data.photo &&
                          <Fragment>
                            <button type="button" className="btn btn-sm btn-outline-dark mr-2" onClick={this.clearImage}>Quitar</button>
                            <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => this.resizeFile(this.state.data.photo, this.state.rotate + 90)}><i className="iconsminds-rotation" /></button>
                          </Fragment>                         
                        }
                        <input type="file" id="image-file" className="form-control d-none" name="photo" onChange={this.handleFileChange}/>

                        
                        <h6 className="mb-4 text-primary mt-5">Referencia personal</h6>
                        
                        <FormGroup>
                          <Label>Nombre </Label>
                          <Field className="form-control" name="contact_name" value={data.contact_name} onChange={this.handleOnChange} />
                          {errors.contact_name && touched.contact_name && <div className="invalid-feedback d-block">{errors.contact_name}</div>}
                        </FormGroup>

                        <FormGroup>
                          <Label>Parentesco</Label>
                          <Field className="form-control" name="contact_relationship" value={data.contact_relationship} onChange={this.handleOnChange} />
                          {errors.contact_relationship && touched.contact_relationship && <div className="invalid-feedback d-block">{errors.contact_relationship}</div>}
                        </FormGroup>

                        <FormGroup>
                          <Label>Número de teléfono</Label>
                          <Field className="form-control" name="contact_number" value={data.contact_number} onChange={this.handleOnChange} />
                          {errors.contact_number && touched.contact_number && <div className="invalid-feedback d-block">{errors.contact_number}</div>}
                        </FormGroup>
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