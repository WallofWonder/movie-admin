import request from '@/utils/request'
import global from '@/utils/global'

const base_url = global.BASE_API

export function getAllAreas() {
  return request({
    url: base_url + 'admin/areas/list',
    method: 'get'
  })
}

export function fetchList(query) {
  return request({
    url: base_url + 'admin/areas/list',
    params: {
      pageSize: query.pageSize,
      pageNum: query.pageNum,
      orderBy: query.orderBy
    },
    method: 'get'
  })
}
