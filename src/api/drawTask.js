
import request from '@/utils/request'

export function getDrawTasks(params) {
  return request({
    url: '/draw/list',
    method: 'post',
    data: params
  })
}
