
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");
var util = require("../../utils/util.js");
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
		wx.setNavigationBarTitle({
			title: '管理中心'
		})

		this.setData({
			level: wx.getStorageSync(user.Level),
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
	
		var that = this;
		wx.request({
			url: config.PytheRestfulServerURL + '/manage/register/check/',
			data: {
				
				openId: wx.getStorageSync(user.OpenID),
			},
			method: 'POST',
			dataType: '',
			success: function (res) {
				console.log(res);
				var info = res.data.data;
				that.data.account = info;
				// wx.setStorageSync(user.ManagerID, info.id);
				wx.setStorageSync(user.CustomerID, info.customerId);
				wx.setStorageSync(user.Description, info.description);
				wx.setStorageSync(user.Status, info.status);
				wx.setStorageSync(user.UsingCar, info.carId);
				wx.setStorageSync(user.RecordID, info.recordId);
				wx.setStorageSync(user.UsingCarStatus, info.carStatus);
			},
			fail: function (res) { },
			complete: function (res) {

				var showPhoneNum = util.replaceStr(that.data.account.phoneNum, 3, 7, "····");
				console.log(showPhoneNum);
				that.setData({
					avatarUrl: wx.getStorageSync("avatarUrl"),
					wxNickName: wx.getStorageSync("wxNickName"),
					showPhoneNum: showPhoneNum,
					account: that.data.account,
					cardQuantity: that.data.cardQuantity,
				});
			},
		})


  },

	toDisplay(e){
		var classType = e.currentTarget.dataset.class;

		wx.navigateTo({
			url: 'display?managementClass=' + classType,
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})

	},

	switchAccount: function () {
		wx.setStorageSync(user.CustomerID, null);

		wx.setStorageSync(user.Description, null);
		wx.setStorageSync(user.Status, null);

		wx.setStorageSync(user.UsingCar, null);
		wx.setStorageSync(user.RecordID, null);
		wx.setStorageSync(user.UsingCarStatus, null);

		wx.setStorageSync(user.Level, null);
		wx.setStorageSync(user.Amount, null);

		wx.setStorageSync('alreadyRegister', 'no');
		console.log('p', wx.getStorageSync(user.PhoneNum));
		wx.request({
			url: config.PytheRestfulServerURL + '/manage/loginout',
			data: {
				phoneNum: wx.getStorageSync(user.PhoneNum),
			},
			method: 'POST',
			success: function (res) {
				if (res.data.status == 200) {
					wx.navigateTo({
						url: '../register/accedit?fromPage=switchAccount',
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