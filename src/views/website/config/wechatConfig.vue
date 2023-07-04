<template>
  <div>
    <div style="margin: 0 auto; width: 500px;">
      <el-form ref="form" :model="form" label-width="180px">
        <el-form-item label="AppId">
          <el-input v-model="form.appId" />
        </el-form-item>
        <el-form-item label="AppSecret">
          <el-input v-model="form.appSecret" type="password" />
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

import { getWechatConfig, saveWechatConfig } from '@/api/globalConfig'

export default {
  name: 'WechatConfig',
  data() {
    return {
      loading: false,
      form: {
        appId: '',
        appSecret: ''
      }
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload() {
      this.loading = true
      getWechatConfig().then(resp => {
        // console.log('resp', resp)
        const content = resp.data.wechatContent
        this.form.appId = content.appId
        this.form.appSecret = content.appSecret
      }).finally(() => {
        this.loading = false
      })
    },
    handleSubmit() {
      this.loading = true
      saveWechatConfig({
        wechatAppId: this.form.appId,
        wechatAppSecret: this.form.appSecret
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
