import React,{Component} from 'react'
import {connect} from 'react-redux'

class DashboardFooter extends Component{
    render(){
        return(
            <footer id="footer-bar" className="row">
                <p id="footer-copyright" className="col-xs-12">
                &copy; 2014 <a href="http://www.adbee.sk/" target="_blank" rel="noopener noreferrer">Adbee digital</a>. Powered by Centaurus Theme.
                </p>
			</footer>
        );
    }
}

export default connect( store => {
    return {};
})(DashboardFooter);