<template>
	<view class="share">
	</view>
</template>

<script>
	export default {
		computed:{
			token() {
				return this.$store.state.user.token;
			}
		},
		data() {
			return {
				providerList:[],
				datas:[]
			};
		},
		methods:{
			async shares(params) {
				let tems = null;
				if (!this.token || this.token ==1) {
					// #ifdef APP-PLUS
					plus.nativeUI.showWaiting('您暂未登录，即将跳往登录...');
					// #endif
					// #ifndef APP-PLUS
					uni.showToast({
						title: '您暂未登录，即将跳往登录',
						icon: 'loading',
						duration: 2000
					});
					// #endif
				
					tems = setTimeout(()=> {
						// #ifdef APP-PLUS
						plus.nativeUI.closeWaiting();
						// #endif
						// #ifndef APP-PLUS
						uni.hideLoading();
						// #endif
						this.$store.dispatch('reLogin');
						clearTimeout(tems);
					}, 2000);
					return;
				}
				// console.log(params,2323)
				
				if (this.providerList.length === 0) {
					uni.showModal({
						content: '当前环境无分享渠道!',
						showCancel: false
					});
					return;
				}
				let res = await this.$api.getShareAddress(params);
				if(res.code ==200){
					this.datas = res.data;
					console.log(this.datas,58)
					let itemList = this.providerList.map(function(value) {
						return value.name;
					});
					uni.showActionSheet({
						itemList: itemList,
						success: res => {
							console.log(this.providerList[res.tapIndex].id);
							if (this.providerList[res.tapIndex].id == 'qq') {
								this.type = 1;
							} else {
								this.type = 0;
							}
							uni.share({
								provider: this.providerList[res.tapIndex].id,
								scene: this.providerList[res.tapIndex].type && this.providerList[res.tapIndex].type === 'WXSenceTimeline' ?
									'WXSenceTimeline' : 'WXSceneSession',
								type: this.type,
								title: this.datas.title,
								summary: this.datas.content,
								imageUrl: this.datas.img,
								href: this.datas.url,
								success: res => {
									console.log('success:' + JSON.stringify(res));
								},
								fail: e => {
									uni.showModal({
										content: e.errMsg,
										showCancel: false
									});
								}
							});
						}
					});
				}
				
			},
			
			async getShareAddress() {
				await this.$api.getShareAddress().then(res => {
					if(res.code == 200){
						this.datas = res.data;
					}else{
						console.log('获取登录通道失败' + res.msg);
					}
				});
			},
		},
		created() {
				uni.getProvider({
					service: 'share',
					success: e => {
						let data = [];
						for (let i = 0; i < e.provider.length; i++) {
							switch (e.provider[i]) {
								case 'weixin':
									data.push({
										name: '分享到微信好友',
										id: 'weixin'
									});
									data.push({
										name: '分享到微信朋友圈',
										id: 'weixin',
										type: 'WXSenceTimeline'
									});
									break;
								default:
									break;
							}
						}
						this.providerList = data;
						// console.log('获取登录通道失败' + JSON.stringify(this.providerList));
					},
					fail: e => {
						console.log('获取登录通道失败' + JSON.stringify(e));
					}
				});
		},
		onReady() {
		}
	}
</script>
<style lang="scss">

</style>
