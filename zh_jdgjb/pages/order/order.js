// zh_jd/pages/order/order.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        titel: ['全部', '待付款', '待入住'],
        page: 1,
        order_list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        app.getUrl(that)
        app.getSystem(that)
        app.getUserInfo(function(users) {})
        var activeIndex = options.activeIndex
        var index = options.index

        that.setData({
            activeIndex: activeIndex,
            index: index,
            status:options.status
        })
        that.refresh()
    },
    refresh: function(e) {
        var that = this
        var page = that.data.page
        var order_list = that.data.order_list
        var index = that.data.index

        var user_id = wx.getStorageSync('userInfo').id
        var today_time = app.today_time()

        // 获取订单列表
        app.util.request({
            'url': 'entry/wxapp/MyOrder',
            'cachetime': '0',
            data: {
                user_id: user_id,
                page: page,
                status: that.data.status
            },
            success: function(res) {

                if (res.data.length > 0) {
                    that.setData({
                        page: page + 1
                    })
                    order_list = order_list.concat(res.data)
                    var unpaid = []
                    var stay_in = []
                    for (let i in order_list) {
                        order_list[i].arrival_time = order_list[i].arrival_time.slice(5, 7) + '月' + order_list[i].arrival_time.slice(8, 10) + '日'
                        order_list[i].departure_time = order_list[i].departure_time.slice(5, 7) + '月' + order_list[i].departure_time.slice(8, 10) + '日'
                        // if (order_list[i].status == 1) {
                        //     unpaid.push(order_list[i])
                        // }
                        // if (order_list[i].status == 2) {
                        //     stay_in.push(order_list[i])
                        // }
                    }
                    // if (index == 0) {
                    //     that.setData({
                    //         order_list: order_list
                    //     })
                    // } else if (index == 1) {
                    //     that.setData({
                    //         order_list: order_list
                    //     })
                    // } else if (index == 2) {
                    //     that.setData({
                    //         order_list: order_list
                    //     })
                    // }
                    that.setData({
                        order_list: order_list
                    })
                } else {

                }
            },
        })
    },
    // 切换顶部栏目
    tabClick: function(e) {

        this.setData({
            activeIndex: e.currentTarget.dataset.index,
            index: e.currentTarget.dataset.index,
            status: e.currentTarget.dataset.state,
            page: 1,
            order_list: []
        });
        this.refresh()
    },
    // 跳转到订单详情
    order_info: function(e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: 'orderinfo?id=' + id,
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
        this.setData({
            index: 0,
            activeIndex: 0,
            page: 1,
            order_list: []
        })
        this.refresh()
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
        app.getUserInfo(function(userInfo) {

        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

        this.setData({
            index: 0,
            page: 1,
            order_list: []
        })
        this.refresh()
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        this.refresh()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})