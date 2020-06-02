<template>
	<view>
		 <view>
			 <video
			 :loop='false'
			 :autoplay="true"
			 :src="src"
			 :controls="false"
			 :muted="false"
			 :style="{'width':phoneWidth+'px','height':phoneHeight+'px'}"
			 >
			 <cover-image v-for="(item,index) in srcList"
			 :src="item" :style="{width:'70upx',height:'70upx',position:'fixed',right:'20upx',bottom:80*index+100+'upx'}" 
			 ></cover-image>
			 <cover-view style="position:fixed;top:0;left:0;">123456789</cover-view>
			 </video>
				 
		 </view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				src:'',
				phoneHeight:'',
				phoneWidth:'',
				videoTime:'',
				srcList:['../../static/defautl-error.png','../../static/defautl-error.png','../../static/defautl-error.png','../../static/defautl-error.png']
			}
		},
		computed:{
			iconURL(){
				return this.$iconURL
			}
		},
		onLoad(e) {
			this.getRideo()
			this.getInfo()
			// let e = JSON.parse(e)
		},
		onBackPress(e) {
			console.log(e)
		},
		methods:{
			getInfoAsync(){
				return new Promise((res,rej)=>{
					uni.getSystemInfo({
						success(e) {
							res(e)
						}
					})
				})
			},
			async getInfo(){
			let a =	await this.getInfoAsync()
			this.phoneWidth = a.screenWidth
			this.phoneHeight = a.screenHeight
			},
			getRideo(){
				this.$api.videoDetail().then(res=>{
					this.src = this.iconURL + res.data.list[3].video
					this.videoTime = res.data.list[3].video_time
				}).catch(err=>{
					console.log(err)
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	view, page {
		font-size: 0;
	}
	.cover_text {
		width:100upx;
		height:100upx;
		position: fixed;
		top:0;
		left:0;
		background-color: red;
	}
	.cover_image {
		width:100upx;
		height:100upx;
		position: fixed;
		top:0;
		left:100upx;
	}
	
</style>