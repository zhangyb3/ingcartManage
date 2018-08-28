
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
      operation: parameters.operation,
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
			url: '../monitor/carPosition?operation=update'
		})
	},

  toReturnCarPosition: function (e) {
    var queryAll = e.currentTarget.dataset.all;
    wx.navigateTo({
      url: '../monitor/returnCarPosition?queryAll=' + queryAll,
    })
  },

	carPositionQuery: function () {
		wx.navigateTo({
			url: '../monitor/carPosition?operation=query'
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

	usingCarStatusQuery: function (e) {
		var queryAll = e.currentTarget.dataset.all;
		wx.navigateTo({
			url: '../monitor/carStatus?queryAll=' + queryAll + "&use=1",
		})
	},

	unUseCarStatusQuery: function (e) {
		var queryAll = e.currentTarget.dataset.all;
		wx.navigateTo({
			url: '../monitor/carStatus?queryAll=' + queryAll + "&use=0",
		})
	},

  carPowerStatusQuery: function (e) {
    var queryAll = e.currentTarget.dataset.all;
    wx.navigateTo({
      url: '../monitor/carStatus?queryAll=' + queryAll + "&use=2",
    })
  },

  carOnlineStatusQuery: function (e) {
    var queryAll = e.currentTarget.dataset.all;
    wx.navigateTo({
      url: '../monitor/carStatus?queryAll=' + queryAll + "&use=4",
    })
  },

  carDistance: function (e) {
    var queryAll = e.currentTarget.dataset.all;
    wx.navigateTo({
      url: '../monitor/carStatus?queryAll=' + queryAll + "&use=5",
    })
  },

  netUnlock: function (e) {
    var queryAll = e.currentTarget.dataset.all;
    wx.navigateTo({
      url: '../monitor/carStatus?queryAll=' + queryAll + "&use=3",
    })
  },

  netReset: function (e) {
    var queryAll = e.currentTarget.dataset.all;
    wx.navigateTo({
      url: '../monitor/carStatus?queryAll=' + queryAll + "&use=31",
    })
  },

	carUsingQuery: function () {
		wx.navigateTo({
			url: '../monitor/carUsing',
		})
	},

  closePark: function (e) {
    var queryAll = e.currentTarget.dataset.all;
    wx.navigateTo({
      url: '../monitor/closePark?queryAll=' + queryAll + "&use=1",
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

  updateOperationZoneMessage: function () {
    wx.navigateTo({
      url: '../zone/recordMessage?mode=update',
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

  attractionMore: function (e) {
    var queryAll = e.currentTarget.dataset.all;
    wx.navigateTo({
      url: '../monitor/managerRecord?checkType=attractionMore&queryAll=' + queryAll,
    })
  },

  managerNoStroke: function (e) {
    var queryAll = e.currentTarget.dataset.all;
    wx.navigateTo({
      url: '../monitor/managerRecord?checkType=managerNoStroke&queryAll=' + queryAll,
    })
  },

  managerNoStrokeLock: function (e) {
    var queryAll = e.currentTarget.dataset.all;
    wx.navigateTo({
      url: '../monitor/managerRecord?checkType=managerNoStrokeLock&queryAll=' + queryAll,
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

	mobileFaultQuery:function(e){
		
		wx.navigateTo({
			url: '../monitor/modelFault',
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
	},

	generateIdentifyCode: function (e) {

		wx.navigateTo({
			url: '../monitor/generateCode',
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) { },
		})
	},

	proxyUnlock:function(e){
		wx.navigateTo({
			url: '../repository/proxy?remote=0',
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
	},

	proxyRemoteUnlock: function (e) {
		wx.navigateTo({
			url: '../repository/proxy?remote=1',
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) { },
		})
	},


	changeGuard: function (e) {

    wx.navigateTo({
      url: '../monitor/changeGuard',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  parkDetails: function (e) {
    var queryAll = e.currentTarget.dataset.all;
    wx.navigateTo({
      url: '../monitor/managerRecord?checkType=parkDetails&queryAll=' + queryAll,
    })
  },
  scanCodeRecord: function (e) {

    wx.navigateTo({
      url: '../monitor/scanCodeRecord',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  backRecord: function (e) {

    wx.navigateTo({
      url: '../monitor/backRecord',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
})