<template>
  <div>
    <div style="margin: 0 auto; width: 500px;">
      <el-form ref="form" :model="form" label-width="180px">
        <el-alert type="info" style="margin-bottom: 10px;" :closable="false">
          下方信息配置后，可以实现微信登录功能
        </el-alert>
        <el-form-item label="类型">
          <el-select v-model="form.appTypes" multiple>
            <el-option label="公众号应用" value="webApp" />
            <el-option label="网页应用" value="websiteApp" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.appTypes.includes('webApp')" label="公众号AppId">
          <el-input v-model="form.webAppId" />
        </el-form-item>
        <el-form-item v-if="form.appTypes.includes('webApp')" label="公众号AppSecret">
          <el-input v-model="form.webAppSecret" type="password" />
        </el-form-item>
        <el-form-item v-if="form.appTypes.includes('websiteApp')" label="网页应用AppId">
          <el-input v-model="form.websiteAppId" />
        </el-form-item>
        <el-form-item v-if="form.appTypes.includes('websiteApp')" label="网页应用AppSecret">
          <el-input v-model="form.websiteAppSecret" type="password" />
        </el-form-item>
        <!-- <el-form-item label="Token">
          <el-input v-model="form.token" />
        </el-form-item>
        <el-form-item label="EncodingAESKey">
          <el-input v-model="form.encodingAesKey" type="password" />
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" :disabled="loading" @click="handleSubmit">
            {{ loading ? '保存中……' : '提 交' }}
          </el-button>
        </el-form-item>
      </el-form>

      <div>
        <el-alert type="info" show-icon style="line-height: 20px; margin-bottom: 10px;" :closable="false">
          微信公众号网页应用文档：<a target="_blank" href="https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html">https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html</a>
        </el-alert>
        <el-alert type="info" show-icon style="line-height: 20px; margin-bottom: 10px;" :closable="false">
          微信网页应用文档：<a target="_blank" href="https://developers.weixin.qq.com/doc/oplatform/Website_App/operation.html">https://developers.weixin.qq.com/doc/oplatform/Website_App/operation.html</a>
        </el-alert>
      </div>
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
        appTypes: [],
        webAppId: null,
        webAppSecret: null,
        websiteAppId: null,
        websiteAppSecret: null,
        token: null,
        encodingAesKey: null
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
        this.form.appTypes = content.appTypes || []
        this.form.webAppId = content.webAppId
        this.form.webAppSecret = content.webAppSecret
        this.form.websiteAppId = content.websiteAppId
        this.form.websiteAppSecret = content.websiteAppSecret
        this.form.token = content.token
        this.form.encodingAesKey = content.encodingAesKey
      }).finally(() => {
        this.loading = false
      })
    },
    handleSubmit() {
      this.loading = true
      saveWechatConfig({
        wechatAppTypes: this.form.appTypes,
        wechatWebAppId: this.form.webAppId,
        wechatWebAppSecret: this.form.webAppSecret,
        wechatWebsiteAppId: this.form.websiteAppId,
        wechatWebsiteAppSecret: this.form.websiteAppSecret,
        wechatToken: this.form.token,
        wechatEncodingAesKey: this.form.encodingAesKey
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
