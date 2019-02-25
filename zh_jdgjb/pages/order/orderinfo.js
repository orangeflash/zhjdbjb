// pages/order/orderinfo/orderinfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getUrl(that)
    app.getSystem(that)
    
    app.util.request({
      url: 'entry/wxapp/OrderCode',
      data: { order_id: options.id },
      success: res => {
       
        that.setData({
          bath: res.data
        })
      }
    })
    app.util.request({
      url: 'entry/wxapp/orderdetails',
      data: { order_id: options.id },
      success: res => {
      
        var order_info = res.data
        order_info.arrival_time = order_info.arrival_time.slice(5, 7) + '月' + order_info.arrival_time.slice(8, 10) + '日'
        order_info.departure_time = order_info.departure_time.slice(5, 7) + '月' + order_info.departure_time.slice(8, 10) + '日'
        that.setData({
          order_info: order_info
        })
      }
    })
  },

  // ———————————订单详情再次调起支付———————————————
  confirmorder: function (e) {
    var that = this
    var openid = app.OpenId
    var order_info = that.data.order_info
    app.util.request({
      'url': 'entry/wxapp/Pay',
      'cachetime': '0',
      data: { openid: openid, money: order_info.total_cost, order_id: order_info.id },
      method: 'POST',
      success: function (res) {
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function (res) {
         
           
            wx.navigateBack({
              delta: 1
            })
          },

          'fail': function (res) {
          
            wx.showToast({
              title: '支付失败',
            })

          },
        })
      },
    })
  },
  // 再订一间
  order_more: function (e) {
    wx.navigateTo({
      url: '../hotel_list/hotel_info?hotel_id=' + this.data.order_info.seller_id+'&type='+1,
    })
  },
  // 查看更多
  see_more: function (e) {
    var that = this
    var platform = that.data.platform
    if (platform.type == 2) {
      wx.navigateTo({
        url: '../hotel_list/hotel_list',
      })
    } else {
      wx.navigateTo({
        url: '../index/index',
      })
    }
  },
  // 取消订单
  cancel_order: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var hb_id = e.currentTarget.dataset.hb_id
    var classify = e.currentTarget.dataset.classify
    if (classify==1){
     
      app.util.request({
        url: 'entry/wxapp/CancelOrder',
        data: { order_id: id, hb_id: hb_id },
        success: res => {
        
          wx.showToast({
            title: '订单已取消',
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      })
    }else{
      wx.showModal({
        title: '',
        content: '钟点房不可以取消',
      })
    }
   
  },
  // 申请退款
  apply: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var type = e.currentTarget.dataset.type
   
    wx.showModal({
      title: '温馨提示',
      content: '是否申请退款？',
      success: function (res) {
        if (res.confirm) {
         
          if (type==1){
            app.util.request({
              url: 'entry/wxapp/ApplyOrder',
              data: { order_id: id },
              success: res => {
               
                wx.showToast({
                  title: '申请成功',
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1500)
              }
            })
          }else if(type==2){
            app.util.request({
              url: 'entry/wxapp/YeRefund',
              data: { order_id: id },
              success: res => {
                
                wx.showToast({
                  title: '申请成功',
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1500)
              }
            })
          }else if(type==3){
            wx.showModal({
              title: '',
              content: '到店付不支持退款',
            })
          }
         
        } else if (res.cancel) {
         
        }
      }
    })
  },
  // 查看二维码
  code:function(e){
    var that = this
    var code = that.data.code
    if(code==true){
      that.setData({
        code:false
      })
    }else{
      that.setData({
        code:true
      })
    }
  },
  // 查看酒店地址
  sele_address: function (e) {
    var that = this
    var hotel = that.data.order_info
    var coordinates = hotel.coordinates.split(",")
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = Number(coordinates[0])
        var longitude = Number(coordinates[1])
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          name: hotel.seller_name,
          address: hotel.seller_address
        })
      }
    })
  },
  // 去评价
  go_eveluate: function (e) {
    wx.navigateTo({
      url: 'evaluate?seller_id=' + this.data.order_info.seller_id + '&order_id=' + this.data.order_info.id,
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