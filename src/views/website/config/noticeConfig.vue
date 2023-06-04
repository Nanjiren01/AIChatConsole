<template>
  <div>
    <div style="margin: 0 auto; width: 500px;">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="展示">
          <el-switch v-model="form.show" />
        </el-form-item>
        <el-form-item label="开屏显示">
          <el-switch v-model="form.splash" />
        </el-form-item>
        <el-form-item label="标题（HTML）">
          <el-input v-model="form.title" type="textarea" autosize />
        </el-form-item>
        <el-form-item label="内容（HTML）">
          <el-input v-model="form.content" type="textarea" :row="10" autosize />
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

import { getNoticeConfig, saveNoticeConfig } from '@/api/globalConfig'

export default {
  name: 'NoticeConfig',
  data() {
    return {
      loading: false,
      form: {
        show: false,
        splash: false,
        title: null,
        content: null
      }
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload() {
      this.loading = true
      getNoticeConfig().then(resp => {
        // console.log('resp', resp)
        const content = resp.data.noticeContent
        this.form.show = content.show
        this.form.splash = content.splash
        this.form.title = content.title
        this.form.content = content.content
      }).finally(() => {
        this.loading = false
      })
    },
    handleSubmit() {
      this.loading = true
      saveNoticeConfig({
        noticeShow: this.form.show,
        noticeSplash: this.form.splash,
        noticeTitle: this.form.title || '',
        noticeContent: this.form.content
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
