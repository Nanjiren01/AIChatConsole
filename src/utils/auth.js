import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

const UserKey = 'LSK-User-Entity'

export function getUser() {
  const user = sessionStorage.getItem(UserKey)
  return user ? JSON.parse(user) : user
}

export function setUser(user) {
  return sessionStorage.setItem(UserKey, JSON.stringify(user))
}

export function removeUser() {
  return sessionStorage.removeItem(UserKey)
}
