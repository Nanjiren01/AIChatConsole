
import request from '@/utils/request'

export function getRedeemCodes(params) {
  return request({
    url: '/redeemCode',
    method: 'get',
    params
  })
}

export function batchCreate({ channel, remark, state, count }) {
  return request({
    url: '/redeemCode',
    method: 'post',
    data: {
      channel, remark, state, count
    }
  })
}
