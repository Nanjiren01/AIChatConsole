
import request from '@/utils/request'

export function getBalancesByUserId(userId) {
  return request({
    url: '/balances/' + userId,
    method: 'get',
    params: {}
  })
}

export function getBalanceRecordByUserId(userId) {
  return request({
    url: '/balances/' + userId + '/records',
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
