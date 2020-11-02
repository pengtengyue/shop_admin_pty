<template>
  <div class="login">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" status-icon>
      <img src="@/assets/images/pty.jpg" alt />
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" @keyup.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登入222WW</el-button>
        <el-button @click="ruleForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 导入axios
// import axios from 'axios'
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'change' },
          {
            min: 5,
            max: 12,
            message: '长度在 5 到 12 个字符',
            trigger: 'change'
          }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    // 重置按钮的事件
    ruleForm() {
      this.$refs['form'].resetFields()
    },
    // 登入按钮的事件
    async login() {
      try {
        await this.$refs.form.validate()
        let res = await this.axios({
          method: 'post',
          url: 'login',
          data: this.form
        })
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
          return
        }
        // 弹出成功的提示
        this.$message.success(res.meta.msg)
        localStorage.setItem('token', res.data.token)
        this.$router.push({ path: 'home' })
      } catch (e) {
        return false
      }

      // this.$refs.form.validate(valid => {
      //   // valid参数是当校验成功是true，反之是false
      //   // 校验失败 返回false 阻止登入按钮的默认行为
      //   if (!valid) return false
      //   // 发送ajax请求
      //   this.axios({
      //     method: 'post',
      //     url: 'login',
      //     data: this.form
      //   }).then(({ meta: { status, msg }, data: { token } }) => {
      //     if (status === 200) {
      //       this.$message({
      //         message: '登入成功',
      //         type: 'success',
      //         duration: 1000
      //       })
      //       localStorage.setItem('token', token)
      //       // 跳转到home组件
      //       this.$router.push({ path: 'home' })
      //     } else {
      //       // 在不传入其他参数配置参数的情况下可以使用这种简写
      //       this.$message.error(msg)
      //     }
      //   })
      // })
    }
  }
}
</script>

<style scoped lang='less'>
.login {
  width: 100%;
  height: 100%;
  background-color: aqua;
  overflow: hidden;
  .el-form {
    width: 400px;
    margin: 200px auto;
    background-color: #fff;
    padding: 75px 40px 20px;
    border-radius: 3%;
    position: relative;
    img {
      width: 130px;
      position: absolute;
      left: 50%;
      top: -88px;
      transform: translateX(-50%);
      border-radius: 20%;
    }
    .el-button:nth-child(2) {
      margin-left: 100px;
    }
  }
}
</style>
