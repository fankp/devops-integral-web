<template>
  <el-row>
    <el-container>
      <el-header class="layout_top">
        <div class="layout_top_logo">
          <span style="padding-left:20px">一体化平台</span>
        </div>
        <div v-if="asideMenus && asideMenus.length > 0" class="layout_top_collapse" @click="handleToggleMenuCollapse">
          <i v-if="isCollapse" slot="prefix" class="iconfont icon_expand"></i>
          <i v-else class="iconfont icon_collapse"></i>
        </div>
        <div class="layout_top_menu">
          <el-menu :background-color="theme.topMenuColor" :text-color="theme.topMenuTextColor"
           :active-text-color="theme.topMenuActiveColor" :default-active="topActive" :router="true" mode="horizontal">
           <template v-for="(item, index) in menus">
            <el-menu-item v-if="!item.hidden" :index="item.path" :key="index" @click="handleTopMenuSelect(item)">{{item.name}}</el-menu-item>
           </template>
          </el-menu>
        </div>
        <div class="layout_top_user">
          <el-dropdown style="padding-right:20px">
            <span class="user_name">
              <i class="iconfont icon_user"></i>
              {{ getUserInfo().ch_name }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人资料</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container class="layout_bottom">
        <el-aside v-if="asideMenus && asideMenus.length > 0" :class="isCollapse ? 'layout_aside layout_aside_collapse' : 'layout_aside'">
          <el-menu :background-color="theme.asideMenuColor" :text-color="theme.asideMenuTextColor" :active-text-color="theme.asideMenuActiveColor"
           :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="asideActive" mode="vertical">
            <template v-for="(item, index) in asideMenus">
              <template v-if="item.children">
                <el-submenu :key="index" :index="item.path">
                  <template slot="title">
                    <i :class="item.meta.icon"></i>
                    <span slot="title">{{ item.name }}</span>
                  </template>
                  <template v-for="(child, inx) in item.children">
                      <el-menu-item :index="child.path" v-if="!child.hidden" :key="inx">{{child.name}}</el-menu-item>
                  </template>
                </el-submenu>
              </template>
              <template v-else>
                <el-menu-item :index="item.path" :key="index">
                  <i :class="item.meta.icon" v-if="item.meta && item.meta.icon"></i>
                  <span slot="title">{{item.name}}</span>
                </el-menu-item>
              </template>
            </template>
          </el-menu>
        </el-aside>
        <el-main class="layout_main">
          <transition name="fade" mode="out-in">
            <router-view/>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </el-row>
</template>
<script>
import { mapGetters } from "vuex";
import style from '@/styles/variables.scss'
export default {
  name: "layout",
  data() {
    return {
      isCollapse: false,
      theme: {
        topMenuColor: style.top_menu_color,
        topMenuTextColor: style.top_menu_text_color,
        topMenuActiveColor: style.top_menu_active_color,
        asideMenuColor: style.aside_menu_color,
        asideMenuTextColor: style.aside_menu_text_color,
        asideMenuActiveColor: style.aside_menu_active_color
      },
      menus: [],
      asideMenus: [],
      topActive: '',
      asideActive: ''
    };
  },
  watch: {
    $route: "initMenus"
  },
  computed: {
    ...mapGetters(["dynamicRoutes", "token"])
  },
  methods: {
    initMenus() {
      this.menus = this.dynamicRoutes
      // 获取当前路由地址，根据当前路由地址找到当前所在的顶部菜单
      let currentPath = this.$route.path
      this.menus.forEach(each => {
        if (each.children) {
          each.children.forEach(child => {
            if (child.path === currentPath) {
              this.handleTopMenuSelect(each)
            }
          })
        }
      })
    },
    handleTopMenuSelect(menu) {
      this.topActive = menu.path
      let asideMenus = []
      // 过滤掉隐藏的路由
      menu.children.forEach(each => {
        if (!each.hidden) {
          asideMenus.push(each)
        }
      });
      this.asideMenus = asideMenus
      this.asideActive = this.$route.path
    },
    handleToggleMenuCollapse() {
      this.isCollapse = !this.isCollapse
    },
    getUserInfo() {
      if (this.token) {
        let userString = decodeURIComponent(escape(window.atob(this.token.split('.')[1])))
        return JSON.parse(userString)
      } else {
        return '';
      }
    }
  },
  mounted() {
    this.initMenus();
  }
};
</script>
<style lang="scss" scoped>
.layout_top {
  background-color: $top_menu_color;
  color: $top_menu_text_color;
  width: 100%;
  height: 60px;
  position: fixed;
  padding: 0;
  line-height: 60px;
  .layout_top_logo {
    // 顶部Logo
    line-height: 60px;
    float: left;
    width: 240px;
    font-size: 20px;
    font-weight: 600;
  }
  .layout_top_collapse {
    width: 20px;
    float: left;
    text-align: center;
    cursor: pointer;
  }
  .layout_top_menu {
    float: left;
  }
  .layout_top_user {
    float: right;
    .user_name {
      color: $top_menu_text_color;
    }
  }
}
.layout_bottom {
  position: fixed;
  top: 60px;
  overflow-y: auto;
  height: calc(100% - 60px);
  width: 100%;
  .layout_aside {
    // 侧边栏
    width: 240px !important;
    height: 100%;
    background-color: $aside_menu_color;
    color: $aside_menu_text_color;
    border-right: solid 1px #e6e6e6;
    ul {
      border: none;
    }
  }
  .layout_aside_collapse {
    width: 65px !important;
  }
  .layout_main {
    background-color: $background_color;
    height: 100%;
    width: 100%;
    padding: 15px;
  }
}
</style>
