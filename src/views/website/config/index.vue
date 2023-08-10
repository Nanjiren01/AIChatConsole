<template>
  <div style="padding: 20px;">
    <el-tabs type="border-card">
      <el-tab-pane label="页面配置">
        <div style="margin: 0 auto; width: 500px;">
          <el-form ref="form" :model="form" label-width="180px">
            <el-form-item label="网站基址">
              <el-input v-model="form.frontBaseUrl" placeholder="前台网站基址" />
            </el-form-item>
            <el-form-item label="页签标题">
              <el-input v-model="form.title" />
            </el-form-item>
            <el-form-item label="网站主标题（HTML）">
              <el-input v-model="form.mainTitle" />
            </el-form-item>
            <el-form-item label="网站副标题（HTML）">
              <el-input v-model="form.subTitle" />
            </el-form-item>
            <el-form-item label="网站自定义内容（HTML）">
              <el-input v-model="form.icp" type="textarea" autosize />
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
                <el-checkbox label="UsernameAndEmailWithCaptchaAndCode">用户名+邮箱验证码</el-checkbox>
                <el-checkbox label="PhoneWithCaptchaAndCode">手机号+短信验证码</el-checkbox>
                <el-checkbox label="Close">关闭注册</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="仅限邀请码注册">
              <el-switch v-model="form.registerForInviteCodeOnly" />
            </el-form-item>
            <el-form-item label="未登录时隐藏聊天内容">
              <el-switch v-model="form.hideChatLogWhenNotLogin" />
            </el-form-item>
            <el-form-item label="聊天页副标题">
              <el-input v-model="form.chatPageSubTitle" />
            </el-form-item>
            <el-form-item label="聊天窗口：敏感词提示（MD）">
              <el-input v-model="form.sensitiveWordsTip" />
            </el-form-item>
            <el-form-item label="聊天窗口：额度不足提示（MD）">
              <el-input v-model="form.balanceNotEnough" type="textarea" autosize />
            </el-form-item>
            <el-form-item label="聊天窗口：欢迎词">
              <el-input v-model="form.botHello" type="textarea" autosize />
            </el-form-item>
            <el-form-item label="套餐页标题">
              <el-input v-model="form.pricingPageTitle" />
            </el-form-item>
            <el-form-item label="套餐页副标题">
              <el-input v-model="form.pricingPageSubTitle" />
            </el-form-item>
            <el-form-item label="兑换码页标题">
              <el-input v-model="form.redeemCodePageTitle" />
            </el-form-item>
            <el-form-item label="兑换码副标题">
              <el-input v-model="form.redeemCodePageSubTitle" />
            </el-form-item>
            <el-form-item label="兑换码Banner（HTML）">
              <el-input v-model="form.redeemCodePageBanner" type="textarea" autosize />
            </el-form-item>
            <el-form-item label="兑换码顶部（HTML）">
              <el-input v-model="form.redeemCodePageTop" type="textarea" autosize />
            </el-form-item>
            <el-form-item label="兑换码主体（HTML）">
              <el-input v-model="form.redeemCodePageIndex" type="textarea" autosize />
            </el-form-item>
            <el-form-item label="兑换码底部（HTML）">
              <el-input v-model="form.redeemCodePageBottom" type="textarea" autosize />
            </el-form-item>
            <el-form-item label="隐藏Github按钮">
              <el-switch v-model="form.hideGithubIcon" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :disabled="loading" @click="handleSubmit">提 交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="邮箱配置">
        <email-config />
      </el-tab-pane>
      <el-tab-pane label="短信配置">
        <phone-config />
      </el-tab-pane>
      <el-tab-pane label="敏感词配置">
        <sensitive-words-config />
      </el-tab-pane>
      <el-tab-pane label="公告配置">
        <notice-config />
      </el-tab-pane>
      <el-tab-pane label="支付配置">
        <pay-config />
      </el-tab-pane>
      <el-tab-pane label="微信配置">
        <wechat-config />
      </el-tab-pane>
      <el-tab-pane label="聊天配置">
        <chat-config />
      </el-tab-pane>
      <el-tab-pane label="绘画配置">
        <draw-config />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import { getWebsiteConfig, saveWebsiteConfig } from '@/api/globalConfig'
import EmailConfig from './emailConfig'
import PhoneConfig from './phoneConfig'
import SensitiveWordsConfig from './sensitiveWords'
import NoticeConfig from './noticeConfig'
import PayConfig from './payConfig'
import WechatConfig from './wechatConfig'
import ChatConfig from './chatConfig'
import DrawConfig from './drawConfig'

export default {
  name: 'WebsiteConfig',
  components: { EmailConfig, PhoneConfig, SensitiveWordsConfig, NoticeConfig, PayConfig, WechatConfig, ChatConfig, DrawConfig },
  data() {
    return {
      form: {
        frontBaseUrl: '',
        title: '',
        mainTitle: '',
        subTitle: '',
        icp: '',
        loginPageSubTitle: '',
        registerPageSubTitle: '',
        registerTypes: [],
        registerForInviteCodeOnly: false,
        pricingPageTitle: null,
        pricingPageSubTitle: null,
        chatPageSubTitle: '',
        sensitiveWordsTip: '',
        balanceNotEnough: '',
        hideGithubIcon: false,
        botHello: '',
        hideChatLogWhenNotLogin: false,
        redeemCodePageTitle: null,
        redeemCodePageSubTitle: null,
        redeemCodePageBanner: null,
        redeemCodePageTop: null,
        redeemCodePageIndex: null,
        redeemCodePageBottom: null
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
        console.log('config.hideChatLogWhenNotLogin', config.hideChatLogWhenNotLogin)
        this.form.frontBaseUrl = config.websiteContent.frontBaseUrl
        this.form.title = config.websiteContent.title
        this.form.mainTitle = config.websiteContent.mainTitle
        this.form.subTitle = config.websiteContent.subTitle
        this.form.icp = config.websiteContent.icp
        this.form.loginPageSubTitle = config.websiteContent.loginPageSubTitle
        this.form.registerPageSubTitle = config.websiteContent.registerPageSubTitle
        this.form.pricingPageTitle = config.websiteContent.pricingPageTitle
        this.form.pricingPageSubTitle = config.websiteContent.pricingPageSubTitle
        this.form.chatPageSubTitle = config.websiteContent.chatPageSubTitle
        this.form.sensitiveWordsTip = config.websiteContent.sensitiveWordsTip
        this.form.balanceNotEnough = config.websiteContent.balanceNotEnough
        this.form.hideGithubIcon = config.websiteContent.hideGithubIcon
        this.form.botHello = config.websiteContent.botHello
        this.form.hideChatLogWhenNotLogin = !!config.websiteContent.hideChatLogWhenNotLogin
        this.form.registerForInviteCodeOnly = config.websiteContent.registerForInviteCodeOnly || false
        this.form.redeemCodePageTitle = config.websiteContent.redeemCodePageTitle || ''
        this.form.redeemCodePageSubTitle = config.websiteContent.redeemCodePageSubTitle || ''
        this.form.redeemCodePageBanner = config.websiteContent.redeemCodePageBanner || ''
        this.form.redeemCodePageTop = config.websiteContent.redeemCodePageTop || ''
        this.form.redeemCodePageIndex = config.websiteContent.redeemCodePageIndex || ''
        this.form.redeemCodePageBottom = config.websiteContent.redeemCodePageBottom || ''

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
        frontBaseUrl: this.form.frontBaseUrl,
        title: this.form.title,
        mainTitle: this.form.mainTitle,
        subTitle: this.form.subTitle,
        icp: this.form.icp,
        loginPageSubTitle: this.form.loginPageSubTitle,
        registerPageSubTitle: this.form.registerPageSubTitle,
        registerTypes: this.form.registerTypes,
        registerForInviteCodeOnly: this.form.registerForInviteCodeOnly,
        pricingPageTitle: this.form.pricingPageTitle,
        pricingPageSubTitle: this.form.pricingPageSubTitle,
        chatPageSubTitle: this.form.chatPageSubTitle,
        sensitiveWordsTip: this.form.sensitiveWordsTip,
        balanceNotEnough: this.form.balanceNotEnough,
        hideGithubIcon: this.form.hideGithubIcon,
        botHello: this.form.botHello,
        hideChatLogWhenNotLogin: !!this.form.hideChatLogWhenNotLogin,
        redeemCodePageTitle: this.form.redeemCodePageTitle || '',
        redeemCodePageSubTitle: this.form.redeemCodePageSubTitle || '',
        redeemCodePageBanner: this.form.redeemCodePageBanner || '',
        redeemCodePageTop: this.form.redeemCodePageTop || '',
        redeemCodePageIndex: this.form.redeemCodePageIndex || '',
        redeemCodePageBottom: this.form.redeemCodePageBottom || ''
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
