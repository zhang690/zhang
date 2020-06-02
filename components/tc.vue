<template>
	<view class="tc" @click.stop="" @touchmove.stop="">
		<view class="map">
			<image class="bg_inage" :src="tc_bg" mode=""></image>
			<view class="Long_press_save" v-if="zt == 1">长按保存图片，添加客服微信</view>
			<view v-else class="Long_press_save">长按保存图片，添加班主任微信</view>
			<view class="Tips">添加微信后需要稍等片刻</view>
			<view class="ewm" :style="{ backgroundImage: 'url(' + iconURL + imageurl + ')', backgroundSize: 'contain' }" @longpress="saveImg"></view>
			<view class="Manual_addition">
				<view class="tips">
					二维码无法识别可手动添加

					<view class="number">{{ number }}</view>
				</view>
				<view class="copy" @click="copy">复制</view>
			</view>
			<image @click="gb" class="gb" src="/static/gb.png" mode="aspectFill"></image>
		</view>
	</view>
</template>

<script>
import tc_bg from '../static/tc_bg.png';
var _self = this;
var xztpurls = '';
export default {
	computed: {
		iconURL() {
			return this.$iconURL;
		}
	},
	props: {
		number: '',
		imageurl: '',
		zt: '',
		xztpurl: '',
		k: '',
		required: true
	},
	data() {
		return { tc_bg: tc_bg, xs: 0 };
	},
	onLoad() {},
	methods: {
		copy() {
			uni.setClipboardData({
				data: this.number,
				success: function() {
					console.log('success');
				}
			});
		},
		saveImg() {
			xztpurls = this.iconURL + this.imageurl;
			console.log(xztpurls);
			uni.showModal({
				title: '提示',
				content: '确定保存到相册吗',
				success: function(res) {
					if (res.confirm) {
						console.log(xztpurls);
						uni.downloadFile({
							url: xztpurls, //图片地址
							success: res => {
								console.log(xztpurls);
								if (res.statusCode === 200) {
									uni.saveImageToPhotosAlbum({
										filePath: res.tempFilePath,
										success: function() {
											console.log('成功');
											uni.showToast({
												title: '保存成功',
												icon: 'none'
											});
										},
										fail: function() {
											uni.showToast({
												title: '保存失败',
												icon: 'none'
											});
										}
									});
								}
							}
						});
					} else if (res.cancel) {
					}
				}
			});
		},
		gb() {
			this.$emit('fromChild', this.xs);
		}
	}
};
</script>

<style lang="scss">
.tc {
	width: 100%;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	overflow: hidden;
	background-color: rgba(000, 000, 000, 0.75);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999999;
	.map {
		width: 660upx;
		height: 740upx;

		position: relative;
		.bg_inage {
			width: 100%;
			height: 100%;
			position: absolute;
			z-index: 1;
		}
		.Long_press_save {
			width: 100%;
			text-align: center;
			top: 46upx;
			font-size: 32upx;
			font-family: Source Han Sans CN;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			position: absolute;
			z-index: 2;
		}
		.Tips {
			width: 100%;
			text-align: center;
			top: 100upx;
			font-size: 28upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			position: absolute;
			z-index: 2;
		}
		.ewm {
			width: 390upx;
			height: 390upx;
			background-color: rgba(255, 255, 255, 1);
			top: 196upx;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			z-index: 2;
		}
		.Manual_addition {
			width: 540upx;
			height: 28upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 0 60upx;
			top: 660upx;
			z-index: 2;
			position: absolute;
			.tips {
				height: 26upx;
				line-height: 26upx;
				font-size: 26upx;
				font-family: Source Han Sans CN;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
				// display: -webkit-box;
				// -webkit-box-orient: vertical;
				// -webkit-line-clamp: 1;
				// overflow: hidden;

				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;

				.number {
					margin-left: 10upx;
					display: inline-block;
				}
			}
			.copy {
				width: 56upx;
				float: right;
				font-size: 28upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: rgba(0, 118, 255, 1);
			}
		}
		.gb {
			width: 60upx;
			height: 60upx;
			border-radius: 50%;
			position: absolute;
			top: 770upx;
			left: 50%;
			transform: translateX(-50%);
		}
	}
}
</style>
