import React, { Component, Fragment } from "react";

class BlankPage extends Component {
  render() {
    console.log("Entre", process.env.REACT_APP_API_URL);
    return (
      <Fragment>
        <h1 >aqui : {process.env.REACT_APP_API_URL}</h1>
      </Fragment>
    );
  }
}

export default BlankPage;