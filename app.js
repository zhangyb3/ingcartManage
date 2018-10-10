//app.js



var app = getApp();

var IngcartSdk = require('/lib/ingcart-lock-manager');
// var options = {
// 	appkey: '56a0a88c4407a3cd028ac2fe',
// 	token: 'EgKIFBJJuoh8KpBaiEwvXQBQ93Rxlk3NAIAGybx/0cWAmQPrC2HKv4tLWVzB4q4Y8HGCTnG0I/IkuVaM5tK1XA=='
// };
App({
  data: {
    userInfo: null,
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    try {
      wx.clearStorageSync()
    } catch (e) {
      // Do something when catch error
    }

    wx.getSystemInfo({
      success: (res) => {
				wx.setStorageSync('windowWidth', res.windowWidth);
        wx.setStorageSync('windowHeight', res.windowHeight);
				wx.setStorageSync('platform', res.platform);
				console.log('platform',res.platform);
      }
    });

    wx.setStorageSync('alreadyRegister', 'no');
    // wx.setStorageSync('logoutSystem', 'yes');


    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        wx.setStorageSync('Latitude', res.latitude);
        wx.setStorageSync('Longitude', res.longitude);
      }
    });

		// this.ingcartLockManager = new IngcartSdk.IngcartLockManager(options);

    

  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {

          wx.getSetting({
            success(res) {
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                wx.getUserInfo({
                  success: function (res) {
                    that.globalData.userInfo = res.userInfo
                    that.globalData.iv = res.iv
                    that.globalData.encryptedData = res.encryptedData
                    console.log(res.userInfo);
                    console.log(res.encryptedData);
                    console.log(res.iv);
                    typeof cb == "function" && cb(that.globalData.userInfo)

                  }
                })
              } else {
                wx.navigateTo({
                  url: '/pages/register/autho',
                })
              }
            }, fail(res) {
              wx.navigateTo({
                url: '/pages/register/autho',
              })
            }
          })



        }
      })
    }
  },
	clockCount: 0,
	ingcartLockManager: null,
  
  globalData: {

    userInfo: null,
    loginCode: null,
    encryptedData: null,
    iv: null,
   
    defaultPageSize: 10,
  }
})