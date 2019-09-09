import React, { Component, Fragment } from 'react';
import { Formik, Form, Field } from 'formik';
import { Redirect, NavLink, Link } from 'react-router-dom';
import Resizer from 'react-image-file-resizer';
import Switch from "rc-switch";
import { RESOURCE_URL } from "../../constants/defaultValues";
import "rc-switch/assets/index.css";
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
    // let data = {
    // };
    let data = {
      photo: '',
      code: '1',
      first_name: 'juan pablo',
      last_name: 'salazar restrepo',
      document_type: 'CC',
      document_number: '1061701570',
      email: 'example@example.com',
      phone: '',
      address: '',
      address: '',
      username: '',
      password: '',
      role: 'EMPLEADO',
      active: true
    }
    
    if (props.employee) {
      data = props.employee;
    }
    
    this.state = {
      data,
      currentImage: props.employee ? `${RESOURCE_URL}/img/employees/${data.image}` : avatar,
      imageToShow: props.employee ? `${RESOURCE_URL}/img/employees/${data.image}` : avatar,
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
        this.setState({loading: false, redirect:true});
      } catch (error) {
        this.setState({ error, loading: false });
        scrollToTop(500);
      }

    } else if (action === 'edit') {
      try {
        await updateEmployee(data.id, data);
        this.setState({loading: false, redirect:true});
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
      if (values[value] === '' && value !== 'phone' && value !== 'address' && value !== 'photo') {
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

    if(error_generate_credentials && first_name && last_name && document_number && code) {
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
                  <Form className="av-tooltip tooltip-label-right" autoComplete="off">
                    <Row>
                      <Colxx sm={12}>
                        <p className="text-right">Los campos marcados con (<span className="req">*</span>) son obligatorios</p>
                      </Colxx>             
                      <Colxx sm={4}>
                        <h6 className="mb-4 text-primary">Datos personales</h6>
                        <FormGroup>
                          <Label>Código <span className="req">*</span></Label>
                          <Field className="form-control" name="code" value={data.code} onChange={this.handleOnChange}/>
                          {errors.code && touched.code && <div className="invalid-feedback d-block">{errors.code}</div>}
                        </FormGroup>

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
                        <hr/>
                        <FormGroup>
                          <Label>Rol <span className="req">*</span></Label>
                          <Field className="form-control" component="select" name="role" value={data.role} onChange={this.handleOnChange}>
                            <option value="">-- Seleccione una opción --</option>
                            <option value="EMPLEADO">Empleado</option>
                            <option value="ADMIN">Admin</option>
                          </Field>
                          {errors.role && touched.role && <div className="invalid-feedback d-block">{errors.role}</div>}
                        </FormGroup>
                        <br/>
                        <FormGroup>
                          <label htmlFor="switch-active">Estado del empleado</label>
                          <Switch
                            className="custom-switch custom-switch-primary-inverse"
                            checked={Boolean(data.active)}
                            onChange={() => {
                              this.setState({ data: { ...data, active: !data.active} });
                            }}
                          />
                        </FormGroup>
                        
                      </Colxx>

                      <Colxx sm={4}>
                        <h6 className="mb-5 text-primary">Imagen</h6>
                        <p>Elegir imagen</p>
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