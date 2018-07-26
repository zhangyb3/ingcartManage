
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
		deviceHeight: 0,
		pageNum: 1,
		carStatusList:[],
    powerStatusList:[],
    qrids:[],
    onlineStatusList: [],
    distanceList:[],
		chooseLevel1: false,
		chooseLevel2: false,
		tempLevel1: null,
		tempLevel2: null,
		level1: [],
		level2: [],
		
		winHeight: 0,
		level: '',
		queryAll:'no',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (parameters) {
		this.getDevice();
		var that = this;
		that.data.queryAll = parameters.queryAll;
		that.data.use = parameters.use;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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

		that.setData({
			tempLevel1: null,
			tempLevel2: null,
			level1: [],
			level2: [],
			use: that.data.use,
		});

		
		wx.request({
			url: config.PytheRestfulServerURL + '/select/one/level',
			data: {
				managerId:wx.getStorageSync(user.ManagerID),
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
                   
										var url;
										if (that.data.use == 1) {
											url = config.PytheRestfulServerURL + '/count/car/condition';
										}
										if (that.data.use == 0) {
											url = config.PytheRestfulServerURL + '/select/car/counter';
                    } 
                    if (that.data.use == 2) {
                     
                      url = config.PytheRestfulServerURL + '/select/car/power';
                      wx.request({
                        url: url,
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
                              powerStatusList: [],
                            });
                            if (result == null) {
                              that.data.pageNum = that.data.pageNum - 1;
                            }
                            else {
                              that.data.powerStatusList = that.data.powerStatusList.concat(result);

                              that.setData({
                                powerStatusList: that.data.powerStatusList,
                              });
                            }

                          }
                        }
                      });
                    } else if (that.data.use == 3){
                      url = config.PytheRestfulServerURL + '/select/netlocks';
                      wx.request({
                        url: url,
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
                              qrids: [],
                            });
                            if (result == null) {
                              that.data.pageNum = that.data.pageNum - 1;
                            }
                            else {
                              that.data.qrids = that.data.qrids.concat(result);

                              that.setData({
                                qrids: that.data.qrids,
                              });
                            }

                          }
                        }
                      });
                    } else if (that.data.use == 4) {
                      url = config.PytheRestfulServerURL + '/select/device/online/level';
                      wx.request({
                        url: url,
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
                              onlineStatusList: [],
                            });
                            if (result == null) {
                              that.data.pageNum = that.data.pageNum - 1;
                            }
                            else {
                              that.data.onlineStatusList = that.data.onlineStatusList.concat(result);

                              that.setData({
                                onlineStatusList: that.data.onlineStatusList,
                              });
                            }

                          }
                        }
                      });
                    } else if (that.data.use == 5) {
                      url = config.PytheRestfulServerURL + '/select/distance/level';
                      wx.request({
                        url: url,
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
                              distanceList: [],
                            });
                            if (result == null) {
                              that.data.pageNum = that.data.pageNum - 1;
                            }
                            else {
                              that.data.distanceList = that.data.distanceList.concat(result);

                              that.setData({
                                distanceList: that.data.distanceList,
                              });
                            }

                          }
                        }
                      });
                    }
                    else{
                      console.log("carStatusList1" + that.data.level)
                      wx.request({
                        url: url,
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
                              carStatusList: [],
                            });
                            if (result.user == null) {
                              that.data.pageNum = 1;
                              that.setData({
                                carStatusList: [],
                                carMargin: 0,
                                endNum: result.end_num,
                              });
                            }
                            else {
                              if (that.data.use == 1)
                                that.data.carStatusList = that.data.carStatusList.concat(result.user);
                              that.setData({
                                carStatusList: that.data.carStatusList,
                                carMargin: result.size,
                                endNum: result.end_num,
                              });
                            }
                            if (result==null){
                              that.data.pageNum = 1;
                              that.setData({
                                carStatusList: [],
                                carMargin: 0,
                                endNum: result.end_num,
                              });
                            }else{
                              if (that.data.use == 0)
                                that.data.carStatusList = that.data.carStatusList.concat(result);
                              that.setData({
                                carStatusList: that.data.carStatusList,
                                carMargin: result.size,
                                endNum: result.end_num,
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
    if (wx.getStorageSync(user.Level)>=4){
      that.setData({
        level:'0'
      })
    }
		if (that.data.level == '0')
		{
			var url;
			if(that.data.use == 1)
			{
				url = config.PytheRestfulServerURL + '/count/car/condition';
			}
			if (that.data.use == 0) {
				url = config.PytheRestfulServerURL + '/select/car/counter';
			}
      if (that.data.use == 2) {
        url = config.PytheRestfulServerURL + '/select/car/power';
        wx.request({
          url: url,
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
                powerStatusList: [],
              });
              if (result == null) {
                that.data.pageNum = that.data.pageNum - 1;
              }
              else {
                that.data.powerStatusList = that.data.powerStatusList.concat(result);

                that.setData({
                  powerStatusList: that.data.powerStatusList,
                });
              }

            }
          }
        });
      } else if (that.data.use == 3) {
        url = config.PytheRestfulServerURL + '/select/netlocks';
        wx.request({
          url: url,
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
                qrids: [],
              });
              if (result == null) {
                that.data.pageNum = that.data.pageNum - 1;
              }
              else {
                that.data.qrids = that.data.qrids.concat(result);

                that.setData({
                  qrids: that.data.qrids,
                });
              }

            }
          }
        });
      } else if (that.data.use == 4) {
        url = config.PytheRestfulServerURL + '/select/device/online/level';
        wx.request({
          url: url,
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
                onlineStatusList: [],
              });
              if (result == null) {
                that.data.pageNum = that.data.pageNum - 1;
              }
              else {
                that.data.onlineStatusList = that.data.onlineStatusList.concat(result);

                that.setData({
                  onlineStatusList: that.data.onlineStatusList,
                });
              }

            }
          }
        });
      } else if (that.data.use == 5) {
        url = config.PytheRestfulServerURL + '/select/distance/level';
        wx.request({
          url: url,
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
                distanceList: [],
              });
              if (result == null) {
                that.data.pageNum = that.data.pageNum - 1;
              }
              else {
                that.data.distanceList = that.data.distanceList.concat(result);

                that.setData({
                  distanceList: that.data.distanceList,
                });
              }

            }
          }
        });
      }
      else{
        console.log("carStatusList1" + that.data.level)
        wx.request({
          url: url,
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
                carStatusList: [],
              });
              that.setData({
                carMargin: result.size,
                endNum: result.end_num,
              });

              if (that.data.use == 1) {
                that.setData({
                  carStatusList: result.user,
                });
              }
              if (that.data.use == 0) {
                that.setData({
                  carStatusList: result,
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
			chooseLevel1: true
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
		that.data.carStatusList = [];
    that.data.qrids = [];
    that.data.powerStatusList = [];
		if (that.data.level != '0') {
			that.setData({
				carStatusList: [],
        qrids:[],
        powerStatusList:[],
			});
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
					if (that.data.level2.length == 1 || that.data.tempLevel2 == null) {
						that.setData({
							tempLevel2: that.data.level2[0],
							level2Name: that.data.level2[0].name,
							level: that.data.level2[0].id,
						})

						
					}

					var url;
					if (that.data.use == 1) {
						url = config.PytheRestfulServerURL + '/count/car/condition';
					}
					if (that.data.use == 0) {
						url = config.PytheRestfulServerURL + '/select/car/counter';
					}
          if (that.data.use == 2) {
            url = config.PytheRestfulServerURL + '/select/car/power';
            wx.request({
              url: url,
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
                    powerStatusList: [],
                  });
                  if (result == null) {
                    that.data.pageNum = that.data.pageNum - 1;
                  }
                  else {
                    that.data.powerStatusList = that.data.powerStatusList.concat(result);

                    that.setData({
                      powerStatusList: that.data.powerStatusList,
                    });
                  }

                }
              }
            });
          } else if (that.data.use == 3) {
            url = config.PytheRestfulServerURL + '/select/netlocks';
            wx.request({
              url: url,
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
                    qrids: [],
                  });
                  if (result == null) {
                    that.data.pageNum = that.data.pageNum - 1;
                  }
                  else {
                    that.data.qrids = that.data.qrids.concat(result);

                    that.setData({
                      qrids: that.data.qrids,
                    });
                  }

                }
              }
            });
          } else if (that.data.use == 4) {
            url = config.PytheRestfulServerURL + '/select/device/online/level';
            wx.request({
              url: url,
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
                    onlineStatusList: [],
                  });
                  if (result == null) {
                    that.data.pageNum = that.data.pageNum - 1;
                  }
                  else {
                    that.data.onlineStatusList = that.data.onlineStatusList.concat(result);

                    that.setData({
                      onlineStatusList: that.data.onlineStatusList,
                    });
                  }

                }
              }
            });
          } else if (that.data.use == 5) {
            url = config.PytheRestfulServerURL + '/select/distance/level';
            wx.request({
              url: url,
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
                    distanceList: [],
                  });
                  if (result == null) {
                    that.data.pageNum = that.data.pageNum - 1;
                  }
                  else {
                    that.data.distanceList = that.data.distanceList.concat(result);

                    that.setData({
                      distanceList: that.data.distanceList,
                    });
                  }

                }
              }
            });
          }
          else{
            wx.request({
              url: url,
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
                    carStatusList: [],
                  });
                  if ((result.user == null && that.data.use == 1) || (result == null && that.data.use == 0)) {
                    that.data.pageNum = 1;
                    that.setData({
                      carStatusList: [],
                      carMargin: 0,
                      endNum: result.end_num,
                    });
                  }
                  else {
                    console.log('fukck');
                    if (that.data.use == 1)
                      that.data.carStatusList = that.data.carStatusList.concat(result.user);
                    if (that.data.use == 0)
                      that.data.carStatusList = that.data.carStatusList.concat(result);

                    that.setData({
                      carStatusList: that.data.carStatusList,
                      carMargin: result.size,
                      endNum: result.end_num,
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
    that.data.qrids = [];
    that.data.powerStatusList = [];

		var url;
		if (that.data.use == 1) {
			url = config.PytheRestfulServerURL + '/count/car/condition';
		}
		if (that.data.use == 0) {
			url = config.PytheRestfulServerURL + '/select/car/counter';
		}
    if (that.data.use == 2) {
      url = config.PytheRestfulServerURL + '/select/car/power';
      wx.request({
        url: url,
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
              powerStatusList: [],
            });
            if (result == null) {
              that.data.pageNum = that.data.pageNum - 1;
            }
            else {
              that.data.powerStatusList = that.data.powerStatusList.concat(result);

              that.setData({
                powerStatusList: that.data.powerStatusList,
              });
            }

          }
        }
      });
    } else if (that.data.use == 3) {
      url = config.PytheRestfulServerURL + '/select/netlocks';
      wx.request({
        url: url,
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
              qrids: [],
            });
            if (result == null) {
              that.data.pageNum = that.data.pageNum - 1;
            }
            else {
              that.data.qrids = that.data.qrids.concat(result);

              that.setData({
                qrids: that.data.qrids,
              });
            }

          }
        }
      });
    } else if (that.data.use == 4) {
      url = config.PytheRestfulServerURL + '/select/device/online/level';
      wx.request({
        url: url,
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
              onlineStatusList: [],
            });
            if (result == null) {
              that.data.pageNum = that.data.pageNum - 1;
            }
            else {
              that.data.onlineStatusList = that.data.onlineStatusList.concat(result);

              that.setData({
                onlineStatusList: that.data.onlineStatusList,
              });
            }

          }
        }
      });
    } else if (that.data.use == 5) {
      url = config.PytheRestfulServerURL + '/select/distance/level';
      wx.request({
        url: url,
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
              distanceList: [],
            });
            if (result == null) {
              that.data.pageNum = that.data.pageNum - 1;
            }
            else {
              that.data.distanceList = that.data.distanceList.concat(result);

              that.setData({
                distanceList: that.data.distanceList,
              });
            }

          }
        }
      });
    }
    else{
      wx.request({
        url: url,
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
              carStatusList: [],
            });
            if ((result.user == null && that.data.use == 1) || (result == null && that.data.use == 0)) {
              that.data.pageNum = 1;
              that.setData({
                carStatusList: [],
                carMargin: 0,
                endNum: result.end_num,
              });
            }
            else {
              if (that.data.use == 1)
                that.data.carStatusList = that.data.carStatusList.concat(result.user);
              if (that.data.use == 0)
                that.data.carStatusList = that.data.carStatusList.concat(result);

              that.setData({
                carStatusList: that.data.carStatusList,
                carMargin: result.size,
                endNum: result.end_num,
              });
            }

          }
        }
      });
    }

	},
  

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
		

  },

  getMoreCarStatus:function(){
		var that = this;
		that.data.pageNum = that.data.pageNum + 1;

		var url;
		if (that.data.use == 1) {
			url = config.PytheRestfulServerURL + '/count/car/condition';
		}
		if (that.data.use == 0) {
			url = config.PytheRestfulServerURL + '/select/car/counter';
		}
    
		wx.request({
			url: url,
			data: {
				level: that.data.level,
				pageNum: that.data.pageNum,
				pageSize: 10,
			},
			method: 'GET',
			success: function (res) {
				if (res.data.status == 200) {
					var result = res.data.data;
				

					if(result.user == null || result == null){
						that.data.pageNum = that.data.pageNum -1;
					}
					else{

						if(that.data.use == 1)
							that.data.carStatusList = that.data.carStatusList.concat(result.user);
						if (that.data.use == 0)
							that.data.carStatusList = that.data.carStatusList.concat(result);
						that.setData({
							carStatusList: that.data.carStatusList,
							carMargin: result.size,
							endNum: result.end_num,
						});
					}
					
				}
			}
		});
	},
  getMorePowerStatus: function () {
    var that = this;
    that.data.pageNum = that.data.pageNum + 1;
    var url = config.PytheRestfulServerURL + '/select/car/power';
    wx.request({
      url: url,
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
            that.data.powerStatusList = that.data.powerStatusList.concat(result);

            that.setData({
              powerStatusList: that.data.powerStatusList,
            });
          }

        }
      }
    });
  },
  getMoreOnlineStatus: function () {
    var that = this;
    that.data.pageNum = that.data.pageNum + 1;
    url = config.PytheRestfulServerURL + '/select/device/online/level';
    wx.request({
      url: url,
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
            onlineStatusList: [],
          });
          if (result == null) {
            that.data.pageNum = that.data.pageNum - 1;
          }
          else {
            that.data.onlineStatusList = that.data.onlineStatusList.concat(result);

            that.setData({
              onlineStatusList: that.data.onlineStatusList,
            });
          }

        }
      }
    });
  },
  getMoreDistances: function () {
    var that = this;
    that.data.pageNum = that.data.pageNum + 1;
    var url = config.PytheRestfulServerURL + '/select/distance/level';
    wx.request({
      url: url,
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
            that.data.distanceList = that.data.distanceList.concat(result);

            that.setData({
              distanceList: that.data.distanceList,
            });
          }

        }
      }
    });
  },
  getMoreCarsQrld: function () {
    var that = this;
    that.data.pageNum = that.data.pageNum + 1;
    var url = config.PytheRestfulServerURL + '/select/netlocks';
    wx.request({
      url: url,
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
            that.data.qrids = that.data.qrids.concat(result);

            that.setData({
              qrids: that.data.qrids,
            });
          }

        }
      }
    });
  },

  unlock:function(e){
    console.log("网络开锁。。。。。。。。。。。")
    console.log(e.currentTarget.dataset.qrid)
    var mid = wx.getStorageSync(user.ManagerID)
    var url = config.PytheRestfulServerURL + '/manage/web/unlock';
    console.log(mid)
    wx.request({
      url: url,
      data: {
        managerId: wx.getStorageSync(user.ManagerID),
        carId: e.currentTarget.dataset.qrid,
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: '',
            image: '',
            duration: 1500,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          });
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            confirmText: '我知道了',

          });
        }

      }
      
    });

  }
})