import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 按需加载方式配置路由
const Layout = () => import('@/views/layout')
// 按需引入下面的4个二级路由
const home = () => import('@/views/home')
const question = () => import('@/views/question')
const video = () => import('@/views/video')
const user = () => import('@/views/user')
// 其他的一级路由
const chat = () => import('@/views/user/chat')// 小智同学
const login = () => import('@/views/login')// 登录模式
const profile = () => import('@/views/user/profile')// 编辑资料
const search = () => import('@/views/search')// 搜索中心
const searchresult = () => import('@/views/search/result')// 搜索结果
const article = () => import('@/views/article')// 文章中心

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Layout, // 布局组件，一级路由
    children: [{
      path: '', // 如果path什么都不写 默认就是二级路由的默认组件
      component: home
    }, {
      path: '/question', // 问答组件
      component: question
    }, {
      path: '/video',
      component: video
    }, {
      path: '/user',
      component: user//
    }]
  },
  {
    path: '/user/chat',
    component: chat// 一级路由，小智同学
  }, {
    path: '/login',
    component: login// 一级路由，登录
  }, {
    path: '/user/profile',
    component: profile// 一级路由，编辑资料
  }, {
    path: '/search',
    component: search// 一级路由，搜索中心
  }, {
    path: '/search/result',
    component: searchresult// 一级路由，搜索中心
  }, {
    path: '/article',
    component: article// 一级路由，文章详情
  }

]

const router = new VueRouter({
  routes
})

export default router
