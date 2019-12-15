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
    Logout ({
      commit
    }) {
      return new Promise((resolve, reject) => {
        sessionStorage.removeItem('token')
        commit('SET_USER_INFO', '')
        resolve()
      })
    }
  }
}
export default token
