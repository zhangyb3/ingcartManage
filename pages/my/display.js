
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");
var util = require("../../utils/util.js");
var operation = require("../../utils/operation.js");

Page({
  data:{

    account:{
      amount: 0,

    },

    cardQuantity: 0,

		managementClass: null,
  },
// 页面加载
  onLoad:function(parameters){
    // 设置本页导航标题
    wx.setNavigationBarTitle({
      title: '管理中心'
    })

		this.setData({
			level: wx.getStorageSync(user.Level),
		});

		var that = this;
		that.setData({
			managementClass: parameters.managementClass,
		});
		
   
  },

  onShow:function(){

		
    var that = this;
		
    

  },


// 跳转至钱包
  toWallet: function(){
    wx.navigateTo({
      url: '../wallet/charge'
    })
  },

  // 跳转至卡券页面
  toCard: function () {
    wx.showModal({
      title: '',
      content: '尚未开通卡券功能',
      showCancel: true,
      cancelText: '',
      cancelColor: '',
      confirmText: '确定',
      confirmColor: '',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  toHistory: function() {
    wx.navigateTo({
      url: 'history',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

	toRecordRepair: function () {
		wx.navigateTo({
			url: 'record_repair'
		})
	},

	toUpdateCarPosition:function(){
		wx.navigateTo({
			url: '../monitor/carPosition'
		})
	},

  stopFee:function(){
    wx.navigateTo({
      url: '../stopFee/stopFee',
    })
  },

  storeInfo: function () {
    wx.navigateTo({
      url: '../store/storeInfo',
    })
  },

	cancelStore: function () {
		wx.navigateTo({
			url: '../store/cancelStore',
		})
	},

	repositorySupply: function () {
		wx.navigateTo({
			url: '../repository/supply',
		})
	},

	carStatusQuery: function (e) {
		var queryAll = e.currentTarget.dataset.all;
		wx.navigateTo({
			url: '../monitor/carStatus?queryAll=' + queryAll,
		})
	},

	carUsingQuery: function () {
		wx.navigateTo({
			url: '../monitor/carUsing',
		})
	},

	recordCarInPosition: function () {
		wx.navigateTo({
			url: '../monitor/recordCar',
		})
	},

	recordOperationZone: function () {
		wx.navigateTo({
			url: '../zone/record?mode=insert',
		})
	},

	updateOperationZone: function () {
		wx.navigateTo({
			url: '../zone/record?mode=update',
		})
	},

	callRepair: function () {
		wx.navigateTo({
			url: '../maintenance/call',
		})
	},

	checkCallRepair: function () {
		wx.navigateTo({
			url: '../maintenance/records',
		})
	},

	quitMaintenance:function(){
		wx.navigateTo({
			url: '../maintenance/quit',
		})
	},

	refundAll: function (e) {
		var refundType = e.currentTarget.dataset.type;

		wx.navigateTo({
			url: '../monitor/refundAll?type=' + refundType,
		})
	},

	specialRefund: function () {
		wx.navigateTo({
			url: '../monitor/specialRefund?operatorLevel=2',
		})
	},

	manageOperator: function (e) {
		var managerLevel = e.currentTarget.dataset.manager_level;
		var queryAll = e.currentTarget.dataset.all;
		wx.navigateTo({
			url: '../monitor/manageOperator?managerLevel=' + managerLevel + '&queryAll=' + queryAll,
		})
	},

	checkAttraction: function (e) {
		var queryAll = e.currentTarget.dataset.all;
		wx.navigateTo({
			url: '../monitor/managerRecord?checkType=attraction&queryAll=' + queryAll,
		})
	},

	managerRecord: function (e) {
		var queryAll = e.currentTarget.dataset.all;
		wx.navigateTo({
			url: '../monitor/managerRecord?checkType=manager&queryAll=' + queryAll,
		})
	},

	checkManagerUsing: function (e) {
		var queryAll = e.currentTarget.dataset.all;
		wx.navigateTo({
			url: '../monitor/managerRecord?checkType=cart&queryAll=' + queryAll,
		})
	},

	zoneStatistics: function () {
		wx.navigateTo({
			url: '../monitor/statistics',
		})
	},

	newCompany:function(){
		wx.navigateTo({
			url: '../catalog/new',
		})
	},

	recordCompanyHead:function(e){
		var managerLevel = e.currentTarget.dataset.manager_level;
		var queryAll = e.currentTarget.dataset.all;
		wx.navigateTo({
			url: '../monitor/manageOperator?action=recordCompanyHead&&managerLevel=' + managerLevel + '&queryAll=' + queryAll,
		})
	},

	deleteAttraction: function (e) {
		var queryAll = e.currentTarget.dataset.all;
		wx.navigateTo({
			url: '../monitor/managerRecord?act=deleteAttraction',
		})
	},

	deleteGroup: function (e) {
		var queryAll = e.currentTarget.dataset.all;
		wx.navigateTo({
			url: '../monitor/managerRecord?act=deleteGroup',
		})
	},


})