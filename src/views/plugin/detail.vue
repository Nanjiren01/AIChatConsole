<template>
  <el-drawer
    :title="title"
    size="60%"
    :visible="show"
    :modal-append-to-body="true"
    :before-close="handleClose"
    style="height: 100%"
  >
    <div style="padding: 20px; overflow-y: auto;">
      <el-form ref="form" label-width="220px" style="padding-right: 180px">
        <el-form-item v-if="pluginEntity.uuid" label="uuid">
          <el-input v-model="pluginEntity.uuid" disabled />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="pluginEntity.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="Logo">
          <el-input v-model="pluginEntity.logo" :disabled="true" />
        </el-form-item>
        <el-form-item label="搜索引擎">
          <el-select v-model="configEntity.searchEngine" :disabled="disabled">
            <el-option label="谷歌（google）" value="google" />
            <el-option label="百度" value="baidu" />
            <el-option label="必应（Bing）" value="bing" />
            <el-option label="DuckDuckGo" value="duckduckgo" />
            <el-option label="Serp" value="serpapi" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="['serpapi'].includes(configEntity.searchEngine)" label="Serp Api Key">
          <el-input
            v-model="configEntity.serpApiKey"
            :disabled="disabled || !['serpapi'].includes(configEntity.searchEngine)"
          />
        </el-form-item>
        <el-form-item v-if="['bing'].includes(configEntity.searchEngine)" label="Bing Api Key">
          <el-input
            v-model="configEntity.bingApiKey"
            :disabled="disabled || !['bing'].includes(configEntity.searchEngine)"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="disabled" @click="handleSubmit">
            {{ loading ? '操作中……' : pluginEntity.id ? '保存' : '创建' }}
          </el-button>
        </el-form-item>
      </el-form>

    </div>
  </el-drawer>
</template>

<script>

import { updatePluginConfig } from '@/api/plugin'

export default {
  name: 'PluginDetail',
  components: { },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    pluginEntity: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      drawer: true,
      configEntity: {

      }
    }
  },
  computed: {
    title() {
      return this.pluginEntity.name + '详情'
    },
    disabled() {
      return (this.loading) //  || this.pluginEntity.state === 10
    }
  },
  watch: {
    'pluginEntity.config': {
      immediately: true,
      deep: true,
      handler(config) {
        if (!config) {
          config = '{}'
        }
        const entity = JSON.parse(config)
        console.log('entity', config, entity)
        if (!entity.searchEngine) {
          entity.searchEngine = 'google'
        }
        if (!entity.serpApiKey) {
          entity.serpApiKey = null
        }
        if (!entity.bingApiKey) {
          entity.bingApiKey = null
        }
        this.$set(this, 'configEntity', entity)
      }
    }
  },
  mounted() {
    // this.reload()
  },
  methods: {
    reload() { // 对外接口
      if (!this.pluginEntity.id) {
        return
      }
    },
    handleClose() {
      this.$emit('close')
    },
    handleRefresh() {
      this.reload()
    },
    handleSubmit() {
      this.loading = true
      updatePluginConfig({
        uuid: this.pluginEntity.uuid,
        config: JSON.stringify(this.configEntity)
      }).then((resp) => {
        this.$message.success('创建成功！')
        this.$emit('changed', resp.data.id)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__body {
  height: calc(100% - 77px);
  overflow-y: auto;
}
</style>
