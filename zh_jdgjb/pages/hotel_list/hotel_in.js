// zh_jd/pages/wode/room.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getUrl(that)
    app.getSystem(that)
    // 获取网址
    app.util.request({
      'url': 'entry/wxapp/attachurl',
      'cachetime': '0',
      success: function (res) {
        // 异步保存网址
        wx.setStorageSync("url", res.data)
        that.setData({
          url: res.data,
        })
      },
    })
    // 获取酒店详情
    app.util.request({
      'url': 'entry/wxapp/PjDetails',
      'cachetime': '0',
      data: { seller_id: options.seller_id },
      success: function (res) {
        res.data.img = res.data.img.split(",")
        that.setData({
          hotel: res.data
        })
      }
    })
  },
  // 拨打酒店电话
  phone: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.tel
    })
  },
  // 查看酒店地址
  dizhi: function (e) {
    var that = this
    var lat2 = Number(that.data.hotel.coordinates.split(",")[0])
    var lng2 = Number(that.data.hotel.coordinates.split(",")[1])
    wx.openLocation({
      latitude: lat2,
      longitude: lng2,
      name: that.data.hotel.name,
      address: that.data.hotel.address
    })
  },
  // 查看大图
  previewImage: function (e) {
    var that = this
    var url = that.data.url
    var urls = []
    var index = e.currentTarget.dataset.index
    var pictures = that.data.hotel.img

    for (let i in pictures) {
      urls.push(url + pictures[i])
    }
    wx.previewImage({
      current: url + pictures[index],
      urls: urls
    })
  },
  // 一键复制
  setclip: function (e) {
    wx.setClipboardData({
      data: '1.0版本',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
          }
        })
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

  },
})