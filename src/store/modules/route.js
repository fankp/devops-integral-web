import {
  constantRouter, asyncRouter
} from '@/router'
import {
  selectPermitMenuWithEntity
} from '@/views/setting/menu/api'

function filterRoute(routes, menus) {
  let result = []
  routes.forEach(each => {
    let route = { ...each }
    let menu = matchRouteMenu(route.path, menus)
    let flag = false
    if (menu) {
      flag = true
      if (route.meta) {
        route.meta.entities = menu.entities
      } else {
        route.meta = {
          "entities": menu.entities
        }
      }
    }
    if (route.children) {
      let children = filterRoute(route.children, menus)
      route.children = children
    }
    if (flag || (route.children && route.children.length > 0)) {
      result.push(route)
    }
  })
  return result
}

function matchRouteMenu(path, menus) {
  for (var i=0; i<menus.length; i++) {
    if (path === menus[i].menuUrl) {
      return menus[i];
    }
  }
}

const route = {
  state: {
    routes: constantRouter,
    addRoutes: []
  },
  mutations: {
    SET_ROUTE: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRouter.concat(routes)
    },
    REMOVE_ROUTE: (state) => {
      state.routes = constantRouter
      state.addRoutes = []
    }
  },
  actions: {
    GenerateRoutes ({
      commit
    }) {
      return new Promise(resolve => {
        selectPermitMenuWithEntity().then(res => {
          let menus = res.data
          let routes = filterRoute(asyncRouter, menus)
          commit('SET_ROUTE', routes)
          resolve(routes)
        })
      })
    },
    RemoveRoute ({
      commit
    }) {
      return new Promise(resolve => {
        commit('REMOVE_ROUTE')
        resolve()
      })
    }
  }
}

export default route
