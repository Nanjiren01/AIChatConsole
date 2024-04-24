
import request from '@/utils/request'

export function getBalancesByUserId(userId, page, size) {
  return request({
    url: `/balances/${userId}?page=${page}&size=${size}`,
    method: 'get'
  })
}

export function getBalanceRecordByUserId(userId, page, size) {
  return request({
    url: `/balances/${userId}/records?page=${page}&size=${size}`,
    method: 'get',
    params: {}
  })
}

export function setEnable(balanceId) {
  return request({
    url: '/balances/' + balanceId + '/enable',
    method: 'put'
  })
}

export function setDisable(balanceId) {
  return request({
    url: '/balances/' + balanceId + '/disable',
    method: 'put'
  })
}

export function increaseBalance(userId, balanceId, type, count) {
  return request({
    url: '/balances/increase',
    method: 'post',
    params: {},
    data: {
      userId, type, count, balanceId
    }
  })
}

export function addPackage(userId, packageId) {
  return request({
    url: '/balances/addPackage',
    method: 'post',
    data: {
      userId, packageId
    }
  })
}

export function updateExpireTime(balanceId, days, expireTime) {
  return request({
    url: '/balances/extend',
    method: 'post',
    data: {
      balanceId, days, newExpireTime: expireTime
    }
  })
}
