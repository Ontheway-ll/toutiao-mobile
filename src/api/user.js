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