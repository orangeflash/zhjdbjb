// zh_jdgjb/pages/logs/house_info.js
var siteinfo = require('../../../siteinfo.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    items: [
      { name: 'USA', value: '叫醒' },
      { name: 'CHN', value: '24小时热水', checked: 'true' },
      { name: 'BRA', value: '免费wifi' },
      { name: 'JPN', value: '免费停车' },
      { name: 'ENG', value: '早餐' },
      { name: 'TUR', value: '健身房' },
      { name: 'TUR', value: '会议室' },
      { name: 'TUR', value: '银联' },
    ],
    maintin: false,
    maintin_num: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var id = options.id
    app.getUrl(that)
    app.getSystem(that)
    // 获取房间价格
    app.util.request({
      'url': 'entry/wxapp/GetMonthCost',
      'cachetime': '0',
      data: { room_id: id },
      success: function (res) {
        that.setData({
          price: res.data
        })
      }
    })
    // 获取房间数量
    app.util.request({
      'url': 'entry/wxapp/GetMonthNum',
      'cachetime': '0',
      data: { room_id: id },
      success: function (res) {
        that.setData({
          room_num: res.data
        })
      }
    })
    // 获取房间信息
    app.util.request({
      'url': 'entry/wxapp/RoomDetails',
      'cachetime': '0',
      data: { room_id: id },
      success: function (res) {
        res.data.img = res.data.img.split(",")
        if (res.data.yj_cost == 0) {
          that.setData({
            checked: false,
          })
        } else {
          that.setData({
            checked: true,
          })
        }
        if (res.data.state == 1) {
          that.setData({
            check: false,
          })
        } else {
          that.setData({
            check: true,
          })
        }
        that.setData({
          room: res.data,
          imgs: res.data.img,
        })
      }
    })
  },
  // 上传房间logo
  choose_logo: function (e) {
    var that = this
    // 获取上传图片所需要的url
    var url = siteinfo.siteroot
    // 获取小程序id
    var uniacid = siteinfo.uniacid
    // 判断用户点击的是哪一个上传图片
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
            var room = that.data.room
            room.logo = res.data
            that.setData({
              room: room
            })
          },
          fail: function (res) {
          },
        })
      }
    })
  },
  // 上传图片
  img_array: function (e) {
    var that = this
    // 获取上传图片所需要的url
    var url = siteinfo.siteroot
    // 获取小程序id
    var uniacid = siteinfo.uniacid
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showToast({
          icon: "loading",
          title: "正在上传"
        })
        var imgsrc = res.tempFilePaths;
        that.uploadimg({
          url: url + '?i=' + uniacid + '&c=entry&a=wxapp&do=Upload&m=zh_jdgjb',
          path: imgsrc
        });
      }
    })
  },
  uploadimg: function (data) {
    var that = this,
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
          success++;
          var imgs = that.data.imgs
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
        }
        else {
          wx.showToast({
            icon: "loading",
            title: "请重试"
          })
        }
      },
      fail: (res) => {
        fail++;
        //console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        //console.log(i);
        i++;
        if (i == data.path.length) {
          that.setData({
            images: data.path
          });
          wx.hideToast();
          //console.log('执行完毕');
          // console.log('成功：' + success + " 失败：" + fail);
        } else {
          //console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }

      }
    });
  },
  // 删除图片
  delete: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var imgs = that.data.imgs
    Array.prototype.indexOf = function (val) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
      }
      return -1;
    };
    Array.prototype.remove = function (val) {
      var index = this.indexOf(val);
      if (index > -1) {
        this.splice(index, 1);
      }
    };
    imgs.remove(imgs[index])
    that.setData({
      imgs: imgs
    })
  },
  // 选择是否开启押金
  switchchange: function (e) {
    var that = this
    var checked = e.detail.value
    that.setData({
      checked: checked
    })
  },
  // 选择是否上架下架
  switchchanges: function (e) {
    var that = this
    var check = e.detail.value
    that.setData({
      check: check
    })
  },
  // 房价维护
  maintin: function (e) {
    var that = this
    var maintin = that.data.maintin
    if (maintin == false) {
      that.setData({
        maintin: true
      })
    } else {
      that.setData({
        maintin: false
      })
    }
  },
  // 房价维护
  maintin_num: function (e) {
    var that = this
    var maintin_num = that.data.maintin_num
    if (maintin_num == false) {
      that.setData({
        maintin_num: true
      })
    } else {
      that.setData({
        maintin_num: false
      })
    }
  },

  // 修改价格
  modify_price: function (e) {
    var that = this
    var value = e.detail.value
    var index = e.currentTarget.dataset.index
    var price = that.data.price
    var dateday = price[index].dateday
    dateday = dateday.replace('月', "-")
    dateday = dateday.replace('日', " ")
    dateday = '2018-' + dateday
    price[index].mprice = value
    app.util.request({
      url: 'entry/wxapp/EditRoomPrice',
      data: {
        dateday: dateday,
        price: value,
        room_id: that.data.room.id
      },
      success: res => {
        if (res.data == 1) {
          wx.showToast({
            title: '修改成功',
          })
        }
      }
    })
    that.setData({
      price: price
    })
  },
  // 修改房间数量
  modify_num: function (e) {
    var that = this
    var value = e.detail.value
    var index = e.currentTarget.dataset.index
    var room_num = that.data.room_num
    room_num[index].nums = value
    var dateday = room_num[index].dateday
    dateday = dateday.replace('月', "-")
    dateday = dateday.replace('日', " ")
    dateday = '2018-' + dateday
    app.util.request({
      url: 'entry/wxapp/EditRoomNum',
      data: {
        dateday: dateday,
        nums: value,
        room_id: that.data.room.id
      },
      success: res => {
        if (res.data == 1) {
          wx.showToast({
            title: '修改成功',
          })
        }
      }
    })
    that.setData({
      room_num: room_num
    })
  },
  // 提交表单
  formSubmit: function (e) {
    var that = this
    var name = e.detail.value.name
    var floor = e.detail.value.floor
    var people = e.detail.value.people
    var checked = that.data.checked
    var check = that.data.check
    var room = that.data.room
    var imgs = that.data.imgs
    if (checked == false) {
      var yj_cost = 0
    } else {
      var yj_cost = e.detail.value.yj_cost
    }
    if (check == false) {
      var state = 1
    } else {
      var state = 2
    }
    var title = ''
    if (name == '') {
      title = '请输入房间类型'
    } else if (floor == '') {
      title = '请输入房间楼层'
    } else if (people == '') {
      title = '请输入房间可住人数'
    } else if (floor == '') {
      title = '请输入房间楼层'
    }
    if (title != '') {
      wx.showModal({
        title: '',
        content: title,
      })
    } else {
      app.util.request({
        url: 'entry/wxapp/EditRoom',
        data: {
          room_id: room.id,
          floor: floor,
          logo: room.logo,
          name: name,
          people: people,
          price: room.price,
          state: state,
          yj_cost: yj_cost,
          img: imgs.join(",")
        },
        success: res => {
          if (res.data == 1) {
            wx.showToast({
              title: '修改成功',
            })
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            },1500)
          } else {
            wx.showToast({
              title: '修改失败',
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