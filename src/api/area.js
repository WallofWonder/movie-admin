import request from '@/utils/request'

export function getAllAreas() {
  return request({
    url: 'http://localhost:8888/admin/areas/list',
    method: 'get'
  })
}
