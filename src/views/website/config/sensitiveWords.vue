<template>
  <div>
    <div style="margin: 0 auto; width: 500px;">
      <el-form ref="form" :model="form" label-width="120px">
        <el-alert title="一行一个" type="info" style="margin-bottom: 10px;" :closable="false" />
        <el-form-item label="敏感词">
          <el-input v-model="form.words" type="textarea" autosize />
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

import { getSensitiveWordsConfig, saveSensitiveWordsConfig } from '@/api/globalConfig'

export default {
  name: 'SensitiveWordsConfig',
  data() {
    return {
      loading: false,
      form: {
        words: null
      }
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload() {
      this.loading = true
      getSensitiveWordsConfig().then(resp => {
        // console.log('resp', resp)
        const content = resp.data.sensitiveWordsContent
        this.form.words = content.words
      }).finally(() => {
        this.loading = false
      })
    },
    handleSubmit() {
      this.loading = true
      saveSensitiveWordsConfig({
        sensitiveWords: this.form.words || ''
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
