<template>
  <div>
    <div style="margin: 0 auto; width: 500px;">
      <el-form ref="form" :model="form" label-width="120px">
        <el-alert
          title="若记录聊天内容，请务必获得用户同意！"
          type="error"
          style="margin-bottom: 10px;"
          :closable="false"
        />
        <el-form-item label="记录聊天内容">
          <el-switch v-model="form.recordLog" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="loading" @click="handleSubmit">
            {{ loading ? '保存中……' : '提 交' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import { getChatConfig, saveChatConfig } from '@/api/globalConfig'

export default {
  name: 'ChatConfig',
  data() {
    return {
      loading: false,
      form: {
        recordLog: null
      }
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload() {
      this.loading = true
      getChatConfig().then(resp => {
        // console.log('resp', resp)
        const content = resp.data.chatContent
        this.form.recordLog = !!content.recordLog
      }).finally(() => {
        this.loading = false
      })
    },
    handleSubmit() {
      this.loading = true
      saveChatConfig({
        chatRecordLog: !!this.form.recordLog
      }).then(() => {
        this.$message.success('保存成功！')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
