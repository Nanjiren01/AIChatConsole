<template>
  <div class="page-container">
    <div style="text-align: center;margin-top: 50px;">

      <div style="margin: 20px">
        <img src="@/assets/ai-chat-bot.png" width="120">
      </div>
      <div style="font-size: 14px; line-height: 20px; ">
        <div>Admin：v{{ version }}</div>
        <div>Console: v0.9.2</div>
      </div>
    </div>
  </div>
</template>

<script>

import { getInfo } from '@/api/info'

export default {
  name: 'About',
  data() {
    return {
      version: null
    }
  },
  created() {
    getInfo().then(resp => {
      // console.log('resp', resp.data)
      const data = resp.data
      this.version = data.version
    })
  }
}
</script>
<style lang="scss" scoped>
  .page-container {
    padding: 10px;
  }

  </style>
