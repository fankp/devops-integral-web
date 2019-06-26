import request from '@/axios/request'

/**
 * 保存项目信息
 * @param {项目对象} project
 */
export function saveProject (project) {
  return request({
    url: '/upm/project/saveProject.action',
    method: 'post',
    data: project
  })
}

/**
 * 删除项目
 * @param {项目对象} project
 */
export function deleteProject (projId) {
  let data = {
    projId: projId
  }
  return request({
    url: '/upm/project/deleteProject.action',
    method: 'delete',
    params: data
  })
}

/**
 * 查询用户相关项目
 * @param {项目名称} projName
 */
export function selectUserProjects (projName, pageNum, pageSize) {
  let data = {
    projName: projName,
    pageNum: pageNum,
    pageSize: pageSize
  }
  return request({
    url: '/upm/project/selectUserProjects.action',
    method: 'get',
    params: data
  })
}

/**
 * 查询公开项目
 * @param {项目名称} projName
 */
export function selectPublicProjects (projName, pageNum, pageSize) {
  let data = {
    projName: projName,
    pageNum: pageNum,
    pageSize: pageSize
  }
  return request({
    url: '/upm/project/selectPublicProjects.action',
    method: 'get',
    params: data
  })
}

/**
 * 查询项目信息
 * @param {项目对象} projName
 * @param {项目类型} projType
 */
export function selectProjects (projName, pageNum, pageSize) {
  let data = {
    projName: projName,
    pageNum: pageNum,
    pageSize: pageSize
  }
  return request({
    url: '/upm/project/selectProjects.action',
    method: 'get',
    params: data
  })
}
