import React, { Component } from 'react';
import MessageAlert from './part/MessageAlert';
import Loading from './part/Loading';
import queryString from 'qs'

import { connect } from 'react-redux'
import wait from '../load/wait'

class Login extends Component{
  constructor(){
    super();
    this.state={
      inputISdisabled:false,loading:false,
      alertObject:{
          message:'',className:'hidden',messageBold:'Error'
      }
    };

  }
  componentWillMount(){
    wait().then(()=>{
      this.props.dispatch({type:'LOAD_CONFIG'})
    }).then(()=>{
      if(!this.props.loginInfo.accesstoken)
        this.__checkSystemApi()
      else{
        this.props.history.push('dashboard',{})
      }
    }).catch((e)=>{
      console.log(e)
    })
  }

  __checkSystemApi(){
    return fetch(window.helmi.api+'umum/getsetting')
    .then(res =>res.json() )
    .then( res =>{
      if(res.error)throw Error(res.error);
    })
    .catch((res)=>{
      this.setState({
        inputISdisabled:true,
        alertObject:{message:res.message,className:'alert alert-danger',messageBold:'Error'},
      });
    })
  }

  handleKeyPress(e){
    if(e.which === 13){
      this.handleSubmit();
    }
  }

  handleSubmit(){
    this.setState({
        inputISdisabled:true,
        loading:true,
        alertObject:{
            message:'',className:'hidden',messageBold:'Error'
        }
    });
    
    fetch(window.helmi.api+'login?errorcode=false',{
        headers: {
          'Content-Type':'application/x-www-form-urlencoded',
          'origin':'asasgasgasgag',
        },
        method:'POST',
        body: queryString.stringify({
          username:this.refs.username.value,
          password:this.refs.password.value,
        })
    }).then( res => res.json() )
    .then( res => {
        if(res.errors && typeof res.errors[0] !== 'undefined'){
            return Promise.reject(res.errors[0]);
        }else return Promise.resolve(res);
    })
    .then( res => {
        if(res.accesstoken){
            this.props.dispatch({type:'CHANGE_ACCESSTOKEN',value:res.accesstoken});
            this.setState({
                alertObject:{
                    message:'Logged in ... please wait ...',
                    className:'alert alert-success',
                    messageBold:'Success'
                }
            });
            setTimeout(() => {
                this.props.history.push('dashboard');
            },2000);
        }
    })
    .catch( res =>{
       this.setState({
        alertObject:{
            message:res.message,
            className:'alert alert-danger',
            messageBold:'Error'
        }
       });
    }).then(()=>{
      this.setState({inputISdisabled:false,loading:false});
    });
    
  }

  handleClickAlert(){
    let {alertObject}= this.state ,temp = { alertObject , className:'hidden'};
    this.setState({
        alertObject:temp
    });
  }

  render() {
    //console.log( this.props )
    return (
      <div id="login-full-wrapperz">
        <div className="container">
            <div className="row">
                <div className="col-md-12 col-xs-12">
                    <div id="login-box" className="tambahan">
                        <div id="login-box-holder" >
                            <div className="row">
                            <div className="col-xs-12">
            <header id="login-header">
                <div id="login-logo">
                    <img alt=""   />
                </div>
            </header>
                            <div id="login-box-inner">
            <form onSubmit={this.handleSubmit.bind(this)}>
                <div className="input-group">
                    <span className="input-group-addon"><i className="fa fa-user"></i></span>
                    <input onKeyPress={this.handleKeyPress.bind(this)} id="loginmail" disabled={this.state.inputISdisabled} name="username" ref="username" type="text" placeholder="Type Your Username Or Email Here" className="form-control" />
                </div>
                <div className="input-group">
                    <span className="input-group-addon"><i className="fa fa-key"></i></span>
                    <input onKeyPress={this.handleKeyPress.bind(this)} id="loginpass" disabled={this.state.inputISdisabled} name="password" ref="password" type="password" placeholder="Type Your Password" className="form-control" />
                </div>
                <div id="remember-me-wrapper">
                    <div className="row">
                        <div className="col-xs-6">
                            <div className="checkbox-nice">
                                <input type="checkbox" id="remember-me" name="remember" /> <label htmlFor="remember-me"> Remember Me </label>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
                            
            <div className="row">
                <div className="col-xs-12">
                    <button disabled={this.state.inputISdisabled} onClick={this.handleSubmit.bind(this)} className="btn btn-success col-xs-12" type="submit"> Login </button>
                </div>
            </div> 
            <div className="row">
                <div className="col-xs-12 social-text">
                    <MessageAlert option={this.state.alertObject} onClick={this.handleClickAlert.bind(this)} />
                    <Loading show={this.state.loading} />
                </div>
            </div>
            
            <div className="row">
                <div className="col-xs-12 col-sm-6">
                    <a className="btn btn-primary col-xs-12 btn-facebook" rel="noopener noreferrer" target="_blank" href="http://www.facebook.com"><i className="fa fa-facebook"></i> Facebook</a>
                </div>
                <div className="col-xs-12 col-sm-6">
                    <a className="btn btn-primary col-xs-12 btn-twitter" rel="noopener noreferrer" target="_blank" href="http://www.facebook.com"> <i className="fa fa-twitter"></i> Twitter </a>
                </div> 
            </div>
            <div className="row">
                <div className="col-xs-12">
                    <a href="/tes"><i > {this.state.nama_system} </i></a> 
                </div> 
            </div>
            
                            
                            </div>
                            </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }
}

export default connect( store => {
  return {loginInfo:store.loginInfo};
})(Login)

/*
<div className="row"> 
  <div className="col-xs-12">
    <Select
        name="form-field-name"
        value={this.state.systemPilihan}
        onChange={this.handleChange}
        options={[
          { value: 'one', label: 'One' },
          { value: 'two', label: 'Two' },
        ]}
    />
  </div>
</div>
*/