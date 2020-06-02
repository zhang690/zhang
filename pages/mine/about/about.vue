<template>
	<view id="about">
		<view class="set_list">
			<view class="list_item" v-for="(item, index) of set_list" :key="index" hover-class="none" @tap.stop="tapUrl(item)">
				<view class="item_name">
					{{ item.name }}
					<text class="hint">{{ item.hint }}</text>
				</view>
				<uni-icons v-if="item.id !== 1" :size="20" class="uni-icon-wrapper" color="#333333" type="arrowright" />
				<view class="" v-if="item.id == 1">{{ version }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import $mRoutesConfig from '@/config/routes.config.js';
export default {
	computed:{
		ifIos(){
			return this.$isIos
		}
	},
	components: {
		uniIcons
	},
	data() {
		return {
			set_list: [
				{
					id: 1,
					name: '系统版本'
				},
				{
					id: 2,
					name: '用户协议',
					url: $mRoutesConfig.Agreement
				},
				{
					id: 3,
					name: '隐私协议',
					url: $mRoutesConfig.Agreement
				}
			],
			version: '1.0.0'
		};
	},
	methods: {
		tapUrl(v) {
			console.log(v);
			switch (v.id) {
				case 1:
					return false;
					break;
				case 2:
					this.$mRouter.push({
						route: v.url,
						query: {
							id: 1
						}
					});
					break;
				case 3:
					this.$mRouter.push({
						route: v.url,
						query: {
							id: 2
						}
					});
					break;
				case 4:
					plus.runtime.openURL('https://itunes.apple.com/cn/app/id1503106436');
					break;
				default:
					break;
			}
		}
	},
	onLoad() {
		// #ifdef APP-PLUS
		let that = this;
		plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
			console.log(widgetInfo.version);
			that.version = widgetInfo.version;
		});
		// #endif
	}
};
</script>

<style lang="scss">
#about {
	width: 100%;
	.set_list {
		margin-top: 40upx;
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
