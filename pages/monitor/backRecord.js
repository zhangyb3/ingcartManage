var app = getApp();
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");
var login = require("../../utils/login.js");
var operation = require("../../utils/operation.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
		remote:0,
		getCarId:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (parameters) {

		var that = this;
		that.setData({
			remote: parameters.remote,
		});

		wx.getSystemInfo({
			success: function (res) {
				var date = new Date();
				that.setData({
					winHeight: res.windowHeight,
					
				})
			}
		});

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

	//扫描车牌
	scanCar: function (e) {
		var that = this;
		wx.scanCode({
			onlyFromCamera: true,
			success: function (res) {
				console.log(res);
				if (res.errMsg == 'scanCode:ok') {
					var parameters = operation.urlProcess(res.result);

					that.data.qrId = parameters.id;
					that.setData({
						qrId: parameters.id,
						customerPhoneNum: parameters.id,
					})
				}
			},
			fail: function (res) { },
			complete: function (res) { },
		});
	},

	getCustomerPhoneNum: function (e) {
		var that = this;
		console.log(e.detail.value);
		that.data.customerPhoneNum = e.detail.value;
		var regExp = /0?(13|14|15|18)[0-9]{9}/;
		console.log('get phone !!!!!!!!!!!!!!!!!!',that.data.remote + ';' + that.data.customerPhoneNum);
		
		
	},

	backRecord:function(e){
    var that = this;
    console.log(that.data.qrId);
    console.log(that.data.customerPhoneNum);
    wx.getStorageSync(user.Latitude)
    wx.getStorageSync(user.Longitude)
    wx.request({
      url: config.PytheRestfulServerURL + '/update/unlock/record',
      data: {
        carId: that.data.qrId,
        longitude: wx.getStorageSync(user.Longitude),
        latitude: wx.getStorageSync(user.Latitude),
        phoneNum: that.data.customerPhoneNum,
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data.data);
        if (res.data.status == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: '',
            image: '',
            duration: 1500,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          });
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            confirmText: '我知道了',

          });
        }
      },
      fail: function (res) {

      },
      complete: function (res) { },
    });
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})