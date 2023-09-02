import request from '@/utils/request'

export function getAllPlugins(params) {
  return request({
    url: '/plugin/all',
    method: 'get',
    params
  })
}

export function togglePlugin(uuid, enable) {
  return request({
    url: '/plugin/toggle',
    method: 'put',
    data: {
      uuid, enable
    }
  })
}
