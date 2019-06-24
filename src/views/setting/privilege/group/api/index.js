import request from '@/axios/request'

/**
 * 保存权限分组接口
 * @param {权限分组信息对象} menu
 */
export function savePrivilegeGroup (privilegeGroup) {
  return request({
    url: '/upm/privilege/group/savePrivilegeGroup.action',
    method: 'post',
    data: privilegeGroup
  })
}

/**
 * 删除权限分组
 * @param {权限分组ID} entityId
 */
export function deletePrivilegeGroup (privilegeGroupId) {
  let data = {
    privilegeGroupId: privilegeGroupId
  }
  return request({
    url: '/upm/privilege/group/deletePrivilegeGroup.action',
    method: 'delete',
    params: data
  })
}

/**
 * 分页查询权限分组信息
 * @param {权限分组名称} entityName
 * @param {页码} pageNum
 * @param {页长} pageSize
 */
export function selectPrivilegeGroups (privilegeGroupName, pageNum, pageSize) {
  let data = {
    privilegeGroupName: privilegeGroupName,
    pageNum: pageNum,
    pageSize: pageSize
  }
  return request({
    url: '/upm/privilege/group/selectPrivilegeGroups.action',
    method: 'get',
    params: data
  })
}
