import React,{Component} from 'react'
import {connect} from 'react-redux'
//import ReactDOMServer from 'react-dom/server';

import MessageAlert from '../part/MessageAlert'
import $ from 'jquery'

$.DataTable = require('datatables.net')
$.autocomplete = require('jquery-ui/ui/widgets/autocomplete')


class DataDokter extends Component{
    removeErrorMessageAlert(){
        this.props.dispatch({type:'PAGE_AJAX_ERROR',value:[]});
    }

    render(){
        let {ajaxErrors,...props} = this.props;
        let errorLists = ajaxErrors.map( (val,k) => {
            val.className= 'alert alert-warning';
            return <MessageAlert key={k} option={val} onClick={this.removeErrorMessageAlert.bind(this)} />
        });
        return(
            <div className="col-lg-12">
				<div className="row">
					<div className="col-lg-12">
						<ol className="breadcrumb">
							<li><a >Home</a></li>
							<li className="active"><span>Master Data </span></li>
						</ol>
					<h1>Data Dokter </h1>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-12 main-box">
						<header className="main-box-header clearfix">
							<h2 className="pull-left">Dokter </h2>
							<div className="filter-block pull-right">
							<a className="btn btn-primary pull-right" data-tombol="tambah">
								<i className="fa fa-plus-circle fa-lg"></i> Tambah Dokter
							</a>
							</div>
						</header>
						<div id="tempat-total-table" className="main-box-body clearfix"></div>
						<div className="main-box-body row">
							<LoadDataTable {...props} />
						</div>
                        <div>
                            {errorLists}
                        </div>
					</div>
				</div>
			</div>
        );
    }
}

export default connect( store => {
    return {
        accesstoken:store.loginInfo.accesstoken,
        page:store.dashBoard.page,
        ajaxErrors:store.dashBoard.ajaxErrors,
    };
})(DataDokter);

//=====================================================================================================
class LoadDataTable extends Component{
    componentWillUnmount(){
       //$('#tempat-table-crud table').DataTable().destroy(true);
       if(this.dataTable)this.dataTable.destroy(true);
       $('input[name="autocomplete"]').autocomplete( "destroy" );
       $(document).off('click','[data-tombol]');
       $(document).off('submit','form[data-tombol="form"]');
    }

    __generateModalForm(){
        this.props.dispatch( dispatch => {
            dispatch({
                type:'UPDATE_MODAL_BODY',value:{
                    body:`<div class="row">
                            <form data-tombol="form">
                                <div class="col-lg-6">
                                <div class="input-group">
                                    <label class="input-group-addon">Nama Dokter
                                        <span class="required"> * </span>
                                    </label>
                                    <input disabled type="text" class="form-control" name="nm_dokter"  />
                                    <input type="hidden" name="kd_dokter"  />
                                    <input type="hidden" name="mode" value="tambah" />
                                </div>
                                <div class="input-group" >
                                    <label class="input-group-addon"> Jenis Kelamin </label>
                                    <select disabled name="jk" class="form-control" >
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                </div>
                                <div class="input-group" >
                                    <label class="input-group-addon"> Golongan Darah </label>
                                    <select disabled name="gol_drh" class="form-control" >
                                        <option >A</option>
                                        <option >B</option>
                                        <option >O</option>
                                        <option >AB</option>
                                        <option >-</option>
                                    </select>
                                </div>
                                <div class="input-group">
                                    <label class="input-group-addon">Tempat Lahir</label>
                                    <input disabled type="text" class="form-control" name="tmp_lahir"  />
                                </div>
                                <div class="input-group">
                                    <label class="input-group-addon">Tanggal Lahir</label>
                                    <input disabled type="text" class="form-control" name="tgl_lahir"  />
                                </div>
                                <div class="input-group">
                                    <label class="input-group-addon">Agama</label>
                                    <input disabled type="text" class="form-control" name="agama"  />
                                </div>
                                <div class="form-group">
                                    <textarea disabled name="almt_tgl" style="margin-top:5px;resize:none;" class="form-control" placeholder="Alamat tempat tinggal"></textarea>
                                </div>
                                </div>
                                <div class="col-lg-6">
                                <div class="form-group">
                                    <textarea disabled name="alumni" style="resize:none;" class="form-control" placeholder="Alumni"></textarea>
                                </div>
                                <div class="input-group">
                                    <label class="input-group-addon"> Status Nikah </label>
                                    <select disabled name="stts_nikah" class="form-control" >
                                        <option value="SINGLE">Single</option>
                                        <option value="MENIKAH">Menikah</option>
                                        <option value="JANDA">Janda</option>
                                        <option value="DUDHA">Dudha</option>
                                        <option value="JOMBLO">Jomblo</option>
                                    </select>
                                </div>
                                <div class="input-group">
                                    <label class="input-group-addon"> No Ijin Praktek </label>
                                    <input disabled type="text" class="form-control" name="no_ijn_praktek"  />
                                </div>
                                <div class="input-group">
                                    <label class="input-group-addon"> Nomor Telp </label>
                                    <input disabled type="text" class="form-control" name="no_telp"  />
                                </div>
                                <input type="hidden" name="kd_sps" value="1" />
                                <div class="input-group">
                                    <label class="input-group-addon"> Spesialis </label>
                                    <input class="form-control" name="autocomplete" placeholder="Cari spesialis dokter" />
                                </div>
                                </div>
                                <div class="ui-front"></div>
                            </form>
                           </div>
                            <div style="margin-top:15px;" id="pesan-error"></div>`,
                    header:'<h4>Tambah Dokter</h4>',
                    footer:'<button disabled class="btn btn-danger pull-left" data-tombol="simpan">Simpan</button>',
                }
            });
            dispatch({type:'UPDATE_MODAL_SIZE',value:'lg'});
        });
    }
    __initiateAutoComplete(){
        //alert( typeof $.combobox )
        $('.modal input[name="autocomplete"]').autocomplete({
            appendTo: ".ui-front",
            source: (req , add)=>{
                let data = {accesstoken:this.props.accesstoken , search :req.term }
                $.ajax({
                    url:window.helmi.api + 'master-spesialis/get/',
                    dataType:'json',
                    data,
                    beforeSend: req =>{
                        $('.modal input[name="autocomplete"]').attr('disabled','disabled')
                    },
                    complete: res =>{
                        $('.modal input[name="autocomplete"]').removeAttr('disabled')
                    }
                }).then(res =>{
                    if(res.data){
                        let {data} = res ;
                        data.forEach( val =>{
                            val.label = val.nm_sps ;
                        })
                        add(data)
                    }
                }).catch(res =>{
                    if(res.responseJSON.errors){
                        let {errors} = res.responseJSON,val={};
                        errors.forEach( valz => val=valz )
                        $('.modal #pesan-error').html(`
                        <div class="alert alert-danger"><strong>Error : </strong>${val.message ? val.message : ''}</div>
                    `);
                    }
                })
            },
            select: ( e , item)=>{
                $('input[name="kd_sps"]').val(item.item.kd_sps)
            }
        });
    }
    componentDidMount(){
        window.helmi.that = this;
        this.totalTabel =0;
        this.searchQuery='';
        this.page='master-dokter';
        this.errors=[];

        let {that} = window.helmi;
        this.__generateModalForm();

       $(document).on('click','[data-tombol]', function(e) {
            e.preventDefault();
            let data,id = ( typeof $(this).attr('data-id') !== 'undefined' ) ? $(this).attr('data-id') : '' ;
       		switch($(this).attr('data-tombol')){
                case 'tambah':
                    data = {accesstoken:that.props.accesstoken};
                    that.props.dispatch( dispatch =>{
                        dispatch({type:'UPDATE_MODAL_SIZE',value:'lg'});
                        dispatch({type:'TOGGLE_MODAL',value:true})
                        $('.modal button,.modal input,.modal select,.modal textarea').removeAttr('disabled')
                        that.__initiateAutoComplete();

                    })
                    break;
                case 'edit':
                    data = {accesstoken:that.props.accesstoken};
                    that.props.dispatch( dispatch =>{
                        dispatch({type:'UPDATE_MODAL_SIZE',value:'lg'});
                        dispatch({type:'TOGGLE_MODAL',value:true})
                        $('.modal .modal-title').html('<div><h4>Edit ID : '+id+' </h4></div>')
                        $.ajax({
                            url:window.helmi.api + that.page +'/get/'+ id,
                            data,
                            dataType:'json',
                        }).then( res => {
                            if(res.success){
                                let k ='',{data} = res;
                                data.mode = 'edit'
                                for( k in data ){
                                    $('form[data-tombol="form"] [name="'+k+'"]').val(data[k])
                                }
                                $('.modal button,.modal input,.modal select,.modal textarea').removeAttr('disabled')
                                that.__initiateAutoComplete();
                            }

                        }).catch( res =>{
                            if(res.responseJSON.errors){
                                let {errors} = res.responseJSON;
                                errors.forEach( val =>{
                                    $('.modal #pesan-error').html(`
                                        <div class="alert alert-danger"><strong>Error : </strong>${val.message ? val.message : ''}</div>
                                    `);
                                })
                            }
                        })
                    })
                    break;
                case 'hapus':
                    that.props.dispatch( dispatch =>{
                        dispatch({type:'UPDATE_MODAL_SIZE',value:'sm'});
                        dispatch({type:'TOGGLE_MODAL',value:true});
                        $('.modal .modal-title').html('<div><h4>Delete ID : '+id+' </h4></div>')
                        $('.modal .modal-body').html(`
                            <div class="row" style="text-align:center">
                                <form data-tombol="form">
                                    <input type="hidden" name="kd_dokter" />
                                    <input type="hidden" name="mode" value="delete" />
                                </form>
                                <h4>Continue ?</h4>
                                <button class="btn btn-warning" data-tombol="simpan"> DELETE </button>
                            </div>
                            <p></p>
                            <div class="row" id="pesan-error"></div>
                        `)
                        $('.modal .modal-body input[name="kd_dokter"]').val(id)
                    })
                    break;
       			case 'simpan': $('form[data-tombol="form"]').trigger('submit'); break;
       			default:break;
       		}
       });
       $(document).on('submit','form[data-tombol="form"]',function(e){
            let formData = $('.modal form').serializeArray(),data=[];
            formData.forEach( val =>{
                data[val.name] = val.value
            })

            var {that} = window.helmi ;
       		data = {...data,accesstoken:that.props.accesstoken};
       		$.ajax({
       			url: window.helmi.api + that.page +'/insert_update_delete',
       			data,
       			type:'POST',dataType:'json',
       			success:(resp)=>{
       				if(resp.success && resp.message ){
       					if(resp.total){
       						that.totalTabel += parseInt(resp.total,10) ;
       					}
       					$('.modal #pesan-error').html(`
             				<div class="alert alert-success"><strong>Success : </strong>${resp.message}</div>\
             			`);
             			setTimeout(()=>{
                            that.props.dispatch({type:'TOGGLE_MODAL',value:'false'});
                            that.totalTabel = 0;
             				that.dataTable.ajax.reload(null, false);
             			},1000);
       				}
       			},beforeSend:function(){
       				$('.modal [data-tombol]').attr('disabled','disabled');
       			},complete:function(){
       				$('.modal [data-tombol]').removeAttr('disabled');
       			}
       		}).catch( res =>{
                if(res.responseJSON.errors){
                    let {errors} = res.responseJSON,valz='';
                    //console.log( ReactDOMServer.renderToStaticMarkup(html) );
                    errors.forEach( val =>{
                        valz += `<div class="alert alert-danger"><strong>Error : </strong>${val.message ? val.message : ''}</div>`;
                    })
                    $('.modal #pesan-error').html( valz );
                }
            });
       		e.preventDefault();

       });

        this.dataTable = $('#tempat-table-crud table').DataTable({
            destroy: true,
            processing: true,
            serverSide: true,
            searching: false,
            ajax: {
                url: window.helmi.api + that.page +'?errorcode=false',
                data: d => {
                    d.accesstoken = that.props.accesstoken;
                    d.totalrow = that.totalTabel;
                    d.cari = that.searchQuery;
                },
                beforeSend: req => {
                    $('#tempat-table-crud table tbody').html('<tr><td colSpan="3"> <h3>Loading ...</h3> </td></tr>');
                },
                type: "POST",
                error: xhr => {
                    if(typeof xhr.responseJSON !== 'undefined' && xhr.responseJSON.errors){
                        let {errors} = xhr.responseJSON;
                        if(errors){
                            that.props.dispatch({type:'PAGE_AJAX_ERROR',value:errors}) ;
                        }
                    }
                },
                dataSrc: json => {
                    if(!json.data)json.data=[];
                    if(!json.recordsTotal)json.recordsTotal=0;
                    if(!json.recordsFiltered)json.recordsFiltered=0;
                    if(json.errors){
                        that.props.dispatch({type:'PAGE_AJAX_ERROR',value:json.errors}) ;
                    }
                    that.totalTabel = json.recordsTotal;

                    let data =[] ,no=0,kk='';
                    if(json.data.length > 0){
                        json.data.forEach( (val,k) => {
                            no=0; data[k]=[];
                            for( kk in val ){
                                data[k][no]=val[kk].replace(/</g,'&lt;').replace(/>/g,'&gt;');
                                no++;
                            }
                            data[k][no]=`
                                <button class="btn btn-action btn-danger" data-id="${data[k][0]}" data-tombol="hapus"><i class="fa fa-times"></i></button>
                                <button class="btn btn-action btn-info" data-id="${data[k][0]}" data-tombol="edit"><i class="fa fa-gear"></i></button>
                            `;
                        })
                        //json.data =data;
                    }
                    return data;
                }
            },
            columns:[
                {name: "kd_dokter",searchable: false,  class: "text-center", width: "5%"},
                {name: "nm_dokter",orderable:false},
                {name: "action",orderable: false,searchable: false, class: "text-center", width: "15%"}
            ],
            bStateSave:true,
            //pagingType:'bootstrap_extended'
        });

    }

    shouldComponentUpdate() {
        return false;
    }

    render(){
        return(
            <div id="tempat-table-crud" className="table-responsive">
                <table className="table table-striped table-bordered table-hover table-checkable order-column" >
                    <thead>
                        <tr>
                            <th> ID </th>
                            <th> Nama  </th>
                            <th> Action </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td colSpan="3"> <h3>Loading ...</h3> </td></tr>
                    </tbody>
                </table>

            </div>
        );
    }
}
