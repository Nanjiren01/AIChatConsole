
import request from '@/utils/request'

export function getApiKeys(params) {
  return request({
    url: '/apiKeys',
    method: 'get',
    params
  })
}
