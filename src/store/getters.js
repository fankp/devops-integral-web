const getters = {
  token: state => state.token.token,
  privielges: state => state.privilege.privielges,
  routeInited: state => state.privilege.routeInited,
  dynamicRoutes: state => state.privilege.dynamicRoutes,
}

export default getters
