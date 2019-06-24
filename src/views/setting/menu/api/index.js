import request from '@/axios/request'

/**
 * 保存菜单接口
 * @param {菜单信息对象} menu
 */
export function saveMenu (menu) {
  return request({
    url: '/upm/menu/saveMenu.action',
    method: 'post',
    data: menu
  })
}

/**
 * 删除菜单
 * @param {菜单ID} menuId
 */
export function deleteMenu (menuId) {
  let data = {
    menuId: menuId
  }
  return request({
    url: '/upm/menu/deleteMenu.action',
    method: 'delete',
    params: data
  })
}

/**
 * 分页查询菜单信息
 * @param {菜单名称} menuName
 * @param {菜单地址} menuUrl
 * @param {页码} pageNum
 * @param {页长} pageSize
 */
export function selectMenus (menuName, menuUrl, pageNum, pageSize) {
  let data = {
    menuName: menuName,
    menuUrl: menuUrl,
    pageNum: pageNum,
    pageSize: pageSize
  }
  return request({
    url: '/upm/menu/selectMenus.action',
    method: 'get',
    params: data
  })
}

/**
 * 查询当前用于允许访问的菜单信息
 */
export function selectPermitMenuWithEntity () {
  return request({
    url: '/upm/menu/selectPermitMenuWithEntity.action',
    method: 'get'
  })
}
