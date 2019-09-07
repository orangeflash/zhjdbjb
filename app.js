App({
  //全局变量
  globalData: {
    userInfo: null,
    rande: 1,
  },
  util: require('we7/resource/js/util.js'),
  siteInfo: require('siteinfo.js'),
  //启动
  onLaunch: function () {
    // 获取用户信息
    // this.getUserInfo();
    // this.getSys();
   
  },
  getUrl: function (n) {
    var url = this.globalData.url;
    n.setData({
      url: url
    })
    var e = this;
    url || e.util.request({
      'url': 'entry/wxapp/attachurl',
      success: function (res) {
        e.globalData.url = res.data
        e.getUrl(n)
      }
    })
  },
  getSystem: function (n) {
    var color = this.globalData.color;
    var system = this.globalData.system;
    color && wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color,
    }); n.setData({
      color: color,
      platform: system
    })
    var e = this;
    color || e.util.request({
      'url': 'entry/wxapp/GetSystem',
      success: function (res) {
          console.log(res)
        if (res.data.jd_custom.indexOf('查询') > -1) {
          res.data.jd_custom = res.data.jd_custom.replace('查询', '')
        }
        e.globalData.color = res.data.color
        e.globalData.system = res.data
        e.getSystem(n)
      }
    })
  },
  // 用户登录
  getUserInfo: function (cb) {
    var that = this
    wx.login({
      success: function (res) {
        that.util.request({
          'url': 'entry/wxapp/Openid',
          'cachetime': '0',
          data: { code: res.code },
          success: function (res) {
            getApp().session_key = res.data.session_key;
            getApp().OpenId = res.data.openid;
            getApp().getSK = res.data.session_key;
            var openid = res.data.openid
            //调用登录接口
            wx.getSetting({
              success:res=>{
                var auth = res.authSetting
                if (auth["scope.userInfo"] != true) {
                  that.util.request({
                    'url': 'entry/wxapp/login',
                    'cachetime': '0',
                    data: { openid: openid, img: '', name: '' },
                    success: function (res) {
                      getApp().getuniacid = res.data.uniacid;
                      getApp().user_info = res.data;
                      wx.setStorageSync('userInfo', res.data)
                      cb(res.data)
                      
                      var pages = getCurrentPages() //获取加载的页面

                      var currentPage = pages[pages.length - 1] //获取当前页面的对象

                      var url = currentPage.route //当前页面url
                      var options = currentPage.options //如果要获取url中所带的参数可以查看options
                      if (url != 'zh_jdgjb/pages/index/index' && url != 'zh_jdgjb/pages/logs/logs'){
                        wx.navigateTo({
                          url: '../login',
                        })
                      }
                    },
                  })
                } else {
                  wx.getUserInfo({
                    withCredentials: false,
                    success: function (res1) {
                      //存用户信息
                      that.util.request({
                        'url': 'entry/wxapp/login',
                        'cachetime': '0',
                        data: { openid: openid, img: res1.userInfo.avatarUrl, name: res1.userInfo.nickName },
                        success: function (res) {
                          getApp().getuniacid = res.data.uniacid;
                          getApp().user_info = res.data;
                          wx.setStorageSync('userInfo', res.data)
                          cb(res.data)
                        },
                      })
                    }
                  })
                }
              }
            })
           
          },
         
        })
      }
    });
  },
  // 判断用户是否跳转授权
  getUserinfo:function(t){
    if (wx.getStorageSync('userInfo').img == '') {
      wx.showModal({
        title: '温馨提示',
        content: '您需要授权才能正常使用小程序',
        success:res=>{
          if (res.confirm){
            wx.navigateTo({
              url: '../login',
            })
          }else{
           getApp().getUserinfo()
          }
        }
      })
    }else{
      return true
    }
  },
  // /最大值
  max: function (max) {
    var max = max[0];
    var len = max.length;
    for (var i = 1; i < len; i++) {
      if (max[i] > max) {
        max = max[i];
      }
    }
    return max;
  },
  // //获取当前时间，格式YYYY-MM-DD
  today_time: function (e) {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + " " + date.getHours() + seperator2 + date.getMinutes()
      + seperator2 + date.getSeconds();
    return currentdate;
  },
  hours_time: function (start_time,times) {
    var x = start_time; // 取得的TextBox中的时间
    var time = new Date(x.replace("-", "/"));
    var times = Number(times)
    var b = times*60; //分钟数
    time.setMinutes(time.getMinutes() + b, time.getSeconds(), 0);
    var datetime = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
    return datetime
  },
  // 获取当前日期
  today: function () {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  // -----------------------------时间戳转换日期时分秒--------------------------------
  ormatDate: function (dateNum) {
    var date = new Date(dateNum * 1000);
    return date.getFullYear() + "-" + fixZero(date.getMonth() + 1, 2) + "-" + fixZero(date.getDate(), 2) + " " + fixZero(date.getHours(), 2) + ":" + fixZero(date.getMinutes(), 2) + ":" + fixZero(date.getSeconds(), 2);
    function fixZero(num, length) {
      var str = "" + num;
      var len = str.length;
      var s = "";
      for (var i = length; i-- > len;) {
        s += "0";
      }
      return s + str;
    }
  },
  //价格排序  从大到小
  sort_price_Reverse: function (a, b) {
    return a.zd_money - b.zd_money
  },
  //价格排序  从小到大
  sort_price_order: function (a, b) {
    return b.zd_money - a.zd_money
  },
  //价格排序  从小到大
  sort_num_order: function (a, b) {
    return a - b
  },
  // 距离排序  从大到小
  sort_distance_order: function (a, b) {
    return a.distance - b.distance
  },
  // 距离排序  从小到大
  sort_distance_Reverse: function (a, b) {
    return b.distance - a.distance
  },
  // 选择时间提示
  time_title: function (day1, day2) {
    if (day1 >= day2) {
      wx.showModal({
        title: '',
        content: '时间选择错误',
      })
      return false
    } else {
      return true
    }
  },
  // 计算明天日期
  getTime2Time: function (time1, time2) {
    var time1 = arguments[0], time2 = arguments[1];
    time1 = Date.parse(time1) / 1000;
    time2 = Date.parse(time2) / 1000;
    var time_ = time1 - time2;
    return (time_ / (3600 * 24));
  },
  //获取手机信息
  getSys: function () {
    var that = this;
    //  这里要非常注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
    wx.getSystemInfo({
      success: function (res) {

        //设置变量值
        that.globalData.sysInfo = res;
        that.globalData.windowW = res.windowWidth;
        that.globalData.windowH = res.windowHeight;
      }
    })
  }
})