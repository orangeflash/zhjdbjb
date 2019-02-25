//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
var location = ''
Page({
    data: {
        bomb: false,
        showLoading: true
    },
    onLoad: function(options) {
        var that = this;
        app.getUrl(that)
        app.getSystem(that)
        //获取用户信息
        app.getUserInfo(function(userInfo) {
            that.setData({
                userInfo: userInfo,
            })
            // if(userInfo.name==''){
            //   wx.redirectTo({
            //     url: '../login',
            //   })
            // }
            // 用户通过扫描分销二维码进来的
            var scene = decodeURIComponent(options.scene)
            if (scene != null) {
                var partner_lower = scene
            }
            if (options.upper_partner != null) {
                var partner_lower = options.upper_partner
            }
            // 查看用户上线
            app.util.request({
                url: 'entry/wxapp/MySx',
                data: {
                    user_id: userInfo.id,
                },
                success: res => {
                    if (res.data == false) {
                        if (partner_lower != 'undefined') {
                            // 绑定分销商
                            app.util.request({
                                'url': 'entry/wxapp/Binding',
                                'cachetime': '0',
                                data: {
                                    fx_user: userInfo.id,
                                    user_id: partner_lower
                                },
                                success: function(res) {},
                            })
                        }
                    }
                }
            })
        })
        that.setData({
            rande: app.globalData.rande,
            start: app.util.time(),
            end: app.util.addDate(app.util.time(), 28)
        })
        that.refresh()
    },
    date: function(e) {
        var that = this
        var date1 = wx.getStorageSync('day1')
        var date2 = wx.getStorageSync('day2')
        var time = wx.getStorageSync('day')
        // 获取到当前日期并存储
        var date_today = app.util.time()
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
    refresh: function(e) {
        var that = this
        // // 获取网址
        // app.util.request({
        //   'url': 'entry/wxapp/attachurl',
        //   'cachetime': '0',
        //   success: function (res) {
        //     console.log(res)
        //     // 异步保存网址
        //     wx.setStorageSync("url", res.data)
        //     that.setData({
        //       url: res.data,
        //     })
        //   },
        // })
        // 获取首页分类
        app.util.request({
            'url': 'entry/wxapp/GetNav',
            'cachetime': '0',
            success: function(res) {
                if (res.data.length >= 5) {
                    var nav = res.data.splice(res.data.length - 5, 5)
                } else {
                    var nav = res.data
                }
                that.setData({
                    nav: nav
                })
            },
        })
        // 获取系统信息
        app.util.request({
            'url': 'entry/wxapp/GetSystem',
            'cachetime': '0',
            success: function(res) {

                wx.setStorageSync('platform', res.data)
                wx.setNavigationBarTitle({
                    title: res.data.pt_name,
                })
            },
            complete: res => {
                console.log(res)
            }
        })
        // 获取首页开屏广告
        app.util.request({
            'url': 'entry/wxapp/getad',
            'cachetime': '0',
            data: {
                type: 1
            },
            success: function(res) {
                var rande = that.data.rande
                if (res.data.length > 0) {
                    that.setData({
                        getad: res.data,
                        bomb: true
                    })
                }
            }
        })
        that.date()
    },
    // —————————————关闭开屏广告———————————————
    guanbi: function(e) {
        this.setData({
            bomb: false
        })
        // 关闭开屏广告之后修改app.js  globalData变量的值 确保用户没退出小程序前不会再次显示
        app.globalData.rande = 0
    },
    // 跳转搜索页面
    search: function(e) {
        wx: wx.navigateTo({
            url: 'search',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
    },
    // 导航跳转
    skip: function(e) {
        var that = this
        var src = e.currentTarget.dataset.src
        var appid = e.currentTarget.dataset.appid
        var wb_src = e.currentTarget.dataset.wb_src
        if (src == '../register/register') {
            that.Membership()
        }
        if (src != '' && src != '../register/register') {
            var id = src.replace(/[^0-9]/ig, "");
            var src = src.replace(/(\d+|\s+)/g, "");
            wx.navigateTo({
                url: String(src) + String(id)
            })
        } else if (appid != '') {
            wx.navigateToMiniProgram({
                appId: appid,
                success(res) {
                    // 打开成功\
                }
            })
        } else if (wb_src != '') {
            wx.navigateTo({
                url: 'link?link=' + wb_src
            })
        }
    },
    copyright: function(e) {
        var appid = this.data.platform.tz_appid
        wx.navigateToMiniProgram({
            appId: appid,
            success(res) {
                // 打开成功\
            }
        })
    },
    // —————————————住房时间日期———————————————
    bindDateChange1: function(e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        var that = this
        var day1 = e.detail.value
        var day2 = app.util.addDate(e.detail.value, 1)
        var current_date = that.data.current_date
        var time = app.getTime2Time(day2, day1)
        wx.setStorageSync('day1', day1)
        wx.setStorageSync('day2', day2)
        wx.setStorageSync('day', time)
        console.log(time)
        console.log(app.util.addDate(e.detail.value, 1))
        that.setData({
            datein: e.detail.value,
            dateout: app.util.addDate(e.detail.value, 1),
            time: time
        })


    },

    // —————————————离开时间日期———————————————
    bindDateChange2: function(e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        var that = this
        var day1 = that.data.datein
        var day2 = e.detail.value
        // console.log(day1 + '+' + day2)
        var time = app.getTime2Time(day2, day1)
        wx.setStorageSync('day1', day1)
        wx.setStorageSync('day2', day2)
        wx.setStorageSync('day', time)
        that.setData({
            dateout: e.detail.value,
            time: time
        })
    },

    // —————————————跳转到个人中心页面———————————————
    wode: function(e) {
        wx.reLaunch({
            url: '../logs/logs',
        })
    },

    // —————————————跳转酒店列表———————————————
    content: function(e) {
        var that = this
        var platform = that.data.platform
        if (app.getUserinfo() == true) {
            if (platform.type == 2) {
                wx.getLocation({
                    type: 'wgs84',
                    success: res => {
                        let latitude = res.latitude
                        let longitude = res.longitude
                        let op = latitude + ',' + longitude;
                        location = op
                        wx.setStorageSync("latitude", res.latitude)
                        wx.setStorageSync("longitude", res.longitude)

                        // wx.navigateTo({
                        //   url: '../hotel_list/hotel_list?nearby=' + 0,
                        // })
                        wx.navigateTo({
                            url: '../hotel_list/hotel_list?nearby=' + 0,
                        })
                    },
                    fail: res => {
                        wx.hideLoading()
                        location = 1
                        wx: wx.showModal({
                            title: '授权提示',
                            content: '您取消了位置授权，小程序将无法正常使用，如需再次授权，请在我的-授权管理中进行授权，再次进入小程序即可',
                            showCancel: true,
                            cancelText: '取消',
                            cancelColor: '#333',
                            confirmText: '确定',
                            confirmColor: '#333',
                            success: function(res) {},
                            fail: function(res) {},
                            complete: function(res) {},
                        })
                    }
                })
            } else {
                wx.navigateTo({
                    url: '../hotel_list/hotel_info?hotel_id=' + platform.seller_id + '&type=' + 1,
                })
            }
        }

    },
    // 跳转酒店列表-距离最近
    location: function(e) {
        wx.showLoading({
            title: '搜索附近酒店',
        })
        if (app.getUserinfo() == true) {
            wx.getLocation({
                type: 'wgs84',
                success: res => {
                    let latitude = res.latitude
                    let longitude = res.longitude
                    let op = latitude + ',' + longitude;
                    location = op
                    wx.setStorageSync("latitude", res.latitude)
                    wx.setStorageSync("longitude", res.longitude)

                    wx.navigateTo({
                        url: '../hotel_list/hotel_list?nearby=' + 1,
                    })

                },
                fail: res => {
                    wx.hideLoading()
                    location = 1
                    wx: wx.showModal({
                        title: '授权提示',
                        content: '您取消了本次授权，小程序将无法正常使用，请点击确定或者在我的-授权管理中进行授权，再次重新进入小程序即可',
                        showCancel: true,
                        cancelText: '取消',
                        cancelColor: '#333',
                        confirmText: '确定',
                        confirmColor: '#333',
                        success: function(res) {},
                        fail: function(res) {},
                        complete: function(res) {},
                    })
                }
            })
        }
    },
    getUserInfo: function(e) {
        // console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    // bindGetUserInfo: function (e) {
    //   console.log(e.detail.userInfo)
    //   var user_info = e.detail.userInfo
    //   app.getUserInfo(function (userInfo){

    //   })
    // },
    onShow: function() {
        // console.log('页面显示')
        var that = this
        that.date()
        app.getUserInfo(function(userInfo) {
            that.setData({
                users: userInfo
            })
        })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        var that = this
        that.refresh()
        wx.stopPullDownRefresh()
    },
    // 跳转会员注册
    Membership: function(e) {
        var that = this
        var a = that.data
        var users = a.users
        // 查看是否开启会员注册
        var grade = a.platform.open_member
        if (grade == 1 && grade != null) {
            if (users.zs_name == '' || users.zs_name == null) {
                wx.navigateTo({
                    url: '../register/register',
                })
            } else {
                // wx.showModal({
                //   title: '温馨提示',
                //   content: '您已经注册了会员了哦',
                // })
                wx.navigateTo({
                    url: '../logs/member',
                })
            }
        } else {
            wx.showModal({
                title: '温馨提示',
                content: '平台未开放注册会员,请联系平台管理员',
            })
        }
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },
    onUnload: function() {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})