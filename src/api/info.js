
import request from '@/utils/request'

export function getInfo(params) {
  return request({
    url: '/info',
    method: 'get',
    params
  })
}
