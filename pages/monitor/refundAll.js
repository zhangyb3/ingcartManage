//logs.js
var util = require('../../utils/util.js');
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");
var operation = require("../../utils/operation.js");

const date = new Date()
const years = []
const months = []
const days = []
const hours = []
const minutes = []

for (let i = date.getFullYear(); i <= date.getFullYear() + 1; i++) {
	years.push(i)
}

for (let i = 1; i <= 12; i++) {
	if (i < 10) {
		i = '0' + i;
	}
	months.push(i)
}

for (let i = 1; i <= 31; i++) {
	if (i < 10) {
		i = '0' + i;
	}
	days.push(i)
}

for (let i = 0; i <= 23; i++) {
	if (i < 10) {
		i = '0' + i;
	}
	hours.push(i)
}

for (let i = 0; i <= 59; i++) {
	if (i < 10) {
		i = '0' + i;
	}
	minutes.push(i)
}
Page({
	data: {
		date: null,
		winHeight: 0,
		display: 'none',  //是否显示弹窗
		checkTel: 'none', //是否显示手机号码格式
		checkResult: '',
		years: years,
		_year: date.getFullYear(),
		year: date.getFullYear(),
		months: months,
		_month: date.getMonth() + 1,
		month: date.getMonth() + 1,
		days: days,
		_day: date.getDate(),
		day: date.getDate(),
		hours: hours,
		_hour: date.getHours(),
		hour: date.getHours(),
		minutes: minutes,
		_minute: date.getMinutes(),
		minute: date.getMinutes(),
		value: [0, 0, 0, 0, 0],
		chargingStartTime: '尚未查询',
		operatorLevel:1,

		password: null,
		focusOnPasswordPop: false,//控制input 聚焦
		passwordFlag: false,//密码输入遮罩
		cancelIntervalVar: null,
		deletePermission: false,

		refundRecords: [],
		pageNum: 1,
		pageSize: 10,
	},

	onLoad: function (parameters) {

		var that = this;
		that.data.operatorLevel = parameters.operatorLevel;
		that.data.refundType = parameters.type;

		wx.getSystemInfo({
			success: function (res) {
				var date = new Date();
				that.setData({
					winHeight: res.windowHeight,
					date: date,
					_year: date.getFullYear(),
					year: date.getFullYear(),
					months: months,
					_month: date.getMonth() + 1,
					month: date.getMonth() + 1,
					days: days,
					_day: date.getDate(),
					day: date.getDate(),
					hours: hours,
					_hour: date.getHours(),
					hour: date.getHours(),
					minutes: minutes,
					_minute: date.getMinutes(),
					minute: date.getMinutes(),
					value: [0, date.getMonth(), date.getDate() - 1, date.getHours(), date.getMinutes()],
				})
			}
		});

		that.setData({
			refundType: parameters.type,
		});

	},

	onShow: function(){
			var that = this;
			var refundHint = '';
			var barTitle = '';
			switch(that.data.refundType){
				case 'no_distance':
					barTitle = '全额退款（无行程）';
					refundHint = '必须当天无行程才能退款';
					break;
				case 'distance':
					barTitle = '全额退款（有行程未结束）';
					refundHint = '必须当天有行程才能退款';
					break;
				case 'unconditional':
					barTitle = '全额退款（无条件）';
					refundHint = '用于处理客户纠纷问题（有行程且已结束退款才能生效）';
					break;
				case 'no_distance_batch':
					barTitle = '批量退款（当天无行程）';
					refundHint = '必须当天无行程才能退款';
					wx.request({
						url: config.PytheRestfulServerURL + '/select/not/pay/',
						data: {

						},
						method: 'GET',
						success: function(res) {
							if(res.data.status == 200)
							{
								var result = res.data.data;
								for(var count = 0; count < result.length; count++)
								{
									result[count].time = util.formatDate(result[count].time);
								}

								that.setData({
									customers: result,
								});
							}
							else
							{
								wx.showModal({
									title: '提示',
									content: res.data.msg,
									showCancel: false,
									confirmText: '我知道了',
									success: function(res) {
										if(res.confirm)
										{
											wx.navigateBack({
												delta: 1,
											})
										}
									},
									fail: function(res) {},
									complete: function(res) {},
								})
							}
						},
						fail: function(res) {},
						complete: function(res) {},
					});
					break;
				case 'queryRefund':
					barTitle = '查询自动全额退款用户';
					refundHint = '';
					wx.request({
						url: config.PytheRestfulServerURL + '/select/refund/not/pay/',
						data: {

						},
						method: 'GET',
						success: function (res) {
							if (res.data.status == 200) {
								var result = res.data.data;
								// for (var count = 0; count < result.length; count++) {
								// 	result[count].time = util.formatDate(result[count].time);
								// }

								that.setData({
									refundRecords: result,
								});
							}
							else {
								wx.showModal({
									title: '提示',
									content: res.data.msg,
									showCancel: false,
									confirmText: '我知道了',
									success: function (res) {
										if (res.confirm) {
											wx.navigateBack({
												delta: 1,
											})
										}
									},
									fail: function (res) { },
									complete: function (res) { },
								})
							}
						},
						fail: function (res) { },
						complete: function (res) { },
					});
					break;

				case 'faultToGift':
					barTitle = '换车送券';
					refundHint = '优惠券仅限于当天使用';
					break;
			}
			wx.setNavigationBarTitle({
				title: barTitle,
			});
			that.setData({
				refundHint: refundHint,
				refundType: that.data.refundType,
			});
			
	},

	// picker选择时间
	changeTime: function (e) {
		const val = e.detail.value;
		console.log(e.detail);
		this.setData({
			year: this.data.years[val[0]],
			month: this.data.months[val[1]],
			day: this.data.days[val[2]],
			hour: this.data.hours[val[3]],
			minute: this.data.minutes[val[4]]
		})
	},

	//  点击停止时间的框
	getTime: function () {
		var that = this;
		that.setData({
			display: 'block'
		})
	},

	//  取消按钮
	close: function () {
		var that = this;
		that.setData({
			display: 'none'
		})
	},

	// 确定按钮
	sure: function () {
		var that = this;
		that.setData({
			display: 'none',
			_year: this.data.year,
			_month: this.data.month,
			_day: this.data.day,
			_hour: this.data.hour,
			_minute: this.data.minute
		})
	},

	//  输入失去焦点时，检查用户输入的手机号格式是否正确
	checkTelRight: function (e) {
		var inputTel = e.detail.value;
		var regExp = /0?(13|14|15|17|18)[0-9]{9}/;
		if (!regExp.test(inputTel) || inputTel.length != 7) {
			this.setData({
				checkTel: 'block'
			})
		} else {
			this.setData({
				checkTel: 'none'
			})
		}

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
					that.data.customerPhoneNum = parameters.id;
					wx.request({
						url: config.PytheRestfulServerURL + '/select/cr',
						data: {
							phoneNum: that.data.customerPhoneNum,
							// date: that.data._year + '-' + that.data._month + '-' + that.data._day + ' ' + that.data._hour + ':' + that.data._minute + ':00',
						},
						method: 'POST',
						success: function (res) {
							if (res.data.status == 200) {
								that.setData({
									chargingStartTime: (res.data.data.start_time),
								});
							}
							if (res.data.status == 400) {
								// wx.showModal({
								// 	title: '提示',
								// 	content: res.data.msg,
								// 	showCancel: false,
								// 	confirmText: '我知道了',
								// 	confirmColor: '',
								// 	success: function (res) { },
								// 	fail: function (res) { },
								// 	complete: function (res) { },
								// })
								that.setData({
									// checkResult: res.data.msg
								});
							}
						},
						fail: function (res) { },
						complete: function (res) { },
					});
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

	getCustomerPhoneNum: function (e) {
		console.log(e.detail.value);
		this.data.customerPhoneNum = e.detail.value;
		var regExp = /0?(13|14|15|18)[0-9]{9}/;
		// if (!regExp.test(this.data.customerPhoneNum)) {
		// if (this.data.customerPhoneNum.length == 7 || this.data.customerPhoneNum.length == 11) 
		{
			this.setData({
				checkTel: 'none'
			});

			var that = this;
			//格式正确，查询该号码用户情况
			wx.request({
				url: config.PytheRestfulServerURL + '/select/cr',
				data: {
					phoneNum: that.data.customerPhoneNum,
					// date: that.data._year + '-' + that.data._month + '-' + that.data._day + ' ' + that.data._hour + ':' + that.data._minute + ':00',
				},
				method: 'POST',
				success: function (res) {
					if (res.data.status == 200) {
						that.setData({
							chargingStartTime: (res.data.data.start_time),
						});
					}
					if (res.data.status == 400) {
						// wx.showModal({
						// 	title: '提示',
						// 	content: res.data.msg,
						// 	showCancel: false,
						// 	confirmText: '我知道了',
						// 	confirmColor: '',
						// 	success: function (res) { },
						// 	fail: function (res) { },
						// 	complete: function (res) { },
						// })
						that.setData({
							// checkResult: res.data.msg
						});
					}
				},
				fail: function (res) { },
				complete: function (res) { },
			});
		} 
		// else 
		// {
		// 	this.setData({
		// 		checkTel: 'block'
		// 	});


		// }
	},

	managerRefundAll: function (e) {
		var that = this;

		var url = '';
		if(that.data.refundType == 'faultToGift')
		{
			url = config.PytheRestfulServerURL + '/transfer/car/';
			wx.request({

				// url: config.PytheRestfulServerURL + '/customer/auto/refund/',
				url: url,
				data: {
					phoneNum: that.data.customerPhoneNum,
					managerId: wx.getStorageSync(user.ManagerID),
					// date: that.data._year + '-' + that.data._month + '-' + that.data._day + ' ' + that.data._hour + ':' + that.data._minute + ':00',
				},
				method: 'POST',
				success: function (res) {
					// if (res.data.status == 200) 
					// {
					// 	wx.showToast({
					// 		title: res.data.msg,
					// 		icon: '',
					// 		image: '',
					// 		duration: 3000,
					// 		mask: true,
					// 		success: function (res) { },
					// 		fail: function (res) { },
					// 		complete: function (res) { },
					// 	})
					// }
					// if (res.data.status == 400) 
					{
						wx.showModal({
							title: '提示',
							content: res.data.msg,
							// showCancel: false,
							confirmText: '我知道了',
							confirmColor: '',
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
		else if (that.data.refundType == 'no_distance_batch'){
			wx.showModal({
				title: '提示',
				content: '确定要退款吗？',
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

								if (that.data.deletePermission == true) {
									clearInterval(cancelIntervalVar);

									wx.request({
										url: config.PytheRestfulServerURL + '/refund/not/pay/',
										data: {
											password: that.data.password,
											managerId: wx.getStorageSync(user.ManagerID),
											
										},
										method: 'POST',
										success: function(res) {
											that.closePassword();
											wx.showModal({
												title: '提示',
												content: res.data.msg,
												showCancel: false,
												confirmText: '我知道了',
												success: function (res) { },
												fail: function (res) { },
												complete: function (res) { },
											})

											that.onShow();
										},
										fail: function(res) {},
										complete: function(res) {},
									})

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
		else
		{
			if (that.data.refundType == 'no_distance') {
				url = config.PytheRestfulServerURL + '/manage/auto/refund/';
			}
			if(that.data.refundType == 'distance')
			{
				url = config.PytheRestfulServerURL + '/manage/trip/refund/';
			}
			if (that.data.refundType == 'unconditional') {
				url = config.PytheRestfulServerURL + '/manage/unconditional/refund/';
			}

			wx.request({

				// url: config.PytheRestfulServerURL + '/customer/auto/refund/',
				url: url,
				data: {
					phoneNum: that.data.customerPhoneNum,
					managerId: wx.getStorageSync(user.ManagerID),
					// date: that.data._year + '-' + that.data._month + '-' + that.data._day + ' ' + that.data._hour + ':' + that.data._minute + ':00',
				},
				method: 'POST',
				success: function (res) {
					if (res.data.status == 200) {
						wx.showToast({
							title: res.data.msg,
							icon: '',
							image: '',
							duration: 3000,
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
							// showCancel: false,
							confirmText: '我知道了',
							confirmColor: '',
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
		
	},

	getPassword: function (e) {//获取钱包密码
		this.setData({
			password: e.detail.value
		});
		if (this.data.password.length == 6) {//密码长度6位时，自动验证钱包支付结果
			this.data.deletePermission = true;
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
			deletePermission: false,
			password: null,
		})
	},

	getMoreRefundRecords:function(e){
		var that = this;
		that.data.pageNum = that.data.pageNum + 1;
		wx.request({
			url: config.PytheRestfulServerURL + '/select/refund/not/pay/',
			data: {
				pageNum: that.data.pageNum,
				pageSize: that.data.pageSize
			},
			method: 'GET',
			success: function (res) {
				if (res.data.status == 200) {
					var result = res.data.data;


					if (result == null) {
						that.data.pageNum = that.data.pageNum - 1;
					}
					else
					{
						that.data.refundRecords = that.data.refundRecords.concat(result);
						that.setData({
							refundRecords: refundRecords,

						});
					}
					
				}
				else {
					wx.showModal({
						title: '提示',
						content: res.data.msg,
						showCancel: false,
						confirmText: '我知道了',
						success: function (res) {
							if (res.confirm) {
								wx.navigateBack({
									delta: 1,
								})
							}
						},
						fail: function (res) { },
						complete: function (res) { },
					})
				}
			},
			fail: function (res) { },
			complete: function (res) { },
		});
	},

})
