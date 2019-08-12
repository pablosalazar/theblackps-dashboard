import React, { Component, Fragment } from "react";
import { Row, Alert } from "reactstrap";
import { Colxx } from "../../../components/common/CustomBootstrap";

import axios from "axios";
import { servicePath } from "../../../constants/defaultValues";

import DataListView from "../../../containers/pages/DataListView";
import ListPageHeading from "../../../containers/pages/ListPageHeading";

function collect(props) {
  return { data: props.data };
}
const apiUrl = servicePath + "employees";
class ListEmployees extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoading: true,
      error: null,

      selectedPageSize: 10,
      orderOptions: [
        { column: "firstname", label: "Nombre" },
        { column: "code", label: "Código" },
        { column: "role", label: "Rol" },
        { column: "username", label: "Usuario" },
        { column: "email", label: 'email'}
      ],
      pageSizes: [10, 20, 30, 50, 100],
      selectedOrderOption: { column: "firstname", label: "Nombre" },
      currentPage: 1,
      totalItemCount: 0,
      totalPage: 1,
      search: "",
    }
  }

  componentDidMount() {
    this.dataListRender();
  }

  dataListRender() {
    const {
      selectedPageSize,
      currentPage,
      selectedOrderOption,
      search
    } = this.state;
    this.setState({items: [], isLoading: true})
    axios
      .get(
        `${apiUrl}?pageSize=${selectedPageSize}&currentPage=${currentPage}&orderBy=${
          selectedOrderOption.column
        }&search=${search}`
      )
      .then((response) => {
        this.setState({
          items: response.data.data,
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          error: error.response ? error.response.data.error : String(error),
          isLoading: false,
        })
      });
  }

  onSearchKey = e => {
    if (e.key === "Enter") {
      this.setState(
        {
          search: e.target.value.toLowerCase()
        },
        () => this.dataListRender()
      );
    }
  };

  changeOrderBy = column => {
    this.setState(
      {
        selectedOrderOption: this.state.orderOptions.find(
          x => x.column === column
        )
      },
      () => this.dataListRender()
    );
  };

  render() {
    const {
      isLoading, 
      error,
      currentPage,
      items,
      displayMode,
      selectedPageSize,
      totalItemCount,
      selectedOrderOption,
      selectedItems,
      orderOptions,
      pageSizes,
      modalOpen,
      categories
    } = this.state;
    const { match } = this.props;
    const startIndex = (currentPage - 1) * selectedPageSize;
    const endIndex = currentPage * selectedPageSize;

    if (error) {
      return (
        <Colxx xxs="12" className="mb-3">
          <Alert
            color="danger"
          >
            {error}
          </Alert>
        </Colxx>
      )
    }
    
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <ListPageHeading 
            heading='Lista de empleados'
            match={match}
            startIndex={startIndex}
            endIndex={endIndex}
            url='/empleados/nuevo'
            totalItemCount={totalItemCount}
            selectedPageSize={selectedPageSize}
            changeOrderBy={this.changeOrderBy}
            selectedOrderOption={selectedOrderOption}
            onSearchKey={this.onSearchKey}
            orderOptions={orderOptions}
            pageSizes={pageSizes}
          />
          <Row>
            
            {items.length === 0?
              <Colxx xxs="12" className="mb-3">
              <Alert
                color="dark"
              >
                No se encontrarón empleados registrados
              </Alert>
            </Colxx>
            : items.map(item => (
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