import {
  getUserInfo
} from '@/views/login/api'

const user = {
  state: {
    token: sessionStorage.token || '',
    userInfo: ''
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_CURRENT_PROJECT: (state, project) => {
      state.current_project = project
    }
  },
  actions: {
    SaveToken ({
      commit
    }, token) {
      return new Promise((resolve, reject) => {
        let tokenJson = JSON.stringify(token)
        commit('SET_TOKEN', tokenJson)
        sessionStorage.setItem('token', tokenJson)
        resolve()
      })
    },
    GeneratorUserInfo  ({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          const data = response.data
          commit('SET_USER_INFO', JSON.stringify(data))
          resolve()
        }).catch(error => {
          reject(error)
        })
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
export default user
