import axios from 'axios'
import store from '../store'
import {
  Message
} from 'element-ui'

// 从对应环境参数中获取请求根路径
export const baseURL = process.env.VUE_APP_BASE_API
axios.defaults.withCredentials = false
export const service = axios.create({
  baseURL: baseURL,
  // 请求超时时间，单位毫秒
  timeout: 10000
})

// request interceptor
service.interceptors.request.use(
  config => {
    let token = store.getters.token
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = token
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
        // 服务异常
      } else if (status === 401) {
        Message.error({
          showClose: true,
          message: message
        })
        // 跳转到登录页面
        this.$route.push('/')
      } else if (status === 503) {
        Message.error({
          showClose: true,
          message: message
        })
        // 服务不可用
      }
    }
    return Promise.reject(error)
  }
)

export default service
