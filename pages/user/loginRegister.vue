<template>
	<view id="loginRegister">
		<view class="title">登录/注册</view>
		<view class="title_dsc">未注册用户验证后自动登录</view>

		<view class="login_contorl">
			<view class="login_contorl_phone input_border login_contorl_box">
				<view class="text">
					<text class="texts">+</text>
					<text>86</text>
				</view>
				<input type="number" v-model="params.mobile" placeholder="请输入手机号" maxlength="11" />
			</view>
			<view class="login_contorl_code input_border login_contorl_box">
				<input type="number" v-model="params.code" placeholder="短信验证码" maxlength="6" />
				<view class="sendCode" @tap="sendCodes" :class="[{ btnDis: btnDis }]">{{ btnText }}</view>
			</view>
		</view>
		<button type="primary" class="btn" @tap="userLogin" :loading="submitBtnDis" :disabled="!submitBtnDisKey" :class="[{ submitBtnDisKey: submitBtnDisKey }]">登录/注册</button>
		<view class="statement">
			<view class="xz" @click="inp_change"><radio :checked="inp_checked" style="transform:scale(0.65)"></radio></view>
			<view class="ti">
				同意轻听树下
				<view class="l" @click="yhxy">《用户协议》</view>
				与
				<view class="l" @click="yszc">《隐私政策》</view>
			</view>
		</view>
	</view>
</template>

<script>
import graceChecker from '@/common/graceChecker.js';
import formRuleConfig from '@/config/formRule.config.js';
export default {
	computed: {
		submitBtnDisKey() {
			let checkParams = {};
			checkParams['mobile'] = this.params.mobile;
			checkParams['code'] = this.params.code;
			let res = graceChecker.check(checkParams, formRuleConfig.loginRule);
			console.log(res);
			return res;
		},
		uuid() {
			return this.$store.state.user.uuid;
		}
	},
	data() {
		return {
			inp_checked: false,
			btnDis: false,
			submitBtnDis: false,
			btnText: '获取验证码',
			params: {
				mobile: '',
				code: ''
			},
			isWeChat: false,
			isApple: false,
			status: 0, // 0第一次请求，当该手机号已经绑定了其他三方的时候传1 apple必填
			is_agree: 0, //同意协议 1 ，
			is_login: 0 ,//未注册
			is_pass:0 //0不跳过注册 1跳过
		};
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
		yhxy() {
			uni.navigateTo({
				url: 'Agreement?id=1'
			});
		},
		yszc() {
			uni.navigateTo({
				url: 'Agreement?id=2'
			});
		},

		userLogin() {
			//登录
			// 手机验证码登录
			let self = this;
			try {
				let checkRes = graceChecker.check(this.params, formRuleConfig.loginRule);
				if (!checkRes) {
					uni.showToast({
						title: graceChecker.error,
						icon: 'none'
					});
					return;
				}
				// 校验通过...
				console.log(this.isWeChat, 2323);
				if (!this.is_agree) {
					uni.showToast({
						title: '请先同意协议',
						icon: 'none'
					});
					return;
				}
				this.submitBtnDis = true;

				if (this.isWeChat) {
					this.register();
					return;
				}

				if (this.isApple) {
					this.appleRegister();
					return;
				}

				let params = Object.assign({ type: 1 }, this.params);
				this.$api.login(params).then(res => {
					console.log(res);
					let data = res.data;
					switch (res.code) {
						case 200:
							//直接可以登录
							this.submitBtnDis = false;
							this.$store.dispatch('saveToken', data.token);
							this.$store.dispatch('saveHasLogin', true);
							uni.showToast({
								title: '登陆成功',
								icon: 'none'
							});
							uni.reLaunch({
								url: '../home/home'
							});
							break;
						case 1002 || 1018:
							uni.showToast({
								title: res.msg + '请您进行微信绑定',
								icon: 'none'
							});
							console.log('调往微信授权');
							uni.navigateTo({
								url: './WeChat_correlation/WeChat_correlation?params=' + JSON.stringify(this.params)
							});
							this.submitBtnDis = false;
							break;
						default:
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
							this.submitBtnDis = false;
							return;
							break;
					}
				});
			} catch (e) {
				console.log(e);
				this.submitBtnDis = false;
			}
		},
		async sendCodes() {
			//发送验证码
			if (this.btnDis) {
				return;
			}
			let checkRes = graceChecker.check(this.params, formRuleConfig.sendCodeRule);
			if (!checkRes) {
				uni.showToast({
					title: graceChecker.error,
					icon: 'none'
				});
				return;
			}
			console.log(this.$api);
			let sendCode = await this.$api.sendCode({
				phone: this.params.mobile
			});
			// console.log('adds: ' + JSON.stringify(add));
			if (sendCode.code == 200) {
				uni.showToast({
					title: '发送成功',
					icon: 'none'
				});
				if (sendCode.data.is_login == 1 && !this.inp_checked) {
					this.inp_change();
				}
				// 开启倒计时
				this.countDown();
			} else {
				uni.showToast({
					title: '发送失败',
					icon: 'none'
				});
			}
		},
		countDown() {
			// 验证码倒计时
			let t = null;
			let timer = 60;
			this.btnDis = true;
			clearInterval(t);
			this.btnText = `倒计时${timer}s`;
			t = setInterval(() => {
				if (timer <= 1) {
					clearInterval(t);
					this.btnText = '重新发送';
					this.btnDis = false;
					return;
				}
				timer--;
				this.btnText = `倒计时${timer}s`;
			}, 1000);
		},
		async register() {
			let userInfo = this.$store.state.user.userInfo;
			let data = {
				avatar: userInfo.avatarUrl, //头像
				code: this.params.code, //验证码
				mobile: this.params.mobile, //手机号
				nick: userInfo.nickName, //昵称
				openid: userInfo.openId, //微信openid
				unionid: userInfo.unionId,
				sex: userInfo.gender, //性别
				registerType: 1,
				is_agree: this.is_agree,
				type: 1 ,//1=app,2=h5
				is_pass:this.is_pass,
			};
			if(this.uuid){
				data = Object.assign(data,{uuid:this.uuid})
			}
			console.log('data: ' + JSON.stringify(data));
			let reguserInfo = await this.$api.register(data);
			console.log(reguserInfo, 879879879);
			if (reguserInfo.code == 200) {
				this.$store.dispatch('saveToken', reguserInfo.data.token);
				this.$store.dispatch('saveHasLogin', true);
				uni.showToast({
					title: '绑定手机成功'
				});
				uni.reLaunch({
					url: '../home/home'
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
		},
		async appleRegister() {
			let that = this;
			let userInfo = this.$store.state.user.userInfo;
			let data = {
				code: this.params.code, //验证码
				mobile: this.params.mobile, //手机号
				type: 1, //1=app,2=h5
				nick: '用户' + String(this.params.mobile).substring(7,11),
				status: this.status,
				userid: userInfo.user,
				is_agree: this.is_agree,
				registerType: 2,
				is_pass:this.is_pass
			};
			if(this.uuid){
				data = Object.assign(data,{uuid:this.uuid})
			}
			console.log('data: ' + JSON.stringify(data));
			let reguserInfo = await this.$api.register(data);
			console.log(reguserInfo, 879879879);
			if (reguserInfo.code == 200) {
				this.$store.dispatch('saveToken', reguserInfo.data.token);
				this.$store.dispatch('saveHasLogin', true);
				uni.showToast({
					title: '绑定手机成功'
				});
				uni.reLaunch({
					url: '../home/home'
				});
				this.submitBtnDis = false;
			} else if (reguserInfo.code == 1109) {
				uni.showModal({
					title: this.params.mobile,
					content: reguserInfo.msg,
					success: function(res) {
						if (res.confirm) {
							that.status = 1;
							that.appleRegister();
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
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
	onShow() {},
	onLoad(v) {
		// console.log(v);
		if (v.path == 'wechat') {
			//微信授权来注册
			this.isWeChat = true;
		}
		if (v.path == 'apple') {
			//微信授权来注册
			this.isApple = true;
		}
	},
	destroyed() {
		this.submitBtnDis = false;
	}
};
</script>

<style lang="scss">
#loginRegister {
	width: 100%;
	margin: 40upx;
	.title {
		font-size: 64upx;
		font-family: Source Han Sans CN;
		font-weight: 500;
		color: rgba(0, 0, 0, 1);
		line-height: 78upx;
	}
	.title_dsc {
		font-size: 32upx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
	}
	.login_contorl {
		margin-top: 108upx;
		.login_contorl_box {
			// height: 134upx;
			box-sizing: border-box;
			padding-top: 64upx;
			padding-bottom: 40upx;
			input {
				flex: 1;
			}
		}
		.login_contorl_phone {
			display: flex;
			align-items: center;
			.text {
				position: relative;
				display: flex;
				align-items: top;
				font-size: 32upx;
				font-family: Source Han Sans CN;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				margin: 0 50upx 0 9upx;
				.texts {
					margin-top: -2upx;
					margin-right: 5upx;
				}
			}
			.text::after {
				position: absolute;
				content: '';
				width: 2upx;
				height: 30upx;
				right: -14upx;
				background: rgba(205, 206, 210, 1);
				top: 50%;
				margin-top: -15upx;
			}
		}

		.login_contorl_code {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-left: 10upx;
			padding-right: 10upx;

			.sendCode {
				box-sizing: border-box;
				min-width: 190upx;
				// height: 56upx;
				// border-radius: 28upx;
				// margin-top: 35upx;
				text-align: center;
				padding: 0 10upx;
				font-size: 32upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: rgba(0, 215, 137, 1);
			}
			.btnDis {
				font-weight: 400;
				color: rgba(205, 206, 210, 1);
			}
		}
	}
	.btn {
		width: 670upx;
		height: 98upx;
		background: rgba(235, 235, 235, 1);
		border-radius: 49upx;
		margin: 120upx auto;
		margin-bottom: 0;
		font-size: 36upx;
		font-family: Source Han Sans CN;
		font-weight: 500;
		color: rgba(153, 153, 153, 1);
		text-align: center;
		line-height: 98upx;
	}
	.submitBtnDisKey {
		color: #fff;
		background: linear-gradient(-37deg, #2ac17c, #2ac191);
		box-shadow: 0px 5px 16px 0px rgba(51, 226, 148, 0.5);
	}
	uni-button::after {
		border: none !important;
	}
	uni-button::before {
		border: none !important;
	}
	.statement {
		position: fixed;
		bottom: 70upx;
		flex: 1;
		height: 30upx;
		margin: 0 70upx;
		font-size: 24upx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		// color: rgba(102, 102, 102, 1);
		color: #666;
		display: flex;
		justify-content: flex-start;
		align-items: center;
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
				color: RGBA(21, 118, 247, 0.8);
			}
		}
	}
}
</style>
