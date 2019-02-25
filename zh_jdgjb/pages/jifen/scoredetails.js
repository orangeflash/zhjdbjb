// zh_jdgjb/pages/jifen/scoredetails.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    score_detail:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getUrl(that)
    app.getSystem(that)
    var user_id = wx.getStorageSync('userInfo').id
    that.setData({
      user_id: user_id
    })
    that.refresh()
  },
  refresh:function(e){
    var that = this
    var user_id = that.data.user_id
    var score_detail = that.data.score_detail
    var page = that.data.page
    app.util.request({
      url:'entry/wxapp/MyScoreDetails',
      data:{user_id:user_id,page:page},
      success:res=>{
        if(res.data.length>0){
          score_detail = score_detail.concat(res.data)
          for(let i in res.data){
            res.data[i].time = app.ormatDate(res.data[i].time).slice(0,16)
          }
          that.setData({
            page:page+1,
            score_detail: score_detail
          })
        }else{

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
    var that = this
    that.setData({
      score_detail: [],
      page:1
    })
    that.refresh()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.refresh()
  },
})