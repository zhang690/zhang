<template>
	<view id="My_order" v-if="showPage">
		<view v-if="!is_buy_course" class="No_curriculum">
			<image class="icon" src="../../../static/images/My_order/icon.png" mode=""></image>
			<view class="titles" v-if="hasLogin">目前暂无订单</view>
			<view class="titles" v-if="!hasLogin">
				登录同步购买记录，快去登录吧
			</view>
			<navigator v-if="hasLogin" class="Selecting_courses" open-type="switchTab" url="../../home/home">挑选课程</navigator>
			<view v-if="!hasLogin" class="Selecting_courses"  @tap.stop="toLogin">去登录</view>
		</view>

		<view class="list" v-else v-for="(item, index) of list" :key="index" @click="Order_details(item)">
			<view class="top">
				<view class="state">
					<view v-if="item.status == 1">购买成功</view>
					<view v-else-if="item.status == 2">领取成功</view>
					<view v-else-if="item.status == 3" class="pinTime red">拼单中（剩余
						<uni-countdown :show-day="false" color="#EF5C41" splitor-color="#EF5C41"
						:hour="timeFn(item.end_time).h" :minute="timeFn(item.end_time).m" 	:second="timeFn(item.end_time).s"
						@timeup="timeup(index)" fontSize="26rpx"></uni-countdown>）</view>
					<view v-else-if="item.status == 4">拼单成功</view>
					<view v-else-if="item.status == 5" class="gray">拼单失败</view>
				</view>
				<view class="time">{{ item.buy_time }}</view>
			</view>
			<view class="details">
				<view class="pictures"><image :src="iconURL + item.course_info.cover"mode="aspectFill"></image></view>

				<view class="Title_and_price">
					<view class="Title">{{ item.course_info.title }}</view>
					<view class="price">
						<view>实付：<text class="money">¥{{ item.pay_fee }}</text></view>
						<button v-if="item.status == 3" class="btnRed" type="default" @click.stop="open(item.course_id)">邀请拼单</button>
						<button v-if="item.status == 6" class="btnGray" type="default" disabled="true">已退款</button>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 分享弹窗 -->
		<uni-popup :custom="true" ref="popup" type="center">
			<view class="pin-invite">
				<view class="cont">
					<image class="img" src="../../../static/images/My_order/pin_invite.png"></image>
					<button class="btn" type="default" @click="share">分享好友</button>
				</view>
				<uni-icons :size="24" class="uni-icon-wrapper" color="#fff" type="close" @click="close"/>
			</view>
		</uni-popup>
		<share ref="share"></share>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import uniCountdown from '@/components/uni-countdown/uni-countdown.vue';
	import share from '@/components/share';
export default {
	components: {
		uniPopup,
		uniCountdown,
		share
	},
	computed: {
		iconURL() {
			return this.$iconURL;
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
			showPage: false,
			list: [],
			course_id:0
		};
	},
	onLoad() {
		this.getOrderLog();
	},
	methods: {
		toLogin() {
			this.$store.dispatch('reLogin');
		},
		getOrderLog() {
			let temp = {}
			if(!this.hasLogin){
				temp.uuid = this.uuid;
			}
			this.$api.getOrderLog(temp).then(res => {
				if(res.code == 200){
					if (res.data.total === 0 || res.data.total === '0' || res.data.total === null || res.data.total === undefined) {
						this.is_buy_course = false;
					} else {
						this.is_buy_course = true;
					}
					this.showPage = true;
					this.list = res.data.list;
				} else if (res.code == 1900){
					this.is_buy_course = false;
					this.showPage = true;
				}
			});
		},
		Order_details(v) {
			console.log(v.id);
			if(v.status==1 || v.status==2 ||v.status==4 ||v.status==6){
				uni.navigateTo({
					url: 'Order_details/Order_details?order_id=' + v.id
				});
			}
		},
		share(){
			let params = {
				type: 2,
				course_id: this.course_id
			};
			console.log(this.$refs.share)
			this.$refs.share.shares(params);
		},
		open(id){
			this.course_id=id;
			this.$refs.popup.open();
		},
		close(){
			this.$refs.popup.close();
		},
		timeup(index){
			this.getOrderLog();
		},
		timeFn(dateEnd) {
			dateEnd=new Date(dateEnd*1000);
			var dateCurrent = new Date();//获取当前时间
			var dateDiff = dateEnd - dateCurrent.getTime();//时间差的毫秒数，结束时间减去当前时间
			var leave1=dateDiff%(24*3600*1000)    //计算天数后剩余的毫秒数
			var hours=Math.floor(leave1/(3600*1000))//计算出小时数
			var leave2=leave1%(3600*1000)    //计算小时数后剩余的毫秒数
			var minutes=Math.floor(leave2/(60*1000))//计算相差分钟数
			var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
			var seconds=Math.round(leave3/1000)
			return {h:hours,m:minutes,s:seconds};
		}
	}
};
</script>

<style lang="scss">
	.pin-invite{
		width: 518rpx;
		height: 660rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		.cont{
			width: 518rpx;
			height: 580rpx;
			position: relative;
			.img{
				display: block;
				width: 518rpx;
				height: 580rpx;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 1;
			}
			.btn{
				display: block;
				width:240rpx;
				height:80rpx;
				background:rgba(138,182,115,1);
				border-radius:40rpx;
				font-size:30rpx;
				font-weight:bold;
				color:rgba(255,255,255,1);
				position: absolute;
				bottom: 38rpx;
				margin-left: 50%;
				left: -120rpx;
				z-index: 2;
			}
		}
	}
#My_order {
	width: 100%;
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
			height: 81upx;
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
	.list {
		flex: 1;
		padding: 0 32upx;
		height: 276upx;
		border-bottom: 16upx solid rgba(249, 249, 249, 1);
		.top {
			width: 100%;
			height: 94upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.state {
				font-size: 26upx;
				font-family: PingFang SC;
				font-weight: 400;
				color: rgba(0, 215, 137, 1);
				display: flex;
				align-items: center;
				.pinTime{
					display: flex;
					align-items: center;
				}
			}
			.time {
				font-size: 26upx;
				font-family: PingFang SC;
				font-weight: 400;
				color: rgba(102, 102, 102, 1);
			}
			.red{color: #EF5C41;}
			.gray{color: #999999;}
		}
		.details {
			width: 100%;
			height: 144upx;
			display: flex;
			justify-content: space-between;
			.pictures {
				width: 256upx;
				height: 144upx;
				border-radius: 12upx;

				width: 256upx;
				height: 144upx;
				
				image {
					width: 100%;
					height: 100%;
					background: rgba(52, 52, 52, 1);
					box-shadow: 0 1upx 8upx 0 rgba(227, 226, 226, 0.66);
					border-radius: 12upx;
				}
			}
			.Title_and_price {
				flex: 1;
				margin: 0 10rpx 0 30rpx;
				display: flex;
				justify-content: space-between;
				flex-direction: column;
				.Title {
					font-size: 28upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: rgba(68, 68, 68, 1);
					line-height: 40upx;
				}
				.price {
					font-size: 24upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: rgba(157, 157, 157, 1);
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					.money {
						color: #ef5c41;
					}
					.btnRed,.btnGray{
						display: block;
						padding: 0 13rpx;
						height:48rpx;
						border-radius:10rpx;
						font-size:24rpx;
						color: #FFFFFF;
						line-height: 48rpx;
						font-weight: normal;
						margin: 0;
					}
					.btnRed{
						background:rgba(248,63,59,1);
					}
					.btnGray{
						background: #CACACB;
						color: #FFFEFE;
					}
				}
			}
		}
	}
}
</style>
