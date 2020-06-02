<template>
	<view id="My_balance">
		<view class="title">
			<view class="left">账户余额</view>
			<view class="right">
				<view class="number">{{ money }}</view>
				<view class="d">点</view>
			</view>
		</view>
		<view class="map">
			<view class="list" :class="isactive == index ? 'list_xz' : ''" v-for="(item, index) of list" :key="index" @click="moneys(index, item)">
				<view class="xnb" :class="isactive == index ? 'xnb_xz' : ''">{{ item.platform_money }}点</view>
				<view class="rmb">{{ item.regular_money }}元</view>
			</view>
		</view>
		<button class=" uni-padding-wrap Confirm_recharge ipaPayBtn" :class="confirm ? 'confirm' : ''" @click="confirms" :loading="loading" :disabled="disabled">确认充值</button>
		<!-- <view class="confirm">确认充值</view> -->
		<view class="statement">
			<view class="statement_list">1.我的账户内的余额可直接购买是APP内的课程。</view>
			<view class="statement_list">2.账户余额仅在iOS 系统内消费，无法在其他系统使用。</view>
			<view class="statement_list">3.充值成功后，本账户的账户余额无法提现或转增他人。</view>
		</view>
		<!-- <uni-popup class="tc" v-if="confirm == 1" :show="true" type="middle" msg="popup 文字内容"></uni-popup> -->
	</view>
</template>

<script>
let iapChannel = null,
	productId = 'listeningtrees1',
	productIds = [
		'listeningtrees1',
		'listeningtrees6',
		'listeningtrees12',
		'listeningtrees108',
		'listeningtrees208',
		'listeningtrees488',
		'listeningtrees998',
		'listeningtrees1048',
		'listeningtrees1498'
	];
export default {
	// components: { uniPopup },
	computed: {
		hasLogin() {
			return this.$store.state.user.hasLogin;
		},
		token() {
			return this.$store.state.user.token;
		},
		uuid() {
			return this.$store.state.user.uuid;
		}
	},
	data() {
		return {
			course_id: '',
			productId: 0, //苹果商品id
			productIds: [], //苹果商品id数组
			title: 'request-payment',
			loading: false,
			disabled: true,
			confirm: false,
			money: '0.00', //账户余额
			Recharge_amount: 0.0, //充值金额
			isactive: -1,
			list: []
		};
	},
	async onLoad(v) {
		if (v.course_id) {
			this.course_id = v.course_id;
		}
		await this.getMyWallet();
		await this.getChannels();
	},
	methods: {
		requestPayments() {
			console.log(iapChannel);
			var that = this;
			plus.nativeUI.showWaiting('', { style: 'black', background: 'rgba(0,0,0,0)' });
			plus.payment.request(
				iapChannel,
				{ productid: that.productId },
				function(result) {
					// console.log('获取到channel' + JSON.stringify(result));
					that.paymentTicket(JSON.stringify(result));
					plus.nativeUI.alert(
						'支付成功：感谢你的支持，我们会继续努力完善产品。',
						function() {
							console.log('获取到channel' + JSON.stringify(result));
						},
						'捐赠'
					);
				},
				function(e) {
					plus.nativeUI.closeWaiting();
					plus.nativeUI.alert('错误信息：' + e.message, null, '支付失败：' + e.code);
				}
			);
		},
		async getChannels() {
			let that = this;
			await plus.payment.getChannels(
				channels => {
					for (var i in channels) {
						var channel = channels[i];
						if (channel.id === 'appleiap') {
							iapChannel = channel;
							that.requestOrder();
						}
					}
					if (!iapChannel) {
						that.errorMsg();
					}
				},
				error => {
					that.errorMsg();
				}
			);
		},
		confirms() {
			if (!this.confirm) {
				uni.showToast({
					title: '请选择商品',
					icon: 'none'
				});
				return;
			}
			let self = this;
			if (!this.hasLogin) {
				plus.nativeUI.actionSheet(
					{
						title: '登录账户可跨平台使用,永不丢失，游客模式充值,仅限本设备使用且容易丢失无法找回',
						cancel: '取消',
						buttons: [
							{
								title: '登录账户充值（推荐）'
							},
							{
								title: '游客充值'
							}
						]
					},
					function(e) {
						if (e.index == 1) {
							self.$store.dispatch('reLogin');
						} else if (e.index == 2) {
							self.requestPayment();
						}
					}
				);
			} else {
				self.requestPayment();
			}
		},
		moneys(index, item) {
			this.isactive = index;
			if (this.isactive == index) {
				this.confirm = true;
			} else {
				this.confirm = false;
			}
			this.productId = item.productid;
		},
		async getMyWallet() {
			let res = await this.$api.getRechargeBalanceList();
			if (res.code == 200) {
				this.money = res.data.balance;
				this.list = res.data.list;
				this.list.map(v => {
					this.productIds.push(v.productid);
				});
			}
		},
		async requestOrder() {
			// 获取订单
			uni.showLoading({
				title: '检测支付环境...'
			});
			let that = this;
			
			// iapChannel.restoreComplateRequest(
			// 	{ username: 'waipptt' },
			// 	v => {
			// 		console.log('获取已经购买项目成功：' + v.length);
			// 		if (v.length <= 0) return;
			// 		let temp = { apple_receipt: JSON.stringify(v) };
			// 		console.log('获取已经购买项目成功111：', temp);
			// 		// that.$api.acceptApplePayInfo(temp).then(res => {
			// 		// 	if (res.code == 200) {
			// 		// 		console.log(res, 220222);
			// 		// 	}
			// 		// });
			// 	},
			// 	errormsg => {
			// 		console.log('获取支付通道失败：' + errormsg.message);
			// 	}
			// );
			 iapChannel.requestOrder(
				this.productIds,
				orderList => {
					//必须调用此方法才能进行 iap 支付
					this.disabled = false;
					// console.log('requestOrder success666: ' + JSON.stringify(orderList));
					uni.hideLoading();
				},
				e => {
					console.log('requestOrder failed: ' + JSON.stringify(e));
					uni.hideLoading();
					this.errorMsg();
				}
			);
		},
		requestPayment(e) {
			//发起支付
			this.loading = true;
			this.disabled = true;
			console.log(this.productId, 197);
			uni.requestPayment({
				provider: 'appleiap',
				orderInfo: {
					productid: this.productId
				},
				success: e => {
					console.log('充值回调');
					let arr = [];
					let apple_receipts = uni.getStorageSync('ticket');
					if (apple_receipts) {
						apple_receipts = JSON.parse(apple_receipts);
						apple_receipts.push(JSON.stringify(e));
						uni.setStorageSync('ticket', JSON.stringify(apple_receipts));
					} else {
						arr.push(JSON.stringify(e));
						uni.setStorageSync('ticket', JSON.stringify(arr));
					}
					let apple_receipt = uni.getStorageSync('ticket');
					console.log(apple_receipt,265)
					this.$api.acceptApplePayInfo({ apple_receipt: apple_receipt }).then(res => {
						if (res.code == 200) {
							this.disabled = false;
							uni.removeStorageSync('ticket');
							this.$nextTick(() => {
								this.money = res.data.balance;
							});
							uni.showModal({
								content: '充值成功，愉快的购课吧！',
								showCancel: false
							});
						} else if (res.code == 1800) {
							uni.showModal({
								content: res.msg,
								showCancel: false
							});
							this.disabled = false;
							uni.removeStorageSync('ticket');
						} else {
							uni.showModal({
								content: res.msg,
								showCancel: false
							});
							this.disabled = false;
						}
					});
				},
				fail: e => {
					uni.showModal({
						content: '支付失败,原因为: ' + e.errMsg,
						showCancel: false
					});
					this.loading = false;
					this.disabled = false;
				},
				complete: () => {
					console.log('payment结束');
					this.loading = false;
				}
			});
		},
		errorMsg() {
			uni.showModal({
				content: '暂不支持苹果 iap 支付',
				showCancel: false
			});
		},
		getAddress(e) {
			console.log(e);
			if (this.course_id) {
				let index = e.currentTarget.dataset.index;
				var pages = getCurrentPages();
				var currPage = pages[pages.length - 1]; //当前页面
				var prevPage = pages[pages.length - 2]; //上一个页面
				prevPage.setData({
					course_id: this.course_id
				});
				uni.navigateBack();
				return false;
			}
		}
	},
	onBackPress(e) {
		let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
		let curRoute = routes[routes.length - 2].route; // 获取当前页面路由，也就是最后一个打开的页面路由
		if (curRoute.indexOf('buy') < 0) {
			return false;
		} else {
			this.getAddress(e);
		}
		return true;
	}
};
</script>

<style lang="scss">
#My_balance {
	width: 100%;
	.title {
		flex: 1;
		height: 90upx;
		margin: 0 34upx;
		padding: 47upx 0;
		border-bottom: 2upx solid rgba(240, 240, 240, 1);
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		.left {
			line-height: 30upx;
			font-size: 30upx;
			font-family: Source Han Sans CN;
			font-weight: 500;
			color: rgba(49, 35, 32, 1);
		}
		.right {
			height: 46upx;

			display: flex;
			justify-content: flex-end;
			align-items: center;
			.number {
				height: 46upx;
				line-height: 46upx;
				font-size: 64upx;
				font-family: Source Han Sans CN;
				font-weight: 500;
				color: rgba(49, 35, 32, 1);
			}
			.d {
				margin-top: 20upx;
				font-size: 32upx;
				font-family: Source Han Sans CN;
				font-weight: 500;
				color: rgba(49, 35, 32, 1);
			}
		}
	}
	.map {
		flex: 1;
		padding: 36upx;
		display: flex;
		flex-wrap: wrap;
		// justify-content: space-around;
		.list {
			width: 198upx;
			height: 136upx;
			margin-bottom: 18upx;
			margin-right: 36upx;
			background: rgba(246, 247, 251, 1);
			border-radius: 12upx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border: 2upx solid rgba(246, 247, 251, 1);
			&:nth-child(3n) {
				margin-right: 0;
			}
			.xnb {
				font-size: 40upx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
			}
			.xnb_xz {
				color: rgba(0, 215, 137, 1);
			}
			.rmb {
				font-size: 28upx;
				font-family: PingFang SC;
				font-weight: 400;
				color: rgba(153, 153, 153, 1);
			}
		}
		.list_xz {
			width: 198upx;
			height: 136upx;
			margin-bottom: 18upx;
			margin-right: 36upx;
			background: rgba(255, 255, 255, 1);
			border-radius: 12upx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			// border: 1upx solid rgba(246, 247, 251, 1);
			border: 2upx solid rgba(0, 215, 137, 1);
		}
	}
	.Confirm_recharge {
		width: 670upx;
		height: 98upx;
		text-align: center;
		line-height: 98upx;
		margin: 16upx auto 72upx;
		font-size: 36upx;
		font-family: Source Han Sans CN;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		background: linear-gradient(-37deg, rgba(42, 193, 124, 1), rgba(42, 193, 145, 1));
		box-shadow: 0 10upx 30upx 0 rgba(51, 226, 148, 0.5);
		border-radius: 49upx;
		opacity: 0.5;
	}
	.confirm {
		opacity: 1;
	}
	.statement {
		flex: 1;
		margin: 0 34upx;
		.statement_list {
			width: 100%;
			// height:23upx;
			font-size: 24upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			line-height: 56upx;
		}
	}
	.tc {
		width: 214upx;
		height: 98upx;
		background: rgba(0, 0, 0, 1);
		opacity: 0.5;
		border-radius: 20upx;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
}
</style>
