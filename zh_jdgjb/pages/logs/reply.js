// zh_jd/pages/hotel_list/all_comment.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    assess_list: [],
    page: 1,
    reply:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      seller_id: options.seller_id,
    })
    app.getUrl(that)
    app.getSystem(that)
    that.refresh()
  },
  refresh: function (e) {
    var that = this
    var seller_id = that.data.seller_id
    var assess_list = that.data.assess_list
    var page = that.data.page
    // 获取该酒店评价信息
    app.util.request({
      'url': 'entry/wxapp/AssessList',
      'cachetime': '0',
      data: { seller_id: seller_id, page: page },
      success: function (res) {
        if (res.data.length > 0) {
          that.setData({
            page: page + 1,
            none_more: false
          })
          for (let i in res.data) {
            if (res.data[i].reply == '') {
              res.data[i].img = res.data[i].img.split(",")
              res.data[i].time = app.ormatDate(res.data[i].time).slice(0, 10)
              assess_list = assess_list.concat(res.data[i])
            }
          }
          that.setData({
            assess_list: assess_list
          })
        } else {
          that.setData({
            none_more: true
          })
        }
      },
    })
  },

  // 查看大图
  previewImage: function (e) {
    var that = this
    var url = that.data.url
    var urls = []
    var id = e.currentTarget.id
    var index = e.currentTarget.dataset.index
    var assess_list = that.data.assess_list
    for (let i in assess_list) {
      if (id == assess_list[i].id) {
        var pictures = assess_list[i].img
      }
    }
    for (let i in pictures) {
      urls.push(url + pictures[i])
    }
    wx.previewImage({
      current: url + pictures[index],
      urls: urls
    })
  },
  // 回复弹框
  reply:function(e){
    var that = this
    var reply = that.data.reply
    var assess_id = e.currentTarget.dataset.id
    that.setData({
      assess_id: assess_id
    })
    if(reply==false){
      that.setData({
        reply:true
      })
    }else{
      that.setData({
        reply:false
      })
    }
  },
  // 获取回复内容
  textarea:function(e){
    var that = this
    that.setData({
      textarea:e.detail.value
    })
  },
  // 确定回复
  determine:function(e){
    var that = this
    var textarea = that.data.textarea
    var assess_id = that.data.assess_id
    if(textarea==null||textarea==''){
      wx.showModal({
        title: '',
        content: '您还没有输入回复哦！',
      })
    } else {
      // 获取该酒店评价信息
      app.util.request({
        'url': 'entry/wxapp/ReplyAssess',
        'cachetime': '0',
        data: { reply: textarea, assess_id: assess_id },
        success: function (res) {
        },
      })
      that.setData({
        reply: false
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
    var that = this
    that.setData({
      assess_list: [],
      page: 1,
    })
    that.refresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.refresh()
  },
})