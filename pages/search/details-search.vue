<template>
	<view class="search">
		<div class="bar">
			<view class="slot_wrap">
				<view class="search_wrap">
					<input confirm-type="search" @confirm="search" placeholder-style="search_wrap_input_placeholder" class="search_wrap_input"
					 type="text" v-model="keyword" :focus="isFocus" placeholder="搜索课程或老师" />
					<text class="search_cancel" @click="cancelText" v-if="keyword"></text>
				</view>
				<view class="navbar_right" @click="goBack">
					<view>取消</view>
				</view>
			</view>
		</div>
		<div class="occupy"></div>
		<view class="statistics" v-if="flag">
			<view class="statistics_text">课程</view>
			<view class="statistics_sum">共{{total}}课</view>
		</view>
		<view class="nullMsg" v-if="nullMsg">
			{{nullMsg}}
		</view>
		<!-- 搜索内容展示 -->
		<view>
			<view class="details" v-for="(item) in mainList" @click="goDetail(item.id)" :key="item.id">
				<view class="details_img">
					<image :src="baseURL+item.cover" lazy-load></image>
				</view>
				<view class="details_desc">
					<view class="details_desc_title" v-if="typeof item.titleFirst == 'string'">
						{{item.titleFirst}}
						<text>{{item.titleMiddle}}</text>
						{{item.titleEnd}}
					</view>
					<view class="details_desc_title" v-else>
						{{item.title}}
					</view>
					<view class="details_desc_author">主讲老师：{{item.teacher_name}}</view>
				</view>
			</view>
			<uni-load-more v-if="flag && mainList.length >= 1" iconType="snow" :status="state" :contentText="content"></uni-load-more>
			<view v-else-if="!flag && mainList.length<1 &&!this.nullMsg" class="notSearch">您还没有搜索任何内容</view>
		</view>

	</view>
</template>

<script>
	import config from "@/config/index.config.js";
	import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue'
	export default {
		data() {
			return {
				keyword: '',
				flag: false,
				mainList: [],
				baseURL: config.iconURL,
				storage: {},
				total: 0,
				isFocus: false,
				page: 1,
				pageSize: 10,
				state: 'loading',
				nullMsg: '',
				content: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "已为您展示所有搜索"
				},
				timeFlag: true,

			}
		},
		components: {
			uniLoadMore
		},
		onReachBottom() {
			if (this.mainList.length >= this.total) {
				this.state = 'noMore'
				return false
			}
			this.page++
			let timer = setTimeout(() => {
				this.getInfo()
				clearTimeout(timer)
			}, 200)
		},
		onLoad() {
			this.state = 'noMore'
			uni.$emit('update',{mes:'shuju'})
		},

		onShow() {
			this.isFocus = true
		},
		watch: {
			keyword() {
				if (!this.keyword) {
					this.mainList = []
					this.flag = false
				}
			}
		},

		methods: {
			search() {
				// 去除搜索内容两端的空格
				this.keyword = this.keyword.trim()
				// 点击搜索重置数据
				this.total = 0
				this.mainList = []
				// 搜索内容为空时的处理
				// 防止用户重复点击搜索
				this.nullMsg = ''
				if (!this.keyword) {
					if (this.timeFlag) {
						this.timeFlag = false
						this.flag = false
						this.state = 'noMore'
						uni.showToast({
							title: '请输入您想搜索的课程或老师',
							icon: 'none',
							duration: 2000
						})
						let timeId = setTimeout(() => {
							this.timeFlag = true
							uni.hideToast()
							clearTimeout(timeId)
						}, 2000)
					}
					return false
				}
				// 隐藏键盘
				uni.hideKeyboard()
				this.page = 1
				this.getInfo()
			},
			// 请求数据
			getInfo() {
				
				this.$api.searchInfo({
					word: this.keyword,
					page: this.page,
					page_size: this.pageSize
				}).then(res => {
					if (res.code === 400 || (typeof res.data.list) === "undefined") {
						this.flag = false
						this.state = 'noMore'
						this.nullMsg = res.msg
						return false
					}
					if (res.code === 200) {
						this.flag = true
						this.state = 'loading'
						this.storage = res.data
						// 搜索标题的数组
						let titleList = []
						// 搜索老师的数组
						let teachers = []
						this.storage.list.forEach(item => {
							// 按标题搜索
							let regexp1 = new RegExp(this.keyword)
							let matchStr = item.title.search(regexp1);
							if (matchStr >= 0) {
								item.flagNum = matchStr
								item.titleFirst = item.title.substr(0, matchStr)
								item.titleMiddle = item.title.substr(matchStr, this.keyword.length)
								item.titleEnd = item.title.substr((matchStr + this.keyword.length))
								titleList.push(item)
							}
							// 按老师名字搜索
							let teacher = item.teacher_name.search(regexp1)
							if (teacher >= 0) {
								teachers.push(item)
							}
						})
						// 排序，去重
						// this.mainList.sort((a, b) => a.flagNum - b.flagNum)
						let newArr = titleList.concat(teachers)
						this.mainList = this.mainList.concat(Array.from(new Set(newArr)))
						// 首次搜索即搜索到全部的条数 改变loadmore值
						if (this.mainList.length >= res.data.total) {
							this.state = 'noMore'
						}
						if (res.data.total <= 99) {
							this.total = res.data.total
						} else if (res.data.total > 99 && res.data.total <= 999) {
							this.total = '99+'
						} else {
							this.total = '999+'
						}
					}
				}).catch(err => console.log(err))
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			goDetail(course_id) {
				uni.navigateTo({
					url: '../study/courseLearning/courseLearning?course_id=' + course_id
				})
			},
			cancelText() {
				this.isFocus = false
				this.keyword = '';
				this.nullMsg = '';
				let tim = setTimeout(() => {
					this.isFocus = true
					clearTimeout(tim)
				}, 30)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search_wrap_input_placeholder {
		font-size: 24upx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
	}

	.search {
		position: relative;
		padding-top: 238upx;
		width: 100%;
		box-sizing: border-box;

		.notSearch {
			position: absolute;
			top: 168upx;
			left: 50%;
			transform: translateX(-50%);
			font-size: 30upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: rgba(153, 153, 153, 1)
		}
	}

	.nullMsg {
		width: 100%;
		text-align: center;
		font-size: 30upx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: rgba(153, 153, 153, 1)
	}

	.bar {
		position: fixed;
		background: rgba(255, 255, 255, 1);
		z-index: 10;
		top: 40upx;
		left: 0;
		height: 88upx;
		width: 100%;
		display: flex;
		align-items: center;


		.slot_wrap {
			display: flex;
			align-items: center;
			flex: 1;

			.search_wrap {
				position: relative;
				height: 60upx;
				background: rgba(245, 245, 245, 1);
				border-radius: 30upx;
				flex: 1;
				margin: 0 32upx;
				display: flex;
				align-items: center;

				.search_wrap_input {
					width:100%;
					// height: 60upx;
					font-size: 24upx;
					// line-height: 60upx;
					padding-left: 85upx;
					font-family: Source Han Sans CN;
					font-weight: 400;
					color: rgba(153, 153, 153, 1)
				}

				.search_cancel {
					z-index: 99;
					position: absolute;
					width: 28upx;
					height: 28upx;
					top: 50%;
					transform: translateY(-50%);
					right: 30upx;
					background: url('../../static/detail_cancel.jpg') no-repeat;
					background-size: 28upx 28upx;
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
				background: url('../../static/detail_search.jpg') no-repeat;
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
		}
	}

	.occupy {
		position: fixed;
		background: rgba(255, 255, 255, 1);
		z-index: 4;
		top: 0;
		left: 0;
		width: 100%;
		height: 40upx;
	}

	.statistics {
		position: fixed;
		top: 128upx;
		left: 0;
		z-index: 4;
		width: 100%;
		padding: 25upx 32upx 0 34upx;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 1);

		.statistics_text {
			font-size: 40upx;
			font-family: Source Han Sans CN;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
		}

		.statistics_sum {
			font-size: 28upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: rgba(64, 213, 134, 1);
		}
	}

	.details {
		width: 100%;
		height: 144upx;
		padding: 0 32upx;
		box-sizing: border-box;
		display: flex;
		font-size: 0;
		margin-bottom: 82upx;

		image {
			width: 256upx;
			height: 144upx;
			margin-right: 30upx;
		}
	}

	.details_desc {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		font-size: 0;

		.details_desc_title {
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(68, 68, 68, 1);
			font-size: 28upx;
			letter-spacing: 2upx;

			text {
				color: #40D586;
			}
		}

		.details_desc_author {
			font-size: 24upx;
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(157, 157, 157, 1);
			line-height: 24upx;
		}
	}
</style>
