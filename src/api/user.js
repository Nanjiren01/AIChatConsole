import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/adminLogin',
    method: 'post',
    data
  })
}

export function getUsers(params) {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}

export function getInfo(token) {
  return request({
    url: '/users/my',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function changePassword(userId, oldPassword, newPassword) {
  return request({
    url: '/users/changePassword',
    method: 'post',
    data: {
      userId, oldPassword, newPassword
    }
  })
}

export function enableUser(userId, enable) {
  return request({
    url: '/users/enable',
    method: 'post',
    data: {
      userId, enable
    }
  })
}

export function createUser(name, username, password) {
  return request({
    url: '/users',
    method: 'post',
    data: {
      name, username, password
    }
  })
}

export function createMember(member) {
  return request({
    url: '/member',
    method: 'post',
    data: member
  })
}
