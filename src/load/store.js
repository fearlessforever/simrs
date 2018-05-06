import { createStore , combineReducers , applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import LS from './localStorage'

const loginInfo = (state={
	accesstoken:''
},action)=>{
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
	errorData:{},
	table:[
		{iconKlass:'fa-dashboard',link:'index.html',name:'Dashboard',itung:28},
		{iconKlass:'fa-table',link:'#',name:'Transaksi',submenu:[
			{link:'transaksi-penjualan.html',name:'Penjualan'}
			,{link:'transaksi-pembelian.html',name:'Pembelian'}
		]},
		{iconKlass:'fa-envelope',link:'#',name:'Master Data',submenu:[
			{link:'master-satuan.html',name:'Satuan'}
			,{link:'master-tipe.html',name:'Tipe'}
			,{link:'master-ukuran.html',name:'Ukuran'}
			,{link:'master-supplier.html',name:'Supplier'}
			,{link:'master-barang-jasa.html',name:'Barang / Jasa'}
		]}
		,{iconKlass:'fa-bar-chart-o',link:'#',name:'Laporan',submenu:[
			{link:'tables.html',name:'Nota'}
			,{link:'tables.html',name:'Laba Rugi'}
		]}
		,{iconKlass:'fa-th-large',link:'index.html',name:'Widgets',pesan:{klass:'label-success',teks:'Baru'}}
		,{iconKlass:'fa-map-marker',link:'index.html',name:'Google Maps',pesan:{klass:'label-danger',teks:'updated'}}
	],
	modalContent:{
		body:'',header:'',footer:'',
	},
	modalOpen:false,
	modalSize:'sm',
},action)=>{
	switch(action.type){
		case 'UPDATE_DASHBOARDINFO':
			state = Object.assign({},state,action.value);
			break;
		case 'UPDATE_PAGE':
			state = {...state,page:action.value,pageIsLoading:false};
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
	loginInfo,dashBoard 
});
const store = window.LS = createStore(reducers,middleware);
export default store;