var Reflux = require('reflux');
var HttpFactory = require('util/HttpFactory');
var API = require('util/api');

var AlbumsActions = Reflux.createActions({
  'get':{children : ['success','failed']},
  'add':{children : ['success','failed']},
  'update':{children : ['success','failed']},
  'delete':{children : ['success','failed']},
  'search':{children : ['success','failed']},
  'getMyAlbums' : {children : ['success','failed']},
  'getCategories' :{children:['success','failed']},
  'onSale' : {children:['success','failed']},
  'offSale' : {children:['success','failed']},
  'getTagList' : {children:['success','failed']},
  'sorting' : {children:['success','failed']},
});

AlbumsActions.add.listen(function(data){
  HttpFactory.post(API.ALBUMS.add,data,this.success,this.failed);
});
AlbumsActions.get.listen(function(data){
  HttpFactory.post(API.ALBUMS.get,data,this.success,this.failed);
});
AlbumsActions.update.listen(function(data){
  HttpFactory.post(API.ALBUMS.update,data,this.success,this.failed);
});
AlbumsActions.delete.listen(function(data){
  HttpFactory.post(API.ALBUMS.delete,data,this.success,this.failed);
});
AlbumsActions.search.listen(function(data){
  HttpFactory.post(API.ALBUMS.search,data,this.success,this.failed);
});
AlbumsActions.getMyAlbums.listen(function(data){
  HttpFactory.post(API.ALBUMS.search,data,this.success,this.failed);
});
AlbumsActions.getCategories.listen(function(data){
  HttpFactory.post(API.ALBUMS.categories,data,this.success,this.failed);
});
AlbumsActions.onSale.listen(function(data){
  HttpFactory.post(API.ALBUMS.onSale,data,this.success,this.failed);
});
AlbumsActions.offSale.listen(function(data){
  HttpFactory.post(API.ALBUMS.offSale,data,this.success,this.failed);
});
AlbumsActions.sorting.listen(function(data){
  HttpFactory.post(API.ALBUMS.sorting,{Ids:data},this.success,this.failed);
});

AlbumsActions.getTagList.listen(function () {
  var data = {
    Fields : 'id,name,display,tags.id,tags.name,tags.display,tags.sorting'
  }
  HttpFactory.post(API.TAG.list,data,this.success,this.failed);
});

module.exports = AlbumsActions;
