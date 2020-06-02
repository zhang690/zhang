<template>
	<view id="home" @click.stop="hideSphere" v-show="pageShow">
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- 轮播图 -->
		<view class="search">
			<view class="bar">
				<view class="slot_wrap">
					<view class="search_wrap">
						<input placeholder-style="color: rgba(153, 153, 153, 1)" class="search_wrap_input" type="text" placeholder="搜索课程或老师"
						 disabled @click="goDitailsSearch" />
					</view>

					<view class="navbar_right">
						<view @click="goDitailsSearch">搜索</view>
					</view>
				</view>
			</view>
			<div class="occupy"></div>
		</view>
		<view class="bw-swiper_box">
			<bw-swiper :autoplay="true" :swiperList="swiperList" :swiperType="swiperType" class="bw-swiper" indicatorColor="#666666"
			 indicatorActiveColor="#26D192" @clickItem="link_url" v-if="pageShow"></bw-swiper>
		</view>

		<!-- 课程分类 -->
		<view class="course_classify">
			<view class="course_classify_item" v-for="(item, index) of CourseCategory" :key="index" @click="goDetail(item.id,index)">
				<image :src="item.baseIcon ? item.baseIcon: iconURL + item.icon" mode="aspectFill"></image>
				<view class="type_name">{{ item.type_name }}</view>
			</view>
		</view>
		<!-- 小树公开课 -->
		<view class="open_class">
			<view class="open_class_top">
				<view class="titles">小树公开课</view>
				<view class="more" @click="open_class_more">
					更多
					<uni-icons :size="18" class="uni-icon-wrapper" color="rgba(140,140,140,1);" type="arrowright" />
				</view>
			</view>
			<view class="videoList">
				<view class="videoList_item" v-for="(item, index) of videoList" :key="index" @click="toVideo(item)">
					<image :src="iconURL + item.video_coverimg" mode="aspectFill"></image>
					<view class="hot"><text class="hot_text">hot</text></view>
					<view class="love">
						<view class="love_box">
							<view class="love_icon"></view>
							<text class="love_text">{{ item.good_num }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 专题 -->
		<view class="SpecialSubjectCourse" v-for="(course, courseIndex) of SpecialSubjectCourse" :key="courseIndex">
			<view class="title">{{ course.name }}</view>
			<view class="list">
				<view class="list_item" v-for="(item, index) of course.course" :key="index" @click="courseLearning(item)">
					<image :src="iconURL + item.cover" mode="aspectFill"></image>
					<view class="item_title">{{ item.title }}</view>
					<view class="item_bottom">
						<view class="item_name">{{ item.teacher_name }}</view>
						<view class="item_price">
							<text v-if="typeOfs(item.price)">￥{{ item.price }}</text>
							<text>{{ item.price }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 推荐课程 -->
		<view class="recommendedCourse">
			<view class="title">推荐课程</view>
			<view class="list">
				<view class="list_item" v-for="(item, index) of Course_list" :key="index" @click="courseLearning(item)">
					<image :src="iconURL + item.cover" mode="aspectFill"></image>
					<view class="item_title">{{ item.title }}</view>
					<view class="item_bottom">
						<view class="item_name">{{ item.teacher_name }}</view>
						<view class="item_price">
							<text v-if="typeOfs(item.price)">￥{{ item.price }}</text>
							<text>{{ item.price }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!--3使用组件 -->
		<uni-load-more :status="status" :size="16" :content-text="contentText" v-if="Course_list.length >= pagesize" />
		<!-- 播放球 -->
		<music-sphere v-show="sphereExist" ref="sphere" :percent="currentTime"></music-sphere>
	</view>
</template>

<script>
	import bwSwiper from '@/components/bw-swiper/bw-swiper';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	export default {
		computed: {
			sphereExist() {
				return this.$store.state.musicPlayer.sphereExist;
			},
			iconURL() {
				return this.$iconURL;
			},
			currentTime() {
				return this.$store.state.musicPlayer.currentTime;
			},
			token() {
				return this.$store.state.user.token;
			},
			sphereShow() {
				return this.$store.state.musicPlayer.sphereShow;
			}
		},
		components: {
			bwSwiper,
			uniLoadMore,
			uniIcons
		},
		data() {
			return {
				pageShow: false,
				swiperType: true,
				total: '',
				reload: false,
				page: 1,
				pagesize: 10,
				cardCur: 0,
				swiperList: [], //轮播图
				dotStyle: false,
				towerStart: 0,
				direction: '',
				CourseCategory: [],
				SpecialSubjectCourse: [],
				videoList: [],
				list: [{
						imgUrl: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg',
						name: '钟南山',
						title: '怎么和青春期孩子斗智斗勇',
						price: 12.8
					},
					{
						imgUrl: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg',
						name: '钟南山',
						title: '怎么和青春期孩子斗智斗勇怎么和青春期孩子斗智斗勇怎么和青春期孩子斗智斗勇',
						price: '免费'
					},
					{
						imgUrl: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg',
						name: '钟南山',
						title: '怎么和青春期孩子斗智斗勇',
						price: 9.9
					},
					{
						imgUrl: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg',
						name: '钟南山',
						title: '怎么和青春期孩子斗智斗勇',
						price: 9.9
					}
				],
				Course_list: [],
				pages: 'home',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				status: 'more'
			};
		},
		onLoad() {
			this.getCourse();

			// #ifdef APP-PLUS
			const apple_receipt = uni.getStorageSync('ticket');
			// console.log(apple_receipt, 7444);
			if (apple_receipt) {
				this.$api
					.acceptApplePayInfo({
						apple_receipt: apple_receipt
					})
					.then(res => {
						console.log(res);
						if (res.code == 200) {
							console.log(res);
							uni.removeStorageSync('ticket');
						} else if (res.code == 1800) {
							uni.showModal({
								content: res.msg,
								showCancel: false
							});
							uni.removeStorageSync('ticket');
						} else {
							uni.showModal({
								content: res.msg,
								showCancel: false
							});
						}
					});
			}

			// #endif
		},
		methods: {
			goDetail(id, index) {
				uni.navigateTo({
					url: '../famous/famous?kindId=' + id + '&index=' + index
				})
			},

			open_class_more() {
				uni.navigateTo({
					url: '../video/Category/Category'
				});
			},
			goDitailsSearch() {
				uni.navigateTo({
					url: '../search/details-search'
				});
			},

			toVideo(item) {
				console.log(item.id);
				try {
					uni.setStorageSync('videId', item.id);
					const value = uni.getStorageSync('videId');
					console.log(value);
					if (value) {
						uni.navigateTo({
							url: '../video/index?id=' + item.id
						});
					}
				} catch (e) {
					// error
				}
			},
			getSpecialSubjectCourse() {
				//获取专题
				this.$api.getSpecialSubjectCourse().then(res => {

					if (res.code != 200) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					} else {
						this.SpecialSubjectCourse = res.data;
					}
				});
			},
			videoIndex() {
				//获取小树推荐课
				this.$api.videoIndex({
					page: 1,
					pagesize: 3
				}).then(res => {
					// console.log(res)
					if (res.code != 200) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					} else {
						let data = res.data;
						this.videoList = data.list;
					}
				});
			},
			getCourseCategory() {
				//获取课程分类
				this.$api.getCourseCategory().then(res => {

					if (res.code != 200) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					} else {
						let data = res.data;
						this.CourseCategory = data;
						let allObj = {
							baseIcon:'../../static/img/all.png',
							id:0,
							type_name:'全部'
						}
						this.CourseCategory.unshift(allObj)
					}
				});
			},
			hideSphere() {
				if (!this.sphereExist && !this.sphereShow) {
					return false;
				} else {
					this.$refs.sphere.hide();
				}
			},
			getAdv() {
				//获取轮播图
				this.$api.getAdv().then(res => {
					if (res.code == 1001) {
						this.$store.dispatch('reLogin');
						return;
					}
					if (res.code == 200) {
						let list = res.data.list;
						// console.log(JSON.stringify(list));
						list.map((v, i) => {
							v.type = 'image';
						});
						this.swiperList = list;
					}
				});
			},
			async getCourse() {
				let parmas = {
					page: this.page,
					page_size: this.pagesize
				};
				let res = await this.$api.getCourse(parmas);
				if (res.code == 1001) {
					that.$store.dispatch('reLogin');
					return;
				}
				if (res.code == 200) {
					this.pageShow = true;
					this.total = res.data.total;
					this.Course_list = this.reload ? this.Course_list.concat(res.data.data) : res.data.data;
					uni.stopPullDownRefresh();
				}
				this.getAdv();
				this.videoIndex();
				this.getCourseCategory();
				this.getSpecialSubjectCourse();
			},
			typeOfs(v) {
				return typeof v === Number;
			},
			link_url(item) {
				//跳转页面
				switch (item.url_type) {
					case 1:
						// #ifdef APP-PLUS
						plus.runtime.openURL(item.url, function(res) {
							console.log(res);
						});
						// #endif

						// #ifdef H5
						window.location.href = item.url;
						// #endif

						break;
					default:
						if (item.jump_type == 1) {
							//跳课程目录
							let id = item.jump_id;
							this.$mRouter.push({
								route: this.$mRoutesConfig.course,
								query: {
									course_id: item.jump_id
								}
							});
						}
						break;
				}
				// console.log(item);
			},
			// cardSwiper
			cardSwiper(e) {
				this.cardCur = e.detail.current;
			},

			courseLearning(item) {
				uni.navigateTo({
					url: '../study/courseLearning/courseLearning?course_id=' + item.id
				});
			}
		},

		onPageScroll() {
			this.hideSphere();
		},
		onPullDownRefresh() {
			this.reload = false;
			this.page = 1;
			this.getCourse();
		},
		onReachBottom() {
			this.page++;
			//上拉加载
			this.reload = true;
			this.status = 'more';
			let tem = setTimeout(() => {
				if (this.total > this.Course_list.length) {
					this.getCourse();
				} else {
					this.status = 'noMore';
				}
				clearTimeout(tem);
			}, 200);
		}
	};
</script>

<style lang="scss">
	#home {
		width: 100%;
		overflow-x: hidden;
		padding-top: 78upx;

		.search {
			width: 100%;
			position: fixed;
			top: var(--status-bar-height);
			z-index: 10;
			background-color: #fff;

			.bar {
				// position: fixed;
				// background: rgba(255, 255, 255, 1);
				// z-index: 10;
				// top: 40upx;
				// left: 0;
				width: 100%;
				height: 88upx;
				display: flex;
				align-items: center;
			}

			.search_wrap {
				position: relative;
				height: 60upx;
				background: rgba(245, 245, 245, 1);
				border-radius: 30upx;
				flex: 1;
				margin: 0 32upx;

				.search_wrap_input {
					height: 60upx;
					font-size: 24upx;
					line-height: 60upx;
					padding-left: 85upx;
					font-family: Source Han Sans CN;
					font-weight: 400;
					color: rgba(153, 153, 153, 1);
				}
			}

			.search_wrap::before {
				content: '';
				width: 28upx;
				height: 28upx;
				position: absolute;
				left: 32upx;
				top: 50%;
				transform: translateY(-50%);
				background: url(../../static/detail_search.jpg) no-repeat;
				background-size: 28upx 28upx;
			}

			.navbar_right {
				margin-right: 30upx;
				display: flex;
				font-size: 26upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
			}

			.slot_wrap {
				display: flex;
				align-items: center;
				flex: 1;
			}
		}

		.bw-swiper_box {
			width: 100%;
			margin: 24upx 0 50upx 0;
		}

		.bw-swiper {
			width: 100%;
			height: 338upx;
			overflow-y: hidden;
		}

		.course_classify {
			display: flex;
			flex-wrap: wrap;
			width: 750rpx;
			margin: 0upx 36upx;
			margin-bottom: 20upx;
			white-space: nowrap;

			.course_classify_item {
				text-align: center;
				width: 88upx;
				height: 125upx;
				margin-right: 60rpx;
				margin-bottom: 30upx;

				image {
					width: 80upx;
					height: 80upx;
				}

				.type_name {
					font-size: 22upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: rgba(51, 51, 51, 1);
				}
			}

			:nth-child(5n) {
				margin-right: 0;
			}
		}

		.open_class {
			margin: 0 32upx 60upx 32upx;

			.open_class_top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 26upx;

				.titles {
					font-size: 40rpx;
					font-family: Source Han Sans CN;
					font-weight: bold;
					font-style: italic;
					color: rgba(51, 51, 51, 1);
					position: relative;
					padding-left: 24upx;
				}

				.titles::after {
					content: '';
					position: absolute;
					width: 8rpx;
					height: 30rpx;
					background: rgba(64, 213, 134, 1);
					border-radius: 10rpx;
					left: 0;
					top: 50%;
					margin-top: -15rpx;
				}

				.more {
					font-size: 22rpx;
					font-family: Source Han Sans CN;
					font-weight: 400;
					color: rgba(119, 119, 119, 1);
					display: flex;
					align-items: center;
				}
			}

			.videoList {
				display: flex;
				justify-content: space-between;

				.videoList_item {
					position: relative;
					width: 216rpx;
					height: 282rpx;
					background: rgba(196, 196, 196, 1);
					border-radius: 10upx;

					image {
						width: 100%;
						height: 100%;
						border-radius: 10upx;
						border-top-left-radius: 16upx;
					}

					.hot {
						display: block;
						width: 74upx;
						height: 74upx;
						background-image: url(../../static/images/home/hot.png);
						background-size: 100% 100%;
						position: absolute;
						top: 0;
						left: 0;

						.hot_text {
							display: block;
							font-size: 24upx;
							font-family: Source Han Sans CN;
							font-weight: 500;
							color: rgba(255, 255, 255, 1);
							transform: rotate(-45deg);
							position: absolute;
							left: 4upx;
							top: 6upx;
						}
					}

					.love {
						width: 100%;
						height: 140upx;
						position: absolute;
						bottom: 0rpx;
						background: rgba(51, 51, 51, .2);

						.love_box {
							display: flex;
							align-items: center;
							position: absolute;
							bottom: 16rpx;
						}

						.love_icon {
							width: 21rpx;
							height: 18rpx;
							background-image: url(../../static/images/home/love.png);
							background-size: 100% 100%;
							margin: 0 8upx 0 22upx;
						}

						.love_text {
							font-size: 24upx;
							font-family: Source Han Sans CN;
							font-weight: 500;
							color: rgba(255, 255, 255, 1);
						}
					}
				}
			}
		}

		.title {
			font-size: 40rpx;
			font-family: Source Han Sans CN;
			font-weight: bold;
			font-style: italic;
			color: rgba(51, 51, 51, 1);
			position: relative;
			padding-left: 24upx;
			margin-left: 32upx;
		}

		.title::after {
			content: '';
			position: absolute;
			width: 8rpx;
			height: 30rpx;
			background: rgba(64, 213, 134, 1);
			border-radius: 10rpx;
			left: 0;
			top: 50%;
			margin-top: -15rpx;
		}

		.list {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			margin: 30upx 32upx;
			margin-bottom: 0;

			.list_item {
				width: 328upx;
				background: rgba(255, 255, 255, 1);
				box-shadow: 0px 1upx 10upx 0px rgba(204, 204, 204, 0.35);
				border-radius: 12upx;
				margin-bottom: 30upx;

				image {
					width: 328upx;
					height: 184upx;
					border-radius: 12upx 12upx 0px 0px;
				}

				.item_title {
					font-size: 32upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: rgba(0, 0, 0, 1);
					margin: 17upx 20upx 10upx 17upx;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
					line-height: 40upx;
					min-height: 80upx;
					// line-height:40px;
				}

				.item_bottom {
					display: flex;
					justify-content: space-between;
					margin: 0 16upx;
					margin-bottom: 10upx;
					align-items: center;

					.item_name {
						font-size: 24upx;
						font-family: Source Han Sans CN;
						font-weight: bold;
						color: rgba(157, 157, 157, 1);
					}

					.item_price {
						font-size: 32upx;
						font-family: PingFang SC;
						font-weight: bold;
						color: rgba(239, 92, 65, 1);
					}
				}
			}
		}
	}
</style>
