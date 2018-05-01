
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");
var operation = require("../../utils/operation.js");
var util = require("../../utils/util.js");

Page({

 
  data: {
		qrId:null,
		carts:[],

		winHeight: 0,
		chooseCityName:'none',
		chooseZoneName: 'none',
		tempCityName:null,
		tempZone:null,
		cities:[],
		zones:[],
		selectedZone: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		var that = this;
		wx.getSystemInfo({
			success: function (res) {
				var date = new Date();
				that.setData({
					winHeight: res.windowHeight,
					
				})
			}
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

	
	//查询最新纪录
	selectLastRecord:function(e){
		var that = this;
		wx.request({
			url: config.PytheRestfulServerURL + '/select/last/record',
			data: {
				phoneNum: that.data.qrId,

			},
			method: 'GET',
			success: function(res) {
				if(res.data.status == 200)
				{
					var result = res.data.data;
					result.startTime = util.formatDate(result.startTime);
					result.stopTime = util.formatDate(result.stopTime);
					if(result.status == 0)
					{
						result.status = '用车中';
					}
					if (result.status == 1) {
						result.status = '已结束';
					}
					that.setData({
						record: res.data.data
					});
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
	},

	//  点击选择城市的框
	chooseCityName: function (e) {
		var that = this;
		that.setData({
			chooseCityName: 'block'
		})

		if (that.data.cities.length == 1 || that.data.tempCityName == null) {
			that.setData({
				tempCityName: that.data.cities[0].city,
			})
		}
	},

	//  点击选择景区的框
	chooseZoneName: function (e) {
		var that = this;
		wx.request({
			url: config.PytheRestfulServerURL + '/select/all/area',
			data: {
				city: that.data.cityName,
				
			},
			method: 'GET',
			success: function (res) {
				if (res.data.status == 200) {
					that.data.zones = res.data.data;
					that.setData({
						zones: that.data.zones,
					});
				}
			},
			fail: function (res) { },
			complete: function (res) { },
		});

		that.setData({
			chooseZoneName: 'block'
		})

		if (that.data.zones.length == 1 || that.data.tempZone == null) {
			that.setData({
				tempZone: that.data.zones[0],
			})
		}
	},

	changeCity: function (e) {
		
		console.log("city",e);
		var that = this;
		
		
			that.setData({
				tempCityName: that.data.cities[e.detail.value[0]].city,
			})
		
			
	},

	changeZone: function (e) {

		console.log("zone", e);
		var that = this;
		
		
			that.setData({
				tempZone: that.data.zones[e.detail.value[0]],
			})
		
			
	},

	//  取消按钮
	close: function () {
		var that = this;
		that.setData({
			chooseCityName: 'none',
			chooseZoneName: 'none',
		})
	},

	// 确定按钮
	sureCity: function (e) {
		
		var that = this;
		if (that.data.cities.length == 1) {
			that.setData({
				tempCityName: that.data.cities[0].city,
			})
		}
		that.data.zones = [],
		that.setData({
			chooseCityName: 'none',
			cityName: that.data.tempCityName,
			zones: that.data.zones,
			zoneName:'',
		});

		
	},

	// 确定按钮
	sureZone: function (e) {
		
		var that = this;
		if (that.data.zones.length == 1) {
			that.setData({
				tempZone: that.data.zones[0],
			})
		}
		that.setData({
			chooseZoneName: 'none',
			zoneName: that.data.tempZone.name,
			selectedZone: that.data.tempZone
		});

		var carts = JSON.parse(that.data.selectedZone.carIds);
		that.setData({
			carts: carts,
			cartQuantity: carts.length,
		});
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