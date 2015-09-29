var Reflux = require('reflux');
var AccountActions = require('../actions/AccountActions');
var data = [];

var AccountStore = Reflux.createStore({
  accountData : {},
  init: function() {
    console.log('AccountStore initialized');
    this.accountData = {
      avator : '',
      hintMessage : '',
      flag : '',
    };
    this.listenTo(AccountActions.changeAvator.success,this.onChangeAvatorSuccess);
    this.listenTo(AccountActions.changeAvator.failed,this.onChangeAvatorFailed);
  },

  onChangeAvatorSuccess : function(data){
    if(data.Success){
      this.accountData.hintMessage = '用户头秀修改成功！';
    }else{
      this.accountData.hintMessage = data.ErrorMsg;
    }
    console.log(data);
    this.accountData.flag = 'avator';
    this.trigger(this.accountData);
  },
  onChangeAvatorFailed : function(data){
    this.accountData.hintMessage = '网络错误，请重试！';
    this.accountData.flag= "avator";
    this.trigger(this.accountData);
  },

});

module.exports = AccountStore;