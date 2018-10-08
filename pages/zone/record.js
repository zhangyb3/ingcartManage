
var util = require('../../utils/util.js');
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
		cityName:null,
		operationZoneName:null,
		price:null,
		giving:null,
		higherLevelId:null,
		chooseLevel: 'none',
		higherLevel:null,
		chooseWhetherEndSelf: false,
		whetherEndSelf:null,
		whetherEndSelfs:[
			{
				status: 0,
				name: '人工',
			},
			{
				status: 1,
				name: '自动',
			},
			{
				status: 2,
				name: '热点',
			},
      {
        status: 3,
        name: '公众号',
      },
      {
        status: 4,
        name: '公众号(不判断)',
      },
      {
        status: 5,
        name: '公众号(车锁)',
      },
		],
		servicePhone:null,
		mode:null,

		chooseZone:false,
		zones:[],
		zone:'',

		password: null,
		focusOnPasswordPop: false,//控制input 聚焦
		passwordFlag: false,//密码输入遮罩
		cancelIntervalVar: null,
		permission: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (parameters) {
		var that = this;
		wx.getSystemInfo({
			success: function (res) {
				var date = new Date();
				that.setData({
					winHeight: res.windowHeight,

				})
			}
		})

		that.setData({
			mode: parameters.mode,
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

		if(that.data.mode == 'insert')
		{
			wx.request({
				url: config.PytheRestfulServerURL + '/select/one/level',
				data: {
					managerId: wx.getStorageSync(user.ManagerID),
				},
				method: 'GET',
				success: function (res) {
					if (res.data.status == 200) {
						that.setData({
							levels: res.data.data
						});
					}
				},
				fail: function (res) { },
				complete: function (res) { },
			});
		}
		
		
  },


	getCityName:function(e){
		var that = this;
		that.data.cityName = e.detail.value;
		console.log('cityName',that.data.cityName);
	},

	getOperationZoneName: function (e) {
		var that = this;
		that.data.operationZoneName = e.detail.value;
		console.log('operationZoneName', that.data.operationZoneName);
	},

	getPrice: function (e) {
		var that = this;
		that.data.price = e.detail.value;
		console.log('price', that.data.price);
	},

	getGiving: function (e) {
		var that = this;
		that.data.giving = e.detail.value;
		console.log('giving', that.data.giving);
	},

	getServicePhone:function(e){
		var that = this;
		that.data.servicePhone = e.detail.value;

	},

	managerRecordOperationZone:function(){
		var that = this;
		if(that.data.cityName != null && that.data.operationZoneName != null && that.data.mode == 'insert')
		{
			
			wx.request({
				url: config.PytheRestfulServerURL + '/insert/attraction/',
				data: {
					city: that.data.cityName,
					name: that.data.operationZoneName,
					price: that.data.price,
					giving: that.data.giving,
					higherLevelId: that.data.higherLevel.c1Id,
					status: that.data.whetherEndSelf.status,
					managerId: wx.getStorageSync(user.ManagerID),
					phoneNum: that.data.servicePhone,
				},
				method: 'POST',
				success: function(res) {
					if(res.data.status == 200)
					{
						wx.showToast({
							title: res.data.data,
							icon: '',
							image: '',
							duration: 2000,
							mask: true,
							success: function(res) {},
							fail: function(res) {},
							complete: function(res) {},
						});

					}
					else {
						wx.showModal({
							title: '',
							content: res.data.msg,
							confirmText: '我知道了',
						})
					}
				},
				fail: function(res) {},
				complete: function(res) {},
			});
		}
		else if(that.data.mode == 'update')
		{
			wx.showModal({
				title: '提示',
				content: '确定要更新吗？',
				showCancel: true,
				cancelText: '取消',
				confirmText: '确定',
				success: function (res) {

					if (res.confirm) {
						that.setData({
							passwordFlag: true,
							level: that.data.level,
						});

						var cancelIntervalVar = setInterval(
							function () {

								if (that.data.permission == true) {
									console.log('clear!!!!!!!!!');
									clearInterval(cancelIntervalVar);
									
									//更新景区信息
									wx.request({
										url: config.PytheRestfulServerURL + '/update/attraction/',
										data: {
											level: that.data.zone.level,
											price: that.data.price,
											giving: that.data.giving,
											status: that.data.status,
											managerId: wx.getStorageSync(user.ManagerID),
											phoneNum: that.data.servicePhone,
											password: that.data.password,
										},
										method: 'POST',
										success: function (res) {
											that.setData({
												passwordFlag: false,
												permission: false,
												password: null,
											});
											{
												wx.showModal({
													title: '',
													content: res.data.msg,
													showCancel: false,
													confirmText: '我知道了',
													success:function(res){
														if(res.confirm)
														{
															
														}
													},
													
												})
											}
										},
										fail: function (res) { },
										complete: function (res) { },
									});

								}

								if (that.data.passwordFlag == false) {
									clearInterval(cancelIntervalVar);
								}
							},
							100
						);

					}



				},
				fail: function (res) { },
				complete: function (res) { },
			});

		}
	},

	chooseHigherLevel: function (e) {
		var that = this;
		
		that.setData({
			chooseLevel: 'block',
			tempLevel: null,
		})

		if (that.data.levels.length == 1 || that.data.tempLevel == null) {
			that.setData({
				tempLevel: that.data.levels[0],
				higherLevelName: that.data.levels[0].name,
			})
		}
	},

	changeLevel: function (e) {

		
		var that = this;

		that.setData({
			tempLevel: that.data.levels[e.detail.value[0]],
		})


	},

	//  取消按钮
	close: function () {
		var that = this;
		that.setData({
			chooseLevel: 'none',
			chooseWhetherEndSelf: false,
			chooseZone: false,
		})
	},

	// 确定按钮
	sureLevel: function (e) {
		console.log("level", e);
		var that = this;
		if (that.data.levels.length == 1) {
			that.setData({
				tempLevel: that.data.levels[0],
			})
		}
		that.setData({
			chooseLevel: 'none',
			higherLevelName: that.data.tempLevel.c1Name,
			higherLevel: that.data.tempLevel
		});

	
	},


	whetherEndSelf:function (e) {
		var that = this;
		that.setData({
			chooseWhetherEndSelf: true,
			tempWhetherEndSelf:null,
		})

		if (that.data.whetherEndSelfs.length == 1 || that.data.tempWhetherEndSelf == null) {
			that.setData({
				tempWhetherEndSelf: that.data.whetherEndSelfs[0],
				endSelf: that.data.whetherEndSelfs[0].name,
			})
		}
	},

	changeWhetherEndSelf: function (e) {


		var that = this;

		that.setData({
			tempWhetherEndSelf: that.data.whetherEndSelfs[e.detail.value[0]],
		})
	

	},

	

	// 确定按钮
	sureWhetherEndSelf: function (e) {
		
		var that = this;
		if (that.data.whetherEndSelfs.length == 1) {
			that.setData({
				tempWhetherEndSelf: that.data.whetherEndSelfs[0],
			})
		}
		that.setData({
			chooseWhetherEndSelf: false,
			endSelf: that.data.tempWhetherEndSelf.name,
			status: that.data.tempWhetherEndSelf.status,
			whetherEndSelf: that.data.tempWhetherEndSelf
		});


	},

	selectZone: function (e) {
		var that = this;
		that.setData({
			zone:[],
			chooseZone: true,
			tempZone: null,
		})

		if (that.data.mode == 'update') {
			wx.request({
				url: config.PytheRestfulServerURL + '/select/all/area',
				data: {
					managerId: wx.getStorageSync(user.ManagerID),
				},
				method: 'GET',
				success: function (res) {
					if (res.data.status == 200) {
						that.setData({
							zones: res.data.data
						});
					}
					if (that.data.zones.length == 1 || that.data.tempZone == null) {
						that.setData({
							tempZone: that.data.zones[0],
							zoneName: that.data.zones[0].name,
						})
					}
				},
				fail: function (res) { },
				complete: function (res) { },
			});
		}
		
	},


	changeZone: function (e) {


		var that = this;

		that.setData({
			tempZone: that.data.zones[e.detail.value[0]],
		})


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
			chooseZone: false,
			zoneName: that.data.tempZone.name,
			zone: that.data.tempZone,
			price: that.data.tempZone.price,
			giving: that.data.tempZone.giving,
			servicePhone: that.data.tempZone.phoneNum,
			endSelf: that.data.whetherEndSelfs[that.data.tempZone.status].name,
			status: that.data.tempZone.status,
		});


	},


	getPassword: function (e) {//获取密码
		this.setData({
			password: e.detail.value
		});
		if (this.data.password.length == 6) {//密码长度6位时，自动验证钱包支付结果
			this.data.permission = true;
		}
	},

	getFocus: function () {//聚焦input
		console.log('isFocus', this.data.focusOnPasswordPop)
		this.setData({
			focusOnPasswordPop: true
		})
	},

	closePassword: function () {//关闭钱包输入密码遮罩

		this.setData({
			focusOnPasswordPop: false,//失去焦点
			passwordFlag: false,
			permission: false,
			password: null,
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