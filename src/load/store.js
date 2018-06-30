import { createStore , combineReducers , applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import LS from './localStorage'

const loginPage = ( state = {background_img:'/external/img/e-hospital.jpg',logo_img:'/external/img/logo-black.png'} ,action) => {
	switch(action.type){
		case 'LOAD_CONFIG':
			if(action.value){
				let {value} = action;
				value.background_img= value.background_img ? value.background_img : state.background_img;
				value.logo_img= value.logo_img ? value.logo_img : state.logo_img;
				state = Object.assign({},state,value);
			}
			
			break;
		default:break;
	}
	return state;
};
const loginInfo = ( state ={ 
	accesstoken:''
},action) => {
	switch(action.type){
		case 'CHANGE_ACCESSTOKEN':
			if(!action.value){
				LS.remove('accesstoken');
			}else{
				LS.set('accesstoken', action.value);
			}
			window.helmi.accesstoken = action.value ;
			state = {...state , accesstoken : action.value };
			break;
		case 'LOAD_CONFIG':
			let accesstoken = LS.get('accesstoken');
			state = {...state ,accesstoken };
			break;
		default:break;
	}
	return state;
};
const dashBoard = (state={
	user:{photo:'/external/img/no_image.jpg',name:'No Name'},
	accesstoken:{expiredIn:0},
	notif:{pesan:0,notif:0},
	page:'',
	pageIsLoading:false ,
	pageData:false,
	pagePermission:{
		create:false,update:false,delete:false
	},
	loadUserinfo:false,
	navSmall:false,
	collapsedSidebar:false,
	navSmallMini:false,
	config:{
		list:[
			{id:'config-fixed-header' ,name:'Fixed Header'}
			//,{id:'config-fixed-sidebar' ,name:'Fixed Left Menu'}
			,{id:'config-fixed-footer' ,name:'Fixed Footer'}
			,{id:'config-boxed-layout' ,name:'Boxed Layout'}
		   // ,{id:'config-rtl-layout' ,name:'Right-to-Left'}
		],
		color:[
			{title:'Default' ,klass:'' ,name:'theme-default',stile:{backgroundColor: '#34495e'} }
			,{title:'White/Green' ,klass:'' ,name:'theme-white',stile:{backgroundColor: '#2ecc71'} }
			,{title:'Gradient' ,klass:'blue-gradient',name:'theme-blue-gradient',stile:{} }
			,{title:'Green Sea' ,klass:'' ,name:'theme-turquoise',stile:{backgroundColor: '#1abc9c'}}
			,{title:'Amethyst' ,klass:'' ,name:'theme-amethyst',stile:{backgroundColor: '#9b59b6'}}
			,{title:'Blue' ,klass:'' ,name:'theme-blue',stile:{backgroundColor: '#2980b9'}}
			,{title:'Red' ,klass:'' ,name:'theme-red',stile:{backgroundColor: '#e74c3c'}}
			,{title:'White/Blue' ,klass:'' ,name:'theme-whbl',stile:{backgroundColor: '#3498db'} }
		]
	},
	messageList:[
		{name:'George Clooney',pic:'/external/img/no_image.jpg',teks:"Look, Don't make it right for Marsellus to throw...",waktu:'13 min.'}
		,{name:'Emma Watson',pic:'/external/img/no_image.jpg',teks:"Look, Don't make it right for Marsellus to throw...",waktu:'13 min.'}
		,{name:'Robert Downey Jr.',pic:'/external/img/no_image.jpg',teks:"Look, Don't make it right for Marsellus to throw...",waktu:'13 min.'}
	],
	menuList:[
		{link:'#/dashboard/profiles',teks:'Profile',iconKlass:'fa fa-user'}
		,{link:'#/dashboard/settings',teks:'Settings',iconKlass:'fa fa-cog'}
		,{link:'#/dashboard/messagelists',teks:'Messages',iconKlass:'fa fa-envelope-o'}
		,{link:'#/dashboard/logout',teks:'Logout',iconKlass:'fa fa-power-off'}
	],
	notifList:[
		{iconKlass:'fa fa-comment',teks:'New comment on ‘Awesome P...',waktu:'13 min.'}
		,{iconKlass:'fa fa-plus',teks:'New user registration',waktu:'13 min.'}
		,{iconKlass:'fa fa-envelope',teks:'New Message from George',waktu:'13 min.'}
		,{iconKlass:'fa fa-shopping-cart',teks:'New purchase',waktu:'13 min.'}
		,{iconKlass:'fa fa-eye',teks:'New order',waktu:'13 min.'}
	],
	errorData:{},
	ajaxErrors:[],
	table:[
		{iconKlass:'fa fa-dashboard',link:'#/dashboard/index.html',name:'Dashboard',itung:28}, 
	],
	modalContent:{
		body:'',header:'',footer:'',
	},
	modalOpen:false,
	modalSize:'sm',
},action)=>{
	switch(action.type){
		case 'SIDEBAR_CLICKED':
		state = {...state ,collapsedSidebar:action.value };
			break;
		case 'LOAD_CONFIG':
			let navSmall = LS.get('navSmall');
			state = {...state ,navSmall:(navSmall==='false') ?false:true };
			break;
		case 'UPDATE_DASHBOARDINFO':
			state = Object.assign({},state,action.value);
			break;
		case 'BUTTON_TOGGLE_NAVBAR':
			LS.set('navSmall', action.value);
			state = {...state,navSmall:action.value };
			break;
		case 'BUTTON_TOGGLE_NAVBARMINI':
			state = {...state,navSmallMini:action.value };
			break;
		case 'UPDATE_LOAD_USERINFO':
			state = {...state,loadUserinfo:action.value};
			break;
		case 'UPDATE_PAGE':
			state = {...state,page:action.value };
			break;
		case 'UPDATE_PAGE_DATA':
			state = {...state,pageData:action.value };
			break;
		case 'UPDATE_PAGE_PERMISSION':
			action.value = Object.assign({create:false,update:false,delete:false},action.value)
			state = {...state,pagePermission:action.value };
			break;
		case 'PAGE_LOADING':
			state = {...state,pageIsLoading:true,page:'',pageData:false};
			break;
		case 'PAGE_AJAX_ERROR':
			state = {...state,ajaxErrors:action.value };
			break;
		case 'PAGE_ERROR':
			state = {...state,errorData:action.value,pageIsLoading:false,page:'error404'};
			break;
		case 'TOGGLE_MODAL': 
			state = {...state,modalOpen:(action.value === 'false' ? false : true ) };
			break;
		case 'UPDATE_MODAL_BODY': 
			state = {...state,modalContent:action.value};
			break;
		case 'UPDATE_MODAL_SIZE': 
			state = {...state,modalSize:(action.value === 'lg' ? 'lg' : 'sm')};
			break;
		default:break;
	}
	return state;
};
const middleware = applyMiddleware(thunk);

const reducers = combineReducers({
	loginInfo,dashBoard,loginPage
});
const store = window.LS = createStore(reducers,middleware);
export default store;