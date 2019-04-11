// pages/content/content.js
var app = getApp()
var loading = 2
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // Recommend: 1,//默认推荐排序
    // price_sorting: 0,//默认价格排序
    // nearby: 0,//默认距离排序
    page: 1,
    hotel: [],
    timg: false
  },
  location: function (e) {
    if (this.data.platform.openCity == '1') {
      wx.navigateTo({
        url: '../switchcity/switchcity?cityName=' + this.data.weizhi,
      })
      return
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getUrl(that)
    app.getSystem(that)
    that.setData({
      start: app.util.time(),
      end: app.util.addDate(app.util.time(), 28)
    })
    if (options.nearby == 1) {
      that.setData({
        nearby: options.nearby,
        Recommend: 2,
        price_sorting: 0
      })
    } else {
      that.setData({
        nearby: 0,
        Recommend: 1,
        price_sorting: 0
      })
    }
    var platform = wx.getStorageSync('platform')
    that.setData({
      platform: platform,
      weizhi: wx.getStorageSync('cityName'),
      lat1: wx.getStorageSync("latitude"),
      lng1: wx.getStorageSync("longitude")
    })
    if (location == 2) {
      wx.showLoading({
        title: '正在加载',
        complete: function () {

        },
        fail: function () {

        }
      });
    }
    that.refresh()
    that.date()
  },
  date: function (e) {
    var that = this
    var date1 = wx.getStorageSync('day1')
    var date2 = wx.getStorageSync('day2')
    var time = wx.getStorageSync('day')
    // 获取到当前日期并存储
    var date_today = app.util.time()
    wx.setStorageSync('datein', datein)
    if (date1 == '') {
      // 计算当前日期并保存
      var datein = app.util.time()
      wx.setStorageSync('datein', datein)
    } else {
      // 判断存储的日期是否小于当前日期
      if (date1 < date_today) {
        var datein = date_today
      } else {
        var datein = date1
      }

    }


    if (date2 == '') {
      var dateout = app.util.addDate(date_today, 1)
    } else {
      // 获取明天的日期
      var date_tomorrow = app.util.addDate(date_today, 1)
      // 判断存储的日期是否小于当前日期
      if (date2 < date_tomorrow) {
        var dateout = date_tomorrow
      } else {
        var dateout = date2
      }

    }


    // 时间的方法都封装在微擎util.js里

    // 当前默认的时间间隔
    var time = app.util.day(dateout, datein)



    // 异步存储开始时间 结束时间以及天数
    wx.setStorageSync('day1', datein)
    wx.setStorageSync('day2', dateout)
    wx.setStorageSync('day', time)



    // 输出数据
    that.setData({
      datein: datein,
      dateout: dateout,
      time: time,
      current_date: datein
    })
  },
  refresh: function (e) {
    var that = this
    var page = that.data.page
    var hotel = that.data.hotel
    // 获取排序的状态
    var Recommend = that.data.Recommend
    var price_sorting = that.data.price_sorting
    var nearby = that.data.nearby
    // 获取酒店列表
    app.util.request({
      'url': 'entry/wxapp/JdList',
      'cachetime': '0',
      data: { page: page, cityName:wx.getStorageSync('cityName') },
      success: function (res) {
        if (res.data.length > 0) {
          that.setData({
            page: page + 1,
            none_more: false
          })
          hotel = hotel.concat(res.data)
          for (let i = 0; i < hotel.length; i++) {
            var lat = hotel[i].coordinates
            var ss = lat.split(",")
            hotel[i].lat2 = ss[0]
            hotel[i].lng2 = ss[1]
            // 获取用户当前地理位置的经纬度
            var lat1 = that.data.lat1
            var lng1 = that.data.lng1
            var lat2 = Number(ss[0])
            var lng2 = Number(ss[1])
            hotel[i].distance = app.util.location(lat1, lat2, lng1, lng2)
          }
          // 状态为推荐排序
          if (Recommend == 1) {
            that.setData({
              hotel: hotel,
              timg: true
            })
          } else {
            if (price_sorting == 1) {
              that.setData({
                hotel: hotel.sort(app.sort_price_order),
                timg: true
              })
            }
            if (price_sorting == 2) {
              that.setData({
                hotel: hotel.sort(app.sort_price_Reverse),
                timg: true
              })
            }
            if (nearby == 1) {
              that.setData({
                hotel: hotel.sort(app.sort_distance_order),
                timg: true
              })
            }
            if (nearby == 2) {
              that.setData({
                hotel: hotel.sort(app.sort_distance_Reverse),
                timg: true
              })
            }
          }






        } else {
          that.setData({
            none_more: true,
            timg: true
          })
        }

      }
    })
  },
  // 推荐排序
  Recommend: function (e) {
    var that = this
    var Recommend = that.data.Recommend
    that.setData({
      price_sorting: 0,
      Recommend: 1,
      nearby: 0,
      page: 1,
      hotel: []
    })
    that.refresh()
  },
  // 价格排序
  price_sorting: function (e) {
    var that = this
    var price_sorting = that.data.price_sorting
    var hotel = that.data.hotel
    function sort_price_order(a, b) {
      return a.tel - b.tel
    }
    function sort_price_Reverse(a, b) {
      return b.tel - a.tel
    }
    // 判断价格排序状态 0为未选中 1为倒序 2为升序
    if (price_sorting == 0) {
      that.setData({
        price_sorting: 2,
        Recommend: 2,
        nearby: 0,
        page: 1,
        hotel: [],
        timg: false
      })
      that.refresh()
    } else {
      if (price_sorting == 1) {
        that.setData({
          price_sorting: 2,
          Recommend: 2,
          nearby: 0,
          page: 1,
          hotel: [],
          timg: false
        })
        that.refresh()
      } else if (price_sorting == 2) {
        that.setData({
          price_sorting: 1,
          Recommend: 2,
          nearby: 0,
          page: 1,
          hotel: [],
          timg: false
        })
        that.refresh()
      }
    }
  },
  // 距离排序
  nearby: function (e) {
    var that = this
    var nearby = that.data.nearby
    var hotel = that.data.hotel_b
    function sort_distance_order(a, b) {
      return a.distance - b.distance
    }
    function sort_distance_Reverse(a, b) {
      return b.distance - a.distance
    }
    if (nearby == 0) {
      that.setData({
        price_sorting: 0,
        Recommend: 2,
        nearby: 2,
        page: 1,
        hotel: [],
        timg: false
      })
      that.refresh()
    } else {
      if (nearby == 1) {
        that.setData({
          price_sorting: 0,
          Recommend: 2,
          nearby: 2,
          page: 1,
          hotel: [],
          timg: false
        })
        that.refresh()
      } else if (nearby == 2) {
        that.setData({
          price_sorting: 0,
          Recommend: 2,
          nearby: 1,
          page: 1,
          hotel: [],
          timg: false
        })
        that.refresh()
      }
    }
  },
  // —————————————住房时间日期———————————————
  bindDateChange1: function (e) {
    var that = this
    var day1 = e.detail.value
    var day2 = that.data.dateout
    var current_date = that.data.current_date
    var time = app.getTime2Time(day2, day1)
    wx.setStorageSync('day1', day1)
    wx.setStorageSync('day2', day2)
    wx.setStorageSync('day', time)
    that.setData({
      datein: e.detail.value,
      time: time
    })
  },
  // —————————————离开时间日期———————————————
  bindDateChange2: function (e) {
    var that = this
    var day1 = that.data.datein
    var day2 = e.detail.value
    var time = app.getTime2Time(day2, day1)
    wx.setStorageSync('day1', day1)
    wx.setStorageSync('day2', day2)
    wx.setStorageSync('day', time)
    that.setData({
      dateout: e.detail.value,
      time: time
    })

  },
  // ———————————跳转到酒店价格列表—————————————
  conlist: function (e) {
    wx.navigateTo({
      url: 'hotel_info?hotel_id=' + e.currentTarget.dataset.id+'&type='+1,
    })
  },
  search: function (e) {
    wx.navigateTo({
      url: '../index/search',
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
    app.getUserInfo(function (userInfo) {
    })
    this.date()
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
    this.setData({
      location: 2
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    that.setData({
      page: 1,
      hotel: [],
      nearby: 0,
      Recommend: 1,
      price_sorting: 0
    })
    that.refresh()
    wx, wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    that.setData({
      timg: false
    })
    that.refresh()
  },
})