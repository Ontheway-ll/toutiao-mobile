// 专门处理小函数，以及vue中的常用的过滤器和函数
export default {
  // 导出一个默认对象
  install (Vue) {
    // 改方法会在Vue.use时调用，
    // 给Vue的原型属性赋值一个函数，自定义一个函
    // Vue.prototype.$lnotify=function(){}//本质是一个函数,可以用箭头函
    // 接收形参params，名字随意，=>形参{ message: '用户名或者验证码错误', duratio
    // params是message  ...params是拷贝过来
    Vue.prototype.$lnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    Vue.prototype.$sleep = sleep // 定义一个原型属性 $sleep 所有组件都有了这个属性
  }
}
// 休眠函数
// // time  = 500 如果你传入了time 用你的 如果说你没传 time 用 500
function sleep (time = 500) {
// 返回一个promise
  return new Promise(function (resolve, reject) {
    // 肯定是成功执行 但是有一个延迟
    setTimeout(() => resolve(), time)
  })
}
