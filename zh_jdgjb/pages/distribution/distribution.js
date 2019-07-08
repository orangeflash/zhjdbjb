// zh_jdgjb/pages/distribution/distribution.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    share:false,
    backgrod:false
  },
  previewimg: function () {
    wx.previewImage({
      urls: [this.data.code],
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getUrl(that)
    app.getSystem(that)
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        that.setData({
          nickName: nickName,
          avatarUrl: avatarUrl,
        })
      }
    })
    // that.refresh()
  },
  refresh:function(e){
    var that = this
    var user_id = wx.getStorageSync('userInfo').id
    // 查看我的上线
    app.util.request({
      url: 'entry/wxapp/MySx',
      data: {
        user_id: user_id,
      },
      success: res => {
        if (res.data.user_id == 0) {
          that.setData({
            name: wx.getStorageSync('platform').pt_name,
          })
        } else {
          that.setData({
            name: res.data.name
          })
        }
      }
    })
    // 查看分销二维码
    app.util.request({
      url: 'entry/wxapp/MyCode',
      data: {
        user_id: user_id,
      },
      success: res => {
        that.setData({
          code:res.data
        })
      }
    })
    // 佣金统计
    app.util.request({
      url: 'entry/wxapp/CountCommission',
      data: {
        user_id: user_id,
      },
      success: res => {
        that.setData({
          statistics: res.data
        })
      }
    })
    // 查看我的下线
    app.util.request({
      url: 'entry/wxapp/MyTeam',
      data: { user_id: user_id },
      success: res => {
        var length = res.data.one.length+res.data.two.length
        that.setData({
          length:length
        })
      }
    })
  },
  // 点击提现
  forward:function(e){
    wx.navigateTo({
      url: 'forward',
    })
  },
  // 分销佣金
  commission:function(e){
    wx.navigateTo({
      url: 'commission',
    })
  },
  // 我的团队
  team:function(e){
    wx.navigateTo({
      url: 'team',
    })
  },
  // 佣金明细
  detauled:function(e){
    wx.navigateTo({
      url: 'detauled',
    })
  },
  // 二维码
  qr_code:function(e){
    var that = this
    var share = that.data.share
    if(share==false){
      that.setData({
        share:true
      })
    }else{
      that.setData({
        share:false
      })
    }
  },
  // 面对面
  Preservation: function (e) {
    var that = this
    var backgrod = that.data.backgrod
    if (backgrod == false) {
      that.setData({
        backgrod: true,
        share:false
      })
    } else {
      that.setData({
        backgrod: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.refresh()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this
    var user_id = wx.getStorageSync('userInfo').id
    var user_name = wx.getStorageSync('userInfo').name
    if (res.from === 'button') {
      return {
        title: user_name +' ' + '邀请你来看一看',
        path: 'zh_jdgjb/pages/index/index?upper_partner='+user_id,
        success: function (res) {
          // 转发成功
          wx.showToast({
            title: '分享成功',
            icon: 'none'
          })
          that.setData({
            share:false
          })
        },
        fail: function (res) {
          // 转发失败
          // 转发成功
          wx.showToast({
            title: '分享失败',
            icon: 'none'
          })
          that.setData({
            share: false
          })
        }
      }
    }
  }
})