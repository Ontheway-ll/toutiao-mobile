<template>
  <div class="container">
    <!-- 搜索组件以及路由，返回上一个页面 -->
    <van-nav-bar left-arrow title="登录" @click-left="$router.back()" ></van-nav-bar>
    <!-- 登录布局 -->
    <!-- 外层需要用cell-group组件来包裹提供 边框 -->
    <van-cell-group>
      <!-- 双向绑定，v-model的修饰符，trim,去除空格 -->
      <van-field  @blur="checkMobile" :error-message="errMessage.mobile" v-model.trim="loginForm.mobile" label="手机号" placeholder="请输入手机号" ></van-field>
      <van-field @blur="checkCode" :error-message="errMessage.code" v-model.trim="loginForm.code" label="验证码" placeholder="请输入验证码" >
        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
        <!-- 登录按钮 -->
        <div class="login-box">
          <van-button @click="login"  round block type="info" size="small" >登录</van-button>
        </div>
         </div>
</template>

<script>
// 引入login方法
import { login } from '@/api/user'
// 或者import * as abc from '@/api/user' 用的是abc.login
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      // 定义表单数据，双向绑定
      loginForm: {
        mobile: '13911111111', // 手机号最后 ,为了测试方便,我们可以将默认的 手机号和验证码 写成固定值
        code: '246810'// 验证码
      },
      // 定义两个变量，提示消息
      errMessage: {
        mobile: '', // 手机提示消息
        code: ''// 验证码提示消息
      }
    }
  },
  methods: {
    ...mapMutations(['updateUser']), // 可以导入需要的方法  直接把updateUser方法映射到当前的methods方法中
    // 表单校验，1手机号校验
    checkMobile () {
      // 校验，手机号不能为空，格式必须正确
      if (!this.loginForm.mobile) {
        // 表示为空，'',null,undifind,取反，为true
        // 提示消息
        this.errMessage.mobile = '手机号不能为空'
        return false
      }
      // 格式正确,\d是数字的意思
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errMessage.mobile = '手机格式不正确'
        return false
      }
      // 如果到了这个地方，说明都正确了
      // 因为通过了，没有消息提示了
      this.errMessage.mobile = ''
      return true
    },
    checkCode () {
      // 检查验证码，不能为空，和六位数

      if (!this.loginForm.code) {
        this.errMessage.code = '验证码不能为空'
        return false
      }
      // 验证位数
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errMessage.code = '验证码为6位数'
        return false
      }
      // 如果到了这个地方，说明都正确了
      // 因为通过了，没有消息提示了
      this.errMessage.code = ''
      return true
    },
    // 点击登录的时候校验所有表单数据
    async login () {
      // 校验手机号和验证码
      const validateMobile = this.checkMobile()
      const validateCode = this.checkCode()
      if (validateMobile && validateCode) {
        // 如果都为true，表示校验通过
        // console.log('校验通过')
        // 调用接口      login()    ，用户名和密码是否正确
        // 第一种写法，
        // login({ mobile: this.loginForm.mobile, code: this.loginForm.code })
        // 第二种写法
        // login(this.loginForm).then(result=>{}).catch(){}
        try {
          const result = await login(this.loginForm)
          // console.log(result)值是token和refresh_token,已经解构

          // 拿到token之后 应该把token设置vuex中的state
          // 要去修改vuex中的state必须通过 mutations
          // 第一种写法
          // this.$store.commit('updateUser')
          // 第二种写法，
          // 引入mapMutations,
          this.updateUser({ user: result })// 相当于更新当前的token 和 refresh_token
          // 应该跳转到主页 but 如果此时 你这个登录 是 别人401之后跳转过来的 你就应该回到那个跳转过来的页面
          // 1 判断是否有需要跳转的页面 如果有 就跳转 如果没有 不用管 直接跳到主页
          // 当前路由信息的query对象，route,this.$route
          //  const {  } = this.$route.query，有一个redicturl的变量
          // 别人跳转你登录页会给你传入一个参数redirectUrl,通过query参数传的
          const { redirectUrl } = this.$route.query// query查询参数 也就是 ?后边的参数表
          // redirectUrl有值的话 跳到该地址 没值的话 跳到 主页
          this.$router.push(redirectUrl || '/')// 短路表达式
        } catch (error) {
          // 提示消息 提示用户 告诉用户登录失败
          this.$notify({ message: '用户名或者验证码错误', duration: 800 })
        }
      }
    }
  }
}
</script>

<style>
.login-box{
  padding: 20px;
}
</style>
