// pages/order/orderinfo/orderinfo.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        app.getUrl(that)
        app.getSystem(that)
        app.util.request({
            url: 'entry/wxapp/orderdetails',
            data: {
                order_id: options.id
            },
            success: res => {
                var order_info = res.data
                order_info.arrival_time = order_info.arrival_time.slice(5, 7) + '月' + order_info.arrival_time.slice(8, 10) + '日'
                order_info.departure_time = order_info.departure_time.slice(5, 7) + '月' + order_info.departure_time.slice(8, 10) + '日'
                order_info.time = app.ormatDate(order_info.time)
                if (order_info.seller_address.length >= 20) {
                    order_info.seller_address = order_info.seller_address.slice(0, 20) + '...'
                }
                that.setData({
                    order_info: order_info
                })
            }
        })
    },

    // ———————————订单详情再次调起支付———————————————
    confirmorder: function(e) {
        var that = this
        var openid = app.OpenId
        var order_info = that.data.order_info
        app.util.request({
            'url': 'entry/wxapp/Pay',
            'cachetime': '0',
            data: {
                openid: openid,
                money: order_info.total_cost,
                order_id: order_info.id
            },
            success: function(res) {
                wx.requestPayment({
                    'timeStamp': res.data.timeStamp,
                    'nonceStr': res.data.nonceStr,
                    'package': res.data.package,
                    'signType': res.data.signType,
                    'paySign': res.data.paySign,
                    'success': function(res) {
                        wx.navigateBack({
                            delta: 1
                        })
                    },

                    'fail': function(res) {
                        wx.showToast({
                            title: '支付失败',
                        })

                    },
                })
            },
        })
    },
    // 再订一间
    order_more: function(e) {
        wx.navigateTo({
            url: '../hotel_list/hotel_info?hotel_id=' + this.data.order_info.seller_id,
        })
    },
    // 查看更多
    see_more: function(e) {
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
    cancel_order: function(e) {
        var that = this
        var id = e.currentTarget.dataset.id
        var hb_id = e.currentTarget.dataset.hb_id
        app.util.request({
            url: 'entry/wxapp/CancelOrder',
            data: {
                order_id: id,
                hb_id: hb_id
            },
            success: res => {
                wx.showToast({
                    title: '订单已取消',
                })
                setTimeout(function() {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 1500)
            }
        })
    },
    // 确认入住
    apply: function(e) {
        var that = this
        var id = e.currentTarget.dataset.id
        app.util.request({
            url: 'entry/wxapp/ChangeOrder',
            data: {
                order_id: id,
                status: e.currentTarget.dataset.status
            },
            success: res => {
                wx.showToast({
                    title: '申请成功',
                })
                setTimeout(function() {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 1500)
            }
        })
    },
    // 拒绝退款
    refuse: function(e) {
        var that = this
        var id = e.currentTarget.dataset.id
        app.util.request({
            url: 'entry/wxapp/ChangeOrder',
            data: {
                order_id: id,
                status: 8
            },
            success: res => {
                wx.showToast({
                    title: '申请成功',
                })
                setTimeout(function() {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 1500)
            }
        })
    },
    // 同意退款
    // Refund: function(e) {
    //     var that = this
    //     var id = e.currentTarget.dataset.id
    //     app.util.request({
    //         url: 'entry/wxapp/Refund2',
    //         data: {
    //             order_id: id,
    //             total_cost: total_cost
    //         },
    //         success: res => {
    //             wx.showToast({
    //                 title: '申请成功',
    //             })
    //             setTimeout(function() {
    //                 wx.navigateBack({
    //                     delta: 1
    //                 })
    //             }, 1500)
    //         }
    //     })
    // },
    // 退押金
    YjRefund: function(e) {
        var that = this
        that.setData({
            YjRefund: true
        })

    },
    // 退款
    Refund: function(e) {
        var that = this
        that.setData({
            YjRefund1: true
        })

    },
    refoned_money: function(e) {
        var that = this
        var money = that.data.order_info.yj_cost
        if (e.detail.value <= money) {
            that.setData({
                refoned_money: e.detail.value
            })
        } else {
            that.setData({
                refoned_money: money
            })
        }

    },
    refoned_money1: function (e) {
        var that = this
        var money = that.data.order_info.total_cost
        if (e.detail.value <= money) {
            that.setData({
                refoned_money1: e.detail.value
            })
        } else {
            that.setData({
                refoned_money1: money
            })
        }

    },
    cancel: function(e) {
        var that = this
        that.setData({
            YjRefund: false
        })
    },
    cancel1: function(e) {
        var that = this
        that.setData({
            YjRefund1: false
        })
    },
    confirm: function(e) {
        var that = this
        var id = that.data.order_info.id
        var refoned_money = that.data.refoned_money
        if (refoned_money == null) {
            var money = that.data.order_indo.yj_cost
        } else {
            var money = refoned_money
        }
        app.util.request({
            url: 'entry/wxapp/YjRefund',
            data: {
                order_id: id,
                money: money
            },
            success: res => {
                if (res.data == 1) {
                    wx.showToast({
                        title: '申请成功',
                    })
                    that.setData({
                        YjRefund: false
                    })
                    setTimeout(function() {
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 1500)
                } else {
                    wx.showToast({
                        title: '退款失败',
                    })
                    that.setData({
                        YjRefund: false
                    })
                }
            }
        })
    },
    confirm1: function(e) {
        var that = this
        var id = that.data.order_info.id
        var refoned_money1 = that.data.refoned_money1
        if (refoned_money1 == null) {
            var money = that.data.order_indo.total_cost
        } else {
            var money = refoned_money1
        }
        app.util.request({
            url: 'entry/wxapp/Refund2',
            data: {
                order_id: id,
                total_cost: money
            },
            success: res => {
                wx.showToast({
                    title: '申请成功',
                })
                setTimeout(function() {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 1500)
            }
        })
    },
    // 查看酒店地址
    sele_address: function(e) {
        var that = this
        var hotel = that.data.order_info
        var coordinates = hotel.coordinates.split(",")
        wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function(res) {
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
    go_eveluate: function(e) {
        wx.navigateTo({
            url: 'evaluate?seller_id=' + this.data.order_info.seller_id + '&order_id=' + this.data.order_info.id,
        })
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