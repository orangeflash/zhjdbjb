// pages/jifen/jifen.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    none_list: false,
    page: 1,
    goods_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getUrl(that)
    app.getSystem(that)
    that.setData({
      type_id:options.id,
    })
    that.reload()
  },
  reload: function (e) {
    var that = this
    var page = that.data.page
    var type_id = that.data.type_id
    var goods_list = that.data.goods_list
    // 获取积分商品列表
    app.util.request({
      'url': 'entry/wxapp/JfGoodsList',
      'cachetime': '0',
      data: { page: page, type_id: type_id},
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
  jifeninfo: function (e) {
    var that = this;
    wx.navigateTo({
      url: 'jifeninfo?id=' + e.currentTarget.dataset.id,
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
      page:1,
      goods_list:[]
    })
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