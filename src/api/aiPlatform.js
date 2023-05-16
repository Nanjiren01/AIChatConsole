
import request from '@/utils/request'

export function getAiPlatforms(params) {
  return request({
    url: '/aiPlatforms',
    method: 'get',
    params
  })
}
