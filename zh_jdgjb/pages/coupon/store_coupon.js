// zh_jd/pages/coupon/coupon.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: [
      '有效',
      '已使用',
      '已过期'
    ],
    seletive_index: 0,
    index: 0,
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
    var hotel_id = options.hotel_id
    that.setData({
      hotel_id: hotel_id,
      price: options.money
    })
    that.reload()
  },
  reload: function (e) {
    var that = this
    var today = app.today()
    // 获取优惠券集合
    var user_id = wx.getStorageSync("userInfo").id
    // 头部状态下标
    var index = that.data.index
    var unreceive = that.data.unreceive
    var page = that.data.page
    app.util.request({
      'url': 'entry/wxapp/MyCoupons',
      'cachetime': '0',
      data: { user_id: user_id ,page:page},
      success: function (res) {
        if(res.data.length>0){
          that.setData({
            page:page+1
          })
          unreceive = unreceive.concat(res.data)
          // 获取优惠券集合
          var coupons = res.data
          // 已过期
          var overdue = []
          // 未过期
          var not_used = []
          // 已使用
          var use_coupon = []

          for (let i in unreceive) {
            if(unreceive[i].end_time!=null){
              unreceive[i].end_time = unreceive[i].end_time.slice(0, 10)
              unreceive[i].start_time = unreceive[i].start_time.slice(0, 10)
              unreceive[i].cost = Number(unreceive[i].cost).toFixed(0)
              if (today > unreceive[i].end_time) {
                overdue.push(unreceive[i])
              }
              if (today <= unreceive[i].end_time && unreceive[i].state == 1) {
                not_used.push(unreceive[i])
              }
              if (unreceive[i].state == 2) {
                use_coupon.push(unreceive[i])
              }
            }
          }
          if (index == 0) {
            that.setData({
              unreceive: not_used
            })
          } else if (index == 1) {
            that.setData({
              unreceive: use_coupon
            })
          } else {
            that.setData({
              unreceive: overdue
            })
          }
        }else{

        }
       

      }
    })
  },
  // 进入店铺使用优惠券
  receive: function (e) {
    var taht = this
    var id = e.currentTarget.id
    if (id == 0) {
      wx.navigateTo({
        url: '../hotel_list/hotel_list',
      })
    } else {
      wx.navigateTo({
        url: '../hotel_list/hotel_info?hotel_id=' + id,
      })
    }
  },
  // 不使用优惠券
  not_user: function (e) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      coupon: 0,
      coupons_id: ''
    })
    wx: wx.navigateBack({
      delta: 1
    })
  },
  // 切换头部状态
  seletive_index: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    that.setData({
      seletive_index: index,
      index: index,
      page:1,
      unreceive:[]
    })
    that.reload()
  },
  // 使用优惠券并调用上一个页面的事件
  receive_coupon: function (e) {
    var that = this
    var price = that.data.price
    // var money = e.currentTarget.money
    var cost = e.currentTarget.dataset.money
    var id = e.currentTarget.id
    var condition = e.currentTarget.dataset.condition
    if (condition==''){
      var num =0
    }else{
      var num = condition.replace(/[^0-9]/ig, "");
    }
    
    if (Number(price) < Number(num)) {
      wx.showToast({
        title: '不到使用条件',
      })
    } else if(price!=null||num!=null){
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];   //当前页面
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.setData({
        coupon: cost,
        coupons_id: id,
        condition:num
      })
      wx: wx.navigateBack({
        delta: 1
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
      seletive_index: 0,
      index: 0,
      page: 1,
      unreceive: []
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