<template>
	<view class="">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">导航栏</block>
			<block slot="right"><view class="" style="width: 100upx;">12321</view></block>
		</cu-custom>
		<button type="primary" @click="pay(1)">1232</button>
	</view>
</template>

<script>
var iapChannel;
var IAPOrders = ['io.dcloud.payTest1', 'io.dcloud.payTest2'];
export default {
	data() {
		return {
			title: 'Hello'
		};
	},
	onLoad() {
		// 获取支付通道
		console.log(IAPOrders, 123);
		plus.payment.getChannels(
			function(channels) {
				console.log(2323)
				for (var i in channels) {
					console.log(channels[i].id)
					if (channels[i].id == 'appleiap') {
						iapChannel = channels[i];
						iapChannel.requestOrder(
							IAPOrders,
							function(event) {
								for (var index in event) {
									var OrderItem = event[index];
									outLine('Title:' + OrderItem.title + 'Price:' + OrderItem.price + 'Description:' + OrderItem.description + 'ProductID:' + OrderItem.productid);
								}
							},
							function(errormsg) {
								outLine('获取支付通道失败：' + errormsg.message);
							}
						);
						console.log(iapChannel);
					}
				}
			},
			function(e) {
				outLine('获取支付通道失败：' + e.message);
			}
		);
	},
	methods: {
		pay(id) {
			console.log(iapChannel,24);
			plus.payment.request(
				iapChannel,
				{
					productid: id,
					username: 'appusername',
					quantity: 2
				},
				function(result) {
					alert(JSON.stringify(result));
				},
				function(e) {
					plus.nativeUI.alert(
						'更多错误信息请参考支付(Payment)规范文档：http://www.html5plus.org/#specification#/specification/Payment.html',
						null,
						'支付失败：' + e.code
					);
				}
			);
		}
	}
};
</script>

<style>
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.logo {
	height: 200rpx;
	width: 200rpx;
	margin-top: 200rpx;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 50rpx;
}

.text-area {
	display: flex;
	justify-content: center;
}

.title {
	font-size: 36rpx;
	color: #8f8f94;
}
</style>
