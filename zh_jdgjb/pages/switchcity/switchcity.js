const city = require('../../utils/city.js');
const app = getApp();
Page({
  data: {
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    cityList: [],
    isShowLetter: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    city: "杭州市",
    currentCityCode: '',
    hotcityList: [{ cityCode: 110000, city: '北京市' }, { cityCode: 310000, city: '上海市' }, { cityCode: 440100, city: '广州市' }, { cityCode: 440300, city: '深圳市' }, { cityCode: 330100, city: '杭州市' }, { cityCode: 320100, city: '南京市' }, { cityCode: 420100, city: '武汉市' },  { cityCode: 120000, city: '天津市' }, { cityCode: 610100, city: '西安市' }, ],
    commonCityList: [{ cityCode: 110000, city: '北京市' }, { cityCode: 310000, city: '上海市' }],
    countyList: [{ cityCode: 110000, county: 'A区' }, { cityCode: 310000, county: 'B区' }, { cityCode: 440100, county: 'C区' }, { cityCode: 440300, county: 'D区' }, { cityCode: 330100, county: 'E县' }, { cityCode: 320100, county: 'F县' }, { cityCode: 420100, county: 'G县' }],
    inputName: '',
    completeList: [],
    county: '',
  },
  onLoad: function (option) {
    // 生命周期函数--监听页面加载
    const searchLetter = city.searchLetter;
    const cityList = city.cityList();
    const sysInfo = wx.getSystemInfoSync();
    console.log(sysInfo);
    const winHeight = sysInfo.windowHeight;
    const itemH = winHeight / searchLetter.length;
    let tempArr = [];

    searchLetter.map(
      (item,index) => {
        // console.log(item);
        // console.log(index);
        let temp = {};
        temp.name = item;
        temp.tHeight = index * itemH;
        temp.bHeight = (index + 1) * itemH;
        tempArr.push(temp)
      }
    );
    // console.log(tempArr);
    this.setData({
      city: option.cityName,
      winHeight: winHeight,
      itemH: itemH,
      searchLetter: tempArr,
      cityList: cityList
    });

  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },

  clickLetter: function (e) {
    // console.log(e);
    console.log(e.currentTarget.dataset.letter)
    const showLetter = e.currentTarget.dataset.letter;
    this.setData({
      toastShowLetter: showLetter,
      isShowLetter: true,
      scrollTopId: showLetter,
    })
    // const that = this;
    // wx.showToast({
    //   title: showLetter,
    //   disabled: true,
    //   duration: 500,
    //   complete: function() {
    //     that.setData({
    //       scrollTopId: showLetter,
    //     })
    //   }
    // })
    const that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 500)
  },

  //选择城市
  bindCity: function (e) {
    // console.log("bindCity");
    // console.log(e);
    this.setData({
      county: '',
      city: e.currentTarget.dataset.city,
      currentCityCode: e.currentTarget.dataset.code,
      scrollTop: 0,
      completeList: [],
    })
    this.selectCounty()
  },

  bindCounty: function(e) {
    console.log("bindCounty");
    console.log(e);
    this.setData({ county: e.currentTarget.dataset.city })
  },

  //点击热门城市回到顶部
  hotCity: function () {
    console.log("hotCity");
    this.setData({
      scrollTop: 0,
    })
  },
  bindScroll: function (e) {
  //  console.log(e.detail)
  },
  selectCounty: function() {
    console.log("正在定位区县");
    let code = this.data.currentCityCode
    console.log(code);
    const that = this;
    wx.request({
      url: `http://apis.map.qq.com/ws/district/v1/getchildren?&id=${code}&key=${config.key}`,
      success: function(res) {
        console.log(res.data.result[0]);
        that.setData({
          countyList: res.data.result[0],
        })
        console.log(that.data.countyList);
        console.log("请求区县成功"+`http://apis.map.qq.com/ws/district/v1/getchildren?&id=${code}&key=${config.key}`);
        console.log(res)
      },
      fail: function() {
        console.log("请求区县失败，请重试");
      }
    })
  },
  bindBlur: function(e) {
    this.setData({
      inputName: ''
    })
  },
  bindKeyInput: function(e) {
    console.log(e.detail.value);
    this.setData({
      inputName: e.detail.value
    })
    this.auto()
  },
  auto: function() {
    let inputSd = this.data.inputName
    let sd = inputSd.toLowerCase();
    let num = sd.length
    const cityList = city.cityObjs;
    let finalCityList = []

    let temp = cityList.filter(
                  item => {
                    let text = item.short.slice(0,num)
                    return (text && text == sd)
                  }
                );

    let tempShorter = cityList.filter(
                  itemShorter => {
                    let textShorter = itemShorter.shorter.slice(0,num)
                    return (textShorter && textShorter == sd)
                  }
                )

   if(temp[0]) {
     temp.map(
       item => {
         let testObj = {};
         testObj.city = item.city
         testObj.code = item.code
         finalCityList.push(testObj)
       }
     )
     this.setData({
       completeList: finalCityList,
     })
     console.log(this.data.completeList);
   }else if(tempShorter[0]) {
     tempShorter.map(
       item => {
         let testObj = {};
         testObj.city = item.city
         testObj.code = item.code
         finalCityList.push(testObj)
       }
     );
     this.setData({
       completeList: finalCityList,
     })
     console.log(this.data.completeList);
   }else {
     return
   }

 },

})