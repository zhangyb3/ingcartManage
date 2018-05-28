//logs.js
var util = require('../../utils/util.js');
var config = require("../../utils/config.js");
var operation = require("../../utils/operation.js");
var user = require("../../utils/user.js");

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
  if(i<10){
    i='0'+i;
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
		date:null,
    winHeight:0,
    display:'none',  //是否显示弹窗
    checkTel:'none', //是否显示手机号码格式
		checkResult:'',
    years: years,
    _year: date.getFullYear(),
    year: date.getFullYear(),
    months: months,
    _month: date.getMonth() + 1,
    month: date.getMonth()+1,
    days: days,
    _day: date.getDate(),
    day: date.getDate(),
    hours:hours,
    _hour: date.getHours(),
    hour: date.getHours(),
    minutes: minutes,
    _minute: date.getMinutes(),
    minute: date.getMinutes(),
    value: [0,0,0,0,0],
		chargingStartTime: '尚未查询',
		qr: '尚未查询',
		phone: '尚未查询',
  },
  onLoad: function () {
    var that=this;
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
					 value: [0, date.getMonth(), date.getDate()-1, date.getHours(), date.getMinutes()],
         })        
      }
    })
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
  getTime:function(){
     var that=this;
     that.setData({
       display:'block'
     })
  },

//  取消按钮
  close:function(){
    var that = this;
    that.setData({
      display: 'none'
    })
  },
  
  // 确定按钮
  sure: function () {
    var that = this;
    that.setData({
      display: 'none' ,
      _year: this.data.year,
      _month: this.data.month,
      _day: this.data.day,
      _hour: this.data.hour,
      _minute: this.data.minute      
    })
  },
 
//  输入失去焦点时，检查用户输入的手机号格式是否正确
  checkTelRight:function(e){
    var inputTel=e.detail.value;
    var regExp=/0?(13|14|15|17|18)[0-9]{9}/;
    if (!regExp.test(inputTel) || inputTel.length != 7){
      this.setData({
        checkTel: 'block'
      })
    }else{
      this.setData({
        checkTel: 'none'
      })
    }
     
  },

	getCustomerPhoneNum:function(e){
		console.log(e.detail.value);
		this.data.customerPhoneNum = e.detail.value;
		var regExp = /0?(13|14|15|18)[0-9]{9}/;
		// if (!regExp.test(this.data.customerPhoneNum)) {
		// if (this.data.customerPhoneNum.length == 7 || this.data.customerPhoneNum.length == 11) 
		if (this.data.customerPhoneNum.length >=7) 
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
						var result = res.data.data;
						that.setData({
							chargingStartTime: result.start_time,
							qr: result.qr_id,
							phone: result.phone_num,
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
		} else {
			this.setData({
				checkTel: 'block'
			});
			

		}
	},

	managerStopFee:function(e){
		var that = this;
		wx.request({
			url: config.PytheRestfulServerURL + '/manage/urgent/refund/',//小程序版退费
			// url: config.PytheRestfulServerURL + '/manage/urgent/lock/',//app版
			data: {
				phoneNum: that.data.customerPhoneNum,
				date: that.data._year+'-'+that.data._month+'-'+that.data._day+' '+that.data._hour+':'+that.data._minute+':00',
				managerId: wx.getStorageSync(user.ManagerID),
			},
			method: 'POST',
			success: function (res) {
				if(res.data.status == 200)
				{
					wx.showToast({
						title: res.data.msg,
						icon: '',
						image: '',
						duration: 5000,
						mask: true,
						success: function(res) {},
						fail: function(res) {},
						complete: function(res) {},
					})
				}
				if(res.data.status == 400)
				{
					wx.showModal({
						title: '提示',
						content: res.data.msg,
						showCancel: false,
						confirmText: '我知道了',
						confirmColor: '',
						success: function(res) {},
						fail: function(res) {},
						complete: function(res) {},
					})
				}
			},
			fail: function (res) { },
			complete: function (res) { },
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
								var result = res.data.data;
								that.setData({
									chargingStartTime: result.start_time,
									qr: result.qr_id,
									phone: result.phone_num,
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


})
