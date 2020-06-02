// initial state
// shape: [{ id, quantity }]
import Vue from "vue"
// 定义初始状态
const INIT_STATE = {
	index: 1,
	playState: false, //播放状态
	PlayIconState: false,
	sphereExist: false, //是否存在播放球
	sphereShow: false, //音频展开默认隐藏
	ifSphereShow: 1,
	musicIndex: 0,
	musicList: [],
	musicItem: "",
	overTimer: "00:00", //结束时间
	time: "00:00", //播放时间
	duration: 100, //总进度
	currentTime: 0, //当前进度条进度
	maxLeft: 300,
	schedule: 0, //播放求进度
	courseList: "",
};

const state = {
	index: 1,
	playState: false, //播放状态
	PlayIconState: false,
	sphereExist: false, //是否存在播放球
	sphereShow: uni.getStorageSync('sphereShow') || false, //音频展开默认隐藏
	ifSphereShow: uni.getStorageSync('ifSphereShow') || 1,
	musicIndex: uni.getStorageSync('musicIndex') || 0,
	musicList: uni.getStorageSync('musicList') || [],
	musicItem: uni.getStorageSync('musicItem') || "",
	overTimer: "00:00", //结束时间
	time: "00:00", //播放时间
	duration: 100, //总进度
	currentTime: 0, //当前进度条进度
	maxLeft: 300,
	schedule: uni.getStorageSync('schedule') || 0, //播放求进度
	courseList: uni.getStorageSync('courseList') || "",
	// backgroundAudio:uni.getBackgroundAudioManager()
}

// getters
const getters = {

}


// mutations
const mutations = {
	// save_sys_view(state, sys_view) {
	// 	state.sys_view = sys_view
	// 	uni.setStorage({
	// 		key: 'sys_view',
	// 		data: sys_view
	// 	});
	// },
	Init_State(state, states) {
		state = Object.assign(state,INIT_STATE)
	},
	ChangeSchedule(state, schedule) { //播放求进度
		uni.setStorage({
			key: 'schedule',
			data: schedule
		});
		state.schedule = schedule
	},
	ChangeIfSphereShow(state, ifSphereShow) { // 音频展开点击
		uni.setStorage({
			key: 'ifSphereShow',
			data: ifSphereShow
		});
		state.ifSphereShow = ifSphereShow
	},
	ChangeMaxLeft(state, maxLeft) { // 进度条宽度
		uni.setStorage({
			key: 'maxLeft',
			data: maxLeft
		});
		state.maxLeft = maxLeft
	},
	ChangeMusicIndex(state, musicIndex) { // 音频播放索引
		uni.setStorage({
			key: 'musicIndex',
			data: musicIndex
		});
		state.musicIndex = musicIndex
	},
	ChangeMusicList(state, musicList) { // 变更播放列表
		uni.setStorage({
			key: 'musicList',
			data: musicList
		});
		state.musicList = musicList
	},
	ChangeMusicItem(state, musicItem) { // 变更播放音频对象
		uni.setStorage({
			key: 'musicItem',
			data: musicItem
		});
		state.musicItem = musicItem
	},
	ChangeSphereShow(state, sphereShow) { // 变更状态
		uni.setStorage({
			key: 'sphereShow',
			data: sphereShow
		});
		state.sphereShow = sphereShow
	},
	ChangeSphereExist(state, sphereExist) { // 变更状态
		state.sphereExist = sphereExist
	},
	ChangeTime(state, time) { // 变更播放时间
		state.time = time
	},
	ChangeMusicName(state, musicName) { // 变更音乐名字
		state.musicName = musicName
	},
	async ChangePlayState(state, playState) { // 变更播放状态
		// console.log(Vue.prototype.$backgroundAudioData, playState)
		if (playState) {
			state.sphereExist = playState
			Vue.prototype.$mAudio.play();
		} else {
			Vue.prototype.$mAudio.userViewAudioLog()
			Vue.prototype.$mAudio.pause();
		}
		state.playState = playState
	},
	ChangeOverTimer(state, overTimer) { // 变更播放总时间
		state.overTimer = overTimer
	},
	ChangeDuration(state, duration) { // 变更播放总进度
		state.duration = duration
	},
	ChangeCurrentTime(state, currentTime) { // 变更播放当前时间
		state.currentTime = currentTime
	},
	ChangeCourseList(state, courseList) { // 变更音频列表
		uni.setStorage({
			key: 'courseList',
			data: courseList
		});
		state.courseList = courseList
	},

}

// actions

const actions = {
	changeInit_State({
		commit
	}, states) {
		commit("Init_State", states)
	},
	changeSchedule({
		commit
	}, schedule) {
		commit("ChangeSchedule", schedule)
	},
	changeIfSphereShow({
		commit
	}, ifSphereShow) {
		commit("ChangeIfSphereShow", ifSphereShow)
	},
	changeCourseList({
		commit
	}, courseList) {
		commit("ChangeCourseList", courseList)
	},
	changeMaxLeft({
		commit
	}, maxLeft) {
		commit("ChangeMaxLeft", maxLeft)
	},
	changeMusicIndex({
		commit
	}, musicIndex) {
		commit("ChangeMusicIndex", musicIndex)
	},
	changeMusicList({
		commit
	}, musicList) {
		commit("ChangeMusicList", musicList)
	},
	changeSphereShow({
		commit
	}, sphereShow) {
		commit("ChangeSphereShow", sphereShow)
	},
	changeSphereExist({
		commit
	}, sphereExist) {
		commit("ChangeSphereExist", sphereExist)
	},
	changeTime({
		commit
	}, time) {
		commit("ChangeTime", time)
	},
	changeMusicName({
		commit
	}, musicName) {
		commit("ChangeMusicName", musicName)
	},
	changePlayState({
		commit
	}, playState) {
		commit("ChangePlayState", playState)
	},
	changeOverTimer({
		commit
	}, overTimer) {
		commit("ChangeOverTimer", overTimer)
	},
	changeDuration({
		commit
	}, duration) {
		commit("ChangeDuration", duration)
	},
	changeCurrentTime({
		commit
	}, currentTime) {
		commit("ChangeCurrentTime", currentTime)
	},
	changeMusicItem({
		commit
	}, musicItem) {
		commit("ChangeMusicItem", musicItem)
	},



}

export default {
	state,
	getters,
	actions,
	mutations
}
