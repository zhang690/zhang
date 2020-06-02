<template>
	<view id="loginIndex">
		<!-- <image class="backgrounds" src="../../static/images/loginIndex/background.png" mode="aspectFill"></image> -->
		<!-- <view class="backgrounds"></view> -->
		<image class="logo " :src="logo" mode=""></image>
		<view class="One_hundred">
			<navigator url="./loginRegister" class="Mobile_number_login" hover-class="none">手机号登录</navigator>
			<view class="Enter_as_a_tourist" @tap.stop="tourist" v-if="ifios">游客身份进入</view>
			<view class="Third_party_login ">
				<view class="x"></view>
				<view class="title">使用第三方账号登录</view>
				<view class="x"></view>
			</view>
			<view class="Login_mode">
				<view class="" @tap.stop="SignApple" v-if="apple"><image src="../../static/images/loginIndex/ios.png"></image></view>
				<view class="" @tap.stop="WeChatLogin"><image src="../../static/images/loginIndex/WeChat.png"></image></view>
			</view>
			
		</view>
		<view class="statement">
			<view class="xz" @click="inp_change"><radio :checked="inp_checked" style="transform:scale(0.65)"></radio></view>
			<view class="ti">
				同意轻听树下
				<view class="l" @click="toUrl(1)">《用户协议》</view>
				与
				<view class="l" @click="toUrl(2)">《隐私政策》</view>
			</view>
		</view>
	</view>
</template>

<script>
import logos from '@/static/images/loginIndex/logo.png';
export default {
	computed: {
		token() {
			return this.$store.state.user.token;
		},
		uuid() {
			return this.$store.state.user.uuid;
		},
		ifios(){
			return this.$isIos;
		},
		hasLogin() {
			return this.$store.state.user.hasLogin;
		},
	},
	data() {
		return {
			animate: false,
			logo: logos,
			apple: false,
			appleOauth: null,
			is_agree: 1 ,//同意协议 1 ，
			touristLogin:false,
			inp_checked:true
		};
	},
	onShow() {
		if (this.token && this.token !== 1 && this.hasLogin) {
			uni.showToast({
				title: '登录成功',
				icon:'none',
				duration: 2000
			});
			uni.reLaunch({
				url: '../home/home'
			});
		}
	},
	async onLoad() {
		// #ifdef APP-PLUS
		await this.getService();
		console.log(this.uuid);
		// #endif
	},
	methods: {
		inp_change() {
			this.inp_checked = !this.inp_checked;
			if (this.inp_checked == true) {
				console.log('同意协议');
				this.is_agree = 1;
			} else {
				this.is_agree = 0;
				console.log(2);
			}
		},
		toUrl(id) {
			uni.navigateTo({
				url: `Agreement?id=${id}`
			});
		},
		tourist() {
			this.touristLogin = true;
			if (!this.uuid) {
				let uuid ;
				uuid = '8C8398C2-CD3E-4458-9086-379C26190467';
				// #ifdef APP-PLUS
				 uuid = plus.device.uuid;
				// #endif
				this.$store.dispatch('saveUuid', uuid);
			}
			let temp = {
				type: 5,
				uuid: this.uuid,
				is_agree: this.is_agree
			};
			console.log(temp,83)
			this.postLogin(temp);
		},
		getService() {
			let that = this;
			plus.oauth.getServices(
				function(services) {
					for (var i in services) {
						var service = services[i];
						// 获取苹果授权登录对象，苹果授权登录id 为 'apple' iOS13以下系统，不会返回苹果登录对应的 service
						if (service.id == 'apple') {
							that.$nextTick(() => {
								that.apple = true;
							});
							that.appleOauth = service;
							break;
						}
					}
				},
				function(err) {
					// 获取 services 失败
				}
			);
		},
		async SignApple() {
			//苹果登录
			let self = this;
			this.appleOauth.logout(
				function(res) {
					console.log(res);
					if (!res.target.userInfo) {
						self.appleOauth.login(
							function(oauth) {
								// console.log(JSON.stringify(oauth));
								// 授权成功，苹果授权返回的信息在 oauth.target.appleInfo 中
								let appleInfo = oauth.target.appleInfo;
								self.$store.dispatch('saveUserInfo', appleInfo);
								let temp = {
									type: 4,
									userid: appleInfo.user,
									identityToken: appleInfo.identityToken
								};
								self.postLogin(temp);
							},
							function(err) {
								// 授权失败 error
							},
							{
								// 默认只会请求用户名字信息，如需请求用户邮箱信息，需要设置 scope: 'email'
								scope: 'email'
							}
						);
					}
				},
				function(err) {
					// 授权失败 error
				},
				{
					// 默认只会请求用户名字信息，如需请求用户邮箱信息，需要设置 scope: 'email'
					scope: 'email'
				}
			);
		},
		WeChatLogin() {
			console.log('微信');
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
							let temp = {
								openid: infoRes.userInfo.openId,
								type: 3,
								unionId: infoRes.userInfo.unionId
							};
							// console.log(infoRes.userInfo);
							self.$store.dispatch('saveUserInfo', infoRes.userInfo);
							self.postLogin(temp);
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
								// uni.redirectTo({
								//     url: '../login/login'
								// });
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}
			});
		},
		async postLogin(temp) {
			//登录验证
			let self = this;
			let userInfo = await this.$api.login(temp);
			// console.log(userInfo);
			if (userInfo.code == 1002 || userInfo.code == 1018 ) {
				uni.showModal({
					title: '提示',
					content: userInfo.msg + ' 立即前往关联',
					success: function(res) {
						if (res.confirm) {
							if(self.ifios){
								self.appleOauth.logout(function(res) {
									console.log(res, 1411111);
								});
							}
							self.$mRouter.push({
								route: self.$mRoutesConfig.loginRegister,
								query: { path: 'wechat' }
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			} 
			else if (userInfo.code == 1109 || userInfo.code == 1106) {
				uni.showModal({
					title: '提示',
					content: userInfo.msg + ' 立即前往关联',
					success: function(res) {
						if (res.confirm) {
							self.$mRouter.push({
								route: self.$mRoutesConfig.loginRegister,
								query: { path: 'apple' }
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			} 
			else if (userInfo.code == 200) {
				this.$store.dispatch('saveToken', userInfo.data.token);
				if(this.touristLogin){
					this.$store.dispatch('saveHasLogin', false);
					this.touristLogin = false;
					uni.showToast({
						title: '正在使用游客模式',
						icon:'none'
					});
					uni.reLaunch({
						url: '../home/home'
					});
				}else{
					this.$store.dispatch('saveHasLogin', true);
					uni.showToast({
						title: '登录成功',
						icon:'none'
					});
					uni.reLaunch({
						url: '../home/home'
					});
				}
				
			} else {
				uni.showToast({
					title: userInfo.msg,
					icon: 'none'
				});
				return;
			}
		}
	},
	onHide() {
		this.animate = false;
	}
};
</script>
<style lang="scss">
#loginIndex {
	width: 100vw;
	height: 100vh;
	background: url(../../static/images/loginIndex/background.jpeg) no-repeat;
	background-size: 100% 100%;
	position: relative;
	z-index: 2;
	// .backgrounds {
	// 	width: 100%;
	// 	height: 100%;
	// 	position: absolute;
	// 	background-color: rgba(0, 0, 0, 0.45);
	// 	z-index: 0;
	// }
	.logo {
		position: fixed;
		width: 550upx;
		height: 156upx;
		top: 314upx;
		left: 50%;
		transform: translate(-50%, 0);
		z-index: 10;
	}
	.One_hundred {
		width: 100%;
		position: fixed;
		z-index: 100;
		// bottom: 70upx;
		top: 60%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.Mobile_number_login {
			width: 556upx;
			height: 86upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 36upx;
			font-family: Source Han Sans CN;
			font-weight: 500;
			color: rgba(135, 165, 28, 1);
			background: rgba(255, 255, 255, 1);
			border-radius: 43upx;
		}
		.Enter_as_a_tourist {
			width: 181upx;
			height: 45upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 30upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			border-bottom: 2upx solid rgba(255, 255, 255, 1);
			margin-top: 66upx;
			// text-decoration:underline;
			color: rgba(255, 255, 255, 1);
		}
		.Third_party_login {
			width: 300upx;
			height: 20px;
			margin-top: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			.x {
				flex: 1;
				height: 1px;
				background: rgba(255, 255, 255, 1);
			}
			.title {
				padding: 0 10upx;
				text-align: center;
				font-size: 20upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: rgba(255, 255, 255, 1);
			}
		}
		.Login_mode {
			width: 468upx;
			// height: 70upx;
			margin-top: 28upx;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			z-index: 120;
			image {
				width: 70upx;
				height: 70upx;
				margin: 0 82upx;
				border-radius: 70upx;
				overflow: hidden;
			}
		}
	}
	.text {
		font-size: 96upx;
		font-family: Source Han Sans CN;
		font-weight: 500;
		text-shadow: #ff0000 0 0 10px;
		color: white;
		margin-top: 30%;
		text-align: center;
	}
	.scale-ups {
		animation: scale-up 2s;
	}
	@keyframes scale-up {
		0% {
			opacity: 0;
			transform: scale(0.2) skew(30deg, -10deg);
		}
		50% {
			opacity: 0.5;
			transform: scale(0.2) skew(60deg, -20deg);
		}
		100% {
			opacity: 1;
			transform: scale(1) skew(0deg, 0deg);
		}
	}

	.box_login {
		position: fixed;
		bottom: 174upx;
		// margin: 0 auto;
		z-index: 2;
		.login_box {
			border-radius: 49upx;
			font-size: 36upx;
			font-family: Source Han Sans CN;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
			line-height: 100upx;
			text-align: center;
			margin: 0 40upx;
		}
		.weChat {
			width: 670upx;
			height: 98upx;
			background: linear-gradient(-37deg, rgba(42, 193, 124, 1), rgba(42, 193, 145, 1));
			box-shadow: 0px 10upx 30upx 0px rgba(51, 226, 148, 0.5);
		}
		.phone {
			width: 672upx;
			height: 100upx;
			margin-top: 34upx;
			border: 2upx solid rgba(255, 255, 255, 1);
			box-shadow: 0px 1upx 8upx 0px rgba(227, 226, 226, 0.66);
			border-radius: 49upx;
		}
	}
	.statement {
		position: fixed;
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: center;
		bottom: 50upx;
		height: 30upx;
		font-size: 24upx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		z-index: 130;
		// color: rgba(102, 102, 102, 1);
		color: rgba(255, 255, 255, 1);
		opacity: 0.75;
		.xz {
			width: 100upx;
			height: 100upx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-left: -40upx;
		}
		.ti {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin-left: -20upx;
			.l {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				color: rgba(255, 205, 16, 1);
			}
		}
	}
}
</style>
