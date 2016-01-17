var Reflux = require('reflux');
var HttpFactory = require('../HttpFactory');
var API = require('../api');

var AccountActions = Reflux.createActions({
  'changeAvatar' : {children : ['success','failed']},
  'updateInfo' : {children : ['success','failed']},
  'userDetail' : {children : ['success','failed']},
  'getTagList' : {children:['success','failed']},
});

AccountActions.changeAvatar.listen(function (data) {
  HttpFactory.post(API.USER.changeAvatar ,data,this.success,this.failed);
});

AccountActions.updateInfo.listen(function(data){
  HttpFactory.post(API.USER.updateInfo, data, this.success, this.failed);
});

AccountActions.userDetail.listen(function(data){
  HttpFactory.post(API.USER.currentUserDetail,data,this.success,this.failed);
});

AlbumsActions.getTagList.listen(function () {
  var data = {
    Fields : 'id,name,display,tags.id,tags.name,tags.display'
  }
  HttpFactory.post(API.TAG.list,data,this.success,this.failed);
});

module.exports = AccountActions;
