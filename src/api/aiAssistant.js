
import request from '@/utils/request'

export function getAssistant(params) {
  return request({
    url: '/assistant/all',
    method: 'post',
    data: params
  })
}

export function createAssistant(params) {
  return request({
    url: '/assistant',
    method: 'post',
    data: params
  })
}

export function updateAssistant(uuid, params) {
  return request({
    url: '/assistant/' + uuid,
    method: 'put',
    data: params
  })
}

export function enableAssistant(uuid) {
  return request({
    url: `/assistant/${uuid}/normal`,
    method: 'post'
  })
}

export function disableAssistant(uuid) {
  return request({
    url: `/assistant/${uuid}/disable`,
    method: 'post'
  })
}
