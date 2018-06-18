
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");
var login = require("../../utils/login.js");
// var JSEncrypt = require("../../utils/jsencrypt.js");
var operation = require("../../utils/operation.js");

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

		chooseLevel1: false,
		chooseLevel2: false,
		tempLevel1: null,
		tempLevel2: null,
		level1: [],
		level2: [],
		level: '0',

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
		

		that.setData({
			tempLevel1: null,
			tempLevel2: null,
			level1: [],
			level2: [],
		});
		wx.request({
			url: config.PytheRestfulServerURL + '/select/one/level',
			data: {
				managerId: wx.getStorageSync(user.ManagerID),

			},
			method: 'GET',
			success: function (res) {
				if (res.data.status == 200) {
					var level1 = res.data.data;
					that.setData({
						level1: level1,
					});

					if (level1.length == 1) {
						that.setData({
							tempLevel1: level1[0],
							level1Name: level1[0].c1Name,

						});
						that.data.level = that.data.tempLevel1.c1Id;

					if (that.data.level != '0') {
							wx.request({
								url: config.PytheRestfulServerURL + '/select/two/level',
								data: {
									c1_id: that.data.level,
									managerId: wx.getStorageSync(user.ManagerID),
									level: wx.getStorageSync(user.Level),
									catalog_id: wx.getStorageSync(user.CatalogID),
								},
								method: 'GET',
								success: function (res) {
									console.log(res.data.data);
									if (res.data.status == 200) {
										that.setData({
											level2: res.data.data,
											level2Name: '',
											// tempLevel2: null,
										});
									}
									if (that.data.level2.length == 1) {
										that.setData({
											tempLevel2: that.data.level2[0],
											level2Name: that.data.level2[0].name,
											level: that.data.level2[0].id,
										});

										wx.request({
											url: config.PytheRestfulServerURL + '/select/car/point/',
											data: {
												level: that.data.level,
												pageNum: 1,
												pageSize: 10,
											},
											method: 'GET',
											success: function (res) {
												if (res.data.status == 200) {
													var result = res.data.data;

													that.setData({
														carts: [],
													});
													if (result == null) {
														that.data.pageNum = 1;
														that.setData({
															cartQuantity: 0,
														});
													}
													else {
														that.data.carts = that.data.carts.concat(result);
														that.setData({
															carts: that.data.carts,
															cartQuantity: that.data.carts.length,
														});
													}

												}
											},
											fail: function (res) { },
											complete: function (res) { },
										});

									}
								},
								fail: function (res) { },
								complete: function (res) { },
							});
						}

					}


				}
			},
			fail: function (res) { },
			complete: function (res) { },
		});

  },


	//  点击选择一级的框
	chooseLevel1: function (e) {
		var that = this;
		that.setData({
			chooseLevel1: true,
		})

		if (that.data.level1.length == 1 || that.data.tempLevel1 == null) {
			that.setData({
				tempLevel1: that.data.level1[0],
			})
		}
	},

	//  点击选择二级的框
	chooseLevel2: function (e) {
		var that = this;
		console.log('choose level2', that.data.level2);
		that.setData({
			chooseLevel2: true,
			tempLevel2: null,
			level2: that.data.level2,
		});

		if (that.data.level2.length == 1 || that.data.tempLevel2 == null) {
			that.setData({
				tempLevel2: that.data.level2[0],
				level2Name: that.data.level2[0].name,
				level: that.data.level2[0].id,
			})
		}

	},

	changeLevel1: function (e) {

		console.log("level1", e);
		var that = this;


		that.setData({
			tempLevel1: that.data.level1[e.detail.value[0]],
			level2:[],
		})


	},

	changeLevel2: function (e) {

		console.log("level2", e);
		var that = this;

		if (that.data.level2.length == 1 || that.data.templevel2 == null) {
			that.setData({
				tempLevel2: that.data.level2[e.detail.value[0]],
			})
		}

	},

	//  取消按钮
	close: function () {
		var that = this;
		that.setData({
			chooseLevel1: false,
			chooseLevel2: false,
		})
	},

	// 确定按钮
	sureLevel1: function (e) {

		var that = this;
		if (that.data.level1.length == 1) {
			that.setData({
				tempLevel1: that.data.level1[0],
			})
		}

		that.setData({
			chooseLevel1: 'none',
			level1Name: that.data.tempLevel1.c1Name,
			level2Name: '',
			// level2: [],
		});
		that.data.level = that.data.tempLevel1.c1Id;


		if (that.data.level != '0') {
			wx.request({
				url: config.PytheRestfulServerURL + '/select/two/level',
				data: {
					c1_id: that.data.level,
					managerId: wx.getStorageSync(user.ManagerID),
					level: wx.getStorageSync(user.Level),
					catalog_id: wx.getStorageSync(user.CatalogID),
				},
				method: 'GET',
				success: function (res) {
					console.log(res.data.data);
					if (res.data.status == 200) {
						that.setData({
							level2: res.data.data,
							level2Name: '',
							// tempLevel2: null,
						});
					}
					if (that.data.level2.length == 1 ) {
						that.setData({
							tempLevel2: that.data.level2[0],
							level2Name: that.data.level2[0].name,
							level: that.data.level2[0].id,
						});

						wx.request({
							url: config.PytheRestfulServerURL + '/select/car/point/',
							data: {
								level: that.data.level,
								pageNum: 1,
								pageSize: 10,
							},
							method: 'GET',
							success: function (res) {
								if (res.data.status == 200) {
									var result = res.data.data;

									that.setData({
										carts: [],
									});
									if (result == null) {
										that.data.pageNum = 1;
										that.setData({
											cartQuantity: 0,
										});
									}
									else {
										that.data.carts = that.data.carts.concat(result);
										that.setData({
											carts: that.data.carts,
											cartQuantity: that.data.carts.length,
										});
									}

								}
							},
							fail: function (res) { },
							complete: function (res) { },
						});

					}
				},
				fail: function (res) { },
				complete: function (res) { },
			});
		}

	

	},

	// 确定按钮
	sureLevel2: function (e) {

		var that = this;
		if (that.data.level2.length == 1) {
			that.setData({
				tempLevel2: that.data.level2[0],
			})
		}
		that.setData({
			chooseLevel2: false,
			level2Name: that.data.tempLevel2.name,

		});
		that.data.level = that.data.tempLevel2.id;
		that.data.carStatusList = [];

		wx.request({
			url: config.PytheRestfulServerURL + '/select/car/point/',
			data: {
				level: that.data.level,
				pageNum: 1,
				pageSize: 10,
			},
			method: 'GET',
			success: function (res) {
				if (res.data.status == 200) {
					var result = res.data.data;

					that.setData({
						carts: [],
					});
					if (result == null) {
						that.data.pageNum = 1;
						that.setData({
							cartQuantity: 0,
						});
					}
					else {
						that.data.carts = that.data.carts.concat(result);
						that.setData({
							carts: that.data.carts,
							cartQuantity: that.data.carts.length,
						});
					}

				}
			},
			fail: function (res) { },
			complete: function (res) { },
		});

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

	//录入定点车辆
	recordCarInPosition:function(e){
		var that = this;
		if (that.data.qrId == null || that.data.level == null)
		{
			wx.showModal({
				title: '提示',
				content: '请扫码录入车辆',
				showCancel: false,
				confirmText: '我知道了',
				success: function(res) {},
				fail: function(res) {},
				complete: function(res) {},
			})
		}
		else
		{
			wx.request({
				url: config.PytheRestfulServerURL + '/update/car/point/',
				data: {
					qrId: that.data.qrId,
					level: that.data.level,
				},
				method: 'POST',
				success: function(res) {
					if(res.data.status == 200)
					{
						wx.showToast({
							title: '已录入',
							icon: '',
							image: '',
							duration: 1500,
							mask: true,
							success: function(res) {},
							fail: function(res) {},
							complete: function(res) {},
						});

						that.data.carts.unshift(that.data.qrId);
						that.setData({
							carts: that.data.carts,
							cartQuantity: that.data.carts.length,
						});
					}
					else {
						wx.showModal({
							title: '提示',
							content: res.data.msg,
							showCancel:false,
							confirmText: '我知道了',
							success: function (res) { },
							fail: function (res) { },
							complete: function (res) { },
						})
					}
				},
				fail: function(res) {},
				complete: function(res) {},
			})
		}

	},

	//删除录入
	unrecordCarInPosition:function(e){
		var that = this;
		var qrId = e.currentTarget.dataset.cart;
		var index = e.currentTarget.dataset.index;
		wx.showModal({
			title: '提示',
			content: '是否取消该定点车辆？',
			showCancel:true,
			cancelText:'取消',
			confirmText: '确定',
			success: function(res) {
				if(res.confirm)
				{
					wx.request({
						url: config.PytheRestfulServerURL + '/delete/car/point/',
						data: {
							level: that.data.level,
							managerId: wx.getStorageSync(user.ManagerID),
							qrId: qrId,
							// areaId: that.data.selectedZone.id,
						},
						method: 'POST',
						success: function(res) {
							if(res.data.status == 200)
							{
								that.data.carts.splice(index, 1);
								that.setData({
									cartQuantity: that.data.carts.length,
								});
							}
							else {
								wx.showModal({
									title: '提示',
									content: res.data.msg,
									showCancel:false,
									confirmText: '我知道了',
									success: function (res) { },
									fail: function (res) { },
									complete: function (res) { },
								})
							}
							that.setData({
								carts: that.data.carts,
							});
						},
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

	

	// 确定按钮
	sureCity: function (e) {
		
		var that = this;
		if (that.data.cities.length == 1) {
			that.setData({
				tempCityName: that.data.cities[0].city,
			})
		}
		

		that.setData({
			chooseCityName: 'none',
			cityName: that.data.tempCityName,
			zoneName: '',
			zones: [],
		});


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