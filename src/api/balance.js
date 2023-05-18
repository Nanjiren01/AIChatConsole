
import request from '@/utils/request'

export function getBalanceRecordByUserId(userId) {
  return request({
    url: '/balances/' + userId + '/records',
    method: 'get',
    params: {}
  })
}
