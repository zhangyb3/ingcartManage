
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
		deviceHeight: 0,
		pageNum: 1,
		pageSize:10,
		callRepairList:[],
		visibleArray:[],
		visibles: [],

		notesHeight: [],
		notesHeight2: [],
		foldTxt: [],
		param: [],

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
		this.getDevice();

		var that = this;
		

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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
		var that = this;
		wx.request({
			url: config.PytheRestfulServerURL + '/select/one/level',
			data: {
				managerId: wx.getStorageSync(user.ManagerID),
				status: 'yes',
			},
			method: 'GET',
			success: function (res) {
				if (res.data.status == 200) {
					var level1 = res.data.data;
					that.setData({
						level1: level1,
					});

					if (wx.getStorageSync(user.Level) >= 5) {
						that.setData({
							tempLevel1: level1[level1.length -1],
							level1Name: level1[level1.length - 1].c1Name,

						});
					}
					if (level1.length == 1) {
						that.setData({
							tempLevel1: level1[0],
							level1Name: level1[0].c1Name,

						});
						that.data.level = that.data.tempLevel1.c1Id;

						if (that.data.level != '0' || wx.getStorageSync(user.Level) >= 5) {
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
									if (that.data.level2.length == 1 ) {
										that.setData({
											tempLevel2: that.data.level2[0],
											level2Name: that.data.level2[0].name,
										})
										that.data.level = that.data.tempLevel2.id;
										
										
									}

									
								},
								fail: function (res) { },
								complete: function (res) { },
							});
						}

						

					}

					wx.request({
						url: config.PytheRestfulServerURL + '/select/maintenance/condition',
						data: {
							level: that.data.level,
							pageNum: 1,
							pageSize: 10,
						},
						method: 'GET',
						success: function (res) {

							if (res.data.status == 200) {
								that.setData({
									callRepairList: res.data.data,
								});
								that.fold();

								for (var count = 0; count < that.data.callRepairList.length; count++) {
									that.data.visibleArray[count] = true;
									that.data.visibles[count] = true;
								}
								that.setData({
									visibleArray: that.data.visibleArray,
									visibles: that.data.visibles,
								});
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
			chooseLevel2: true

		});

		if (that.data.level2.length == 1 || that.data.tempLevel2 == null) {
			that.setData({
				tempLevel2: that.data.level2[0],
			})
		}

	},

	changeLevel1: function (e) {

		console.log("level1", e);
		var that = this;


		that.setData({
			tempLevel1: that.data.level1[e.detail.value[0]],
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
			level2: null,
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
						});



					}

				},
				fail: function (res) { },
				complete: function (res) { },
			});
		}

		wx.request({
			url: config.PytheRestfulServerURL + '/select/maintenance/condition',
			data: {
				level: that.data.level,
				pageNum: 1,
				pageSize: 10,
			},
			method: 'GET',
			success: function (res) {
				that.setData({
					callRepairList: [],
				});
				if (res.data.status == 200) {
					that.setData({
						callRepairList: res.data.data,
					});
					that.fold();

					for (var count = 0; count < that.data.callRepairList.length; count++) {
						that.data.visibleArray[count] = true;
						that.data.visibles[count] = true;
					}
					that.setData({
						visibleArray: that.data.visibleArray,
						visibles: that.data.visibles,
					});
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
			url: config.PytheRestfulServerURL + '/select/maintenance/condition',
			data: {
				level: that.data.level,
				pageNum: 1,
				pageSize: 10,
			},
			method: 'GET',
			success: function (res) {
				that.setData({
					callRepairList: [],
				});
				if (res.data.status == 200) {
					that.setData({
						callRepairList: res.data.data,
					});
					that.fold();

					for (var count = 0; count < that.data.callRepairList.length; count++) {
						that.data.visibleArray[count] = true;
						that.data.visibles[count] = true;
					}
					that.setData({
						visibleArray: that.data.visibleArray,
						visibles: that.data.visibles,
					});
				}
			},
			fail: function (res) { },
			complete: function (res) { },
		});

	},

	fold: function () {
		var that = this;
		var notesHeight = [];
		var notesHeight2 = [];
		var foldTxt = [];
		var param = [];
		for (var i = 0; i < that.data.callRepairList.length; i++) {
			notesHeight[i] = "max-height:80rpx;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;";
			notesHeight2[i] = "max-height:114rpx;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;";
			foldTxt[i] = '展开';
			param[i] = 1
		};

		that.setData({
			notesHeight: notesHeight,
			notesHeight2: notesHeight2,
			foldTxt: foldTxt,
			param: param
		});
		console.log(notesHeight)
	},

	foldMore: function (e) {
		// console.log(e.target.dataset.fold);
		// console.log(e.target.dataset.param);
		var that = this;
		var param = that.data.param;
		var fold = e.target.dataset.fold;
		var notesHeight = that.data.notesHeight;
		var notesHeight2 = that.data.notesHeight2;
		var foldTxt = that.data.foldTxt;
		if (param[e.target.dataset.fold] == 1) {
			param[e.target.dataset.fold] = 0;
			notesHeight[fold] = "max-height:auto;text-align:justify;";
			notesHeight2[fold] = "max-height:auto;text-align:justify;";
			foldTxt[fold] = '收起';
			that.setData({
				notesHeight: notesHeight,  //高度
				notesHeight2: notesHeight2,  //高度
				foldTxt: foldTxt,          //展开 收起
				param: param               //data-param
			})
		} else if (param[e.target.dataset.fold] == 0) {
			param[e.target.dataset.fold] = 1;
			notesHeight[fold] = "max-height:80rpx;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;";
			notesHeight2[fold] = "max-height:114rpx;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;";
			foldTxt[fold] = '展开';
			that.setData({
				notesHeight: notesHeight,  //高度
				notesHeight2: notesHeight2,  //高度
				foldTxt: foldTxt,          //展开 收起
				param: param               //data-param
			})
		}

	},

	findTargetOnMap:function(e){
		var dataset = e.currentTarget.dataset;
		
		var cart = dataset.cart;
		
		
			wx.openLocation({
				latitude: cart.latitude, // 纬度，范围为-90~90，负数表示南纬
				longitude: cart.longitude, // 经度，范围为-180~180，负数表示西经
				scale: 28, // 缩放比例
				success: function (res) {
					// success
				},
				fail: function (res) {
					// fail
				},
				complete: function (res) {
					// complete
				}
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

	getMoreCallRepair:function(e){
		var that = this;
		that.data.pageNum = that.data.pageNum + 1;


		wx.request({
			url: config.PytheRestfulServerURL + '/select/maintenance/condition',
			data: {
				level: that.data.level,
				pageNum: that.data.pageNum,
				pageSize: 10,
			},
			method: 'GET',
			success: function (res) {
				if (res.data.status == 200) {
					var result = res.data.data;


					if (result == null) {
						that.data.pageNum = that.data.pageNum - 1;
					}
					else {
						that.data.callRepairList = that.data.callRepairList.concat(result);
						that.setData({
							callRepairList: that.data.callRepairList,

						});
						that.fold();

						var tempVisibleArray = [];
						var tempVisibles = [];
						for (var count = 0; count < result.length; count++) {
							tempVisibleArray[count] = true;
							tempVisibles[count] = true;
						}
						that.data.visibleArray = that.data.visibleArray.concat(tempVisibleArray);
						that.data.visibles = that.data.visibles.concat(tempVisibles);
						that.setData({
							visibleArray: that.data.visibleArray,
							visibles: that.data.visibles,
						});
					}

				}
				else {
					that.data.pageNum = that.data.pageNum - 1;
				}
			}
		});
		
	},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
		
		
		
  },

	alreadyFindTarget:function(e){
		var that = this;
		var id = e.currentTarget.dataset.id;
		var index = e.currentTarget.dataset.index;
		wx.showModal({
			title: '提示',
			content: '是否已找到报修车辆？',
			success: function(res) {
				if(res.confirm){
					that.data.visibleArray[index] = false;
					that.setData({
						visibleArray: that.data.visibleArray,
					});

					wx.request({
						url: config.PytheRestfulServerURL + '/update/maintenance/status',
						data: {

							id: id,
						},
						method: 'GET',
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

	deleteFixRecord: function (e) {
		var that = this;
		var id = e.currentTarget.dataset.id;
		var index = e.currentTarget.dataset.index;
		wx.showModal({
			title: '提示',
			content: '是否删除报修纪录？',
			success: function (res) {
				if (res.confirm) {
					

					wx.request({
						url: config.PytheRestfulServerURL + '/record/maintenance',
						data: {
							qr_id: that.data.callRepairList[index].qrId,
							carId: that.data.callRepairList[index].carId,
							id: id,
						},
						method: 'POST',
						success: function (res) { 
							if(res.data.status == 200)
							{
								that.data.visibles[index] = false;
								that.setData({
									visibles: that.data.visibles,
								});
								that.data.callRepairList.slice(index, 1);
								that.setData({
									callRepairList: that.data.callRepairList,
								});
								
							}
							wx.showModal({
								title: '提示',
								content: res.data.msg,
								showCancel: false,
								confirmText: '我知道了',
								success: function (res) { },
								fail: function (res) { },
								complete: function (res) { },
							});

						},
						fail: function (res) { },
						complete: function (res) { },
					})
				}
			},
			fail: function (res) { },
			complete: function (res) { },
		})

	},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})