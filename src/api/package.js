
import request from '@/utils/request'

export function getPackages() {
  return request({
    url: '/package/all',
    method: 'get'
  })
}

export function createPackage(pkg) {
  return request({
    url: '/package',
    method: 'post',
    data: pkg
  })
}

export function updatePackage(pkg) {
  return request({
    url: '/package',
    method: 'put',
    data: pkg
  })
}

export function putOnSales(uuid) {
  return request({
    url: `/package/${uuid}/onSales`,
    method: 'put'
  })
}

export function putOffShelves(uuid) {
  return request({
    url: `/package/${uuid}/offShelves`,
    method: 'put'
  })
}

export function deletePackage(uuid) {
  return request({
    url: `/package/${uuid}`,
    method: 'delete'
  })
}

export function setTop(uuid) {
  return request({
    url: `/package/${uuid}/setTop`,
    method: 'put'
  })
}

export function cancelTop(uuid) {
  return request({
    url: `/package/${uuid}/cancelTop`,
    method: 'put'
  })
}
