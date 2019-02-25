// zh_jdgjb/pages/distribution/team.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      index:0,
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
  refresh:function(e){
    var that = this
    var index = that.data.index
    var user_id = wx.getStorageSync('userInfo').id
    app.util.request({
      url: 'entry/wxapp/MyTeam',
      data: { user_id: user_id },
      success: res => {
        if (index == 0) {
          for (let i in res.data.one) {
            res.data.one[i].time = app.ormatDate(res.data.one[i].time).slice(0, 10)
            res.data.one[i].ji = '一级下线'
          }
          that.setData({
            list: res.data.one
          })
        }
        if (index == 1) {
          for (let i in res.data.two) {
            res.data.two[i].time = app.ormatDate(res.data.two[i].time).slice(0, 16)
            res.data.two[i].ji ='二级下线'
          }
          that.setData({
            list: res.data.two
          })
        }
      }
    })
  },
  whole2: function (e) {
    this.setData({
      index: 0
    })
    this.refresh()
  },
  whole3: function (e) {
    this.setData({
      index: 1
    })
    this.refresh()
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