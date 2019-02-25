// zh_jdgjb/pages/hotel_list/hour_room.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '06:00',
    pay_num:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var that = this
    app.getUrl(that)
    app.getSystem(that)
    var end_time = app.hours_time(app.util.time() + ' ' + that.data.time,options.rz_time)
    that.setData({
      start: app.util.time(),
      end_time: end_time,
      form_d: options.form_d,
      room_id: options.room_id,
      hotel_id: options.hotel_id,
      end: app.util.addDate(app.util.time(), 28),
      cost: Number(options.cost).toFixed(2),
      rz_time: options.rz_time
    })

    that.refresh()
  },
  refresh: function (e) {
    var that = this
    // 接收从上一个页面传过来的房间id
    var room_id = that.data.room_id
    // 接收从上一个页面传过来的酒店id
    var hotel_id = that.data.hotel_id
    // 获取房间信息
    app.util.request({
      'url': 'entry/wxapp/RoomDetails',
      'cachetime': '0',
      data: { room_id: room_id },
      success: function (res) {
        that.setData({
          room: res.data
        })
      },
    })
    // 获取酒店信息
    app.util.request({
      'url': 'entry/wxapp/PjDetails',
      'cachetime': '0',
      data: { seller_id: hotel_id },
      success: function (res) {
        that.setData({
          hotel: res.data
        })
      },
    })
  },
  // 改变到店时间
  bindTimeChange: function (e) {
    var that = this
    var time = e.detail.value
    var start_time = that.data.start+' '+time
    var rz_time = that.data.rz_time
    var end_time = app.hours_time(start_time, rz_time)
    this.setData({
      time: e.detail.value,
      end_time: end_time
    })
  },
  // 提交订单
  formSubmit: function (e) {
    var that = this
    var form_d = that.data.form_d
    function isTelCode(str) {
      var reg = /^1[3|4|5|7|8|9][0-9]\d{4,8}$/;
      return reg.test(str);
    }
    var formId = e.detail.formId
    var hotel = that.data.hotel
    var code = e.detail.value.code
    var room = that.data.room
    // 房间价格
    var total_price = that.data.cost
    // 结算总金额
    var settlement = that.data.cost
    // 获取优惠券满减条件
    var condition = ''
    // 获取房间的总价格
    var z_money = that.data.cost
    // 入住人
    var name = e.detail.value.name
    // 联系人电话
    var tel = e.detail.value.tel
    // 到店时间
    var dd_time = that.data.time
    var end_time = that.data.end_time
    // 酒店id
    var seller_id = hotel.id
    // 房间id
    var room_id = room.id
    // 用户id
    var user_id = wx.getStorageSync('userInfo').id
    // 优惠券id
    var coupons_id = 0
    // 酒店名字
    var seller_name = hotel.name
    // 酒店地址
    var seller_address = hotel.address
    // 酒店经纬度
    var coordinates = hotel.coordinates
    // 到店日期
    var arrival_time = that.data.start + ' ' + dd_time
    // 离店日期
    var departure_time = end_time
    // 结算总金额
    var price = that.data.cost
    // 房间数量
    var num = 1
    // 房间类型
    var room_type = room.name
    // 床型
    var bed_type = room.size
    // 入住天数
    var days = 1
    // 折扣后的价格
    var dis_cost = that.data.cost
    // 押金金额
    var yj_cost = 0
    // 优惠券金额
    var yhq_cost = 0
    // 房间图片
    var room_logo = room.logo
    var yyzk_cost = that.data.reduction_price
    // 红包金额
    var hb_cost = 0
    // 红包id
    var hb_id = 0
    var platform = that.data.platform
    var title = ''
    if (name == '') {
      title = '请填写入住人姓名'
    } else if (tel == '') {
      title = '请填写联系电话'
    } else if (code == '' && platform.is_sfz == 1) {
      title = '请填写您的身份证号'
    } else if (platform.is_sfz == 2) {
      var code = ''
    }
    var pay_num = that.data.pay_num
    if(title!=''){
      wx.showModal({
        title: '',
        content: title,
      })
      that.setData({
        pay_num:1
      })
    } else if (title == '' && pay_num==1) {
      that.setData({
        pay_num: 0
      })
      // 提交订单
      app.util.request({
        url: 'entry/wxapp/AddOrder',
        data: {
          name: name,
          tel: tel,
          price: total_price,
          dd_time: dd_time,
          seller_id: seller_id,
          room_id: room_id,
          user_id: user_id,
          coupons_id: coupons_id,
          seller_name: seller_name,
          seller_address: seller_address,
          coordinates: coordinates,
          arrival_time: arrival_time,
          departure_time: departure_time,
          num: 1,
          room_type: room_type,
          bed_type: bed_type,
          days: 1,
          dis_cost: dis_cost,
          yj_cost: yj_cost,
          yhq_cost: yhq_cost,
          total_cost: settlement,
          room_logo: room_logo,
          yyzk_cost: yyzk_cost,
          hb_id: hb_id,
          hb_cost: hb_cost,
          from_id: form_d,
          classify: 2,
          type: 1,
          code: code
        },
        method:'POST',
        success: res => {
          var result = res.data
          var order_id = res.data
          result = typeof (result)
          var openid = app.OpenId
          if (result != "string") {
            app.util.request({
              'url': 'entry/wxapp/Pay',
              'cachetime': '0',
              data: { openid: openid, money: settlement, order_id: order_id },
              method: 'POST',
              success: function (res) {
                wx.requestPayment({
                  'timeStamp': res.data.timeStamp,
                  'nonceStr': res.data.nonceStr,
                  'package': res.data.package,
                  'signType': res.data.signType,
                  'paySign': res.data.paySign,
                  'success': function (res) {
                    wx.redirectTo({
                      url: '../order/order?activeIndex=' + 0 + '&index=' + 0,
                    })
                    var openid = wx.getStorageSync('userInfo').openid
                    app.util.request({
                      'url': 'entry/wxapp/Message',
                      'cachetime': '0',
                      data: {
                        form_id: formId,
                        openid: openid,
                        order_id: order_id,
                      },
                      method: 'POST',
                      success: function (res) {
                      },
                    })
                  },

                  'fail': function (res) {
                    wx.showToast({
                      title: '支付失败',
                    })
                    wx.redirectTo({
                      url: '../order/order?activeIndex=' + 1 + '&index=' + 1,
                    })
                  },
                })
              },
            })
          } else {
            wx.showModal({
              content: res.data,
            })
          }

        }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})