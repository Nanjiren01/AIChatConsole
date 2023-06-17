
import request from '@/utils/request'

export function getOrders(params) {
  return request({
    url: '/order/all',
    method: 'get',
    params
  })
}
