<template>
	<view class="musicSphere" v-show="isSphereExist && musicItem">
		<animationView
			v-show="!isShows"
			:src="iconURL + musicItem.teacher_avatar"
			ref="animationView"
			:class="[{ ishow: !isShows }, { ihide: isShows }]"
		>
			<view
				@tap.stop="sphere_box_show"
				class="progresstext"
				:style="{ backgroundImage: 'url(' + iconURL + musicItem.teacher_avatar + ')', backgroundSize: '100% 100%' }"
			></view>
		</animationView>
		<view :class="['cube', 'sphere_box', { show: isShows }, { hide: isHide }]" @tap.stop="link_page">
			<view class="close_top" @tap.stop="close">
				<view class="close" ></view>
			</view>
			<view :class="['center']">
				<view class="center_text">
					<text v-if="musicItem && musicItem.audio_name.length < 10" class="audio_name">{{ musicItem.audio_name }}</text>
					<text v-else class="animates">{{ musicItem.audio_name }}</text>
				</view>
				<view class="txt">{{ time }}</view>
			</view>
			<view class="iconfont top">&#xe6a2;</view>
			<view class="iconfont_play" >
				<!-- <text v-if="musicPlayer.playState" @tap.stop="stopMusics">&#xe6a6;</text>
				<text v-else @tap.stop="playMusics">&#xe6a8;</text> -->
			
				<view
					v-if="musicPlayer.playState"
					@tap.stop="stopMusics"
					:style="{ backgroundImage: 'url('+play_1+')', backgroundSize: '100% 100%' }"
				></view>
				<view
					v-else
					@tap.stop="playMusics"
					:style="{ backgroundImage: 'url('+play_2+')', backgroundSize: '100% 100%' }"
				></view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import play_1 from '@/static/images/study/play-1.png'
import play_2 from '@/static/images/study/play-2.png'
export default {
	computed: {
		...mapState(['musicPlayer']),
		// percent() {
		// 	return Math.min(1, this.currentTime / this.duration);
		// },
		iconURL() {
			return this.$iconURL;
		},
		isShows() {
			return this.$store.state.musicPlayer.sphereShow;
		},
		isSphereExist() {
			return this.$store.state.musicPlayer.sphereExist;
		},
		isHide() {
			return this.$store.state.musicPlayer.ifSphereShow === 2;
		},
		time() {
			return this.$calcTimer(this.$store.state.musicPlayer.currentTime);
		},
		duration() {
			return this.$store.state.musicPlayer.duration;
		},
		currentTime() {
			return this.$store.state.musicPlayer.currentTime;
		},
		musicItem() {
			return this.$store.state.musicPlayer.musicItem;
		}
	},
	props:{
		percent: {
		type: Number,
		default: 0
		}
	},
	data() {
		return {
			// radius: '60px',
			sphere_box: false,
			showLoading: false,
			audioPlay: false,
			is_sphere_box_show: true,
			play_1:play_1,
			play_2:play_2
		};
	},
	methods: {
		...mapActions(['changeSchedule', 'changeSphereShow', 'changePlayState', 'changeTime', 'changePlayState', 'changeDuration', 'changeCurrentTime', 'changeSphereExist', 'changeMusicItem', 'changeOverTimer']),
		async playMusics() {
			this.$promise(200);
			await this.changePlayState(true);
		},
		async stopMusics() {
			await this.changePlayState(false);
			// let parmas = {
			// 	audio_id: this.musicItem.id,
			// 	view_time: this.$store.state.musicPlayer.currentTime
			// };
			// this.$api.userViewAudioLog(parmas).then(res => {
			// 	if (res.code == 200) {
			// 		console.log('上报成功');
			// 	}
			// });
		},
		close() {
			//关闭播放球
			this.$store.dispatch('changeSphereExist', false);
			this.changeSphereShow(false);
			this.changePlayState(false)
		},
		sphere_box_show() {
			this.$store.dispatch('changeSphereShow', true);
			this.$store.dispatch('changeIfSphereShow', 1);
			this.is_sphere_box_show = false;
			console.log(this.isHide, this.is_sphere_box_show);
			this.sphere_box = true;
		},
		link_page() {
			console.log('去新的页面');
			let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
			let curRoute = routes[routes.length - 1].route; // 获取当前页面路由，也就是最后一个打开的页面路由
			if (curRoute.indexOf('coursewareDetails') > 0) {
				this.$mRouter.push({
					route: this.$mRoutesConfig.play,
					query: {
						toBack: true
					}
				});
			} else {
				this.$mRouter.push({
					route: this.$mRoutesConfig.play
				});
			}
		},
		hide() {
			if (this.isSphereExist && this.isShows) {
				let temp = null;
				this.$store.dispatch('changeSphereShow', false);
				this.$store.dispatch('changeIfSphereShow', 2);
				temp = setTimeout(() => {
					this.$store.dispatch('changeIfSphereShow', 1);
					clearTimeout(temp);
				}, 200);
			}
		}
	},
	destroyed() {
		this.showLoading && uni.hideLoading();
		this.showLoading = false;
	},
	watch: {
		// currentTime(v){
		// 	this.changeSchedule(Math.min(1, this.currentTime / this.duration))
		// }
		percent(v){
			this.$refs.animationView.drawCircle(Math.min(1, v / this.duration))
		}
	}
};
</script>

<style lang="scss">
.musicSphere {
	position: fixed;
	left: 44upx;
	bottom: 15%;
	// width: 100%;
	width: 124upx;
	height: 124upx;
	z-index: 100;
	.circleprogress {
		display: flex;
		width: 124upx;
		height: 124upx;
		position: fixed;
		left: 60upx;
		bottom: 15%;
		z-index: 103;
		cursor: pointer;
		// display: none;
	}
	.progresstext {
		width: 54px;
		height: 54px;
		border-radius: 50%;
		animation: cuIcon-spin 10s linear infinite;
		background-size: contain;
		position: absolute;
		top: 3px;
		left: 3px;
		z-index: 100;
	}

	.sphere_box {
		height: 114upx;
		overflow: hidden;
		display: none;
		background: rgba(136, 136, 136, 1);
		position: fixed;
		border-radius: 10upx;
		color: #fff;
		z-index: 100;
		.close_top{
			    width: 80upx;
			    height: 100%;
			    display: flex;
			    align-items: center;
			    justify-content: center;
			.close {
				background: url(../../static/gb.png);
				width: 34upx;
				height: 34upx;
				margin: 0 20upx;
				background-size: 100% 100%;
			}
		}
		
		.center {
			width: 380upx;
			.center_text {
				width: 100%;
				overflow: hidden;
				font-size: 30upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: rgba(255, 255, 255, 1);
				.audio_name{
					width: 200upx;
					overflow: hidden;
				}
			}
			.txt {
				font-size: 24upx;
				font-family: PingFang SC;
				font-weight: 400;
				color: rgba(245, 245, 245, 1);
			}
		}
		.top {
			font-size: 60upx;
			margin-left: 10upx;
		}
		.iconfont_play {
			// font-size: 100upx;
			view{
				margin: 0 10upx;
				width: 108upx;
				height: 108upx;
			}
		}
	}
	.ishow {
		display: block;
		transition: opacity 0.3s ease-in;
	}
	.ihide {
		display: none;
		opacity: 0;
		transition: opacity 0.6s ease-in;
	}
	.show {
		border-radius: 20upx;
		animation: changebox 0.1s ease 0s normal forwards;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.hide {
		display: flex;
		justify-content: space-between;
		align-items: center;
		animation: backChangebox 0.2s ease-out 0s normal forwards;
	}
	@keyframes changebox {
		0% {
			width: 100upx;
			opacity: 0.1;
		}
		10% {
			width: 200upx;
			opacity: 0.2;
		}
		50% {
			width: 320upx;
			opacity: 0.3;
		}
		70% {
			width: 540upx;
			opacity: 0.4;
		}
		100% {
			width: 662upx;
			background: rgba(0, 0, 0, 1);
			opacity: 0.65;
		}
	}
	@keyframes backChangebox {
		0% {
			width: 662upx;
			opacity: 1;
		}
		10% {
			width: 540upx;
			opacity: 0.95;
		}
		50% {
			width: 320upx;
			opacity: 0.9;
		}
		70% {
			width: 200upx;
			opacity: 0.8;
		}
		100% {
			width: 60px;
			opacity: 0;
			display: none;
		}
	}
	.animates {
		width: 200upx;
		display: flex;
		color: #ffffff;
		font-size: 30upx;
		padding: 0 10upx;
		white-space: nowrap;
		animation: 10s wordsLoop linear infinite normal;
	}
	@keyframes wordsLoop {
		0% {
			transform: translateX(0rpx);
		}
		100% {
			transform: translateX(-100%);
			-webkit-transform: translateX(-100%);
		}
	}
}
</style>
