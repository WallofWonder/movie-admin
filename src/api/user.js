import request from '@/utils/request'
import global from '@/utils/global'
import md5 from 'js-md5'
const base_url = global.BASE_API

export function login(data) {
  data.pwd = md5(data.pwd)
  return request({
    url: base_url + 'user/login',
    params: {
      email: data.email,
      pwd: data.pwd
    },
    method: 'post'
  })
}

export function getInfo(token) {
  return request({
    url: base_url + 'user/info',
    params: {
      email: token
    },
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
