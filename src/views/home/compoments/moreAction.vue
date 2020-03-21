<template>
  <div class="more-action">
    <van-cell-group v-if="!isReport">
      <!-- 然后找到不感兴趣的按钮 触发自定义事件 告诉父组件,不感兴趣 -->
      <van-cell @click="$emit('dislike')">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <!-- 弹层在article-list中，子传父，调接口的时候
      需要把，value传给后台，接口文档里type举报类型里有0123等，
      target是举报文章的ID，home组件中有ID
      这是触发点击事件，然后在home中监听 -->
      <van-cell @click="$emit('report',item.value)" v-for="item in reports" :key="item.value">{{item.label}}</van-cell>
    </van-cell-group>
  </div>
</template>

<script>
// 引入常量变量
import { reports } from '@/api/constants'
import eventBus from '@/utils/eventbus'
export default {
  data () {
    return {
      isReport: false,
      reports// es6,通过v-for循环
    }
  },
  created () {
    // 一初始化就监听,
    eventBus.$on('delArticle', () => (this.isReport = false))
    // 只要一删除，弹窗回到初始化状态
  }
}
</script>

<style lang='less' scoped>
.more-action {
  border-radius: 4px;
}
</style>
