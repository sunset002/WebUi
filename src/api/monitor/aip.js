import request from '@/utils/request'

// 查询数据查询列表
export function listAip(query) {
  return request({
    url: '/monitor/aip/list',
    method: 'get',
    params: query
  })
}

// 查询数据查询详细
export function getAip(materialId) {
  return request({
    url: '/monitor/aip/' + materialId,
    method: 'get'
  })
}

// 新增数据查询
export function addAip(data) {
  return request({
    url: '/monitor/aip',
    method: 'post',
    data: data
  })
}

// 修改数据查询
export function updateAip(data) {
  return request({
    url: '/monitor/aip',
    method: 'put',
    data: data
  })
}

// 删除数据查询
export function delAip(materialId) {
  return request({
    url: '/monitor/aip/' + materialId,
    method: 'delete'
  })
}
