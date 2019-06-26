import request from '@/axios/request'

export function sysUserLogin (username, password, remeberMe) {
  const data = {
    'username': username,
    'password': password,
    'remeberMe': remeberMe,
    'grant_type': 'password',
    'scope': 'all'
  }
  return request({
    url: '/upm/oauth/token',
    headers: {
      'Authorization': 'Basic aW50ZWdyYWwtZGV2b3BzOmludGVncmFsLWRldm9wcw=='
    },
    method: 'post',
    params: data
  })
}

export function getUserInfo () {
  return request({
    url: '/upm/user/me',
    method: 'get'
  })
}
