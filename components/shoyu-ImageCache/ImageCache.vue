<template>
	<view class="">
		<image class="img" :style="imageStyle" :src="resource" alt="图片加载失败" mode="widthFix"></image>
		{{resource}}
	</view>
</template>

<script>
export default {
	props: {
		imageStyle: String,
		src: {
			type: String,
			default: '',
			required: true
		},
		saveDirectory: {
			type: String,
			default: '_doc/uniapp_save/images/'
		},
		errorImage: String,
		loadingImage: String
	},
	computed: {
		resource() {
			if (!this.isCached && this.error) {
				// 加载失败
				return this.errorImage;
			} else if (this.isCached) {
				return this.localFile;
			} else if (!this.isCached && !this.error) {
				// 正在加载
				return this.loadingImage;
			}
		}
	},
	created() {
		console.log('image-containerinit');
		this.init();
	},
	data() {
		return {
			error: false,
			isCached: false,
			localFile: null
		};
	},
	methods: {
		async init() {
			// #ifdef APP-PLUS || APP-PLUS-NVUE
			let isCache = await this.isCache(this.src);
			if (!isCache) {
				let filePath = await this.downloadFile(this.src).catch(e => {
					this.error = true;
				});
				this.isCached = true;
				this.localFile = filePath;
			} else {
				this.isCached = true;
				this.localFile = isCache;
			}
			// #endif
			
			// #ifndef APP-PLUS || APP-PLUS-NVUE 
			//除了当前平台其他平台展示
			this.isCached = true;
			this.localFile = this.src;
			// #endif
		},
		downloadFile(url) {
			return new Promise((resolve, reject) => {
				let savePath = plus.io.convertLocalFileSystemURL(this.saveDirectory + this.getFileName(url));
				let task = plus.downloader.createDownload(
					url,
					{
						filename: savePath
					},
					(download, status) => {
						if (status == 200) {
							resolve(savePath);
						} else {
							console.log('文件下载失败');
							reject();
						}
					}
				);
				task.start();
			});
		},
		isCache(url) {
			let savePath = this.saveDirectory + this.getFileName(url);
			console.log(savePath)
			return new Promise((resolve, reject) => {
				plus.io.resolveLocalFileSystemURL(
					savePath,
					entry => {
						resolve(savePath);
					},
					e => {
						console.log(JSON.stringify(e));
						resolve(null);
					}
				);
			});
		},
		getFileName(path) {
			return path.substring(path.lastIndexOf('/') + 1);
		},
		imageLoadError() {
			// #ifndef APP-PLUS || APP-PLUS-NVUE
			this.localFile = this.errorImage;
			// #endif
		}
	}
};
</script>

<style>
.img {
	width: 100%;
	height: 100%;
}
</style>
