import request from '@/utils/request'

export function getLogins(params) {
  return request({
    url: '/login',
    method: 'get',
    params
  })
}
