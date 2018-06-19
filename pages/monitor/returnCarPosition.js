
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");
var operation = require("../../utils/operation.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceHeight: 0,
    pageNum: 1,
    chooseLevel1: false,
    chooseLevel2: false,
    tempLevel1: null,
    tempLevel2: null,
    level1: [],
    level2: [],

    winHeight: 0,
    level: '0',
    queryAll: 'no',
    latitude: 1.0,
    longitude: 1.0,
    code:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (parameters) {
    var that = this;
    this.getDevice();
    var that = this;
    that.data.queryAll = parameters.queryAll;
    that.data.use = parameters.use;
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        });
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 获取用户设备信息
  getDevice: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight,
          deviceHeight: res.windowHeight
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var that = this;

    that.setData({
      tempLevel1: null,
      tempLevel2: null,
      level1: [],
      level2: [],
      use: that.data.use,
    });


    wx.request({
      url: config.PytheRestfulServerURL + '/select/one/level',
      data: {
        managerId: wx.getStorageSync(user.ManagerID),
        status: that.data.queryAll,
      },
      method: 'GET',
      success: function (res) {
        if (res.data.status == 200) {
          var level1 = res.data.data;
          that.setData({
            level1: level1,
          });

          if (level1.length == 1) {
            that.setData({
              tempLevel1: level1[0],
              level1Name: level1[0].c1Name,

            });
            that.data.level = that.data.tempLevel1.c1Id;

            if (that.data.level != '0') {
              wx.request({
                url: config.PytheRestfulServerURL + '/select/two/level',
                data: {
                  c1_id: that.data.level,
                  managerId: wx.getStorageSync(user.ManagerID),
                  level: wx.getStorageSync(user.Level),
                  catalog_id: wx.getStorageSync(user.CatalogID),
                },
                method: 'GET',
                success: function (res) {
                  console.log(res.data.data);
                  if (res.data.status == 200) {
                    that.setData({
                      level2: res.data.data,
                    });
                  }
                  if (that.data.level2.length == 1) {
                    that.setData({
                      tempLevel2: that.data.level2[0],
                      level2Name: that.data.level2[0].name,
                      level: that.data.level2[0].id,
                    })

                  }
                },
                fail: function (res) { },
                complete: function (res) { },
              });
            }

          }


        }
      },
      fail: function (res) { },
      complete: function (res) { },
    });



  },


  //  点击选择一级的框
  chooseLevel1: function (e) {
    var that = this;
    that.setData({
      chooseLevel1: true
    })

    if (that.data.level1.length == 1 || that.data.tempLevel1 == null) {
      that.setData({
        tempLevel1: that.data.level1[0],
      })
    }
  },

  //  点击选择二级的框
  chooseLevel2: function (e) {
    var that = this;
    console.log('choose level2', that.data.level2);
    that.setData({
      chooseLevel2: true,
      tempLevel2: null,
      level2: that.data.level2,
    });

    if (that.data.level2.length == 1 || that.data.tempLevel2 == null) {
      that.setData({
        tempLevel2: that.data.level2[0],
        level2Name: that.data.level2[0].name,
        level: that.data.level2[0].id,
      })
    }

  },

  changeLevel1: function (e) {

    console.log("level1", e);
    var that = this;


    that.setData({
      tempLevel1: that.data.level1[e.detail.value[0]],
      level2: [],
    })


  },

  changeLevel2: function (e) {

    console.log("level2", e);
    var that = this;

    if (that.data.level2.length == 1 || that.data.templevel2 == null) {
      that.setData({
        tempLevel2: that.data.level2[e.detail.value[0]],
      })
    }

  },

  //  取消按钮
  close: function () {
    var that = this;
    that.setData({
      chooseLevel1: false,
      chooseLevel2: false,
    })
  },

  // 确定按钮
  sureLevel1: function (e) {

    var that = this;
    if (that.data.level1.length == 1) {
      that.setData({
        tempLevel1: that.data.level1[0],
      })
    }

    that.setData({
      chooseLevel1: false,
      level1Name: that.data.tempLevel1.c1Name,
      level2Name: '',
      // level2: [],
    });
    that.data.level = that.data.tempLevel1.c1Id;
    if (that.data.level != '0') {
      wx.request({
        url: config.PytheRestfulServerURL + '/select/two/level',
        data: {
          c1_id: that.data.level,
          managerId: wx.getStorageSync(user.ManagerID),
          level: wx.getStorageSync(user.Level),
          catalog_id: wx.getStorageSync(user.CatalogID),
        },
        method: 'GET',
        success: function (res) {
          console.log(res.data.data);
          if (res.data.status == 200) {
            that.setData({
              level2: res.data.data,
              level2Name: '',
              // tempLevel2: null,
            });
          }
          if (that.data.level2.length == 1 || that.data.tempLevel2 == null) {
            that.setData({
              tempLevel2: that.data.level2[0],
              level2Name: that.data.level2[0].name,
              level: that.data.level2[0].id,
            })


          }
        },
        fail: function (res) { },
        complete: function (res) { },
      });
    }



  },

  // 确定按钮
  sureLevel2: function (e) {

    var that = this;
    if (that.data.level2.length == 1) {
      that.setData({
        tempLevel2: that.data.level2[0],
      })
    }
    that.setData({
      chooseLevel2: false,
      level2Name: that.data.tempLevel2.name,

    });
    that.data.level = that.data.tempLevel2.id;
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  // 输入还车位置编号
  carIdInput: function (e) {
    this.setData({
      code: e.detail.value,
    })
  },

  //扫描车牌
  scanCar: function (e) {
    var that = this;
    wx.scanCode({
      onlyFromCamera: false,
      success: function (res) {
        console.log(res);
        if (res.errMsg == 'scanCode:ok') {
          var parameters = operation.urlProcess(res.result);

          that.data.code = parameters.id;
          that.setData({
            code: parameters.id,
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    });
  },

  returnCarPosition: function (e) {
    var that = this;
    if (typeof (that.data.level2Name) == "undefined" || typeof (that.data.level1Name) == "undefined"){
          wx.showModal({
          title: '提示',
          content: '请选择景区',
          showCancel: false,
          confirmText: '我知道了',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
    }else{
      wx.request({
        url: config.PytheRestfulServerURL + '/update/return/loc',
        data: {
          code: that.data.code,
          longitude: that.data.longitude,
          latitude: that.data.latitude,
          level: that.data.tempLevel2.id
        },
        method: 'GET',
        success: function (res) {


          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            confirmText: '我知道了',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })

        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
   
  },
  
})