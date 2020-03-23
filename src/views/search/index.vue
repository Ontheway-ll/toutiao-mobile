<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <!-- 搜索框和数据绑定，trim去除空格 -->
    <van-search v-model.trim="q"  placeholder="请输入搜索关键词" shape="round" />
    <!-- 联想内容  有输入内容时 显示联想 -->
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell icon="search">
        <span>java</span>
      </van-cell>
    </van-cell-group>
      <!-- 如果没有历史记录 隐藏掉  -->
    <!-- <div class="history-box" v-if="!q">这样也可以 -->
    <div class="history-box" v-else>
      <div class="head">
        <span>历史记录</span>
        <van-icon name="delete"></van-icon>
      </div>
      <van-cell-group>
        <van-cell>
          <a class="word_btn">电脑</a>
          <van-icon class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'search',
  // 首先应该给搜索框绑定一个数据,来获取搜索的内容
  data () {
    return {
      q: ''
    }
  }
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
