<template>
  <div class="container">
    <!-- 放置tabs组件 ,默认绑定激活页签-->
    <van-tabs v-model="activeIndex" >
        <!-- 内部需要放置子 标签  title值为当前显示的内容-->
         <!-- van-tab是vant组件的样式  -->
      <van-tab :title="item.name" v-for="item in channels " :key="item.id">
           <!-- van-tab里面要生成若干个单元格 -->
            <!-- 这里为什么叫scroll-wrapper  因为样式中对它进行了设置
             设置的是滚动 overflow-y: auto;//竖直方向出滚动条-->
      <!-- <div class="scroll-wrapper">
          <van-cell-group>
            <van-cell title="标题" value="内容" v-for="item in 20 " :key="item"></van-cell>
          </van-cell-group>
      </div> -->
      <!-- 父组件监听自定义事件,并且弹出层 -->
      <ArticleList @showAction="openAction" :channel_id="item.id"></ArticleList>
      </van-tab>
    </van-tabs>
    <!-- 放入图标 vant图标 -->
    <span class="bar_btn">
      <!-- name='wap-nav'，图标类型自带的 -->
      <van-icon name='wap-nav'></van-icon>
    </span>
    <!-- 放置一个弹层组件 -->
    <van-popup v-model="showMoreAction" style="width:80%">
      <!-- 监听谁就在谁的标签里写 -->
      <!-- 父组件 监听该事件, 调用不喜欢接口 -->
      <!-- 应该在此位置监听 more-action触发的事件 -->
      <MoreAction @dislike="dislikeArticle"></MoreAction>
    </van-popup>
  </div>
</template>

<script>
// .vue组件之间的引入没有大括号,需要在data中注册，然后放置到页面结构中，.js封装的文件的引入需要大括号
// 1引入组件，2注册，3
import ArticleList from './compoments/article-list'
import { getMychannels } from '@/api/channel'// 引入组件，data接收，methods使用函数
import MoreAction from './compoments/moreAction'
import { dislikeArticle } from '@/api/articles'// 不感兴趣
import eventbus from '@/utils/eventbus'// 公共事件处理器
export default {
  name: 'Home',
  components: {
    // ArticleList: ArticleList
    ArticleList, MoreAction

  },
  // 组件中为什么data是 返回一个新对象
  data () {
    return {
      channels: [], // 接收频道数据
      showMoreAction: false, // 控制反馈组件显示隐藏
      artileId: null, // 定义一个值接收
      activeIndex: 0// 当前被默认激活 的页签
    }
  },
  methods: {
    async getMychannels () { // 自己定义的一个方法，也叫getMychannels
      const data = await getMychannels()
      this.channels = data.channels
    },
    // 此方法 会在article-list组件触发 showAction的时候 触发
    openAction (artId) {
    // 此时应该弹出反馈的层
      this.showMoreAction = true
      // 把ID存储起来
      this.artileId = artId
    },
    // 调用不感兴趣接口，调用接口这样写({})
    async dislikeArticle () {
      try {
        await dislikeArticle({
          target: this.artileId// 不感兴趣的ID
        })// await下方的逻辑 是 resolve(成功)之后 的
        this.$lnotify({
          type: 'success',
          message: '操作成功'
        })
        //  // 应该 触发一个事件 利用事件广播的机制 通知对应的tab 来删除 文章数据
        // 除了 传一个文章之外 你还需要告诉 监听事件的人 现在处于哪个频道 可以传递频道id
        // this.channels[this.activeIndex].id // 当前激活的频道数据
        // 触发一个自定义事件，delArticle事件名，传一个参数不感兴趣的ID
        // 监听了这个事件组件 就要根据id来删除数据,两个ID一个文章ID一个频道ID
        eventbus.$emit('delArticle', this.artileId, this.channels[this.activeIndex].id)
        this.showMoreAction = false// 关闭弹层
      } catch (error) {
        this.$lnotify({
          // 默认是红色
          message: '操作失败'
        })
      }
    }

  },

  created () {
    this.getMychannels()
  }
}
</script>
<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;//竖直方向出滚动条
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
