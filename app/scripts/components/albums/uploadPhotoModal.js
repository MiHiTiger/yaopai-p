var React = require('react');
var Reflux = require('reflux');
var AlbumsActions = require('../../actions/AlbumsActions');
var AlbumsStore = require('../../stores/AlbumsStore');
var Button = require('react-bootstrap').Button;
var Modal = require('react-bootstrap').Modal;
var ModalHeader = require('react-bootstrap').ModalHeader;
var ModalTitle = require('react-bootstrap').ModalTitle;
var ModalBody = require('react-bootstrap').ModalBody;
var ModalFooter = require('react-bootstrap').ModalFooter;
var InfoHeader = require('../infoHeader');
var ChooseImage = require('../account/chooseImage');
var ToolTip = require('../toolTip');
var WorkStore = require('../../stores/WorkStore');

var UploadPhotoModal = React.createClass({
  mixins: [Reflux.listenTo(AlbumsStore, 'onStoreChanged'), Reflux.listenTo(WorkStore, 'onWorkStoreChange')],
  getInitialState: function () {
    return {
      photos: [],
      cut:'',
      show: false,
      submit:false
    }
  },
  getDefaltProps: function () {
    return {
      value: 0,
      onChange: function (data) {
      },
    }
  },
  componentWillReceiveProps : function (nextProps) {
    this.setState({show:nextProps.show})
  },
  hideImgModal: function () {
    this.setState({photos: [],show: false});
    this.props.hideHandle()
  },
  handleImgSubmit: function () {
    var data = this.props.album;
    this.props.album.Photos.map(function (photo, i) {
      data['photos[' + i + '].Url'] = photo.Url;
      data['photos[' + i + '].Description'] = photo.Description;
    })
    var photocount = this.props.album.Photos.length;
    this.state.photos.map(function (photo, i) {
      if (photo.isCover) {
        data.Cover = photo.Url;
      }
      var photoindex = photocount + i;
      data['photos[' + photoindex + '].Url'] = photo.Url;
      data['photos[' + photoindex + '].Description'] = photo.Description;
    });
    if (this.state.cut) {
      data.Cut = this.state.cut;
    }
    AlbumsActions.update(data);
    alert('上传成功!');
    this.setState({submit:true});
  },
  onStoreChanged: function (data) {
    if (data.hintMessage) {
      this.showMessage(data.hintMessage)
    } else {
      if (data.flag == 'get') {
        //处理get请求结果
      }
      if (data.flag == 'update') {
        if(this.state.submit){
          this.showMessage('上传成功，您可以继续上传');
        }
        this.props.uploadHandle();
        this.setState({submit:false});
        //清空数据
        this.setState({
          photos: [],
          coverUrl:'',
          show: false,
        });
        this.hideImgModal();
      }
    }
  },
  onWorkStoreChange: function (data) {
    if(data.flag == 'onSetCut'){
      this.setState({cut : data.cut});
    }else {
      //处理封面
      var cover = -1;
      for (var i = 0; i < data.length; i++) {
        if (data[i].isCover) cover = i;
      }
      this.setState({photos: data, cover: cover});
    }
  },
  showMessage : function(message){
    this.props.showMessage(message);
  },
  render: function () {
    return (
      <div>
        <Modal
          show={this.state.show}
          onHide={this.hideImgModal}
          dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg"></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InfoHeader infoTitle="作品图添加" infoIconClass="glyphicon glyphicon-picture" titleImage=""/>
            <form className='form-horizontal'>
              <ChooseImage value={this.state.photos} ref="chooseImage"/>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleImgSubmit}>提交</Button>
          </Modal.Footer>
        </Modal>
        <ToolTip ref="toolTip" title=""/>
      </div>
    );
  }
});

module.exports = UploadPhotoModal;