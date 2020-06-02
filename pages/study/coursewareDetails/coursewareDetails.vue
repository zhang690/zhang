<template>
	<view id="coursewareDetails" @click.stop="hideSphere">
		<view class="title">{{ audio.audio_name }}</view>
		<view class="teach">主讲老师：{{ audio.teacher_name }}</view>
		<view class="play_box">
			<image :src="iconURL + audio.teacher_avatar" mode="aspectFill"></image>
			<view class="center">
				<view class="text left">{{ times }}</view>
				<slider
					style="width: 181upx;"
					@change="sliderChange"
					@changing="sliderChanging"
					class="audio-slider"
					block-size="10"
					:min="0"
					:max="duration"
					:value="currentTime"
					activeColor="#ff7400"
					@touchstart="lock = true"
					@touchend="lock = false"
				/>
				<view class="text right">{{ overTimer }}</view>
			</view>
			<view :class="['play_state', 'actve']" @click.stop="stopMusics" v-if="playState"></view>
			<view :class="['play_state']" @click.stop="playMusics" v-else></view>
		</view>
		<view class="coursewareDetails_content">
			<parser :html="audio.desc"></parser>
		</view>
		<!-- 播放球 -->
		<music-sphere v-show="sphereExist" ref="sphere" :percent="currentTime"></music-sphere>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
	import parser from '@/components/jyf-parser/jyf-parser'; // HBuilderX 2.5.5 及以上可以不需要
export default {
	components:{
		parser
	},
	computed: {
		// ...mapState(["musicPlayer"]),
		sphereExist() {
			return this.$store.state.musicPlayer.sphereExist;
		},

		iconURL() {
			return this.$iconURL;
		},
		times() {
			return this.$calcTimer(this.currentTime);
		},
		sphereShow(){
			this.$store.state.musicPlayer.sphereShow;
		},
		overTimer() {
			return this.$calcTimer(this.duration);
		},
		duration() {
			return this.$store.state.musicPlayer.duration;
		},
		playState() {
			return this.$store.state.musicPlayer.playState;
		},
		currentTime() {
			return this.$store.state.musicPlayer.currentTime;
		},
		musicList() {
			return this.$store.state.musicPlayer.musicList;
		},
		musicIndex() {
			return this.$store.state.musicPlayer.musicIndex;
		},
		musicItem(){
			return this.$store.state.musicPlayer.musicItem;
		}
	},
	data() {
		return {
			play_state: false,
			audio: {},
			lock: false,
			treeList: [],
			arr: [],
			audio_id: '',
			view_time:"",
			course_id:'',
			str:"23233"
		};
	},
	methods: {
		...mapActions(['changePlayState', 'changeDuration', 'changeCurrentTime', 'changeSphereExist', 'changeMusicItem', 'changeOverTimer', 'changeMusicList', 'changeMusicIndex','changeCourseList']),
		playMusics() {
			this.changePlayState(true);
			this.changeSphereExist(true);
		},
		stopMusics() {
			this.changePlayState(false);
		},
		hideSphere() {
			if (!this.sphereExist && !this.sphereShow){
				return false;
			}else{
				this.$refs.sphere.hide();
			}
		},
		// 拖动进度条
		sliderChange(data) {
			this.$mAudio.seek(data.detail.value);
		},
		//拖动中
		sliderChanging(data) {
			this.changeCurrentTime(data.detail.value);
		},
		getAudioDetail(v) {
			this.$api.getAudioDetail(v).then(res => {
				// console.log(res);
				if (res.code == 200) {
					this.audio = res.data;
					// console.log(this.audio.desc)
					this.course_id = this.audio.course_id;
					this.aduioPlayList();
					let temp = setTimeout(()=>{
						uni.hideLoading()
						clearTimeout(temp)
					},1000)
				}
			});
		},
		renderAudioList(list = [], rank = 0, parentId = []) {
			//处理播放列表
			list.forEach((item, index) => {
				this.treeList.push({
					id: item.id,
					audio_name: item.name,
					audio_file: item.audio_file,
					audio_time: item.audio_time,
					course_id: item.course_id,
					teacher_name: this.audio.teacher_name,
					teacher_avatar: this.audio.teacher_avatar
				});
				if (Array.isArray(item.list) && item.list.length > 0) {
					let parents = [...parentId];
					parents.push(item.id);
					this.renderAudioList(item.list, rank + 1, parents);
				} else {
					this.arr.push(this.treeList[this.treeList.length - 1]);
				}
			});
			return this.arr;
		},
		async aduioPlayList() {
			let api = await this.$api.aduioPlayList({ course_id: this.audio.course_id, audio_id: this.audio.id });
			if (api.code == 200) {
				this.changeCourseList(api.data);
				this.changeMusicList(this.renderAudioList(api.data));
				var ret3 = this.musicList.findIndex(value => {
					return value.id === this.audio.id;
				});
				this.changeMusicIndex(ret3);
				this.changeMusicItem(this.musicList[ret3]); //换当前课程
				if (this.audio.id === this.$mAudio.bgAudioMannager.id) {
					return;
				} else {
					this.$mAudio.init(this.musicList, this.musicIndex);
					if(this.view_time){
						this.changeCurrentTime(this.view_time);
						this.$mAudio.seek(this.view_time)
					}
					
				}
			}else{
				console.log(api.msg)
			}
		}
	},
	async onShow() {
		uni.showLoading({
			title:"加载中..."
		})
	},
	async onLoad(v) {
		if (v.audio_id) {
			this.audio_id = v.audio_id;
			this.course_id = v.course_id;
			await this.getAudioDetail({ audio_id: this.audio_id });
		}
		if(v.view_time){
			this.view_time = v.view_time;
			
		}
	},
	onPageScroll() {
		this.hideSphere();
	},
	onBackPress(e) {  
			// 这里可以自定义返回逻辑，比如下面跳转其他页面
		let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
		let curRoute = routes[routes.length - 1].route; // 获取当前页面路由，也就是最后一个打开的页面路由
		if (curRoute.indexOf('coursewareDetails') < 0) {
			return false;
		} else {
			uni.redirectTo({
				url: '../courseLearning/courseLearning?course_id=' + this.musicItem.course_id + '&audio_id=' + this.musicItem.id
			});
		}
		return true;
	}, 
	destroyed() {
		uni.hideLoading()
	}
};
</script>

<style lang="scss">
#coursewareDetails {
	width: 100%;
	.title {
		font-size: 46upx;
		font-family: Source Han Sans CN;
		text-align: center;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		margin-left: 62upx;
		margin-right: 73upx;
		margin: 60upx 73upx 42upx 62upx;
	}
	.teach {
		font-size: 24upx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		margin-left: 34upx;
		margin-bottom: 50upx;
	}
	.play_box {
		display: flex;
		align-items: center;
		width: 686upx;
		height: 156upx;
		overflow: hidden;
		background-color: linear-gradient(-45deg, rgba(217, 238, 242, 1), rgba(237, 252, 251, 1));
		background: url(../../../static/images/study/bgc.png) no-repeat;
		background-size: cover;
		margin: 0 auto;
		image {
			display: block;
			width: 102upx;
			height: 102upx;
			box-shadow: 0px 0px 18upx 2upx rgba(102, 102, 102, 0.35);
			border-radius: 4upx;
			margin: 27upx 44upx 27upx 35upx;
		}
		.center {
			display: flex;
			flex: 1;
			align-items: center;
		}
		.right {
			margin-right: 22upx;
		}
		.text {
			font-size: 20upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
		}
		.play_state {
			width: 60upx;
			height: 60upx;
			margin-right: 27upx;
			background: url(../../../static/images/study/play.png) no-repeat;
			background-size: 100% 100%;
		}
		.actve {
			background: url(../../../static/images/study/pause.png) no-repeat;
			background-size: 100% 100%;
		}
	}

	.coursewareDetails_content {
		margin: 89upx 47upx 89upx 32upx;
		overflow: hidden;
	}
}
</style>
