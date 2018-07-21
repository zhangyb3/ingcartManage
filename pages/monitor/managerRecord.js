
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");
var login = require("../../utils/login.js");
var operation = require("../../utils/operation.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
		managers:[],
		carts:[],
		attractions:[],
		pageNum:1,
		pageSize:10,

		chooseLevel1: false,
		chooseLevel2: false,
		tempLevel1: null,
		tempLevel2: null,
		level1: [],
		level2: [],
		level: '',

		checkType:null,
		act:null,

		password:null,
		focusOnPasswordPop: false,//控制input 聚焦
		passwordFlag: false,//密码输入遮罩
		cancelIntervalVar:null,
		deletePermission:false,

		shwoFilter:true,
		queryAll:'no',
    parkConditions:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (parameters) {
		var that = this;
		that.data.checkType = parameters.checkType;
		that.data.queryAll = parameters.queryAll;
		that.getDevice();
		
		if(that.data.checkType == 'attraction')
		{
			that.setData({
				showFilter: false,
			});
		}
		else
		{
			that.setData({
				showFilter: true,
			});
		}

		that.setData({
			checkType: parameters.checkType,
			act: parameters.act,
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

					if (level1.length == 1) {
						that.setData({
							tempLevel1: level1[0],
							level1Name: level1[0].c1Name,

						});
						that.data.level = that.data.tempLevel1.c1Id;

						if (that.data.level != '0' && that.data.act != 'deleteGroup') {
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
											level: that.data.level2[0].id,
										})
										

										if (that.data.checkType == 'manager') {
                      console.log("level" + that.data.level)
											wx.request({
												url: config.PytheRestfulServerURL + '/select/add/record',
												data: {
													level: that.data.level,
													pageNum: 1,
													pageSize: 10,
                          operaterLevel: wx.getStorageSync(user.Level)
												},
												method: 'GET',
												success: function (res) {
													if (res.data.status == 200) {
														var result = res.data.data;


														if (result == null || result.length == 0) {
															that.data.pageNum = 1;
															that.setData({
																managers: [],

															});
														}
														else {
															that.data.managers = that.data.managers.concat(result);
															that.setData({
																managers: that.data.managers,

															});
														}

													}
												}
											});
										}
                    if (that.data.checkType == 'parkDetails') {
                      console.log("开闭园详情")
                      wx.request({
                        url: config.PytheRestfulServerURL + '/select/park/condition/level',
                        data: {
                          level: that.data.level,
                          pageNum: that.data.pageNum,
                          pageSize: 10,
                        },
                        method: 'GET',
                        success: function (res) {
                          if (res.data.status == 200) {
                            var result = res.data.data;


                            if (result == null || result.length == 0) {
                              that.data.pageNum = 1;
                              that.setData({
                                parkConditions: [],

                              });
                            }
                            else {
                              that.data.parkConditions = that.data.parkConditions.concat(result);
                              that.setData({
                                parkConditions: that.data.parkConditions,

                              });
                            }

                          }
                        }
                      });

                    }
										if (that.data.checkType == 'cart') {
											wx.request({
												url: config.PytheRestfulServerURL + '/select/operator/condition',
												data: {
													level: that.data.level,
													pageNum: 1,
													pageSize: 10,
                          operaterLevel: wx.getStorageSync(user.Level)
												},
												method: 'GET',
												success: function (res) {
													if (res.data.status == 200) {
														var result = res.data.data;


														if (result == null || result.length == 0) {
															that.data.pageNum = 1;
															that.setData({
																carts: [],

															});
														}
														else {
															for (var count = 0; count < result.length; count++) {
																if (result[count].status == 0) {
																	result[count].status = '使用中';
																}
																if (result[count].status == 1) {
																	result[count].status = '完毕';
																}
															}
															that.data.carts = that.data.carts.concat(result);
															that.setData({
																carts: that.data.carts,

															});
														}

													}
												}
											});
										}

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

		if(that.data.checkType == 'attraction')
		{
			wx.request({
				url: config.PytheRestfulServerURL + '/select/area/level',
				data: {
					pageNum: that.data.pageNum,
					pageSize: that.data.pageSize,
				},
				method: 'GET',
				success: function(res) {
					var result = res.data.data;


					if (result == null || result.length == 0) {
						that.data.pageNum = 1;
						that.setData({
							attractions: [],

						});
					}
					else {
						for(var count = 0; count < result.length; count++)
						{
							if(result[count].status == 1)
							{
								result[count].status = '自行结算';
							}
							if (result[count].status == 0) {
								result[count].status = '人工结算';
							}
							if (result[count].status == 2) {
								result[count].status = '热点结算';
							}
						}
						that.data.attractions = that.data.attractions.concat(result);
						that.setData({
							attractions: that.data.attractions,

						});
					}
				},
				fail: function(res) {},
				complete: function(res) {},
			})
		}
		else if(wx.getStorageSync(user.Level) >= 4)
		{
			if (that.data.checkType == 'manager') {
				that.setData({
					managers: [],

				});
				wx.request({
					url: config.PytheRestfulServerURL + '/select/add/record',
					data: {
						level: that.data.level,
						pageNum: 1,
						pageSize: 10,
            operaterLevel: wx.getStorageSync(user.Level)
					},
					method: 'GET',
					success: function (res) {
						if (res.data.status == 200) {
							var result = res.data.data;


							if (result == null || result.length == 0) {
								that.data.pageNum = 1;
								that.setData({
									managers: [],

								});
							}
							else {
								that.data.managers = that.data.managers.concat(result);
								that.setData({
									managers: that.data.managers,

								});
							}

						}
					}
				});
			}
      if (that.data.checkType == 'parkDetails') {
        that.setData({
          parkConditions: [],

        });
        wx.request({
          url: config.PytheRestfulServerURL + '/select/park/condition/level',
          data: {
            level: that.data.level,
            pageNum: 1,
            pageSize: 10,
          },
          method: 'GET',
          success: function (res) {
            if (res.data.status == 200) {
              var result = res.data.data;


              if (result == null || result.length == 0) {
                that.data.pageNum = 1;
                that.setData({
                  parkConditions: [],

                });
              }
              else {
                that.data.parkConditions = that.data.parkConditions.concat(result);
                that.setData({
                  parkConditions: that.data.parkConditions,

                });
              }

            }
          }
        });
      }
			if (that.data.checkType == 'cart') {
				that.setData({
					carts: [],

				});
				wx.request({
					url: config.PytheRestfulServerURL + '/select/operator/condition',
					data: {
						level: that.data.level,
						pageNum: 1,
						pageSize: 10,
            operaterLevel: wx.getStorageSync(user.Level)
					},
					method: 'GET',
					success: function (res) {
						if (res.data.status == 200) {
							var result = res.data.data;


							if (result == null || result.length == 0) {
								that.data.pageNum = 1;
								that.setData({
									carts: [],

								});
							}
							else {
								for (var count = 0; count < result.length; count++) {
									if (result[count].status == 0) {
										result[count].status = '使用中';
									}
									if (result[count].status == 1) {
										result[count].status = '完毕';
									}
								}
								that.data.carts = that.data.carts.concat(result);
								that.setData({
									carts: that.data.carts,

								});
							}

						}
					}
				});
			}
		}

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
			level2: [],
		});
		that.data.level = that.data.tempLevel1.c1Id;
		

		if (that.data.act != 'deleteGroup') {
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
							// tempLevel2:null,
						});
					}
					if (that.data.level2.length == 1 ) {
						that.setData({
							tempLevel2: that.data.level2[0],
							level2Name: that.data.level2[0].name,
							level: that.data.level2[0].id,
						})


					}

					if (that.data.checkType == 'manager') {
						that.setData({
							managers: [],

						});
						wx.request({
							url: config.PytheRestfulServerURL + '/select/add/record',
							data: {
								level: that.data.level,
								pageNum: 1,
								pageSize: 10,
                operaterLevel: wx.getStorageSync(user.Level)
							},
							method: 'GET',
							success: function (res) {
								if (res.data.status == 200) {
									var result = res.data.data;


									if (result == null || result.length == 0) {
										that.data.pageNum = 1;
										that.setData({
											managers: [],

										});
									}
									else {
										that.data.managers = that.data.managers.concat(result);
										that.setData({
											managers: that.data.managers,

										});
									}

								}
							}
						});
					}
          if (that.data.checkType == 'parkDetails') {
            console.log("闭园：")
            that.setData({
              parkConditions: [],

            });
            wx.request({
              url: config.PytheRestfulServerURL + '/select/park/condition/level',
              data: {
                level: that.data.level,
                pageNum: 1,
                pageSize: 10,
              },
              method: 'GET',
              success: function (res) {
                if (res.data.status == 200) {
                  var result = res.data.data;


                  if (result == null || result.length == 0) {
                    that.data.pageNum = 1;
                    that.setData({
                      parkConditions: [],

                    });
                  }
                  else {
                    that.data.parkConditions = that.data.parkConditions.concat(result);
                    that.setData({
                      parkConditions: that.data.parkConditions,

                    });
                  }

                }
              }
            });
          }
					if (that.data.checkType == 'cart') {
						that.setData({
							carts: [],

						});
						wx.request({
							url: config.PytheRestfulServerURL + '/select/operator/condition',
							data: {
								level: that.data.level,
								pageNum: 1,
								pageSize: 10,
                operaterLevel: wx.getStorageSync(user.Level)
							},
							method: 'GET',
							success: function (res) {
								if (res.data.status == 200) {
									var result = res.data.data;


									if (result == null || result.length == 0) {
										that.data.pageNum = 1;
										that.setData({
											carts: [],

										});
									}
									else {
										for (var count = 0; count < result.length; count++) {
											if (result[count].status == 0) {
												result[count].status = '使用中';
											}
											if (result[count].status == 1) {
												result[count].status = '完毕';
											}
										}
										that.data.carts = that.data.carts.concat(result);
										that.setData({
											carts: that.data.carts,

										});
									}

								}
							}
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

		if(that.data.checkType == 'manager')
		{
			that.setData({
				managers: [],

			});
			wx.request({
				url: config.PytheRestfulServerURL + '/select/add/record',
				data: {
					level: that.data.level,
					pageNum: 1,
					pageSize: 10,
          operaterLevel: wx.getStorageSync(user.Level)
				},
				method: 'GET',
				success: function (res) {
					if (res.data.status == 200) {
						var result = res.data.data;


						if (result == null || result.length == 0) {
							that.data.pageNum = 1;
							that.setData({
								managers: [],

							});
						}
						else {
							that.data.managers = that.data.managers.concat(result);
							that.setData({
								managers: that.data.managers,

							});
						}

					}
				}
			});
		}
    if (that.data.checkType == 'parkDetails') {
      that.setData({
        parkConditions: [],

      });
      wx.request({
        url: config.PytheRestfulServerURL + '/select/park/condition/level',
        data: {
          level: that.data.level,
          pageNum: 1,
          pageSize: 10,
        },
        method: 'GET',
        success: function (res) {
          if (res.data.status == 200) {
            var result = res.data.data;


            if (result == null || result.length == 0) {
              that.data.pageNum = 1;
              that.setData({
                parkConditions: [],

              });
            }
            else {
              that.data.parkConditions = that.data.parkConditions.concat(result);
              that.setData({
                parkConditions: that.data.parkConditions,

              });
            }

          }
        }
      });
    }
		if(that.data.checkType == 'cart')
		{
			that.setData({
				carts: [],

			});
			wx.request({
				url: config.PytheRestfulServerURL + '/select/operator/condition',
				data: {
					level: that.data.level,
					pageNum: 1,
					pageSize: 10,
          operaterLevel: wx.getStorageSync(user.Level)
				},
				method: 'GET',
				success: function (res) {
					if (res.data.status == 200) {
						var result = res.data.data;


						if (result == null || result.length == 0) {
							that.data.pageNum = 1;
							that.setData({
								carts: [],

							});
						}
						else {
							for (var count = 0; count < result.length; count++) {
								if (result[count].status == 0) {
									result[count].status = '使用中';
								}
								if (result[count].status == 1) {
									result[count].status = '完毕';
								}
							}
							that.data.carts = that.data.carts.concat(result);
							that.setData({
								carts: that.data.carts,

							});
						}

					}
				}
			});
		}
		
	},

	getMoreManagers: function () {
		var that = this;
		that.data.pageNum = that.data.pageNum + 1;


		wx.request({
			url: config.PytheRestfulServerURL + '/select/add/record',
			data: {
				level: that.data.level,
				pageNum: that.data.pageNum,
				pageSize: 10,
        operaterLevel: wx.getStorageSync(user.Level)
			},
			method: 'GET',
			success: function (res) {
				if (res.data.status == 200) {
					var result = res.data.data;


					if (result == null) {
						that.data.pageNum = that.data.pageNum - 1;
					}
					else {
						that.data.managers = that.data.managers.concat(result);
						that.setData({
              managers: that.data.managers,
							
						});
					}

				}
			}
		});
	},
  getMoreParkDetails: function () {
    var that = this;
    that.data.pageNum = that.data.pageNum + 1;


    wx.request({
      url: config.PytheRestfulServerURL + '/select/park/condition/level',
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
            that.data.parkConditions = that.data.parkConditions.concat(result);
            that.setData({
              parkConditions: that.data.parkConditions,

            });
          }

        }
      }
    });
  },

	//删除管理员
	deleteManager: function (e) {
		var that = this;
		var manager = e.currentTarget.dataset.manager;
		var index = e.currentTarget.dataset.index;
		wx.showModal({
			title: '提示',
			content: '是否删除该管理员？',
			showCancel:true,
			cancelText:'取消',
			confirmText:'确定',
			success: function (res) {
				if (res.confirm) {
					wx.request({
						url: config.PytheRestfulServerURL + '/delete/manager',
						data: {
							phoneNum: manager.phoneNum,
							level: wx.getStorageSync(user.Level),
							catalogId: wx.getStorageSync(user.CatalogID),
						},
						method: 'POST',
						success: function (res) {
							if (res.data.status == 200) {
								that.data.managers.splice(index, 1);
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
							that.setData({
								managers: that.data.managers,
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


	getMoreCarts: function () {
		var that = this;
		that.data.pageNum = that.data.pageNum + 1;


		wx.request({
			url: config.PytheRestfulServerURL + '/select/operator/condition',
			data: {
				level: that.data.level,
				pageNum: that.data.pageNum,
				pageSize: 10,
        operaterLevel: wx.getStorageSync(user.Level)
			},
			method: 'GET',
			success: function (res) {
				if (res.data.status == 200) {
					var result = res.data.data;


					if (result == null) {
						that.data.pageNum = that.data.pageNum - 1;
					}
					else {
						for(var count = 0; count < result.length; count++)
						{
							if(result[count].status == 0)
							{
								result[count].status = '使用中';
							}
							if (result[count].status == 1) {
								result[count].status = '完毕';
							}
						}
						that.data.carts = that.data.carts.concat(result);
						that.setData({
              carts: that.data.carts,

						});
					}

				}
			}
		});
	},


	getMoreAttracions: function () {
		var that = this;
		that.data.pageNum = that.data.pageNum + 1;


		wx.request({
			url: config.PytheRestfulServerURL + '/select/area/level',
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
						for (var count = 0; count < result.length; count++) {
							if (result[count].status == 0) {
								result[count].status = '人工结算';
							}
							if (result[count].status == 1) {
								result[count].status = '自动结算';
							}
						}
						that.data.attractions = that.data.attractions.concat(result);
						that.setData({
              attractions: that.data.attractions,

						});
					}

				}
			}
		});
	},


	deleteCompany:function(e){
		var that = this;

		wx.showModal({
			title: '提示',
			content: '确定要删除吗？',
			showCancel: true,
			cancelText: '取消',
			confirmText: '确定',
			success: function(res) {
				if(res.confirm)
				{
					that.setData({
						passwordFlag: true,
						level: that.data.level,
					});

					var cancelIntervalVar = setInterval(
						function()
						{

							if(that.data.deletePermission == true)
							{
								clearInterval(cancelIntervalVar);
								
								if (that.data.act == 'deleteAttraction') {
									wx.request({
										url: config.PytheRestfulServerURL + '/delete/attraction/',
										data: {
											catalogId: that.data.level,
											managerId: wx.getStorageSync(user.ManagerID),
											password: that.data.password,
										},
										method: 'POST',
										success: function (res) {
											wx.showModal({
												title: '提示',
												content: res.data.msg,
												showCancel: false,
												confirmText: '我知道了',

											});
											that.closePassword();
										},
										fail: function (res) { },
										complete: function (res) { },
									});
								}
								if (that.data.act == 'deleteGroup') {
									wx.request({
										url: config.PytheRestfulServerURL + '/delete/group/',
										data: {
											catalogId: that.data.level,
											managerId: wx.getStorageSync(user.ManagerID),
											password: that.data.password,
										},
										method: 'POST',
										success: function (res) {
											wx.showModal({
												title: '提示',
												content: res.data.msg,
												showCancel: false,
												confirmText: '我知道了',

											});
											that.closePassword();
										},
										fail: function (res) { },
										complete: function (res) { },
									});
								}

							}

							if(that.data.passwordFlag == false)
							{
								clearInterval(cancelIntervalVar);
							}
						},
						100
					);
					
				}
				
				
				
			},
			fail: function(res) {},
			complete: function(res) {},
		})
		
		
	},


	getPassword:function(e) {//获取钱包密码
		this.setData({
			password: e.detail.value
		});
		if (this.data.password.length == 6) {//密码长度6位时，自动验证钱包支付结果
			this.data.deletePermission = true;
		}
	},
	
	getFocus:function() {//聚焦input
		console.log('isFocus', this.data.focusOnPasswordPop)
		this.setData({
			focusOnPasswordPop: true
		})
	},
	
	closePassword:function() {//关闭钱包输入密码遮罩

		this.setData({
			focusOnPasswordPop: false,//失去焦点
			passwordFlag: false,
			deletePermission: false,
			password:null,
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
		var that = this;
		clearInterval(that.data.cancelIntervalVar);
		that.closePassword();
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