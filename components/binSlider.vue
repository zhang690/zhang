<template>
	<view class="bin_silder">
		<view class="progress" @touchstart.stop="progress_start" @touchend.stop="progress_tst_end" @touchmove.stop="progress_tst_move" @tap.stop="progress_tap">
			<view class="progressActive" :style="{ width: `${leftWidth <= 0 ? 0 : leftWidth}px` }">
				
			</view>
			<view class="progress-bar">
				<view
					ref="thumb"
					@touchend.stop="progress_tst_end"
					class="progress-thumb thumb"
					@touchmove.stop="sliderTouch"
					:style="{ left: `${leftWidth <= 0 ? 0 : leftWidth}px` }"
				>
					<text>{{ times }}</text>
					<text>/</text>
					<text>{{ overTimer }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
var temps = null;
export default {
	computed: {
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
			return this.$store.state.musicPlayer.currentTime || 0;
		},
		maxLeft() {
			return this.$store.state.musicPlayer.maxLeft;
		}
	},
	props: {
		value: {
			//秒数
			type: Number,
			default: 0
		},
		maxValue: {
			//秒数
			type: Number,
			default: 100
		}
	},
	data() {
		return {
			min: 0, //最小值
			max: 100, //最小值
			oldToucesX: 0,
			leftWidth: 0,
			oldLeftWidth: 0,
			touch: false, //是否拖动
			screenWidth: 0,
			minLeft: 0,
			offsetWidth: 0,
			middle: 0,
			thumb:null
		};
	},
	methods: {
		...mapActions(['changeTime', 'changePlayState', 'changeDuration', 'changeCurrentTime', 'changeSphereExist', 'changeMusicItem', 'changeOverTimer']),
		getElSize(id) {
			//得到元素的size
			return new Promise((res, rej) => {
				uni.createSelectorQuery()
					.in(this)
					.select('.' + id)
					.fields(
						{
							size: true,
							scrollOffset: true
						},
						data => {
							res(data);
						}
					)
					.exec();
			});
		},
		async sliderTouch(e) {
			let touches = e.changedTouches[0];
			let leftWidth = touches.pageX - this.offsetWidth / 2;
			this.leftWidth = leftWidth < this.minLeft ? this.minLeft : leftWidth;
			this.leftWidth = leftWidth < this.maxLeft ? (leftWidth > this.maxLeft ? this.maxLeft : leftWidth) : this.maxLeft;
			let progressPageX = touches.pageX;
			let s = (progressPageX / this.maxLeft) * this.duration;
			let temp = s <= 1 ? 0 : s;
			temp = s >= this.duration ? this.duration : s;
			this.$mAudio.seek(temp);
		},
		progress_start(e) {
			this.touch = true;
		},
		progress_tst_end(e) {
			this.touch = false;
		},
		progress_tst_move(e) {
			this.touch = true;
			let touches = e.changedTouches[0];
			let progressPageX = touches.pageX;
			let s = (progressPageX / this.maxLeft) * this.duration;
			let temp = s <= 1 ? 0 : s;
			temp = s >= this.duration ? this.duration : s;
			let time = this.$calcTimer(Math.floor(temp));
			this.changeTime(time);
			this.$mAudio.seek(temp);
		},
		async progress_tap(e) {
			this.touch = true;
			let touches = e.changedTouches[0];
			this.toucheChage(touches);
		},
		toucheChage(touches) {
			let progressPageX = touches.pageX;
			let s = (progressPageX / this.maxLeft) * this.duration;
			let d = (this.middle / this.maxLeft) * this.duration;
			let temp = s <= 1 ? 0 : s;
			temp = s >= this.duration ? this.duration : s;
			let time = this.$calcTimer(Math.floor(temp));
			let leftWidth = (temp / this.duration) * this.maxLeft - this.middle;
			this.leftWidth = leftWidth < this.minLeft ? this.minLeft : leftWidth;
			this.leftWidth = leftWidth < this.maxLeft ? (leftWidth > this.maxLeft ? this.maxLeft : leftWidth) : this.maxLeft;
			this.$mAudio.seek(temp);
			clearTimeout(temps);
			temps = setTimeout(() => {
				this.touch = false;
				clearTimeout(temps);
			}, 200);
		},
		async maxLefts() {
			this.thumb = await this.getElSize('thumb');
			if(this.thumb){
				this.offsetWidth = this.thumb.width
			}
			// #ifdef H5
				this.offsetWidth = this.$refs.thumb.$el.offsetWidth
			// #endif
			await this.$store.dispatch('changeMaxLeft', this.$screenWidth - this.offsetWidth);
			this.middle = this.offsetWidth / 2;
		}
	},
	watch: {
		currentTime: {
			immediate: true,
			async handler(newVal) {
				//maxLeft 最大能走的宽度  this.duration 最长时间 newVal最新时间
				if (this.touch) return;
				if(!this.thumb){
					await this.maxLefts();
				}
				let leftWidth = (newVal / this.duration) * this.maxLeft;
				if (isNaN(leftWidth)) {
					leftWidth = 0;
				}
				this.leftWidth = leftWidth < this.minLeft ? this.minLeft : leftWidth;
				this.leftWidth = leftWidth < this.maxLeft ? (leftWidth > this.maxLeft ? this.maxLeft : leftWidth) : this.maxLeft;
			}
		}
	},
	async created() {
		this.thumb = null;
	},
	async mounted() {
		await this.maxLefts();
	},
	destroyed() {
		clearTimeout(temps);
	}
};
</script>

<style lang="scss">
.bin_silder {
	// margin-top: 40upx;
	.progress {
		width: 100%;
		// height: 10upx;
		background: red;
		height: 2upx;
		// background: rgba(0, 215, 137, 1);
		background:rgba(250,250,252,1);
		border-radius: 2upx;
		position: relative;
		.progressActive{
			position: absolute;
			width:0;
			height: 2upx;
			background: rgba(0, 215, 137, 1);
		}
		.progress-bar {
			position: absolute;
			width: 10%;
			height: 100%;
			// background: blue;
			.progress-thumb {
				position: absolute;
				top: -16upx;
				text-align: center;
				font-size: 18upx;
				width: 136upx;
				height: 36upx;
				background: rgba(0, 0, 0, 1);
				box-shadow: 0px 4upx 8upx 0px rgba(102, 102, 102, 0.35);
				border-radius: 18upx;
				line-height: 36upx;
				font-size: 20upx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
				text {
					transform: scale(0.8);
				}
			}
		}
	}
}
</style>
