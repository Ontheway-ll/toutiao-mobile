<template>
  <!-- 文章列表组件  放置列表 -->
  <!-- van-list 可以帮助我们实现上拉加载  需要一些变量 -->
  <!-- 这里放置这个div的目的是 形成滚动条, 因为我们后期要做 阅读记忆 -->
  <!-- 阅读记忆  上次你阅读到哪  回来之后还是哪-->
  <div ref="mySroll" @scroll="remember" class="scroll-wrapper">
    <!-- 文章列表 -->
    <!-- van-list组件 如果不加干涉, 初始化完毕 就会检测 自己距离底部的长度,如果超过了限定 ,就会执行 load事件  自动把
       绑定的 loading 变成true
    -->
    <!-- 下拉刷新组件，包裹列表组件 -->
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="successText">
      <van-list finished-text="没有了" @load="onLoad" v-model="uploading" :finished="finished">
        <!-- 循环的内容:to="`/article?artId,动态路由传参，artId随便起 -->
        <van-cell-group>
          <van-cell :to="`/article?artId=${item.art_id.toString()}`" v-for="item in articles" :key="item. art_id.toString()" >
            <!-- 放置元素 文章列表的循环项  无图  单图  三图 -->
            <div class="article_item">
              <!-- 标题 -->
              <h3 class="van-ellipsis">{{item.title}}</h3>
               <!-- 图片组件用的是 vant的组件库中的图片组件 需要使用该组件 进行图片的懒加载 -->
              <!-- 三图 -->
              <div class="img_box" v-if="item.cover.tpye===3">
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image  lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <!-- 放置一张图 ，暂时隐藏-->
              <div class="img_box">
                <van-image lazy-load class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>
              <!-- 底部信息 -->
              <div class="info_box">
                <span>{{item.aut_name}}</span>
                <span>{{item.comm_count}}</span>
                <span>{{item.pubdate | relTime }}</span>
                <!-- 子传父自定义事件，点击叉号事件，传一个showAction -->
                <!-- 所以我们需要点击叉号的时候 把文章id传出来,并且在父组件中接收 存储
                们点击叉号事件继续冒泡, 结果触发了跳转, 所以我们需要一个修饰符,让事件停止冒泡 -->
                <span @click.stop="$emit('showAction',item. art_id.toString())" class="close" v-if="user.token">
                  <van-icon  name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getAticles } from '@/api/articles'
import { mapState } from 'vuex'
import eventBus from '@/utils/eventbus'
export default {
  // 初始化化函数监听
  // 监听删除文章事件
  // 相当于 有多少个实例 就有多少个监听
  // delAriticle  => 假如有四个实例  4个函数
  created () { // 如果触发会执行后面的函数,两个参数ID接收，名字随意
    eventBus.$on('delArticle', (artId, chanlId) => {
      // 这个位置 每个组件实例都会触发
    // 这里要判断一下 传递过来的频道是否等于 自身的频道
      if (chanlId === this.channel_id) {
      // 说明当前的这个article-list实例 就是我们要去删除数据的实例
      //  [1,2,3] findIndex(function(item,index){return item===3})返回2
        const index = this.articles.findIndex(item => item.art_id.toString() === artId)
        // 通过id 查询对应的文章数据所在的下标
        if (index > -1) {
          // 因为下标从0开始 所以应该大于-1
          this.articles.splice(index, 1)// 删除对应下标的数据
        }
        if (this.articles.length === 0) {
          // 如果把数据删光了，手动触发上拉加载，重新请求加载数据
          this.onLoad()
        }
      }
    })
    // eventbus事件在created中写，初始化就开始监听
    // eventbus.$on(事件名，回调函数)
    eventBus.$on('changTabs', (id) => {
      // 此ID就是当前被激活的ID，如果当前被激活索引的ID和文章列表组件的实例相等
      // 判断当前文章列表接收的ID是否等于此ID，如果相等，改文章列表实例就是要滚动的实例
      // 一个tab页就是一个实例,this.channel_id自身频道ID是通过props传过来的，
      if (id === this.channel_id) {
        // 如果相等，表示要滚动 滚动条
        // 当滚动距离不为零，并且滚动元素存在的情况下
        // 为什么这里不能实现？因为tab页切换事件执行之后，article—list组件渲染是异步，
        // 没有办法立刻得出结果，获取不到this.$refs.mySroll
        // 怎么才能此代码执行的时候上一次代码渲染完毕，vue渲染是异步的，
        // this.$nextTick()会在上一次数据更新并完成页面渲染完成后执行
        this.$nextTick(() => {
          if (this.scrollTop && this.$refs.mySroll) {
            this.$refs.mySroll.scrollTop = this.scrollTop// 滚动到固定位置
          }
        })
      }
    })
  },
  computed: {
    ...mapState(['user'])// 将user对象映射到计算属性中
  },
  data () {
    return {
      articles: [],
      uploading: false, // 表示是否开启了上拉加载 默认值false
      finished: false, // 表示 是否已经完成所有数据的加载
      downLoading: false, // 下载刷新状态 表示是否正在下拉刷新,变量名自己写
      successText: '', // 刷新成功的文本
      timestamp: null, // 定义一个 timestamp属性,用来存放时间戳
      scrollTop: 0// 记录滚动的位置
    }
  },
  // props 对象形式 可以约束传入的值 必填 传值类型
  props: {
    // key(props属性名): value(对象 配置)
    channel_id: {
      required: true, // 必填项 此属性的含义 true 要求该 props必须传
      type: Number, // 表示要传入的prop属性的类型
      default: null // 默认值的意思 假如你没有传入 prop属性 默认值 就会被采用

    }
  },
  methods: {
    // 记录滚动事件
    remember (event) { // 从remember中拿到event事件参数
    // console.log(event);里面的target属性div里的scollTop

      // 函数防抖，在一定时间内只是执行一次
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        // 记录当前滚动的位置
        this.scrollTop = event.target.scrollTop// 记录滚动的位置
      }, 500)
    },
    async onLoad () {
      await this.$sleep() // 人为控制了 请求的时间
      //   console.log('开始加载数据')
      // 下面这么写 依然不能关掉加载状态 为什么 ? 因为关掉之后  检测机制  高度还是不够 还是会开启
      // 如果你有数据 你应该 把数据到加到list中
      // 如果想关掉
      //   setTimeout(()=>{})
      // setTimeout(() => {
      //   //   this.uploading=true这样写是不对的，高度不够还是会开启
      //   this.finished = true// 表示 数据已经全部加载完毕 没有数据了
      // }, 1000)// 等待一秒后关闭加载状态
      // if (this.articles.length > 50) {
      //   this.finished = true
      // } else {
      //   // Array.from()方法就是将一个类数组对象或者可遍历对象转换成一个真正的数组。
      //   const arr = Array.from(
      //     Array(15),
      //     (value, index) => this.articles.length + index + 1
      //   )
      //   // 上拉加载 不是覆盖之前的数据  应该把数据追加到数组的队尾
      //   this.articles.push(...arr)
      //   // 添加完数据 需要手动的关掉 loading
      //   this.uploading = false
      // }
      // 在onLoad中实现加载数据后,

      // 1 将数据追加到数据队尾,

      // 2并且获取历史时间戳给timestamp,

      // 3加载完毕 关闭加载状态

      // 4判断 是否有历史时间戳 没有的话 直接将finished关闭

      // 5第一次加载, 时间戳的是空的, 所以给当前时间戳
      const data = await getAticles({
        channel_id: this.channel_id, // this.channel_id指的是 当前的频道id
        timestamp: this.timestamp || Date.now()// 如果有历史时间戳 用历史时间戳 否则用当前的时间戳
      })
      // 获取内容
      this.articles.push(...data.results)// 将数据追加到队尾
      this.uploading = false // 关闭加载状态
      // 将历史时间戳 给timestamp  但是 赋值之前有个判断 需要判断一个历史时间是否为0
      // 如果历史时间戳为 0 说明 此时已经没有数据了 应该宣布 结束   finished true
      if (data.pre_timestamp) {
        // 如果有历史时间戳 表示 还有数据可以继续进行加载
        this.timestamp = data.pre_timestamp
      } else {
        // 表示没有数据可以请求了
        this.finished = true
      }
    },
    async onRefresh () {
      await this.$sleep() // 人为控制了 请求的时间
      // setTimeout(() => {
      //   const arr = Array.from(
      //     Array(2),
      //     (value, index) => '追加' + (index + 1)
      //   )
      //   // 下拉刷新 表示要读取最新的数据 而且最新的数据要添加到数据头部
      //   this.articles.unshift(...arr)
      //   // 手动关闭正在加载的状态
      //   this.downLoading = false
      //   this.successText = `更新了${arr.length}条数据`
      // }, 1000)
      const data = await getAticles({
        channel_id: this.channel_id,
        timestamp: Date.now()// 永远传最新的时间戳
      })
      // 手动关闭下拉刷新状态
      this.downLoading = false
      // 需要判断 最新的时间戳能否换来的数据啊  如果能换来数据 把新数据整个替换旧数据 如果不能  就告诉大家 暂时没有更新
      if (data.results.length) {
        // 如果有返回数据
        // 需要将整个的articles替换
        this.articles = data.results// 历史数据全部被覆盖
        // 此时你 已经之前的全部数据覆盖了 假如 你之前把数据拉到了低端 也就意味着 你之前的finished已经为true了
        if (data.pre_timestamp) {
          // 因为下拉刷新 换来了一拨新的数据 里面 又有历史时间戳
          this.finished = false// 重新唤醒列表 让列表可以继续上拉加载
          this.timestamp = data.pre_timestamp// 记录历史时间戳给变量
        }
        this.successText = `更新了${data.results.length}条数据`
      } else {
        // 如果换不来新数据
        this.successText = '当前已经是最新了'
      }
    }
  },
  activated () {
    // console.log('激活函数')
    // 判断当前是否存在这个div而且,判断当前的scrollTop是否发生了变化，是否大于0
    if (this.$refs.mySroll && this.scrollTop) {
      // 记录滚动条滚回到对应的位置
      this.$refs.mySroll.scrollTop = this.scrollTop
    }
  }
}
</script>

<style lang="less" scoped>
.article_item{
  h3{
    font-weight: normal;
    line-height: 2;
  }
  .img_box{
    display: flex;
    justify-content: space-between;
    .w33{
      width: 33%;
      height: 90px;
    }
    .w100{
      width: 100%;
      height: 180px;
    }
  }
  .info_box{
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span{
      padding-right: 10px;
      &.close{
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
