
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");

Page({

  /**
   * 页面的初始数据
   */
	data: {
		pageNum: 1,
		pageSize: 10,

		mobileModel:null,
		mobileFaults: [],

	},

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (parameters) {
		var that = this;
		that.data.mobileModel = parameters.model;
		wx.getSystemInfo({
			success: function (res) {
				that.setData({
					winHeight: res.windowHeight,
					deviceHeight: res.windowHeight
				})
			}
		});
		wx.setNavigationBarTitle({
			title: that.data.mobileModel + '故障汇总',
			success: function(res) {},
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
		var that = this;

		wx.request({
			url: config.PytheRestfulServerURL + '/select/fault/detail',
			data: {
				phone_model: that.data.mobileModel,
				pageNum: that.data.pageNum,
				pageSize: that.data.pageSize,
			},
			method: 'GET',
			success: function (res) {
				console.log(res.data.data);
				if (res.data.status == 200) {
					var result = res.data.data;

					that.setData({
						mobileFaults: [],
					});

					if (result == null) {
						that.data.pageNum = 1;

					}
					else {

						that.setData({
							mobileFaults: that.data.mobileFaults.concat(result),
						});
					}
				}
			},
			fail: function (res) { },
			complete: function (res) { },
		})

	},

	getMoreMobileFaults: function () {
		var that = this;
		that.data.pageNum = that.data.pageNum + 1;


		wx.request({
			url: config.PytheRestfulServerURL + '/select/fault/detail',
			data: {
				phone_model: that.data.mobileModel,
				pageNum: that.data.pageNum,
				pageSize: that.data.pageSize,
			},
			method: 'GET',
			success: function (res) {
				if (res.data.status == 200) {
					var result = res.data.data;


					if (result == null || result.length == 0) {
						that.data.pageNum = that.data.pageNum - 1;
					}
					else {

						that.setData({
							mobileFaults: that.data.mobileFaults.concat(result),
						});
					}

				}
			}
		});
	},

	mobileFaultQuery: function (e) {
		var that = this;
		var model = e.currentTarget.dataset.model;
		wx.navigateTo({
			url: 'mobileFault?model=' + model,
			success: function (res) { },
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