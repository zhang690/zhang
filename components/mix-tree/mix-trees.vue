<template>
	<view class="contents">
		<view class="mix-tree-list">
			<block v-for="(item, index) in treeList" :key="index">
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
						background_color: item.level === 1 || item.lastRank
					}"
					@click.stop="treeItemTap(item,index)"
				>
					<view :class="['item_name',{item_acive:item.is_play}]">{{ item.name }}</view>
					<!-- {{item}} -->
					<view class="numbers" v-if="item.numbers">共{{ item.numbers }}讲</view>
					<view class="status" v-if="item.status || item.status === 0" >
						<!-- // 0锁住 1试听 2播放 3已听完 -->
						<view v-if="item.status === 0" class="lock" ></view>
						<text v-if="item.status === 1" class="audition">试听</text>
						<text v-if="item.status === 2" class="play"></text>
						<text v-if="item.status === 3" class="over"></text>
					</view>
					<view class="iconfont tree_test" :class="{ animation: item.showChild }" v-if="item.level === 2 && !item.lastRank">&#xe6a3;</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
import Vue from 'vue';
export default {
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
		//扁平化树结构
		// 0锁住 1试听 2播放 3已听完
		async renderTreeList(list = [], rank = 0, parentId = []) {
			await list.forEach((item, index) => {
				// console.log(item);
				this.treeList.push({
					id: item.id,
					name: item.name,
					parentId, // 父级id数组
					rank, // 层级
					showChild: item.is_open || false, //子级是否显示
					show:item.is_open || item.is_play || rank === 0 , // 自身是否显示
					numbers: item.numbers,
					status: item.status,
					level: item.level,
					is_play:item.is_play,
					is_open:item.is_open,
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
		},
		// 点击
		async treeItemTap(item, index) {
			let list = this.treeList;
			let id = item.id;
			if (item.level == 2) {
				this.animation = !this.animation;
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
					if (!childItem.parentId.includes(id)) {
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
		back() {
			// console.log(23);
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
/* .animation{
	transform: rotate(181deg);
} */
.animation {
	animation: rotate 0.3s ease-in-out 0s forwards;
}
@keyframes rotate {
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
.status .lock{
	display: block;
	width:32upx;
	height:36upx;
	background-image: url(../../static/images/study/lock.png);
	background-size: 100% 100%;
	margin-right: 48upx;
}
.status .audition{
	display: block;
	width:68upx;
	height:36upx;
	padding:0 10upx;
	border:2upx solid rgba(0,215,137,1);
	border-radius:17upx;
	background-size: 100% 100%;
	margin-right: 28upx;
	font-size:20upx;
	font-family:Source Han Sans CN;
	font-weight:400;
	color:rgba(0,215,137,1);
	line-height: 36upx;
	text-align: center;
}
.status .play{
	display: block;
	width:32upx;
	height:32upx;
	background-image: url(../../static/images/study/isPlay.png);
	background-size: 100% 100%;
	margin-right: 48upx;
}
.status .over{
	display: block;
	width:32upx;
	height:32upx;
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

</style>
