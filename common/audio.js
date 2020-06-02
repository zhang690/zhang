import Vue from 'vue';
import store from "@/store/index.js"
const audio = class audio {
	constructor(songList, nowIndex, duration = 100,currentTime =0, temp = null, playState = 0, temps = null, update = null,num=0) {
		this.songList = songList;
		this.nowIndex = nowIndex;
		// #ifdef APP-PLUS
		this.bgAudioMannager = uni.getBackgroundAudioManager();
		// #endif
		// #ifdef H5
		this.bgAudioMannager = uni.createInnerAudioContext();
		// #endif
		this.currentTime = currentTime //当前播放时间
		this.duration = duration //当前音频时间
		this.playState = playState;
		this.num = num
	}
	bgAudioInnit() {
		let bgAudioMannager = this.bgAudioMannager;
		let that = this;
		bgAudioMannager.audio_name = this.songList[this.nowIndex].audio_name;
		bgAudioMannager.teacher_name = this.songList[this.nowIndex].teacher_name;
		bgAudioMannager.teacher_avatar = this.songList[this.nowIndex].teacher_avatar;
		bgAudioMannager.id = this.songList[this.nowIndex].id;
		bgAudioMannager.course_id = this.songList[this.nowIndex].course_id;
		bgAudioMannager.audio_time = this.songList[this.nowIndex].audio_time;
		bgAudioMannager.src = Vue.prototype.$iconURL + this.songList[this.nowIndex].audio_file;
		// store.state.musicPlayer.musicIndex = this.nowIndex;
		bgAudioMannager.onPlay((e) => { //播放
			// console.log(bgAudioMannager)
			this.playFunc()
			store.state.musicPlayer.sphereExist = true;

		})
		bgAudioMannager.onPause(() => { //暂停播放
			this.pauseFunc()
		})
		bgAudioMannager.onEnded(() => { //播放结束
			this.pause()
		})
		bgAudioMannager.onTimeUpdate((e) => { //音频播放中
			this.currentTime = Math.floor(bgAudioMannager.currentTime) <=0? 0: Math.floor(bgAudioMannager.currentTime);
			if (this.currentTime  == 1) {
				uni.hideLoading();
				this.duration = Math.floor(bgAudioMannager.duration);
				clearInterval(this.temp);
			}
			store.state.musicPlayer.currentTime = this.currentTime;
			store.state.musicPlayer.duration = this.duration;
		})
		bgAudioMannager.onStop(() => { //播放结束
			console.log("停止播放")
		})

		bgAudioMannager.onError((res) => { //报错
			console.log(res.errMsg);
			console.log(res.errCode);
			uni.showModal({
				title: res.errMsg,
				showCancel: true
			})
			this.error(res)
		});

		bgAudioMannager.onWaiting((e) => { //进入缓存等待
			// console.log('缓冲中', this.currentTime, store.state.musicPlayer.playState)
			if (this.currentTime == 0 && store.state.musicPlayer.playState) {
				clearInterval(that.temp)
				uni.showLoading({
					title: "缓冲中...",
					success() {
						that.temp = setInterval(() => {
								that.num +=1;
								console.log(that.bgAudioMannager.src)
								if(that.bgAudioMannager.src){
									// that.bgAudioMannager.play();
									if(that.num >=2){
										that.constraintPlay(1)
										that.num = 0;
										clearInterval(that.temp)
									}
									that.play()
									// uni.hideLoading()
									// clearInterval(that.temp)
									if(that.currentTime >= 1){
										uni.hideLoading()
										clearInterval(that.temp)
									}
									return;
								}else{
									that.play()
								}
						}, 1000)
					}
				})
			} else {
				if(that.currentTime >= 1){
					clearInterval(that.temp)
					return;
				}
				// that.constraintPlay()
			}

		})

		bgAudioMannager.onCanplay((e) => { //进入可播放
			// console.log('进入可播放', this.currentTime <= 0, store.state.musicPlayer.playState)
			this.duration = Math.floor(bgAudioMannager.duration)
			store.state.musicPlayer.duration = this.duration
			if (this.currentTime <= 0 && store.state.musicPlayer.playState) {
				this.play()
			}
		})

		// #ifdef APP-PLUS
		bgAudioMannager.onPrev(() => { //上一曲
			this.last()
			store.state.musicPlayer.playState = true;
			this.play()
		})
		bgAudioMannager.onNext(() => { //下一曲
			this.next()
			store.state.musicPlayer.playState = true;
			this.play()
		})
		// #endif

	}
	error(e) { //报错
		console.log(e)
		this.playState = 0
	}
	 play() { //播放
		// console.log(this.bgAudioMannager.src, 233)
		if (this.bgAudioMannager.src == undefined) {
			this.bgAudioInnit()
		}
		 this.bgAudioMannager.play();
		store.state.musicPlayer.sphereExist = true;
	}
	constraintPlay(v){ //强制播放
		this.seek(v)
		store.state.musicPlayer.sphereExist = true;
		this.bgAudioMannager.play();
	}
	pause() { //暂停
		this.bgAudioMannager.pause()
		store.state.musicPlayer.playState = false;
	}
	seek(s) { //跳指定时间
		this.bgAudioMannager.seek(s)
	}
	playFunc() {
		store.state.musicPlayer.playState = true;
	}
	pauseFunc() {
		store.state.musicPlayer.playState = false;
	}
	last() { //上一曲
		if (this.nowIndex < 1) {
			this.nowIndex = this.songList.length - 1
		} else {
			this.nowIndex = this.nowIndex - 1
		}
		this.userViewAudioLog()
		// console.log(this.nowIndex)
		store.dispatch('changeMusicIndex', this.nowIndex);
		store.dispatch('changeMusicItem', this.songList[this.nowIndex]);
		this.bgAudioInnit()
	}
	next() { //下一曲
		if (this.nowIndex >= (this.songList.length - 1)) {
			this.nowIndex = 0
		} else {
			this.nowIndex = this.nowIndex + 1
		}
		this.userViewAudioLog()
		store.dispatch('changeMusicIndex', this.nowIndex);
		store.dispatch('changeMusicItem', this.songList[this.nowIndex]);
		this.bgAudioInnit()
	}
	updateWay() { //随机播放更新进度
		if (this.playWay == 2) {
			this.playWay = 0
		} else {
			this.playWay = this.playWay + 1
		}

	}
	init(songList, nowIndex) {
		this.songList = songList
		this.nowIndex = nowIndex
		store.state.musicPlayer.playState = true;
		this.bgAudioInnit();
	}
	userViewAudioLog() { //上报
		if(!store.state.user.hasLogin) return;
		let parmas = {
			audio_id: store.state.musicPlayer.musicItem.id,
			view_time: store.state.musicPlayer.currentTime
		};
		Vue.prototype.$api.userViewAudioLog(parmas).then(res => {
			if (res.code == 200) {
				console.log('上报成功');
			}
		});
	}


}

export default audio;
