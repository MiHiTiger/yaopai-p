import React from 'react'
import { History } from 'react-router'
import InfoHeader from './infoHeader'
import Reflux from 'reflux'
import UserAccountStore from '../stores/UserAccountStore'

/*
  本页面用于分角色上传作品
 */
var AlbumSummary = React.createClass({
  mixins: [
    History,
    Reflux.connect(UserAccountStore, 'user'),
  ],
  isPUpload : function(){
    var self = this
    if(!this.state.user.isPhotographerApply){
      alert('未提交摄影师认证或摄影师认证被拒,无法上传作品')
      return false
    }else{
      self.history.pushState(null, '/upload/photographer')
    }
  },
  isMUpload : function(){
    var self = this
    if(!this.state.user.isMoteApply){
      alert('未提交模特认证或模特认证被拒,无法上传作品')
      return false
    }else{
      self.history.pushState(null, '/upload/mote')
    }
  },
  isDUpload : function(){
    var self = this
    if(!this.state.user.isMakeupArtistApply){
      alert('未提交化妆师认证或化妆师认证被拒,无法上传作品')
      return false
    }else{
      self.history.pushState(null, '/upload/dresser')
    }
  },
  render: function() {
    return (
      <div style={{padding:'40px 60px 70px 60px'}}>
        <InfoHeader
          infoTitle="请选择角色"
          infoIconClass="glyphicon glyphicon-camera"
        />
        <div className="row">
          <div className="col-sm-4 col-xs-12">
            <div className="panel panel-default">
              <div className="panel-body text-center">
                <div style={{ minHeight: 250 }}>
                  <div style={{ padding: 15 }}>
                    <div style={{
                        height: 150,
                        width: 150,
                        borderRadius: '50%',
                        background: 'url(././img/p.png) no-repeat',
                        margin: '0 auto 10px',
                        backgroundSize:'contain'
                      }}></div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <strong>摄影师作品</strong>
                  </div>
                </div>
                <button onClick={this.isPUpload} className="btn btn-lg btn-block btn-default">立即上传</button>
              </div>
            </div>
          </div>
          <div className="col-sm-4 col-xs-12">
            <div className="panel panel-default">
              <div className="panel-body text-center">
                <div style={{ minHeight: 250 }}>
                  <div style={{ padding: 15 }}>
                    <div style={{
                        height: 150,
                        width: 150,
                        borderRadius: '50%',
                        background: 'url(././img/m.png) no-repeat',
                        margin: '0 auto 10px',
                        backgroundSize:'contain'
                      }}></div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <strong>化妆师作品</strong>
                  </div>
                </div>
                <button onClick={this.isDUpload} className="btn btn-lg btn-block btn-default">立即上传</button>
              </div>
            </div>
          </div>
          <div className="col-sm-4 col-xs-12">
            <div className="panel panel-default">
              <div className="panel-body text-center">
                <div style={{ minHeight: 250 }}>
                  <div style={{ padding: 15 }}>
                    <div style={{
                        height: 150,
                        width: 150,
                        borderRadius: '50%',
                        background: 'url(././img/d.png) no-repeat',
                        margin: '0 auto 10px',
                        backgroundSize:'contain'
                      }}></div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <strong>模特作品</strong>
                  </div>
                </div>
                <button onClick={this.isMUpload} className="btn btn-lg btn-block btn-default">立即上传</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = AlbumSummary;