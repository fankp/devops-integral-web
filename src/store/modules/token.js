const token = {
  state: {
    token: sessionStorage.token || ''
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    }
  },
  actions: {
    SaveToken ({
      commit
    }, token) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', token)
        sessionStorage.setItem('token', token)
        resolve()
      })
    },
    Logout () {
      return new Promise((resolve) => {
        sessionStorage.removeItem('token')
        resolve()
      })
    }
  }
}
export default token
