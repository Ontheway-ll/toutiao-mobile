<template>
  <div class="container">
    <van-nav-bar @click-right="saveUser" left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存"></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="user.photo"
          @click="showPhoto=true"
        />
      </van-cell>
      <van-cell @click="showName=true" is-link title="名称" :value="user.name" />
      <van-cell @click="showGender=true"  is-link title="性别" :value="user.gender===0 ?'男':'女' " />
      <van-cell @click="showDate" is-link title="生日" :value="user.birthday" />
    </van-cell-group>
    <!-- 头像弹层 -->
     <!-- 弹层组件 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
       <van-cell @click="openFileDialog" is-link title="本地相册选择图片"></van-cell>
       <van-cell is-link title="拍照"></van-cell>
    </van-popup>
    <!-- 昵称弹层 -->
     <!-- 弹昵称 -->
     <!-- 把点击弹层背景关闭弹层的功能关闭 -->
    <van-popup :close-on-click-overlay="false" v-model="showName" style="width:80%">
       <!-- 编辑用户昵称  双向绑定用户的昵称-->
       <!-- 表单中的输入框组件Field 输入框 -->
       <van-field :error-message= "nameMsg" v-model.trim="user.name" type='textarea'  rows="4"></van-field>
       <!-- 放置一个按钮来控制弹层的关闭 -->
       <van-button  type="info" size="normal" block @click="btnName">确定</van-button>
    </van-popup>
    <!-- 性别弹层 =>van-action-sheet  actions是一个数组，显示性别和名称，-->
     <!--select 选中选项时触发，禁用或加载状态下不会触发 -->
  <van-action-sheet  @select="selectItem" :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>
    <!-- 生日弹层 -->
    <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间 van-datetime-picker时间组件- ->
      <--type表示 当前的日期类型 年月日 -->
      <van-datetime-picker
           v-model="currentDate"
           type="date"
          :min-date="minDate"
          :max-date="maxDate"
          @cancel="showBirthDay=false"
          @confirm="confirmDate"
         />
    </van-popup>
    <!-- cancel事件是点击取消的时候，关闭日期弹层 -->
    <!-- 准备表单控件，input，type=file类型表示上传，display:none隐藏标签 -->
   <!-- vue中通过ref获取dom对象 ,如果选择图片就会触发change事件-->
    <input @change="upload" ref="myFile" type="file" style="display:none">
  </div>

</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile, updatePhoto, saveUserInfo } from '@/api/user'
export default {
  data () {
    return {
      showPhoto: false, // 显示头像弹层
      showName: false, // 显示昵称弹层
      showGender: false, // 性别弹层
      showBirthDay: false, // 生日弹层
      // 定义 性别的数据 ,定义最大时间最小时间
      actions: [{ name: '男' }, { name: '女' }],
      minDate: new Date(1990, 1, 1),
      maxDate: new Date(), // 生日最大时间 永远是小于等于当前时间的
      currentDate: new Date(), // 当前时间，当弹出层显示的时间
      nameMsg: '', // 错误信息
      // 首先定义一个user数据, 因为数据都是存在 用户资料中
      user: {
        name: '', // 用户昵称
        gender: 1, // 性别默认值
        birthday: '2002-01-01', // 生日默认
        photo: ''// 用户头像
      }
    }
  },
  methods: {
    btnName () {
      // 对按钮长度进行判断昵称进行控制,控制昵称的长度 1-7,
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        // 如果名字的长度小于1或者大于7，不符合要求
        this.nameMsg = '用户昵称的长度应该是1-7的长度要求'
        return // 不能在继续
      }
      this.nameMsg = ''// 直接将信息情况
      this.showName = false
    },
    // 性别方法
    // van-action-sheet有2个回调参数的,
    selectItem (item, index) {
      // console.log(arguments)// 打印出所有的参数
      // console.log(item, index)// 可以拿到点击的第几个和选项
      // debugger
      // 通过item或者 index可以得到 点击的是男或者是女index 0 男  1 女
      this.user.gender = index// 把点击的男或者女的下标赋值给性别
      // 手动关闭弹层
      this.showGender = false
    },
    // 生日方法
    showDate () {
      this.showBirthDay = true // 显示生日弹层
      // 将当前的生日设置到选择日期的当前时间，将生日字符串转化成Data对象绑定到日期组件上
      // van-datetime-picker时间选择器，要求把字符串转化成Data格式
      // console.log('1990-1-1');打印出来是Mon Jan 01 1990 00:00:00 GMT+0800 (中国标准时间)
      this.currentDate = new Date(this.user.birthday)
    },
    // 点击生日弹层 确认 按钮，van-datetime-picker有一个事件是confirm
    confirmDate () {
      // console.log(this.currentDate);可以拿到当前的生日
      //  当前选择的生日 其实就是 currenDate
      // 拿到选择的日期  设置给生日  => date  => 字符串
      // dayjs().format('YYYY-MM-DD')
      this.user.birthday = dayjs(this.currentDate).format('YYYY-MM-DD')// 将date类型转化成字符串
      // 关闭弹层，点击确定后
      this.showBirthDay = false
    },
    // 封装方法
    async getUserProfile () {
      this.user = await getUserProfile()
    },
    // 点击本地相册，打开文件的对话框，触发点击input：file的动作
    openFileDialog () {
      this.$refs.myFile.click()// 触发input：file的click事件，触发事件就会弹出对话框
    },
    // 修改头像像,绑定upload函数
    async upload (params) {
      // debugger,进来之后可以知道change事件选择完头像
      // 传的参数是form-data类型，怎么获取呢new一个
      const data = new FormData()
      // 添加参数append(key,)body里的参数名，第二个参数是选择的图片文件
      //  debugger
      // console.log(this.$refs.myFile);打印dom元素，看不到
      // console.dir(this.$refs.myFile);打印元素对象，打印出来是input对象
      // input里有个files属性，数组的第0条
      data.append('photo', this.$refs.myFile.files[0])
      // debugger第二个参数params应该可以通过断点看到,但是没有，可以通过其他方式
      const result = await updatePhoto(data)// data当做一个参数传进去,上传头像
      this.user.photo = result.photo// 把返回结果的photo赋值dataz中的数据的ptoto
      this.showPhoto = false// 关闭弹层
    },
    // 保存用户信息
    async  saveUser () {
      try {
        await saveUserInfo(this.user)// 传入user对象
        this.$lnotify({ type: 'success', message: '保存成功' })
      } catch (error) {
        this.$lnotify({ message: '保存失败' })
      }
    }

  },
  // 在钩子函数中调用
  created () {
    this.getUserProfile()// 获取用户资料
  }
}
</script>

<style>
</style>
