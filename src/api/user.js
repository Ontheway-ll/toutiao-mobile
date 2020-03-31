// 单独封装api模式
/***
 * 处理用户相关的请求
 * 登录方法
 * **** */
// 引入请求模块,之前封装 new了一个新的axios实例，const instance=axios.create(实例
// request 相当于axios的一个实例，和axios有同样的方法和属性，request可以代替axios
import request from '@/utils/request'
// 导出一个方法，平常的对象
export function login (data) {
  // 返回一个request请求=return axios（）
  return request({
    // p配置选项
    url: '/authorizations',
    method: 'post',
    data // data:data接收传入的data
    // axios中的body参数放置在data中
  })
//   返回一个promise对象
}
// 关注用户
export function followUser (data) {
  return request({
    url: '/user/followings',
    method: 'post',
    data
  })
}
// 取消关注用户
export function unfollowUser (autid) {
  return request({
    url: `/user/followings/${autid}`,
    method: 'delete'

  })
}
/***
 * 获取用户自己的个人信息
 * ***/
export function getUserInfo () {
  return request({
    url: '/user'
  })
}
/****
 * 获取用户的个人资料
 *
 * ***/
export function getUserProfile () {
  return request({
    url: '/user/profile'
  })
}
/****
 * 修改用户头像
 * ****/
export function updatePhoto (data) {
  return request({
    url: '/user/photo',
    method: 'patch',
    data
  })
}
// 保存用户信息
export function saveUserInfo (data) {
  return request({
    url: '/user/profile',
    method: 'patch',
    // photo已经做完，不需要在去传这个参数,上面的data浅拷贝到这个对象中，
    data: { ...data, photo: null }// 要求base64，不传也可以
  })
}
