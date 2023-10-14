<template>
  <div class="page-container">
    <div style="text-align: center;margin-top: 50px;">

      <div style="margin: 20px">
        <img src="@/assets/chat-mj-bot.png" width="120">
      </div>
      <div style="font-size: 14px; line-height: 20px; ">
        <div>Admin：v{{ version }}</div>
        <div>Console: v0.9.5-chatmj</div>
      </div>
      <div v-html="about" />
    </div>
  </div>
</template>

<script>

import { getInfo } from '@/api/info'
import axios from 'axios'

export default {
  name: 'About',
  data() {
    return {
      version: null,
      about: null
    }
  },
  created() {
    getInfo({ version: 'v0.9.5-chatmj' }).then(resp => {
      // console.log('resp', resp.data)
      const data = resp.data
      this.version = data.version
    })
    axios.get('//center.nanjiren.online/prod-api/info/aboutChatMJ')
      .then(resp => {
        // console.log('resp.data', resp.data)
        const data = resp.data
        if (data?.code !== 0) {
          this.about = `<div style="margin: 20px;">
            <span style="padding: 8px 16px; box-sizing: border-box;border-radius: 4px;position: relative;background-color: #fef0f0;color:#f56c6c;overflow: hidden;opacity: 1;display: flex;align-items: center;transition: opacity .2s;font-size: 13px;line-height: 18px;">
            无法连接center服务器：${resp.data?.message || '原因未知'}
            </span>
            </div>`
          return
        }
        this.about = data?.data?.about || ''
      }).catch(e => {
        console.error(e)
        this.about = `<div style="margin: 20px;">
            <span style="padding: 8px 16px; box-sizing: border-box;border-radius: 4px;position: relative;background-color: #fef0f0;color:#f56c6c;overflow: hidden;opacity: 1;display: flex;align-items: center;transition: opacity .2s;font-size: 13px;line-height: 18px;">
            无法连接center服务器：${e || '原因未知'}
            </span>
            </div>`
      })
  }
}
</script>
<style lang="scss" scoped>
  .page-container {
    padding: 10px;
  }

  </style>
