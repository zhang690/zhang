<template>
	<view id="myLove">
		<view class="videList">
			<view class="videList_item" v-for="(item, index) of videoList" :key="index" @click="toVideo(item)">
				<image :src="iconURL + item.video_info.video_coverimg" mode="aspectFill"></image>
				
				<view class="love">
					<view class="love_box">
						<view class="love_icon"></view>
						<text class="love_text">{{ item.video_info.good_num }}</text>
					</view>
				</view>
			</view>
		</view>
		<!--3使用组件 -->
		<uni-load-more :status="status" :size="16" :content-text="contentText" v-if="videoList.length >= pagesize" />
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
			pagesize: 8,
			total: '',
			reload: false,
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
		toVideo(item) {
			console.log(item.video_info.id);
			try {
				uni.setStorageSync('videId', item.video_info.id);
				const value = uni.getStorageSync('videId');
				console.log(value);
				if (value) {
					uni.navigateTo({
						url: '../../video/index?id=' + item.video_info.id
					});
				}
			} catch (e) {
				// error
			}
		},
		videoMyLike() {
			//视频列表
			let parmas = {
				page: this.page,
				pagesize: this.pagesize
			};
			this.$api.videoMyLike(parmas).then(res => {
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
		await this.videoMyLike();
	},
	onPullDownRefresh() {
		this.reload = false;
		this.page = 1;
		this.videoMyLike();
	},
	onReachBottom() {
		this.page++;
		//上拉加载
		this.reload = true;
		this.status = 'more';
		let tem = setTimeout(() => {
			console.log(this.total > this.videoList.length);
			if (this.total > this.videoList.length) {
				this.videoMyLike();
			} else {
				this.status = 'noMore';
			}
			clearTimeout(tem);
		}, 200);
	}
};
</script>

<style lang="scss">
#myLove {
	width: 100%;
	.videList {
		display: flex;
		flex-wrap: wrap;
		padding: 54upx 32upx;
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
}
</style>
