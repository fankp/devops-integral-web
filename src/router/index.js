import Vue from 'vue'
import Router from 'vue-router'
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
  }
]
export const asyncRouter = [
  {
    path: '/project',
    name: '项目',
    component: Layout,
    redirect: '/project/index',
    children: [
      {
        path: 'index',
        name: '项目',
        component: _import('project/index')
      }
    ]
  },
]
const RouterConfig = {
  routes: constantRouter.concat(asyncRouter)
}
export const router = new Router(RouterConfig)

// 路由拦截器，用于获取用户信息，页面拦截
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  NProgress.done()
  next()
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
