<template>
  <div class="comment">
    <!-- 文章详情-评论组件-评论列表布局 -->
    <van-list @load="onLoad" v-model="loading" :finished="finished" finished-text="没有更多了">
      <div
        class="item van-hairline--bottom van-hairline--top"
        v-for="comment in comments"
        :key="comment.com_id.toString()"
      >
        <van-image round width="1rem" height="1rem" fit="fill" :src="comment.aut_photo" />
        <div class="info">
          <p>
            <span class="name">{{comment.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{comment.like_count}}</span>
            </span>
          </p>
          <p>{{comment.content}}</p>
          <p>
            <span class="time">{{comment.pubdate|relTime}}</span>&nbsp;
            <van-tag plain @click="openReply(comment.com_id.toString())">{{comment.reply_count}}回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span @click="submit()" class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
    <!-- 回复 -->
    <!-- 在关闭弹层时把commentID置为空 -->
    <van-action-sheet
      @closed="reply.commentId=null"
      v-model="showReply"
      :round="false"
      class="reply_dialog"
      title="回复评论"
    >
      <!-- 列表组件，immediate-check="false"初始化不加载列表，关闭主动上拉加载 -->
      <van-list
        @load="getReply"
        :immediate-check="false"
        v-model="reply.loading"
        :finished="reply.finished"
        finished-text="没有更多了"
      >
        <div
          class="item van-hairline--bottom van-hairline--top"
          v-for="item in reply.list"
          :key="item.com_id.toString()"
        >
          <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
          <div class="info">
            <p>
              <span class="name">{{item.aut_name}}</span>
            </p>
            <p>{{item.content}}</p>
            <p>
              <span class="time">{{item.pubdate|relTime}}</span>
            </p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import * as articles from '@/api/articles'
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      comments: [], // 用来存放评论列表的数据
      offset: null, // 存放评论列表数据加载分页的依据，如果为空，表示从第一页开始
      showReply: false, // 控制评论的评论面板是否显示
      reply: { // 此对象专门放置 面板加载信息
        loading: false,
        finished: false,
        offset: null, // 偏移量 作为评论的评论分页加载的时候 查询的依据
        list: [], // 存放评论的评论的数据
        commentId: null// 用来存放 当前点击的评论Id
      }
    }
  },
  methods: {
    // 加载方法 滚动条距离底部距离超过一定距离的时候就会触发
    async  onLoad () {
      const { artId } = this.$route.query // 任何组件的属性中都都有一个$route选项
      const data = await articles.getComments({
        type: 'a', // a(文章的评论)   c(评论的评论
        source: artId, // 表示你查询的 谁的 评
        offset: this.offset// 赋值当前的偏移量
      })
      // 要将data数据赋值给 comments
      this.comments.push(...data.results)// 将评论数据追加到评论列表的尾部
      // 首先 应该关闭 加载状态
      this.loading = false// 关闭正在上拉加载的数据，因为获取数据后load事件自动上拉加载数据
      // 需要判断是否还有下一页数据
      //  data.end_id===data.last_id,finished=true没有下一页
      this.finished = data.end_id === data.last_id// 如果两个ID相等没有下一页
      if (!this.finished) {
        // 还有下一页，继续请求// 表示 还没没结束
        // data.last_id是 当前页的最后一个id
        this.offset = data.last_id
      }
    },
    // 评论的回复
    openReply (commentId) { // 绑定的方法传了一个ID，这里要接收一个
      // 打开回复
      this.showReply = true
      this.reply.commentId = commentId
      // 打开对话框的时候，获取ID，进行加载, 需要重置数据
      // 在弹出面板的时候 重置数据
      //  弹出窗口之前  把之前的list清空  重置数据
      this.reply.list = []// 清空之前的数据
      this.reply.offset = null// 因为希望点击弹出回复面板的时候 是新的数据 从第一页开始
      this.reply.finished = false // 将finsish打开
      this.reply.loading = true// 主动打开加载状态 因为此时没有 主动检查
      this.getReply()// 弹出评论的评论的层时 主动的去请求一次数据
    },
    // 此方法 用来获取评论的评论
    // 此方法  会在第一次 时执行 也会在 加载第二页 .. 第三页 .. 时执行
    async  getReply () {
      const data = await articles.getComments({
        type: 'c', // a(文章的评论)   c(评论的评论
        source: this.reply.commentId, // 获取评论的评论
        offset: this.reply.offset// 评论的评论分页依据
      })
      this.reply.list.push(...data.results)// 需要将数据追加到 reply.list 队尾
      this.reply.loading = false
      this.reply.finished = data.last_id === data.end_id// 如果它俩相等 表示 game ove
      if (!this.reply.finished) {
        this.reply.offset = data.last_id// 如果不等 表示还有下一页数据
        // 下面是渲染组件
      }
    },
    // 提交评论的方法
    async  submit () {
      //  点击的时候要做什么 ?
      //  因为此时并没有判断用户是否登录了 先判断用户是否登录 如果没有登录 不让评论 如果登录了才可以继续
      if (this.$store.state.user.token) {
        //  此时才认为你登录了
        // 首先应该判断是否输入了 评论内容
        // 如果没有评论内容 直接返回
        if (!this.value) return false// 表示如果当前评论内容为空就立刻返回
        this.submiting = true// 将提交状态设置成true 控制用户单位时间内评论的数据次数
        await this.$sleep(800)// 强制等待500 毫秒
        try {
          // 评论
        // 一种是对文章进行评论
        // 一种是对评论进行评论
        // 如果不为空 继续
        // 怎么样区分当前是对文章进行评论 还是对评论进行评论
        // 两种方式 一种方式 通过 showReply的true/false
        // 一种方式 通过 reply.commentId是存在
          const data = await articles.commentOrReply({
            // this.reply.commentId 存在 就要对 评论进行评论  否则传文章ID
            target: this.reply.commentId ? this.reply.commentId.toString()
              : this.$route.query.artId,
            content: this.value, // 评论的内容
            art_id: this.reply.commentId ? this.$route.query.artId : null // 评论的评论用，文章不需要,传的是文章ID
          })
          // 直接提交方法
          // 希望调用完成之后 , 添加的评论数据 直接添加到我们的评论列表
          // data.new_obj 此obj数据是添加成功的一条数据 这一条数据 我们需要 加入到列表中
          // 两种场景  文章评论  评论评论
          if (this.reply.commentId) {
          // 把评论的评论添加到列表中
          // 在返回的数据中有一个new_obj里面有返回的详细信息
            this.reply.list.unshift(data.new_obj) // data.new_obj 此obj数据是添加成功的一条数据 这一条数据 我们需要 加入到列表中
            // 如果是对评论进行评论  需要找到 对应的评论id 将评论id的回复数+1
            const comment = this.comments.find(item => item.com_id.toString() === this.reply.commentId)
            // 寻找文章评论中 等于 当前评论id的id
            comment && comment.reply_count++ // 如果找到就将 回复数量+1
          } else {
            // 表示对文章评论
            this.comments.unshift(data.new_obj)
          }
          this.value = ''// 清空评论内容
        } catch (error) {
          // 评论失败
          this.$lnotify({ message: '评论失败' })
        }
        this.submiting = false// 状态关闭
      } else {
        try {
          // 认为你没有登录
        // 告知用户 如果你想评论 你需要去登录 如果放弃评论 那就放弃
          await this.$dialog.confirm({
            message: '如果想要评论,你需要去登录'
          })// 会有.then用await，async
          // 如果点击了确定 需要跳到登录
          // fullPath是完整地址
          // path 是  /articles   /articles?artId=123
          this.$router.push({
            path: '/login',
            query: {
              redirectUrl: this.$route.fullPath
              // 此地址是用户登录成功之后需要回到的页面
            }
          })
        } catch (error) {
          // console.log('点击了取消')
        }
      }
    }
  }
}
</script>

<style lang='less' scoped>
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content {
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name {
        color: #069;
      }
      .zan {
        vertical-align: middle;
        padding-right: 2px;
      }
      .count {
        vertical-align: middle;
        font-size: 10px;
        color: #666;
      }
      .time {
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
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
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
</style>
