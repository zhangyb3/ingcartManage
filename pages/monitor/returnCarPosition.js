
var config = require("../../utils/config.js");
var operation = require("../../utils/operation.js");

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

		that.setData({
			operation: parameters.operation,
		});

		wx.getLocation({
      type: 'wgs84',
			altitude: true,
			success: function(res) {
				that.setData({
					latitude: res.latitude,
					longitude: res.longitude,
				});
			},
			fail: function(res) {},
			complete: function(res) {},
		})
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
		wx.request({
      url: config.PytheRestfulTestServerURL + '/update/return/loc',
			data: {
				code: that.data.code,
				longitude: that.data.longitude,
				latitude: that.data.latitude,
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