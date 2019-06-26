const getters = {
  token: state => state.user.token,
  user_info: state => state.user.userInfo,
  project: state => state.user.project,
  add_routes: state => state.route.addRoutes,
  permit_routes: state => state.route.routes,
}
export default getters
