import request from '@/axios/request'

export function userPrivileges (projectId) {
  let url = '/upm/v1/user/privileges/'
  if (projectId) {
    url = `${url}/${projectId}`
  }
  return request({
    url: url,
    method: 'get'
  })
}
