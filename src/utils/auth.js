// 封装一个工具，处理读写我们的token
// 专门处理token的读写和删除
// export导出三个方法
const USER_TOKEN = 'toutiao-mobile'// 专门存储用户信息
// 设置用户的token信息
export function setUser (user) {
  // user 作为参数信息，应该是一个对象，因为，一个是token，和refreshToken
//                            USER_TOKEN=key        user对象转成字符串
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user))
//   对象需要转化成字符串
}
// 获取用户的token信息
export function getUser () {
  // 将字符串转化成对象在返回
  return JSON.parse(window.localStorage.getItem(USER_TOKEN) || '{}')
//   短路形式，如果前面为true后面不执行，如果为fasle后面执行
}
// 删除用户的token信息
export function delUser () {
  localStorage.removeItem(USER_TOKEN)
}
