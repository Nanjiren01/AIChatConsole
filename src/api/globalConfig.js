import request from '@/utils/request'

export function getWebsiteConfig() {
  return request({
    url: '/globalConfig/website',
    method: 'get'
  })
}

export function saveWebsiteConfig(content) {
  return request({
    url: '/globalConfig',
    method: 'post',
    data: {
      type: 'Website',
      ...content
    }
  })
}

export function getEmailConfig() {
  return request({
    url: '/globalConfig/email',
    method: 'get'
  })
}

export function saveEmailConfig(content) {
  return request({
    url: '/globalConfig',
    method: 'post',
    data: {
      type: 'Email',
      ...content
    }
  })
}

export function getRegisterQuotaConfig() {
  return request({
    url: '/globalConfig/registerQuota',
    method: 'get'
  })
}

export function saveRegisterQuotaConfig(content) {
  return request({
    url: '/globalConfig',
    method: 'post',
    data: {
      type: 'RegisterQuota',
      ...content
    }
  })
}

export function getSensitiveWordsConfig() {
  return request({
    url: '/globalConfig/sensitiveWords',
    method: 'get'
  })
}

export function saveSensitiveWordsConfig(content) {
  return request({
    url: '/globalConfig',
    method: 'post',
    data: {
      type: 'SensitiveWords',
      ...content
    }
  })
}
