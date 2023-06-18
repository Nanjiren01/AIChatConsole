
import request from '@/utils/request'

export function getAiPlatforms(params) {
  return request({
    url: '/aiPlatforms',
    method: 'get',
    params
  })
}

export function updateAiPlatform(params) {
  return request({
    url: '/aiPlatforms',
    method: 'put',
    data: params
  })
}

export function createAiPlatform(params) {
  return request({
    url: '/aiPlatforms',
    method: 'post',
    data: params
  })
}
