<template>
  <el-drawer
    :title="title"
    size="60%"
    :visible="show"
    :before-close="handleClose"
  >
    <div style="padding: 20px; height: calc(100% - 77px); overflow-y: auto;">
      <el-form ref="form" label-width="260px" style="padding-right: 180px">
        <el-form-item label="平台">
          <el-select v-model="model.platformId" :disabled="!!model.id">
            <el-option v-for="p in platforms" :key="p.id" :value="p.id" :label="p.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="model.name" />
        </el-form-item>
        <el-form-item label="展示名称">
          <el-input v-model="model.showName" />
        </el-form-item>
        <el-form-item label="path">
          <el-input v-model="model.path" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="model.remark" type="textarea" :row="1" autosize />
        </el-form-item>
        <el-form-item v-if="model.id" label="状态">
          <el-tag v-if="model.state == 1" type="success">启用</el-tag>
          <el-tag v-else type="danger">停用</el-tag>
          <el-button
            :type="model.state == 1 ? 'danger' : 'success'"
            plain
            icon="el-icon-disabled"
            :disalbed="loading"
            style="margin-left: 10px"
            @click.stop="toggleEnable(model)"
          >
            {{ model.state == 1 ? '禁用' : '启用' }}
          </el-button>
        </el-form-item>
        <el-form-item label="计费方式">
          <el-select v-model="model.levelId">
            <el-option :value="1" label="扣减普通聊天积分" />
            <el-option :value="2" label="扣减高级聊天积分" />
            <el-option :value="3" label="扣减tokens" />
            <el-option :value="4" label="扣减绘画积分" />
          </el-select>
        </el-form-item>
        <el-form-item label="粗略倍率">
          <el-input-number v-model="model.multiple" />
          <el-alert
            type="success"
            style="margin-top: 5px; padding: 0; padding-bottom: 5px;"
            :closable="false"
          >token默认按实际使用扣减，其他默认每次扣减1积分。您可以针对不同的模型设置不同的倍率。</el-alert>
        </el-form-item>
        <el-form-item v-if="modelMultiples" label="精细倍率">
          <div style="border: 1px solid #DCDFE6; border-radius: 4px; padding: 10px">
            <div style="line-height: 30px;margin-bottom: 4px;">
              <span style="display:inline-block; width: 100px; text-align: right; padding-right: 10px;">IMAGINE: </span><el-input-number v-model="modelMultiples.imagine" />
            </div>
            <div style="line-height: 30px;margin-bottom: 4px;">
              <span style="display:inline-block; width: 100px; text-align: right; padding-right: 10px;">UPSCALE: </span><el-input-number v-model="modelMultiples.upscale" />
            </div>
            <div style="line-height: 30px;margin-bottom: 4px;">
              <span style="display:inline-block; width: 100px; text-align: right; padding-right: 10px;">VARIATION: </span><el-input-number v-model="modelMultiples.variation" />
            </div>
            <div style="line-height: 30px;margin-bottom: 4px;">
              <span style="display:inline-block; width: 100px; text-align: right; padding-right: 10px;">ZOOMOUT: </span><el-input-number v-model="modelMultiples.zoomout" />
            </div>
            <div style="line-height: 30px;margin-bottom: 4px;">
              <span style="display:inline-block; width: 100px; text-align: right; padding-right: 10px;">PAN: </span><el-input-number v-model="modelMultiples.pan" />
            </div>
            <div style="line-height: 30px;margin-bottom: 4px;">
              <span style="display:inline-block; width: 100px; text-align: right; padding-right: 10px;">SQUARE: </span><el-input-number v-model="modelMultiples.square" />
            </div>
          </div>
          <el-alert
            type="success"
            style="margin-top: 5px; padding: 0; padding-bottom: 5px;"
            :closable="false"
          >系统会优先使用精细倍率，若未设置，才会使用粗略倍率。</el-alert>
        </el-form-item>
        <!-- <template v-if="selectedPlatform && selectedPlatform.chatProtocol === 'MjProxyDraw'">
          <el-form-item label="Midjourney-Proxy主机">
            <el-input v-model="modelConfig.mjProxyHost" />
          </el-form-item>
          <el-form-item label="Midjourney-Proxy端口">
            <el-input v-model="modelConfig.mjProxyPort" />
          </el-form-item>
          <el-form-item label="Midjourney-Proxy Secret">
            <el-input v-model="modelConfig.mjProxySecret" placeholder="选填" />
          </el-form-item>
        </template> -->
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
          <el-form-item label="翻译Prompt">
            <el-input v-model="modelConfig.translatePrompt" />
          </el-form-item>
          <el-form-item label="处理模式">
            <el-select v-model="modelConfig.processMode" placeholder="未设置时默认为mixed">
              <el-option label="mixed" value="mixed" />
              <el-option label="fast" value="fast" />
              <el-option label="turbo" value="turbo" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="回调地址">
            <el-input v-model="modelConfig.webhookEndpoint" placeholder="webhook endpoint" />
          </el-form-item>
          <el-form-item label="回调密码">
            <el-input v-model="modelConfig.webhookSecret" placeholder="webhook secret" />
          </el-form-item> -->
        </template>
        <el-form-item v-if="model.createTime" label="创建时间">
          <el-input v-model="model.createTime" disabled />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="loading" @click="handleSave">
            {{ saving ? '操作中……' : '保 存' }}
          </el-button>
        </el-form-item>
      </el-form>

    </div>
  </el-drawer>
</template>

<script>

import clip from '@/utils/clipboard' // use clipboard directly
import { updateAiModel, createAiModel } from '@/api/aiModel.js'

export default {
  name: 'ModelDetail',
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
      saving: false,
      modelConfig: {},
      modelMultiples: {}
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
        this.modelConfig = config ? JSON.parse(config) : {}
      }
    },
    'model.multiples': {
      handler(multiples) {
        this.modelMultiples = multiples ? JSON.parse(multiples) : {}
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
      this.saving = true
      if (!this.model.id) {
        createAiModel({
          id: this.model.id,
          platformId: this.model.platformId,
          name: this.model.name,
          showName: this.model.showName,
          state: 1,
          levelId: this.model.levelId,
          multiple: this.model.multiple,
          path: this.model.path,
          config: this.model.config,
          multiples: JSON.stringify(this.modelMultiples || {}),
          remark: this.model.remark
        }).then(() => {
          this.$message.success('操作成功！')
          this.$emit('changed')
          this.$emit('close')
        }).finally(() => {
          this.loading = false
          this.saving = false
        })
        return
      }
      updateAiModel({
        id: this.model.id,
        name: this.model.name,
        showName: this.model.showName,
        state: this.model.state,
        levelId: this.model.levelId,
        multiple: this.model.multiple,
        path: this.model.path,
        config: JSON.stringify(this.modelConfig || {}),
        multiples: JSON.stringify(this.modelMultiples || {}),
        remark: this.model.remark
      }).then(() => {
        this.$message.success('操作成功！')
        this.$emit('changed')
        this.$emit('close')
      }).finally(() => {
        this.loading = false
        this.saving = false
      })
    },
    toggleEnable(row) {
      this.loading = true
      this.$message.info(row.state === 1 ? '停用中……' : '启用中……')
      const state = row.state === 1 ? 2 : 1
      updateAiModel({
        id: row.id,
        name: row.name,
        showName: row.showName,
        state,
        levelId: row.levelId,
        multiple: row.multiple,
        path: row.path,
        config: row.config,
        multiples: row.multiples,
        remark: row.remark
      }).then(() => {
        this.$message.success(row.state === 1 ? '停用成功！' : '启用成功！')
        this.$emit('changed')
        this.model.state = state
      }).finally(() => {
        this.loading = false
      })
    },
    handleCopy(text, event) {
      clip(text, event)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
