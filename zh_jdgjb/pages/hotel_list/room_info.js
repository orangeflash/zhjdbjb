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
    var hotel_id = options.hotel_id
    var id = options.room_id
    var myDate = new Date().toLocaleDateString().replace(/\//g, "-");
    // 接收上个页面传过来的经纬度
    var coordinates = options.coordinates
    // 接收上个页面传过来的酒店电话
    var tel = options.tel
    // 接收上个页面传过来的地址
    var address = options.address
    // 接收上个页面传过来的酒店名字
    var name = options.name
    // 接收上个页面传过来的房间价格
    var price = options.price
    that.setData({
      tel: tel,
      coordinates: coordinates,
      address: address,
      name: name,
      price: price,
    })
    app.util.request({
      'url': 'entry/wxapp/RoomDetails',
      'cachetime': '0',
      data: { room_id: id },
      success: function (res) {
        if(res.data.img!=''){
          res.data.img = res.data.img.split(",")
        }
        that.setData({
          room: res.data,
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
    var lat2 = Number(that.data.coordinates.split(",")[0])
    var lng2 = Number(that.data.coordinates.split(",")[1])
    wx.openLocation({
      latitude: lat2,
      longitude: lng2,
      name: that.data.name,
      address: that.data.address
    })
  },
  // 查看大图
  previewImage: function (e) {
    var that = this
    var url = that.data.url
    var urls = []
    var index = e.currentTarget.dataset.index
    var pictures = that.data.room.img

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