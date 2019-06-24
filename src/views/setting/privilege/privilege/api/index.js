import request from '@/axios/request'

/**
 * 保存权限接口
 * @param {权限信息对象} menu
 */
export function savePrivilege (privilegeGroup) {
  return request({
    url: '/upm/privilege/savePrivilege.action',
    method: 'post',
    data: privilegeGroup
  })
}

/**
 * 删除权限
 * @param {权限ID} entityId
 */
export function deletePrivilege (privilegeId) {
  let data = {
    privilegeId: privilegeId
  }
  return request({
    url: '/upm/privilege/deletePrivilege.action',
    method: 'delete',
    params: data
  })
}

/**
 * 分页查询权限信息
 * @param {权限名称} privilegeName
 * @param {权限组ID} privilegeGroupId
 * @param {页码} pageNum
 * @param {页长} pageSize
 */
export function selectPrivileges (privilegeName, privilegeGroupId, pageNum, pageSize) {
  let data = {
    privilegeName: privilegeName,
    privilegeGroupId: privilegeGroupId,
    pageNum: pageNum,
    pageSize: pageSize
  }
  return request({
    url: '/upm/privilege/selectPrivileges.action',
    method: 'get',
    params: data
  })
}
