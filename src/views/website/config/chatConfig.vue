<template>
  <div>
    <div style="margin: 0 auto; width: 500px;">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="默认Prompt">
          <el-input v-model="form.defaultSystemTemplate" :disabled="loading" />
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
        defaultSystemTemplate: null
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
        this.form.defaultSystemTemplate = content.defaultSystemTemplate
      }).finally(() => {
        this.loading = false
      })
    },
    handleSubmit() {
      this.loading = true
      saveChatConfig({
        defaultSystemTemplate: this.form.defaultSystemTemplate
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
