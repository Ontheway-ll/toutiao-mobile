<template>
  <div id="app">
    <!-- 一级路由容器 -->
    <!-- keep-alive只要包裹就会缓存所有的组件实例
          一级路由只是缓存了layout-->
    <keep-alive>
      <router-view v-if="$route.meta.isAlive"/>
    </keep-alive>
    <!-- 根据$route.meta.isAlive来判断，如果为true里面生效
    如果为false外面的生效,决定是否来缓存 -->
    <router-view v-if="!$route.meta.isAlive"></router-view>

  </div>
</template>

<style lang="less">

</style>
