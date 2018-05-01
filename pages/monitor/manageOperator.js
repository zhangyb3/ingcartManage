
var util = require('../../utils/util.js');
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
		date: null,
		winHeight: 0,
		display: 'none',  //是否显示弹窗
		checkTel: 'none', //是否显示手机号码格式

		chooseLevel1: false,
		chooseLevel2: false,
		tempLevel1: null,
		tempLevel2: null,
		level1: [],
		level2: [],
		level: '0',

		managerLevel:null,
		action:false,
		queryAll:'no',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (parameters) {
		var that = this;
		this.data.managerLevel = parameters.managerLevel;
		this.getDevice();
		that.data.action = parameters.action;
		that.data.queryAll = parameters.queryAll;
		that.setData({
			managerLevel: parameters.managerLevel,
			action: that.data.action,
		});
  },

	// 获取用户设备信息
	getDevice: function () {
		var that = this;
		wx.getSystemInfo({
			success: function (res) {
				that.setData({
					winHeight: res.windowHeight,
					deviceHeight: res.windowHeight
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
				status: that.data.queryAll,
			},
			method: 'GET',
			success: function (res) {
				if (res.data.status == 200) {
					var level1 = res.data.data;
					that.setData({
						level1: level1,
					});

					if(level1.length == 1)
					{
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
										});
									}
									if (that.data.level2.length == 1) {
										that.setData({
											tempLevel2: that.data.level2[0],
											level2Name: that.data.level2[0].name,
											level: that.data.level2[0].id,
										})
										

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
			level2: [],
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
			chooseLevel1: false,
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
						})


					}
				},
				fail: function (res) { },
				complete: function (res) { },
			});
		}

		wx.request({
			url: config.PytheRestfulServerURL + '/count/car/condition',
			data: {
				level: that.data.level,
				pageNum: 1,
				pageSize: 10,
			},
			method: 'GET',
			success: function (res) {
				if (res.data.status == 200) {
					var result = res.data.data;


					if (result.user == null) {
						that.data.pageNum = 1;
						that.setData({
							carStatusList: [],
							carMargin: 0,
						});
					}
					else {
						that.data.carStatusList = that.data.carStatusList.concat(result.user);
						that.setData({
							carStatusList: that.data.carStatusList,
							carMargin: result.size,
						});
					}

				}
			},
			fail: function (res) { },
			complete: function (res) { },
		});



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
			url: config.PytheRestfulServerURL + '/count/car/condition',
			data: {
				level: that.data.level,
				pageNum: 1,
				pageSize: 10,
			},
			method: 'GET',
			success: function (res) {
				if (res.data.status == 200) {
					var result = res.data.data;


					if (result.user == null) {
						that.data.pageNum = 1;
						that.setData({
							carStatusList: [],
							carMargin: 0,
						});
					}
					else {
						that.data.carStatusList = that.data.carStatusList.concat(result.user);
						that.setData({
							carStatusList: that.data.carStatusList,
							carMargin: result.size,
						});
					}

				}
			}
		});
	},



	//  输入失去焦点时，检查用户输入的手机号格式是否正确
	checkTelRight: function (e) {
		var inputTel = e.detail.value;
		var regExp = /0?(13|14|15|17|18)[0-9]{9}/;
		if (!regExp.test(inputTel)) {
			this.setData({
				checkTel: 'block'
			})
		} else {
			this.setData({
				checkTel: 'none'
			})
		}

	},

	getPhoneNum: function (e) {
		console.log(e.detail.value);
		this.data.operatorPhoneNum = e.detail.value;
		var regExp = /0?(13|14|15|18)[0-9]{9}/;
		// if (!regExp.test(this.data.operatorPhoneNum)) {
		// if (this.data.operatorPhoneNum.length != 11 ) 
		{
			this.setData({
				checkTel: 'block'
			})
		} 
		// else 
		// {
		// 	this.setData({
		// 		checkTel: 'none'
		// 	});

		// }
	},

	addOperator:function(e){
		var that = this;
		switch (that.data.managerLevel)
		{
			case '1':
				
				wx.request({
					url: config.PytheRestfulServerURL + '/insert/operator/',
					data: {
						phoneNum: that.data.operatorPhoneNum,
						type: 0,
						catalogId: that.data.level,
						managerId: wx.getStorageSync(user.ManagerID),
					},
					method: 'POST',
					success: function (res) {
						if (res.data.status == 200) {
							wx.showToast({
								title: '已添加',
								icon: '',
								image: '',
								duration: 2000,
								mask: true,
								success: function (res) { },
								fail: function (res) { },
								complete: function (res) { },
							})
						}
						if (res.data.status == 400) {
							wx.showModal({
								title: '提示',
								content: res.data.msg,
								showCancel: false,
								confirmText: '我知道了',
								success: function (res) { },
								fail: function (res) { },
								complete: function (res) { },
							})
						}
					},
					fail: function (res) { },
					complete: function (res) { },
				});
				break;
			case '2':
				wx.request({
					url: config.PytheRestfulServerURL + '/insert/operator/mange/',
					data: {
						phoneNum: that.data.operatorPhoneNum,
						type: 0,
						catalogId: that.data.level,
						managerId: wx.getStorageSync(user.ManagerID),
					},
					method: 'POST',
					success: function (res) {
						if (res.data.status == 200) {
							wx.showToast({
								title: '已添加',
								icon: '',
								image: '',
								duration: 2000,
								mask: true,
								success: function (res) { },
								fail: function (res) { },
								complete: function (res) { },
							})
						}
						if (res.data.status == 400) {
							wx.showModal({
								title: '提示',
								content: res.data.msg,
								showCancel: false,
								confirmText: '我知道了',
								success: function (res) { },
								fail: function (res) { },
								complete: function (res) { },
							})
						}
					},
					fail: function (res) { },
					complete: function (res) { },
				});
				break;
			case '3':
				if(that.data.action == 'recordCompanyHead')
				{
					wx.request({
						url: config.PytheRestfulServerURL + '/insert/group/manage/',
						data: {
							phoneNum: that.data.operatorPhoneNum,
							type: 0,
							catalogId: that.data.level,
							managerId: wx.getStorageSync(user.ManagerID),
						},
						method: 'POST',
						success: function (res) {
							if (res.data.status == 200) {
								wx.showToast({
									title: '已添加',
									icon: '',
									image: '',
									duration: 2000,
									mask: true,
									success: function (res) { },
									fail: function (res) { },
									complete: function (res) { },
								})
							}
							if (res.data.status == 400) {
								wx.showModal({
									title: '提示',
									content: res.data.msg,
									showCancel: false,
									confirmText: '我知道了',
									success: function (res) { },
									fail: function (res) { },
									complete: function (res) { },
								})
							}
						},
						fail: function (res) { },
						complete: function (res) { },
					});
				}
				
				break;
			case '4':
				wx.request({
					url: config.PytheRestfulServerURL + '/insert/ingcart/manage/',
					data: {
						phoneNum: that.data.operatorPhoneNum,
						type: 0,
						catalogId: that.data.level,
						managerId: wx.getStorageSync(user.ManagerID),
					},
					method: 'POST',
					success: function (res) {
						if (res.data.status == 200) {
							wx.showToast({
								title: '已添加',
								icon: '',
								image: '',
								duration: 2000,
								mask: true,
								success: function (res) { },
								fail: function (res) { },
								complete: function (res) { },
							})
						}
						if (res.data.status == 400) {
							wx.showModal({
								title: '提示',
								content: res.data.msg,
								showCancel: false,
								confirmText: '我知道了',
								success: function (res) { },
								fail: function (res) { },
								complete: function (res) { },
							})
						}
					},
					fail: function (res) { },
					complete: function (res) { },
				});
				break;
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