var _ = require('lodash');
var React = require('react');
var Reflux = require('reflux');
var ReactAddons = require('react/addons');
var validator = require('validator');
var Panel = require('react-bootstrap').Panel;
var Button = require('react-bootstrap').Button;

var assert = require('assert');

var InfoHeader= require('./infoHeader');
var TextInput = require('./account/textInput');
var ChooseImage = require('./account/chooseImage');
var ToolTip = require('./toolTip');

var AlbumsStore = require('../stores/AlbumsStore');
// assert(AlbumsStore, 'store is ok'+ AlbumsStore);

var AlbumsActions = require('../actions/AlbumsActions');
var WorkStore = require('../stores/WorkStore');
var UserActions = require("../actions/UserActions");
var UserStore = require("../stores/UserStore");
var History = require('react-router').History;
/*
  选择类别组件
*/
var ChooseCategory = React.createClass({
  mixins : [Reflux.listenTo(AlbumsStore,'onGetCategories')],
  getInitialState : function(){
    return {
      categories : [],
      selectedTags: [], 
    }
  },

  componentWillMount : function(){
    AlbumsActions.getTagList();
  },
  onGetCategories : function(data){
    console.log('updated data', data);
    if(data.hintMessage){
      console.log(data.hintMessage);
    }else{
      console.log(data.tags)
      this.setState({tags : data.tags});
    }
  },
  setTag: function (event) {
      var tagId = event.target.getAttribute('data-category');
      tagId = parseInt(tagId);
      var tags = this.state.selectedTags;
      var locationOfTagId = tags.indexOf(tagId);
      var alreadySelected = locationOfTagId >= 0;

      if ( !alreadySelected ){
        //每个分类下最多设置三个标签
        var allTags = this.state.tags;
        var isBreak = false;
        allTags.forEach(function (item) {
          var ids = _.map(item.Tags, 'Id');
          if(ids.indexOf(tagId) > -1){//判断所点击的标签是否是这个分类内的
            var tmp = _.intersection(ids, tags);//重复的内容
            if(tmp.length >= 3){
              isBreak = true;
            }
          }
        })
        if(!isBreak){
          tags.push(tagId);
        }
      }else{
        tags.splice(locationOfTagId, 1);
      }
      this.setState({selectedTags: tags});
      this.props.onChange(tags); 
  },

  render : function(){
    var style = {
      button: {
        width: '90px',
        height: '32px',
        marginRight: '9px',
        marginBottom: '10px',
      }
    }
    var currentTags = this.state.selectedTags;
    var onClickButton = this.setTag;
    // makeButton
    //
    // make Button component from tag data
    // tag - obj, {Id: 4, Name: "人像", Display: true}
    function makeButton (tag, i) {
      return (<Button key={i}
        bsStyle={(currentTags.indexOf(tag.Id) >=0) ? 'primary' : 'default'} 
        style={style.button}
        onClick={onClickButton}
        data-category={tag.Id} >
          {tag.Name}
        </Button>);
    }

    function makeTagRow (tagRow) {
      var buttons = tagRow.Tags.map(function (tag, i) {
        return makeButton(tag, i);
      });
      return(
        <div >
          <label className="control-label col-xs-3">{tagRow.Name}</label>
          <div className="col-xs-9">
            <div className="cont-category">
              {buttons}
            </div>
          </div>
        </div>
      );
    }

    function makeTagList (tagList) {
      var existTagList = (typeof tagList != 'undefined');
      var tags = (<div className="no tag list"></div>);
      if(existTagList){
        assert(typeof tagList != 'undefined', 'tagList must exist');
        tags = tagList.map(function (list) {
          return makeTagRow(list);
        })
      }
      return tags;
    }

    //目前没有做排序和是否显示    
    var tagList = makeTagList(this.state.tags);

    return (
      <div className="form-group">
        {tagList}
      </div>
    );
  }
});



/*
  上传作品组件
  用到通用的用户组件 ./account/*
    AccountHeader 
    TextInput
  注意事项：
  1.只有认证为摄影师后才能上传作品，否则上传接口会报错。应该判断用户类型，如果用户不是摄影师，跳转到摄影师认证。
  2.tags在第一版先不做。
  3. 在这个界面可以增加，修改相册
*/
var UploadWorks = React.createClass({
  mixins : [Reflux.listenTo(AlbumsStore,'onStoreChanged'),Reflux.listenTo(WorkStore,'onWorkStoreChange'),Reflux.listenTo(UserStore, 'isLogin'), History],
  getInitialState : function(){
    return {
      title : '',
      category : '',
      description : '',
      service : '',
      price : 0 ,
      cover : -1,
      photos : [],
      tags : 0,
      submit: false
    }
  },
  isLogin: function (data) {
    if (!data.isLogin) {
      //没有登录跳转到首页登录界面
      UserActions.logout(true);
      this.history.pushState(null, '/');
    }
  },
  onStoreChanged : function(data){
    if(data.flag == 'add'){
      console.log(data);
      if(data.hintMessage){
        this.showMessage(data.hintMessage)
      }else{
        this.showMessage('上传成功，您可以继续上传');
        //清空数据
        this.setState({
          title : '',
          category : '',
          description : '',
          service : '',
          price : 0 ,
          cover : -1,
          photos : [],
          tags : []
        });
        //同时要清空WorkStore的数据
        this.refs.chooseImage.clearImage();
        this.history.replaceState(null,'/profile/onSale');
      }
    }
    if(data.flag == 'get'){
      //处理get请求结果
    }
    if(data.flag == 'update'){
      //处理更新后的结果
    }
  },
  onWorkStoreChange : function(data){
    //处理封面
    var cover = -1;
    for(var i =0 ; i < data.length ; i ++){
      if(data[i].isCover) cover = i;
    }
    this.setState({photos : data,cover : cover});
  },
  updateTitle : function(title){
    this.setState({title: title});
  },
  updatePhotos : function(photos){
    this.setState({photos : photos});
  },
  updateTags : function(tags){
    this.setState({tags : tags}, function () {
      console.log('updateTags:', this.state.tags);
    });
  },
  updateDescription : function(des){
    this.setState({description : des});
  },
  updateService : function(service){
    this.setState({service : service});
  },
  updatePrice : function(price){
    this.setState({price : price});
  },
  updateCover : function(cover){
    this.setState({cover : cover});
  },
  validate : function(){
    if(this.state.title.length < 1 || this.state.title.length > 20){
      this.showMessage('作品名称必须在1-20字之间');
      return false;
    }
    if(this.state.photos.length == 0){
      this.showMessage('请至少上传一张作品');
      return false;
    }
    if(!this.state.tags.length>0){
      this.showMessage('请选择作品类别');
      assert(this.state.tags.length > 0, 'Number of tags should bigger than 0, but we have:' + this.state.tags);
      return false;
    }
    if(this.state.description.length < 15 || this.state.description.length > 1000){
      this.showMessage('作品描述必须在15-1000字之间');
      return false;
    }
    if(this.state.service.length < 15 || this.state.service.length > 1000){
      this.showMessage('服务描述必须在15-1000字之间');
      return false;
    }
    if(this.state.price && !validator.isInt(this.state.price)){
      this.showMessage('如果填写价格，必须为数字');
      return false;
    }
    if(this.state.cover < 0 ){
      this.showMessage('请选择一张作品作为封面');
      return false;
    }
    return true;
  },
  handleSubmit : function(){
    if(this.validate()){
      var data = {
        Title : this.state.title,
        CategoryId : 3,
        Description : this.state.description,
        Service : this.state.service,
        Price : this.state.price,
        Negotiable : this.state.price==0?true:false,
        Cover : this.state.photos[this.state.cover].Url,
        Tags: this.state.tags.join(',')
      }
      //针对后端要求，序列化数组
      this.state.photos.map(function(photo,i){
        data['photos['+i+'].Url'] = photo.Url;
        data['photos['+i+'].Description'] = photo.Description;
      });
      AlbumsActions.add(data);

      this.setState({submit:true});
    }
  },
  showMessage : function(message){
    this.refs.toolTip.toShow(message);
  },
  render: function() {
    var style = {
      outer: {
        backgroundColor: '#fff',
        padding: '40px 60px 70px 60px',
        color: '#777777',
      },
      submitButton: {
        width: '20%',
        height: '50px',
        marginRight: '70px',
        border: '1px solid #337ab7',
        backgroundColor: '#337ab7',
        color: '#fff',
        fontSize: '20px',
      },
      preview: {
        width: '20%',
        height: '50px',
        border: '1px solid #337ab7',
        color: '#337ab7',
        fontSize: '20px',
      },
      bottomWrap: {
        textAlign: 'center',
      }
    };
    //<Button style={style.preview}>预览</Button>
    return (
      <div style={style.outer}>
        <InfoHeader infoTitle="作品上传"infoIconClass="glyphicon glyphicon-picture" titleImage="" />
        <form className='form-horizontal'>
          <TextInput ref="workName"
            labelName="作品名称："
            value = {this.state.title}
            updateValue = {this.updateTitle}
            minLength={1}
            placeholder="名称应该在1-20字之间"/>
          <ChooseImage value={this.state.photos}
            ref="chooseImage"/>
          <ChooseCategory value={this.state.tags} onChange = {this.updateTags}/>
          <TextInput ref="workDescription"
            type="textarea"
            value = {this.state.description}
            updateValue = {this.updateDescription}
            labelName="作品简述："
            minLength={15}
            maxLength={1000}
            placeholder=""
            help="作品描述应该在15-1000字之间" />
          <TextInput ref="service"
            type="textarea"
            value={this.state.service}
            updateValue={this.updateService}
            labelName="提供服务："
            minLength={15}
            maxLength={1000}
            placeholder="服务内容请参考以下项目：①原片是否全送 ②精修片数量 ③是否提供化妆造型 ④是否提供服装 ⑤是否有影棚拍摄 ⑥拍摄几组 ⑦拍摄场景数量 ⑧服务时长 ⑨是否有实物产品，请具体说明 ⑩补充说明"
            help="服务描述应该在15-1000字之间" />
          <TextInput ref="price"
            labelName="是否定价："
            textClassName="col-xs-4"
            value={this.state.price}
            updateValue={this.updatePrice}
            placeholder="¥面议"/>
          <div className="row" style={style.bottomWrap}>
            <Button style={style.submitButton} onClick={this.handleSubmit} disabled={this.state.submit}>提交</Button>
            <ToolTip ref="toolTip" title=""/>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = UploadWorks;
