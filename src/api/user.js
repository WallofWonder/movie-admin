import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'http://localhost:8888/user/login?email=' + data.email + '&pwd=' + data.pwd,
    method: 'post'
  })
}

export function getInfo(token) {
  return request({
    url: 'http://localhost:8888/user/info?email=' + token,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
