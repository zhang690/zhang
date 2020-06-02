// initial state
// shape: [{ id, quantity }]

import mRouter from '@/common/router.js'
import mRoutesConfig from '@/config/routes.config.js'
import musicPlayer from './musicPlayer.js'
import store from "../index.js"
const state = {
	token: uni.getStorageSync('token') || 1,
	userInfo: uni.getStorageSync('userInfo') || "",
	hasLogin: uni.getStorageSync('hasLogin') || false,
	uuid: uni.getStorageSync('uuid') || ''
}

// getters
const getters = {

}

// mutations
const mutations = {
	Save_Token(state, token) { //保存toke
		uni.setStorage({
			key: 'token',
			data: token
		});
		state.token = token
	},
	Save_Uuid(state, uuid) { //保存uuid
		uni.setStorage({
			key: 'uuid',
			data: uuid
		});
		state.uuid = uuid
	},
	SaveHasLogin(state, hasLogin) { //保存用户登录
		uni.setStorage({
			key: 'hasLogin',
			data: hasLogin
		});
		state.hasLogin = hasLogin
	},
	Save_UserInfo(state, userInfo) { //保存用户信息
		uni.setStorage({
			key: 'userInfo',
			data: userInfo
		});
		state.userInfo = userInfo
	},

}

// actions
const actions = {
	saveUuid({
		commit
	}, uuid) {
		commit("Save_Uuid", uuid)
	},
	saveToken({
		commit
	}, token) {
		commit("Save_Token", token)
	},
	saveHasLogin({
		commit
	}, hasLogin) {
		commit("SaveHasLogin", hasLogin)
	},
	saveUserInfo({
		commit
	}, userInfo) {
		console.log(userInfo)
		commit("Save_UserInfo", userInfo)
	},

	reLogin({
		commit
	}, info) {
		commit("Save_Token", "");
		commit("SaveHasLogin", false);
		store.dispatch('changePlayState', false);
		store.dispatch('changeInit_State');
		mRouter.reLaunch({
			route: mRoutesConfig.loginIndex
		});
		return false;
	},


}

export default {
	state,
	getters,
	actions,
	mutations
}
