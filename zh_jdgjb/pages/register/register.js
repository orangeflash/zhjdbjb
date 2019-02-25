// zh_jdgjb/pages/register/register.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getmsg: "发送验证码",
    yz:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getUrl(that)
    app.getSystem(that)
  },
  // 获取名字
  name:function(e){
    this.setData({
      user_name:e.detail.value
    })
  },
  // 获取手机号
  phone:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  // 验证码
  sendmessg: function (e) {
    var that = this
    var phone = that.data.phone
    if (phone == '' || phone == null) {
      wx: wx.showToast({
        title: '请输入手机号',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      // 获取6位数的随机数
      var Num = "";
      for (var i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
      }
      // 随机数传给后台
      app.util.request({
        'url': 'entry/wxapp/sms2',
        'cachetime': '0',
        data: { code: Num, tel: phone ,type:2},
        success: function (res) {
        
        },
      })
      that.setData({
        num: Num
      })
      var time = 59
      // 60秒倒计时
      var inter = setInterval(function () {
        that.setData({
          getmsg: time + "s后重新发送",
          send: true
        })
        time--
        if (time <= 0) {
          // 停止倒计时
          clearInterval(inter)
          that.setData({
            getmsg: "发送验证码",
            send: false,
            num: 0
          })
        }
      }, 1000)
    }
  },
  // 输入验证码
  verification_code: function (e) {
    var that = this
    var code = e.detail.value
    var num = that.data.num
    if (code.length == 6) {
      if (code != num) {
        wx.showModal({
          title: '',
          content: '验证码输入错误',
        })
        this.setData({
          phone: 0
        })
      }else{
        that.setData({
          yz:true
        })
      }
    }
  },
  // 微信绑定手机号验证
  getPhoneNumber: function (e) {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/jiemi',
      'cachetime': '0',
      data: { sessionKey: app.getSK, iv: e.detail.iv, data: e.detail.encryptedData },
      success: function (res) {
      
        that.setData({
          phone: res.data.phoneNumber
        })
      },
    })
  },
  confirm:function(e){
    var that = this
    var name = that.data.user_name
    var phone = that.data.phone
    var platform = that.data.platform
    var user_id = wx.getStorageSync('userInfo').id
    var title = ''
    if (name == '' || name == null) {
      title = '请输入您的姓名'
    } else if (phone == '' || phone == null) {
      title = '请输入您的手机号'
    } else if (platform.is_dxyz == 1) {
      var yz = that.data.yz
      if (yz != true) {
        title = '验证码输入错误'
      }
    }
    if(title!=''){
      wx.showModal({
        content: title,
      })
    }else{
      app.util.request({
        'url': 'entry/wxapp/RenewUser',
        'cachetime': '0',
        data: { tel: phone, zs_name: name, user_id: user_id},
        success: function (res) {
        
          if(res.data==1){
            wx.showToast({
              title: '提交成功',
            })
            setTimeout(function(){
              wx.navigateBack({
                delta:1
              })
            },1500)
          }
        },
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