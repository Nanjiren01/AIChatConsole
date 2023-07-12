
import request from '@/utils/request'

export function getLogs(params) {
  return request({
    url: '/chat/log',
    method: 'get',
    params
  })
}

