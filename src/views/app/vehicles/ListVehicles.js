import React, { Component, Fragment } from 'react';

import ListPageHeading from "../../../containers/pages/ListPageHeading";

export default class ListVehicles extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: true
        }
    }
    componentDidMount() {
        var scope = this
        setTimeout(function(){
            scope.setState({ isLoading: false });
        }, 500)
    }
    render(){
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
            <p>Loaded!!!!</p>
            // <Fragment>
            //     <div className="disable-text-selection">
            //     <ListPageHeading 
            //         heading='Lista de vehículos'
            //         match={match}
            //         startIndex={startIndex}
            //         endIndex={endIndex}
            //         url='/clientes/nuevo'
            //         totalItemCount={totalItemCount}
            //         selectedPageSize={selectedPageSize}
            //         changeOrderBy={this.changeOrderBy}
            //         changePageSize={this.changePageSize}
            //         selectedOrderOption={selectedOrderOption}
            //         onSearchKey={this.onSearchKey}
            //         orderOptions={orderOptions}
            //         pageSizes={pageSizes}
            //     />
            //     </div>
            // </Fragment>
          );
    }
}
