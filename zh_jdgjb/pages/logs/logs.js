//logs.js
const util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    users: true,
    level_name: '初始会员',
    score:0,
    balance:0,
    coupon_length:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getUrl(that)
    app.getSystem(that)
  },
  refresh: function (e) {
    var that = this
    var user_id = wx.getStorageSync("userInfo").id
    app.util.request({
      'url': 'entry/wxapp/MyCoupons',
      'cachetime': '0',
      data: {user_id: user_id },
      success: function (res) {
        that.setData({
          coupon_length:res.data.length
        })
      }
    })
    app.util.request({
      url: 'entry/wxapp/CheckRz',
      data: { user_id: user_id },
      success: res => {
        that.setData({
          state: res.data
        })
      }
    })
    app.util.request({
      url: 'entry/wxapp/GetFxSet',
      success: res => {
        that.setData({
          GetFxSet: res.data
        })
      }
    })
  },
  // 跳转订单
  mine_order: function (e) {
    if (this.data.users == true) {
      var index = e.currentTarget.dataset.index
      var activeIndex = index
      wx: wx.navigateTo({
          url: '../order/order?activeIndex=' + activeIndex + '&index=' + index + '&status=' + e.currentTarget.dataset.status,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      this.bind_user_info()
    }

  },
  // —————————————跳转到个人中心页面———————————————
  home: function (e) {
    wx.reLaunch({
      url: '../index/index',
    })
  },
  // 跳转后台管理
  seller_manage: function (e) {
    if (this.data.users == true) {
      wx.navigateTo({
        url: '../login_entry/login_entry'
      })
    } else {
      this.bind_user_info()
    }
  },
  // 授权管理
  opensetting: function (res) {
    wx.openSetting({

    })
  },
  // 积分商城
  integral: function (e) {

    if (this.data.users == true) {
      wx.navigateTo({
        url: '../jifen/jifen',
      })
    } else {
      this.bind_user_info()
    }
  },
  // 商家入驻
  settled_store: function (e) {

    if (this.data.users == true) {
      wx.navigateTo({
        url: '../settled_store/settled_store',
      })
    } else {
      this.bind_user_info()
    }
  },
  // 联系客服
  service: function (e) {

    if (this.data.users == true) {
      wx.navigateTo({
        url: '../service/service',
      })
    } else {
      this.bind_user_info()
    }
  },
  // 我的优惠券
  coupon: function (e) {

    if (this.data.users == true) {
      wx.navigateTo({
        url: '../coupon/store_coupon',
      })
    } else {
      this.bind_user_info()
    }
  },
  // 领取优惠券
  receive_coupon: function (e) {

    if (this.data.users == true) {
      wx.navigateTo({
        url: '../coupon/receive_coupon',
      })
    } else {
      this.bind_user_info()
    }
  },
  // 会员注册 
  user_zhuce:function(e){
    var that = this
    var a = that.data
    var users = a.userInfo
    // 查看是否开启会员注册
    var grade = a.platform.open_member
    if (grade == 1 && grade != null) {
      if (users.zs_name == '' || users.zs_name == null) {
        wx.navigateTo({
          url: '../register/register',
        })
      } else {
        wx.navigateTo({
          url: 'member',
        })
      }
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '平台未开放注册会员,请联系平台管理员',
      })
    } 
  },
  // 清楚缓存
  cancel_storange: function (e) {
    wx.clearStorage()
    wx.showToast({
      title: '清除成功',
    })
  },
  // 底部版权跳转小程序
  copyright: function (e) {
    var appid = wx.getStorageSync('platform').tz_appid
    wx.navigateToMiniProgram({
      appId: appid,
      success(res) {
        // 打开成功\
      }
    })
  },
  // 充值中心
  recharge: function (e) {

    if (this.data.users == true) {
      wx.navigateTo({
        url: '../recharge/index',
      })
    } else {
      this.bind_user_info()
    }
  },
  // 积分记录
  score_detail: function (e) {
    if (this.data.users == true) {
      wx.navigateTo({
        url: '../jifen/scoredetails',
      })
    } else {
      this.bind_user_info()
    }
  },
  // 会员等级介绍
  // member: function (e) {
  //   var that = this
  //   var user_info = that.data.userInfo
  //   console.log(user_info)
  //   if (user_info.zs_name == '' || user_info.zs_name == null) {
  //     wx.showModal({
  //       content: '您需要注册会员',
  //       success: function (res) {
  //         if (res.confirm) {
  //           console.log('用户点击确定')
  //           wx.navigateTo({
  //             url: '../register/register',
  //           })
  //         }
  //       }
  //     })
  //   } else {
  //     wx.navigateTo({
  //       url: 'member',
  //     })
  //   }
  // },
  // 分销商
  distribution: function (e) {
    var that = this
    if (that.data.users == true) {
      var GetFxSet = that.data.GetFxSet
      var user_info = that.data.userInfo
      var user_id = wx.getStorageSync("userInfo").id
      var grade = that.data.platform.open_member
      if (user_info.zs_name == '' && grade == 1) {
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
      } else {
        // 查看是否是分销商
        app.util.request({
          url: 'entry/wxapp/MyDistribution',
          data: { user_id: user_id },
          success: res => {
            if (res.data == false) {
              wx.navigateTo({
                url: '../distribution/examine',
              })

            } else {
              if (res.data.state == 1) {
                wx.showModal({
                  title: '温馨提示',
                  content: '系统正在审核中，请稍后再试',
                })
              } else if (res.data.state == 2) {
                wx.navigateTo({
                  url: '../distribution/distribution',
                })
              } else if (res.data.state == 3) {
                wx.showModal({
                  title: '温馨提示',
                  content: '您的申请已被拒绝',
                })
              }
            }

          }
        })
      }
    } else {
      that.bind_user_info()
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
    var that = this
    app.getUserInfo(function(userInfo){
      that.setData({
        userInfo:userInfo,
          level_name: userInfo.level_name,
        balance: userInfo.balance,
        score: Number(userInfo.score)
      })
      that.refresh()
      // app.getUserinfo(that) 
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
})
