
import request from '@/utils/request'

export function getMasks() {
  return request({
    url: '/mask',
    method: 'get'
  })
}

export function createMask(mask) {
  return request({
    url: '/mask',
    method: 'post',
    data: mask
  })
}

export function updateMask(mask) {
  return request({
    url: '/mask',
    method: 'put',
    data: mask
  })
}

export function deleteMask(maskId) {
  return request({
    url: `/mask/${maskId}`,
    method: 'delete'
  })
}

export function toDraft(maskId) {
  return request({
    url: `/mask/${maskId}/toDraft`,
    method: 'put'
  })
}

export function toNormal(maskId) {
  return request({
    url: `/mask/${maskId}/toNormal`,
    method: 'put'
  })
}
