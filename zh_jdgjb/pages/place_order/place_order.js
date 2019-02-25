// zh_jd/pages/confirmation_order/confirmation_order.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '20:00', //默认的预计到店时间
    num: 1, //选择的房间数
    see_price: false, //房间详情默认隐藏
    red_bag: 0, //红包金额
    red_bag_id: 0,
    mode1: "success",
    mode2: "clear",
    mode3: "clear",
    pay_mode: false,
    refrer_to: '确认支付',
    pay_num: 1,
    type:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    app.getUrl(that)
    app.getSystem(that)
    // 接收从上一个页面传过来的房间id
    var room_id = options.room_id
    // 接收从上一个页面传过来的酒店id
    var hotel_id = options.hotel_id
    // 从本地缓存中获取入住开始的时间
    var day1 = wx.getStorageSync("day1")
    // 从本地缓存中获取入住结束的时间
    var day2 = wx.getStorageSync("day2")
    // 从本地缓存中获取入住的天数
    var day = wx.getStorageSync("day")
    that.setData({
      room_id: room_id,
      hotel_id: hotel_id,
      day1: day1,
      day2: day2,
      day: day,
      coupon: 0,
      condition: 0,
      coupons_id: -1,
      form_d: options.form_d,
      grade: wx.getStorageSync('platform').open_member,
    })
    var z_price = 0
    app.util.request({
      url: 'entry/wxapp/GetRoomCost',
      data: {
        room_id: room_id,
        start: day1,
        end: day2
      },
      success: res => {
       
        for (let i in res.data) {
          z_price += Number(res.data[i].mprice)
        }
       
        that.setData({
          z_price: z_price,
          price_infos: res.data
        })
        that.refresh()
        that.room_num()
      }
    })
  },
  // 获取用户信息
  userinfo: function(e) {
    var that = this
    app.getUserInfo(function(userInfo) {
     
      that.setData({
        userInfo: userInfo
      })
    })
  },
  refresh: function(e) {
    var that = this
    var room_id = that.data.room_id
    var hotel_id = that.data.hotel_id
    var grade = that.data.grade
    // 查看平台是否开启了会员等级
    if (grade == 2) {
      that.setData({
        discount: 1
      })
      if (that.data.z_price != null) {

      }
    } else {
      // 获取会员等级
      app.getUserInfo(function(userInfo) {
        var level_id = userInfo.id
      
        // 获取会员折扣
        var discount = userInfo.discount
        if (discount == null) {
          discount = 10
        }
       
        that.setData({
          discount: discount / 10
        })
        if (that.data.z_price != null) {
          that.cost()
        }
      })
    }

    var user_id = wx.getStorageSync('userInfo').id
    app.util.request({
      'url': 'entry/wxapp/MyCoupons',
      'cachetime': '0',
      data: {
        user_id: user_id
      },
      success: function(res) {
      
       
        that.setData({
          coupons: res.data
        })
      }
    })
    // 获取房间信息
    app.util.request({
      'url': 'entry/wxapp/RoomDetails',
      'cachetime': '0',
      data: {
        room_id: room_id
      },
      success: function(res) {
       
        // 单个房间价格
        var price = res.data.price
        // 单个房间押金
        var yj_cost = res.data.yj_cost
        that.setData({
          room: res.data,
          yj_cost: Number(res.data.yj_cost)
        })
        that.cost()
      },
    })
    // 获取酒店信息
    app.util.request({
      'url': 'entry/wxapp/PjDetails',
      'cachetime': '0',
      data: {
        seller_id: hotel_id
      },
      success: function(res) {
       
        that.setData({
          hotel: res.data
        })
        if (res.data.wx_open != 1 && res.data.ye_open != 1) {
          that.mode2()
        }
      },
    })
    // 获取我的红包
    app.util.request({
      'url': 'entry/wxapp/MyHb',
      'cachetime': '0',
      data: {
        user_id: user_id,
        page: 1
      },
      success: function(res) {
       
        that.setData({
          my_hb: res.data
        })
      },
    })
  },
  // 房间数量
  room_num: function(e) {
    var that = this
    // 从本地缓存中获取入住开始的时间
    var day1 = wx.getStorageSync("day1")
    // 从本地缓存中获取入住结束的时间
    var day2 = wx.getStorageSync("day2")
    var room_id = that.data.room_id
    app.util.request({
      url: 'entry/wxapp/GetRoomNum',
      data: {
        room_id: room_id,
        start: day1,
        end: day2
      },
      success: res => {
      
        var zd_num = []
        var room_num = []
        res.data.map(function(item) {
          var obj = {}
          obj = Number(item.nums)
          room_num.push(obj)
        })
        for (let i in res.data) {
          if (res.data[i].nums <= 0) {
            zd_num.push(res.data[i])
          }
        }
        room_num = room_num.sort(app.sort_num_order)
      
        that.setData({
          rooms: room_num[0]
        })
      
        if (zd_num.length > 0) {
          wx.showModal({
            title: '',
            content: zd_num[0].dateday + '没有房间了',
            success: res => {
              if (res.confirm) {
              
                wx.navigateBack({
                  delta: 1
                })
              } else if (res.cancel) {
               
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
      }
    })
  },
  // 使用红包
  use_res_bag: function(e) {
    wx.navigateTo({
      url: '../coupon/red_bag',
    })
  },
  // 时间选择器
  bindTimeChange: function(e) {
 
    this.setData({
      time: e.detail.value,
    })
  },
  // 增加房间数
  add_num: function(e) {
    var that = this
    if (that.data.rooms == that.data.num) {
      wx.showModal({
        title: '',
        content: '没有这么多房间啦',
      })
    } else {
      // 房间数量+1
      var num = that.data.num + 1
      that.setData({
        num: num,
      })
      that.cost()
    }
  },
  // 减少房间数
  reduce_num: function(e) {
    var that = this
    // 房间数量减一
    var num = that.data.num - 1
    if (num >= 1) {
      that.setData({
        num: num
      })
      that.cost()
    }
  },
  // 查看房间价格详情
  see_price: function(e) {
    var that = this
    var see_price = that.data.see_price
    if (see_price == true) {
      that.setData({
        see_price: false
      })
    } else {
      that.setData({
        see_price: true
      })
    }
  },
  mode1: function(e) {
    var that = this
    that.setData({
      mode1: 'success',
      mode2: 'clear',
      mode3: 'clear',
      refrer_to: '确认支付',
      type: 1
    })
    that.refresh()
  },
  mode2: function(e) {
    var that = this
    that.setData({
      mode1: 'clear',
      mode2: 'success',
      mode3: 'clear',
      refrer_to: '确认支付',
      yj_cost: 0,
      type: 3
    })
    that.cost()
  },
  mode3: function(e) {
    var that = this
    var hotel = that.data.hotel
    var user_info = that.data.userInfo
    if (hotel.ye_open == 2) {
      that.setData({
        refrer_to: '该酒店不支持余额支付'
      })
    } else {
      if (Number(user_info.balance) < that.data.settlement) {
        wx.showModal({
          title: '',
          content: '余额不足,请先去充值',
        })
      } else {
        that.setData({
          refrer_to: '确认支付',
          type: 2
        })
        that.setData({
          mode1: 'clear',
          mode2: 'clear',
          yj_cost: 0,
          mode3: 'success'
        })
        that.cost()
      }
    }
  },
  // 计算金额
  cost: function(e) {
    var that = this
    // 房间数量
    var num = that.data.num
    // 房间押金金额
    var yj_cost = Number(that.data.yj_cost)
    var yj_price = yj_cost * num
    // 单间房间的价格
    var price1 = that.data.z_price
    // 优惠券的金额
    var coupon = that.data.coupon
    // 红包的金额
    var red_bag = Number(that.data.red_bag)
    // 没有折扣的总金额
    var price = Number(price1) * num
    // 有折扣的金额
    var discount = that.data.discount
    var discount_price = price * discount
    // 折扣减免的金额
    var reduction_price = price - discount_price
    // 结算金额
    var settlement = discount_price - coupon + yj_price - red_bag
    // 折扣后的价格
    var dis_cost = price - coupon - red_bag
    dis_cost = dis_cost.toFixed(2)
    if (dis_cost <= 0) {
      dis_cost = 0
    }
    discount_price = discount_price.toFixed(2)
    reduction_price = reduction_price.toFixed(2)
    settlement = settlement.toFixed(2)
    var total_price = price
    price = price + yj_price
    if (settlement <= 0) {
      if (yj_cost != 0) {
        settlement = yj_price
      } else {
        settlement = 0.01
      }

    }
    price = price.toFixed(2)
    total_price = total_price.toFixed(2)
    that.setData({
      price: price,
      total_price: total_price,
      settlement: settlement,
      discount_price: discount_price,
      reduction_price: reduction_price,
      dis_cost: dis_cost,
      yj_price: yj_price,

    })
  },
  // 使用优惠券
  use_coupon: function(e) {
    // 跳转页面的时候携带折扣后的金额
    var settlement = this.data.discount_price
    // 跳转页面的时候携带酒店id判断优惠券是否是适用该酒店
    var hotel_id = this.data.hotel_id
    wx.navigateTo({
      url: '../coupon/store_coupon?money=' + settlement + '&hotel_id=' + hotel_id,
    })
  },
  // 点击展开支付选择
  pay_mode: function(e) {
    var that = this
    var pay_mode = that.data.pay_mode
    if (pay_mode == true) {
      that.setData({
        pay_mode: false
      })
    } else {
      that.setData({
        pay_mode: true
      })
    }
  },
  formSubmit1:function(e){
    var form_id = e.detail.formId
    this.setData({
      form_id: form_id
    })
  },
  // 提交订单
  formSubmit: function(e) {
    var that = this
    var form_d = that.data.form_d
    var form_id = that.data.form_id
    function isTelCode(str) {
      var reg = /^1[3|4|5|7|8|9][0-9]\d{4,8}$/;
      return reg.test(str);
    }
    var user_info = that.data.userInfo
    var formId = e.detail.formId
    var hotel = that.data.hotel
    var room = that.data.room
    var code = e.detail.value.code
    // 房间价格
    var total_price = that.data.total_price
    // 结算总金额
    var settlement = that.data.settlement
    // 获取优惠券满减条件
    var condition = that.data.condition
    // 获取房间的总价格
    var z_money = that.data.price
    // 入住人
    var name = e.detail.value.people
    // 联系人电话
    var tel = e.detail.value.tel
    // 到店时间
    var dd_time = that.data.time
    // 酒店id
    var seller_id = hotel.id
    // 房间id
    var room_id = room.id
    // 用户id
    var user_id = wx.getStorageSync('userInfo').id
    // 优惠券id
    var coupons_id = that.data.coupons_id
    // 酒店名字
    var seller_name = hotel.name
    // 酒店地址
    var seller_address = hotel.address
    // 酒店经纬度
    var coordinates = hotel.coordinates
    // 到店日期
    var arrival_time = that.data.day1
    // 离店日期
    var departure_time = that.data.day2
    // 结算总金额
    var price = z_money
    // 房间数量
    var num = that.data.num
    // 房间类型
    var room_type = room.name
    // 床型
    var bed_type = room.size
    // 入住天数
    var days = that.data.day
    // 折扣后的价格
    var dis_cost = that.data.discount_price
    // 押金金额
    var yj_cost = that.data.yj_cost
    // 优惠券金额
    var yhq_cost = that.data.coupon
    // 房间图片
    var room_logo = room.logo
    // 折扣的金额
    var yyzk_cost = that.data.reduction_price
    // 红包金额
    var hb_cost = that.data.red_bag
    // 红包id
    var hb_id = that.data.red_bag_id
    // 支付方式
    var type = that.data.type
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
    } else if (isTelCode(tel) == false) {
      title = '请输入正确的手机号'
    } else if (yhq_cost > 0) {
      if (condition > that.data.discount_price) {
        title = '不满足优惠券满减条件'
      }
    } else if (settlement <= 0) {
      settlement = 0.01
    }
    var pay_num = that.data.pay_num
    if (title != '') {
      wx: wx.showModal({
        title: '温馨提示',
        content: title,
      })
      that.setData({
        pay_num: 1
      })
    } else if (title == '' && pay_num == 1) {
      that.setData({
        pay_num: 0
      })
      if (user_info.zs_name == '' && that.data.garde == 1) {
        wx.showModal({
          content: '您需要注册会员',
          success: function(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../register/register',
              })
            }
          }
        })
      } else {
        wx.showLoading({
          title: '正在提交订单',
          mask:true
        })
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
            num: num,
            room_type: room_type,
            bed_type: bed_type,
            days: days,
            dis_cost: dis_cost,
            yj_cost: yj_cost,
            yhq_cost: yhq_cost,
            total_cost: settlement,
            room_logo: room_logo,
            yyzk_cost: yyzk_cost,
            hb_id: hb_id,
            hb_cost: hb_cost,
            from_id: form_id,
            classify: 1,
            type: type,
            qr_fromid: form_d,
            code: code
          },
          method:'POST',
          success: res => {
            var result = res.data
            var order_id = res.data
            if (type == 1) {
              result = typeof(result)
              var openid = app.OpenId
              if (result != "string") {
                app.util.request({
                  'url': 'entry/wxapp/Pay',
                  'cachetime': '0',
                  data: {
                    openid: openid,
                    money: settlement,
                    order_id: order_id
                  },
                  success: function(res) {
                    wx.requestPayment({
                      'timeStamp': res.data.timeStamp,
                      'nonceStr': res.data.nonceStr,
                      'package': res.data.package,
                      'signType': res.data.signType,
                      'paySign': res.data.paySign,
                      'success': function(res) {
                        wx.hideLoading()
                        wx.redirectTo({
                            url: '../order/order?activeIndex=' + 0 + '&index=' + 0 + '&status=' + 0,
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
                          success: function(res) {
                            wx.hideLoading()
                          },
                        })
                      },

                      'fail': function(res) {
                        wx.hideLoading()
                        wx.showToast({
                          title: '支付失败',
                        })
                        wx.redirectTo({
                            url: '../order/order?activeIndex=' + 1 + '&index=' + 1 + '&status=' + 0,
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
            } else if (type == 2) {
              result = typeof(result)
              var openid = app.OpenId
              if (result != "string") {
                app.util.request({
                  'url': 'entry/wxapp/YePay',
                  'cachetime': '0',
                  data: {
                    order_id: order_id
                  },
                  success: function (res) {
                    wx.hideLoading()
                    wx.showToast({
                      title: '支付成功',
                    })
                    setTimeout(function() {
                      wx.redirectTo({
                          url: '../order/order?activeIndex=' + 0 + '&index=' + 0 + '&status=' + 0,
                      })
                    }, 1000)
                    var openid = wx.getStorageSync('userInfo').openid
                    app.util.request({
                      'url': 'entry/wxapp/Message',
                      'cachetime': '0',
                      data: {
                        form_id: formId,
                        openid: openid,
                        order_id: order_id,
                      },
                      success: function(res) {
                      },
                    })
                  },
                })
              } else {
                wx.showModal({
                  content: res.data,
                })
              }
            } else if (type == 3) {
              wx.hideLoading()
              wx.showToast({
                title: '订单提交成功',
              })
              setTimeout(function() {
                wx.redirectTo({
                  url: '../order/order?activeIndex=' + 0 + '&index=' + 0+'&status='+0,
                })
              }, 1500)
            }


          }
        })
      }

    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.userinfo()
    if (this.data.coupons_id != -1) {
      this.cost()
    } else if (this.data.coupons_id == '') {
      this.cost()
    }
    if (this.data.red_bag != 0) {
      this.cost()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
})