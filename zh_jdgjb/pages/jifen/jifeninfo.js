// pages/jifen/jifeninfo.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    edit: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      id:options.id
    })
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo,
        scores:Number(userInfo.score)
      })
    })
    app.getUrl(that)
    app.getSystem(that)
    // 获取积分商品详情
    app.util.request({
      'url': 'entry/wxapp/GoodsDetails',
      'cachetime': '0',
      data:{id:options.id},
      success: function (res) {
        countdown(res.data.end_time);
        that.setData({
          goods_detail:res.data,
          score: Number(res.data.score),
        })
      }
    })
    function countdown(time) {
      var EndTime = time || [];
      var NowTime = Math.round(new Date().getTime()/1000);
      var total_micro_second = EndTime - NowTime || [];
      // console.log('剩余时间：' + total_micro_second);
      // 渲染倒计时时钟
      that.setData({
        clock: dateformat(total_micro_second)
      });
      if (total_micro_second <= 0) {
        that.setData({
          clock: "已经截止"
        });
        //return;
      }else{
        setTimeout(function () {
          total_micro_second -= 1000;
          countdown(time);
        }
          , 1000)
      }
      
    }

    // 时间格式化输出，如11:03 25:19 每1s都会调用一次
    function dateformat(micro_second) {
      // 总秒数
      var second = Math.floor(micro_second);
      // 天数
      var day = Math.floor(second / 3600 / 24);
      // 小时
      var hr = Math.floor(second / 3600 % 24);
      // 分钟
      var min = Math.floor(second / 60 % 60);
      // 秒
      var sec = Math.floor(second % 60);
      return day + "天" + hr + "小时" + min + "分钟" + sec + "秒";
    }
  },
  // 选择收货地址
  select_address: function (e) {
    var that = this
    wx.chooseAddress({
      success: res => {
        var tel = res.telNumber
        var name = res.userName
        var address = res.provinceName + res.cityName + res.countyName + res.detailInfo
        that.setData({
          tel: tel,
          name: name,
          address: address,
          edit: true
        })
      }
    })
  },
  // 立即兑换
  exchange:function(e){
    var that= this
    var edit = that.data.edit
    var goods_detail = that.data.goods_detail
    var tel = that.data.tel
    var name = that.data.name
    var address = that.data.address
    var title = ''
    if (goods_detail.type==2){
      if (edit == false) {
        title = '请选择收货地址'
      } else if (name == '' ||name == null) {
        title = '请填写姓名'
      } else if (tel == '' ||tel == null) {
        title = '请填写联系方式'
      } else if (address == '' || address == null) {
        title = '请填写地址'
      }
    }else{
      tel = ''
      name = ''
      address = ''
    }
    if(title!=''){
      wx.showModal({
        title: '',
        content: title,
      })
    }else{
      var user_id = wx.getStorageSync('userInfo').id
      var goods_id = that.data.id
      var good_name = goods_detail.name
      var good_img = goods_detail.img
      var integral = goods_detail.score
      var type = goods_detail.type
      var hb_money = goods_detail.hb_moeny
      app.util.request({
        url:'entry/wxapp/exchange',
        data:{
          user_id: user_id,
          good_id: goods_id,
          good_name: good_name,
          good_img: good_img,
          user_name: name,
          user_tel:tel,
          address: address,
          type: type,
          integral:integral,
          hb_money: hb_money
        },  
        success:res=>{
          if(res.data==1){
            wx.showToast({
              title: '兑换成功',
            })
            setTimeout(function(){
              wx.navigateBack({
                delta:1
              })
            },1500)
          }else{
            wx.showToast({
              title: '兑换失败',
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          }
        }
      })
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