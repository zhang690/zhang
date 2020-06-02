<template>
	<view id="courseLearning" v-show="courseIntroduce" @click.stop="hideSphere">
		<hx-navbar
			centerAfter="asdsadasd"
			:fixed="true"
			:centerSlidiSwitch="true"
			barPlaceholder="hidden"
			transparent="auto"
			:color="['#ffffff', '#000000']"
			:background-color="[255, 255, 255]"
			:pageScroll.sync="scrollData"
		>
			<view slot="centerAfter" style="text-align: center;width: 100%;">
				<text class="text_overflow">{{ courseIntroduce.title | fifterText }}</text>
			</view>
			<block slot="right">
				<view class="right">
					<view @click="tcOpen" class="iconfont banji" v-if="courseIntroduce.is_buy">&#xe603;</view>
					<view @click="share" class="iconfont share">&#xe606;</view>
				</view>
			</block>
		</hx-navbar>
		<view class="top_view_img">
			<view class="textHolder" :style="{ backgroundImage: 'url(' + iconURL + courseIntroduce.cover + ')', backgroundPosition: '0px 0px', backgroundSize:'cover',backgroundRepeat:'no-repeat' }"></view>
			<!-- <image :src="iconURL + courseIntroduce.cover" mode=""></image> -->
		</view>
		<view class="content_box">
			<view class="content_box_pos">
				<view class="teacher_avatar"><image :src="iconURL + courseIntroduce.teacher_avatar" mode=""></image></view>
				<view class="teacher_right">
					<view class="title">{{ courseIntroduce.title }}</view>
					<view class="course_desc">{{ courseIntroduce.course_desc }}</view>
					<view class="teacher_name">主讲老师：{{ courseIntroduce.teacher_name }}</view>
				</view>
			</view>
		</view>
		<view class="cutTab" v-if="!courseIntroduce.is_buy">
			<view :class="['tab', { active: active == 1 }]" @tap.stop="cutTab(1)">课程介绍</view>
			<view :class="['tab', { active: active == 2 }]" @tap.stop="cutTab(2)">
				课程目录
				<view class="audition" v-if="courseIntroduce.is_shiting">试听</view>
			</view>
		</view>
		<view class="cutTab_one" v-if="courseIntroduce.is_buy"><view class="tab">课程学习</view></view>

		<view class="cutTab_content" :class="{ cutTab_bottom: !courseIntroduce.is_buy }" v-show="active == 1 && !courseIntroduce.is_buy">
			<!-- <image :src="iconURL + courseIntroduce.course_poster" mode="widthFix" @load="imgLoad" v-if="courseIntroduce.course_poster.lenght<=1"></image> -->
			<view class="loadimage" v-for="(item, index) of courseIntroduce.course_poster" :key="index">
				<easy-loadimage :scroll-top="scrollTop" :image-src="iconURL + item" :open-transition="false"></easy-loadimage>
				<!-- <ImageCache class="loadimage" :src="iconURL + item"></ImageCache> -->
			</view>
			<!-- <text>{{item.content}}</text> -->
		</view>
		<view class="cutTab_contents" :class="{ cutTab_bottom: !courseIntroduce.is_buy }" v-show="active == 2 || courseIntroduce.is_buy">
			<mix-tree :list="list" :params="treeParams" @treeItemClick="treeItemClick" ref="mixTree"></mix-tree>
			<view class="cutTab_bottoms">
				- 下面没有了 -
			</view>
		</view>

		<view class="purchase" v-if="!courseIntroduce.is_buy">
			<view class="money">¥{{ courseIntroduce.price }}</view>
			<view class="button" @tap="pay">
				<text v-if="courseIntroduce.is_free">立即领取</text>
				<text v-else>立即购买</text>
			</view>
		</view>
		<!-- 分享 -->
		<share ref="share"></share>
		<!-- 弹窗 -->
		<tc v-if="xs == 1" :number="courseIntroduce.class_wechat" :imageurl="courseIntroduce.class_qrcode" @fromChild="tcClose"></tc>
		<!-- 播放球 -->
			<music-sphere v-show="sphereExist" ref="sphere" :percent="currentTime"></music-sphere>
	</view>
</template>

<script>
import share from '@/components/share';
import mixTree from '@/components/mix-tree/mix-tree.vue';
import tc from '@/components/tc.vue'; // 弹窗
import hxNavbar from '@/components/hx-navbar/hx-navbar.vue';
import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue';
import ImageCache from '@/components/shoyu-ImageCache/ImageCache';
export default {
	filters: {
		fifterText: function(title) {
			if (!title) {
				return;
			}
			return title.length > 10 ? title.substr(0, 10) + '...' : title;
		}
	},
	computed: {
		iconURL() {
			return this.$iconURL;
		},
		sphereExist() {
			return this.$store.state.musicPlayer.sphereExist;
		},
		sphereShow(){
			return this.$store.state.musicPlayer.sphereShow;
		},
		currentTime(){
			return this.$store.state.musicPlayer.currentTime;
		},
		hasLogin() {
			return this.$store.state.user.hasLogin;
		},
		uuid() {
			return this.$store.state.user.uuid;
		}
	},
	components: {
		share,
		mixTree,
		tc,
		hxNavbar,
		easyLoadimage,
		ImageCache
	},
	data() {
		return {
			scrollTop: 0,
			scrollData: {},
			colors: 0,
			courseIntroduce: '',
			active: 1,
			level: 1,
			treeParams: {
				defaultIcon: '/static/i2.png', // 默认图标
				currentIcon: '/static/i1.png', // 展开图标
				lastIcon: '/static/i3.png', //最后一级图标
				border: true // 边框， 默认不显示
			},
			list: [],
			xs: 0,
			course_id: '', //课程id
			view_time: 0 //音频播放时间
		};
	},
	methods: {
		hideSphere() {
			if (!this.sphereExist && !this.sphereShow){
				return false;
			}else{
				this.$refs.sphere && this.$refs.sphere.hide();
			}
		},
		imgLoad(e) {
			console.log(e);
		},
		tcOpen() {
			//打开弹窗
			this.xs = 1;
		},
		tcClose(v) {
			//关闭弹窗
			this.xs = v;
		},
		pay() {
			//购买课程
			if (this.courseIntroduce.is_free) {
				//如果是免费
				let temp = { course_id: this.courseIntroduce.id, pay_type: 3 };
				if(!this.hasLogin){
					temp = Object.assign(temp,{uuid:this.uuid})
				}
				this.$api.createBuyCourse(temp).then(res => {
					if (res.code == 200) {
						console.log('123')
						uni.showModal({
							showCancel: false,
							content: '领取成功',
							success: function(res) {
								if (res.confirm) {
									console.log('跳转')
									uni.switchTab({
										url: '../study'
									});
								} 
							}
						});
						// if(this.hasLogin){
						// 	uni.switchTab({
						// 		url: '../study'
						// 	});
						// }else{
						// 	let parmas = { course_id: this.course_id, audio_id: this.audio_id || 0 };
						// 	this.getCourseIntroduce(parmas);
						// 	// this.courseIntroduce.is_buy = true;
						// }
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			} else {
				this.$mRouter.push({
					route: this.$mRoutesConfig.buy,
					query:{course_id:this.courseIntroduce.id}
				});
			}
		},
		treeItemClick(item) {
			//课程目录点击回调
			let { id, name, parentId, status, is_play } = item;
			// <!-- // 0锁住 1试听 2播放 3已听完 -->
			if (!status) {
				return;
			}
			if (is_play) {
				uni.navigateTo({
					url: `../coursewareDetails/coursewareDetails?audio_id=${id}&view_time=${this.view_time}`
				});
			} else {
				uni.navigateTo({
					url: `../coursewareDetails/coursewareDetails?audio_id=${id}&course_id=${this.course_id}`
				});
			}
			// console.log(item);
		},
		getCourseIntroduce(parmas) {
			//获取课程详情
			this.$api.getCourseIntroduce(parmas).then(res => {
				// console.log(res)
				if (res.code == 200) {
					this.courseIntroduce = res.data;
					this.list = this.courseIntroduce.list;
					let temp = setTimeout(()=>{
						uni.hideLoading()
						clearTimeout(temp)
					},1000)
				}else{
					let temp = setTimeout(()=>{
						uni.hideLoading()
						clearTimeout(temp)
						uni.showModal({
							title:"",
							content:res.msg,
							showCancel:false,
							complete(v) {
								console.log(v)
								if(v.confirm){
									uni.navigateBack({
										delta:1
									})
								}
							}
						})
					},1000)
				}
			});
		},
		cutTab(index) {
			//切换tab
			this.active = index;
		},
		share() {
			//分享
			let params = {
				type: 2,
				course_id: this.courseIntroduce.id
			};
			this.$refs.share.shares(params);
		}
	},
	watch: {},
	onLoad(v) {
		if (v.course_id) {
			// console.log(v);
			uni.showLoading({
				title:"加载中..."
			})
			this.course_id = v.course_id;
			this.view_time = v.view_time;
			let parmas = { course_id: v.course_id, audio_id: v.audio_id || 0 };
			this.getCourseIntroduce(parmas);
		}
	},
	//必须在页面加 onPageScroll(e){} ，才能滑动显示背景
	onPageScroll(e) {
		this.scrollData = e;
		this.scrollTop = e.scrollTop;
		if (e.scrollTop > 100) {
			this.colors = 1;
		} else {
			this.colors = 0;
		}
		this.hideSphere();
	},
	onBackPress(e) {
		// 这里可以自定义返回逻辑，比如下面跳转其他页面
		
		let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
		
		let curRoute = routes[0].route; // 获取当前页面路由，也就是最后一个打开的页面路由
		if (curRoute.indexOf('study') < 0) {
			uni.switchTab({
				url: '../../home/home'
			});
		} else {
			uni.switchTab({
				url: '../../study/study'
			});
		}
		// return true 表示禁止默认返回
		return true;
		
	},
	destroyed() {
		uni.hideLoading()
	}
};
</script>

<style lang="scss">
#courseLearning {
	width: 100%;
	overflow: hidden;
	.text_overflow {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.right {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
		// margin-left: 18px;
		white-space: nowrap;
		.banji {
			margin-right: 5upx;
			font-size: 50upx;
		}
		.share {
			margin-right: 20upx;
			margin-left: 20upx;
			font-size: 48upx;
		}
		.is_share {
			width: 36upx;
			height: 36upx;
			background: url(../../../static/images/study/share.png) no-repeat;
			background-size: 100% 100%;
			margin: 0 40upx 0 34upx;
		}
		.is_class {
			width: 36upx;
			height: 42upx;
			background: url(../../../static/images/study/class.png) no-repeat;
			background-size: 100% 100%;
		}
	}
	.top_view_img {
		// width: 100%;
		height: 300upx;
		position: relative;
		z-index: 10;
		overflow: hidden;
		.box {
			width: 100%;
			height: 100%;
			position: absolute;
			background-color: rgba(0, 0, 0, 0.4);
			z-index: 1;
		}
		image {
			display: block;
			width: 100%;
			height: 100%;
			position: absolute;
			transform: scale(1);
		}
		.box::after {
			background-position: top;
			background-size: contain;
			background-attachment: fixed;
			filter: blur(2upx);
		}
	}

	.top_view_img {
		position: relative;
		background-attachment: fixed;
		background-position: center;
		overflow: hidden;
	}
	.textHolder {
		width: 100%;
		height: 300upx;
		position: absolute;
		right: 0;
		bottom: 0;
		// background: inherit;
		overflow: hidden;
		transform: scale(1.2);
	}
	.textHolder::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: inherit;
		// background-attachment: fixed;
		filter: blur(5px);
	}
	.textHolder::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.65);
	}
	.content_box {
		width: 100%;
		height: 150upx;
		position: relative;
		background: #fff;
		z-index: 30;
		border-radius: 24upx 24upx 0upx 0upx;
		margin-top: -24upx;
		margin-bottom: 32upx;
		.teacher_avatar {
			width: 200upx;
			height: 200upx;
			box-shadow: 0px 0px 18upx 2upx rgba(102, 102, 102, 0.35);
			background: rgba(153, 153, 153, 1);
			border-radius: 20upx;
			margin: 0 32upx 0 60upx;
			image {
				display: block;
				width: 100%;
				height: 100%;
				border-radius: 20upx;
			}
		}
		.content_box_pos {
			display: flex;
			// transform: translateY(-90upx);
			top: -90upx;
			position: absolute;
			.teacher_right {
				flex: 1;
				margin-right: 90upx;
				.title {
					font-size: 32upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: rgba(255, 255, 255, 1);
					line-height: 1.3;
					min-height: 72upx;
				}
				.course_desc {
					margin: 38upx 0 10upx 0;
					font-size: 26upx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-family: PingFang SC;
					font-weight: bold;
					color: rgba(153, 153, 153, 1);
				}
				.teacher_name {
					font-size: 26upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: rgba(51, 51, 51, 1);
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}
	.content_box::after {
		content: '';
		width: 100%;
		height: 16upx;
		position: absolute;
		bottom: -16upx;
		background: rgba(249, 249, 249, 1);
	}

	.cutTab {
		width: 100%;
		display: flex;
		.tab {
			width: 50%;
			font-size: 36upx;
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(85, 85, 85, 1);
			text-align: center;
			position: relative;
			.audition {
				width: 72upx;
				height: 34upx;
				text-align: center;
				background: rgba(236, 94, 51, 1);
				box-shadow: 0px 2upx 8upx 0px rgba(243, 133, 99, 0.15);
				border-radius: 21upx 17upx 17upx 2upx;
				font-size: 22upx;
				line-height: 34upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: rgba(255, 255, 255, 1);
				position: absolute;
				right: 20px;
				top: -5px;
			}
		}
		.active {
			color: rgba(42, 193, 124, 1);
			position: relative;
		}
		.active::after {
			content: '';
			position: absolute;
			width: 52upx;
			height: 6upx;
			background: rgba(42, 193, 124, 1);
			border-radius: 3upx;
			bottom: -14upx;
			left: 50%;
			margin-left: -26upx;
		}
	}

	.cutTab_one {
		display: flex;
		justify-content: center;
	}
	.cutTab_content {
		margin: 42upx 32upx;
		image {
			display: block;
			width: 100%;
		}
		.loadimage {
			width: 100%;
			height: auto;
		}
	}
	.cutTab_contents {
		margin: 42upx 0upx;
		.cutTab_bottoms{
			font-size:22upx;
			font-family:Source Han Sans CN;
			font-weight:400;
			color:rgba(153,153,153,1);
			text-align: center;
			margin-top: 70upx;
		}
	}
	.cutTab_bottom {
		margin-bottom: 160upx;
		
	}

	.purchase {
		width: 100%;
		height: 118upx;
		background: rgba(247, 247, 247, 1);
		border-radius: 24upx 24upx 0 0;
		position: fixed;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 100;
		.money {
			font-size: 40upx;
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(239, 92, 65, 1);
			margin-left: 32upx;
			// line-height:50upx;
		}
		.button {
			width: 240upx;
			height: 80upx;
			text-align: center;
			line-height: 80upx;
			margin-right: 32upx;
			font-size: 30upx;
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(255, 255, 255, 1);
			background: linear-gradient(-37deg, rgba(42, 193, 124, 1), rgba(42, 193, 145, 1));
			box-shadow: 0 10upx 30upx 0 rgba(51, 226, 148, 0.5);
			border-radius: 40upx;
		}
	}
}
</style>
