import React, { Component } from 'react';
//import logo from './logo.svg';
//import './App.css';
//import wait from './load/wait'

//import LS from './load/localStorage'
import ROUTE from './load/route'

class App extends Component {
  render() {
   /*  wait().then(()=>{
      LS.set('aku','ada saja ya wa') 
    }).then(()=>{
      console.log( LS.get('aku') )
    }) */
    
    return (
      <ROUTE />      
    );
  }
}

export default App;

/*
     <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
*/