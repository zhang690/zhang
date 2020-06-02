<template>
	<view class="content" :style="{ width: radius, height: radius }">
		<view class="bottom-view" style="display: flex; justify-content: center; align-items: center;">
			<view class="bottom-inner" :style="{ width: radius, height: radius }">
				<slot></slot>
				<canvas  class="progress_bg" canvas-id="cpbg" width='radius' height='radius' ></canvas>
				<canvas class="progress_bg" canvas-id="cpbar" width='radius' height='radius'></canvas>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: '',
	computed:{
		// schedule(){
		// 	return this.$store.state.musicPlayer.schedule;
		// }
		
	},
	props: {
		src: {
			type: String,
			default: ''
		},
		radius: {
			type: String,
			default: '60px'
		},
		// percent: {
		// type: Number,
		// default: 0
		// }
	},
	data() {
		return {
			animationData: {},
			audioCoverImg: '../../static/gb.png',
		};
	},
	created() {
	},
	mounted() {
		this.drawProgressbg();
	},
	methods: {
		updateInfo: function(img) {
			if (this.audioCoverImg != '../../static/gb.png') {
				return;
			}
			this.audioCoverImg = img;
		},
		// 绘制路径线
		drawProgressbg: function() {
			var ctx = uni.createCanvasContext('cpbg', this);
			ctx.setLineWidth(3);
			ctx.setStrokeStyle('#BFBFBF');
			ctx.setLineCap('round');
			ctx.beginPath();
			ctx.arc(30, 30, 28, 0, 2 * Math.PI, false);
			ctx.stroke();
			ctx.draw();
		},
		// 动态绘制圆环
		drawCircle: function(step) {
			var ctx = uni.createCanvasContext('cpbar', this);
			ctx.setLineWidth(3);
			ctx.setStrokeStyle('rgba(0, 215, 137, 1)');
			ctx.setLineCap('butt');
			ctx.beginPath();
			// 参数step 为绘制的百分比
			if (step >= 1) {
				step = 2;
			} else {
				step = step * 2;
			}
			ctx.arc(30, 30, 28, 0, step * Math.PI, false);
			ctx.stroke();
			ctx.draw();
		},
		// 点击事件
		clickAnimationView: function() {
			console.log('点击动画view', this.$store);
		},
	},
	watch:{
		
	}
};
</script>

<style>
.content {
	position: absolute;
	z-index: 110;
}

.progress_bg {
	position: absolute;
	top: 0;
	left: 0;
	width: 60px;
	height: 60px;
	transform: rotate(-90deg);
}
.bottom-inner {
	position: relative;
	width: 60px;
	height:60px;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
