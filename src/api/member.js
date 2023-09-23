
import request from '@/utils/request'

export function getMembers(params) {
  return request({
    url: '/members',
    method: 'get',
    params
  })
}

export function getInviteInfo(userId) {
  return request({
    url: `/member/${userId}/invite`,
    method: 'get'
  })
}
