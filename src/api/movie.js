import request from '@/utils/request'
import global from '@/utils/global'
const base_url = global.BASE_API

export function getMovies(query) {
  var byName = (query.searchByName === '' || query.searchByName === null) ? '' : query.searchByName
  return request({
    url: base_url + 'admin/movies/list',
    params: {
      pageSize: query.pageSize,
      pageNum: query.pageNum,
      orderBy: query.orderBy,
      dbname: byName
    },
    method: 'get'
  })
}

export function refreshMovieData() {
  return request({
    url: base_url + 'admin/movies/data',
    method: 'post'
  })
}

export function updateMovie(body) {
  body = JSON.stringify(body)
  console.log(body)
  return request({
    url: base_url + 'admin/movies/update',
    method: 'post',
    data: body
  })
}

export function listByCinema(cinemaId) {
  return request({
    url: base_url + 'admin/movies/listbycinema',
    params: {
      cinemaid: cinemaId
    },
    method: 'get'
  })
}
