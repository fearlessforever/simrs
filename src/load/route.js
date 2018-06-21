import React, { Component } from 'react'
import {Router,Route,Switch} from 'react-router'
//import createHistory from 'history/createBrowserHistory'
import createHistory from 'history/createHashHistory'


import Login from '../views/Login'
import Dashboard from '../views/Dashboard'
import Error404 from '../views/Error404'

class Routenya extends Component{
    render() {
        return (
            <Router history={ createHistory() }>
              <div className="App">
                <Switch>
                    <Route exact path="/" component={Login}> </Route>
                    <Route path="/dashboard/:sub" component={Dashboard}></Route>
                    <Route path="/dashboard" component={Dashboard}></Route>
                    <Route component={Error404} ></Route>
                </Switch>
              </div>
            </Router>
        );
    }
}

export default Routenya;

//  {process.env.PUBLIC_URL + '/analytics'}