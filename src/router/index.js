import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress style
import Layout from '@/views/layout/index'

Vue.use(Router)

const _import = (file) => () => import(`@/views/${file}`)

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

// 静态路由，不需要权限管控，不存在菜单
export const constantRouter = [
  {
    path: '/',
    component: _import('login/index'),
    hidden: true
  }
]
// 动态路由，需要根据用户权限动态创建或需要有菜单
export const asyncRouter = [
  {
    path: '/projects',
    name: '项目',
    component: Layout,
    redirect: '/projects/index',
    children: [
      {
        path: '/projects/index',
        name: '项目',
        component: _import('project/index'),
        hidden: true
      }
    ]
  },
  {
    path: '/settings',
    name : '系统设置',
    component: Layout,
    children: [
      {
        path: '/settings/privilege',
        name: '权限管理',
        component: _import('settings/privilege/index'),
        meta: {
          // require: [],
          icon: 'el-icon-key'
        }
      },
      {
        path: '/settings/role',
        name: '角色管理',
        component: _import('settings/role/index'),
        meta: {
          require: ['role:select'],
          icon: 'el-icon-s-custom'
        }
      }
    ]
  }
]
const RouterConfig = {
  routes: constantRouter
}
export const router = new Router(RouterConfig)

// 路由拦截器，用于获取用户信息，页面拦截
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.path === '/') {
    // 调用退出登录
    // 调用退出登录
    store.dispatch('Logout').then(() => {
      NProgress.done()
      next()
    })
  } else {
    // 判断是否已经登录
    let token = store.getters.token
    if (token) {
      // token存在，进行判断是否需要重新加载路由
      if (!store.getters.routeInited) {
        store.dispatch('GenerateRoutes').then(res => {
          router.addRoutes(res)
          NProgress.done()
          next({ ...to, replace: true })
        })
      } else {
        NProgress.done()
        next()
      }
    } else {
      next(`/?callBack=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
