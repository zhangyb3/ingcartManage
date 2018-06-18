
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

	// 输入单车编号
	carIdInput: function (e) {
		this.setData({

			qrId: e.detail.value,
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

					that.data.qrId = parameters.id;
					that.setData({
						qrId: parameters.id,
					})
				}
			},
			fail: function (res) { },
			complete: function (res) { },
		});
	},

	updateCarPosition: function (e) {
		var that = this;
		// wx.scanCode({
		// 	onlyFromCamera: true,
		// 	scanType: [],
		// 	success: function (res) {
		// 		if (res.errMsg == 'scanCode:ok') {
		// 			var parameters = operation.urlProcess(res.result);
					
		// 			wx.request({
		// 				url: config.PytheRestfulServerURL + '/update/car/loc',
		// 				data: {
		// 					qrId: parameters.id,
		// 					longitude: that.data.longitude,
		// 					latitude: that.data.latitude,
		// 				},
		// 				method: 'POST',
		// 				success: function (res) {
		// 					var info;
		// 					if (res.data.status == 200) {
		// 						info = res.data.data;
		// 					}
		// 					else {
		// 						info = res.data.msg;
		// 					}
		// 					wx.showModal({
		// 						title: '提示',
		// 						content: info,
		// 						showCancel:false,
		// 						confirmText: '我知道了',
		// 						success: function(res) {},
		// 						fail: function(res) {},
		// 						complete: function(res) {},
		// 					})
		// 					// wx.showModal({
		// 					// 	title: '车号 ' + parameters.id,
		// 					// 	content: res.data.msg,
		// 					// 	confirmText: '我知道了',
		// 					// 	confirmColor: '',
		// 					// 	success: function(res) {
		// 					// 		if(res.confirm)
		// 					// 		{
		// 					// 			wx.navigateBack({
		// 					// 				delta: 1,
		// 					// 			})
		// 					// 		}
		// 					// 	},
		// 					// 	fail: function(res) {},
		// 					// 	complete: function(res) {},
		// 					// })
		// 				},
		// 				fail: function (res) { },
		// 				complete: function (res) { },
		// 			})
		// 		}
		// 	},
		// 	fail: function (res) { },
		// 	complete: function (res) { },
		// });

		wx.request({
			url: config.PytheRestfulServerURL + '/update/location/',
			data: {
				qrId: that.data.qrId,
				longitude: that.data.longitude,
				latitude: that.data.latitude,
			},
			method: 'POST',
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

	queryCarPosition:function(e){
		var that = this;
		wx.showLoading({
			title: '查询中...',
			mask: true,
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
		wx.request({
			url: config.PytheRestfulServerURL + '/select/car/location/',
			data: {
				qrId: that.data.qrId,
				
			},
			method: 'POST',
			success: function(res) {
				wx.hideLoading();
				var result;
				if(res.data.status == 200)
				{
					result = res.data.data;
					var cartPoints = [];
					for(var count = 0; count < result.lng_lat.length; count++)
					{
						cartPoints[count] = {};
						cartPoints[count].longitude = result.lng_lat[count].lng;
						cartPoints[count].latitude = result.lng_lat[count].lat;
					}
					
					var pages = getCurrentPages();
					var indexPage = pages[0];
					indexPage.data.cartPoints = cartPoints;
					wx.navigateBack({
						delta: 5,
					});
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