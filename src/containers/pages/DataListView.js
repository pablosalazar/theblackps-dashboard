import React from 'react';
import { Card } from 'reactstrap';
import { NavLink } from "react-router-dom";
import { Colxx } from "../../components/common/CustomBootstrap";

const DataListView = ({ item, isSelect, collect, onCheckItem }) => {
  return (
    <Colxx xxs="12" className="mb-3">
      <Card >
        <div className="pl-2 d-flex flex-grow-1 min-width-zero">
          <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
            <NavLink to='' className="w-30 w-sm-100">
              <p className="list-item-heading mb-1 truncate">
              {item.firstname} {item.lastname}
              </p>
            </NavLink>
            <p className="mb-1 w-15 w-sm-100">
              {item.phone}
            </p>
            <p className="mb-1 w-15 w-sm-100">
              {item.email}
            </p>
            <p className="mb-1 w-15 w-sm-100">
              {item.role}
            </p>
          </div>
          <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
            <NavLink to={`/empleados/nuevo`} className="btn btn-info btn-sm">
              Detalle
            </NavLink>
          </div>
        </div>
        
      </Card>
      
    </Colxx>
  );
};

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(DataListView);