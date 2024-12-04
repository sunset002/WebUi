import request from '@/utils/request'

// 查询数据表格列表
export function listData(query) {
  return request({
    url: '/monitor/data/list',
    method: 'get',
    params: query
  })
}

// 查询数据表格详细
export function getData(id) {
  return request({
    url: '/monitor/data/' + id,
    method: 'get'
  })
}

// 新增数据表格
export function addData(data) {
  return request({
    url: '/monitor/data',
    method: 'post',
    data: data
  })
}

// 修改数据表格
export function updateData(data) {
  return request({
    url: '/monitor/data',
    method: 'put',
    data: data
  })
}

// 删除数据表格
export function delData(id) {
  return request({
    url: '/monitor/data/' + id,
    method: 'delete'
  })
}
