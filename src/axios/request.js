import axios from 'axios'
import store from '../store'
import {
  Message
} from 'element-ui'

export const baseURL = process.env.VUE_APP_BASE_API
axios.defaults.withCredentials = false
export const service = axios.create({
  baseURL: baseURL,
  timeout: 100000
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (sessionStorage.getItem('token') && !config.headers['Authorization']) {
      let token = JSON.parse(store.getters.token)
      if (token.value) {
        config.headers['Authorization'] = 'Bearer ' + token.value
      }
    }
    return config
  },
  error => {
    // Do something with request error
    Promise.reject(error)
  }
)

// respone interceptor
service.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      let status = error.response.status
      let message = error.response.data.message
      if (status === 500) {
        Message.error({
          showClose: true,
          message: message
        })
      } else if (status === 401) {
        Message.error({
          showClose: true,
          message: message
        })
      } else if (status === 503) {
        Message.error({
          showClose: true,
          message: message
        })
      }
    }
    return Promise.reject(error)
  }
)

export default service
