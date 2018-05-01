
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
	onLoad: function (options) {
		var that = this;
		wx.getLocation({
			type: 'gcj02',
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

	updateCarPosition: function (e) {
		var that = this;
		wx.scanCode({
			onlyFromCamera: true,
			scanType: [],
			success: function (res) {
				if (res.errMsg == 'scanCode:ok') {
					var parameters = operation.urlProcess(res.result);
					
					wx.request({
						url: config.PytheRestfulServerURL + '/update/car/loc',
						data: {
							qrId: parameters.id,
							longitude: that.data.longitude,
							latitude: that.data.latitude,
						},
						method: 'POST',
						success: function (res) {
							var info;
							if (res.data.status == 200) {
								info = res.data.data;
							}
							else {
								info = res.data.msg;
							}
							wx.showModal({
								title: '提示',
								content: info,
								confirmText: '我知道了',
								confirmColor: '',
								success: function(res) {},
								fail: function(res) {},
								complete: function(res) {},
							})
							// wx.showModal({
							// 	title: '车号 ' + parameters.id,
							// 	content: res.data.msg,
							// 	confirmText: '我知道了',
							// 	confirmColor: '',
							// 	success: function(res) {
							// 		if(res.confirm)
							// 		{
							// 			wx.navigateBack({
							// 				delta: 1,
							// 			})
							// 		}
							// 	},
							// 	fail: function(res) {},
							// 	complete: function(res) {},
							// })
						},
						fail: function (res) { },
						complete: function (res) { },
					})
				}
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