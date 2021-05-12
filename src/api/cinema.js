import request from '@/utils/request'
import global from '@/utils/global'
const base_url = global.BASE_API

export function listbymovie(movieid) {
  return request({
    url: base_url + 'admin/cinemas/listbymovie',
    params: {
      movieid: movieid
    },
    method: 'get'
  })
}

export function list(data) {
  return request({
    url: base_url + 'admin/cinemas/list',
    params: {
      pageSize: data.pageSize,
      pageNum: data.pageNum,
      orderBy: data.orderBy,
      dbName: data.dbName,
      areaId: data.areaId
    },
    method: 'get'
  })
}

export function listByArea(areaid) {
  return request({
    url: base_url + 'admin/cinemas/listbyarea',
    params: {
      areaid: areaid
    },
    method: 'get'
  })
}

export function getCinema(cinemaid) {
  return request({
    url: base_url + 'admin/cinemas/details',
    params: {
      id: cinemaid
    },
    method: 'get'
  })
}

export function getCinemaAsync(cinemaId) {
  return new Promise((resolve, reject) => {
    getCinema(cinemaId).then(res => {
      resolve(res.data.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export function updateCinema(data) {
  data = JSON.stringify(data)
  return request({
    url: base_url + 'admin/cinemas/update',
    data: data,
    method: 'post'
  })
}
