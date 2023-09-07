<template>
  <div>
    <div style="margin: 0 auto; width: 500px;">
      <el-form ref="form" :model="form" label-width="160px">
        <el-form-item label="开启内置MJ代理">
          <el-switch v-model="form.mjEnabled" :disabled="loading" />
        </el-form-item>
        <template v-if="form.mjEnabled">
          <el-form-item label="Discord服务器id">
            <el-input v-model="form.discordGuildId" :disabled="loading" placeholder="Guild Id，必填" />
          </el-form-item>
          <el-form-item label="Discord频道id">
            <el-input v-model="form.discordChannelId" :disabled="loading" placeholder="Channel Id，必填" />
          </el-form-item>
          <el-form-item label="Discord会话id">
            <el-input v-model="form.discordSessionId" :disabled="loading" placeholder="Session Id，选填" />
          </el-form-item>
          <el-form-item label="Discord用户代理">
            <el-input v-model="form.discordUserAgent" :disabled="loading" placeholder="User Agent，选填" />
          </el-form-item>
          <el-form-item label="Discord用户Token">
            <el-input v-model="form.discordUserToken" :disabled="loading" placeholder="User Token，必填" />
          </el-form-item>
          <el-form-item label="绘画队列并发数">
            <el-input-number v-model="form.queueCoreSize" :disabled="loading" placeholder="Queue Core Size" />
          </el-form-item>
          <el-form-item label="绘画队列长度">
            <el-input-number v-model="form.queueQueueSize" :disabled="loading" placeholder="Queue Size" />
          </el-form-item>
          <el-form-item label="绘画超时时间">
            <el-input-number v-model="form.queueTimeoutMinutes" :disabled="loading" placeholder="Timeout Minutes" />
          </el-form-item>
          <el-form-item label="代理主机">
            <el-input v-model="form.proxyHost" :disabled="loading" placeholder="Proxy Host" />
          </el-form-item>
          <el-form-item label="代理端口">
            <el-input-number v-model="form.proxyPort" :disabled="loading" placeholder="Proxy Port" />
          </el-form-item>
          <el-form-item label="翻译工具">
            <el-select v-model="form.translateWay" :disabled="loading">
              <el-option label="无" value="NULL" />
              <el-option label="GPT" value="GPT" />
              <el-option label="百度（暂不支持）" value="BAIDU" disabled />
            </el-select>
          </el-form-item>
          <template v-if="form.translateWay === 'GPT'">
            <el-form-item label="GPT API URL">
              <el-input v-model="form.gptApiUrl" :disabled="loading" />
            </el-form-item>
            <el-form-item label="GPT Api Key">
              <el-input v-model="form.gptApiKey" :disabled="loading" placeholder="必填" />
            </el-form-item>
            <el-form-item label="GPT模型">
              <el-input v-model="form.gptModel" :disabled="loading" placeholder="默认gpt-3.5-turbo" />
            </el-form-item>
            <el-form-item label="超时时间（秒）">
              <el-input-number v-model="form.gptTimeoutSeconds" :disabled="loading" placeholder="默认30秒" />
            </el-form-item>
            <el-form-item label="Max Tokens">
              <el-input-number v-model="form.gptMaxTokens" disabled placeholder="默认2048" />
            </el-form-item>
            <el-form-item label="Temperature">
              <el-input-number v-model="form.gptTemperature" :disabled="loading" placeholder="" />
            </el-form-item>
            <el-form-item label="翻译Prompt">
              <el-input v-model="form.gptTranslatePrompt" :disabled="loading" placeholder="" />
            </el-form-item>
          </template>
          <template v-if="form.translateWay === 'BAIDU'">
            <el-form-item label="百度翻译AppId">
              <el-input v-model="form.baiduTranslateAppId" :disabled="loading" />
            </el-form-item>
            <el-form-item label="百度翻译AppSecret">
              <el-input v-model="form.baiduTranslateAppSecret" :disabled="loading" />
            </el-form-item>
          </template>

        </template>
        <el-alert type="error" title="注意：提交后Admin服务会重启，请谨慎操作！" :closable="false" style="margin-bottom: 5px;" />
        <el-form-item>
          <el-button type="danger" :disabled="loading" @click="handleSubmit">
            {{ loading ? '保存中……' : '提交并重启' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import { getDrawConfig, saveDrawConfig } from '@/api/globalConfig'

export default {
  name: 'DrawConfig',
  data() {
    return {
      loading: false,
      form: {
        mjEnabled: false,
        discordGuildId: null,
        discordChannelId: null,
        discordSessionId: null,
        discordUserAgent: null,
        discordUserToken: null,
        queueCoreSize: null,
        queueQueueSize: null,
        queueTimeoutMinutes: null,
        proxyHost: null,
        proxyPort: null,

        translateWay: 'NULL',
        gptApiUrl: null,
        gptApiKey: null,
        gptModel: null,
        gptTimeoutSeconds: null,
        gptMaxTokens: null,
        gptTemperature: null,
        gptTranslatePrompt: null,
        baiduTranslateAppId: null,
        baiduTranslateAppSecret: null
      }
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload() {
      this.loading = true
      getDrawConfig().then(resp => {
        // console.log('resp', resp)
        const content = resp.data.drawContent
        this.form.mjEnabled = content.mjEnabled
        this.form.discordGuildId = content.discordGuildId
        this.form.discordChannelId = content.discordChannelId
        this.form.discordSessionId = content.discordSessionId
        this.form.discordUserAgent = content.discordUserAgent
        this.form.discordUserToken = content.discordUserToken
        this.form.queueCoreSize = content.queueCoreSize
        this.form.queueQueueSize = content.queueQueueSize
        this.form.queueTimeoutMinutes = content.queueTimeoutMinutes
        this.form.proxyHost = content.proxyHost
        this.form.proxyPort = content.proxyPort

        this.form.translateWay = content.translateWay
        this.form.gptApiUrl = content.gptApiUrl
        this.form.gptApiKey = content.gptApiKey
        this.form.gptModel = content.gptModel
        this.form.gptTimeoutSeconds = content.gptTimeoutSeconds
        this.form.gptMaxTokens = content.gptMaxTokens
        this.form.gptTemperature = content.gptTemperature
        this.form.gptTranslatePrompt = content.gptTranslatePrompt
        this.form.baiduTranslateAppId = content.baiduTranslateAppId
        this.form.baiduTranslateAppSecret = content.baiduTranslateAppSecret
      }).finally(() => {
        this.loading = false
      })
    },
    handleSubmit() {
      this.loading = true
      saveDrawConfig({
        mjEnabled: this.form.mjEnabled,
        discordGuildId: this.form.discordGuildId,
        discordChannelId: this.form.discordChannelId,
        discordSessionId: this.form.discordSessionId,
        discordUserAgent: this.form.discordUserAgent,
        discordUserToken: this.form.discordUserToken,
        queueCoreSize: this.form.queueCoreSize,
        queueQueueSize: this.form.queueQueueSize,
        queueTimeoutMinutes: this.form.queueTimeoutMinutes,
        proxyHost: this.form.proxyHost,
        proxyPort: this.form.proxyPort,

        translateWay: this.form.translateWay,
        gptApiUrl: this.form.gptApiUrl,
        gptApiKey: this.form.gptApiKey,
        gptModel: this.form.gptModel,
        gptTimeoutSeconds: this.form.gptTimeoutSeconds,
        gptMaxTokens: this.form.gptMaxTokens,
        gptTemperature: this.form.gptTemperature,
        gptTranslatePrompt: this.form.gptTranslatePrompt,
        baiduTranslateAppId: this.form.baiduTranslateAppId,
        baiduTranslateAppSecret: this.form.baiduTranslateAppSecret
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
