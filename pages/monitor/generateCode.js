
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (parameters) {
		var that = this;

		this.getDevice();


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
  
  },

	getPhoneNum: function (e) {
		console.log(e.detail.value);
		this.data.phoneNum = e.detail.value;
		// var regExp = /0?(13|14|15|18)[0-9]{9}/;
 
		{
			this.setData({
				checkTel: 'block'
			})
		}
		
	},

	generateIdentityCode: function (e) {
		var that = this;
	
		wx.request({
			url: config.PytheRestfulServerURL + '/insert/verification',
			data: {
				phone_num: that.data.phoneNum,
				
			},
			method: 'POST',
			success: function(res) {
				if(res.data.status == 200)
				{
					wx.showModal({
						title: '验证码',
						content: res.data.data,
						showCancel: false,
						confirmText: '我知道了',
						success: function(res) {},
						fail: function(res) {},
						complete: function(res) {},
					})
				}
			},
			fail: function(res) {},
			complete: function(res) {},
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})