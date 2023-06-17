
import request from '@/utils/request'

export function getOrders(params) {
  return request({
    url: '/order/all',
    method: 'post',
    data: params
  })
}

export function cancelOrder(uuid) {
  return request({
    url: '/order/cancel?uuid=' + uuid,
    method: 'put'
  })
}

export function deleteOrder(uuid) {
  return request({
    url: '/order/' + uuid,
    method: 'delete'
  })
}
