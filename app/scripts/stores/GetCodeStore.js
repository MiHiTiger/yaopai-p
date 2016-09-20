var Reflux = require('reflux');

var GetCodeActions = require('../actions/GetCodeActions');
var data = [];

/*
  获取验证码store
*/
var GetCodeStore = Reflux.createStore({

  init: function() {
    //记录发送验证码的时间
    this.getCode = {
      timeID : null,
      left : 0,
      result : ''
    }
    this.listenTo(GetCodeActions.sendTelRegister,this.onBeginTelRegister);
    this.listenTo(GetCodeActions.sendTelRegister.success,this.onTelRegisterSucess);
    this.listenTo(GetCodeActions.sendTelRegister2,this.onBeginTelRegister);
    this.listenTo(GetCodeActions.sendTelRegister2.success,this.onTelRegister2Success);
  },
  onBeginTelRegister : function(){
    this.getCode.left = 60;
    var countLeft = function(){
      this.getCode.left = this.getCode.left -1;
      this.trigger(this.getCode);
      this.timeID = setTimeout(countLeft, 1000);
    }.bind(this);
    countLeft();
  },
  onTelRegisterSucess : function(data){
    if(data.Success){
      //this.getCode.result = '验证码已发送';
    }else{
      clearTimeout(this.timeID)
      this.timeID = null;
      if(data.ErrorCode == '200002'){
        this.getCode.result = '该手机号已注册可直接登录';
        this.getCode.left = 0;
      }else{
        this.getCode.result = '验证码发送失败';
        this.getCode.left = 0;
      }
    }
    this.trigger(this.getCode);
  },
  onTelRegister2Success : function(data){
    if(data.Success){
      //this.getCode.result = '验证码已发送';
    }else{
      clearTimeout(this.timeID)
      this.timeID = null;
      if(data.ErrorCode == '200002'){
        this.getCode.result = '该手机号已注册可直接登录';
        this.getCode.left = 0;
      }else if(data.ErrorMsg == '验证码错误'){
        this.getCode.result = '图片验证码错误';
        this.getCode.left = 0;
      }else{
        this.getCode.result = '验证码发送失败';
        this.getCode.left = 0;
      }
    }
    this.trigger(this.getCode);
  },
});

module.exports = GetCodeStore;
