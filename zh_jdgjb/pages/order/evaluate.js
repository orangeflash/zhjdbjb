// zh_jdgjb/pages/order/evaluate.js
const app = getApp()
var siteinfo = require('../../../siteinfo.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    length: 0,
    imgArray1: [],
    imgs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    app.getUrl(that)
    app.getSystem(that)
    that.setData({
      seller_id: options.seller_id,
      order_id: options.order_id
    })
    app.getUserInfo(function(userInfo) {
      that.setData({
        user_id: userInfo.id,
      })
    })
  },
  textarea: function(e) {
    var length = e.detail.cursor
    if (e.detail.value != '') {
      this.setData({
        length: length,
        value: e.detail.value
      })
    }
  },
  // 上传图片
  img_array: function(e) {
    var that = this
    var imgArray1 = that.data.imgArray1
    if (imgArray1.length >= 9) {
      wx.showModal({
        title: '',
        content: '最多上传9张图片',
      })
    } else {
      var url = siteinfo.siteroot
      var count = 9 - imgArray1.length
      wx.chooseImage({
        count: count,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function(res) {
         
          var imgsrc = res.tempFilePaths;
          imgArray1 = imgArray1.concat(imgsrc)
          that.setData({
            imgArray1: imgArray1
          })
          // that.uploadimg({
          //   url: siteinfo.siteroot + '?i=' + siteinfo.uniacid + '&c=entry&a=wxapp&do=Upload&m=zh_jdgjb',
          //   path: imgsrc
          // });
        }
      })
    }
  },
  uploadimg: function(data) {
    var that = this,
      imgs = that.data.imgs,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'upfile',
      formData: null,
      success: (resp) => {
        if (resp.data != '') {
          //console.log(resp)
          success++;
          imgs.push(resp.data)
          if (imgs.length > 0) {
            that.setData({
              imgs: imgs,
              edit: true
            })
          } else {
            that.setData({
              edit: false
            })
          }

        } else {
          wx.showToast({
            icon: "loading",
            title: "请重试"
          })
        }
      },
      fail: (res) => {
        fail++;
      },
      complete: () => {
        i++;
        if (i == data.path.length) {
          that.setData({
            images: data.path,
            upLoadSucess:true
          });
          that.place_order()
        } else {
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }

      }
    });
  },
  // 删除图片
  delete: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var imgArray1 = that.data.imgArray1
    // Array.prototype.indexOf = function (val) {
    //   for (var i = 0; i < this.length; i++) {
    //     if (this[i] == val) return i;
    //   }
    //   return -1;
    // };
    // Array.prototype.remove = function (val) {
    //   var index = this.indexOf(val);
    //   if (index > -1) {
    //     this.splice(index, 1);
    //   }
    // };
     imgArray1.splice(index, 1)
    that.setData({
      imgArray1: imgArray1
    })
  },
  submit: function(e) {
    var that = this
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    })
    if(that.data.imgArray1.length==0){
        that.place_order()
    } else {
        that.uploadimg({
            url: siteinfo.siteroot + '?i=' + siteinfo.uniacid + '&c=entry&a=wxapp&do=Upload&m=zh_jdgjb',
            path: that.data.imgArray1
        });
    }
    
  },
  place_order:function(e){
    var that = this
    var imgs = that.data.imgs.join(",")
    var value = that.data.value
    value = value.replace("\n", "↵");
    var user_id = that.data.user_id
    var seller_id = that.data.seller_id
    var order_id = that.data.order_id
    app.util.request({
      url: 'entry/wxapp/SaveAssess',
      data: {
        user_id: user_id,
        img: imgs||'',
        content: value,
        order_id: order_id,
        seller_id: seller_id
      },
      success: res => {
        if (res.data == 1) {
          wx.hideToast();
          wx.showToast({
            title: '提交成功',
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 2
            })
          }, 1500)
        } else {
          wx.hideToast();
          wx.showModal({
            title: '',
            content: '系统出差了，待会再试一下',
          })
        }
      }
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
    // imgArray1.remove(0,imgArray1.length)
    var that = this
    that.setData({
      imgArray1: []
    })
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