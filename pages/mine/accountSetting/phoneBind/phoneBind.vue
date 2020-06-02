<template>
	<view id="loginRegister">
		<view class="title">绑定手机</view>

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
		<button type="primary" class="btn" @tap="bindPhone" :loading="submitBtnDis" :disabled="!submitBtnDisKey" :class="[{ submitBtnDisKey: submitBtnDisKey }]">绑定/换绑</button>
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
		},
		ifios() {
			return this.$isIos;
		}
	},
	data() {
		return {
			btnDis: false,
			submitBtnDis: false,
			btnText: '获取验证码',
			params: {
				mobile: '',
				code: ''
			},
			
		};
	},
	methods: {
		

		 bindPhone() {
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
				this.submitBtnDis = true;
				console.log(this.params)
				this.$api.bindPhone(this.params).then(res=>{
					console.log(res)
					this.submitBtnDis = false;
					if(res.code == 200){
						uni.showToast({
							title:'绑定成功',
							icon:'none',
						})
						let tem = setTimeout(()=>{
							uni.navigateBack();
							clearTimeout(tem);
						},1000)
					}else{
						uni.showToast({
							title:res.msg,
							icon:'none',
						})
					}
				})
				
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
}
</style>
