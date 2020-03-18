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
  }

}
