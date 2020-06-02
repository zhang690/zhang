<template>
	<view class="category">
		<view class="wrap" v-if="list.length > 1">
			<!-- <view class="u-tabs-box">
				<uni-swipes activeColor="#40D586" ref="tabs" :list="list" :current="current" @change="change" :is-scroll="false" swiperWidth="750"></uni-swipes>
			</view> -->

			<view class="u-tabs-out">
				<view class="u-tabs-box" v-if="list">
					<view
						:style="{ padding: `0 50rpx` }"
						@click="change(index)"
						:class="['u-tabs-item', { active: swiperCurrent == index }]"
						v-for="(item, index) of list"
						:key="index"
					>
						{{ item.name }}
					</view>
				</view>
			</view>
			<view class="videList">
				<view class="videList_item" v-for="(item, index) of videoList" :key="index" @click="toVideo(item)">
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
			<!--3使用组件 -->
			<uni-load-more :status="status" :size="16" :content-text="contentText" v-if="videoList.length >= pagesize" />
			<!-- <swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-items" v-for="(items, swiperIndex) of list" :key="swiperIndex">
					<view class="videList">
						<view class="videList_item" v-for="(item, index) of videList" :key="index" @click="toVideo(item)">
							<image :src="iconURL + item.video_coverimg" mode="aspectFill"></image>
							<view class="hot"><text class="hot_text">hot</text></view>
							<view class="love">
								<view class="love_icon"></view>
								<text class="love_text">{{ item.good_num }}</text>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper> -->
		</view>
	</view>
</template>

<script>
export default {
	computed: {
		iconURL() {
			return this.$iconURL;
		}
	},
	data() {
		return {
			page: 1,
			pagesize: 6,
			total: '',
			reload: false,
			list: [
				{
					name: '全部',
					id: 0
				}
			],
			current: 0,
			swiperCurrent: 0,
			videoList: [],
			contentText: {
				contentdown: '上拉加载更多',
				contentrefresh: '加载中',
				contentnomore: '没有更多'
			},
			status: 'more'
		};
	},
	methods: {
		// tab栏切换
		change(index) {
			console.log(index);
			this.swiperCurrent = index;
			this.page = 1;
			this.reload = false;
			this.videoIndex();
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 300
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
						url: '../../video/index?id=' + item.id
					});
				}
			} catch (e) {
				// error
			}
		},
		videoCategory() {
			//视频分类
			this.$api.videoCategory().then(res => {
				console.log(res);
				if (res.code != 200) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				} else {
					this.list = [ ...this.list,...res.data];
				}
			});
		},
		videoIndex() {
			//视频列表
			let parmas = {
				page: this.page,
				pagesize: this.pagesize,
				category_id: this.list[this.swiperCurrent].id || 0
			};
			this.$api.videoIndex(parmas).then(res => {
				if (res.code != 200) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				} else {
					this.total = res.data.total;
					uni.stopPullDownRefresh();
					this.videoList = this.reload ? [...this.videoList, ...res.data.list] : res.data.list;
				}
			});
		}
	},
	async onLoad() {
		await this.videoCategory();
		this.change(0);
	},
	onPullDownRefresh() {
		this.reload = false;
		this.page = 1;
		this.videoCategory();
		this.change(this.swiperCurrent);
	},
	onReachBottom() {
		this.page++;
		//上拉加载
		this.reload = true;
		this.status = 'more';
		let tem = setTimeout(() => {
			console.log(this.total > this.videoList.length);
			if (this.total > this.videoList.length) {
				this.videoIndex();
			} else {
				this.status = 'noMore';
			}
			clearTimeout(tem);
		}, 200);
	}
};
</script>

<style lang="less">
.category {
	width: 100%;
}
.wrap {
	display: flex;
	width: 100%;
	flex-direction: column;
	min-height: 100%;
	.u-tabs-out {
		overflow-x: auto;
		position: fixed;
		z-index: 10;
		width: 100%;
		white-space: nowrap;
		height: 130upx;
		padding-left: 32rpx;
	}
	.u-tabs-box {
		display: flex;
		.u-tabs-item {
			display: inline-block;
			padding: 0 50rpx;
			font-size: 30upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: rgba(51, 51, 49, 1);
		}
		.active {
			font-size: 34upx;
			font-weight: 800;
			color: rgba(20, 20, 19, 1);
			position: relative;
		}
		.active::after {
			content: '';
			position: absolute;
			width: 30rpx;
			height: 8rpx;
			background: rgba(64, 213, 134, 1);
			border-radius: 3rpx;
			bottom: -20upx;
			left: 50%;
			transform: translateX(-50%);
		}
		:first-child {
		}
		:last-child {
			padding-left: 32rpx;
		}
	}

	.videList {
		display: flex;
		flex-wrap: wrap;
		padding: 120upx 32upx;
		justify-content: space-between;
	}
	.videList_item {
		width: 330upx;
		height: 450upx;
		position: relative;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0upx 2upx 10upx 0px rgba(26, 13, 0, 0.1);
		border-radius: 10upx;
		margin-bottom: 30upx;
		image {
			width: 330upx;
			height: 450upx;
			border-radius: 10upx;
		}
		.hot {
			display: block;
			width: 74upx;
			height: 74upx;
			background-image: url(../../../static/images/home/hot.png);
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
			height:140upx;
			position: absolute;
			bottom: 0rpx;
			background:rgba(51,51,51,.2);
			.love_box{
				display: flex;
				align-items: center;
				position: absolute;
				bottom: 16rpx;
			}
			.love_icon {
				width: 21rpx;
				height: 18rpx;
				background-image: url(../../../static/images/home/love.png);
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
	// .swiper-box {
	// 	padding: 130upx 32upx;
	// 	height: 160vh;
	// 	.swiper-items {
	// 		width: 100%;

	// 	}
	// }
}
</style>
