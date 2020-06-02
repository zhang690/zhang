<template>
	<view id="WeChat_correlation">
		<view class="Title">微信关联</view>
		<view class="icon">
			<image class="logo" src="../../../static/images/user/logo.png" mode=""></image>
			<image class="correlation" src="../../../static/images/user/correlation.png" mode=""></image>
			<image class="WeChat" src="../../../static/images/user/WeChat.png" mode=""></image>
		</view>
		<view class="Binding_WeChat" @click="WeChatLogin">绑定微信</view>
	</view>
</template>

<script>
export default {
	computed:{
		uuid() {
			return this.$store.state.user.uuid;
		}
	},
	data() {
		return {
			params:{}
		};
	},
	methods:{
		WeChatLogin() {
			let self = this;
			uni.login({
				provider: 'weixin',
				scopes: 'auth_base',
				success: function(loginRes) {
					// 获取用户信息
					uni.getUserInfo({
						provider: 'weixin',
						scopes: 'auth_base',
						success: function(infoRes) {
							console.log(infoRes);
							/**
							 * 实际开发中，获取用户信息后，需要将信息上报至服务端。
							 * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
							 */
							console.log(infoRes.userInfo);
							self.$store.dispatch('saveUserInfo', infoRes.userInfo);
							self.register();
						}
					});
				},
				fail: err => {
					console.error('授权登录失败：' + JSON.stringify(err), err.errMsg);
					let msg = '微信' + err.errMsg.substring(11, 17) + ',请选择其他方式登录';
					uni.showModal({
						title: '授权失败',
						content: msg,
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}
			});
		},
		async register() {
			let userInfo =  this.$store.state.user.userInfo;
			const data = {
				avatar: userInfo.avatarUrl, //头像
				code: this.params.code, //验证码
				mobile: this.params.mobile, //手机号
				nick: userInfo.nickName, //昵称
				openid: userInfo.openId, //微信openid
				unionid: userInfo.unionId,
				sex: userInfo.gender ,//性别
				type:1 ,//1=app,2=h5
				registerType: 1,
				is_agree: 1,
				uuid:this.uuid
			};
			console.log('data: ' + JSON.stringify(data));
			let reguserInfo =  await this.$api.register(data);
			// console.log(reguserInfo,879879879);
			if (reguserInfo.code == 200) {
				this.$store.dispatch('saveToken', reguserInfo.data.token);
				this.$store.dispatch('saveHasLogin', true);
				this.$store.dispatch('saveUuid',0);
;				uni.showToast({
					title: '绑定手机成功'
				});
				uni.reLaunch({
					url: '../../home/home'
				});
				this.submitBtnDis = false;
			} else {
				uni.showToast({
					title: reguserInfo.msg,
					icon: 'none'
				});
				this.submitBtnDis = false;
				return;
			}
		}
	},
	onLoad(v) {
		if(v.params){
			console.log(JSON.parse(v.params))
			this.params = JSON.parse(v.params)
		}
	}
};
</script>

<style lang="scss">
#WeChat_correlation {
	width: 100%;
	.Title {
		flex: 1;
		padding: 52upx 0;
		margin: 0 32upx;
		font-size: 64upx;
		font-family: Source Han Sans CN;
		font-weight: 500;
		color: rgba(49, 35, 32, 1);
	}
	.icon {
		flex: 1;
		height: 208upx;
		padding: 0upx 0;
		margin: 100upx 120upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.logo,
		.WeChat {
			width: 208upx;
			height: 208upx;
		}
		.correlation {
			width: 60upx;
			height: 60upx;
		}
	}
	.Binding_WeChat {
		width: 670upx;
		height: 98upx;
		text-align: center;
		line-height: 98upx;
		margin: 212upx auto;
		font-size: 36upx;
		font-family: Source Han Sans CN;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		background: linear-gradient(-37deg, rgba(42, 193, 124, 1), rgba(42, 193, 145, 1));
		box-shadow: 0 10upx 30upx 0 rgba(51, 226, 148, 0.5);
		border-radius: 49upx;
	}
}
</style>
