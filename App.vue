<script>
import Vue from 'vue';
export default {
	globalData: {
		videoContext: null,
		audioCtime: 0
	},
	onLaunch: function() {
		// console.log(this.globalData)
		let self = this;
		uni.getSystemInfo({
			success: function(e) {
				// #ifndef MP
				Vue.prototype.StatusBar = e.statusBarHeight;
				if (e.platform == 'android') {
					Vue.prototype.CustomBar = e.statusBarHeight + 50;
				} else {
					Vue.prototype.CustomBar = e.statusBarHeight + 45;
				}
				// #endif
				// #ifdef MP-WEIXIN
				Vue.prototype.StatusBar = e.statusBarHeight;
				let custom = wx.getMenuButtonBoundingClientRect();
				Vue.prototype.Custom = custom;
				Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
				// #endif
				// #ifdef MP-ALIPAY
				Vue.prototype.StatusBar = e.statusBarHeight;
				Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
				// #endif
			}
		});

		// #ifdef APP-PLUS
		// 锁定屏幕方向
		plus.screen.lockOrientation('portrait-primary'); //锁定

		//推送
		const _handlePush = function(message) {
			// TODO
			console.log(message);
		};
		plus.push.addEventListener('click', _handlePush);
		plus.push.addEventListener('receive', _handlePush);
		// #endif

		// 移动资源包升级
		// #ifdef APP-PLUS

		plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
			let platform = uni.getSystemInfoSync().platform === 'android' ? 1 : 2;
			let parmas = {
				version: widgetInfo.version,
				appid: widgetInfo.appid,
				system: platform
			};
			// console.log(parmas, widgetInfo.version, widgetInfo.appid, 6555555555555555555555555555555555);
			//整包升级
			self.$api.appUpdate(parmas).then(res => {
				let datas = res.data;
				console.log(datas, 511111);
				if (res.code == 200 && datas.status) {
					self.dtaskStart(datas.url, platform, datas.note);
					return false;
				} else {
					//资源包升级
					let data = {
						version: widgetInfo.version,
						name: widgetInfo.name,
						system: platform
					};
					self.$api.resourceUpdate(data).then(res => {
						var data = res.data;
						console.log(data, 'ziyuan');
						if (data.update && data.wgtUrl) {
							uni.downloadFile({
								url: data.wgtUrl,
								success: downloadResult => {
									if (downloadResult.statusCode === 200) {
										self.installWgt(downloadResult.tempFilePath);
									}
								}
							});
						}
					});
				}
			});
		});
		// #endif
	},
	onLoad() {},
	onShow: function() {
		console.log('App Show');
		
	},
	onHide: function() {
		console.log('App Hide');
	},
	methods: { 
		createDownload(url) {
			var dtask = plus.downloader.createDownload(url, {}, function(d, status) {
				// 下载完成
				if (status == 200) {
					plus.nativeUI.closeWaiting();
					console.log('Download success: ' + d.filename);
					plus.runtime.install(
						d.filename,
						{},
						function() {
							plus.nativeUI.closeWaiting();
							// plus.nativeUI.alert('安装成功！', function() {
							// 	plus.runtime.restart();
							// });
						},
						function(e) {
							plus.nativeUI.closeWaiting();
							console.log('安装失败[' + e.code + ']：' + e.message);
							plus.nativeUI.alert('安装失败[' + e.code + ']：' + e.message);
						}
					);
				} else {
					plus.nativeUI.closeWaiting();
					console.log('Download failed: ' + status);
				}
			});
			dtask.start();
		},
		
		// 更新应用资源
		installWgt(path) {
			plus.nativeUI.showWaiting('安装wgt文件...');
			plus.runtime.install(
				path,
				{},
				function() {
					plus.nativeUI.closeWaiting();
					console.log('安装wgt文件成功！');
					plus.nativeUI.alert('应用资源更新完成！', function() {
						plus.runtime.restart();
					});
				},
				function(e) {
					plus.nativeUI.closeWaiting();
					console.log('安装wgt文件失败[' + e.code + ']：' + e.message);
					plus.nativeUI.alert('安装wgt文件失败[' + e.code + ']：' + e.message);
				}
			);
		},
		// 下载整包
		dtaskStart(url, platform, note) {
			let that = this;
			console.log(url, platform);
			if (platform == 2) {
				plus.runtime.openURL(url);
				return false;
			} else {
				plus.nativeUI.showWaiting('下载中...');
				uni.showModal({
					showCancel: false,
					title: '版本大更新',
					content: '更新内容：' + note,
					success: function(res) {
						if (res.confirm) {
							that.createDownload(url);
							return false;
						} else if (res.cancel) {
							plus.nativeUI.closeWaiting();
							uni.showToast({
								title: '取消更新',
								duration: 1000,
								icon: 'none'
							});
						}
					}
				});
			}
		}
	}
};
</script>

<style>
/* @import 'colorui/main.css'; */
/* @import 'colorui/icon.css'; */
/*每个页面公共css */

/*  #ifndef  APP-PLUS-NVUE  */
body,
page {
	min-height: 100%;
	display: flex;
	background: #fff;
}
@font-face {
	font-family: iconfont;
	src: url('~@/static/icon/iconfont.ttf');
}
.iconfont {
	font-family: iconfont;
}

.input_border {
	position: relative;
}
.input_border::after {
	position: absolute;
	right: 0;
	bottom: 0;
	left: 0upx;
	height: 1upx;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #c8c7cc;
}
/*  #endif  */
</style>
