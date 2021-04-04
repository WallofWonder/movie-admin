import request from '@/utils/request'

export function getProvince() {
  return request({
    url: 'http://localhost:8888/admin/areas/province/list',
    method: 'get'
  })
}
