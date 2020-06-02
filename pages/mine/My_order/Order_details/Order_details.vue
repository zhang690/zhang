<template>
	<view id="Order_details">
		<view class="top">
			<!-- 拼单成功 -->
			<view v-if="list.status == 1" class="Order_type">购买成功</view>
			<view v-else-if="list.status == 2" class="Order_type">领取成功</view>
			<view v-else-if="list.status == 4" class="Order_type">拼单成功</view>
			<view class="banner_and_title">
				<view class="banner"><image :src="iconURL + course_info.cover" mode="aspectFill"></image></view>
				<view class="title_and_Teacher">
					<view class="title">{{ course_info.title }}</view>
					<view class="teacher_name">讲师：{{ course_info.teacher_name }}</view>
				</view>
			</view>
			<view class="list">
				<view class="list_item">
					<view class="left">{{list.pay_before}} x{{ list.num }}份</view>
					<view class="right red">¥{{ list.pay_before }}</view>
				</view>
				<!-- <view class="list_item">
					<view class="left black">优惠券</view>
					<view class="right">无</view>
				</view> -->
				<view class="list_item" v-if="list.status==4">
					<view class="left black">拼团成功</view>
					<view class="right imgs">
						<image v-for="(item,index) in list.collage_person_info" :key="index" class="img" 
						:src="item.avatar"></image>
						 <!-- right: -20*index rpx; -->
					</view>
				</view>
				<view class="list_item">
					<view class="left black">实付金额</view>
					<view class="right red">¥{{ list.pay_fee }}</view>
				</view>
			</view>
		</view>
		<view class="bottom">
			<view class="Order_number_method">
				<view class="Order_number">
					<view class="grey">订单号：</view>
					<view class="black">{{ list.order_no }}</view>

					<view class="copy" @click="copy">复制</view>
				</view>
				<view class="payment_method">
					<view class="grey">支付方式：</view>
					<view v-if="list.pay_type == 1" class="black">支付宝</view>
					<view v-else-if="list.pay_type == 2" class="black">微信</view>
					<view v-else-if="list.pay_type == 3" class="black">余额</view>
					<view v-else-if="list.pay_type == 4" class="black">官方赠送</view>
				</view>
			</view>
			<view class="time_list">
				<view class="list_item">
					<view class="grey">创建时间：</view>
					<view class="black">{{ list.created_at }}</view>
				</view>
				<view class="list_item">
					<view class="grey">付款时间：</view>
					<view class="black">{{ list.buy_time }}</view>
				</view>
				<view class="list_item">
					<view class="grey">完成时间：</view>
					<view class="black">{{ list.updated_at }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	computed:{
		iconURL(){
			return this.$iconURL;
		}
	},
	data() {
		return {
			// order_id:''
			course_info: Object,
			list: Object
		};
	},
	onLoad(v) {
		console.log(v);
		console.log(v.order_id);
		let parmas = {
			order_id: v.order_id
		};

		this.getOrderDetail(parmas);
	},
	methods: {
		getOrderDetail(parmas) {
			console.log(parmas);
			this.$api.getOrderDetail(parmas).then(res => {
				console.log(res);
				this.course_info = res.data.course_info;
				this.list = res.data.list;
				// console.log(this.course_info);
			});
		},
		copy() {
			uni.setClipboardData({
				data: this.list.order_no,
				success: function() {
					console.log('success');
				}
			});
		},
	}
};
</script>

<style lang="scss">
#Order_details {
	width: 100%;
	.top {
		flex: 1;
		margin: 0 32upx;
		.Order_type {
			width: 100%;
			height: 84upx;
			line-height: 84upx;
			font-size: 26upx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(0, 215, 137, 1);
		}
		.banner_and_title {
			width: 100%;
			display: flex;
			justify-content: space-between;
			.banner {
				width: 256upx;
				height: 144upx;
				border-radius: 12upx;
				image {
					width: 256upx;
					height: 144upx;
					border-radius: 12upx;
				}
			}
			.title_and_Teacher {
				flex: 1;
				height: 144upx;
				margin: 0 32upx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.title {
					font-size: 28upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: rgba(68, 68, 68, 1);
					line-height: 40upx;
				}
				.teacher_name {
					font-size: 24upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: rgba(157, 157, 157, 1);
					// line-height: 50upx;
				}
			}
		}
		.list {
			margin-top: 57upx;
			.list_item {
				flex: 1;
				height: 100upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 2px solid rgba(245, 245, 245, 1);
				&:last-child {
					border: 0;
				}
				.left {
					font-size: 30upx;
					font-family: PingFang SC;
					font-weight: 400;
					color: rgba(153, 153, 153, 1);
				}
				.right {
					font-size: 32upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: rgba(153, 153, 153, 1);
				}
				.black {
					font-size: 28upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: rgba(51, 51, 51, 1);
				}
				.red{
					font-size:32upx;
					font-family:PingFang SC;
					font-weight:bold;
					color:rgba(239,92,65,1);
				}
				.imgs{
					.img{
						width:56rpx;
						height:56rpx;
						border-radius:50%;
						position: relative;
					}
				}
			}
		}
	}
	.bottom {
		flex: 1;
		padding: 0 32upx;
		border-top: 20upx solid rgba(249, 249, 249, 1);
		.grey {
			font-size: 28upx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #999999;
		}
		.black {
			font-size: 28upx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #666666;
		}
		.Order_number_method {
			height: 194upx;
			border-bottom: 2upx solid rgba(245, 245, 245, 1);
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			.Order_number {
				width: 100%;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.black{
					flex: 1;
				}
				.copy {
					width: 92upx;
					height: 40upx;
					display: flex;
					justify-content: center;
					align-items: center;
					margin: 0 0 0 28upx;
					font-size: 22upx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(0, 215, 137, 1);
					background: rgba(255, 255, 255, 1);
					border: 2upx solid rgba(0, 215, 137, 1);
					border-radius: 20upx;
				}
			}
			.payment_method {
				width: 100%;
				display: flex;
				justify-content: flex-start;
				align-items: center;
			}
		}
		.time_list {
			width: 100%;
			margin-top: 20upx;
			.list_item {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				height: 68upx;
			}
		}
	}
}
</style>
