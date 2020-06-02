<template>
	<view id="mine" @click.stop="hideSphere">
		<view class="status_bar"><view class="top_view"></view></view>
		<view class="user_top">
			<view class="img_box"><image :src="avatar" mode="aspectFit" class="img"></image></view>
			<view class="user_info">
				<view v-if="hasLogin">
					<view class="user_name">{{ nick }}</view>
					<view class="student_number">
						<text>学号：</text>
						<text>{{ id }}</text>
					</view>
				</view>
				<view class="user_name" v-else @tap="toLogin">立即登录</view>
			</view>
		</view>
		<view class="user_server" @click="tcxs"><image src="../../static/images/mine/server.png" mode="aspectFit"></image></view>
		<view class="set_list">
			<view class="list_item" v-for="(item, index) of set_list" :key="index" hover-class="none" @tap.stop="tapUrl(item)">
				<view class="item_img" :style="[{ 'background-image': 'url( ' + item.imgurl + ')', width: item.w + 'upx', height: item.h + 'upx' }]"></view>
				<view class="item_name">
					{{ item.name }}
					<text class="hint" v-if="item.hint">{{ item.hint }}</text>
				</view>
				<uni-icons :size="20" class="uni-icon-wrapper" color="#333333" type="arrowright" />
			</view>
		</view>

		<!-- <navigator url="./buy/buy">跳转购买</navigator> -->
		<tc v-if="xs == 1" zt="1" :number="number" :imageurl="imageurl" @fromChild="tcyc"></tc>
		<share ref="share"></share>
		<!-- 播放球 -->
		<music-sphere v-show="sphereExist" ref="sphere" :percent="currentTime"></music-sphere>
	</view>
</template>

<script>
import love from '@/static/images/mine/love.png';
import indent from '@/static/images/mine/indent.png';
import balance from '@/static/images/mine/balance.png';
import news from '@/static/images/mine/news.png';
import set from '@/static/images/mine/set.png';
import shares from '@/static/images/mine/share.png';
import about from '@/static/images/mine/about.png';
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import tc from '@/components/tc.vue'; // 弹窗
import share from '@/components/share';
import $mRoutesConfig from '@/config/routes.config.js';
export default {
	computed: {
		sphereExist() {
			return this.$store.state.musicPlayer.sphereExist;
		},
		sphereShow() {
			return this.$store.state.musicPlayer.sphereShow;
		},
		currentTime() {
			return this.$store.state.musicPlayer.currentTime;
		},
		hasLogin() {
			return this.$store.state.user.hasLogin;
		},
		token() {
			return this.$store.state.user.token;
		},
		uuid() {
			return this.$store.state.user.uuid;
		}
	},
	components: {
		uniIcons,
		tc,
		share
	},
	data() {
		return {
			// hasLogin:false,
			avatar: '',
			nick: '',
			id: '',
			set_lists: [],
			set_list: [
				{
					id: 1,
					name: '我喜欢的',
					imgurl: love,
					w: 34,
					h: 30,
					url: $mRoutesConfig.myLove
				},
				{
					id: 2,
					name: '我的余额',
					imgurl: balance,
					w: 34,
					h: 30,
					url: $mRoutesConfig.myBalance
				},
				{
					id: 3,
					name: '我的订单',
					imgurl: indent,
					w: 34,
					h: 38,
					url: $mRoutesConfig.myOrder
				},
				{
					id: 4,
					name: '接收新消息通知',
					imgurl: news,
					hint: '去开启',
					w: 34,
					h: 34
				},
				{
					id: 5,
					name: '账户设置',
					imgurl: set,
					w: 34,
					h: 32,
					url: $mRoutesConfig.accountSetting
				},
				{
					id: 6,
					name: '分享App',
					imgurl: shares,
					w: 34,
					h: 34
					// url: './accountSetting/accountSetting'
				},
				{
					id: 7,
					name: '关于我们',
					imgurl: about,
					w: 32,
					h: 32,
					url: $mRoutesConfig.about
				},
			],

			// 弹窗
			xs: 0,
			number: '',
			imageurl: ''
		};
	},
	onLoad() {
		this.getCustomerWX();
		if (!this.$isIos) {
			this.set_list.splice(1, 1);
		}
		// #ifdef APP-PLUS
		this.ifOpenPush();
		// #endif
	},
	onShow() {
		this.getUserInfo();
	},
	methods: {
		toLogin() {
			this.$store.dispatch('reLogin');
		},
		hideSphere() {
			if (!this.sphereExist && !this.sphereShow) {
				return false;
			} else {
				this.$refs.sphere.hide();
			}
		},
		getCustomerWX() {
			this.$api.getCustomerWX().then(res => {
				if (res.code !== 200 || !res.data) return;
				this.number = res.data.wechat || '';
				this.imageurl = res.data.wechat_code || '';
			});
		},
		getUserInfo() {
			let temp = {};
			if(!this.hasLogin){
				temp.uuid = this.uuid
			}
			this.$api.getUserInfo(temp).then(res => {
				if (res.code == 200) {
					this.$nextTick(()=>{
						this.nick = res.data.nick;
						this.avatar = res.data.avatar;
						this.id = res.data.id;
					})
				} else if (res.code == 1900){
					this.$nextTick(() => {
						this.avatar = res.data;
					});
				}
				else {
					this.$nextTick(() => {
						this.avatar = '';
					});
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
				}
			});
		},
		tcxs() {
			if (!this.imageurl) {
				uni.showModal({
					showCancel: false,
					content: '暂未配置客服图片'
				});
				return;
			}
			this.xs = 1;
			console.log(this.imageurl);
		},
		tcyc(v) {
			this.xs = v;
		},
		tapUrl(v) {
			switch (v.id) {
				case 4:
					if (!this.$isIos) {
						var main = plus.android.runtimeMainActivity();
						var pkName = main.getPackageName();
						var NotificationManagerCompat = plus.android.importClass('android.support.v4.app.NotificationManagerCompat');
						var packageNames = NotificationManagerCompat.from(main);
						console.log(JSON.stringify(packageNames));
						if (packageNames.areNotificationsEnabled()) {
							console.log('已开启通知权限');
							uni.showToast({
								title: '已开启',
								icon: 'none'
							});
						} else {
							uni.showModal({
								title: '提示',
								content: '请先打开APP通知权限',
								showCancel: false,
								success: function(res) {
									if (res.confirm) {
										var Intent = plus.android.importClass('android.content.Intent');
										var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS'); //可设置表中所有Action字段
										intent.putExtra('android.provider.extra.APP_PACKAGE', pkName);
										main.startActivity(intent);
									}
								}
							});
						}
					} else {
						this.isOpenPush();
					}
					break;
				case 6:
					let params = {
						type: 1,
						course_id: 0
					};
					this.$refs.share.shares(params);
					break;
				default:
					this.$mRouter.push({
						route: v.url
					});
					break;
			}
		},
		isOpenPush() {
			//打开push
			var UIApplication = plus.ios.import('UIApplication');
			var app = UIApplication.sharedApplication();
			var enabledTypes = 0;
			if (app.currentUserNotificationSettings) {
				var settings = app.currentUserNotificationSettings();
				enabledTypes = settings.plusGetAttribute('types');
				console.log('enabledTypes1:' + enabledTypes);
				if (enabledTypes == 0) {
					plus.nativeUI.confirm(
						'推送设置没有开启，是否去开启？',
						function(e) {
							if (e.index == 0) {
								var NSURL2 = plus.ios.import('NSURL');
								var setting2 = NSURL2.URLWithString('app-settings:');
								var application2 = UIApplication.sharedApplication();
								application2.openURL(setting2);
								plus.ios.deleteObject(setting2);
								plus.ios.deleteObject(NSURL2);
								plus.ios.deleteObject(application2);
							}
						},
						{
							buttons: ['Yes', 'No'],
							verticalAlign: 'center'
						}
					);
				}else{
					uni.showToast({
						title: '已开启',
						icon: 'none'
					});
				}
				plus.ios.deleteObject(settings);
			} else {
				enabledTypes = app.enabledRemoteNotificationTypes();
				if (enabledTypes == 0) {
					console.log('推送未开启!');
				} else {
					console.log('已经开启推送功能!');
				}
				console.log('enabledTypes2:' + enabledTypes);
			}
			plus.ios.deleteObject(app);
		},
		ifOpenPush() {
			if (!this.$isIos) {
				let main = plus.android.runtimeMainActivity();
				let pkName = main.getPackageName();
				let NotificationManagerCompat = plus.android.importClass('android.support.v4.app.NotificationManagerCompat');
				let packageNames = NotificationManagerCompat.from(main);
				console.log(JSON.stringify(packageNames));
				if (packageNames.areNotificationsEnabled()) {
					if(this.$isIos){
						this.$set(this.set_list[3], 'hint', '已开启');
						return;
					}
					this.$set(this.set_list[2], 'hint', '已开启');
					
				}
			} else {
				let UIApplication = plus.ios.import('UIApplication');
				let app = UIApplication.sharedApplication();
				let settings = app.currentUserNotificationSettings();
				let enabledTypes = 0;
				if (app.currentUserNotificationSettings) {
					enabledTypes = settings.plusGetAttribute('types');
					console.log('enabledTypes1:' + enabledTypes);
					if (enabledTypes != 0) {
						if(this.$isIos){
							this.$set(this.set_list[3], 'hint', '已开启');
							return;
						}
						this.$set(this.set_list[2], 'hint', '已开启');
					}
				} else {
					console.log('enabledTypes2:' + enabledTypes);
					enabledTypes = app.enabledRemoteNotificationTypes();
					if (enabledTypes != 0) {
						if(this.$isIos){
							this.$set(this.set_list[3], 'hint', '已开启');
							return;
						}
						this.$set(this.set_list[2], 'hint', '已开启');
					}
				}
				plus.ios.deleteObject(app);
			}
		}
	},
	onPageScroll(e) {
		this.hideSphere();
	}
};
</script>

<style lang="scss">
#mine {
	width: 100%;
	uni-image > img {
		opacity: 1 !important;
	}
	.user_top {
		display: flex;
		align-items: center;
		margin-left: 50upx;
		margin-top: 54upx;
		.img_box {
			width: 144upx;
			height: 144upx;
			box-shadow: 0px 3upx 32upx 0px rgba(4, 0, 0, 0.19);
			border-radius: 50%;
			image {
				width: 100%;
				height: 100%;
				display: block;
				border-radius: 50%;
			}
		}
		.user_info {
			margin-left: 32upx;
			font-size: 0;
			.user_name {
				font-size: 42upx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(51, 51, 51, 1);
				margin-bottom: 10upx;
			}
			.student_number {
				font-size: 28upx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
			}
		}
	}
	.user_server {
		width: 686upx;
		height: 200upx;
		border-radius: 12upx;
		margin: 0 32upx;
		margin-top: 73upx;
		image {
			width: 100%;
			height: 100%;
			display: block;
			border-radius: 12upx;
		}
	}
	.set_list {
		margin-top: 120upx;
		.list_item {
			display: flex;
			margin-bottom: 80upx;
			align-items: center;
			margin: 0upx 40upx 80upx 54upx;
			.item_name {
				display: flex;
				flex: 1;
				align-items: center;
				font-size: 32upx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(51, 51, 51, 1);
				justify-content: space-between;
			}
			.hint {
				font-size: 28upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: rgba(0, 215, 137, 1);
				margin-right: 10upx;
			}
		}
		.item_img {
			background-size: 100% 100%;
			margin-right: 34upx;
		}
	}
}
</style>
