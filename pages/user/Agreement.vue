<template>
	<view id="Agreement">
		<parser :html="data"></parser>
		<!-- <rich-text :nodes="data"></rich-text> -->
	</view>
</template>

<script>
	import parser from '@/components/jyf-parser/jyf-parser'; // HBuilderX 2.5.5 及以上可以不需要
export default {
	components:{
		parser
	},
	data() {
		return {
			params: {},
			data: ''
		};
	},
	onLoad(option) {
		// console.log(option.id);
		if(option.id ==1){
			uni.setNavigationBarTitle({
			    title: '用户协议'
			});
		}else{
			uni.setNavigationBarTitle({
			    title: '隐私政策'
			});
		}
			
		let params = {
			type: option.id
		};
		this.getAgreement(params);
	},
	methods: {
		getAgreement(params) {
			this.$api.getAgreement(params).then(res => {
				if (res.code == 200) {
					// console.log(res);
					this.data = res.data;
				}
			});
		}
	}
};
</script>

<style lang="scss">
	#Agreement{
		padding: 20upx;
		p{
			padding: 20upx;
		}
	}
</style>
