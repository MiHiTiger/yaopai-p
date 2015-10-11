var React = require('react');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var Radium = require('radium');

var Reflux = require('reflux');
var UserStore = require('../stores/UserStore');
var UserActions = require('../actions/UserActions');

var AlertBox = require('./user/alertBox');
var InfoHeader = require('./infoHeader');

var UserPhone = React.createClass({
  render: function () {
    var style = {
      phone: {
        marginBottom: '40px',
      },
      labelWrap: {
        textAlign: 'right',
      },
      label: {
        marginLeft: '10px',
      }
    }
    return (
      <div className="form-group" style={style.phone}>
        <div className="col-xs-2" style={style.labelWrap}>
          <span className="glyphicon glyphicon-earphone" aria-hidden="true"></span>
          <label className="control-label" style={style.label}>个人手机</label>
        </div>
        <div className="col-xs-4">
          <input className="form-control" />
        </div>
      </div>
    );
  }
});

var PasswordInput = React.createClass({
  getDefaultProps : function(){
    return{
      textClassName : 'col-sm-4',
      validatedClass : '',
    }
  },
  getValue : function(){
    return this.refs.passwordInput.getValue();
  },
  render : function(){
    return (
      <Input
        ref="passwordInput"
        type="password"
        bsStyle={this.props.validatedClass}
        label={this.props.labelName}
        placeholder={this.props.placeholderName}
        labelClassName='col-xs-2'
        wrapperClassName={this.props.textClassName}
        hasFeedback />
      );
  }
});

var ModifyPassword = React.createClass({
  mixins: [Reflux.listenTo(UserStore, 'handleModifyResult')],
  getInitialState : function(){
    return {
      alertMessage : '',
    }
  },
  /*
    接收修改密码结果
  */
  handleModifyResult : function(data){
    if(data.flag != "modifyPassword")return;
    this.setState({alertMessage : data.hintMessage});
  },
  handleModifyPassword : function(){
    var oldPass = this.refs.oldPass.getValue();
    var newPass = this.refs.newPass.getValue();
    var newPassRepeat = this.refs.newPassRepeat.getValue();
    if(!oldPass || oldPass=='') {
      this.setState({alertMessage:'原密码不能为空！'});
      return;
    }
    if(oldPass == newPass){
      this.setState({alertMessage : '新密码不能和原密码一样！'});
      return;
    }
    if(newPass != newPassRepeat){
      this.setState({alertMessage : '两次输入密码不一致！'});
      return ;
    }
    if(newPass.length <6 || newPass.length > 18){
      this.setState({alertMessage:'密码长度必须大于6，小于18'});
    }
    UserActions.modifyPassword({rawPassword:oldPass,newPassword:newPass});
  },
  render : function () {
    var style = {
      labelWrap: {
        textAlign: 'right',
      },
      label: {
        marginLeft: '10px',
      }
    }
    return (
      <div>
        <div className="form-group">
          <div className="col-xs-2" style={style.labelWrap}>
            <span className="glyphicon glyphicon-lock" aria-hidden="true"></span>
            <label className="control-label" style={style.label}>修改密码</label>
          </div>
        </div>
        <PasswordInput ref="oldPass" labelName="当前密码" />
        <PasswordInput ref="newPass" labelName="新密码" />
        <PasswordInput ref="newPassRepeat" labelName="确认密码" />
        <Button bsStyle="primary" className="col-xs-offset-3" onClick={this.handleModifyPassword}>保存</Button>
        <AlertBox alertMessage={this.state.alertMessage} />
      </div>
    );
  }
});

var ThirdPartLogin = React.createClass({
  render : function(){
    var style = {
      title: {
        marginBottom: '40px',
        marginTop: '60px',
        textAlign: 'right',
        borderTop: '1px solid #e8e8e8',
      },
      label: {
        marginLeft: '10px',
      },
      words: {
        paddingLeft: '100px',
      },
      /*按钮等宽*/
      commonButton: {
        width: '100px',
      },
      removeButton: {
        width: '100px',
        backgroundColor: '#777777',
        color: '#fff',
        marginRight: '15px',
      },
      lineH: {
        lineHeight: '50px',
        height: '50px',
      },
      weibo: {
        background: 'url(img/weibo.png) no-repeat left center',
        textIndent: '60px',
      },
      wechat: {
        background: 'url(img/account-wechat.png) no-repeat left center',
        textIndent: '60px',
      }
    };
    return(
      <div className="form-group">
        <div className="row" style={style.title}>
          <div className="col-xs-2">
            <span className="glyphicon glyphicon-user" aria-hidden="true"></span>
            <label className="control-label" style={style.label}>第三方登录</label>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-6" style={style.words}>
            <h5>应用</h5>
            <p style={[style.weibo, style.lineH]}>新浪微博</p>
            <p style={[style.wechat, style.lineH]}>微信</p>
          </div>
          <div className="col-xs-6">
            <h5>状态</h5>
            <p style={style.lineH}>
              <Button style={style.removeButton}>已绑定</Button>
              <Button bsStyle="danger" style={style.commonButton}>解绑</Button>
            </p>
            <p style={style.lineH}>
              <Button bsStyle="primary" style={style.commonButton}>绑定</Button>
            </p>
          </div>
        </div>
      </div>
    );
  }
});
ThirdPartLogin = Radium(ThirdPartLogin);
var AccountInfo = React.createClass({

  render: function() {
    var style = {
      outer: {
        backgroundColor: '#fff',
        padding: '40px 60px 70px 60px',
        color: '#777777',
      },
    };
    return (
      <div style={style.outer}>
        <InfoHeader infoTitle="账户信息" infoIconClass="glyphicon glyphicon-cog"/>
        <form className='form-horizontal'>
          <UserPhone />
          <ModifyPassword />
          <ThirdPartLogin />
        </form>
      </div>
      // <Panel>
      //     <InfoHeader />
      //     <form className='form-horizontal'>
      //       <ModifyPassword />
      //     </form>
      //     <ThirdPartLogin />
      // </Panel>
    );
  }
});

module.exports = AccountInfo;