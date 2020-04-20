import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Table, Alert } from "reactstrap";
import { Colxx } from "../../../components/common/CustomBootstrap";
import { NavLink } from "react-router-dom";
import { getVehicles } from "../../../api/vehicleApi";
import Pagination from "../../../containers/pages/Pagination";
import ListPageHeading from "../../../containers/pages/ListPageHeading";

export default class ListVehicles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoading: true,
      error: null,

      selectedPageSize: 10,
      orderOptions: [
        { column: "plate", label: "Placa" },
        { column: "brand", label: "Marca" },
        { column: "color", label: "Color" }
      ],
      selectedOrderOption: { column: "plate", label: "Placa" },
      pageSizes: [10, 20, 30, 50],
      currentPage: 1,
      totalItemCount: 0,
      totalPage: 1,
      search: "",
    }
  }

  componentDidMount() {
    this.dataListRender()
  }

  async dataListRender() {
    const {
      selectedPageSize,
      currentPage,
      selectedOrderOption,
      search
    } = this.state;

    try {
      const response = await getVehicles(selectedPageSize, currentPage, selectedOrderOption.column, search);
      this.setState({
        totalPage: response.last_page,
        items: response.data,
        totalItemCount: response.total,
        isLoading: false,
      });
    } catch (error) {
      this.setState({
        error,
        isLoading: false,
      })
    }
  }

  onSearchKey = e => {
    this.setState(
      {
        search: e.target.value.toLowerCase(),
        currentPage: 1
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
      selectedPageSize,
      totalItemCount,
      selectedOrderOption,
      orderOptions,
      pageSizes,
      search
    } = this.state;
    const { match } = this.props;
    const startIndex = (currentPage - 1) * selectedPageSize;
    const endIndex = currentPage * selectedPageSize;
    return isLoading ? (
      <div className="loading" />
    ) : (
        <Fragment>
          <div className="disable-text-selection">
            <ListPageHeading
              heading='Lista de vehículos'
              match={match}
              startIndex={startIndex}
              endIndex={endIndex}
              url='/vehiculos/nuevo'
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
              {items.length === 0 ?
                <Colxx xxs="12" className="mb-3">
                  <Alert color="dark">
                    No se encontraron resultados
                      </Alert>
                </Colxx>
                :
                <Colxx xxs="12" className="mb-3">
                  <Card className="mb-4">
                    <CardBody>
                      <CardTitle>
                        Vehículos ({totalItemCount})
                          </CardTitle>
                      <Table responsive className="table table-hover">
                        <thead className="text-primary">
                          <tr>
                            <th>Placa</th>
                            <th>Marca</th>
                            <th>Color</th>
                            <th className="text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <NavLink to={`/vehiculos/detalle/${item.id}`}>
                                  {item.plate}
                                </NavLink>
                              </td>
                              <td>{item.brand}</td>
                              <td>{item.color}</td>
                              <td className="td-actions text-center">
                                <NavLink to={`/vehiculos/detalle/${item.id}`} className="text-center">
                                  <i className="glyph-icon simple-icon-eye"></i>
                                </NavLink>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </CardBody>
                  </Card>
                </Colxx>
              }{" "}
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
