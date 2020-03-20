import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant, { Lazyload } from 'vant' // 引入懒加载属性
import plugin from '@/utils/plugin'// 引入创建
import 'vant/lib/index.less'
import 'amfe-flexible'
import '@/styles/index.less'
import '@/permission'

Vue.config.productionTip = false
Vue.use(Vant)
Vue.use(Lazyload)
Vue.use(plugin)// 注册组件，需要放在Vue.use(Vant)之后，因为需要在plugin中用vant函数
// 必须要等到vant注册完毕才行
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
