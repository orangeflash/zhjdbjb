// zh_jdgjb/pages/distribution/commission.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    statistics:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getUrl(that)
    app.getSystem(that)
    that.refresh()
  },
  refresh: function (e) {
    var that = this
    var statistics = that.data.statistics
    var page = that.data.page
    var user_id = wx.getStorageSync('userInfo').id
    // 佣金mingxi
    app.util.request({
      url: 'entry/wxapp/Yjlist',
      data: {
        user_id: user_id,
        page:page
      },
      success: res => {
        if(res.data.length>0){
          statistics = statistics.concat(res.data)
          for (let i in res.data) {
            res.data[i].time = app.ormatDate(res.data[i].time)
          }
          that.setData({
            statistics: statistics,
            page:page+1
          })
        }
        
        
      }
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
    this.refresh()
  },
})