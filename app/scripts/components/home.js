var React = require('react');
var IndexCover = require('./indexCover');
var ToolTip = require('./toolTip');

var validator = require('validator');
var Reflux = require('reflux');
var GetCodeStore = require('../stores/GetCodeStore');
var GetCodeActions = require('../actions/GetCodeActions');
var UserActions = require('../actions/UserActions');
var UserStore = require('../stores/UserStore');

var PhoneInput = React.createClass({
  getInitialState : function(){
    return({
      value : '',
    });
  },
  getValue : function(){
    return this.state.value;
  },
  handleChange : function(event){
    this.setState({value : event.target.value});
  },
  render : function(){
    var textStyle = {
      width: '300px',
      height: '45px',
      border: '1px solid #FFFFFF',
      display: 'block',
      boxSizing: 'border-box',
      background: 'rgba(0,0,0,0.5)',
      opacity : '0.5',
      marginBottom : '10px',
      padding : '5px',
      color : '#fff'
    };
    return (
      <div>
        <input ref="phone" 
          type="text" 
          value={this.state.value} 
          placeholder="请输入您的手机号" 
          style={textStyle} 
          onChange={this.handleChange} />
      </div>
    );
  }
});
var PasswordInput = React.createClass({
  getInitialState : function(){
    return({
      value : '',
    });
  },
  handleChange : function(event){
    this.setState({value : event.target.value});
  },
  getValue : function(){
    return this.state.value;
  },
  render : function(){
    var textStyle = {
      width: '300px',
      height: '45px',
      border: '1px solid #FFFFFF',
      display: 'block',
      boxSizing: 'border-box',
      background: 'rgba(0,0,0,0.5)',
      opacity : '0.5',
      marginBottom : '10px',
      padding : '5px',
      color : '#fff'
    };
    return (
      <div>
        <input type="password" placeholder="请输入您的密码" style={textStyle} onChange={this.handleChange}/>
      </div>
    );
  }
});
var LoginButtonn = React.createClass({
  render : function(){
    var buttonStyle = {
      width : '300px',
      height : '45px',
      backgroundColor : '#3F7BB4',
      color: '#fff',
      fontSize: '20px',
      textAlign : 'center',
      paddingTop : '10px;',
      cursor : 'pointer',
    };
    var textStyle ={
      color : '#8d8d8d',
      fontSize : '11px',
    };
    var ruleStyle ={
      color : '#fff',
      fontSize : '11px',
    };
    var openLogin = {
      color : '#fff',
      fontSize : '14px',
      textAlign : 'left',
      width : '300px',
      marginTop : '10px',
    }
    return (
      <div>
        <span style={textStyle}>点登录表示您已阅读同意</span><span style={ruleStyle}>《YAOPAI服务条款》</span>
        <div style={buttonStyle}>登录</div>
        <div style={openLogin}><span>社交账号直接登录</span><img src="img/wechat.png" /></div>
        <div style={openLogin}><span>还没有账号？先注册</span></div>
      </div>
    );
  }
});

var ValidateCodeInput = React.createClass({
  mixins: [Reflux.listenTo(GetCodeStore, 'handleResult')],
  getInitialState : function(){
    return{
      validated : '0',
      getCode : {left : 0 , result : ''} ,
    }
  },
  getDefaultProps : function(){
    return {
      validatedClass : function(){
        return 'form-group';
      },
      code : ''
    }
  },
  handleResult : function(){
    this.setState({getCode : GetCodeStore.getCode});
  },
  handleChange : function(event){
    this.setState({value : event.target.value});
  },
  getValue : function(){
    return this.state.value;
  },
  render : function(){
    var classString = this.props.validatedClass(this.state.validated);
    var getCodeButton ;
    var codeStyle = {
      width: '180px',
      height: '45px',
      border: '1px solid #FFFFFF',
      display: 'block',
      boxSizing: 'border-box',
      background: 'rgba(0,0,0,0.5)',
      opacity : '0.5',
      marginBottom : '10px',
      padding : '5px',
      color : '#fff',
      float : 'left'
    };
    var codeBtnStyle = {
      width : '120px',
      height : '45px',
      border: '1px solid #FFFFFF',
      display: 'block',
      boxSizing: 'border-box',
      background: 'rgba(0,0,0,0.5)',
      opacity : '0.5',
      marginBottom : '10px',
      paddingTop : '5px',
      padding : '5px',
      color : '#fff',
      float : 'left',
      cursor : 'pointer',
    };
    if(this.state.getCode.left > 0){
      getCodeButton = (
        <div style={codeBtnStyle}>获取验证码({this.state.getCode.left})</div>
        );
    }else{
      getCodeButton = (
        <div style={codeBtnStyle} onClick={this.props.handleGetCode} >获取验证码</div>
        )
    }
    return(
      <div>
        <input type="text" 
          placeholder="输入验证码" 
          onChange={this.handleChange} style={codeStyle}/>
        {getCodeButton}
      </div>
    );
  }
});
var RegisterButtons = React.createClass({
  handleReg: function () {
    this.props.handleReg();
  },
  render : function(){
    var buttonStyle = {
      width : '300px',
      height : '45px',
      backgroundColor : '#3F7BB4',
      color: '#fff',
      fontSize: '20px',
      textAlign : 'center',
      paddingTop : '10px;',
      cursor : 'pointer',
    };
    var textStyle ={
      color : '#8d8d8d',
      fontSize : '11px',
    };
    var ruleStyle ={
      color : '#fff',
      fontSize : '11px',
    };
    var openLogin = {
      color : '#fff',
      fontSize : '14px',
      textAlign : 'left',
      width : '300px',
      marginTop : '10px',
    }
    return (
      <div>
        <span style={textStyle}>点登录表示您已阅读同意</span><span style={ruleStyle}>《YAOPAI服务条款》</span>
        <div style={buttonStyle} onClick={this.props.handleRegister}>注册</div>
        <div style={openLogin}><span>社交账号直接登录</span><img src="img/wechat.png" /></div>
        <div style={openLogin}><span>已经有账号？直接登录</span></div>
      </div>
    );
  }
});
var LoginForm = React.createClass({

  render: function() {
    var loginStyle = {
      width : '368px',
      height : '500px',
      background: 'rgba(0,0,0,0.7)',
      margin : '0 auto',
      padding : '30px',
      position : 'relative',
      top : '100px',
      textAlign: 'center',
    };
    var imageCenter = {
      margin : '0px auto',
      marginBottom : '10px',
      opacity : '0.7'
    }
    return (
      <div style={loginStyle}>
        <img style={imageCenter} src="img/logo1.png" />
        <img style={imageCenter} src="img/logo2.png" />
        <PhoneInput />
        <PasswordInput />
        <LoginButtonn />
      </div>
    );
  }
});

var RegisterForm = React.createClass({
  mixins: [Reflux.listenTo(UserStore, 'handleRegisterResult')],
  handleGetCode : function(){
    var phone = this.refs.phoneInput.getValue();
    var isMobile = validator.isMobilePhone(phone,'zh-CN')
    if(isMobile){
      GetCodeActions.sendTelRegister({tel:phone});
    }else{
      this.props.handleReg('请输入正确的手机号码');
    }
  },
  handleRegister : function(){
    var phone = this.refs.phoneInput.getValue();
    var code = this.refs.codeInput.getValue();
    var password = this.refs.passwordInput.getValue();
    var isMobile = validator.isMobilePhone(phone,'zh-CN');
    if(!isMobile){
      this.props.handleReg('请输入正确的手机号码');
      return;
    }
    if(!password){
      this.props.handleReg('请输入密码');
      return;
    }
    if(password.length < 6 || password.length > 18){
      this.props.handleReg('密码长度应在6-18之间');
      return;
    }
    if(!code){
      this.props.handleReg('请输入验证码');
      return;
    }
    if(code.length != 4){
      this.props.handleReg('请输入4位验证码');
    }
    var registerData = {tel : phone,password : password,code : code};
    UserActions.register(registerData);
  },
  handleRegisterResult : function(data){
    if(data.flag == 'register'){
      if(data.hintMessage){
        this.props.handleReg(data.hintMessage);
      }else{
        this.props.handleReg('注册成功，请登录！');
      }
    }
  },
  render : function(){
    var registerStyle = {
      width : '360px',
      height : '500px',
      background: 'rgba(0,0,0,0.6)',
      margin : '0 auto',
      padding : '18px 30px',
      position : 'relative',
      top: '50%',
      left: '50%',
      marginLeft: '-180px',
      marginTop: '-280px',
      textAlign: 'center',
    };
    var imageCenter = {
      margin : '0px auto',
      marginBottom : '10px',
      opacity : '0.7'
    };
    return (
      <div style={registerStyle}>
        <img style={imageCenter} src="img/logo1.png" />
        <img style={imageCenter} src="img/logo2.png" />
        <PhoneInput ref="phoneInput"/>
        <PasswordInput ref="passwordInput"/>
        <ValidateCodeInput ref="codeInput" handleGetCode = {this.handleGetCode}/>
        <RegisterButtons handleRegister={this.handleRegister}/>
      </div>
    );
  }
});

var Home = React.createClass({
  handleReg: function (title) {
    this.refs.toolTip.toShow(title);
  },
  render : function(){
    var bgStyle = {
      width : '100%',
      height : '100%',
      background : 'url(img/background1.jpg) no-repeat center center',
      backgroundColor : '#777777',
      backgroundSize : 'cover',
      position: 'fixed',
      top: '0',
      left: '0',
    };
    return (
      <div style={bgStyle}>
        <ToolTip ref="toolTip" title=""></ToolTip>
        <RegisterForm pass={false} handleReg={this.handleReg}/>
      </div>
    );
  }
});

module.exports = Home;
