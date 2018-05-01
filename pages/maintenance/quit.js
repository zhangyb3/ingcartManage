

var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");
var login = require("../../utils/login.js");
// var JSEncrypt = require("../../utils/jsencrypt.js");
var operation = require("../../utils/operation.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
		qrId: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
			onlyFromCamera: true,
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

	quitMaintenance:function(){
		var that = this;
		if(that.data.qrId != null)
		{
			wx.request({
				url: config.PytheRestfulServerURL + '/delete/maintenance/status',
				data: {
					qrId: that.data.qrId,
				},
				method: 'GET',
				success: function(res) {
					if(res.data.status == 200)
					{
						wx.showToast({
							title: '报修状态解除',
							icon: '',
							image: '',
							duration: 2000,
							mask: true,
							success: function(res) {},
							fail: function(res) {},
							complete: function(res) {},
						})
					}
					else
					{
						wx.showModal({
							title: '提示',
							content: res.data.msg,
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
		}
		else{
			wx.showModal({
				title: '提示',
				content: '请输入车号',
				showCancel: false,
				confirmText: '我知道了',
				success: function(res) {},
				fail: function(res) {},
				complete: function(res) {},
			})
		}
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