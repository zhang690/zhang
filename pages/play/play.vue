<template>
	<view id="play">
		<view class="play_box">
			<view class="status_bar"><view class="top_view"></view></view>
			<view @click="back" class="iconfont test">&#xe6a3;</view>
			<view class="img_box"><image :src="iconURL + musicItem.teacher_avatar" mode="aspectFill"></image></view>
			<view class="play_title">{{ musicItem.audio_name }}</view>
			<view class="teach">主讲老师：{{ musicItem.teacher_name }}</view>
			<view class="play_btn">
				<!-- <view class="play_btn_list btn" @tap="openList">播放列表</view> -->
				<view class="play_btn_list btn" @tap="get_course_id(musicItem.course_id, musicItem.id)">播放列表</view>
				<navigator class="play_btn_img btn" hover-class="none" :url="'../study/coursewareDetails/coursewareDetails?audio_id=' + musicItem.id">查看图文</navigator>
			</view>
		</view>
		<bin-slider :value="currentTime" :maxValue="duration"></bin-slider>
		<view class="contorl_box">
			<view class="contorl_box_left" @tap="prev"><view class="left"></view></view>
			<view :class="['center', 'active']" v-if="playState" @tap="stopMusics"></view>
			<view class="center" @tap="playMusics" v-else></view>
			<view class="contorl_box_right" @tap="next"><view class="right"></view></view>
		</view>
		<uni-popup :custom="true" ref="popup" type="bottom" @change="change" @touchmove.stop.prevent="moveHandle">
			<view class="popup_top">
				<view class="uni_popup">
					<scroll-view scroll-y="true" style="height: 95%;" @scroll="scrollPopup" scroll-top="scrollTop">
						<view class="title">
							<text class="one">课程目录</text>
							<text class="two">（已解锁）</text>
						</view>
						<mix-trees :list="courseList" @treeItemClick="treeItemClick" ref="mixTrees" :mid="mid"></mix-trees>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import binSlider from '@/components/binSlider.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import mixTrees from '@/components/mix-tree/music-tree';
export default {
	components: {
		binSlider,
		uniPopup,
		mixTrees
	},
	computed: {
		musicItem() {
			return this.$store.state.musicPlayer.musicItem;
			// return this.$mAudio.bgAudioMannager;
		},
		times() {
			return this.$calcTimer(this.currentTime);
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
		courseLists() {
			// console.log(this.$store.state.musicPlayer.courseList)
			return this.$store.state.musicPlayer.courseList;
		},
		iconURL() {
			return this.$iconURL;
		}
		// ...mapState([{time:state=>state.musicPlayer.time},{playState:state=>state.musicPlayer.playState}]),
	},
	data() {
		return {
			datas: '21312',
			lock: false, // 锁
			status: 1, // 1暂停 2播放
			courseList: [],
			list: null,
			treeList: [],
			audioList: [],
			audioLists: [],
			scrollTop: 0,
			mid: 0,
			toBack: false
			// currentTime: 0, //当前进度
			// duration: 100, // 总进度
		};
	},
	methods: {
		...mapActions(['changePlayState', 'changeDuration', 'changeCurrentTime', 'changeMusicItem', 'changeOverTimer', 'changeMusicList', 'changeMusicIndex']),
		playMusics() {
			this.changePlayState(true);
		},
		stopMusics() {
			this.changePlayState(false);
		},
		moveHandle(e){
			console.log(e)
			return false;
		},
		scrollPopup(e) {
			console.log(e)
			return false;
			// this.scrollTop = e.detail.scrollTop
		},
		treeItemClick(item) {
			//播放器点击事件
			let retIndex = this.musicList.findIndex(value => {
				return value.id === item.id;
			});
			this.changeMusicIndex(retIndex);
			this.changeMusicItem(this.musicList[this.musicIndex]);
			this.$mAudio.init(this.musicList, retIndex);
			this.$mAudio.play();
		},
		change(e) {
			console.log('是否打开:' + e.show);
			if (e.show) {
				console.log('是否打开:' + this.courseList);
			} else {
				this.courseList = [];
				this.$refs.mixTrees.treeList = [];
			}
		},
		back() {
			uni.navigateBack({
				delta: 1,
				animationType: 'slide-out-bottom',
				animationDuration: 400
			});
		},
		getAudioDetail(v) {
			//获取音频详情
			this.$api.getAudioDetail(v).then(res => {
				console.log(res);
				if (res.code == 200) {
					let temp = res.data;
					this.changeMusicItem(temp);
					this.changeOverTimer(this.$calcTimer(temp.audio_time));
					this.playMusics();
				}
			});
		},
		async prev() {
			console.log('上一首');
			this.$mAudio.last();
			console.log(this.$mAudio);
		},
		async next() {
			console.log('下一首');
			this.$mAudio.next();
		},
		async get_course_id(course_id, audio_id) {
			//打开播放列表
			this.$refs.popup.open();
			await this.$promise();
			this.courseList = this.courseLists;
		},
	},
	async onLoad(v) {
		if (v.toBack) {
			this.toBack = v.toBack;
		}
	},
	onBackPress(e) {
		if(!this.toBack){
			return false;
		}
		if (this.toBack) {
			uni.redirectTo({
				url: '../study/coursewareDetails/coursewareDetails?course_id=' + this.musicItem.course_id + '&audio_id=' + this.musicItem.id
			});
			return true;
		} 
	},
};
</script>

<style lang="scss">
.status_bar {
	height: var(--status-bar-height);
	width: 100%;
	.top_view {
		background-color: #88a5d3;
	}
}
#play {
	.popup_top {
		overflow: hidden;
		padding-top: 20px;
		height: 900upx;
		position: relative;
		background-color: rgba(255, 255, 255, 1);
		border-radius: 24upx 24upx 0px 0px;
	}
	.uni_popup {
		width: 100%;
		position: absolute;
		top: 5%;
		background-color: rgba(255, 255, 255, 1);
		overflow-y: scroll;
		height: 95%;
		.title {
			height: 117upx;
			padding: 24upx 0 0 32upx;
		}
		text {
			font-size: 34upx;
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(51, 51, 51, 1);
		}
		.two {
			color: rgba(153, 153, 153, 1);
		}
	}
	width: 100%;
	.play_popup {
		position: relative;
		background: rgba(255, 255, 255, 1);
		border-radius: 24upx 24upx 0px 0px;
	}
	.play_box {
		background-color: #88a5d3;
	}
	.test {
		font-size: 80upx;
	}
	.img_box {
		width: 320upx;
		height: 320upx;
		margin: 72upx auto 53upx auto;
		background: rgba(102, 102, 102, 1);
		box-shadow: 0px 0px 8upx 0px rgba(214, 214, 214, 0.35);
		border-radius: 20upx;
		image {
			display: block;
			width: 100%;
			height: 100%;
			border-radius: 20upx;
		}
	}
	.play_title {
		width: 544upx;
		min-height: 96upx;
		margin: 0 auto;
		text-align: center;
		font-size: 38upx;
		line-height: 45upx;
		font-family: Source Han Sans CN;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}
	.teach {
		margin: 36upx 0 73upx 0;
		font-size: 24upx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: rgba(247, 247, 247, 1);
		text-align: center;
	}
	.play_btn {
		display: flex;
		justify-content: center;
		padding-bottom: 105upx;
		.play_btn_img {
			margin-left: 40upx;
		}
		.btn {
			width: 130upx;
			height: 48upx;
			border: 2upx solid rgba(255, 255, 255, 1);
			border-radius: 23upx;
			font-size: 24upx;
			text-align: center;
			line-height: 44upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: rgba(255, 255, 255, 1);
		}
	}
	.contorl_box {
		display: flex;
		margin-top: 147upx;
		justify-content: center;
		align-items: center;

		.center {
			width: 120upx;
			height: 120upx;
			// margin: 0 auto;
			margin: 0 24upx;
			background: url(../../static/images/play/play.png) no-repeat;
			background-size: 100% 100%;
		}
		.active {
			background: url(../../static/images/play/pause.png) no-repeat;
			background-size: 100% 100%;
		}
		.contorl_box_left {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 140upx;
			height: 100upx;
			.left {
				width: 40upx;
				height: 40upx;
				background: url(../../static/images/play/prev.png) no-repeat;
				background-size: 100% 100%;
			}
		}
		.contorl_box_right {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 140upx;
			height: 100upx;
			.right {
				width: 40upx;
				height: 40upx;
				background: url(../../static/images/play/next.png) no-repeat;
				background-size: 100% 100%;
			}
		}
	}
}
</style>
