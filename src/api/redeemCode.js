
import request from '@/utils/request'

export function getRedeemCodes(params) {
  return request({
    url: '/redeemCode',
    method: 'get',
    params
  })
}

export function batchCreate(code) {
  return request({
    url: '/redeemCode',
    method: 'post',
    data: code
  })
}

export function batchDelete(codeIds) {
  return request({
    url: '/redeemCode',
    method: 'delete',
    data: {
      ids: codeIds
    }
  })
}

export function batchCancel(codeIds) {
  return request({
    url: '/redeemCode/cancel',
    method: 'post',
    data: {
      ids: codeIds
    }
  })
}

export function batchNormal(codeIds) {
  return request({
    url: '/redeemCode/normal',
    method: 'post',
    data: {
      ids: codeIds
    }
  })
}

export function redeemBack(key, userId) {
  return request({
    url: '/redeemCode/redeemBack',
    method: 'post',
    data: {
      key, userId
    }
  })
}
