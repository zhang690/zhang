const CONFIG = {
	//开发环境配置

	//生产环境配置
	development: {
		loginTitleTxt: "轻听树下", // 登录页标题
		copyrightTxt: "轻听树下v1.0.0", // 版本信息
		assetsPath: "/static/images", // 静态资源路径
		iconURL: "https://file.qingtingshuxia.com/", //网络资源地址
		baseUrl: "http://192.168.1.198:9501",
		// baseUrl: "https://testqtsxapi.qingtingshuxia.com",
		// baseUrl: "https://qtsxapi.qingtingshuxia.com",
		// tokenKey: "WECHAT_TRADE", // 登录标识
		// testOpenId: "wx8418d828f0c04c5f", // 小程序测试openId
		forcedLogin: false, // touristMode游客模式下APP是否强制用户登录 场景：当用户进入登录页面后无法后退。
		touristMode: true, // APP是否开启游客模式， 游客模式true开启：APP打开后可以进入首页和无权限的页面，游客模式false关闭：APP打开后首先需要登录才能进入， 此时forcedLogin配置项失效。
	},

	// 线上
	production: {
		loginTitleTxt: "轻听树下", // 登录页标题
		copyrightTxt: "轻听树下v1.0.0", // 版本信息
		assetsPath: "/static/images", // 静态资源路径
		iconURL: "https://file.qingtingshuxia.com/", //网络资源地址
		// baseUrl: "http://192.168.1.198:9501",
		// baseUrl: "https://testqtsxapi.qingtingshuxia.com",
		baseUrl: "https://qtsxapi.qingtingshuxia.com",
		// tokenKey: "WECHAT_TRADE", // 登录标识
		// testOpenId: "wx8418d828f0c04c5f", // 小程序测试openId
		forcedLogin: false, // touristMode游客模式下APP是否强制用户登录 场景：当用户进入登录页面后无法后退。
		touristMode: true, // APP是否开启游客模式， 游客模式true开启：APP打开后可以进入首页和无权限的页面，游客模式false关闭：APP打开后首先需要登录才能进入， 此时forcedLogin配置项失效。
	}

}
export default CONFIG[process.env.NODE_ENV];
