import React, { Component, Fragment } from "react";

class BlankPage extends Component {
  render() {
    return (
      <Fragment>
        <h1 >aqui : {process.env.REACT_APP_API_URL}</h1>
      </Fragment>
    );
  }
}

export default BlankPage;