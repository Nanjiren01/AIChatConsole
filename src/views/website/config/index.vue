<template>
  <div style="padding: 20px;">
    <el-tabs type="border-card">
      <el-tab-pane label="页面配置">
        <!-- <el-alert
          title="如您希望使用环境变量中的设置，请全部置空即可。"
          type="info"
          style="margin-bottom: 10px;"
          :closable="false"
        /> -->
        <div style="margin: 0 auto; width: 500px;">
          <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="网站主标题">
              <el-input v-model="form.title" />
            </el-form-item>
            <el-form-item label="网站副标题">
              <el-input v-model="form.subTitle" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :disabled="loading" @click="handleSubmit">提 交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import { getWebsiteConfig, saveWebsiteConfig } from '@/api/globalConfig'

export default {
  name: 'WebsiteConfig',
  data() {
    return {
      form: {
        title: '',
        subTitle: ''
      },
      loading: false
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload() {
      this.loading = true
      getWebsiteConfig().then(resp => {
        // console.log('resp.data', resp.data)
        const config = resp.data
        this.form.title = config.websiteContent.title
        this.form.subTitle = config.websiteContent.subTitle
      }).finally(() => {
        this.loading = false
      })
    },
    handleSubmit() {
      this.loading = true
      saveWebsiteConfig({
        title: this.form.title,
        subTitle: this.form.subTitle
      }).then(() => {
        this.$message.success('修改成功！')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
