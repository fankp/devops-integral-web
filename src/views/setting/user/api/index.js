import request from '@/axios/request'

/**
 * 保存用户信息
 * @param {用户信息对象} user
 */
export function saveUser (user) {
  return request({
    url: '/upm/user/saveUser.action',
    method: 'post',
    data: user
  })
}

/**
 * 删除用户
 * @param {用户ID} userId
 */
export function deleteUser (userId) {
  let data = {
    userId: userId
  }
  return request({
    url: '/upm/user/deleteUser.action',
    method: 'delete',
    params: data
  })
}

/**
 * 分页查询用户信息
 * @param {用户名称} userName
 * @param {用户账号} userAcct
 * @param {页码} pageNum
 * @param {页长} pageSize
 */
export function selectUsers (userName, userAcct, pageNum, pageSize) {
  let data = {
    userAcct: userAcct,
    userName: userName,
    pageNum: pageNum,
    pageSize: pageSize
  }
  return request({
    url: '/upm/user/selectUsers.action',
    method: 'get',
    params: data
  })
}
