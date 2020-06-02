<template>
	<view class="contents">
		<view class="mix-tree-list">
			<view v-for="(item, index) in treeList" :key="index">
				<view
					class="mix-tree-item"
					:style="[
						{
							paddingRight: item.rank * 15 + 'px',
							zIndex: item.rank * -1 + 50
						}
					]"
					:class="{
						borders: treeParams.border === true && item.level === 2,
						show: item.show,
						last: item.lastRank,
						showchild: item.showChild,
						background_color1: item.judge_level === 1,
						background_color3: item.judge_level === 3,
						background_color2: (item.level === 2) || item.judge_level === 2 || (item.is_dir ===1 && item.level === 1),
						padding1:item.show && item.level === 1,
						padding2:item.show && item.level === 2,
						padding3:item.show && item.level === 3,
						is_play:item.is_play
					}"
					@click.stop="treeItemTap(item, index)"
				>
					<view class="item_name">{{ item.name }}</view>
					<view class="numbers" v-if="item.numbers">共{{ item.numbers }}讲</view>
					<view class="status" v-if="item.status || item.status === 0" >
						<view v-if="item.status === 0" class="lock" ></view>
						<text v-if="item.status === 1" class="audition">试听</text>
						<text v-if="item.status === 2" class="play"></text>
						<text v-if="item.status === 3" class="over"></text>
					</view>
					<view class="iconfont tree_test" :class="{ animations: item.showChild}" v-if="ifAnimationsShow(item)">&#xe6a3;</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	computed:{
			
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
		}
	},
	data() {
		return {
			treeList: [],
			treeParams: {
				defaulttext:"试听",
				defaultIcon: '/static/study/lock.png',
				currentIcon: '/static/mix-tree/currentIcon.png',
				lastIcon: '',
				border: false
			},
			animation: false,
			textIndex: 0,
			oneIndex:1
		};
	},
	watch: {
		list: {
			handler: function(list) {
				this.treeParams = Object.assign(this.treeParams, this.params);
				// console.log(this.treeParams, this.params);
				this.renderTreeList(list);
			},
			deep: true //对象内部的属性监听，也叫深度监听
		}
	},
	methods: {
		ifAnimationsShow(item){
			// let temp = 
			return !item.course_id && item.judge_level==2 && item.status !== 0;
		},
		//扁平化树结构
		// 0锁住 1试听 2播放 3已听完
		async renderTreeList(list = [], rank = 0, parentId = []) {
			let that = this
			await list.forEach((item, index) => {
				// console.log(item,index, item[0]);
				this.treeList.push({
					course_id:item.course_id,
					id: item.id,
					name: item.name,
					parentId, // 父级id数组
					rank, // 层级
					showChild: rank<1, //子级是否显示
					show: rank === 0 || rank<=1,  // 自身是否显示
					numbers: item.numbers,
					status: item.status,
					level: item.level,
					is_play:item.is_play,
					judge_level:item.judge_level,
					is_dir:item.is_dir,
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
		this.treeList.map((v)=>{
			let id = this.treeList[0].id;
			
			if(v.is_play){
				if(v.parentId.length>=1){
					let pId = v.parentId[0]
					if(v.id == pId || v.parentId.includes(pId)){
						v.show = true;
						v.showChild = true;
					}
				}
			}else{
				if(v.id == id || v.parentId.includes(id)){
					v.show = true;
					v.showChild = true;
				}
			}
		})
		},
		// 点击
		treeItemTap(item, index) {
			// console.log(item);

			let list = this.treeList;
			// console.log(item.level,list);
			let id = item.id;
			if(item.judge_level==1){
				return
			}
			if (item.lastRank === true) {
				//点击最后一级时触发事件
				this.$emit('treeItemClick', item);
				return;
			}
			item.showChild = !item.showChild;
			if (item.level == 2) {
				this.textIndex = index;
				this.animation = !this.animation;
			}
			list.forEach(childItem => {
				if (item.showChild === false) {
					//隐藏所有子级
					if (!childItem.parentId.includes(id) || (childItem.id === id && childItem.level !== 3) || childItem.level === 2) { //当前子节点跟点击的id相同则不进入下面隐藏
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
			console.log(23);
		}
	}
};
</script>

<style >
.mix-tree-list {
	display: flex;
	/* width: ; */
	flex-direction: column;
}
.tree_test {
	position: absolute;
	right: 53upx;
	z-index: 0;
}
/* .animation{
	transform: rotate(181deg);
} */
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
.is_play{
	color: #00D789 !important;
}
.status {
	position: absolute;
	right: 0;
	z-index: 0;
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
	width:66upx;
	height:34upx;
	/* padding:0 10upx; */
	border:2upx solid rgba(0,215,137,1);
	border-radius:36upx;
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
.item_name {
	max-width: 578upx !important;
}
.mix-tree-item.borders {
	/* border-bottom: 1px solid #eee; */
}
.mix-tree-item.show {
	min-height: 80upx;
	opacity: 1;
	line-height: 56upx;
}
.borders::after {
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
.background_color1 {
	background:#F5F5F5;
	font-size:30upx;
	font-family:Source Han Sans CN;
	font-weight:500;
	color:rgba(0,0,0,1);
}

.background_color3 {
	background: #FAFAFC;
	font-size:28upx;
	font-family:Source Han Sans CN;
	font-weight:400;
	color:rgba(51,51,51,1);
}
.background_color2 {
	background: #FFFFFF;
	font-size:32upx;
	font-family:Source Han Sans CN;
	font-weight:400;
	color:rgba(51,51,51,1);
}
.padding1{
	padding: 46upx 32upx 32upx 32upx;
}
.padding2{
	padding: 40upx 48upx 36upx 32upx;
}
.padding3{
	padding: 34upx 54upx 24upx 32upx;
}
</style>
