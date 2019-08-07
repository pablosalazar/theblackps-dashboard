import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";

import axios from "axios";

import DataListView from "../../../containers/pages/DataListView";
import ListPageHeading from "../../../containers/pages/ListPageHeading";

function collect(props) {
  return { data: props.data };
}

class ListEmployees extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoading: false
    }
  }

  componentDidMount() {
    this.getDataList();
  }

  getDataList() {
    axios.get('http://localhost/theblackps/public/api/employees')
      .then(res => {
        return res.data;
      })
      .then(data => {
        this.setState({
          items: data.data,
          isLoading: true
        });
      });
  }

  render() {
    const { match } = this.props;
  
    return !this.state.isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <ListPageHeading 
            heading='Lista de empleados'
            match={match}
            newUrl='nuevo'

          />
          <Row>
            {this.state.items.map(item => (
              <DataListView 
                key={item.id}
                item={item}
              />
            ))}{" "}
          </Row>
        </div>
      </Fragment>
    );
  }
}

export default ListEmployees;