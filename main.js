import Vue from 'vue'
import App from './App'
import cuCustom from './colorui/components/cu-custom.vue'
import musicSphere from './components/common/musicSphere.vue'
import animationView from '@/components/common/progress_canvas.vue';
import store from "./store/index.js"
import * as $apis from './apis/index.js'
import $mConfig from "./config/index.config.js"
import $mRoutesConfig from './config/routes.config.js'
import $mRouter from './common/router.js'
import $mUtils from './common/utils.js'
import $mAudio from './common/audio.js'

Vue.prototype.$mRouter = $mRouter;
Vue.prototype.$mRoutesConfig = $mRoutesConfig;
Vue.prototype.$mAudio = new $mAudio();
Vue.prototype.$iconURL = $mConfig.iconURL;
Vue.prototype.$store = store
Vue.prototype.$mConfig = $mConfig
Vue.prototype.$api = $apis
Vue.prototype.$promise = (time = 0, tes = null) => {
	clearTimeout(tes)
	let promise = new Promise((resolve, reject) => {
		tes = setTimeout(() => {
			resolve()
			clearTimeout(tes)
		}, time)
	})
	return promise
}
Vue.prototype.$calcTimer = (timer) => {
	if (timer === 0 || typeof timer !== 'number') {
		return '00:00';
	}
	let mm = Math.floor(timer / 60);
	let ss = Math.floor(timer % 60);
	if (mm < 10) {
		mm = '0' + mm;
	}
	if (ss < 10) {
		ss = '0' + ss;
	}
	return mm + ':' + ss;
}


uni.getSystemInfo({
	success: res => {
		Vue.prototype.$screenWidth = res.screenWidth;
	}
});
Vue.prototype.$isIos = false;
// #ifdef APP-PLUS
// 获取系统的消息
switch (uni.getSystemInfoSync().platform) {
	case 'android':
		console.log('运行Android上');
		break;
	case 'ios':
		console.log('运行iOS上');
		Vue.prototype.$isIos = true;
		break;
	default:
		console.log('运行在开发者工具上');
		Vue.prototype.$isIos = false;
		break;
}
// #endif

Vue.component('cu-custom', cuCustom)
Vue.component('musicSphere', musicSphere)
Vue.component('animationView', animationView)

Vue.config.productionTip = false

$mRouter.beforeEach((navType, to, from) => {
	let tems = null;
	if (to.route === undefined) throw ("路由钩子函数中没有找到to.route对象，路由信息:" + JSON.stringify(to));
	if (to.route.path === $mRoutesConfig.loginIndex.path && store.state.user.hasLogin) {
		uni.redirectTo({
			url: $mUtils.objParseUrlAndParam($mRoutesConfig.loginIndex.path, to.query)
		})
		return;
	}

	// 过滤需要权限的页面
	if (to.route.requiresAuth) {
		console.log(store.state.user.hasLogin)
		if (store.state.user.hasLogin) {
			// 已经登录
			console.log('已经登录')
			uni[navType]({
				url: $mUtils.objParseUrlAndParam(to.route.path, to.query)
			})
		} else {
			console.log('未登录')
			// 登录成功后的重定向地址和参数
			let query = {
				redirectUrl: to.route.path,
				...to.query
			}


			
			// #ifdef APP-PLUS
			plus.nativeUI.showWaiting("您暂未登录，即将跳往登录...");
			// #endif
			// #ifndef APP-PLUS
			uni.showToast({
				title: '您暂未登录，即将跳往登录',
				icon: 'loading',
				duration: 2000
			});
			// #endif
 
			tems = setTimeout(function() {
				// #ifdef APP-PLUS
				plus.nativeUI.closeWaiting();
				// #endif
				
				// #ifndef APP-PLUS
					uni.hideLoading()
				// #endif
				if (store.state.forcedLogin) {
					uni.redirectTo({
						url: $mUtils.objParseUrlAndParam($mRoutesConfig.loginIndex.path, query)
					})
				} else {
					store.dispatch('reLogin','')
					// uni.navigateTo({
					// 	url: $mUtils.objParseUrlAndParam($mRoutesConfig.loginIndex.path, query)
					// })
					
				}
				clearTimeout(tems)
			}, 2000);
			// 没有登录 是否强制登录?

		}
	} else {
		// console.log(to, from)
		uni[navType]({
			url: $mUtils.objParseUrlAndParam(to.route.path, to.query)
		})
	}
})

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
