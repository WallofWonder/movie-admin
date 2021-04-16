import request from '@/utils/request'

export function getMovies(query) {
  return request({
    url: 'http://localhost:8888/admin/movies/list?pageSize=' + query.pageSize + '&pageNum=' + query.pageNum + '&orderBy=' + query.orderBy + '&isShow=-1',
    method: 'get'
  })
}

export function getMovieDetail(id) {
  return request({
    url: 'http://localhost:8888/admin/movies/detail?id=' + id,
    method: 'get'
  })
}

export function updateMovie(body) {
  return request({
    url: 'http://localhost:8888/admin/movies/update',
    method: 'post',
    body
  })
}
