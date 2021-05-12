import request from '@/utils/request'
import global from '@/utils/global'

const base_url = global.BASE_API

export function listAccount(query) {
  return request({
    url: base_url + 'account/list',
    params: {
      pageSize: query.pageSize,
      pageNum: query.pageNum,
      orderBy: query.orderBy
    },
    method: 'get'
  })
}

export function updateAccount(data) {
  data = JSON.stringify(data)
  return request({
    url: base_url + 'account/update',
    data: data,
    method: 'post'
  })
}
