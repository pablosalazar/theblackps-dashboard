import React, { Component } from "react";
import { Row, Card, CardTitle, Form, Label, Input, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

import { loginUser } from "../../redux/actions";
import { Colxx } from "../../components/common/CustomBootstrap";

class Login extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      login: "baca.carmen",
      password: "secret",
      error: null
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onUserLogin = async () => {
    this.setState({ isLoading: true, error: null});
    
    if (this.state.login !== "" && this.state.password !== "") {
      
      
        const user = await this.props.loginUser(this.state, this.props.history);
        
   
    } else {
      this.setState({error: "Ingresa los campos para iniciar sesion"});
    }
  }

  render() {
    const { isLoading, error } = this.state;
    
    return (
      <Row className="h-100">
        
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="position-relative image-side ">
              <p className="text-white h2">THE BLACK PARKING SERVICE</p>
              <p className="white mb-0">
                Por favor ingresa tus datos de acceso.
                <br />
              </p>
            </div>
            <div className="form-side">
              <NavLink to={`/`} className="white">
                <span className="logo-single" />
              </NavLink>
              {error && <div className="alert alert-warning">
                {error}
              </div>}

              {this.props.error && <div className="alert alert-danger">
                {this.props.error}
              </div>}

              {this.props.loading && <div className="loading" />}
              <CardTitle className="mb-4">
                Iniciar sesión
              </CardTitle>
              <Form>
              
                <Label className="form-group has-float-label mb-4">
                  <Input type="text" name="login" value={this.state.login} onChange={this.handleChange} />
                  <span>Ingresa tu usuario o correo electrónico</span>
                </Label>
                <Label className="form-group has-float-label mb-4">
                  <Input type="password" name="password" autoComplete="off" value={this.state.password} onChange={this.handleChange}/>
                  <span>Contraseña</span>
                </Label>
                <div className="d-flex justify-content-between align-items-center">
                  <NavLink to={`/forgot-password`}>
                    ¿Olvido su contraseña?
                  </NavLink>
                  <Button
                    color="primary"
                    className="btn-shadow"
                    size="lg"
                    onClick={() => this.onUserLogin()}
                    disabled={this.props.loading}
                  >
                    ENTRAR
                  </Button>
                  
                </div>
              </Form>
            </div>
          </Card>
        </Colxx>
      </Row>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user, loading, error } = authUser;
  return { user, loading, error };
};

export default connect(mapStateToProps, { loginUser })(Login);
