<template>
  <div class="container">
<!-- 导航组件 采用vant组件的导航  fixed 表示固定在顶部-->
    <!-- 当页面地址是 /user的时候 应该隐藏掉 导航行 否则不隐藏 -->
    <!-- @事件名="逻辑" -->
    <!-- 如果当前地址不是user，那么就显示头部导航 -->
    <van-nav-bar @click-right="$router.push('/search')" v-if="$route.path!=='/user'"  title="天天头条" right-text="搜索" fixed></van-nav-bar>
     <!-- 二级路由容器 -->
    <!-- 判断当前的地址 如果是 /user 就给一个 noTop Class -->
    <!-- :class="{ 名称: 布尔值 }" -->
   <div  :class="{noTop:$route.path==='/user'}" class="my-wrapper">
   <!-- 如果想要缓存二级路由组件时候，可以缓存二级路由容器
   如果缓存了这个容器，下面的所有组件都会被缓存 -->
    <keep-alive>
      <!-- 用keep-alive包裹二级路由容器 -->
      <router-view></router-view>
    </keep-alive>
   </div>
   <!-- 标签栏组件 -->
   <!-- 表示开启路由模式 -->
  <van-tabbar route>
      <!-- 应该点击导航的标签跳转路由 -->
     <van-tabbar-item icon="wap-home-o" to="/">首页</van-tabbar-item>
     <van-tabbar-item icon="chat-o" to="/question">问答</van-tabbar-item>
     <van-tabbar-item icon="tv-o" to="/video">视频</van-tabbar-item>
     <van-tabbar-item icon="user-circle-o " to="/user">我的</van-tabbar-item>
  </van-tabbar>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.container{
  width: 100%;
  height: 100%;
  position: relative;
  // 控制二级路由容器的高宽
  .my-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop{
      padding-top: 0;
    }
  }
}
</style>
