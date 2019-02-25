// zh_dianc/pages/seller/login.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: true,
    zh: '',
    mm: '',
    logintext: '登录',
    werchat: false,
    password:"888888888",
    name:"test8888"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getUrl(that)
    app.getSystem(that)
    that.setData({
      pt_img: wx.getStorageSync('platform').link_logo,
      color: wx.getStorageSync('platform').color,
      pt_name: wx.getStorageSync('platform').pt_name,
      tel: wx.getStorageSync('platform').tel,
    })
  },
  name: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  password: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  sign: function (e) {
    app.util.request({
      'url': 'entry/wxapp/HtLogin',
      'cachetime': '0',
      data: { username: this.data.name, password: this.data.password },
      success: function (res) {
        var sign = 
          {
            name: this.data.username,
            password: this.data.password
          }
        
        if (res.data == '账号或密码错误') {
          wx: wx.showModal({
            title: '提示',
            content: '账号或密码错误',
          })
        } else {
          wx.setStorageSync('store_info', res.data)
          wx.setStorageSync('sign', sign)
          wx: wx.redirectTo({
            url: '../logs/Workbench'
          })
        }
      },
    })
  },
  wechat_login:function(e){
    var that = this
    var user_id = wx.getStorageSync('userInfo').id
    wx.showModal({
      title: '温馨提示',
      content: '确定使用此微信绑定的操作员身份登录吗？',
      success:res=>{
        if (res.confirm) {
          app.util.request({
            'url': 'entry/wxapp/StoreWxLogin',
            'cachetime': '0',
            data: { user_id: user_id },
            success: function (res) {
              if (res.data.seller_id == null) {
                wx.showModal({
                  title: '温馨提示',
                  content: '您还不是'+that.data.platform.jd_custom+'的管理员',
                })
              } else {
                wx.removeStorageSync('store_info')
                wx: wx.redirectTo({
                  url: '../logs/Workbench?type=' + 2
                })
              }
            },
          })
        }
      }
    })
  },
  weixin: function (e) {
    if (this.data.werchat == false) {
      this.setData({
        werchat: true
      })
    } else if (this.data.werchat == true) {
      this.setData({
        werchat: false
      })
    }

  },
  // queding: function (e) {
  //   this.setData({
  //     werchat: false
  //   })
  //   app.util.request({
  //     'url': 'entry/wxapp/sjdlogin',
  //     'cachetime': '0',
  //     data: { user_id: this.data.user_id },
  //     success: function (res) {
  //       console.log(res)
  //       if (res.data == false) {
  //         wx: wx.showModal({
  //           title: '提示',
  //           content: '当前账号未绑定操作员',
  //           showCancel: true,
  //           cancelText: '取消',
  //           confirmText: '确定',
  //           success: function (res) { },
  //           fail: function (res) { },
  //           complete: function (res) { },
  //         })
  //       }
  //       else if (res.data.state == '1') {
  //         wx.showModal({
  //           title: '提示',
  //           content: '您的入驻申请正在后台审核，请耐心等待',
  //         })
  //       }
  //       else if (res.data.state == '2') {
  //         wx.setStorageSync('store_info', res.data)
  //         var user_id = res.data.user_id
  //         wx: wx.redirectTo({
  //           url: '../redbag/merchant?id=' + res.data.id,
  //           success: function (res) { },
  //           fail: function (res) { },
  //           complete: function (res) { },
  //         })
  //       }
  //       else if (res.data.state == '3') {
  //         wx.showModal({
  //           title: '提示',
  //           content: '您的入驻申请已被拒绝，请联系平台处理',
  //         })
  //       }
  //     },
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.getUserInfo(function (userInfo) {
    })
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
})