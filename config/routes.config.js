/* 
 * 路由表对象：
 * 该文件挂载在Vue原型中 $mRoutesConfig
 * 作用：调用$mRouter对象的方法 传入以下对应的路由对象，详细见common目录下的router.js
 * 示例：this.$mRouter.push({route:this.$mRoutesConfig.main,query:{a:1}})
 * 注意：所有在pages目录下新建的页面都必须在"路由表"中进行声明，并且在框架的pages.json注册。
 * 
 * 配置参数项说明： 
 * name:可选配置 （路由名称）
 * path:必填配置 （路由地址）
 * requiresAuth:可选配置 （是否权限路由）
 */

export default {
	// 权限路由
	myOrder: {
		name: "我的订单",
		path: "/pages/mine/My_order/My_order",
		requiresAuth: false
	},
	accountSetting: {
		name: "账户设置",
		path: "/pages/mine/accountSetting/accountSetting",
		requiresAuth: true
	},
	myBalance: {
		name: "我的余额",
		path: "/pages/mine/My_balance/My_balance",
		requiresAuth: false
	},
	myLove:{
		name: "我的喜欢",
		path: "/pages/mine/myLove/myLove",
		requiresAuth: false
	},
	buy:{
		name: "购买课程",
		path: "/pages/mine/buy/buy",
		requiresAuth: false
	},
	// 非权限路由
	loginIndex: {
		name: "登录首页",
		path: "/pages/user/loginIndex"
	},
	loginRegister: {
		name: "登录注册",
		path: "/pages/user/loginRegister"
	},
	play: {
		name: "播放页",
		path: "/pages/play/play"
	},
	course: {
		name: "课程",
		path: "/pages/study/courseLearning/courseLearning"
	},
	ccApply: {
		name: "信用卡申请",
		path: "/pages/cc/ccApply"
	},
	about: {
		name: "关于我们",
		path: "/pages/mine/about/about"
	},
	Agreement: {
		name: "协议",
		path: "/pages/user/Agreement"
	},

}
