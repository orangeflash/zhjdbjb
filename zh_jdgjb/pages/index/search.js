// zh_jd/pages/index/search.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotel:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getUrl(that)
    app.getSystem(that)
  },
// 搜索酒店
  search_hotel:function(e){
    var that= this
    var value = e.detail.value
    if(value!=''){
      // 获取酒店详情
      app.util.request({
        'url': 'entry/wxapp/JdList',
        'cachetime': '0',
        data: { keywords: value, pagesize:100 },
        success: function (res) {
          that.setData({
            hotel: res.data
          })
        }
      })
    }else{
      that.setData({
        hotel: []
      })
    }
  },
  search_result:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../hotel_list/hotel_info?hotel_id='+id+'&type='+1,
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
    this.setData({
      hotel:[]
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // wx.removeStorageSync('bomb')
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