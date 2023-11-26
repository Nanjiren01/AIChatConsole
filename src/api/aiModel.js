
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

export function deleteAiModel(id) {
  return request({
    url: '/aiModels/' + id,
    method: 'delete'
  })
}

export function getGlobalModels() {
  return request({
    url: '/globalModels/all',
    method: 'get'
  })
}

export function createGlobalModel(model) {
  return request({
    url: '/globalModels',
    method: 'post',
    data: model
  })
}

export function deleteGlobalModel(uuid) {
  return request({
    url: '/globalModels/' + uuid,
    method: 'delete'
  })
}
