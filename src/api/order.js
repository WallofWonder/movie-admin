import request from '@/utils/request'
import global from '@/utils/global'
const base_url = global.BASE_API
export function initOrder(data) {
  data = JSON.stringify(data)
  return new Promise((resolve, reject) => {
    request({
      url: base_url + 'orders/initOrder',
      method: 'post',
      data: data
    }).then(res => {
      resolve(res.data.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export function getOrderInfo(orderId) {
  return new Promise((resolve, reject) => {
    request({
      url: base_url + 'orders/orderInfo',
      method: 'get',
      params: {
        orderId: orderId
      }
    }).then(res => {
      resolve(res.data.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export function pay(orderId) {
  return new Promise((resolve, reject) => {
    request({
      url: base_url + 'orders/pay',
      method: 'post',
      params: {
        orderId: orderId
      }
    }).then(res => {
      resolve(res.data.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export function listOrderByAccount(accountId) {
  return request({
    url: base_url + 'orders/listByAccount',
    method: 'get',
    params: {
      accountId: accountId
    }
  })
}

export function refund(data) {
  return request({
    url: base_url + 'orders/refund',
    method: 'post',
    params: {
      orderId: data.orderId,
      money: data.money
    }
  })
}

export function cancel(orderId) {
  return request({
    url: base_url + 'orders/cancel',
    method: 'post',
    params: {
      orderId: orderId
    }
  })
}

export function list(query) {
  return request({
    url: base_url + 'orders/admin/list',
    method: 'get',
    params: {
      pageSize: query.pageSize,
      pageNum: query.pageNum,
      orderBy: query.orderBy,
      accountId: query.accountId
    }
  })
}

export function deleteOrder(orderId) {
  return request({
    url: base_url + 'orders/delete',
    method: 'delete',
    params: {
      orderId: orderId
    }
  })
}
