import request from '@/utils/request'
import global from '@/utils/global'
const base_url = global.BASE_API

export function listSeats(sessionId) {
  return request({
    url: base_url + 'seats/listSeats',
    params: {
      sessionId: sessionId
    },
    method: 'get'
  })
}

export function listSeatsAsync(sessionId) {
  return new Promise((resolve, reject) => {
    listSeats(sessionId).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export function listSeatsByOrder(orderId) {
  return new Promise((resolve, reject) => {
    request({
      url: base_url + 'seats/listSeatsByOrder',
      params: {
        orderId: orderId
      },
      method: 'get'
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
