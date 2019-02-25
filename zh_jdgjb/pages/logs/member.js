// zh_vip/pages/my/hykxq.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dqdj:0,
    speed:0
  },
  last: function () {
    var dqdj = this.data.dqdj;
    this.setData({
      dqdj: dqdj - 1
    })
  },
  next: function () {
    var dqdj = this.data.dqdj;
    this.setData({
      dqdj: dqdj + 1
    })
  },
  swiperchange: function (e) {
    this.setData({
      dqdj: e.detail.current
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getUrl(that)
    app.getSystem(that)
    var xtxx = wx.getStorageSync('xtxx')
    this.setData({
      xtxx: xtxx,
    })
   
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo:userInfo
      })
      app.util.request({
        url: 'entry/wxapp/MyCost',
        data: { user_id: userInfo.id },
        success: res => {
          that.setData({
            level_cumulative: res.data
          })
        }
      })
      app.util.request({
        'url': 'entry/wxapp/memberlist',
        'cachetime': '0',
        success: function (res) {
          that.setData({
            navs:res.data
          })
          var length = res.data.length
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].id == userInfo.level_id) {
              var len = i+1
              var speed = len/length
              speed = speed*100
              speed = speed.toFixed(0)
              that.setData({
                dqdj: i,
                speed: speed,
                price: res.data[i].value
              })
            }
          }
          that.setData({
            imgarr: res.data,
          })
        }
      });
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
})