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
            <el-form-item label="登录页副标题">
              <el-input v-model="form.loginPageSubTitle" />
            </el-form-item>
            <el-form-item label="注册页副标题">
              <el-input v-model="form.registerPageSubTitle" />
            </el-form-item>
            <el-form-item label="注册方式">
              <el-alert
                title="当前版本仅支持选择一种注册方式"
                type="info"
                style="line-height: 14px;margin-bottom: 5px;"
                :closable="false"
              />
              <el-checkbox-group v-model="form.registerTypes" @change="handleCheckedRegisterTypesChange">
                <el-checkbox label="OnlyUsername">仅用户名</el-checkbox>
                <el-checkbox label="OnlyUsernameWithCaptcha">仅用户名（带图形验证码）</el-checkbox>
                <el-checkbox label="UsernameAndEmailWithCaptchaAndCode">用户名+邮箱验证码（带图形验证码）</el-checkbox>
              </el-checkbox-group>
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
        subTitle: '',
        loginPageSubTitle: '',
        registerPageSubTitle: '',
        registerTypes: []
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
        this.form.loginPageSubTitle = config.websiteContent.loginPageSubTitle
        this.form.registerPageSubTitle = config.websiteContent.registerPageSubTitle

        const types = config.websiteContent.registerTypes
        this.form.registerTypes.splice(0, this.form.registerTypes.length)
        this.form.registerTypes.push(types && types.length ? types[0] : 'OnlyUsername')
      }).finally(() => {
        this.loading = false
      })
    },
    handleSubmit() {
      if (this.form.registerTypes.length > 1) {
        this.$message.error('当前版本仅支持选择一种注册方式！')
        return
      }
      this.loading = true
      saveWebsiteConfig({
        title: this.form.title,
        subTitle: this.form.subTitle,
        loginPageSubTitle: this.form.loginPageSubTitle,
        registerPageSubTitle: this.form.registerPageSubTitle,
        registerTypes: this.form.registerTypes
      }).then(() => {
        this.$message.success('修改成功！')
      }).finally(() => {
        this.loading = false
      })
    },
    handleCheckedRegisterTypesChange(newTypes) {
      // console.log('newTypes', newTypes)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
