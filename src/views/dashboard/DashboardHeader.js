import React,{Component} from 'react'
import {connect} from 'react-redux'

import {Dropdown} from 'react-bootstrap'

class DashboardHeader extends Component{
    handleClick()
    {
        this.props.dispatch({
            type:'BUTTON_TOGGLE_NAVBAR',
            value:!this.props.navSmall
        });
    }
    handleClick2()
    {
        this.props.dispatch({
            type:'BUTTON_TOGGLE_NAVBARMINI',
            value:!this.props.navSmallMini
        });
    }

    render(){
        let {...props} = this.props;
		return(
			<header className="navbar" id="header-navbar">
				<div className="container">
					<a href="/" id="logo" className="navbar-brand">
						<img src="/external/img/logo.png" alt="" className="normal-logo logo-white"/>
						<img src="/external/img/logo-black.png" alt="" className="normal-logo logo-black"/>
						<img src="/external/img/logo-small.png" alt="" className="small-logo hidden-xs hidden-sm hidden"/>
					</a>
					<div className="clearfix">
						<button onClick={this.handleClick2.bind(this)} className="navbar-toggle" data-target=".navbar-ex1-collapse" data-toggle="collapse" type="button">
							<span className="sr-only">Toggle navigation</span>
							<span className="fa fa-bars"></span>
						</button>
						<div className="nav-no-collapse navbar-left pull-left hidden-sm hidden-xs">
						<ul className="nav navbar-nav pull-left">
							<li>
							<a onClick={this.handleClick.bind(this)} className="btn" id="make-small-nav"> <i className="fa fa-bars"></i> </a>
							</li>
						</ul>
						</div>

						<DashboardHeaderNavBar {...props} />
					</div>

				</div>
			</header>
		);
	}
}
// <DashboardHeaderNavBar />

export default connect( store =>{
    return {
        userDetail:store.dashBoard.user,
        messageList:store.dashBoard.messageList,
        notifList:store.dashBoard.notifList,
        menuList:store.dashBoard.menuList,
        navSmall:store.dashBoard.navSmall,
        navSmallMini:store.dashBoard.navSmallMini,
    };
})(DashboardHeader);


class DashboardHeaderNavBar extends Component{
    constructor(){
        super();
        this.state={notif:false};
    }
    handleNotifOnBlur(){
        if(this.state.notif)
        this.setState({notif:!this.state.notif});
    }
    handleNotifOnClick(e){
        e.preventDefault();
        this.setState({notif:!this.state.notif});
    }
    clickLogout(){
        this.props.dispatch({type:'CHANGE_ACCESSTOKEN'})
    }

    render(){
        let { userDetail,messageList ,notifList,menuList}=this.props; 
        let LIST3 = menuList.map((val , k)=>{
			return <LiDropdownPhoto key={k} obj={val} />
        });
        let LIST2;
		let cntList2 = messageList.length ;
		LIST2 = messageList.map((val,k)=>{
			return <LiDropdownMessage key={k} obj={val} />
        });
        let LIST = notifList.map(( val,k) =>{
            return <LiDropdownNotif key={k} obj={val} />
        }), cntList=notifList.length ;
        
        return(
            <div className="nav-no-collapse pull-right" id="header-nav">
                <ul className="nav navbar-nav pull-right">
                <li className="mobile-search"> <a className="btn"> <i className="fa fa-search"></i> </a>
                    <div className="drowdown-search">
                    <form role="search">
                        <div className="form-group">
                        <input type="text" className="form-control" placeholder="Search..." />
                        <i className="fa fa-search nav-search-icon"></i>
                        </div>
                    </form>
                    </div>
                </li>
                <li onBlur={this.handleNotifOnBlur.bind(this)} tabIndex="0" className={ 'dropdown hidden-xs ' + (this.state.notif ? 'open' : '' )} >
                    <a role="button" onClick={this.handleNotifOnClick.bind(this)} className="btn dropdown-toggle" data-toggle="dropdown"> <i className="fa fa-warning"></i> <span className="count">{cntList}</span> </a>
                    <ul className="dropdown-menu notifications-list">
                        <li className="pointer">
                            <div className="pointer-inner"> <div className="arrow"></div> </div>
                        </li>
                        <li className="item-header"> { cntList > 0 ? 'You have '+cntList+' new notifications' : 'Notif Message Not Found' } </li>
                        {LIST}
                        <li className="item-footer"> <a > View all notifications </a> </li>
                    </ul>
                </li>
                <Dropdown id="view-msg-notif" componentClass="li" className="hidden-xs">
                    <Dropdown.Toggle useAnchor={true} noCaret>
                        <i className="fa fa-envelope-o"></i> <span className="count"> {cntList2} </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="notifications-list messages-list">
                        <li className="pointer"> <div className="pointer-inner"> <div className="arrow"></div> </div> </li>
                         {LIST2}
                        <li className="item-footer"> <a href=""> View all messages </a> </li>
                    </Dropdown.Menu>
                </Dropdown>

                <li className="hidden-xs"> <a href="#/dasshboard/settings" className="btn"> <i className="fa fa-cog"></i> </a> </li>
                <Dropdown id="view-user-nav" componentClass="li" className="profile-dropdown">
                    <Dropdown.Toggle useAnchor={true} noCaret>
                        <img src={userDetail.photo} alt=""/>
                        <span className="hidden-xs">{userDetail.name.substr(0,16)}</span> <b className="caret"></b>
                    </Dropdown.Toggle>
                    <Dropdown.Menu >
                        {LIST3}
                    </Dropdown.Menu>
                </Dropdown>

                <li className="hidden-xxs"> <a className="btn" onClick={this.clickLogout.bind(this)} > <i className="fa fa-power-off"></i> </a> </li>
                </ul>
			</div>
        );
    }
}


//==========================================
class LiDropdownPhoto extends Component{
	render(){
		return(
			<li><a href={this.props.obj.link}><i className={ this.props.obj.iconKlass }></i>{this.props.obj.teks}</a></li>
		);
	}
}
class LiDropdownMessage extends Component{
	render(){
		return(
			<li className="item first-item">
				<a >
				<img src={this.props.obj.pic} alt={'Photos Profile of ' +this.props.obj.name} />
				<span className="content">
				<span className="content-headline">{this.props.obj.name}</span>
				<span className="content-text">{this.props.obj.teks}</span>
				</span> 
				<span className="time"><i className="fa fa-clock-o"></i>{this.props.obj.waktu}</span>
				</a>
			</li>
		);
	}
}
class LiDropdownNotif extends Component{
	render(){
		return(
			<li className="item">
				<a ><i className={ this.props.obj.iconKlass }></i>
				<span className="content">{this.props.obj.teks}</span>
				<span className="time"><i className="fa fa-clock-o"></i>{this.props.obj.waktu}</span>
				</a>
			</li>
		);
	}
}