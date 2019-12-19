import {
  constantRouter, asyncRouter
} from '@/router'
import {
  Message
} from 'element-ui'
import { userPrivileges } from '@/views/settings/privilege/api'

const privilege = {
  state: {
    // 用户用户的权限列表
    privielges: [],
    // 路由
    routes: constantRouter,
    // 动态路由（根据权限过滤）
    dynamicRoutes: [],
    // 状态标记，是否已经初始化过路由
    routeInited: false
  },
  mutations: {
    SET_PRIVILEGES: (state, privielges) => {
      state.privielges = privielges
    },
    SET_ROUTE: (state, routes) => {
      state.dynamicRoutes = routes
      state.routes = constantRouter.concat(routes)
    },
    REMOVE_ROUTE: (state) => {
      state.routes = constantRouter
      state.dynamicRoutes = []
    },
    Set_ROUTE_INITED: (state) => {
      state.routeInited = true
    }
  },
  actions: {
    GenerateRoutes({commit, projectId}) {
      return new Promise(resolve => {
        userPrivileges(projectId).then(res => {
          let resp = res.data
          if (resp.success) {
            // 保存权限用户权限信息到vuex
            let privileges = resp.data
            commit('SET_PRIVILEGES', privileges)
            // 根据用户权限信息过滤路由
            let routes = filterRoutes(privileges, asyncRouter)
            commit('SET_ROUTE', routes)
            // 设置已经初始化过
            commit('Set_ROUTE_INITED', true)
            resolve(routes)
          } else {
            Message.error({
              showClose: true,
              message: resp.message
            })
          }
        })
      })
    }
  }
}
function filterRoutes(privielges, routes) {
  let result = []
  routes.forEach(each => {
    let route = {...each}
    let flag = false
    if (route.children && route.children.length > 0) {
      let children = filterRoutes(privielges, route.children)
      route.children = children
      if (children.length > 0) {
        route.redirect = children[0].path
        flag = true
      }
    } else if (route.meta && route.meta.require) {
      for (const i in route.meta.require) {
        if (privielges.indexOf(route.meta.require[i]) > -1) {
          flag = true
          break
        }
      }
    } else {
      flag = true
    }
    if (flag) {
      result.push(route)
    }
  });
  return result
}
export default privilege
