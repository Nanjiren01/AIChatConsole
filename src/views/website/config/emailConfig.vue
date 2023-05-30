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
        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
        <el-form-item label="发件人">
          <el-input v-model="form.from" placeholder="当用户名就是发件人时，此处可留空" />
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
        username: null,
        password: null,
        from: null
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
        this.form.username = content.username
        this.form.password = content.password
        this.form.from = content.from
      }).finally(() => {
        this.loading = false
      })
    },
    handleSubmit() {
      this.loading = true
      saveEmailConfig({
        host: this.form.host,
        port: this.form.port,
        username: this.form.username,
        password: this.form.password,
        from: this.form.from
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
