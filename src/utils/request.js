// 请求管理工具
import axios from 'axios'
import JSONBig from 'json-bigint'
// axios.defaults 是对原有默认值进行修改
// instance 的意思是一个新的实例
const instance = axios.create({
  //  构造参数 传入一些配置 和defaults一样
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 基础的请求地址
  //   此函数是后台响应回来 但是还没进入到 axios的响应拦截器时执行 数组里可以写多个的处理函数
  //   transformResponse是大数字的一个参数，是一个数组
  transformResponse: [function (data) {
    //   data就是后端响应回来的字符串
    // JSON.parse() ID超过一定的长度，ID就错了
    return data ? JSONBig.parse(data) : {}
  }]
})
// 创建一个axios的新实例
export default instance // 导出

// 设置baseUrl和处理大数字
// axios.create() // 相当于 new 了一个新的axios实例
