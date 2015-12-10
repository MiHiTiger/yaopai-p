var React = require('react');
var Reflux = require('reflux');
var validator = require('validator');
var Header = require('./../header');
var AlbumsActions = require('../../actions/AlbumsActions');
var AlbumsStore = require('../../stores/AlbumsStore');
var EditAlbumModal = require('./editAlbumModal');
var UploadPhotoModal = require('./uploadPhotoModal');

var RightAlbumInfo = React.createClass({
  mixins: [Reflux.listenTo(AlbumsStore, 'onStoreChanged')],
  getInitialState: function () {
    return {
      categories: null
    }
  },
  onStoreChanged: function (data) {
    if (data.hintMessage) {
      console.log(data.hintMessage);
    } else {
      this.setState({categories: data.categories});
    }
  },
  componentDidMount: function () {
    var data = {
      Fields: 'Id,Name'
    };
    AlbumsActions.getCategories(data)
  },
  render: function () {
    if (this.props.work && this.props.work.CategoryId && this.state.categories) {
      var album = this.props.work;
      var category = this.state.categories.find(function (obj) {
        return obj.Id == album.CategoryId;
      })
      var status = "";
      if (album.State == 0) {
        status = "未审核";
      } else if (album.State == 1) {
        status = "审核通过";
      } else if (album.State == 2) {
        status = "审核失败";
      }
      return (
        <div>
          <EditAlbumModal album={album} categories={this.state.categories}/>
          <UploadPhotoModal album={album} uploadHandle={this.props.uploadHandle}/>

          <div>作品名称：{album.Title}</div>
          <div>作品简述：{album.Description}</div>
          <div>类 别：{category.Name}</div>
          <div>提供服务：{album.Service}</div>
          <div>定 价：{album.Price}</div>
          <div>状 态：{status}</div>
          <div>添加时间：{album.CreationTime}</div>
          <div>最后编辑时间：{album.EditingTime}</div>
        </div>
      );
    } else {
      return (
        <div>
        </div>
      )
    }
  }
});

module.exports = RightAlbumInfo;
