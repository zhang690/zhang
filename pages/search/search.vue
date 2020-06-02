<template>
	<view class="search">
		<view class="bar">
			<view class="slot_wrap">
				<view class="search_wrap">
					<input placeholder-style="color: rgba(153, 153, 153, 1)" class="search_wrap_input" type="text" placeholder="搜索课程或老师" disabled @click="goDitailsSearch"/>
				</view>
				<view class="navbar_right">
					<view>搜索</view>
				</view>
			</view>
		</view>
		<div class="occupy"></div>
	</view>
</template>

<script>
	export default {
		
		data() {
			return {
				background: {
					background: 'rgba(255,255,255,1)'
				}
			}
		},
		methods: {
			goDitailsSearch() {
				uni.navigateTo({
					url: 'details-search'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search {
		width: 100%;
		.bar {
			position: fixed;
			background: rgba(255, 255, 255, 1);
			z-index: 10;
			top: 40upx;
			left: 0;
			width:100%;
			height: 88upx;
			display: flex;
			align-items: center;
		}


		.search_wrap {
			position: relative;
			height: 60upx;
			background: rgba(245, 245, 245, 1);
			border-radius: 30upx;
			flex: 1;
			margin: 0 32upx;

			.search_wrap_input {
				height: 60upx;
				font-size: 24upx;
				line-height: 60upx;
				padding-left: 85upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: rgba(153, 153, 153, 1)
			}
		}
		.search_wrap::before {
			content: '';
			width: 28upx;
			height: 28upx;
			position: absolute;
			left: 32upx;
			top: 50%;
			transform: translateY(-50%);
			background: url('../../static/detail_search.png') no-repeat;
			background-size: 28upx 28upx;
		}
		.navbar_right {
			margin-right: 30upx;
			display: flex;
			font-size: 26upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
		}
		.slot_wrap {
			display: flex;
			align-items: center;
			flex: 1;
		}
	}
	
</style>
