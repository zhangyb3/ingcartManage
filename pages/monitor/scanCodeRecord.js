
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceHeight: 0,
    pageNum: 1,

    chooseLevel1: false,
    chooseLevel2: false,
    chooseOpenFlag: false,
    tempLevel1: null,
    tempLevel2: null,
    level1: [],
    level2: [],

    winHeight: 0,
    level: '',
    queryAll: 'no',
    carStatusList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (parameters) {
    this.getDevice();
    var that = this;
    that.data.queryAll = parameters.queryAll;
    that.data.use = parameters.use;
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
                  wx.request({
                    url: config.PytheRestfulServerURL + '/scan/car/condition',
                    data: {
                      level: that.data.level,
                      pageNum: 1,
                      pageSize: 10
                    },
                    method: 'GET',
                    success: function (res) {
                      if (res.data.status == 200) {
                        console.log(res.data.data)
                        that.setData({
                          carStatusList: res.data.data
                        })

                      }
                    }
                  })
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
      chooseLevel1: true,
      pageNum:1
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
      pageNum: 1
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
    that.data.carStatusList = [];

    if (that.data.level != '0') {
      that.setData({
        carStatusList: [],
      });
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
            wx.request({
              url: config.PytheRestfulServerURL + '/scan/car/condition',
              data: {
                level: that.data.level,
                pageNum: 1,
                pageSize: 10
              },
              method: 'GET',
              success: function (res) {
                if (res.data.status == 200) {
                  console.log(res.data.data)
                  that.setData({
                    carStatusList: res.data.data
                  })

                }
              }
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
    wx.request({
      url: config.PytheRestfulServerURL + '/scan/car/condition',
      data: {
        level: that.data.level,
        pageNum: 1,
        pageSize: 10
      },
      method: 'GET',
      success: function (res) {
        if (res.data.status == 200) {
          console.log(res.data.data)
          that.setData({
            carStatusList: res.data.data
          })

        }
      }
    })
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {


  },
  getMoreRecord(){
    var that = this;
    that.data.pageNum = that.data.pageNum + 1;
    wx.request({
      url: config.PytheRestfulServerURL + '/scan/car/condition',
      data: {
        level: that.data.level,
        pageNum: that.data.pageNum,
        pageSize: 10
      },
      method: 'GET',
      success: function (res) {
        if (res.data.status == 200) {
          console.log(res.data.data)
          that.setData({
            carStatusList: that.data.carStatusList.concat(res.data.data)
          })

        }
      }
    })
  }

})