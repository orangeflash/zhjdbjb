// zh_dianc/pages/personal/recharge.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList: [
      { url: "url", title: "公告：多地首套房贷利率上浮 热点城市渐迎零折扣时代" },
      { url: "url", title: "公告：悦如公寓三周年生日趴邀你免费吃喝欢唱" },
      { url: "url", title: "公告：你想和一群有志青年一起过生日嘛？" }]

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getUrl(that)
    app.getSystem(that)
    app.getUserInfo(function (userInfo) {
     
      that.setData({
        userInfo: userInfo,
        color: wx.getStorageSync('platform').color
      })
    })

    // 获取首页开屏广告
    app.util.request({
      'url': 'entry/wxapp/getad',
      'cachetime': '0',
      data: { type: 3 },
      success: function (res) {
       
        var rande = that.data.rande
        if (res.data.length > 0) {
          that.setData({
            getad: res.data,
            bomb: true
          })
        }
      }
    })
    app.util.request({
      'url': 'entry/wxapp/Czhd',
      'cachetime': '0',
      success: function (res) {
       
        that.setData({
          Czhd: res.data
        })
      }
    })
  },
  money: function (e) {
    this.setData({
      money: e.detail.value
    })
  },
  chongzhi: function (e) {
    var that = this
    var money = that.data.money
    var title = ''
    if (money == null || money == 0) {
      title = '请输入充值金额'
    }
    if (title != '') {
      wx.showModal({
        content: title,
      })
    } else {
      var Czhd = that.data.Czhd
      var acti = []
      for (let i in Czhd) {
        if (money >= Number(Czhd[i].full)) {
          acti.push(Number(Czhd[i].full))
        }
      }
  
      if(acti.length>0){

        var zd_money = app.max(acti)
        for (let i in Czhd) {
          if (zd_money == Czhd[i].full) {
            var zs_money = Czhd[i].reduction
          }
        }
      }else{
        var zs_money = 0
      }
      var user_id = wx.getStorageSync('userInfo').id
      var openid = app.OpenId
      app.util.request({
        url: 'entry/wxapp/SaveRecharge',
        data: { user_id: user_id, cz_money: money, zs_money: zs_money },
        success: res => {
          var cz_id = res.data
          app.util.request({
            'url': 'entry/wxapp/Pay2',
            'cachetime': '0',
            data: { openid: openid, money: money, cz_id: cz_id },
            success: function (res) {
              wx.requestPayment({
                'timeStamp': res.data.timeStamp,
                'nonceStr': res.data.nonceStr,
                'package': res.data.package,
                'signType': res.data.signType,
                'paySign': res.data.paySign,
                'success': function (res) {
                    wx.showToast({
                      title: '支付成功',
                    })
                    setTimeout(function(){
                      wx.navigateBack({
                        delta:1
                      })
                    },1500)
                }
              })
            }
          })
        }

      })
    }
  },
  jilu:function(e){
    wx.navigateTo({
      url: 'jilu',
    })
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