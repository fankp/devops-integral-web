<template>
  <div class="login_container">
    <div class="login_main">
      <div class="login_title">
        <span>一体化平台</span>
      </div>
      <sys-login @handleLoginSuccess="handleLoginSuccess"></sys-login>
    </div>
  </div>
</template>
<script>
import SysLogin from './components/SysLogin'
export default {
  name: 'login',
  data () {
    return {}
  },
  components: { SysLogin },
  methods: {
    // 处理登录成功后逻辑，跳转页面等
    handleLoginSuccess (token) {
      this.$store.dispatch('SaveToken', token).then(() => {
        // 加载动态陆由
        this.$router.push({ path: '/projects' })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.login_container {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: $background_color;
  .login_main {
    position: absolute;
    top: 20%;
    left: 40%;
    width: 20%;
    border: #E4E7ED solid 1px;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 30px;
    .login_title {
      font-size: 24px;
      font-weight: 600;
      text-align: center;
      margin-bottom: 30px;
    }
  }
}
</style>
