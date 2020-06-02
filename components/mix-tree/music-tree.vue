<template>
	<view class="contents">
		<view class="mix-tree-list">
			<view v-for="(item, index) in treeList" :key="index">
				<view
					class="mix-tree-item cube"
					:style="[
						{
							paddingRight: item.rank * 15 + 'px',
							zIndex: item.rank * -1 + 50
						}
					]"
					:class="{
						border: treeParams.border === true,
						show: item.show,
						last: item.lastRank,
						showchild: item.showChild,
						background_color1: item.level === 1,
						background_color2: item.level === 2,
						background_color3: item.level === 3,
						padding1:item.show && item.level === 1,
						padding2:item.show && item.level === 2,
						padding3:item.show && item.level === 3,
					}"
					@click.stop="treeItemTap(item,index)"
				>
					<view :class="['item_name',{item_acive:item.is_play}]">{{ item.name }}</view>
					<!-- {{item}} -->
					<view class="numbers" v-if="item.numbers">共{{ item.numbers }}讲</view>
					<view class="status"  v-show="item.is_play">
						<view class="status preloader_1">
							<text></text>
							<text></text>
							<text></text>
							<text></text>
							<text></text>
						</view>
					</view>
					<view class="iconfont tree_test" :class="{ animations: animation}" v-if="ifAnimationsShow(item)">&#xe6a3;</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import Vue from 'vue';
export default {
	computed:{
		musicItem() {
			return this.$store.state.musicPlayer.musicItem;
			// return this.$mAudio.bgAudioMannager;
		},
	},
	props: {
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		params: {
			type: Object,
			default() {
				return {};
			}
		},
		mid:{
			type: Number,
			default:0
		}
	},
	data() {
		return {
			treeList: [],
			treeParams: {
				defaulttext: '试听',
				defaultIcon: '/static/study/lock.png',
				currentIcon: '/static/mix-tree/currentIcon.png',
				lastIcon: '',
				border: false
			},
			animation: false,
			textIndex: 0
		};
	},
	watch: {
		list: {
			handler(n) {
				this.treeParams = Object.assign(this.treeParams, this.params);
				this.renderTreeList(n);
			},
			deep: true //对象内部的属性监听，也叫深度监听
			// immediate: true
		}
	},
	methods: {
		ifAnimationsShow(item){
			return !item.course_id && item.judge_level==2 && item.rank == 1;
		},
		//扁平化树结构
		// 0锁住 1试听 2播放 3已听完
		async renderTreeList(list = [], rank = 0, parentId = []) {
			await list.forEach((item, index) => {
				this.treeList.push({
					id: item.id,
					name: item.name,
					parentId, // 父级id数组
					rank, // 层级
					showChild:true, //子级是否显示
					show:true , // 自身是否显示
					numbers: item.numbers,
					status: item.status,
					level: item.level,
					is_play:(item.is_play && item.audio_file?1:0),
					audio_file:item.audio_file,
					judge_level:item.judge_level
				});
				if (Array.isArray(item.list) && item.list.length > 0) {
					let parents = [...parentId];
					parents.push(item.id);
					this.renderTreeList(item.list, rank + 1, parents);
				} else {
					this.treeList[this.treeList.length - 1].lastRank = true;
				}
			});
			// console.log(this.treeList);
			this.renderAudioLists(this.musicItem.id)
		},
		// 点击
		async treeItemTap(item, index) {
			let list = this.treeList;
			let id = item.id;
			if (item.judge_level == 2) {
				// console.log(item)
				this.animation = !this.animation;
			}
			if(item.is_play ==1 || item.judge_level == 1){
				return;
			}
			if (item.lastRank === true) {
				//点击最后一级时触发事件
				this.$emit('treeItemClick', item);
				await list.forEach(childItem => { //把所有的选中取消
					if (childItem.lastRank) {
						childItem.is_play = 0
					}
				});
				list[index].is_play =1
				return;
			}
			item.showChild = !item.showChild;
			
			list.forEach(childItem => {
				if (item.showChild === false) {
					//隐藏所有子级
					// if (!childItem.parentId.includes(id)) {
					// 	return;
					// }
					// if (childItem.lastRank !== true) {
					// 	childItem.showChild = false;
					// }
					// childItem.show = false;
					console.log(item.judge_level,childItem.judge_level)
					if (!childItem.parentId.includes(id) || childItem.level == 2) { //当前子节点跟点击的id相同则不进入下面隐藏
						return;
					}
					if (childItem.lastRank !== true) {
						childItem.showChild = false;
					}
					childItem.show = false;
				} else {
					if (childItem.parentId[childItem.parentId.length - 1] === id) {
						childItem.show = true;
					}
				}
			});
		},
		async renderAudioLists(mid) {
			let arr = [];
			await this.treeList.forEach(item => {
				// console.log(item.hasOwnProperty('is_play'))
				if (item.hasOwnProperty('is_play')) {
					item.is_play = 0;
					if (item.id === mid && item.audio_file) {
						item.is_play = 1;
					}
				}
				if (Array.isArray(item.list) && item.list.length > 0) {
					this.renderAudioLists(item.list, mid);
				}
			});
			// console.log(this.treeList)
		}
	},
	created() {
		// console.log(this.list);
	}
};
</script>

<style>
.mix-tree-list {
	display: flex;
	width: ;
	flex-direction: column;

	/* padding-left: 30upx; */
}
.tree_test {
	position: absolute;
	right: 53upx;
}
.animations {
	animation: rotates .3s ease-in-out 0s forwards;
}
@keyframes rotates {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(180deg);
	}
}


.numbers {
	font-size: 26upx;
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(153, 153, 153, 1);
	margin-left: 30upx;
}
.status {
	position: absolute;
	right: 0;
}
.status .lock {
	width: 32upx;
	height: 36upx;
	background-image: url(../../static/images/study/lock.png);
	background-size: 100% 100%;
	margin-right: 48upx;
}
.status .audition {
	width: 68upx;
	height: 36upx;
	padding: 0 10upx;
	border: 2upx solid rgba(0, 215, 137, 1);
	border-radius: 17upx;
	background-size: 100% 100%;
	margin-right: 28upx;
	font-size: 20upx;
	font-family: Source Han Sans CN;
	font-weight: 400;
	color: rgba(0, 215, 137, 1);
	line-height: 36upx;
	text-align: center;
}
.status .play {
	width: 32upx;
	height: 32upx;
	background-image: url(../../static/images/study/lock.png);
	background-size: 100% 100%;
	margin-right: 48upx;
}
.status .over {
	width: 32upx;
	height: 32upx;
	background-image: url(../../static/images/study/over.png);
	background-size: 100% 100%;
	margin-right: 48upx;
}
.mix-tree-item {
	display: flex;
	align-items: center;
	font-size: 30upx;
	color: #333;
	height: 0;
	opacity: 0;
	transition: 0.2s;
	position: relative;
}
.item_acive{
		font-size:32upx;
		font-family:Source Han Sans CN;
		font-weight:400;
		color:rgba(0, 215, 137, 1) !important;
	}
.item_name {
	max-width: 500upx !important;
}
.mix-tree-item.border {
	/* border-bottom: 1px solid #eee; */
}
.mix-tree-item.show {
	min-height: 80upx;
	/* margin: 30upx 0; */
	padding: 40upx 32upx;
	opacity: 1;
	line-height: 56upx;
}
.border::after {
	content: '';
	position: absolute;
	height: 2upx;
	background-color: rgba(245, 245, 245, 1);
	bottom: 0;
	right: 32upx;
	left: 32upx;
	z-index: 0;
}
.mix-tree-icon {
	width: 26upx;
	height: 26upx;
	margin-right: 8upx;
	opacity: 0.9;
}

.mix-tree-item.showchild:before {
	transform: rotate(90deg);
}
.mix-tree-item.last:before {
	opacity: 0;
}
.background_color {
	background: rgba(250, 250, 252, 1);
}
.preloader_1 {
	position: relative;
	width: 100upx;
	/* height: 50upx; */
}
.preloader_1 text {
	display: block;
	bottom: 0px;
	width: 9upx;
	height: 5upx;
	background: #9b59b6;
	position: absolute;
	// animation: preloader_1 1.5s infinite ease-in-out;
	animation: preloader_1 1.6s infinite ease-in-out;
}
.preloader_1 text:nth-child(2) {
	left: 11upx;
	animation-delay: 0.2s;
}
.preloader_1 text:nth-child(3) {
	left: 22upx;
	animation-delay: 0.4s;
}
.preloader_1 text:nth-child(4) {
	left: 33upx;
	animation-delay: 0.2s;
}
.preloader_1 text:nth-child(5) {
	left: 44upx;
	animation-delay: 0s;
}
@keyframes preloader_1 {
	0% {
		height: 5upx;
		transform: translateY(10upx);
		background: #00d789;
	}
	25% {
		height: 20upx;
		transform: translateY(15upx);
		background: #00d789;
	}
	50% {
		height: 46upx;
		transform: translateY(20upx);
		background: #00d789;
	}
	75% {
		height: 20upx;
		transform: translateY(15upx);
		background: #00d789;
	}
	100% {
		height: 5upx;
		transform: translateY(10upx);
		background: #00d789;
	}
	
}
.background_color1 {
	background:#F5F5F5;
}
.background_color2 {
	background: #FFFFFF;
}
.background_color3 {
	background: #FAFAFC;
}
.padding1{
	padding: 46upx 32upx 32upx 32upx !important;
}
.padding2{
	padding: 40upx 48upx 36upx 32upx !important;
}
.padding3{
	padding: 34upx 54upx 24upx 32upx !important;
}
</style>
