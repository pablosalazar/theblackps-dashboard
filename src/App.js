import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import main from "./views";
import app from "./views/app";
import Employees from "./views/app/employees";
import Auth from './views/auth';
import error from "./views/error";

const AuthRoute = ({ component: Component, authUser, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      // authUser ? (
        <Component {...props} />
      // ) : (
      //   <Redirect
      //     to={{
      //       pathname: "/auth/login",
      //       state: { from: props.location }
      //     }}
      //   />
      // )
    }
  />
);


class App extends Component {
  
  render() {
    const { loginUser } = this.props;

    return (
      <div className="h-100">
        <React.Fragment>
          <Router>
            <Switch>
              <AuthRoute path="/app" authUser={loginUser} component={app} />
              <Route path="/empleados" component={Employees} />
              <Route path="/auth" component={Auth} />
              <Route path="/error" exact component={error} />
              <Route path="/" exact component={main} />
              {/* <Redirect to="/error" /> */}
            </Switch>
          </Router>
        </React.Fragment>  
      </div>
    )
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user: loginUser } = authUser;
  return { loginUser };
};
const mapActionsToProps = {};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(App);

