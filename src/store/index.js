import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'
Vue.use(Vuex)
// store下的index.js专门处理vuex中的模块
export default new Vuex.Store({
  state: {
    // 放置需要共享的状态
    user: auth.getUser(), // 就是我们的token信息的对象 如果你要做持久化 如果缓存有token 读取缓存的token
    photo: null// 用户头像
  },
  // 修改token只能通mutations
  mutations: {
    updateUser (state, payload) {
      state.user = payload.user// 定义载荷中的user数据给state
      // 更新vuex的时候 也应该 将最新的数据 存入本地缓存
      auth.setUser(payload.user)
    },
    // 删除token
    delUser (state) {
      state.user = {}// 把vuex的token设置为空对象
      auth.delUser()// 删除本地缓存的token
    },
    // 更新photo
    updatePhoto (state, payload) {
      state.photo = payload.photo// 在载荷中传入photo
    }
  },
  actions: {
  },
  modules: {
  }
})
