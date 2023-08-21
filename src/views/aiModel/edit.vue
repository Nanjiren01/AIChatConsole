<template>
  <el-drawer
    :title="title"
    size="60%"
    :visible="show"
    :before-close="handleClose"
  >
    <div style="padding: 20px">
      <el-form ref="form" label-width="260px" style="padding-right: 180px">
        <el-form-item label="平台">
          <el-select v-model="model.platformId" :disabled="!!model.id">
            <el-option v-for="p in platforms" :key="p.id" :value="p.id" :label="p.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="model.name" disabled />
        </el-form-item>
        <el-form-item label="path">
          <el-input v-model="model.path" />
        </el-form-item>
        <el-form-item label="状态">
          <el-tag v-if="model.state == 1" type="success">正常</el-tag>
          <el-tag v-else type="danger">停用</el-tag>
        </el-form-item>
        <el-form-item label="计费方式">
          <el-select v-model="model.levelId" disabled>
            <el-option :value="1" label="普通聊天（GPT3.5）" />
            <el-option :value="2" label="高级聊天（GPT4）" />
            <el-option :value="3" label="tokens" />
            <el-option :value="4" label="绘画" />
          </el-select>
        </el-form-item>
        <template v-if="selectedPlatform && selectedPlatform.chatProtocol === 'GoApiDraw'">
          <el-form-item label="翻译用ChatGPT BaseUrl">
            <el-input v-model="modelConfig.gptApiUrl" />
          </el-form-item>
          <el-form-item label="翻译用ChatGPT Key">
            <el-input v-model="modelConfig.gptApiKey" />
          </el-form-item>
          <el-form-item label="翻译用ChatGPT模型名称">
            <el-input v-model="modelConfig.model" />
          </el-form-item>
          <el-form-item label="回调地址">
            <el-input v-model="modelConfig.webhookEndpoint" placeholder="webhook ednpoint" />
          </el-form-item>
          <el-form-item label="回调密码">
            <el-input v-model="modelConfig.webhookSecret" placeholder="webhook secret" />
          </el-form-item>
        </template>
        <el-form-item v-if="model.createTime" label="创建时间">
          <el-input v-model="model.createTime" disabled />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave">
            {{ loading ? '保存中……' : '保 存' }}
          </el-button>
        </el-form-item>
      </el-form>

    </div>
  </el-drawer>
</template>

<script>

import { updateAiModel } from '@/api/aiModel.js'

export default {
  name: 'MemberDetail',
  components: { },
  props: {
    platforms: {
      type: Array,
      default: () => []
    },
    model: {
      type: Object,
      default: () => []
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      modelConfig: {}
    }
  },
  computed: {
    title() {
      return this.model.name ? (this.model.name + '模型信息') : '新建模型'
    },
    selectedPlatform() {
      if (this.model.platformId && this.platforms) {
        return this.platforms.filter(p => p.id === this.model.platformId)[0]
      }
      return null
    }
  },
  watch: {
    'model.config': {
      handler(config) {
        console.log('model.config', config)
        this.modelConfig = config ? JSON.parse(config) : {}
      }
    }
  },
  mounted() {
    // this.reload()
  },
  methods: {
    handleClose() {
      this.$emit('close')
      this.$emit('update:show', false)
    },
    handleSave() {
      this.loading = true
      updateAiModel({
        id: this.model.id,
        name: this.model.name,
        state: this.model.state,
        levelId: this.model.levelId,
        path: this.model.path,
        config: JSON.stringify(this.modelConfig || {})
      }).then(() => {
        this.$message.success('操作成功！')
        this.$emit('changed')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
