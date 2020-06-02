<template>
	<view class="content">
		<!-- 导航栏 -->
		<hx-navbar class="bar" title="名师课" backTabbarUrl="/pages/home/home" fixed>
			<view slot="right" class="bar_right" @click="goSearch">
				<image src="../../static/detail_search.png"></image>
			</view>
		</hx-navbar>
		<!-- 课程分类 -->
		<view class="classification_position">
			<view class="classification">
				<view class="classification_item" v-for='(item,index) in CourseCategory' :key='index' :class="[ind==index?'acitve':'']"
				 @click="chooseKind(item.id,index)">
					{{item.type_name}} 
				</view>
			</view>
			<!-- 每类总数 -->
			<view class="classification_total" v-if="total">共{{total}}个内容</view>
		</view>
		<!-- 每个类主要内容 -->
		<view class="every_main">
			<view class="every_main_contain" v-for="(item,index) in courseList" :key="index" @click="goCourseDetail(item.id)">
				<view class="every_main_img">
					<image :src="iconURL + item.cover"></image>
				</view>
				<view class="every_main_text">
					<div class="every_main_text_title">{{item.title}}</div>
					<div class="every_main_text_teacher">主讲老师：{{item.teacher_name}}</div>
				</view>
			</view>
		</view>
		<view>
			<uni-load-more :status="status" iconType="snow" :contentText="content"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import hxNavbar from "@/components/hx-navbar/hx-navbar.vue"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default {
		components: {
			hxNavbar,
			uniLoadMore
		},
		data() {
			return {
				CourseCategory: [],
				ind: 0,
				kindId: 0,
				page: 1,
				pageSize: 10,
				courseList: [],
				total: 0,
				status: '',
				content: {
					contentdown: "当前没有更多课程",
					contentrefresh: "正在加载...",
					contentnomore: "已为您展示全部课程"
				},
				// 
				idList: [],
				
			}
		},
		onLoad(v) {
			this.kindId = v.kindId
			this.ind = v.index
			this.getCourseCategory()
			// 获取全部课程
			console.log(v.kindId)
			this.getMoreCourse(this.kindId);

		},
		onShow() {
		},
		computed: {
			iconURL() {
				return this.$iconURL;
			},
		},
		onPullDownRefresh() {
			this.courseList = []
			this.page = 1
			this.getMoreCourse(this.kindId)
		},
		onReachBottom() {
			console.log('触底了')
			if (this.courseList.length >= this.total) {
				return false
			}
			let tim = setTimeout(() => {
				console.log('还有数据')
				this.page++
				this.getMoreCourse(this.kindId, this.page)
				clearTimeout(tim)
			}, 1000)

		},
		methods: {
			getCourseCategory() {
				//获取课程分类
				this.$api.getCourseCategory().then(res => {
					if (res.code != 200) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					} else {
						this.CourseCategory = [{
							icon:'../../static/img/all.png',
							id:0,
							type_name:'全部'
						},...res.data]
					}
				});
			},
			// 搜索按钮去往搜索页面
			goSearch() {
				uni.navigateTo({
					url: "../search/details-search"
				})
			},
			// 本页面点击选择类别
			chooseKind(kindId, index) {
				this.ind = index
				if (this.kindId == kindId) {
					return false
				}
				this.page = 1
				this.courseList = []
				this.kindId = kindId
				this.getMoreCourse(this.kindId);
			},
			// 获取更多课程
			getMoreCourse(kindId, page = 1) {
				this.$api.getMoreCourse({
					category_id: kindId || '',
					label_id: 0,
					page: page,
					page_size: this.pageSize
				}).then(res => {
					if (res.code !== 200) {
						console.log('获取课程失败')
						return false
					}
					uni.stopPullDownRefresh()
					console.log(res.data.data)
					this.courseList = this.courseList.concat(res.data.data)
					this.total = res.data.total
					if (this.courseList.length == 0 && this.total == 0) {
						this.status = "more"
					} else if (this.courseList.length < this.total) {
						this.status = "loading"
					} else {
						this.status = "noMore"
					}


				}).catch(err => console.log(err))
			},
			// 跳转到课程详情页
			goCourseDetail(course_id) {
				uni.navigateTo({
					url: '../study/courseLearning/courseLearning?course_id=' + course_id
				})
			},
			back(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
	}

	.bar {
		font-size: 0;
		.bar_right {
			position: absolute;
			right: 32upx;
			width: 28upx;
			height: 28upx;
			font-size: 0;
			image {
				position: absolute;
				top:0;
				left:0;
				width: 28upx;
				height: 28upx;
			}
		}
	}

	.classification_position {
		position: fixed;
		z-index: 99;
		background-color: #FFFFFF;

		// 课程分类
		.classification {
			margin: 16upx 32upx 0;
			display: flex;
			flex-wrap: wrap;
			font-size: 24upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: rgba(42, 43, 62, 1);
			
			.classification_item {
				text-align: center;
				margin: 0 20upx 20upx 0;
				width: 120upx;
				height: 60upx;
				line-height: 60upx;
				background: rgba(247, 245, 252, 1);
				border-radius: 30px;
			}

			:nth-child(5n) {
				margin-right: 0;
			}

			.acitve {
				color: rgba(255, 255, 255, 1);
				background-color: #40D586;
			}
		}

		.classification_total {
			margin-top: 10upx;
			margin-left: 32upx;
			margin-bottom: 30upx;
			font-size: 28upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
		}
	}

	// 每个类的主要内容
	.every_main {
		padding-top: 290upx;
		/* #ifdef APP-PLUS */
		padding-top: 260upx;
		/* #endif */
		margin: 0 32upx;

		.every_main_contain {
			font-size: 0;
			display: flex;
			padding-bottom: 32upx;
			border-bottom: 2upx solid rgba(245, 245, 245, 1);
			margin-bottom: 42upx;

			.every_main_img {
				margin-right: 30upx;
				width: 256upx;
				height: 144upx;
				border-radius: 12upx;

				image {
					width: 256upx;
					height: 144upx;
					border-radius: 12upx;
				}
			}

			.every_main_text {
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.every_main_text_title {
					font-size: 28upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: rgba(68, 68, 68, 1);
					letter-spacing: 2upx;
				}

				.every_main_text_teacher {
					font-size: 24upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: rgba(157, 157, 157, 1);
				}
			}
		}
	}
</style>
