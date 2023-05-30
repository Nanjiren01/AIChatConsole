<template>
  <div>
    <div style="margin: 0 auto;">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="tokens">
          <el-input-number v-model="form.tokens" />
        </el-form-item>
        <el-form-item label="普通聊天次数">
          <el-input-number v-model="form.chatCount" />
        </el-form-item>
        <el-form-item label="高级聊天次数">
          <el-input-number v-model="form.advancedChatCount" />
        </el-form-item>
        <el-form-item label="AI绘图次数">
          <el-input-number v-model="form.drawCount" />
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

import { getRegisterQuotaConfig, saveRegisterQuotaConfig } from '@/api/globalConfig'

export default {
  name: 'RegisterQuotaConfig',
  data() {
    return {
      loading: false,
      form: {
        tokens: 0,
        chatCount: 0,
        advancedChatCount: 0,
        drawCount: 0
      }
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload() {
      this.loading = true
      getRegisterQuotaConfig().then(resp => {
        // console.log('resp', resp)
        const content = resp.data.registerQuotaContent
        this.form.tokens = content.tokens
        this.form.chatCount = content.chatCount
        this.form.advancedChatCount = content.advancedChatCount
        this.form.drawCount = content.drawCount
      }).finally(() => {
        this.loading = false
      })
    },
    handleSubmit() {
      if (this.form.tokens < 0) {
        this.$message.error('tokens不能小于0')
        return
      }
      if (this.form.chatCount < 0) {
        this.$message.error('普通聊天次数不能小于0')
        return
      }
      if (this.form.advancedChatCount < 0) {
        this.$message.error('高级聊天次数不能小于0')
        return
      }
      if (this.form.drawCount < 0) {
        this.$message.error('AI绘画次数不能小于0')
        return
      }
      this.loading = true
      saveRegisterQuotaConfig({
        registerTokens: this.form.tokens,
        registerChatCount: this.form.chatCount,
        registerAdvancedChatCount: this.form.advancedChatCount,
        registerDrawCount: this.form.drawCount
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
