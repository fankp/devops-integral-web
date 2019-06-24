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

export const constantRouter = [
  {
    path: '/',
    component: _import('login/index'),
    hidden: true
  },
  
]
export const asyncRouter = [
  {
    path: '/setting',
    name: '系统设置',
    component: Layout,
    redirect: '/setting/menu',
    children: [
      {
        path: '/setting/menu',
        name: '系统菜单',
        component: _import('setting/menu/index'),
        meta: {
          iconClass: 'el-icon-menu'
        }
      },
      {
        path: '/setting/entity',
        name: '权限实体',
        component: _import('setting/entity/index'),
        meta: {
          iconClass: 'el-icon-copy-document'
        }
      }, {
        path: '/setting/resource',
        name: '系统资源',
        component: _import('setting/resource/index'),
        meta: {
          iconClass: 'el-icon-link'
        }
      }, {
        path: '/setting/privilege',
        name: '系统权限',
        component: _import('setting/privilege/group/index'),
        meta: {
          iconClass: 'el-icon-s-platform'
        }
      }, {
        path: '/setting/role',
        name: '角色管理',
        component: _import('setting/role/index'),
        meta: {
          iconClass: 'el-icon-user'
        }
      }, {
        path: '/setting/user',
        name: '用户管理',
        component: _import('setting/user/index'),
        meta: {
          iconClass: 'el-icon-user-solid'
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
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if (to.path === '/') {
    // 调用退出登录
    store.dispatch('Logout').then(() => {
      NProgress.done()
      next()
    })
  } else {
    try {
      // 尝试获取用户信息，拦截未登录请求
      await store.dispatch('GeneratorUserInfo')
      let routes = store.getters.add_routes
      if (!routes || routes.length === 0) {
        let accessRoutes = await store.dispatch('GenerateRoutes')
        router.addRoutes(accessRoutes)
        NProgress.done()
        next({ ...to, replace: true })
      } else {
        NProgress.done()
        next()
      }
    }catch(error) {
      next(`/?callBack=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
