
import request from '@/utils/request'

export function getAiModels(params) {
  return request({
    url: '/aiModels',
    method: 'get',
    params
  })
}

export function updateAiModel(params) {
  return request({
    url: '/aiModels',
    method: 'put',
    data: params
  })
}

export function createAiModel(params) {
  return request({
    url: '/aiModels',
    method: 'post',
    data: params
  })
}
