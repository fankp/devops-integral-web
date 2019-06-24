import request from '@/axios/request'

/**
 * 保存权限实体接口
 * @param {权限实体信息对象} menu
 */
export function saveEntity (entity) {
  return request({
    url: '/upm/entity/saveEntity.action',
    method: 'post',
    data: entity
  })
}

/**
 * 删除权限实体
 * @param {权限实体ID} entityId
 */
export function deleteEntity (entityId) {
  let data = {
    entityId: entityId
  }
  return request({
    url: '/upm/entity/deleteEntity.action',
    method: 'delete',
    params: data
  })
}

/**
 * 分页查询权限实体信息
 * @param {权限实体名称} entityName
 * @param {权限实体编码} entityCode
 * @param {页码} pageNum
 * @param {页长} pageSize
 */
export function selectEntities (entityName, entityCode, pageNum, pageSize) {
  let data = {
    entityName: entityName,
    entityCode: entityCode,
    pageNum: pageNum,
    pageSize: pageSize
  }
  return request({
    url: '/upm/entity/selectEntities.action',
    method: 'get',
    params: data
  })
}
