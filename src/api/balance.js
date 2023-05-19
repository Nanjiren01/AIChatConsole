
import request from '@/utils/request'

export function getBalanceRecordByUserId(userId) {
  return request({
    url: '/balances/' + userId + '/records',
    method: 'get',
    params: {}
  })
}

export function increaseBalance(userId, type, count) {
  return request({
    url: '/balances/increase',
    method: 'post',
    params: {},
    data: {
      userId, type, count
    }
  })
}
