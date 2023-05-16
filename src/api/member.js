
import request from '@/utils/request'

export function getMembers(params) {
  return request({
    url: '/members',
    method: 'get',
    params
  })
}
