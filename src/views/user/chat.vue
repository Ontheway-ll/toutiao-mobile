<template>
    <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div ref="myList" class="chat-list">
      <!-- 循环渲染list到视图上 -->
      <!-- list数据分两种，一种是小智说的在左边一种是我说的在右边
      根据当前name的值决定样式是left还是right
      v-bind绑定class的对象语法，当前的样式是left还是right-->
      <div v-for="(item,index) in list" :key="index" :class="{left:item.name==='xz',right:item.name!=='xz'}" class="chat-item ">
        <!-- 小智同学的图片根据name的值决定是否显示左侧的图片或者右侧的图片 -->
        <van-image v-if="item.name==='xz'" fit="cover" round :src="XZImg" />
        <div class="chat-pao">{{item.msg}}</div>
        <!-- 右边在放置一个图片 -->
        <van-image v-if="item.name!=='xz'" fit="cover" round :src="photo"></van-image>
      </div>
      <!-- <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>
        <van-image  fit="cover" round :src="photo" />
      </div> -->
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="说点什么...">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import XZImg from '@/assets/head.jpg'// 引入一张图片
import io from 'socket.io-client'// 引入socket.io客户端
export default {
  data () {
    return {
      value: '', // 用来存储输入的内容
      loading: false, // 控制输入的状态
      XZImg, // 图片赋值给data中的变量
      list: []// 储存两个人的聊天内容
    }
  },
  // 映射vuex中的公共变量
  computed: {
    ...mapState(['photo', 'user'])// 当前用户的头像地址
  },
  methods: {
    async  send () {
      // 发送消息的时候要做什么事情
      // 获取要发送的内容
      // 如果为空字符串，就直接返回,不继续往下走了
      if (!this.value) return false
      // 先打开加载的状态
      this.loading = true
      // 设置下时间间隔，休眠函默认为500毫秒
      await this.$sleep()
      // 如果不为空继续发送，emit为发送消息，on为接收消息
      const obj = {
        msg: this.value, // 消息的内容
        timestamp: Date.now()// 当前的时间戳
      }
      // 发送这条消息
      this.socket.emit('message', obj)
      // 发送完消息把消息添加到消息列表中
      this.list.push(obj)
      // 清空输入框
      this.value = ''
      // 关闭加载状态
      this.loading = false
      this.scrollBottom()// 发消息后滚动到底部
    },
    scrollBottom () {
      // 需要通过获取滚动条高度和设置滚动条距离来滚动
      // 滚动条的位置是通过什么属性来控制的
      // scrollTop滚动条位置距离顶部距离属性来控制
      // 需要将位置滚动到底部。scrollHeight整个滚动区域的高度,整个容器的高度
      // 想要保证这个方法执行的时候，数据的视图已经更新完毕
      // $nextTick会在上一次数据更新，并且数据视图完成渲染之后执行
      // 第一种写法
      // this.$nextTick(() => {
      //   // 可以保证在滚动的时候，视图已经更新完毕
      //   this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight
      // })
      // 第二种写法
      // vue中也有同样的方法，但是没有$
      // 这是使用全局对象的方式，上一次数据更新，完成渲染之后，执行该函数
      Vue.nextTick(() => {
        this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight
      })
    }
  },
  // 第一步,我们需要在初始化的钩子函数中, 进行websocket连接的打开
  // 需要注意的是, 打开websocket连接 同样需要用户的token,这时可以通过vuex来获取数据用户token
  // 初始化钩子函数
  created () {
    // 建立和服务器的连接
    // new webSocket,原生
    // 初始化websocket连接,io需要传参，接口规定，传token
    this.socket = io('http://ttapi.research.itcast.cn', {
      // query固定写法 会拼接到url地址上'http://ttapi.research.itcast.cn?token=这样也可以
      query: { token: this.user.token }// vuex中的token
    })// 怎么监听连接成功，ws.onopen,原生
    // this.socket接收目的是在其他方法依然可以用this.socket获取对象实例
    // connect是固定写法表示当前已经建立连接成功
    this.socket.on('connect', () => {
      // 此时执行connect事件表示已经和服务器打通了电话
      // 我们模拟一条数据 让用户看到 服务器和用户说话了
      // 上面要用箭头函，因为这里有this
      this.list.push({ msg: '你好啊', name: 'xz' })
    })// 加name的原因是区分这句话是谁说的
    // 在此时监听并回复消息，接口要求的收发消息是用message
    this.socket.on('message', data => {
      // data就是客户服务器回复的消息，认为接收的消息都是小智回复的
      this.list.push({ ...data, name: 'xz' })// 加到列表中
      this.scrollBottom()// 接消息后滚动到底部
    })
  },
  // 页面销毁之前，关闭连接websocket
  beforeDestroy () {
    // ws.close()原生，websocket.io  close()
    this.socket.close()// 关闭连接
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
