// pages/jifen/jifen.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    none_list:false,
    page:1,
    goods_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getUrl(that)
    app.getSystem(that)
    that.refresh()
    that.reload()
  },
  refresh: function (e) {
    var that = this
    // 获取首页开屏广告
    app.util.request({
      'url': 'entry/wxapp/getad',
      'cachetime': '0',
      data:{type:2},
      success: function (res) {
        if (res.data.length > 0) {
          that.setData({
            nav: res.data
          })
        }
      }
    })
    // 获取积分商城分类
    app.util.request({
      'url': 'entry/wxapp/JfTypeList',
      'cachetime': '0',
      success: function (res) {
        that.setData({
          type_list:res.data
        })
      }
    })
  },
  reload:function(e){
    var that = this
    var page = that.data.page
    var goods_list = that.data.goods_list
    // 获取积分商品列表
    app.util.request({
      'url': 'entry/wxapp/JfGoodsList',
      'cachetime': '0',
      data: { page: page },
      success: function (res) {
        if (res.data.length > 0) {
          that.setData({
            page: page + 1
          })
          goods_list = goods_list.concat(res.data)
          that.setData({
            goods_list: goods_list
          })
        } else {
          that.setData({
            none_list: true
          })
        }
      }
    })
  },
  // —————————跳转到积分详情—————————
  jifeninfo:function(e){
    var that = this;
    wx.navigateTo({
      url: 'jifeninfo?id='+e.currentTarget.dataset.id,
    })
  },
  // 返回首页
  index:function(e){
    wx.redirectTo({
      url: '../index/index',
    })
  },
  // 跳转积分记录
  record:function(e){
    wx.navigateTo({
      url: 'scoredetails',
    })
  },
  // 我的兑换
  exchange:function(e){
    wx.navigateTo({
      url: 'exchange',
    })
  },
  // 跳转分类
  type_list:function(e){
    var that = this
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'score_classifation?id='+id,
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
    var that = this
    that.setData({
      page: 1,
      goods_list: []
    })
    that.refresh()
    that.reload()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      this.reload()
  },
})