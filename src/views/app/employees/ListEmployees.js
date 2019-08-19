import React, { Component, Fragment } from "react";
import { Row, Alert } from "reactstrap";
import { Colxx } from "../../../components/common/CustomBootstrap";

import axios from "axios";
import { servicePath } from "../../../constants/defaultValues";

import DataListView from "../../../containers/pages/DataListView";
import Pagination from "../../../containers/pages/Pagination";
import ListPageHeading from "../../../containers/pages/ListPageHeading";


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
        { column: "full_name", label: "Nombre" },
        { column: "code", label: "Código" },
        { column: "role", label: "Rol" },
        { column: "username", label: "Usuario" },
        { column: "email", label: 'Email'}
      ],
      pageSizes: [10, 20, 30, 50, 100],
      selectedOrderOption: { column: "first_name", label: "Nombre" },
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
    axios
      .get(
        `${apiUrl}?pageSize=${selectedPageSize}&page=${currentPage}&orderBy=${
          selectedOrderOption.column
        }&search=${search}`
      )
      .then(response => {
        return response.data;
      })
      .then(response => {
        this.setState({
          totalPage: response.last_page,
          items: response.data,
          totalItemCount: response.total,
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
    this.setState(
      {
        search: e.target.value.toLowerCase()
      },
      () => this.dataListRender()
    );
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

  changePageSize = size => {
    this.setState(
      {
        selectedPageSize: size,
        currentPage: 1
      },
      () => this.dataListRender()
    );
  };

  onChangePage = page => {
    this.setState({
      currentPage: page
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
      categories,
      search
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
            changePageSize={this.changePageSize}
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
                No se encontrarón resultados
              </Alert>
            </Colxx>
            : items.map(item => (
                <DataListView 
                  key={item.id}
                  item={item}
                />
            ))}{" "}
            <Pagination
              currentPage={this.state.currentPage}
              totalPage={this.state.totalPage}
              onChangePage={i => this.onChangePage(i)}
            />
          </Row>
        </div>
      </Fragment>
    );
  }
}

export default ListEmployees;