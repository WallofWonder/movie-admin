import request from '@/utils/request'

export function getMovies(query) {
  return request({
    url: 'http://localhost:8888/admin/movies/list?pageSize=' + query.pageSize + '&pageNum=' + query.pageNum + '&orderBy=' + query.orderBy + '&isShow=-1',
    method: 'get'
  })
}

export function refreshMovieData() {
  return request({
    url: 'http://localhost:8888/admin/movies/data',
    method: 'post'
  })
}

export function updateMovie(body) {
  body = JSON.stringify(body)
  console.log(body)
  return request({
    url: 'http://localhost:8888/admin/movies/update',
    method: 'post',
    data: body
  })
}
