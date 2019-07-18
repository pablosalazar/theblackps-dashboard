import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import error from "./views/error";

class App extends Component {
  render() {
    return (
      <div className="h-100">
        <React.Fragment>
          <Router>
            <Switch>
              <Route path="/error" exact component={error} />
              <Redirect to="/error" />
            </Switch>
          </Router>
        </React.Fragment>  
      </div>
    )
  }
}

export default App;
