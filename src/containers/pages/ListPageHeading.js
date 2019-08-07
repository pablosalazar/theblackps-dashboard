import React, { Component } from 'react';
import {
  Row,
  Button,
  ButtonDropdown,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  CustomInput,
  Collapse
} from "reactstrap";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import Breadcrumb from "../navs/Breadcrumb";

class ListPageHeading extends Component {
  
  render() {
    const {
      displayMode,
      changeDisplayMode,
      handleChangeSelectAll,
      changeOrderBy,
      changePageSize,
      selectedPageSize,
      totalItemCount,
      selectedOrderOption,
      match,
      startIndex,
      endIndex,
      selectedItemsLength,
      itemsLength,
      onSearchKey,
      orderOptions,
      pageSizes,
      toggleModal,
      heading,
      newUrl,
    } = this.props;

    return (
      <Row>
        <Colxx xxs="12">
          <div className="mb-2">
            <h1>{heading}</h1>
            <div className="text-zero top-right-button-container">
              <Button
                color="primary"
                size="lg"
                className="top-right-button"
              >
                NUEVO
              </Button>
              {"  "}
            </div>
            <Breadcrumb match={match} />
          </div>
        </Colxx>
      </Row>
    );
  }
}

export default ListPageHeading;