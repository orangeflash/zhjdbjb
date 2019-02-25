// zh_jd/pages/logs/Backstage/Workbench.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [
      {
        img: '../img/workbench/gongzuotai@2x.png',
        img_select: '../img/workbench/gongzuota@2x.png',
        name: '工作台',
        id: 0
      },
      {
        img: '../img/workbench/dingdan@2x.png',
        img_select: '../img/workbench/dindan@2x.png',
        name: '订单',
        id: 1
      },
      {
        img: '../img/workbench/fangxing@2x.png',
        img_select: '../img/workbench/fangxin@2x.png',
        name: '房型管理',
        id: 2
      },
    ],
    order_nav: [
      {
        name: '全部订单'
      },
      {
        name: '待处理'
      },
      {
        name: '已完成'
      },
      {
        name: '退款订单'
      },
    ],
    page: 1,
    order: [],
    index: 0,
    ac_index: 0,
    order_index: 0,
    acti_index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getUrl(that)
    app.getSystem(that)
    that.setData({
      store_info:wx.getStorageSync('store_info'),
      type:options.type
    })
  },
  refresh: function (e) {
    var that = this
    if (that.data.type == 2) {
      var user_id = wx.getStorageSync('userInfo').id
      app.util.request({
        'url': 'entry/wxapp/StoreWxLogin',
        'cachetime': '0',
        data: { user_id: user_id},
        success: function (res) {
          that.setData({
            store_info: res.data
          })
          // 获取可提现金额
          app.util.request({
            'url': 'entry/wxapp/TxMoney',
            'cachetime': '0',
            data: {
              seller_id: res.data.seller_id
            },
            success: function (res) {
              that.setData({
                price: res.data
              })
            },
          })
        },
      })
    } else {
      var sign = wx.getStorageSync('sign')
      var store_info = wx.getStorageSync('store_info')
      app.util.request({
        'url': 'entry/wxapp/HtLogin',
        'cachetime': '0',
        data: { username: sign.name, password: sign.password },
        success: function (res) {
          if (res.data == '账号或密码错误') {
            wx: wx.showModal({
              title: '提示',
              content: '该账号已经修改，请重新登录',
              success: res => {
                if (res.confirm) {
                  wx.redirectTo({
                    url: 'logs',
                  })
                } else if (res.cancel) {
                  wx.redirectTo({
                    url: 'logs',
                  })
                }
              }
            })
          } else {
            that.setData({
              store_info: res.data
            })
            // 获取可提现金额
            app.util.request({
              'url': 'entry/wxapp/TxMoney',
              'cachetime': '0',
              data: {
                seller_id: res.data.seller_id
              },
              success: function (res) {
                that.setData({
                  price: res.data
                })
              },
            })
          }
        },
      })
    }
  },
  // 订单列表
  order_list: function (e) {
    var that = this
    var page = that.data.page
    var order = that.data.order
    var order_index = that.data.order_index
    if (order_index == 0) {
      var status = ''
    } else if (order_index == 1) {
      var status = 2
    } else if (order_index == 2) {
      var status = 4
    } else if (order_index == 3) {
      var status = 6
    }
    var store_info = that.data.store_info
    // 获取该酒店所有订单信息
    app.util.request({
      'url': 'entry/wxapp/SellerOrderList',
      'cachetime': '0',
      data: { seller_id: store_info.seller_id, status: status, page: page },
      success: function (res) {
        if (res.data.length > 0) {
          order = order.concat(res.data)
          for (let i in res.data) {
            res.data[i].arrival_time = res.data[i].arrival_time.slice(5, 10)
            res.data[i].departure_time = res.data[i].departure_time.slice(5, 10)
            res.data[i].time = app.ormatDate(res.data[i].time)
            if (res.data[i].status == 1) {
              res.data[i].status = '未付款'
            } else if (res.data[i].status == 2) {
                res.data[i].status = '待接单'
              const backgroundAudioManager = wx.getBackgroundAudioManager()
              backgroundAudioManager.src = 'http://hl.zhycms.com/addons/zh_jd/template/images/text2audio.mp3'
            } else if (res.data[i].status == 3) {
              res.data[i].status = '已取消'
            } else if (res.data[i].status == 4) {
              res.data[i].status = '已完成'
            } else if (res.data[i].status == 5) {
              res.data[i].status = '已入住'
            } else if (res.data[i].status == 6) {
              res.data[i].status = '申请退款中'
            } else if (res.data[i].status == 7) {
              res.data[i].status = '已退款'
            } else if (res.data[i].status == 8) {
              res.data[i].status = '拒绝退款'
            } else if (res.data[i].status == 9) {
              res.data[i].status = '拒绝入住'
            } else if (res.data[i].status == 10) {
                res.data[i].status = '待入住'
            } else if (res.data[i].status == 12) {
                res.data[i].status = '已评价'
            }
          }
          that.setData({
            order: res.data,
            page: page + 1
          })
        } else {
          // wx.showToast({
          //   title: '没有更多了',
          // })
        }

      },
    })
  },
  //房间列表
  room_list: function (e) {
    var that = this
    var store_info = that.data.store_info
    // 获取该酒店房间信息
    app.util.request({
      'url': 'entry/wxapp/RoomList',
      'cachetime': '0',
      data: { seller_id: store_info.seller_id, },
      success: function (res) {
        var newarr = res.data
        for (let i in newarr) {
          if (i % 2 == 0) {
            newarr[i].img = '../img/workbench/dididi@2x.png'
            newarr[i].class = 'back_one'
          } else {
            newarr[i].img = '../img/workbench/house_management_one.png'
            newarr[i].class = 'back_two'
          }
        }
        that.setData({
          room: newarr
        })
      },
    })
  },
  nav_bottom: function (e) {
    var index = e.currentTarget.dataset.index
    if (index == 1) {
      this.order_list()
    }
    if (index == 2) {
      this.room_list()
    }
    this.setData({
      index: index,
      ac_index: index
    })
  },
  order_sele: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      order_index: index,
      page: 1,
      order: [],
    })
    this.order_list()
  },
  // 待支付
  wait_payment:function(e){
    this.setData({
      order_index: 1,
      page: 1,
      order: [],
      index: 1,
      ac_index: 1
    })
    this.order_list()
  },
  // 已完成
  already: function (e) {
    this.setData({
      order_index: 2,
      page: 1,
      order: [],
      index:1,
      ac_index:1
    })
    this.order_list()
  },
  // 退款订单
  refund: function (e) {
    this.setData({
      order_index: 3,
      page: 1,
      order: [],
      index: 1,
      ac_index: 1
    })
    this.order_list()
  },
  // 核销订单
  code: function (e) {
    var that = this
    var store_info = that.data.store_info
   wx.showModal({
     content: '是否核销此订单',
     success:res=>{
       if (res.confirm){
         wx.scanCode({
           success: (res) => {
             var order_id = res.path.slice(36, res.path.length)
             app.util.request({
               'url': 'entry/wxapp/SmRz',
               'cachetime': '0',
               data: {
                 seller_id: store_info.seller_id,
                 order_id: order_id
               },
               success: function (res) {
                 if(res.data==1){
                   wx.showToast({
                     title: '订单核销成功',
                   })
                 }else{
                   wx.showToast({
                     title: '核销失败',
                   })
                 }
               },
             })
           }
         })
       }
     }
   })
  },
  // 订单详情
  order_info: function (e) {
    wx.navigateTo({
      url: 'order_info?id=' + e.currentTarget.dataset.id,
    })
  },
  // 编辑房型
  edit: function (e) {
    wx.navigateTo({
      url: 'house_info?id=' + e.currentTarget.dataset.id,
    })
  },
  // 搜搜订单
  search: function (e) {
    wx.navigateTo({
      url: 'search',
    })
  },
  // 上架下架
  change_room: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var states = e.currentTarget.dataset.state
    if (states == 1) {
      var state = 2
    } else {
      var state = 1
    }
    wx.showModal({
      title: '',
      content: '确定要修改？',
      success: res => {
        if (res.confirm) {
          app.util.request({
            url: 'entry/wxapp/ChangeRoom',
            data: { room_id: id, state: state },
            success: res => {
              if (res.data == 1) {
                wx.showToast({
                  title: '修改成功',
                })
                setTimeout(function () {
                  that.room_list()
                }, 1500)
              }
            }
          })
        }
      }
    })
  },
  // 删除房型
  delete_house: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '',
      content: '确定要删除此房型？',
      success: res => {
        if (res.confirm) {
          app.util.request({
            url: 'entry/wxapp/DeleteRoom',
            data: { room_id: id },
            success: res => {
              if (res.data == 1) {
                wx.showToast({
                  title: '删除成功',
                })
                setTimeout(function () {
                  that.room_list()
                }, 1500)
              }
            }
          })
        }
      }
    })
  },
  // 商户提现
  put_forward: function (e) {
    wx.navigateTo({
      url: 'put_forward?seller_id=' + this.data.store_info.seller_id,
    })
  },
  // 提现记录
  put_forward_record: function (e) {
    wx.navigateTo({
      url: 'record?seller_id=' + this.data.store_info.seller_id,
    })
  },
  // 评价管理
  reply: function (e) {
    wx.navigateTo({
      url: 'reply?seller_id=' + this.data.store_info.seller_id,
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
    var that = this
    that.refresh()
    that.order_list()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      page:1,
      order:[]
    })
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
    var index = that.data.index
    if (index == 1) {
      that.setData({
        page: 1,
        order: []
      })
      that.order_list()
      wx.stopPullDownRefresh()
    } else {
      wx.stopPullDownRefresh()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.order_list()
  },

})