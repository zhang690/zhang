<template>
	<view id="study" v-if="showPage" @click.stop="hideSphere">
		<view class="status_bar"><view class="top_view"></view></view>
		<view v-if="!is_buy_course" class="No_curriculum">
			<image class="icon" src="../../static/images/study/No_curriculum.png" mode=""></image>
			<view class="titles" v-if="hasLogin">你还没有选择课程 快去看看吧</view>
			<view class="titles" v-if="!hasLogin">登录同步学习记录，快去登录吧</view>
			<navigator  v-if="hasLogin" class="Selecting_courses" open-type="switchTab" url="../home/home">挑选课程</navigator>
			<view v-if="!hasLogin" class="Selecting_courses"  @tap.stop="toLogin">去登录</view>
		</view>
		<view v-else class="Courses_available">
			<view class="haveCourse">
				<view class="studyLog" v-if="last_learn">
					<view class="title">上次学到</view>
					<view class="studyLog_box">
						<view class="left"><image :src="iconURL + last_learn.cover" mode="aspectFill"></image></view>
						<view class="right">
							<view class="title">{{ last_learn.title }}</view>
							<view class="content_text">{{ last_learn.small_title }}</view>
						</view>
					</view>
					<view class="btn_box" @click="goStudy(last_learn)">去学习</view>
				</view>
				<view class="title">我的学习</view>
				<view class="courseList">
					<view class="item input_border" v-for="(item, index) of course" :key="index" @click="goStudy(item)" v-if="!courseObj">
						<view class="left">
							<image :src="iconURL + item.course_info.cover" mode="aspectFill"></image>
							<view v-if="item.status === 1" class="Learning_state_zzx">正在学</view>
							<view v-else-if="item.status === 0" class="Learning_state_dkk">待开课</view>
							<view v-else class="Learning_state_ywc">已完成</view>
						</view>
						<view class="right">
							<view class="title">{{ item.course_info.title }}</view>
							<view class="teacher_name">主讲老师：{{ item.course_info.teacher_name }}</view>
						</view>
					</view>
					<view class="item input_border"  @click="courseLearning(courseObj)" v-if="courseObj">
						<view class="left">
							<image :src="iconURL + courseObj.course_info.cover" mode="aspectFill"></image>
							<view v-if="courseObj.status === 1" class="Learning_state_zzx">正在学</view>
							<view v-else-if="courseObj.status === 0" class="Learning_state_dkk">待开课</view>
							<view v-else class="Learning_state_ywc">已完成</view>
						</view>
						<view class="right">
							<view class="title">{{ courseObj.course_info.title }}</view>
							<view class="teacher_name">主讲老师：{{ courseObj.course_info.teacher_name }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 播放球 -->
		<music-sphere v-show="sphereExist && is_buy_course" ref="sphere" :percent="currentTime" ></music-sphere>
		<!-- 测试 -->
		<view><button type="default" @click="goTest" size="mini">按钮</button></view>
	</view>
</template>

<script>
	import $mRoutesConfig from '@/config/routes.config.js';
export default {
	
	computed:{
		sphereExist() {
			return this.$store.state.musicPlayer.sphereExist;
		},
		sphereShow(){
			return this.$store.state.musicPlayer.sphereShow;
		},
		iconURL(){
			return this.$iconURL;
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
	data() {
		return {
			is_buy_course: false,
			showPage:false,
			last_learn: '',
			course: "",
			courseObj:"",
			courseList: [
				{
					id: 1, //课程id
					status: 0, //0待开课 1正在听 2已完成
					title: '啊实打实的多所',
					cover: 'https://gss0.bdstatic.com/7051cy89Q1gCncy6lo7D0j9wexYrbOWh7c50/quzhi/ziyuanwei/bai1.jpg',
					teacher_name: '李爸爸'
				},
				{
					id: 2, //课程id
					status: 1, //0待开课 1正在听 2已完成
					title: '啊实打实的多所',
					cover: 'https://gss0.bdstatic.com/7051cy89Q1gCncy6lo7D0j9wexYrbOWh7c50/quzhi/ziyuanwei/bai1.jpg',
					teacher_name: '李爸爸'
				},
				{
					id: 3, //课程id
					status: 2, //0待开课 1正在听 2已完成
					title: '啊实打实的多所',
					cover: 'https://gss0.bdstatic.com/7051cy89Q1gCncy6lo7D0j9wexYrbOWh7c50/quzhi/ziyuanwei/bai1.jpg',
					teacher_name: '李爸爸'
				},
				{
					id: 4, //课程id
					status: 1, //0待开课 1正在听 2已完成
					title: '啊实打实的多所',
					cover: 'https://gss0.bdstatic.com/7051cy89Q1gCncy6lo7D0j9wexYrbOWh7c50/quzhi/ziyuanwei/bai1.jpg',
					teacher_name: '李爸爸'
				}
			],
			pages: 'study'
		};
	},
	methods: {
		// 测试
		goTest(){
			uni.navigateTo({
				url:'../test/test'
			})
		},
		toLogin() {
			this.$store.dispatch('reLogin');
		},
		hideSphere() {
			if (!this.sphereExist && !this.sphereShow){
				return false;
			}else{
				this.$refs.sphere.hide();
			}
		},
		getMyLearn() {
			let temp = {};
			if(!this.hasLogin){
				temp.uuid = this.uuid;
			}
			this.$api.getMyLearn(temp).then(res => {
				if (res.code == 200) {
					// console.log(res.data.course);
					if (res.data.is_buy_course == 0) {
						this.is_buy_course = false;
					} else {
						this.is_buy_course = true;
					}
					//有课程
					this.last_learn = res.data.last_learn;
					if (res.data.course.length >= 1) {
						this.course = res.data.course;
					} else {
						this.courseObj = res.data.course[0];
					}
					this.showPage = true;
				} else if (res.code == 1900){
					this.is_buy_course = false;
					this.showPage = true;
				}
			});
		},
		toHome() {
			uni.navigateTo({
				url: '../index/index'
			});
		},
		courseLearning(item) {
			console.log(item);
			uni.navigateTo({
				url: './courseLearning/courseLearning?course_id=' + item.course_id + 'pages=' + this.pages
			});
		},
		goStudy(item){
			//去学习
			let url ;
			let id = item.id?item.id:item.course_id;
			let audio_id = item.audio?item.audio.id:0;
			if(item.audio){
				url ='./courseLearning/courseLearning?course_id=' + id +"&audio_id="+audio_id+"&view_time="+item.audio.view_time
			}else{
				url ='./courseLearning/courseLearning?course_id=' + id +"&audio_id="+audio_id
			}
			uni.navigateTo({
				url
			});
		}
	},
	onShow() {
		this.getMyLearn();
	},
	onUnload() {
		uni.hideLoading();
	},
	onPageScroll(e) {
		this.hideSphere();
	},
};
</script>

<style lang="scss">
#study {
	width: 100%;
	height: 100%;
	// position: relative;
	// padding: 20upx;
	// background-color: #FAFAFA;
	.Courses_available {
		width: 100%;
		// position: absolute;
		.noHaveCourse {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			// background-color: #fafafa;
			.icon_bgc {
				width: 296upx;
				height: 259upx;
				background: url(../../static/images/study/icon.png) no-repeat;
				background-size: 100% 100%;
				margin: 248upx 0 52upx 0;
			}
			.center {
				width: 254upx;
				height: 81upx;
				font-size: 32upx;
				font-family: PingFang SC;
				font-weight: 400;
				color: rgba(102, 102, 102, 1);
				margin-bottom: 100upx;
				text-align: center;
			}
			.buy_btn {
				width: 376upx;
				height: 80upx;
				background: linear-gradient(-37deg, rgba(42, 193, 124, 1), rgba(42, 193, 145, 1));
				border-radius: 12upx;
				font-size: 36upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: rgba(255, 255, 255, 1);
				text-align: center;
				line-height: 80upx;
			}
		}
		.haveCourse {
			margin: 113upx 32upx 0 32upx;
			// background-color: #fff;
			.title {
				font-size: 46upx;
				font-family: Source Han Sans CN;
				font-weight: bold;
				color: rgba(51, 51, 51, 1);
			}
			.studyLog {
				position: relative;
				.studyLog_box {
					display: flex;
					margin: 40upx 0 70upx 0;
					.left {
						width:232upx;
						height:130upx;
						border-radius:12px;
						margin-right: 31upx;
						image {
							width: 100%;
							height: 100%;
							border-radius: 12upx;
							background:rgba(52,52,52,1);
							box-shadow:0px 1upx 8upx 0px rgba(227,226,226,0.66);
						}
					}
					.right {
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						.title {
							font-size: 28upx;
							font-family: PingFang SC;
							font-weight: bold;
							color: rgba(68, 68, 68, 1);
							// margin-bottom: 40upx;
						}
						.content_text {
							width: 270upx;
							font-size: 24upx;
							font-family: PingFang SC;
							font-weight: bold;
							color: rgba(157, 157, 157, 1);
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
				}
				.btn_box {
					width: 110upx;
					height: 54upx;
					position: absolute;
					bottom: 0;
					right: 0;
					background: rgba(237, 255, 247, 1);
					border: 2upx solid rgba(0, 215, 137, 1);
					border-radius: 54upx;
					font-size: 24upx;
					font-family: Source Han Sans CN;
					font-weight: 400;
					color: rgba(0, 215, 137, 1);
					text-align: center;
					line-height: 54upx;
				}
			}
			.courseList {
				.item {
					display: flex;
					padding: 42upx 0 32upx 0;
					.left {
						width: 256upx;
						height: 144upx;
						border-radius: 12upx;
						margin-right: 31upx;
						position: relative;
						image {
							width: 100%;
							height: 100%;
							border-radius: 12upx;
							box-shadow:0px 1upx 8upx 0px rgba(227,226,226,0.66);
						}
						.Learning_state_zzx,
						.Learning_state_dkk,
						.Learning_state_ywc {
							width: 98upx;
							height: 36upx;
							text-align: center;
							line-height: 36upx;
							box-shadow: 0 1upx 8upx 0 rgba(227, 226, 226, 0.66);
							border-radius: 0 12upx 0 12upx;
							font-size: 20upx;
							font-family: PingFang SC;
							font-weight: bold;
							color: rgba(255, 255, 255, 1);
							position: absolute;
							left: 0;
							bottom: 0;
							box-shadow:0px 1upx 8upx 0px rgba(227,226,226,0.66);
							// transform: translate(0,-100%);
							// top: 100%;
						}
						.Learning_state_zzx {
							background: rgba(110, 184, 128, 1);
						}
						.Learning_state_dkk {
							background: rgba(239, 194, 79, 1);
						}
						.Learning_state_ywc {
							background: rgba(148, 162, 183, 1);
						}
					}
					.right {
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						.title {
							font-size: 28upx;
							font-family: PingFang SC;
							font-weight: bold;
							color: rgba(68, 68, 68, 1);
							// margin-bottom: 40upx;
						}
						.teacher_name {
							font-size: 24upx;
							font-family: PingFang SC;
							font-weight: bold;
							color: rgba(157, 157, 157, 1);
						}
					}
				}
			}
		}
	}

	.No_curriculum {
		width: 100%;
		height: 100%;
		position: relative;
		background-color: #ffffff;
		.icon {
			width: 296upx;
			height: 260upx;
			top: 282upx;
			float: left;
			left: 50%;
			transform: translate(-50%, 0);
			position: absolute;
		}
		.titles {
			width: 260upx;
			text-align: center;
			font-size: 32upx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(102, 102, 102, 1);
			line-height: 50upx;
			top: 592upx;
			left: 50%;
			transform: translate(-50%, 0);
			position: absolute;
		}
		.Selecting_courses {
			width: 376upx;
			height: 80upx;
			text-align: center;
			line-height: 80upx;
			font-size: 36upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: rgba(255, 255, 255, 1);
			background: linear-gradient(-37deg, rgba(42, 193, 124, 1), rgba(42, 193, 145, 1));
			border-radius: 12upx;
			top: 774upx;
			left: 50%;
			transform: translate(-50%, 0);
			position: absolute;
		}
	}
	.input_border::after{
		height: 2upx;
		background-color: rgba(245, 245, 245, 1);
	}
}
</style>
