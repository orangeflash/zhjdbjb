var siteinfo = require('../../../siteinfo.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrays: ['暂无星级(经济型)', '三星级', '四星级', '五星级'],
    index: 0,
    inde: 0,
    prompt: false,
    choice: true,
    getmsg: "获取验证码",
    interval: 'interval2',
    num:0,
    store_num:1
  },

  /**
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    var that = this
    app.getSystem(that)
    app.getUrl(that)
    // 获取用户openid
    var openid = wx.getStorageSync("openid")
    // 获取用户id
    var user_id = wx.getStorageSync("users").id
   
    that.setData({
      user_id: user_id,
    })
  },
  // 选择酒店地址
  choose_address: function (e) {
    var that = this
    wx.chooseLocation({
      success: res => {
       
        var latitude = res.latitude + ',' + res.longitude
     
        that.setData({
          address: res.address,
          latitude: latitude
        })
      }
    })
  },
  // 选择酒店星级
  bindPickerChanges: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  // 上传图片
  choose: function (e) {
    var that = this
    // 获取上传图片所需要的url
    var url = siteinfo.siteroot
    // 获取小程序id
    var uniacid = siteinfo.uniacid
    // 判断用户点击的是哪一个上传图片
    var id = e.currentTarget.dataset.id
   
    // 第一个上传图片
    var upload_one = ''
    // 第二个上传图片
    var upload_two = ''
    // 第三个上传图片
    var upload_three = ''
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
       
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: url + '?i=' + uniacid + '&c=entry&a=wxapp&do=upload&m=zh_jdgjb',
          filePath: tempFilePaths,
          name: 'upfile',
          formData: {},
          success: function (res) {
          
            if (id == 1) {
              that.setData({
                upload_one: res.data
              })
            } else if (id == 2) {
              that.setData({
                upload_two: res.data
              })
            } else if (id == 3) {
              that.setData({
                upload_three: res.data
              })
            }
          },
          fail: function (res) {
           
          },
        })
      }
    })
  },
  // 获取用户输入的手机号
  user_tel:function(e){
    this.setData({
      phone:e.detail.value
    })
  },
  // 验证码
  sendmessg: function (e) {
    var that = this
    var phone = that.data.phone
    if (phone == '' || phone == null) {
      wx: wx.showToast({
        title: '请输入手机号',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      // 获取6位数的随机数
      var Num = "";
      for (var i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
      }
      // 随机数传给后台
      app.util.request({
        'url': 'entry/wxapp/sms2',
        'cachetime': '0',
        data: { code: Num, tel: phone ,type:1},
        success: function (res) {
          
        },
      })
      that.setData({
        num: Num
      })
      var time = 59
      // 60秒倒计时
      var inter = setInterval(function () {
        that.setData({
          getmsg: time + "s后重新发送",
          send: true
        })
        time--
        if (time <= 0) {
          // 停止倒计时
          clearInterval(inter)
          that.setData({
            getmsg: "获取验证码",
            send: false,
            num: 0
          })
        }
      }, 1000)
    }

  },
  // 验证码
  verification_code:function(e){
    var code = e.detail.value
    var num = this.data.num
    if (code.length==6){
      if (code!=num){
        wx.showModal({
          title: '',
          content: '验证码输入错误',
        })
        this.setData({
          phone:0
        })
      }
    }
  },
  // 微信绑定手机号验证
  getPhoneNumber: function (e) {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/jiemi',
      'cachetime': '0',
      data: { sessionKey: app.getSK, iv: e.detail.iv, data: e.detail.encryptedData },
      success: function (res) {
        that.setData({
          phone: res.data.phoneNumber
        })
      },
    })
  },
  formSubmit: function (e) {
    var that = this
    var store_num = that.data.store_num
    // 酒店名称
    var name = e.detail.value.hotel_name
    // 酒店地址
    var address = e.detail.value.hotel_address
    var coordinates = that.data.latitude
    coordinates = String(coordinates)
    // 酒店联系人姓名
    var link_name = e.detail.value.hotel_contacts
    // 酒店联系人电话
    var link_tel = e.detail.value.hotel_tel
    // 图片1
    var upload_one = that.data.upload_one
    // 图片2
    var upload_two = that.data.upload_two
    // 图片3
    var upload_three = that.data.upload_three
    // 补充说明
    var textarea = e.detail.value.textarea
    // 酒店星级
    var star = that.data.arrays[that.data.index]
    var phone = that.data.phone
    var user_id = wx.getStorageSync('userInfo').id
    var title = ''
    if (name == '') {
      title = '请输入酒店名称'
    } else if (address == '') {
      title = '请选择酒店地址'
    } else if (link_name == '') {
      title = '请输入酒店联系人姓名'
    } else if (link_tel == '') {
      title = '请输入酒店电话'
    } else if (upload_one == null) {
      title = '请上传营业执照'
    } else if (upload_two == null) {
      title = '请上传负责人身份证正面照片'
    } else if (upload_three == null) {
      title = '请上传负责人身份证反面照片'
    }else if(phone==''||phone==0){
      title = '请进行手机号验证'
    } else if (textarea==''){
      textarea = ''
    }
    if (title != '') {
      wx.showModal({
        title: '',
        content: title,
      })
    } else if (title == '' && store_num==1) {
      that.setData({
        store_num:0
      })
      app.util.request({
        'url': 'entry/wxapp/SaveHotelApply',
        'cachetime': '0',
        data: {
          user_id: user_id,
          name: name,
          address: address,
          coordinates: coordinates,
          link_name: link_name,
          link_tel: link_tel,
          tel: phone,
          sfz_img1: upload_two,
          sfz_img2: upload_three,
          yy_img: upload_one,
          other: textarea,
          star:star
        },
        success: function (res) {
          if(res.data==1){
            wx,wx.showToast({
              title: '入驻成功',
            })
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            },1500)
          }else{
            wx.navigateBack({
              delta:1
            })
          }
        },
        fail:res=>{
          wx.showToast({
            title: '入驻失败',
          })
          setTimeout(function(e){
            wx.navigateBack({
              delta:1
            })
          },1500)
        }
      })
    }


  },
  reset: function (e) {
    // this.onload()
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