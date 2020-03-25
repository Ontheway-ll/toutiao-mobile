/***
 * 处理文章模块的请求数据
 * ** */
import request from '@/utils/request'
// 获取文章推荐数据,
//  需要传参需要传入 timestamp 时间戳  channel_id (频道id)
export function getAticles (params) {
  return request({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    // 这里必须用完整地址 因为 之前设置的baseURL是 v1_0
    params: {
      with_top: 1, ...params// 合并数据

    }
  })
}
/*****
 *  不感兴趣的文章接口
 *
 * ***/
export function dislikeArticle (data) {
  return request({
    url: '/article/dislikes',
    method: 'post',
    data// body参数
  })
}
/***
 * 举报文章接口
 *
 * ****/
export function reportArticle (data) {
  return request({
    url: '/article/reports',
    method: 'post',
    data
  })
}
/*****
 * 获取联想搜索建议
 * ***/
export function getSuggestion (params) {
  return request({
    url: '/suggestion',
    params
  })
}
/****
 * 搜索文章方法
 *
 * ***/
export function searchArticle (params) {
  return request({
    url: '/search',
    params// 关键词及分页信息
  })
}
