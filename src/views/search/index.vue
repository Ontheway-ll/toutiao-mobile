<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <!-- 搜索框和数据绑定，trim去除空格 -->
    <van-search @search="onSearch" v-model.trim="q"  placeholder="请输入搜索关键词" shape="round" />
    <!-- 联想内容  有输入内容时 显示联想 -->
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell @click="toResult(item)" icon="search" v-for="(item,index) in suggestList" :key="index">
        {{item}}
      </van-cell>
    </van-cell-group>
      <!-- 如果没有历史记录 隐藏掉  -->
    <!-- <div class="history-box" v-if="!q">这样也可以 -->
    <div class="history-box" v-else>
      <!-- 只有当历史记录存在的时候 才显示头部 -->
      <div class="head" v-if="historyList.length">
        <span>历史记录</span>

        <van-icon @click="clear" name="delete"></van-icon>
      </div>
      <van-cell-group>
         <!-- 需要把 这个位置变成动态的 -->
        <van-cell @click="toSearchResult(item)" v-for="(item,index) in historyList" :key="index">
          <a class="word_btn">{{item}}</a>
          <van-icon  @click.stop="delHistory(index)" class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
// 此key用来作为 历史记录在本地缓存中的key
// 定义一个key,用来存储历史记录到本地缓存
import { getSuggestion } from '@/api/articles'
const key = 'toutiao-historyList'
export default {
  name: 'search',
  // 首先应该给搜索框绑定一个数据,来获取搜索的内容
  data () {
    return {
      q: '', // 关键字数据
      // 当data初始化的时候 会读取后面数据
      // ["葡萄干","动漫","马云"
      // 作为一个数据变量 接收 搜索历史记录
      historyList: JSON.parse(localStorage.getItem(key) || '[]'),
      suggestList: []// 联想的搜索建议
    }
  },
  methods: {
    // 删除历史
    delHistory (index) {
      // 删除要先在data中删除数据 然后把data中的数据同步到 本地缓存中
      this.historyList.splice(index, 1)// 直接删除对应的历史记录数据
      localStorage.setItem(key, JSON.stringify(this.historyList))
    },
    // 跳到搜索结果页
    toSearchResult (text) {
      // 跳转到搜索结果页?
      // this.$router 路由对象实例
      // this.$route 当前的路由页面对象信息  当前地址 params参数  query参数 fullPath
      // 路由传参 params query
      //   this.$router.push('/search/result?q=' + text) // 采用query传递参数  地址拼接参数
      this.$router.push({ path: '/search/result', query: { q: text } })// q是顺便写的名字
    },
    // 清空历史记录
    async clear () {
      try {
        // 直接清空历史记录
      // 一般来说 删除所有内容之前
      // 本身也支持promise
        await this.$dialog.confirm({
          title: '提示',
          message: '您确定要删除所有记录吗'
        })
        // // 会执行下面的代码
        this.historyList = []// 将本地历史记录设置为空
        localStorage.setItem(key, '[]')// 同步设置历史记录为空
      } catch (error) {
        // 失败不需要处理
      }
    },
    // 搜索或者键盘回车跳转搜索结果
    onSearch () {
      // 搜索内容不能为空,为空直接返回
      if (!this.q) return
      // 应该在跳转之前 应该把搜索的结果 添加到历史记录
      // 这里要去重 set
      this.historyList.push(this.q)// 即将搜索记数据添加到搜索历史记录
      this.historyList = Array.from(new Set(this.historyList))// 去重
      localStorage.setItem(key, JSON.stringify(this.historyList))// 设置到本地缓存
      this.$router.push({ path: '/search/result', query: { q: this.q } })
      // // 搜索事件触发的时候 应该跳到 搜索结果页 并且携带 参数，v-model.trim="q"参数
    },
    toResult (text) {
      // 应该也把这个text 放到历史记录啊
      this.historyList.push(text)// 添加到历史记录
      // 有可能重复
      this.historyList = Array.from(new Set(this.historyList))
      // 设置到本地的缓存中,将历史记录设置到缓存
      localStorage.setItem(key, JSON.stringify(this.historyList))
      // 跳转到搜索结果页
      this.$router.push({ path: '/search/result', query: { q: text } })
    }
  },
  watch: {
    // 监听改变的方法两种，1监听组件的值改变事件van-search2另外一个是监听数据的变化q
    // 监听谁就写谁的名字
    // 函数防抖
    q () {
      // // 我们要在这个位置 去请求接口
      // // 只要执行这个定时器先清掉他
      // clearTimeout(this.timer)
      // this.timer = setTimeout(async () => {
      //   // // 需要判断 当清空的时候 不能发送请求 但是要把联想的建议清空
      //   if (!this.q) { // 如果这时 搜索关键字没有内容
      //     this.suggestList = [] // 不能再继续了
      //     return
      //   }
      //   // this.q的this，要把上面变成箭头函数才能用this，setTimout作用域不是vue实例
      //   const data = await getSuggestion({ q: this.q })// 第一个q是接口文档要求的
      //   this.suggestList = data.options// 将返回的词条的options赋值给 当前的联想建议
      // }, 300)
      // 函数节流
      if (!this.timer) {
        this.timer = setTimeout(async () => {
          // // 先将标记设置为空
          this.timer = null
          // 需要判断 当清空的时候 不能发送请求 但是要把联想的建议清空
          if (!this.q) {
            // 如果这时 搜索关键字没有内容
            this.suggestList = []
            // 不能再继续了
            return
          }
          // 此函数中需要 请求 联想搜索的建议
          // 联想搜索的建议 需要 放置在一个变量中
          const data = await getSuggestion({ q: this.q })
          this.suggestList = data.options // 将返回的词条的options赋值给 当前的联想建议
        }, 300)
      }
    }
  }
  // created () {
  //   this.historyList = JSON.parse(localStorage.getItem(key) || '[]')
  //   // 或者在data中初始时，从缓存中读取数据
  // }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
