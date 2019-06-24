<template>
  <el-row class="layout_container">
    <el-container>
      <!-- S 顶部菜单 -->
      <el-header class="layout_top">
        <div class="layout_top_logo"><span class="sys_name">一体化平台</span></div>
        <div class="toggle_menu_collapse" @click="handleToggleMenuCollapse">
          <i v-if="menuCollapsed" slot="prefix" class="iconfont icon_expand"></i>
          <i class="iconfont icon_collapse"></i>
        </div>
        <div class="layout_top_menu">
          <el-menu mode="horizontal"
          :default-active="activeTopMenu"
          background-color="rgb(58, 131, 228)"
          text-color="#fff"
          active-text-color="#fff">
            <template v-for="(item, index) in topMenus">
              <el-menu-item
                v-if="!item.hidden"
                @click="handleTopMenuSelect(item)"
                :index="item.path"
                :key="index">
                {{item.name}}
              </el-menu-item>
            </template>
          </el-menu>
        </div>
        <div class="layout_top_info">
          <el-dropdown class="user_info">
            <span class="user_name">
              <i class="iconfont icon_user"></i>
              {{ getUserName() }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人资料</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
       <!-- E 顶部菜单 -->
      <el-container class="layout_behind">
        <!-- S 侧边菜单 -->
        <el-aside width="200px" class="layout_aside_menu">
          <el-menu mode="vertical" :collapse="menuCollapsed"
           :default-active="activeSideMenu"
           :collapse-transition="false" :router="true">
            <template v-for="(item, index) in sideMenus">
              <template v-if="item.children && item.children.length < 0">
                <el-submenu :key="index" v-if="!item.hidden">
                  <template slot="title">
                    <i :class="item.meta.iconClass" v-if="item.meta && item.meta.iconClass"></i>
                    <span>{{item.name}}</span>
                  </template>
                  <template v-for="(child, inx) in item.children">
                    <el-menu-item v-if="!child.hidden" :key="inx">
                      <span slot="title">{{child.name}}</span>
                    </el-menu-item>
                  </template>
                </el-submenu>
              </template>
              <template v-else>
                <el-menu-item :key="index" v-if="!item.hidden" :index="item.path">
                  <i :class="item.meta.iconClass" v-if="item.meta && item.meta.iconClass"></i>
                  <span slot="title">{{item.name}}</span>
                </el-menu-item>
              </template>
            </template>
          </el-menu>
        </el-aside>
        <!-- E 侧边菜单 -->
        <!-- S 主页面 -->
        <el-main class="layout_main" :style="menuCollapsed ? 'left: 64px': 'left: 200px'">
          <transition name="fade" mode="out-in">
            <router-view/>
          </transition>
        </el-main>
        <!-- E 主页面 -->
      </el-container>
    </el-container>
  </el-row>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: 'layout',
  data () {
    return {
      menuCollapsed: false,
      topMenus: [],
      sideMenus: [],
      activeTopMenu: '',
      activeSideMenu: ''
    }
  },
  computed: {
    ...mapGetters(["permit_routes", "user_info"])
  },
  methods: {
    handleToggleMenuCollapse () {
      this.menuCollapsed = !this.menuCollapsed
    },
    initMenus () {
      this.topMenus = this.permit_routes
      let currentPath = this.$route.path
      this.topMenus.forEach(each => {
        if (each.children) {
          each.children.forEach(item => {
            if (item.path) {
              // 从路由表中获取全路径，如果以/开头则直接进行匹配，否则拼接父陆由与子路由地址
              let tempPath = item.path.startsWith('/') ? item.path : each.path + '/' + item.path
              if (currentPath === tempPath) {
                this.activeTopMenu = each.path
                this.sideMenus = each.children
                this.activeSideMenu = item.path
              }
            }
          })
        }
      })
    },
    handleTopMenuSelect (menu) {
      this.sideMenus = menu.children
    },
    getUserName() {
      if (this.user_info) {
        let userInfo = JSON.parse(this.user_info);
        return userInfo.userName;
      } else {
        return "";
      }
    },
    handleLogout() {
      this.$store.dispatch("Logout").then(() => {
        this.$store.dispatch("RemoveRoute").then(() => {
          this.$router.push({ path: "/", replace: true });
        });
      });
    }

  },
  mounted () {
    this.initMenus()
  }
}
</script>
<style lang="scss" scoped>
.layout_container {
  height: 100%;
  .el-container {
  height: 100%;
  }
  .layout_top {
    position: fixed;
    width: 100%;
    background-color: rgb(58, 131, 228);
    height: 60px;
    line-height: 60px;
    font-size: 20px;
    color: #fff;
    .layout_top_logo {
      width: 200px;
      float: left;
      .sys_name {
        padding-left: 20px;
      }
    }
    .toggle_menu_collapse {
      width: 20px;
      float: left;
      text-align: center;
      cursor: pointer;
    }
    .layout_top_menu {
      width: calc(100% - 200px - 150px - 20px);
      float: left;
    }
    .layout_top_info{
      width: 150px;
      float: right;
      .user_info {
        float: right;
        right: 20px;
        .user_name {
          color: #fff;
        }
      }
    }
    padding: 0;
  }
  .layout_behind {
    position: fixed;
    top: 60px;
    width: 100%;
    .layout_aside_menu {
      background-color: rgb(255, 255, 255);
      border-right: solid 1px #e6e6e6;
      ul {
        border: none;
      }

    }
    .layout_main {
      position: absolute;
      height: 100%;
      bottom: 0;
      overflow: auto;
      right: 0;
      padding: 20px 20px 80px 20px;
      background-color: $background_color;
    }
  }
}
</style>
