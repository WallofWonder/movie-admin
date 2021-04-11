import request from '@/utils/request'

export function getAllAreas() {
  return request({
    url: 'http://localhost:8888/admin/areas/list',
    method: 'get'
  })
}

export function fetchList(query) {
  return request({
    url: 'http://localhost:8888/admin/areas/list?pageSize=' + query.pageSize + '&pageNum=' + query.pageNum + '&orderBy=' + query.orderBy,
    method: 'get'
  })
}
