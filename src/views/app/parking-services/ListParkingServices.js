import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Table, Alert } from "reactstrap";
import { NavLink } from "react-router-dom";

import moment from "moment";
import { Colxx } from "../../../components/common/CustomBootstrap";

import { getParkingServices } from "../../../api/parkingServiceApi";
import Pagination from "../../../containers/pages/Pagination";
import ListPageHeading from "../../../containers/pages/ListPageHeading";

class ListParkingServices extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoading: true,
      error: null,

      selectedPageSize: 10,
      orderOptions: [
        { column: "created_at", label: "Fecha de registro" },
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
      const response = await getParkingServices(selectedPageSize, currentPage, selectedOrderOption.column, search);
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

  formatDate = (date) => {
    return moment(date).format("L")
  }


  render() {

    const {
      isLoading, error, currentPage, items, selectedPageSize, totalItemCount,
      selectedOrderOption, orderOptions, pageSizes, search
    } = this.state;
    const { match } = this.props;
    const startIndex = (currentPage - 1) * selectedPageSize;
    const endIndex = currentPage * selectedPageSize;

    if (isLoading) {
      return <div className="loading" />
    }

    return (
      <div className="disable-text-selection">
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
                        <th>Serial</th>
                        <th>Placa</th>
                        <th>Cliente</th>
                        <th>Fecha de ingreso</th>
                        <td>Fecha última actualización</td>
                        <th>Hora</th>
                        <th>Estado</th>
                        <th className="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.serial}</td>
                          <td>
                            <NavLink to={`/vehiculos/detalle/${item.id}`}>
                              {item.plate}
                            </NavLink>
                          </td>
                          <td>{item.customer}</td>
                          <td>{this.formatDate(item.created_at)}</td>
                          <td>{this.formatDate(item.updated_at)}</td>
                          <td>{moment(item.created_at).format("h:mm A")}</td>
                          <td>{item.status}</td>
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
    );
  }
}

export default ListParkingServices;