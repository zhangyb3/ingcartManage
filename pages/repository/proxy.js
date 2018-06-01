var app = getApp();
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");
var login = require("../../utils/login.js");
var operation = require("../../utils/operation.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
		remote:0,
		getCarId:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (parameters) {

		var that = this;
		that.setData({
			remote: parameters.remote,
		});

		wx.getSystemInfo({
			success: function (res) {
				var date = new Date();
				that.setData({
					winHeight: res.windowHeight,
					
				})
			}
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
						customerPhoneNum: parameters.id,
					})
				}
			},
			fail: function (res) { },
			complete: function (res) { },
		});
	},

	getCustomerPhoneNum: function (e) {
		var that = this;
		console.log(e.detail.value);
		that.data.customerPhoneNum = e.detail.value;
		var regExp = /0?(13|14|15|18)[0-9]{9}/;
		console.log('get phone !!!!!!!!!!!!!!!!!!',that.data.remote + ';' + that.data.customerPhoneNum);
		
		
	},

	proxyUnlock:function(e){
		console.log('proxy unlock !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		var that = this;
		wx.scanCode({
			onlyFromCamera: true,
			success: function (res) {
				console.log(res);
				if (res.errMsg == 'scanCode:ok') {
					var parameters = operation.urlProcess(res.result); console.log(parameters);
					var qrId = parameters.id;
					wx.setStorageSync('unlock_qr', parameters.id);


					//代理开锁检测
					wx.request({
						url: config.PytheRestfulServerURL + '/agent/unlock/prepare',
						data: {
							carId: qrId,
							phoneNum: that.data.customerPhoneNum,
						},
						method: 'POST',
						success: function(res) {
							if(res.data.status == 200)
							{
								//正常管理员开锁流程


								operation.managerUnlockCheck(that, qrId,
									() => {
										if (qrId.length == 8) {

											wx.navigateTo({
												url: '../index/processing?from=index&carId=' + qrId + '&qrId=' + qrId + '&operation=unlock' + '&proxy=1' + '&customerPhone=' + that.data.customerPhoneNum,
												success: function (res) { },
												fail: function (res) {

												},
												complete: function (res) { },
											});

										}

										else {

											// app.ingcartLockManager = null;
											operation.qr2mac(qrId,
												(result) => {
													console.log('!!!!!!!!!! nodelock type ', result);
													var carId = result.mac;
													var managerId = wx.getStorageSync(user.ManagerID);
													var recordId = wx.getStorageSync(user.RecordID);


													if (wx.getStorageSync('platform') == 'ios') {
														//据说每次都要先关闭再打开适配器清理缓存,试一下
														wx.closeBluetoothAdapter({
															success: function (res) {

																wx.openBluetoothAdapter({
																	success: function (res) {

																		//开锁
																		wx.startBluetoothDevicesDiscovery({
																			services: ['FEE7'],
																			allowDuplicatesKey: true,
																			interval: 0,
																			success: function (res) {


																			},
																			fail: function (res) {

																			},
																			complete: function (res) {

																			},
																		});

																		setTimeout(
																			function () {
																				wx.navigateTo({
																					url: '../index/processing?from=index&carId=' + carId + '&qrId=' + qrId + '&operation=unlock' + '&proxy=1' + '&customerPhone=' + that.data.customerPhoneNum,
																					success: function (res) { },
																					fail: function (res) {

																					},
																					complete: function (res) { },
																				});
																			},
																			1000
																		);

																	},
																	fail: function (res) {

																	},
																	complete: function (res) { },
																});

															},
															fail: function (res) {

															},
															complete: function (res) {
															},
														})


													}
													else {


														//android版开锁
														wx.closeBluetoothAdapter({
															success: function (res) {

																wx.openBluetoothAdapter({
																	success: function (res) {

																		wx.navigateTo({
																			url: '../index/processing?from=index&carId=' + carId + '&qrId=' + qrId + '&operation=unlock' + '&proxy=1' + '&customerPhone=' + that.data.customerPhoneNum,
																			success: function (res) { },
																			fail: function (res) {

																			},
																			complete: function (res) { },
																		});

																	},
																	fail: function (res) { },
																	complete: function (res) { },
																})
															},
															fail: function (res) { },
															complete: function (res) { },
														})

													}

												},
												(result) => {
													wx.showModal({
														title: '',
														content: result,
														confirmText: '我知道了',
													})
												}
											);

										}
									},
								);

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

			},
			fail: function (res) { },
			complete: function (res) { },
		})
	},

	proxyRemoteUnlock: function (e) {
		var that = this;
		
		wx.request({
			url: config.PytheRestfulServerURL + '/agent/web/unlock/prepare',
			data: {
				// carId: qrId,
				phoneNum: that.data.customerPhoneNum,
			},
			method: 'POST',
			success: function (res) {
				console.log('check phone', res);
				if (res.data.status == 200) {
					that.data.customerCarId = res.data.data.carId;
					that.data.getCarId = true;

					//开锁
					{
						var qrId = that.data.customerCarId.toString();
						operation.managerUnlockCheck(that, qrId,
							() => {
								if (qrId.length == 8) {

									wx.navigateTo({
										url: '../index/processing?from=index&carId=' + qrId + '&qrId=' + qrId + '&operation=unlock' + '&proxy=1' + '&customerPhone=' + that.data.customerPhoneNum + '&only=gprs',
										success: function (res) { },
										fail: function (res) {

										},
										complete: function (res) { },
									});

								}

								else {

									// app.ingcartLockManager = null;
									operation.qr2mac(qrId,
										(result) => {
											console.log('!!!!!!!!!! nodelock type ', result);
											var carId = result.mac;
											var managerId = wx.getStorageSync(user.ManagerID);
											var recordId = wx.getStorageSync(user.RecordID);


											if (wx.getStorageSync('platform') == 'ios') {
												//据说每次都要先关闭再打开适配器清理缓存,试一下
												wx.closeBluetoothAdapter({
													success: function (res) {

														wx.openBluetoothAdapter({
															success: function (res) {

																//开锁
																wx.startBluetoothDevicesDiscovery({
																	services: ['FEE7'],
																	allowDuplicatesKey: true,
																	interval: 0,
																	success: function (res) {


																	},
																	fail: function (res) {

																	},
																	complete: function (res) {

																	},
																});

																setTimeout(
																	function () {
																		wx.navigateTo({
																			url: '../index/processing?from=index&carId=' + carId + '&qrId=' + qrId + '&operation=unlock' + '&proxy=1' + '&customerPhone=' + that.data.customerPhoneNum + '&only=gprs',
																			success: function (res) { },
																			fail: function (res) {

																			},
																			complete: function (res) { },
																		});
																	},
																	1000
																);

															},
															fail: function (res) {

															},
															complete: function (res) { },
														});

													},
													fail: function (res) {

													},
													complete: function (res) {
													},
												})


											}
											else {


												//android版开锁
												wx.closeBluetoothAdapter({
													success: function (res) {

														wx.openBluetoothAdapter({
															success: function (res) {

																wx.navigateTo({
																	url: '../index/processing?from=index&carId=' + carId + '&qrId=' + qrId + '&operation=unlock' + '&proxy=1' + '&customerPhone=' + that.data.customerPhoneNum + '&only=gprs',
																	success: function (res) { },
																	fail: function (res) {

																	},
																	complete: function (res) { },
																});

															},
															fail: function (res) { },
															complete: function (res) { },
														})
													},
													fail: function (res) { },
													complete: function (res) { },
												})

											}

										},
										(result) => {
											wx.showModal({
												title: '',
												content: result,
												confirmText: '我知道了',
											})
										}
									);

								}
							},
						);
						that.data.getCarId = false
					}

				}
				else {
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