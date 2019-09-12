import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
} from "reactstrap";

export default class DeleteEmployeeModal extends Component {
  constructor(props) {
    super(props);
    this.form = React.createRef();
    this.state = {
      data: {
        code: ''
      }
    }
  }

  validate = () => {
    const values = this.state.data;
    let errors = {};

    if (values.code !== this.props.employee.code) {
      errors.code = "El código del empleado no coincide";
    }

    return errors;
  }

  handleOnChange = (e) => {
    const { data } = this.state;
    
    this.setState({
      data : {
        ...this.state.data,
        [e.target.name]: e.target.value
      }
    })
  }

  onClickDeleteButton = () => {
    document.getElementById("btn-delete").click();
  }

  render() {
    const { data } = this.state;
    const { employee, modalOpen, toggleModal, handleSubmit } = this.props;
    return (
      <Modal
        isOpen={modalOpen}
        toggle={toggleModal}
        backdrop="static"
      >
        <ModalHeader toggle={toggleModal}>
          Eliminar empleado
        </ModalHeader>
        <ModalBody>
          <Formik
            validate={this.validate}
            initialValues={data}
            onSubmit={() => handleSubmit(employee.id)}
            ref={this.form}
          >
            {({ errors, touched }) => (
              <Form autoComplete="off">
                <FormGroup>
                  <p>Para eliminar la información del empleado <span className="text-uppercase text-primary font-weight-bold">{employee.first_name} {employee.last_name}</span> de la base de datos por favor ingrese su código:</p>
                  <Field className="form-control" placeholder="Código del empleado" name="code" value={data.code} onChange={this.handleOnChange} />
                  {errors.code && touched.code && <div className="invalid-feedback d-block">{errors.code}</div>}
                </FormGroup>
                <input type="submit" className="d-none" id="btn-delete"/>
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter>
          <Button color="dark" outline onClick={toggleModal}>Cancelar</Button>
          <Button color="secondary" onClick={() => this.onClickDeleteButton()}>Eliminar</Button>
        </ModalFooter>
      </Modal>
    )
  }
}
