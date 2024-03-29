
import request from '@/utils/request'

export function getApiKeys(params) {
  return request({
    url: '/apiKeys',
    method: 'get',
    params
  })
}

export function storeApiKey(id, key, state, platformId) {
  return request({
    url: '/apiKeys',
    method: 'post',
    data: {
      id, key, state, platformId
    }
  })
}

export function deleteApiKey(id) {
  return request({
    url: '/apiKeys/' + id,
    method: 'delete'
  })
}
