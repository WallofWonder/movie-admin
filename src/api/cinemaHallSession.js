import request from '@/utils/request'
import global from '@/utils/global'

const base_url = global.BASE_API

export function getShowDatesAdmin(cinemaid) {
  return request({
    url: base_url + 'admin/hallsession/admin/showdates',
    params: {
      cinemaid: cinemaid
    },
    method: 'get'
  })
}

export function getShowSession(data) {
  data = JSON.stringify(data)
  return request({
    url: base_url + 'admin/hallsession/show',
    method: 'post',
    data: data
  })
}

export function getHallSession(id) {
  return request({
    url: base_url + 'admin/hallsession/getby',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function getHallSessionAsync(id) {
  return new Promise((resolve, reject) => {
    getHallSession(id).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export function getSessions(data, page) {
  data = JSON.stringify(data)
  return request({
    url: base_url + 'admin/hallsession/admin/show',
    method: 'post',
    data: data,
    params: {
      pageSize: page.pageSize,
      pageNum: page.pageNum,
      orderBy: page.orderBy
    }
  })
}
