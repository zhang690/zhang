import http from "./http.js";
import config from "@/config/index.config.js";
import designSign from "./sign.js"


export const login = (data) => http.POST(`${config.baseUrl}/api/login`, designSign(data)); //登录
export const register = (data) => http.POST(`${config.baseUrl}/api/register`, designSign(data)); //注册
export const getUserInfo = (data) => http.POST(`${config.baseUrl}/api/getUserInfo`, designSign(data)); //获取用户信息

export const logout = (data) => http.POST(`${config.baseUrl}/api/logout`, designSign(data)); //退出登录
export const sendCode = (data) => http.POST(`${config.baseUrl}/api/sendCode`, designSign(data)); //获取手机验证码
export const getAdv = (data) => http.POST(`${config.baseUrl}/api/getAdv`, designSign(data)); //轮播图
export const getCourse = (data) => http.POST(`${config.baseUrl}/api/getCourse`, designSign(data)); //首页获取推荐课程
export const getMyLearn = (data) => http.POST(`${config.baseUrl}/api/getMyLearn`, designSign(data)); //我的学习
export const getCustomerWX = (data) => http.POST(`${config.baseUrl}/api/getCustomerWX`, designSign(data)); //获取客服微信
export const getRechargeBalanceList = (data) => http.POST(`${config.baseUrl}/api/getRechargeBalanceList`, designSign(data)); //获取苹果充值列表
export const getOrderLog = (data) => http.POST(`${config.baseUrl}/api/getOrderLog`, designSign(data)); //我的订单
export const getOrderDetail = (data) => http.POST(`${config.baseUrl}/api/getOrderDetail`, designSign(data)); //订单详情
export const getCourseIntroduce = (data) => http.POST(`${config.baseUrl}/api/getCourseIntroduce`, designSign(data)); //课程介绍页 课程目录
export const getAudioDetail = (data) => http.POST(`${config.baseUrl}/api/getAudioDetail`, designSign(data)); //获取音频详情
export const aduioPlayList = (data) => http.POST(`${config.baseUrl}/api/aduioPlayList`, designSign(data)); //获取音频列表
export const getConfirmOrder = (data) => http.POST(`${config.baseUrl}/api/getConfirmOrder`, designSign(data)); //确认订单接口
export const createBuyCourse = (data) => http.POST(`${config.baseUrl}/api/createBuyCourse`, designSign(data)); //APP下单支付接口
export const updateWxAccout = (data) => http.POST(`${config.baseUrl}/api/updateWxAccout`, designSign(data)); //APP下单支付接口
export const getShareAddress = (data) => http.POST(`${config.baseUrl}/api/getShareAddress`, designSign(data)); //APP获取分享地址
export const acceptApplePayInfo = (data) => http.POST(`${config.baseUrl}/api/acceptApplePayInfo`, designSign(data)); //APP接收客户端苹果支付凭证
export const userViewAudioLog = (data) => http.POST(`${config.baseUrl}/api/userViewAudioLog`, designSign(data)); //APP插入用户观看记录
export const resourceUpdate = (data) => http.POSTFormData(`${config.baseUrl}/api/resourceUpdate`, designSign(data));// 资源包升级
export const appUpdate = (data) => http.POSTFormData(`${config.baseUrl}/api/appUpdate`, designSign(data));// APP升级
export const getAgreement = (data) => http.POSTFormData(`${config.baseUrl}/api/getAgreement`, designSign(data));// 获取协议
export const bindPhone = (data) => http.POSTFormData(`${config.baseUrl}/api/bindPhone`, designSign(data));// 切换手机号
export const videoIndex = (data) => http.POSTFormData(`${config.baseUrl}/api/videoIndex`, designSign(data));// 获取首页视频
export const videoDetail = (data) => http.POSTFormData(`${config.baseUrl}/api/videoDetail`, designSign(data));// 获取视频滑动列表
export const videoClickGood = (data) => http.POSTFormData(`${config.baseUrl}/api/videoClickGood`, designSign(data));// 获取视频点赞
export const videoCategory = (data) => http.POSTFormData(`${config.baseUrl}/api/videoCategory`, designSign(data));// 获取视频分类
export const getCourseCategory = (data) => http.POSTFormData(`${config.baseUrl}/api/getCourseCategory`, designSign(data));// 获取课程分类
export const getSpecialSubjectCourse = (data) => http.POSTFormData(`${config.baseUrl}/api/getSpecialSubjectCourse`, designSign(data));// 获取专题分类
export const searchInfo = (data) => http.POSTFormData(`${config.baseUrl}/api/searchInfo`, designSign(data));// 搜索
export const getMoreCourse = (data) => http.POST(`${config.baseUrl}/api/getMoreCourse`, designSign(data));// 获取更多课程
export const videoMyLike = (data) => http.POST(`${config.baseUrl}/api/videoMyLike`, designSign(data));// 我喜欢的课程






 