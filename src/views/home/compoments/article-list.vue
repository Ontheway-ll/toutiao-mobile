<template>
  <!-- 文章列表组件  放置列表 -->
  <!-- van-list 可以帮助我们实现上拉加载  需要一些变量 -->
  <!-- 这里放置这个div的目的是 形成滚动条, 因为我们后期要做 阅读记忆 -->
  <!-- 阅读记忆  上次你阅读到哪  回来之后还是哪-->
<div class="scroll-wrapper">
    <!-- 文章列表 -->
      <!-- van-list组件 如果不加干涉, 初始化完毕 就会检测 自己距离底部的长度,如果超过了限定 ,就会执行 load事件  自动把
       绑定的 loading 变成true
      -->
      <!-- 下拉刷新组件，包裹列表组件 -->
      <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="successText">
        <van-list finished-text="没有了" @load="onLoad"  v-model="uploading" :finished="finished">
        <!-- 循环的内容 -->
        <van-cell-group>
          <van-cell v-for="item in articles" :key="item" title="每股熔断" :value="`天台排队`+item"></van-cell>
        </van-cell-group>
      </van-list>
      </van-pull-refresh>

</div>
</template>

<script>
export default {
  data () {
    return {
      articles: [],
      uploading: false, // 表示是否开启了上拉加载 默认值false
      finished: false, // 表示 是否已经完成所有数据的加载
      downLoading: false, // 下载刷新状态 表示是否正在下拉刷新,变量名自己写
      successText: ''// 刷新成功的文本
    }
  },
  methods: {
    onLoad () {
    //   console.log('开始加载数据')
      // 下面这么写 依然不能关掉加载状态 为什么 ? 因为关掉之后  检测机制  高度还是不够 还是会开启
      // 如果你有数据 你应该 把数据到加到list中
      // 如果想关掉
      //   setTimeout(()=>{})
      // setTimeout(() => {
      //   //   this.uploading=true这样写是不对的，高度不够还是会开启
      //   this.finished = true// 表示 数据已经全部加载完毕 没有数据了
      // }, 1000)// 等待一秒后关闭加载状态
      if (this.articles.length > 50) {
        this.finished = true
      } else {
        // Array.from()方法就是将一个类数组对象或者可遍历对象转换成一个真正的数组。
        const arr = Array.from(Array(15), (value, index) => this.articles.length + index + 1)
        // 上拉加载 不是覆盖之前的数据  应该把数据追加到数组的队尾
        this.articles.push(...arr)
        // 添加完数据 需要手动的关掉 loading
        this.uploading = false
      }
    },
    onRefresh () {
      setTimeout(() => {
        const arr = Array.from(Array(2), (value, index) => '追加' + (index + 1))
        // 下拉刷新 表示要读取最新的数据 而且最新的数据要添加到数据头部
        this.articles.unshift(...arr)
        // 手动关闭正在加载的状态
        this.downLoading = false
        this.successText = `更新了${arr.length}条数据`
      }, 1000)
    }

  }
}
</script>

<style>

</style>
