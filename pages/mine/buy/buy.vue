<template>
	<view>
		<view class="banner" v-if="EditOrder">
			<view class="banner_img" :style="{ backgroundImage: 'url(' + iconURL + EditOrder.cover + ')', backgroundSize: '100% 100%' }"><!-- <image :src="iconURL + EditOrder.cover" mode="aspectFill"></image> --></view>
			<view class="banner_disc">
				<view class="banner_disc_text">
					<text>{{ EditOrder.title }}</text>
				</view>
				<view class="banner_disc_price">
					<view class="banner_disc_price_name">{{ EditOrder.teacher_name }}</view>
					<view class="banner_disc_price_money">￥{{ EditOrder.price }}</view>
				</view>
			</view>
		</view>
		<!-- banner 下阴影条-->

		<view class="shadow"></view>

		<!-- payment -->
		<view class="payment">
			<view class="payment_pattern">支付方式</view>
			<!-- 余额 -->

			<view class="payment_balance" v-if="isIos">
				<!-- <view class="payment_balance"> -->
				<view class="payment_balance_details">
					<view class="payment_balance_money">余额 {{ balance }}</view>
					<view class="payment_balance_remind" v-if="price < 0">(不足支付)</view>
				</view>
				<view class="payment_balance_recharge" @tap="toBalance">充值</view>
			</view>
			<view class="payment_box" v-else>
				<!-- <view class="payment_box"> -->
				<view class="weChat box" @tap="pay_sty('WeChat')">
					<i></i>
					<view class="text">微信支付</view>
					<b :class="{ active_b: isWechat }"></b>
				</view>
				<view class="Alipay box" @tap="pay_sty('Alipay')">
					<i></i>
					<view class="text">支付宝支付</view>
					<b :class="{ active_b: !isWechat }"></b>
				</view>
			</view>
			<!-- 余额 下阴影线 -->
			<view class="partingLine"></view>
			<!-- disc 描述 -->
			<view class="payment_disc">
				<view class="payment_disc_position">
					<view class="payment_disc_point"></view>
					您将购买的课程为线上课程内容服务，基于在线内容的特殊性及产品的整体性，购买使用全部或部分内容后不支持退款、转让，望您知悉并理解。
				</view>
				<view class="payment_disc_position">
					<view class="payment_disc_point"></view>
					购买后可在APP —“学习”中查看和使用。
				</view>
				<view class="payment_disc_position" v-if="EditOrder.is_collage==1">
					<view class="payment_disc_point"></view>
					如果拼单失败，苹果支付将退还到账户余额，其他支付方式将 直接退还到支付账户钱包。
				</view>
			</view>
		</view>

		<view class="shadow" v-if="EditOrder.is_collage==1"></view>
		<!-- 拼团 -->
		<view class="pin" v-if="EditOrder.is_collage==1">
			<view class="pinTop">
				<view>{{collage_list.length}}人正在拼团，可直接参与</view>
				<view class="gray" @click="open">
					查看更多
					<uni-icons :size="16" class="uni-icon-wrapper" color="#888888" type="arrowright" />
				</view>
			</view>
			<view class="pinContent">
				<view class="pinCard" v-for="(item,index) in collage_list" :key="index">
					<view class="head"><image :src="item.user_info?item.user_info.avatar:''" mode="aspectFill"></image></view>
					<view class="info">
						<view>{{item.user_info?item.user_info.nick:''}}</view>
						<view class="row">
							还差<text class="red">{{item.num}}</text>人成团
							<view class="time">剩余
								<uni-countdown :show-day="false" color="#e4393c" splitor-color="#e4393c"
							:hour="timeFn(item.end_time).h" :minute="timeFn(item.end_time).m" 	:second="timeFn(item.end_time).s"
							@timeup="timeup(index)"></uni-countdown></view>
						</view>
					</view>
					<view class="btn" @tap.stop="prev(1,item.collage_order_no)">去拼单</view>
				</view>
			</view>
		</view>

		<!-- buy 购买 -->
		<view class="buy">
			<view class="buy_reality">
				原价
				<text class="buy_reality_money">￥{{ EditOrder.price }}</text>
			</view>
			<view class="buy_btns" v-if="EditOrder.is_collage==1">
				<view class="buy_btn" @tap.stop="prev(1,'')">
					<text>￥{{ EditOrder.collage_price }}</text>
					<br />
					拼单购买
				</view>
				<view class="buy_btn red" @tap.stop="prev(0,'')">
					<text>￥{{ EditOrder.price }}</text>
					<br />
					直接购买
				</view>
			</view>
			<view class="greenBtn" v-if="EditOrder.is_collage==0" @tap.stop="prev(0,'')">确认支付</view>
		</view>

		<!-- 拼单弹窗 -->
		<view v-show="showAll" class="pinMask">
			<view class="pinPopup">
				<view class="top">
					<text>正在拼单</text>
					<uni-icons :size="30" class="uni-icon-wrapper" color="#888888" type="closeempty" @click="close"/>
				</view>
				<view class="cont">
					<view class="card" v-for="(item,index) in collage_list" :key="index">
						<view class="head"><image :src="item.user_info?item.user_info.avatar:''" mode="aspectFill"></image></view>
						<view class="name">{{item.user_info?item.user_info.nick:''}}</view>
						<view class="info">
							<view class="line1">还差<text class="red">{{item.num}}</text>人成团</view>
							<view class="line2">剩余
								<uni-countdown :show-day="false" color="#e4393c" splitor-color="#e4393c"
								:hour="timeFn(item.end_time).h" :minute="timeFn(item.end_time).m" 	:second="timeFn(item.end_time).s"
								@timeup="timeup(index)"></uni-countdown>
							</view>
						</view>
						<view class="btn" @tap.stop="prev(1,item.collage_order_no)">去拼单</view>
					</view>
					<view class="endTip" v-if="collage_list.length===10">仅显示10个可插队的拼单</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import uniCountdown from '@/components/uni-countdown/uni-countdown.vue'
export default {
	components: {
		uniCountdown
	},
	computed: {
		iconURL() {
			return this.$iconURL;
		},
		price() {
			return this.balance - this.EditOrder.price;
		},
		isIos() {
			return this.$isIos;
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
			EditOrder: '',
			isWechat: true,
			course_id: '',
			pay_type: 2,
			balance: 0,
			collage_list:[],
			is_collage:0, //是否拼团 0否 1拼团
			collage_order_no:'',
			showAll:false,
		};
	},
	methods: {
		open() {
			this.showAll=true;
		},
		close(){
			this.showAll=false;
		},
		timeup(index){
			this.collage_list.splice(index,1);
			// uni.showToast({
			// 	title: '时间到'
			// })
		},
		getConfirmOrder(v) {
			this.$api.getConfirmOrder(v).then(res => {
				console.log(res);
				if (res.code == 200) {
					this.balance = res.data.balance;
					this.EditOrder = res.data.list;
					this.collage_list=res.data.collage_list;
					// this.collage_list[this.collage_list.length-1].end_time=((new Date()).getTime()+5000)/1000;
				}
			});
		},
		pay_sty(v) {
			//支付方式
			if (v == 'WeChat') {
				this.isWechat = true;
				this.pay_type = 2;
			} else {
				this.isWechat = false;
				this.pay_type = 1;
			}
		},
		prev(type,orderNo) {
			this.is_collage=type;
			if(orderNo!=''){
				this.collage_order_no=orderNo;
			}
			let self = this;
			if (!self.hasLogin && self.uuid) {
				plus.nativeUI.actionSheet(
					{
						title: '登录账户可跨平台使用,永不丢失，游客模式购买,仅限本设备使用且容易丢失无法找回',
						cancel: '取消',
						buttons: [
							{
								title: '登录账户购买（推荐）'
							},
							{
								title: '游客购买'
							}
						]
					},
					function(e) {
						if (e.index == 1) {
							self.$store.dispatch('reLogin');
						} else if (e.index == 2) {
							self.createBuyCourse();
						}
					}
				);
			} else {
				self.createBuyCourse();
			}
		},
		createBuyCourse() {
			let parmas = { course_id: this.course_id, pay_type: this.pay_type, is_collage: this.is_collage , collage_order_no: this.collage_order_no};
			// console.log(parmas)
			if (!this.hasLogin) {
				parmas = Object.assign(parmas, { uuid: this.uuid });
			}
			this.$api.createBuyCourse(parmas).then(res => {
				let self = this;
				console.log(res);
				if (res.code == 200) {
					console.log(Number(this.pay_type));
					let orderInfo = res.data.pay_info;
					switch (Number(this.pay_type)) {
						case 1: //支付宝
							uni.requestPayment({
								provider: 'alipay',
								orderInfo: orderInfo,
								success: e => {
									console.log('success', e);
									if(this.is_collage==1 && this.collage_order_no==''){
										uni.showToast({
											title: '支付成功，即将跳转到我的订单页!',
											duration: 1000,
											icon: 'none',
											success() {
												let temp = null;
												temp = setTimeout(() => {
													uni.redirectTo({
														url: '../My_order/My_order'
													});
													clearTimeout(temp);
												}, 1000);
												temp = null;
											}
										});
									}else{
										uni.showToast({
											title: '支付成功，即将跳转到课程学习!',
											duration: 1000,
											icon: 'none',
											success() {
												let temp = null;
												temp = setTimeout(() => {
													uni.switchTab({
														url: '../../study/study'
													});
													clearTimeout(temp);
												}, 1000);
												temp = null;
											}
										});
									}
								},
								fail: e => {
									console.log('fail', e);
									uni.showToast({
										title: '支付失败!',
										duration: 1000,
										icon: 'none',
										success() {}
									});
									// uni.showToast({
									// 	title: '放弃支付!',
									// 	icon:"none"
									// });
								},
								complete: () => {}
							});
							break;
						case 2:
							uni.requestPayment({
								provider: 'wxpay',
								orderInfo: orderInfo,
								success: e => {
									if(this.is_collage==1 && this.collage_order_no==''){
										uni.showToast({
											title: '支付成功，即将跳转到我的订单页!',
											duration: 1000,
											icon: 'none',
											success() {
												let temp = null;
												temp = setTimeout(() => {
													uni.redirectTo({
														url: '../My_order/My_order'
													});
													clearTimeout(temp);
												}, 1000);
												temp = null;
											}
										});
									}else{
										uni.showToast({
											title: '支付成功，即将跳转到课程学习!',
											duration: 1000,
											icon: 'none',
											success() {
												let temp = null;
												temp = setTimeout(() => {
													uni.switchTab({
														url: '../../study/study'
													});
													clearTimeout(temp);
												}, 1000);
												temp = null;
											}
										});
									}
								},
								fail: e => {
									console.log('fail', e);
									uni.showToast({
										title: '支付失败!'
									});
								},
								complete: () => {}
							});
							break;
						default:
							if(this.is_collage==1 && this.collage_order_no==''){
								uni.showToast({
									title: '支付成功，即将跳转到我的订单页!',
									duration: 1000,
									icon: 'none',
									success() {
										let temp = null;
										temp = setTimeout(() => {
											uni.redirectTo({
												url: '../My_order/My_order'
											});
											clearTimeout(temp);
										}, 1000);
										temp = null;
									}
								});
							}else{
								uni.showToast({
									title: '支付成功，即将跳转到课程学习!',
									duration: 1000,
									icon: 'none',
									success() {
										let temp = null;
										temp = setTimeout(() => {
											uni.switchTab({
												url: '../../study/study'
											});
											clearTimeout(temp);
										}, 1000);
										temp = null;
									}
								});
							}
							break;
					}
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		toBalance() {
			uni.navigateTo({
				url: '../My_balance/My_balance?course_id=' + this.course_id
			});
		},
		// 计算两个时间差 dateEnd 结束时间
		timeFn(dateEnd) {
			dateEnd=new Date(dateEnd*1000);
			var dateCurrent = new Date();//获取当前时间
			var dateDiff = dateEnd - dateCurrent.getTime();//时间差的毫秒数，结束时间减去当前时间
			// var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
			var leave1=dateDiff%(24*3600*1000)    //计算天数后剩余的毫秒数
			var hours=Math.floor(leave1/(3600*1000))//计算出小时数
			//计算相差分钟数
			var leave2=leave1%(3600*1000)    //计算小时数后剩余的毫秒数
			var minutes=Math.floor(leave2/(60*1000))//计算相差分钟数
			//计算相差秒数
			var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
			var seconds=Math.round(leave3/1000)
			// var leave4=leave3%(60*1000)      //计算分钟数后剩余的毫秒数
			// var minseconds=Math.round(leave4/1000)
			// var timeFn = "剩余："+dayDiff+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒"+minseconds+"毫秒";
			return {h:hours,m:minutes,s:seconds};
		}
	},
	onLoad(v) {
		if (v.course_id) {
			this.course_id = v.course_id;
			this.getConfirmOrder({ course_id: v.course_id });
			if (this.isIos) {
				this.pay_type = 3;
			}
		}
	},
	onShow(e) {
		let pages = getCurrentPages();
		let currPage = pages[pages.length - 1];
		if (!currPage.data || currPage.data.course_id == 'undefined' || currPage.data.course_id == '') {
			return;
		} else {
			this.course_id = currPage.data.course_id;
			if (!this.course_id) return;
			this.getConfirmOrder({ course_id: this.course_id });
		}
	}
};
</script>
<style lang="scss">
	.pinMask{
		width: 100%;
		height: 100%;
		background-color: rgba($color: #000000, $alpha: 0.6);
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.pinPopup{
		width:678rpx;
		height:834rpx;
		background:rgba(255,255,255,1);
		border-radius:10rpx;
		box-sizing: border-box;
		overflow: hidden;
		.top{
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			border-bottom: 1px solid #F0F0F0;
			position: relative;
			font-size: 30rpx;
			color: #121212;
			box-sizing: border-box;
			.uni-icon{
				position: absolute;
				top: 16rpx;
				right: 24rpx;
				font-weight: bold;
			}
		}
		.cont{
			height: 744rpx;
			overflow-y: scroll;
			.card{
				margin: 0 30rpx;
				border-bottom: 1px solid #F0F0F0;
				padding: 20rpx 0;
				display: flex;
				justify-content: flex-start;
				flex-wrap: nowrap;
				align-items: center;
				.head {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					overflow: hidden;
					margin-right: 20rpx;
					> image {
						width: 100%;
						height: 100%;
					}
				}
				.name{
					width: 200rpx;
					font-size: 30rpx;
					color: #121212;
					padding-right: 10rpx;
					box-sizing: border-box;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.info{
					width: 194rpx;
					text-align: right;
					font-size: 24rpx;
					line-height: 40rpx;
					color: #888888;
					.line1{
						font-size: 26rpx;
					}
					.red{
						color: #E4393C;
					}
					.line2{
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: flex-end;
					}
				}
				.btn{
					width:102rpx;
					height:48rpx;
					line-height: 48rpx;
					background:rgba(248,63,59,1);
					border-radius:10rpx;
					margin-left: 22rpx;
					font-size: 24rpx;
					color: #FFFFFF;
					text-align: center;
				}
			}
			.endTip{
				text-align: center;
				color: #888;
				font-size: 28rpx;
				line-height: 80rpx;
			}
		}
	}
// 确认订单导航栏

// banner
.banner {
	padding: 0 32upx;
	display: flex;
	margin: 50upx 0 54upx;
}
.banner_img {
	width: 328upx;
	height: 184upx;
	border-radius: 12upx;
	overflow: hidden;
	background-color: #4cd964;
	margin-right: 32upx;
	box-shadow: 0px 1px 8px 0px rgba(227, 226, 226, 0.66);
}
.banner_disc {
	position: relative;
	flex: 1;
	font-size: 0;
	text {
		font-size: 32upx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(0, 0, 0, 1);
		line-height: 40upx;
		margin-right: 35upx;
	}
}
.banner_disc_price {
	position: absolute;
	width: 100%;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.banner_disc_price_name {
		font-size: 24upx;
		color: rgba(157, 157, 157, 1);
	}
	.banner_disc_price_money {
		font-size: 32upx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(239, 92, 65, 1);
		line-height: 50upx;
		margin-right: 8upx;
	}
}
// banner下阴影条
.shadow {
	width: 100%;
	height: 20upx;
	background: rgba(240, 240, 240, 1);
}

// payment 支付
.payment {
	flex-direction: column;
	font-size: 0;
	padding: 0 32upx 0;
	margin-top: 60upx;
}
.payment_pattern {
	font-size: 32upx;
	font-family: Source Han Sans CN;
	font-weight: 500;
	color: rgba(51, 51, 51, 1);
	line-height: 50upx;
}
.payment_balance {
	margin-top: 36upx;
	font-size: 28upx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.payment_box {
	display: block;
	overflow: hidden;
	.box {
		display: flex;
		font-size: 28upx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: rgba(68, 68, 68, 1);
		align-items: center;
		height: 160upx;
		i,
		b {
			display: block;
		}
		i {
			margin-right: 16upx;
		}
		.text {
			flex: 1;
		}
		.active_b {
			width: 32upx;
			height: 24upx;
			background: url(../../../static/images/pay/select.png);
			background-size: 100% 100%;
		}
	}
	.weChat {
		i {
			width: 68upx;
			height: 64upx;
			background: url(../../../static/images/pay/pay_2.png) no-repeat;
			background-size: 100% 100%;
		}
	}
	.Alipay {
		i {
			width: 68upx;
			height: 68upx;
			background: url(../../../static/images/pay/pay_1.png) no-repeat;
			background-size: 100% 100%;
		}
	}
}
.payment_balance_details {
	// padding-top: 36upx;
	display: flex;
	font-size: 28upx;
	font-family: Source Han Sans CN;
	font-weight: 400;
	color: rgba(68, 68, 68, 1);
	line-height: 50upx;
}

.payment_balance_remind {
	margin-left: 28upx;
	color: #999999;
}

.payment_balance_recharge {
	line-height: 60upx;
	text-align: center;
	font-size: 30upx;
	font-family: PingFang SC;
	font-weight: bold;
	color: rgba(255, 255, 255, 1);
	width: 130upx;
	height: 60upx;
	background-color: #33e294;
	border-radius: 30upx;
	margin-right: 8upx;

	background: linear-gradient(-37deg, rgba(42, 193, 124, 1), rgba(42, 193, 145, 1));
	box-shadow: 0 10upx 30upx 0 rgba(51, 226, 148, 0.5);
	border-radius: 30upx;
}
// 余额 下分割线
.partingLine {
	width: 100%;
	background-color: #f5f5f5;
	border: 1upx solid rgba(245, 245, 245, 1);
	margin-top: 30upx;
}

// disc 描叙
.payment_disc {
	flex: 1;
	font-size: 24upx;
	font-family: Source Han Sans CN;
	font-weight: 400;
	color: rgba(153, 153, 153, 1);
	line-height: 34upx;
	padding: 0 21upx 0 18upx;
}
.payment_disc .payment_disc_position:last-child {
	padding-bottom: 58rpx;
}
.payment_disc_position {
	padding-top: 32upx;
	position: relative;
}
.payment_disc_point {
	position: absolute;
	top: 47upx;
	left: -15upx;
	width: 7upx;
	height: 7upx;
	background: rgba(153, 153, 153, 1);
	border-radius: 50%;
}
// buy 购买
.buy {
	position: fixed;
	display: flex;
	width: 100%;
	box-sizing: border-box;
	align-items: center;
	justify-content: space-between;
	padding: 14rpx 32rpx;
	bottom: 0upx;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 0px 6upx 0px rgba(214, 214, 214, 0.35);
}
.buy_reality {
	font-size: 28upx;
	font-family: Source Han Sans CN;
	font-weight: bold;
	color: rgba(51, 51, 51, 1);
	line-height: 80upx;
}
.buy_reality_money {
	color: #ef5c41;
	font-size: 38upx;
}
.buy .greenBtn{
	width:240rpx;
	height:80rpx;
	background:linear-gradient(-37deg,rgba(42,193,124,1),rgba(42,193,145,1));
	box-shadow:0px 10rpx 30rpx 0px rgba(51,226,148,0.5);
	border-radius:40rpx;
	font-size:30rpx;
	font-weight:bold;
	color:rgba(255,255,255,1);
	text-align: center;
	line-height: 80rpx;
}
.buy_btns {
	width: 412rpx;
	background-color: rgba(252, 176, 97, 1);
	border-radius: 40rpx;
	font-size: 26rpx;
	color: #fff;
	display: flex;
	align-items: center;
	overflow: hidden;
	height: 80rpx;
}
.buy_btns .buy_btn {
	flex: 1;
	height: 100%;
	text-align: center;
}
.buy_btns .buy_btn text {
	font-size: 28rpx;
}
.buy_btns .buy_btn.red {
	background: #ff7f56;
}

.pin {
	padding: 30rpx 32rpx 150rpx;
	.pinTop {
		height: 60rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 24rpx;
		color: #333333;
		border-bottom: 1px solid #f6f8fb;
		.gray {
			color: #8d8d8d;
			display: flex;
			align-items: center;
		}
	}
	.pinContent {
		padding-bottom: 30rpx;
		.pinCard {
			padding: 20rpx 0;
			border-bottom: 1px solid #f6f8fb;
			display: flex;
			justify-content: flex-start;
			flex-wrap: nowrap;
			align-items: center;
			.head {
				width: 90rpx;
				height: 90rpx;
				border-radius: 50%;
				overflow: hidden;
				margin-right: 20rpx;
				> image {
					width: 100%;
					height: 100%;
				}
			}
			.info {
				width: 462rpx;
				padding-right: 30rpx;
				box-sizing: border-box;
				font-size: 24rpx;
				line-height: 34rpx;
				color: rgba(136, 136, 136, 1);
				.row{
					display: flex;
					flex-direction: row;
					align-items: center;
					.red,.time {
						color: #e4393c;
					}
					.time {
						margin-left: 30rpx;
						display: flex;
						flex-direction: row;
						align-items: center;
					}
				}
			}
			.btn {
				width: 114rpx;
				height: 54rpx;
				border: 1px solid rgba(228, 57, 60, 1);
				font-size: 24rpx;
				color: rgba(228, 57, 60, 1);
				display: flex;
				align-items: center;
				justify-content: center;
				box-sizing: border-box;
			}
		}
	}
}

</style>
