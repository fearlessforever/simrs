const ls = function(){
    this.set = function(a,b){
        if (typeof(Storage) !== "undefined") {
            return window.localStorage.setItem(a,b);
        }else{
            console.log('NO STORAGE');
            return false;
        }       
	}
    
	this.get = function (a){
        if (typeof(Storage) !== "undefined") {
            return  window.localStorage.getItem(a) ;
        }else{
            console.log('NO STORAGE');
            return false;
        }
	}
	this.remove = function (a){
        if (typeof(Storage) !== "undefined") {
            return window.localStorage.removeItem(a);
        }else{
            console.log('NO STORAGE');
            return false;
        }
    } 
    
	return this;
}
const LS = new ls();
export default LS;