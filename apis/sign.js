import md5 from '@/common/md5.js'
import Base64 from '@/common/base64.js'
import store from "@/store"


const objKeySort = (obj) => {
	//排序的函数
	let newkey = Object.keys(obj).sort(); //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
	let newObj = {}; //创建一个新的对象，用于存放排好序的键值对
	for (let i = 0; i < newkey.length; i++) {
		//遍历newkey数组
		newObj[newkey[i]] = obj[newkey[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
	}
	return newObj; //返回排好序的新对象
}
const getSigns = (datas) => { //排序参数
	if (!datas) {
		return "";
	}
	let data = objKeySort(datas);
	let url = "";
	if (
		typeof data == "undefined" ||
		data == null ||
		typeof data != "object"
	) {
		return "";
	}
	for (var k in data) {
		url += (url.indexOf("=") != -1 ? "&" : "") + k + "=" + data[k];
	}
	return url;
}
// md5(base64_encode(md5($params . $token .$salt)))
const designSign = (data) => {
	let salt = "c71e1d235fb51a3033598a534844a698";
	let token = store.state.user.token || 1;
	
	// console.log(token,39)
	let base = new Base64();
	let sign = md5(base.encode(md5(getSigns(data) + token + salt))).toUpperCase();
	let params ={
		sign:sign,
		token:token
	}
	if (data) {
		let dd = Object.assign({}, data, params);
		return dd;
	} else {
		return params;
	}
}
export default designSign
