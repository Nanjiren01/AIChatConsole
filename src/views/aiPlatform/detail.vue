<template>
  <el-dialog
    title="平台创建/修改"
    :visible="dialogVisible"
    width="800px"
    @close="handleClose"
  >
    <div style="margin: 0 auto;">
      <el-form ref="form" label-width="180px">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="BASE_URL">
          <el-input v-model="form.baseUrl" />
        </el-form-item>
        <el-form-item label="聊天协议">
          <el-select v-model="form.chatProtocol" :disabled="!!platform.id">
            <el-option label="OpenAI聊天协议" value="OpenAiChat" />
            <el-option label="Azure OpenAI聊天协议" value="AzureOpenAiChat" />
            <el-option label="百度聊天协议" value="BaiduChat" />
            <el-option label="阿里千问聊天协议" value="AliQwenChat" />
            <el-option label="内置MJ-Proxy绘画协议" value="EmbeddingMjProxyDraw" />
            <el-option label="MJ-Proxy绘画协议" value="MjProxyDraw" />
            <el-option label="MJ-Proxy-Plus绘画协议" value="MjProxyPlusDraw" />
            <el-option label="GoApi绘画协议" value="GoApiDraw" />
            <el-option label="AImage绘画协议" value="AimageDraw" />
          </el-select>
        </el-form-item>
        <el-form-item label="余额协议">
          <el-select v-model="form.balanceProtocol">
            <el-option label="OpenAI" value="OpenAI" />
            <el-option label="GoApi" value="GoApi" />
            <el-option label="AImage" value="Aimage" />
            <el-option label="其他" value="Other" />
          </el-select>
        </el-form-item>
        <template v-if="form && form.chatProtocol === 'MjProxyDraw'">
          <el-form-item label="Midjourney-Proxy主机">
            <el-input v-model="modelConfig.mjProxyHost" />
          </el-form-item>
          <el-form-item label="Midjourney-Proxy端口">
            <el-input v-model="modelConfig.mjProxyPort" />
          </el-form-item>
          <el-form-item label="Api Secret">
            <el-input v-model="modelConfig.mjProxySecret" placeholder="选填" />
          </el-form-item>
        </template>
        <template v-if="form && form.chatProtocol === 'MjProxyPlusDraw'">
          <el-form-item label="Api Secret">
            <el-input v-model="modelConfig.mjProxySecret" placeholder="选填" />
          </el-form-item>
        </template>
        <template v-if="form && ['AimageDraw', 'MjProxyPlusDraw', 'GoApiDraw'].includes(form.chatProtocol)">
          <el-form-item label="翻译用ChatGPT BaseUrl">
            <el-input v-model="modelConfig.gptApiUrl" />
          </el-form-item>
          <el-form-item label="翻译用ChatGPT Key">
            <el-input v-model="modelConfig.gptApiKey" />
          </el-form-item>
          <el-form-item label="翻译用ChatGPT模型名称">
            <el-input v-model="modelConfig.model" />
          </el-form-item>
          <el-form-item label="翻译Prompt">
            <el-input v-model="modelConfig.translatePrompt" />
          </el-form-item>
        </template>
        <template v-if="form && ['MjProxyPlusDraw'].includes(form.chatProtocol)">
          <el-form-item label="ProcessModeType">
            <el-select v-model="modelConfig.modeType" placeholder="一般无需设置">
              <el-option label="将出图速度放置到prompt中（默认）" value="prompt" />
              <el-option label="将出图速度放置到参数中" value="parameter" />
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="备注">
          <el-input v-model="form.remark" />
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleEditSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { updateAiPlatform, createAiPlatform } from '@/api/aiPlatform.js'

export default {
  name: '',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    platform: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      modelConfig: {},
      form: {
        id: null,
        name: null,
        state: null,
        baseUrl: null,
        remark: null,
        balanceProtocol: null,
        chatProtocol: null
      }
    }
  },
  watch: {
    platform: {
      deep: true,
      handler() {
        this.form.id = this.platform.id
        this.form.name = this.platform.name
        this.form.state = this.platform.state
        this.form.baseUrl = this.platform.baseUrl
        this.form.remark = this.platform.remark
        this.form.balanceProtocol = this.platform.balanceProtocol
        this.form.chatProtocol = this.platform.chatProtocol
        this.form.config = this.platform.config
      }
    },
    'platform.config': {
      handler(config) {
        this.modelConfig = config ? JSON.parse(config) : {}
      }
    }
  },
  methods: {
    handleEditSubmit() {
      if (!this.form.name) {
        this.$message.error('名称不能为空！')
        return
      }
      if (this.form.baseUrl) {
        if (!this.form.baseUrl.startsWith('http')) {
          this.$message.error('BASE_URL必须以http开头')
          return
        }
      }
      this.loading = true
      if (!this.form.id) {
        createAiPlatform({
          // id: this.form.id,
          name: this.form.name,
          state: this.form.state,
          baseUrl: this.form.baseUrl,
          remark: this.form.remark,
          balanceProtocol: this.form.balanceProtocol,
          chatProtocol: this.form.chatProtocol,
          config: JSON.stringify(this.modelConfig || {})
        }).then(() => {
          this.$message.success('操作成功！')
          // this.reload()
          this.$emit('changed')
          // this.dialogVisible = false
        }).finally(() => {
          this.loading = false
        })
        return
      }
      updateAiPlatform({
        id: this.form.id,
        name: this.form.name,
        state: this.form.state,
        baseUrl: this.form.baseUrl,
        remark: this.form.remark,
        balanceProtocol: this.form.balanceProtocol,
        chatProtocol: this.form.chatProtocol,
        config: JSON.stringify(this.modelConfig || {})
      }).then(() => {
        this.$message.success('操作成功！')
        // this.reload()
        this.$emit('changed')
        // this.dialogVisible = false
      }).finally(() => {
        this.loading = false
      })
    },
    handleCancel() {
      this.handleClose()
    },
    handleClose() {
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

