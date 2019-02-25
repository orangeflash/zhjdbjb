// zh_jdgjb/pages/coupon/red_bag.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    red_bag:[]
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
      user_id:user_id
    })
    that.refresh()
  },
  refresh:function(e){
    var that = this
    var user_id = that.data.user_id
    var page = that.data.page
    var red_bag = that.data.red_bag
    app.util.request({
      url:'entry/wxapp/MyHb',
      data:{user_id:user_id,page:page},
      success:res=>{
        if(res.data.length>0){
          red_bag = red_bag.concat(res.data)
          for(let i in res.data){
            res.data[i].money = Number(res.data[i].money).toFixed(0)
          }
          that.setData({
            red_bag:red_bag,
            page:page+1
          })
        }else{

        }
      }
    })
  },
  // 使用红包并调用上一个页面的事件
  receive_coupon: function (e) {
    var that = this
    var money = e.currentTarget.dataset.money
    var id = e.currentTarget.id
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];   //当前页面
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.setData({
        red_bag: money,
        red_bag_id: id,
      })
      wx: wx.navigateBack({
        delta: 1
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
        red_bag:[],
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