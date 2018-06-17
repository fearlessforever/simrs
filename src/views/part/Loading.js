import React, { Component } from 'react';

export default class Loading extends Component{
    render(){
        let show = typeof this.props.show !== 'undefined' ? this.props.show : false ;
        return(
            <div className={ show ? '' : 'hidden' }>
                <img src='/external/img/loading.gif' alt="Loading ... " />
            </div>
        );
    }
}