import request from '@/axios/request'

/**
 * 保存角色接口
 * @param {角色信息对象} menu
 */
export function saveRole (role) {
  return request({
    url: '/upm/role/saveRole.action',
    method: 'post',
    data: role
  })
}

/**
 * 删除角色
 * @param {角色ID} roleId
 */
export function deleteRole (roleId) {
  let data = {
    roleId: roleId
  }
  return request({
    url: '/upm/role/deleteRole.action',
    method: 'delete',
    params: data
  })
}

/**
 * 查询角色信息
 * @param {角色名称} roleName
 */
export function selectRoles (roleName) {
  let data = {
    roleName: roleName
  }
  return request({
    url: '/upm/role/selectRoles.action',
    method: 'get',
    params: data
  })
}

/**
 * 查询角色授权下信息
 * @param {角色ID} roleId
 */
export function selectPrivilegeGroupsWithPrivilege (roleId) {
  let data = {
    roleId: roleId
  }
  return request({
    url: '/upm/privilege/group/selectPrivilegeGroupsWithPrivilege.action',
    method: 'get',
    params: data
  })
}

/**
 * 给角色赋权
 * @param {角色ID} roleId
 * @param {权限ID} privilegeIds
 */
export function accessRole (roleId, privilegeIds) {
  let params = {
    roleId: roleId
  }
  return request({
    url: '/upm/role/accessRole.action',
    method: 'post',
    params: params,
    data: privilegeIds
  })
}
