<template>
  <div class="sys_login_form">
      <!-- S 系统用户登录表单/ -->
      <el-form :model="sysLoginForm" :rules="sysLoginFormRules" ref="sysLoginForm">
        <el-form-item prop="username">
          <el-input v-model="sysLoginForm.username" placeholder="请输入用户名">
            <i slot="prefix" class="iconfont icon_user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :type="sysLoginForm.showPasswd ? '' : 'password'"
           v-model="sysLoginForm.password" @keyup.enter.native="handleSysLogin" placeholder="请输入用密码">
            <i slot="prefix" :class="sysLoginForm.showPasswd ? 'iconfont icon_password_unlock' : 'iconfont icon_password'"></i>
            <i slot="suffix" class="iconfont icon_eye" @click="triggleShowPasswd"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="sysLoginForm.remeberMe" class="login_remeber">记住密码</el-checkbox>
          <el-button class="login_reset_passwd" type=text>忘记密码</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="login_button" type="primary" @click="handleSysLogin" :loading="loging">登录</el-button>
        </el-form-item>
      </el-form>
      <!-- E 系统用户登录表单/ -->
  </div>
</template>
<script>
import { sysUserLogin } from '../api'
export default {
  name: 'sys-login',
  data () {
    return {
      sysLoginForm: {
        username: '',
        password: '',
        remeberMe: false,
        showPasswd: false
      },
      sysLoginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      loging: false
    }
  },
  methods: {
    // 切换密码输入框类型，显示或隐藏密码
    triggleShowPasswd () {
      this.sysLoginForm.showPasswd = !this.sysLoginForm.showPasswd
    },
    // 登录调用
    handleSysLogin () {
      // 登录表单校验
      this.$refs['sysLoginForm'].validate((valid) => {
        if (valid) {
          // 设置登录按钮加载中，防止重复点击
          this.loging = true
          sysUserLogin(this.sysLoginForm.username, this.sysLoginForm.password, this.sysLoginForm.remeberMe).then(res => {
            let data = res.data
            if (data.success) {
              this.$message.success({
                message: "登录成功"
              })
              this.$emit('handleLoginSuccess', data.data)
            } else {
              this.$message.error({
                message: data.msg
              })
            }
            this.loging = false
          }).catch(() => {
            this.sysLoginForm.password = ''
            this.loging = false
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.sys_login_form {
  .login_remeber {
    float: left;
  }
  .login_reset_passwd {
    float: right;
  }
  .login_button {
    width: 100%;
  }
}
</style>
