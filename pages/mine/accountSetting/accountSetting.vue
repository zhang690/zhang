<template>
	<view id="accountSetting">
		<view class="accountSetting_list">
			<view class="item input_border">
				<text class="first">手机号码</text>
				<text class="center phone">{{ username }}</text>
				<navigator class="text_box" url="./phoneBind/phoneBind">{{phoneTitle}}</navigator>
			</view>
			<view class="item">
				<text class="first">微信</text>
				<text class="center">{{ nick }}</text>
				<text @click="tradeWeChat" class="text_box">
					{{text}}
				</text>
			</view>
			<view class="postion_box">注：请在换微信前，确保已登录即将绑定的微信账户</view>
		</view>
		<view class="logOut" @tap="logOut">退出当前账号</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			nick: '',
			username: '',
			phoneTitle:'换手机',
			text:'换微信',
			userInfo: {
				phone: '',
				WeChat: ''
			}
		};
	},
	onShow() {
		this.getUserInfo();
	},
	methods: {
		switchPhone(){
			
		},
		async logOut() {
			console.log('退出');
			await this.$store.dispatch('changePlayState',false);
			this.$api.logout().then(res => {
				if (res.code == 200) {
					this.$store.dispatch('reLogin');
				}
			});
		},
		getUserInfo() {
			this.$api.getUserInfo().then(res => {
				if(res.code == 200){
					this.nick = res.data.nick || '';
					this.username = res.data.username;
					if(!res.data.openid){
						this.text = "去绑定"
						this.nick = '';
					}
					if(!this.username){
						this.phoneTitle = '去绑定'
					}
				}else{
					
				}
			});
		},
		tradeWeChat() {
			//调用微信登录
			let that = this;
			uni.login({
				provider: 'weixin',
				scopes: 'auth_user',
				success: function(loginRes) {
					// 获取用户信息
					uni.getUserInfo({
						provider: 'weixin',
						scopes: 'auth_user',
						success: function(infoRes) {
							let params = {
								openid: infoRes.userInfo.openId,
								unionid: infoRes.userInfo.unionId,
								avatar: infoRes.userInfo.avatarUrl,
								nick: infoRes.userInfo.nickName,
								sex: infoRes.userInfo.gender
							};
							console.log(infoRes, 1111);
							// return false;
							that.$api.updateWxAccout(params).then(res => {
								if (res.code == 200) {
									uni.showToast({
										icon: 'none',
										title: '更换成功'
									});
									// that.$store.dispatch("saveUserInfo", infoRes.userInfo);
									that.getUserInfo();
									console.log('userInfo:' + JSON.stringify(infoRes.userInfo));
								} else {
									uni.showToast({
										icon: 'none',
										title: res.msg
									});
								}
							});
						}
					});
				}
			});
		}
	}
};
</script>

<style lang="scss">
#accountSetting {
	width: 100%;
	background: #fafafc;
	.accountSetting_list {
		margin-top: 20upx;
		position: relative;
		margin-bottom: 134upx;
		background: rgba(255, 255, 255, 1);
		.item {
			height: 118upx;
			margin: 0 32upx;
			display: flex;
			align-items: center;
			.first {
				width: 211upx;
				font-size: 32upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
			}

			.center {
				flex: 1;
				font-size: 32upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: rgba(153, 153, 153, 1);
			}
			.phone {
				font-size: 30upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: rgba(102, 102, 102, 1);
			}
			.text_box {
				display: block;
				width: 120upx;
				height: 54upx;
				border: 2upx solid rgba(0, 215, 137, 1);
				border-radius: 54upx;
				font-size: 24upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: rgba(0, 215, 137, 1);
				line-height: 54upx;
				text-align: center;
			}
		}
	}
	.postion_box {
		width: 560upx;
		height: 46upx;
		position: absolute;
		left: 134upx;
		bottom: -62upx;
		background: rgba(250, 233, 140, 1);
		border-radius: 23upx 2upx 23upx 23upx;
		font-size: 22upx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(176, 152, 20, 1);
		line-height: 46upx;
		text-align: center;
	}

	.logOut {
		// width:194upx;
		height: 120upx;
		background: rgba(255, 255, 255, 1);
		font-size: 32upx;
		font-family: Source Han Sans CN;
		font-weight: 500;
		color: rgba(255, 79, 99, 1);
		text-align: center;
		line-height: 120upx;
	}
}
</style>
