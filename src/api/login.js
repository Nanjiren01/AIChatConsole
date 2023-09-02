import request from '@/utils/request'

export function getLogins(params) {
  return request({
    url: '/login/record',
    method: 'get',
    params
  })
}
