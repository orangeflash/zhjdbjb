// zh_jdgjb/pages/jifen/exchange.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    exchange_list:[],
    exchange_type:false
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
    var exchange_list = that.data.exchange_list
    var page = that.data.page
    var user_id = wx.getStorageSync('userInfo').id
    app.util.request({
      url:'entry/wxapp/Dhmx',
      data:{user_id:user_id,page:page},
      success:res=>{
        if(res.data.length>0){
          that.setData({
            page:page+1
          })
          exchange_list = exchange_list.concat(res.data)
          for(let i in res.data){
            res.data[i].time = res.data[i].time.slice(0,15)
          }
          that.setData({
            exchange_list: exchange_list
          })
        }else{

        }
      }
    })
  },
  exchange_info:function(e){
    var that = this
    var exchange_type = that.data.exchange_type
    if (exchange_type == true) {
      that.setData({
        exchange_type: false
      })
    } 
    var exchange_list = that.data.exchange_list
    var index = e.currentTarget.dataset.index
    var exchange_info = exchange_list[index]
    if (exchange_info.kd_name!=''){
      if (exchange_type == true) {
        that.setData({
          exchange_type: false
        })
      } else {
        that.setData({
          exchange_type: true
        })
      }
      that.setData({
        exchange_info: exchange_info
      })
    }else{
      that.setData({
        exchange_type: false
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
    var that= this
    that.setData({
      page:1,
      exchange_list:[]
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