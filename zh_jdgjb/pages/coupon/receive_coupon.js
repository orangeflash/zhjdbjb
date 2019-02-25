// zh_jd/pages/coupon/coupon.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    unreceive:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getUrl(that)
    app.getSystem(that)
    that.reload()
  },
  reload: function (e) {
    var that = this
    var page = that.data.page
    var unreceive = that.data.unreceive
    var user_id = wx.getStorageSync("userInfo").id
    // 获取优惠券集合
    var user_id = wx.getStorageSync("userInfo").id
    app.util.request({
      'url': 'entry/wxapp/GetSponsorCoupon',
      'cachetime': '0',
      data: { page: page,user_id: user_id},
      success: function (res) {
        if(res.data.length>0){
          that.setData({
            page:page+1
          })
          unreceive = unreceive.concat(res.data)
          for (let i in res.data) {
            res.data[i].end_time = res.data[i].end_time.slice(0, 10)
            res.data[i].start_time = res.data[i].start_time.slice(0, 10)
            res.data[i].cost = Number(res.data[i].cost).toFixed(0)
          }
          that.setData({
            unreceive: unreceive
          })
        }else{

        }
        
      }
    })
  },

  // 领取优惠券
  receive: function (e) {
    var that = this
    // 点击的优惠券id
    var coupons_id = e.currentTarget.id
    // 用户id
    var user_id = wx.getStorageSync("userInfo").id
    // 领取优惠券接口
    app.util.request({
      'url': 'entry/wxapp/ReceiveCoupons',
      'cachetime': '0',
      data: { user_id: user_id, coupons_id: coupons_id },
      success: function (res) {
        if(res.data!=1){
          wx.showToast({
            mask:true,
            title: res.data,
          })
        }else{
          that.setData({
            page: 1,
            unreceive: []
          })
          that.reload()
          wx.showToast({
            title: '领取成功',
          })
        }
      },
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
    this.setData({
      page:1,
      unreceive:[]
    })
    this.reload()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.reload()
  },

})