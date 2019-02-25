// pages/content/contentlist.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getUrl(that)
    app.getSystem(that)
    app.util.request({
      'url': 'entry/wxapp/GetSystem',
      success: function (res) {
        if (res.data.jd_custom.indexOf('查询') > -1) {
          res.data.jd_custom = res.data.jd_custom.replace('查询', '')
        }
        that.setData({
          luntext: [
            '房型列表',
            res.data.jd_custom + '详情',
            res.data.jd_custom + '评价',
          ]
        })
       
      }
    })
    that.date()
    that.setData({
      grade: wx.getStorageSync('platform').open_member
    })
    var text= that.data.text
    var scene = decodeURIComponent(options.scene)
    if (options.hotel_id ==null){
      var hotel_id = scene
    } else {
      var hotel_id = options.hotel_id
    }
    console.log("酒店id为", hotel_id)
    that.setData({
      hotel_id: hotel_id,
      start: app.util.time(),
      end: app.util.addDate(app.util.time(), 28)
    })
    that.refresh()
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
    var hotel_id = that.data.hotel_id
    var day1 = that.data.day1
    // 获取酒店详情
    app.util.request({
      'url': 'entry/wxapp/PjDetails',
      'cachetime': '0',
      data:{seller_id:hotel_id},
      success: function (res) {
        if(res.data.address.length>=9){
          res.data.address = res.data.address.slice(0, 9)+'...'
        }
        
        that.setData({
          hotel:res.data
        })
      }
    })
    var day1 = wx.getStorageSync('day1')
    var day2 = app.util.addDate(day1,1)
    // 获取该酒店房间信息
    app.util.request({
      'url': 'entry/wxapp/RoomList',
      'cachetime': '0',
      data: { seller_id: hotel_id },
      success: function (res) {
        var newarr = res.data
        for(let i in newarr){
          app.util.request({
            url: 'entry/wxapp/GetRoomCost',
            data: {
              room_id: newarr[i].id,
              start: day1,
              end: day2
            },
            success: res => {
              newarr[i].cost = res.data[0].mprice
              that.setData({
                room: newarr
              })
            }
          })
          app.util.request({
            url: 'entry/wxapp/GetRoomNum',
            data: {
              room_id: newarr[i].id,
              start: day1,
              end: day2
            },
            success: res => {
              newarr[i].room_num = res.data[0].nums
              that.setData({
                room: newarr
              })
            }
          })
        }
      
      },
    })
    // 获取该酒店评价信息
    app.util.request({
      'url': 'entry/wxapp/AssessList',
      'cachetime': '0',
      data: { seller_id: hotel_id },
      success: function (res) {
        for(let i in res.data){
          if (res.data[i].img != '') {
            res.data[i].img = res.data[i].img.split(",")
          }
          res.data[i].time = app.ormatDate(res.data[i].time).slice(0, 10) 
          res.data[i].content = res.data[i].content.replace("↵", "\n");
        }
        that.setData({
          assess_list:res.data.slice(0,5)
        })
      },
    })
  },
  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },
  // —————————————住房时间日期———————————————
  bindDateChange1: function (e) {
    var that = this
    var day1 = e.detail.value
    var day2 = that.data.dateout
    var current_date = that.data.current_date
    //  var time = app.getTime2Time(day2, day1)
     var dateout = app.util.addDate(day1, 1)
     wx.setStorageSync('day1', day1)
     wx.setStorageSync('day2', dateout)
     wx.setStorageSync('day', time)
     var time = app.getTime2Time(dateout, day1)
     that.setData({
       datein: e.detail.value,
       dateout: dateout,
       time: time
     })
    this.refresh()
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
  // 跳转房间详情
  room_info:function(e){
    var that = this
    var hotel_id = that.data.hotel.id
    var hotel = that.data.hotel
    var tel = hotel.tel
    var coordinates = hotel.coordinates
    var address = hotel.address
    var name = hotel.name
    wx.navigateTo({
      url: 'room_info?coordinates=' + coordinates + '&room_id=' + e.currentTarget.dataset.id + '&tel=' + tel + '&address=' + address + '&name=' + name + '&price=' + e.currentTarget.dataset.price,
    })
  },
  // ———————————跳转到订单页面———————————————
  order: function (e) {
    var that = this

   
   
  },
  // 全部评论
  all_comment:function(e){
    wx.navigateTo({
      url: 'all_comment?seller_id=' + this.data.hotel_id,
    })
  },
  // 查看酒店地址
  sele_address:function(e){
    var that = this
    var hotel = that.data.hotel
    var coordinates = hotel.coordinates.split(",")
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = Number(coordinates[0])
        var longitude = Number(coordinates[1])
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          name:hotel.name,
          address:hotel.address
        })
      }
    })
  },
  // 拨打酒店电话
  call_phone:function(e){
    wx.makePhoneCall({
      phoneNumber: this.data.hotel.tel
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
    for (let i in assess_list){
      if (id == assess_list[i].id){
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
  formSubmit:function(e){
    var that = this
    var form_d = e.detail.formId
    // wx.showModal({
    //   title: '',
    //   content: form_d,
    // })
    var grade = that.data.grade
    var userInfo = that.data.userInfo
    if (grade == 1&&userInfo.zs_name == ''){
      wx.showModal({
        content: '您需要注册会员',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../register/register',
            })
          }
        }
      })
    } else{
      var day1 = wx.getStorageSync('day1')
      var day2 = wx.getStorageSync('day2')
      if (app.time_title(day1, day2) == true) {
        if (e.detail.target.dataset.classify==1){
          wx.navigateTo({
            url: '../place_order/place_order?room_id=' + e.detail.target.dataset.id + '&hotel_id=' + that.data.hotel_id + '&form_d=' + form_d,
          })
        }else{
          wx.navigateTo({
            url: 'hour_room?room_id=' + e.detail.target.dataset.id + '&hotel_id=' + that.data.hotel_id + '&form_d=' + form_d + '&cost=' + e.detail.target.dataset.cost + '&rz_time=' + e.detail.target.dataset.rz_time,
          })
        }
       
      }
    }
  },
  hotel_in:function(e){
    wx.navigateTo({
      url: 'hotel_in?seller_id='+e.currentTarget.dataset.id,
    })
  },
  // 获取用户授权
  bindgetuserinfo:function(e){
    var that = this
    if (e.detail.errMsg =="getUserInfo:fail auth deny"){
      wx.showModal({
        title: '',
        content: '您拒绝了个人信息授权，无法正常使用小程序',
      }) 
    }
  },
  // 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onShareAppMessage: function() {
return {
title: this.data.hotel.name,
path: 'zh_jdgjb/pages/hotel_list/hotel_info?hotel_id='+this.data.hotel.id
}
}
})