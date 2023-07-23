<template>
  <div>
    <div style="margin: 0 auto; width: 500px;">
      <el-alert :closable="false" title="仅支持阿里云短信服务" style="margin-bottom: 10px" />
      <el-form ref="form" :model="form" label-width="160px">
        <el-form-item label="accessKeyId">
          <el-input v-model="form.accessKeyId" />
        </el-form-item>
        <el-form-item label="accessKeySecret">
          <el-input v-model="form.accessKeySecret" />
        </el-form-item>
        <el-form-item label="endpoint">
          <el-alert :closable="false" style="margin-bottom: 5px;padding: 0;padding-bottom: 5px;">
            请参考<a target="_blank" href="https://api.aliyun.com/product/Dysmsapi">https://api.aliyun.com/product/Dysmsapi</a>
          </el-alert>
          <el-input v-model="form.endpoint" />
        </el-form-item>
        <el-form-item label="短信签名">
          <el-input v-model="form.signName" placeholder="signName" />
        </el-form-item>
        <el-form-item label="注册短信">
          <el-input v-model="form.registerTemplateCode" placeholder="模板CODE，格式：SMS_00000000" />
        </el-form-item>
        <el-form-item label="忘记/重置密码短信">
          <el-input v-model="form.resetPasswordTemplateCode" placeholder="模板CODE，格式：SMS_00000000" />
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

import { getPhoneConfig, savePhoneConfig } from '@/api/globalConfig'

export default {
  name: 'PhoneConfig',
  data() {
    return {
      loading: false,
      form: {
        accessKeyId: null,
        accessKeySecret: null,
        endpoint: null,
        signName: null,
        registerTemplateCode: null,
        resetPasswordTemplateCode: null
      }
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload() {
      this.loading = true
      getPhoneConfig().then(resp => {
        // console.log('resp', resp)
        const content = resp.data.phoneContent
        this.form.accessKeyId = content.accessKeyId
        this.form.accessKeySecret = content.accessKeySecret
        this.form.endpoint = content.endpoint
        this.form.signName = content.signName
        this.form.registerTemplateCode = content.registerTemplateCode
        this.form.resetPasswordTemplateCode = content.resetPasswordTemplateCode
      }).finally(() => {
        this.loading = false
      })
    },
    handleSubmit() {
      this.loading = true
      savePhoneConfig({
        phoneAccessKeyId: this.form.accessKeyId,
        phoneAccessKeySecret: this.form.accessKeySecret,
        phoneEndpoint: this.form.endpoint,
        phoneSignName: this.form.signName,
        phoneRegisterTemplateCode: this.form.registerTemplateCode,
        phoneResetPasswordTemplateCode: this.form.resetPasswordTemplateCode
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
