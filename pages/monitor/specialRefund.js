//index.js
//获取应用实例
const app = getApp()

var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");
var login = require("../../utils/login.js");
var pay = require("../../utils/pay.js");
var operation = require("../../utils/operation.js");

Page({
	data: {
		windowHeight: 0,
		isShow: false,  //‘确定退款’按钮是否显示
		isRandow: true,
		addStyle: null,
		inputMoney: 30,
		giving: 0,

		customerPhoneNum:null,
	},

	onLoad: function () {
		var that = this;
		wx.getSystemInfo({
			success: function (res) {
				that.setData({
					windowHeight: res.windowHeight
				})
				console.log(res.windowHeight)

			}
		})
	},

	onShow: function () {
		var that = this;
		wx.request({
			url: config.PytheRestfulServerURL + '/combo/detail',
			data: {

			},
			method: 'GET',
			success: function (res) {
				var combos = res.data.data;
				if (res.data.status == 200) {
					that.setData({
						combos: combos,
					});
				}
			},
			fail: function (res) { },
			complete: function (res) { },
		})
	},

	//  点击退款金额选项
	moneyChoice: function (e) {

		console.log(e.currentTarget.dataset.refund);
		console.log(e.currentTarget.dataset.class);
		var that = this;
		var combo = e.currentTarget.dataset.refund;
		var refundMoney = parseInt(combo.price);
		that.data.inputMoney = refundMoney;
		that.data.giving = e.currentTarget.dataset.giving;
		var addStyle = (e.currentTarget.dataset.class);
		that.setData({
			addStyle: addStyle
		})
		if (addStyle == 'random') {
			that.setData({
				isShow: true,
				isRandow: false,
			})
		} else {
			that.setData({
				isShow: false,
				isRandow: true,
			})
		}

		if (addStyle != 'random') {
			wx.showModal({
				title: '提示',
				content: '确定要退款吗？',
				showCancel: true,
				cancelText: '取消',
				cancelColor: '',
				confirmText: '确定',
				confirmColor: '',
				success: function(res) {
					if(res.confirm){
						refund(that);
					}
				},
				fail: function(res) {},
				complete: function(res) {},
			})
		}
	},

	closeLayer: function () {
		var that = this;
		that.setData({
			isShow: false,
			isRandow: true,
			addStyle: null,
			inputMoney: 30,
		})
	},

	inputMoney: function (e) {
		var inputMoney = e.detail.value;
		var patt = /[0-9]+.?/;
		this.setData({
			inputMoney: inputMoney.replace(/[^0-9]/, '')
		})
	},

	getPhoneNum:function(e){
		var that = this;
		that.data.customerPhoneNum = e.detail.value;
	},

	refund: function (e) {
		refund(this);
	},


})


// 退款
function refund(the) {
	var that = the;
	var refundAmount = the.data.inputMoney;
	var giving = the.data.giving;
	// 必须输入大于0的数字
	if (refundAmount <= 0 || isNaN(refundAmount)) {
		wx.showModal({
			title: "提示",
			content: "退款金额错误",
			showCancel: false,
			confirmText: "确定"
		})
	} 
	else if(that.data.customerPhoneNum == null || that.data.customerPhoneNum.length != 11){
		wx.showModal({
			title: "提示",
			content: "电话格式错误",
			showCancel: false,
			confirmText: "确定"
		})
	}
	else{
		wx.request({
			url: config.PytheRestfulServerURL + '/manage/auto/refund/',
			data: {
				managerId: wx.getStorageSync(user.CustomerID),
				phoneNum: that.data.customerPhoneNum,
				refund: refundAmount,
			},
			method: 'POST',
			success: function(res) {
				wx.showModal({
					title: '提示',
					content: res.data.msg,
					showCancel: false,
					cancelText: '',
					cancelColor: '',
					confirmText: '我知道了',
					confirmColor: '',
					success: function(res) {},
					fail: function(res) {},
					complete: function(res) {},
				})
			},
			fail: function(res) {},
			complete: function(res) {},
		})
	}
}
