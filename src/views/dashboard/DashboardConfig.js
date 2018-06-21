import React,{Component} from 'react'
import {connect} from 'react-redux'

import wait from '../../load/wait'
import LS from '../../load/localStorage'

class DashboardConfig extends Component{
    constructor()
    {
        super();
        this.state ={
            show:false
        };
    }
    toggleOnBlur()
    {
        if(this.state.show)
        this.setState({
            show:!this.state.show
        });
    }
    toggleShowConfig()
    {
        this.setState({
            show:!this.state.show
        });
    }

    render(){
        //console.log(this.props)
        const LIST = this.props.dashConfig.list.map( (val,k) => <LiConfigList key={k} obj={val} /> )
        const LIST2 = this.props.dashConfig.color.map( (val,k) => <LiConfigColor key={k} obj={val} /> )
        return (
            <div tabIndex="0" onBlur={this.toggleOnBlur.bind(this)} id="config-tool" className={this.state.show?'opened':'closed'}>
                <a id="config-tool-cog" onClick={this.toggleShowConfig.bind(this)} > <i className="fa fa-cog"></i> </a>
                <div id="config-tool-options">
                    <h4>Layout Options</h4>
                    <ul> {LIST} </ul>
                    <br/>
                    <h4>Skin Color</h4>
                    <ul id="skin-colors" className="clearfix"> {LIST2} </ul>
                </div>
          </div>   	
        );
    }
}

export default connect( store =>{
    return {dashConfig:store.dashBoard.config};
})(DashboardConfig)

class LiConfigList extends Component{
    constructor(){
        super();
        this.state={checkBox:false};
    }
    componentWillMount()
    {
        let { obj } = this.props ;
        wait()
            .then(()=>{
                return Promise.resolve( LS.get( obj.id ) );
            })
            .then( value =>{ 
                this.setState({
                    checkBox: value === 'true' ? true : false
                })
            });
        
    }
    handleClick(e)
    {
        let id = e.currentTarget.getAttribute('data-id'),value = this.state.checkBox;
        wait().then(()=>{
            LS.set(id, !value );
            return Promise.resolve();
        }).then(()=>{
            this.setState({
				checkBox:!value
			});
        }).catch( res => console.log(res) );
    }

    render(){
        let { obj } = this.props ;
        
        switch( obj.id ){
			case 'config-fixed-header': 
				let KLASS = document.body.getAttribute('class') ;
				KLASS = this.state.checkBox ? (KLASS.match(/fixed-header/) ? KLASS : KLASS + ' fixed-header'  )  : KLASS.replace(/fixed-header/g,'') ;				
				document.body.className = KLASS;
				break;
			case 'config-fixed-footer': 
				this.state.checkBox === true ? document.body.classList.add('fixed-footer') : document.body.classList.remove('fixed-footer');
				break;
			case 'config-boxed-layout': 
				this.state.checkBox === true ? document.body.classList.add('boxed-layout') : document.body.classList.remove('boxed-layout');
				break;
			default:break;
		} 

        return(
            <li>
                <div className="checkbox-nice" onClick={this.handleClick.bind(this)} data-id={ obj.id}>
                <input type="checkbox" id={ obj.id} checked={this.state.checkBox ? true : false} />
                <label htmlFor={ obj.id}> { obj.name} </label>
                </div>
            </li>
        );
    }
}

class LiConfigColor extends Component{
    componentWillMount(){
        wait().then(()=>{
            return Promise.resolve( LS.get('body-tema') );
        }).then(value=>{
            document.body.classList.add( value ) ;
        });
    }
    handleClick(e){
        let skin = e.currentTarget.getAttribute('data-skin') ;
        document.body.classList.remove( LS.get('body-tema') );
        document.body.classList.add( skin ) ; 
        LS.set('body-tema',skin);
    }
    
    render()
    {
        let { obj } = this.props, kelas = 'skin-changer ' + obj.klass ;
        return(
            <li>
                <a onClick={this.handleClick.bind(this)} 
                    className={kelas} data-skin={obj.name} 
                    data-toggle="tooltip" title={obj.title} 
                    style={obj.stile} > </a>
            </li>
        );
    }
}