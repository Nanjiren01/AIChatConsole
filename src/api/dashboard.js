
import request from '@/utils/request'

export function getBasic(userId) {
  return request({
    url: '/dashboard/basic',
    method: 'get',
    params: {}
  })
}
