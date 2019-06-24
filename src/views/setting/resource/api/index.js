import request from '@/axios/request'

/**
 * 保存资源接口
 * @param {资源信息对象} resource
 */
export function saveResource (resource) {
  return request({
    url: '/upm/resource/saveResource.action',
    method: 'post',
    data: resource
  })
}

/**
 * 删除资源
 * @param {资源ID} resourceId
 */
export function deleteResource (resourceId) {
  let data = {
    resourceId: resourceId
  }
  return request({
    url: '/upm/resource/deleteResource.action',
    method: 'delete',
    params: data
  })
}

/**
 * 分页查询资源信息
 * @param {资源名称} resourceName
 * @param {资源地址} resourceUrl
 * @param {页码} pageNum
 * @param {页长} pageSize
 */
export function selectResources (resourceName, resourceUrl, pageNum, pageSize) {
  let data = {
    resourceName: resourceName,
    resourceUrl: resourceUrl,
    pageNum: pageNum,
    pageSize: pageSize
  }
  return request({
    url: '/upm/resource/selectResources.action',
    method: 'get',
    params: data
  })
}
