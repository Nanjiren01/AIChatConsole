<template>
  <div>
    <div style="margin: 0 auto; width: 500px;">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="地址">
          <el-input v-model="form.host" />
        </el-form-item>
        <el-form-item label="端口">
          <el-input v-model="form.port" />
        </el-form-item>
        <el-form-item label="SSL">
          <el-alert title="如果端口是25或587，建议关闭SSL，如果端口是465，建议开启SSL，其他端口请参见各邮件服务商" />
          <el-switch v-model="form.ssl" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
        <el-form-item label="发件人">
          <el-input v-model="form.from" placeholder="当用户名就是发件人时，此处可留空" />
        </el-form-item>
        <el-form-item label="注册邮件模板（HTML）">
          <el-alert
            type="info"
            title="标题占位符：${title}，验证码占位符：${code}"
            style="line-height: 14px;margin-bottom: 5px;"
            :closable="false"
          />
          <el-input v-model="form.registerTemplate" type="textarea" autosize />
        </el-form-item>
        <el-form-item label="重置密码邮件模板（HTML）">
          <el-alert
            type="info"
            title="标题占位符：${title}，验证码占位符：${code}"
            style="line-height: 14px;margin-bottom: 5px;"
            :closable="false"
          />
          <el-input v-model="form.resetPasswordTemplate" type="textarea" autosize />
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

import { getEmailConfig, saveEmailConfig } from '@/api/globalConfig'

export default {
  name: 'EmailConfig',
  data() {
    return {
      loading: false,
      form: {
        host: null,
        port: null,
        ssl: false,
        username: null,
        password: null,
        from: null,
        registerTemplate: '',
        resetPasswordTemplate: ''
      }
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload() {
      this.loading = true
      getEmailConfig().then(resp => {
        // console.log('resp', resp)
        const content = resp.data.emailContent
        this.form.host = content.host
        this.form.port = content.port
        this.form.ssl = content.ssl
        this.form.username = content.username
        this.form.password = content.password
        this.form.from = content.from
        this.form.registerTemplate = content.registerTemplate || ''
        this.form.resetPasswordTemplate = content.resetPasswordTemplate || ''
      }).finally(() => {
        this.loading = false
      })
    },
    handleSubmit() {
      this.loading = true
      saveEmailConfig({
        host: this.form.host,
        port: this.form.port,
        ssl: this.form.ssl,
        username: this.form.username,
        password: this.form.password,
        from: this.form.from,
        registerTemplate: this.form.registerTemplate,
        resetPasswordTemplate: this.form.resetPasswordTemplate
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
