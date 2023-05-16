
import request from '@/utils/request'

export function getAiModels(params) {
  return request({
    url: '/aiModels',
    method: 'get',
    params
  })
}
