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
