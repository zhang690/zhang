import store from "@/store"


function HTTP(obj, config) {

	let defaultConfig = {
		isRes: false,
		loading: false
	}

	config = { ...defaultConfig,
		...config
	}


	// 如果需要显示loading,mask防止点击穿透
	config.loading && uni.showLoading({
		title: '加载中',
		mask: true
	});

	return new Promise((resolve, reject) => {
		let options = {
			url: "",
			method: "GET",
			data: {},
			timeout:20000,
			dataType: "json",
			header: {
				"content-type": "application/json",
				"X-requested-With": "XMLHttpRequest"
			},
			success: (res) => {
				// console.log("HTTP请求结果：", JSON.stringify(res))
				config.loading  && uni.hideLoading();
				// 状态码为200
				
				if (res.statusCode == 200) {
					// console.log(res.data)
					let data = res.data;
					//自动校验用户是否登录过期
					if (data.code == "01") {
						store.dispatch("reLogin");
						return false;
					}
					if (data.code == "1001" || data.code == "1003") {
						store.dispatch("reLogin");
						reject(data.msg);
						return false;
					}
					//返回 { code:10000,msg:"消息",data:[] }
					if (true) {
						resolve(data)
					}
					// 返回 data:[]
					else {
						if (data.code == "00") {
							resolve(data.data || true)
						} else {
							uni.showToast({
								title: data.msg,
								icon: "none",
								duration: 2000
							})
							reject(data.msg);
						}
					}
				} else {
					uni.showToast({
						title: data.msg,
						icon: "none",
						duration: 2000
					})
					reject("HTTP:状态码异常！");
				}
			},
			fail: (err) => {
				config.loading && uni.hideLoading();
				console.log("err1",JSON.stringify(err));
				uni.showToast({
					title: "网络异常，请稍后再试!",
					icon: "none",
				})
				reject("网络异常，请稍后再试!");
				store.dispatch("reLogin");
			},
			complete: () => {}
		}

		options = { ...options,
			...obj
		};

		const OPENID = uni.getStorageSync("openId");
		if (OPENID) options["header"]["openId"] = OPENID;

		if (options.url && options.method) {
			if (options.method == "POST") {
				options["header"] = {
					"content-type": "application/x-www-form-urlencoded"
				}
			}
			const requestTask = uni.request(options);
			// console.log(requestTask,104)
		} else {
			uni.showToast({
				title: 'HTTP：缺失参数',
				icon: "none",
				duration: 2000
			})
		}
	})
}

// function HTTPS(obj, config){
// 	uni.request({
// 	        url: 'https://www.example.com/request'
// 	    })
// 	    .then(data => {//data为一个数组，数组第一项为错误信息，第二项为返回数据
// 	        var [error, res]  = data;
// 	        console.log(res.data);
// 	    })
// }
export default {
	GET(url, data = {}, config) {
		return HTTP({
			url,
			data,
			method: "GET"
		}, config);
	},
	POST(url, data = {}, config) {
		return HTTP({
			url,
			data,
			method: "POST"
		}, config);
	},

	POSTFormData(url, data = {}, config) {
		return HTTP({
			url,
			data,
			method: "POST"
		}, config);
	}
	
	// POSTFormData(url, data = {}, config) {
	// 	return HTTPS({
	// 		url,
	// 		data,
	// 		method: "POST"
	// 	}, config);
	// }
}
