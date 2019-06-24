const getters = {
  token: state => state.user.token,
  user_info: state => state.user.userInfo,
  add_routes: state => state.route.addRoutes,
  permit_routes: state => state.route.routes,
}
export default getters
