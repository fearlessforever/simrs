import React,{Component} from 'react'
import {connect} from 'react-redux'
import queryString from 'qs'

import Error404 from './Error404'
import wait from '../load/wait'

import ModalPage from './part/ModalPage'

import DashboardHeader from './dashboard/DashboardHeader'
import DashboardConfig from './dashboard/DashboardConfig'
import DashboardSidebar from './dashboard/DashboardSidebar'
import DashboardFooter from './dashboard/DashboardFooter'


import DataDokter from './page/DataDokter'

class Dashboard extends Component{
    componentWillUnmount(){
        this.props.dispatch({type:'UPDATE_LOAD_USERINFO',value:false});
    }

    checkAccessToken()
    {
        if( !this.props.loginInfo.accesstoken )
        {
            wait().then(()=> Promise.resolve( this.props.dispatch({type:'LOAD_CONFIG'}) ) )
            //.then( res => console.log(res) )
            .then(()=>{
                if(!this.props.loginInfo.accesstoken)
                    return Promise.reject();
                return Promise.resolve();
            })
            .catch( () => {
                if(!this.props.loginInfo.accesstoken)
                    this.props.history.replace('/');
            })
        }else{
            if(!this.props.loadUserinfo ){
                wait().then(()=> fetch(window.helmi.api+'dashboard?errorcode=false',{
                    headers: {
                    'Content-Type':'application/x-www-form-urlencoded',
                    },
                    method:'POST',
                    body: queryString.stringify({
                    accesstoken:this.props.loginInfo.accesstoken,
                    })
                }) )
                .then( res => res.json() )
                .then( res => {
                    if(typeof res.accesstoken !== 'undefined')
                        this.props.dispatch({type:'CHANGE_ACCESSTOKEN',value:res.accesstoken});
                    let save = {};
                    if(res.sidebarList)save.table=res.sidebarList;
                    if(res.userInfo)save.user=res.userInfo;


                    this.props.dispatch( dispatch => {
                        dispatch({type:'UPDATE_LOAD_USERINFO',value:true});
                        dispatch({type:'UPDATE_DASHBOARDINFO',value:save });
                    });

                }).catch( error => {
                    console.log(error);
                });
            }
        }
            
    }
    updatePage(){
        let { params } = this.props.match , page = '';
        page = params.sub ? params.sub : page;
        this.props.dispatch({type:'UPDATE_PAGE',value:page});
    }
    render(){
        
        let page,error=false,{ params } = this.props.match ;
        if( params.sub ){
            //this.props.dispatch({type:'UPDATE_PAGE',value:params.sub});
           switch(params.sub){
               case 'master-dokter' : page=<DataDokter />;  break;
               case 'index' : page=' ada ya ';  break;
               default: page = <Error404/> ; error=true; break; 
           }
        }else{
            page = 'Belum ada ide tampilan nya :v'; 
        }
        if( !this.props.loadUserinfo ){
            return(
                <div className="loader" >
                    { this.checkAccessToken() }
                </div>
            );
        }
        document.body.removeAttribute("style");
        return(
            <div id={error ? '' : 'theme-wrapper'} >{ 
                error ? page : 
                <div >
                    <DashboardHeader  />
                    <DashboardConfig />
                    <div id="page-wrapper" className={'container' + (this.props.navSmall ? ' nav-small ' : '') }>
                        <div className="row">
                            <DashboardSidebar />
                            <div id="content-wrapper">
                                { this.props.loadUserinfo ? page : ''}
                            </div>
                            <ModalPage />
                            <DashboardFooter />
                        </div>
                    </div>
                </div>
            }
            { this.checkAccessToken() } 
            </div>
        );
    }
}

export default connect( store => {
    return {
        loginInfo:store.loginInfo,
        navSmall:store.dashBoard.navSmall,
        loadUserinfo:store.dashBoard.loadUserinfo,
    };
})(Dashboard);