import request from '@/axios/request'

export function sysUserLogin (username, password, remeberMe) {
  const data = {
    'username': username,
    'password': password,
    'remeberMe': remeberMe,
  }
  return request({
    url: '/upm/v1/user/login',
    method: 'post',
    params: data
  })
}
