<template>
	<view class="content">
        
		<view class="circleprogress">
			<view class="progresstext">{{progresstext}}%</view>
			<view class="wrapper">
				<view class="leftprogress" :style="{ transform: leftprogress}"></view>
			</view>
			<view class="wrapper">
				<view class="rightprogress" :style="{ transform: rightprogress}"></view>
			</view>
		</view>
		 <view class="section section_gap">
            <text class="section__title">设置最小/最大值</text>
            <view class="body-view">
                <slider @changing="sliderchange" @change="sliderchange" min="0" max="1000"/>
            </view>
        </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				leftprogress: 'rotate(-45deg)',
				rightprogress: 'rotate(45deg)',
				progresstext:'0'
			}
		},
		onLoad() {

		},
		methods: {
			sliderchange:function(event){
				var val = event.detail.value;
				val = val/10;
				this.progresstext = val;
				var deg = val/100*360;
				if(deg<=180)
				{
					this.rightprogress = 'rotate('+(45+deg)+'deg)'
					this.leftprogress = 'rotate('+(-45)+'deg)'
				}else
				{
					this.rightprogress = 'rotate('+(45+180)+'deg)'
					this.leftprogress = 'rotate('+(-45+(deg-180))+'deg)'
				}
			}
		}
	}
</script>

<style>
	.content {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		flex-flow: wrap;
		align-items: center;
		border-radius: 50%;
		text-align: center;
		height: 400upx;
		padding-top: 50px;
	}
	.circleprogress{
		width: 100%;
		height: 200px;
		display: flex;
		justify-content: center;
		
	}
	.circleprogress .progresstext{
		position: absolute;
		font-size: 40px;
		width: 200px;
		height: 200px; 
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;
		color: #008000;
	}
	.circleprogress .wrapper{
		width: 100px;
		height: 200px;
		overflow: hidden;
	}
	.circleprogress .leftprogress,.rightprogress{
		width: 160px;
		height: 160px;
		border:20px solid green;
		border-bottom:20px solid #7ef22e;
		border-radius: 50%;
		box-sizing: content-box;
		
	}
	.circleprogress .leftprogress{
		border-right:20px solid #7ef22e;
	}
	.circleprogress .rightprogress{
		border-left:20px solid #7ef22e;
		margin-left: -100px;
	}
	.section{
		width: 80%;
		margin-top: 50px;
	}
    
</style>
