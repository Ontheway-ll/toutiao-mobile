<template>
  <div class="container">
    <!-- 放置tabs组件 -->
    <van-tabs>
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
      <MoreAction></MoreAction>
    </van-popup>
  </div>
</template>

<script>
// 1引入组件，2注册，3
import ArticleList from './compoments/article-list'
import { getMychannels } from '@/api/channel'// 引入组件，data接收，methods使用函数
import MoreAction from './compoments/moreAction'
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
      artileId: null// 定义一个值接收
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
