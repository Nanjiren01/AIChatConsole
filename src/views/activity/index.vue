<template>
  <div class="page-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6" style="margin-top: 10px;">
        <el-card class="box-card" style="height: 505px;">
          <div slot="header" class="clearfix">
            <span>注册赠额</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="handleShowRegisterQuotaActivity">配置</el-button>
          </div>
          <el-alert title="注册即赠送额度" :closable="false" style="padding: 5px 10px; margin-bottom: 10px;" />
          <el-alert title="当某个次数大于0时表示启用" :closable="false" style="padding: 5px 10px; margin-bottom: 10px;" />
          <el-alert title="天数设置为-1表示不限制有效期" :closable="false" style="padding: 5px 10px; margin-bottom: 10px;" />
          <div>
            <el-form ref="form" label-width="120px">
              <el-form-item label="天数">
                <el-input-number v-model="registerQuotaConfig.days" disabled />
              </el-form-item>
              <el-form-item label="tokens">
                <el-input-number v-model="registerQuotaConfig.tokens" disabled />
              </el-form-item>
              <el-form-item label="普通聊天次数">
                <el-input-number v-model="registerQuotaConfig.chatCount" disabled />
              </el-form-item>
              <el-form-item label="高级聊天次数">
                <el-input-number v-model="registerQuotaConfig.advancedChatCount" disabled />
              </el-form-item>
              <el-form-item label="AI绘图次数">
                <el-input-number v-model="registerQuotaConfig.drawCount" disabled />
              </el-form-item>
              <el-form-item label="类型">
                <el-select v-model="registerQuotaConfig.calcType" disabled>
                  <el-option label="总额" value="Total" />
                  <el-option label="每天" value="Daily" />
                  <el-option label="每3小时" value="ThreeHourly" />
                  <el-option label="每小时" value="Hourly" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6" style="margin-top: 10px;">
        <el-card class="box-card" style="height: 505px;">
          <div slot="header" class="clearfix">
            <span>邀请注册</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="handleShowInviteRegisterActivity">配置</el-button>
          </div>
          <el-alert
            title="邀请新用户注册赠送额度，可以给邀请人和被邀请人单独设定额度"
            :closable="false"
            style="padding: 5px 10px; margin-bottom: 10px;"
          />
          <el-alert title="天数设置为-1表示不限制有效期" :closable="false" style="padding: 5px 10px; margin-bottom: 10px;" />
          <div>
            <el-form ref="form" label-width="120px">
              <el-form-item label="开启">
                <el-switch v-model="inviteRegisterConfig.open" disabled />
              </el-form-item>
              <el-form-item label="天数">
                <el-input-number v-model="inviteRegisterConfig.days" disabled />
              </el-form-item>
              <el-form-item label="tokens">
                <el-input-number v-model="inviteRegisterConfig.tokens" disabled />
              </el-form-item>
              <el-form-item label="普通聊天次数">
                <el-input-number v-model="inviteRegisterConfig.chatCount" disabled />
              </el-form-item>
              <el-form-item label="高级聊天次数">
                <el-input-number v-model="inviteRegisterConfig.advancedChatCount" disabled />
              </el-form-item>
              <el-form-item label="AI绘图次数">
                <el-input-number v-model="inviteRegisterConfig.drawCount" disabled />
              </el-form-item>
              <el-form-item label="类型">
                <el-select v-model="inviteRegisterConfig.calcType" disabled>
                  <el-option label="总额" value="Total" />
                  <el-option label="每天" value="Daily" />
                  <el-option label="每3小时" value="ThreeHourly" />
                  <el-option label="每小时" value="Hourly" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6" style="margin-top: 10px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>更多活动</span>
            <el-button style="float: right; padding: 3px 0" type="text" />
          </div>
          <div>敬请期待</div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      title="注册赠额活动配置"
      :visible.sync="registerQuotaActivityDialogVisible"
      width="30%"
      custom-class="config-dialog"
    >
      <register-quota-activity @reload="handleReloadRegisterQuota" @close="handleCloseRegisterQuota" />
    </el-dialog>

    <el-dialog
      title="邀请注册活动配置"
      :visible.sync="inviteRegisterActivityDialogVisible"
      width="30%"
      custom-class="wide-config-dialog"
    >
      <invite-register-activity @reload="handleReloadInviteRegister" @close="handleCloseInviteRegister" />
    </el-dialog>

  </div>
</template>

<script>

import { getRegisterQuotaConfig, getInviteRegisterConfig } from '@/api/globalConfig'

import RegisterQuotaActivity from './registerQuotaActivity'
import InviteRegisterActivity from './inviteRegisterActivity'

export default {
  name: 'ActivityIndex',
  components: { RegisterQuotaActivity, InviteRegisterActivity },
  data() {
    return {
      loading: false,
      registerQuotaConfig: {
        tokens: null,
        chatCount: null,
        advancedChatCount: null,
        drawCount: null,
        days: null,
        calcType: null
      },
      inviteRegisterConfig: {
        open: null,
        tokens: null,
        chatCount: null,
        advancedChatCount: null,
        drawCount: null,
        days: null,
        calcType: null,
        tokens2: null,
        chatCount2: null,
        advancedChatCount2: null,
        drawCount2: null,
        days2: null,
        calcType2: null
      },
      registerQuotaActivityDialogVisible: false,
      inviteRegisterActivityDialogVisible: false
    }
  },
  mounted() {
    this.loadRegisterQuotaConfig(false)
    this.loadInviteRegisterConfig(false)
  },
  methods: {
    loadRegisterQuotaConfig(changeLoading) {
      if (changeLoading) {
        this.loading = true
      }
      return getRegisterQuotaConfig().then(resp => {
        // console.log('resp', resp)
        const content = resp.data.registerQuotaContent
        this.registerQuotaConfig.tokens = content.tokens
        this.registerQuotaConfig.chatCount = content.chatCount
        this.registerQuotaConfig.advancedChatCount = content.advancedChatCount
        this.registerQuotaConfig.drawCount = content.drawCount
        this.registerQuotaConfig.days = content.days
        this.registerQuotaConfig.calcType = content.calcType
      }).finally(() => {
        if (changeLoading) {
          this.loading = false
        }
      })
    },
    loadInviteRegisterConfig(changeLoading) {
      if (changeLoading) {
        this.loading = true
      }
      getInviteRegisterConfig().then(resp => {
        const content = resp.data.inviteRegisterContent
        this.inviteRegisterConfig.open = content.open
        this.inviteRegisterConfig.tokens = content.tokens
        this.inviteRegisterConfig.chatCount = content.chatCount
        this.inviteRegisterConfig.advancedChatCount = content.advancedChatCount
        this.inviteRegisterConfig.drawCount = content.drawCount
        this.inviteRegisterConfig.days = content.days
        this.inviteRegisterConfig.calcType = content.calcType
        this.inviteRegisterConfig.tokens2 = content.tokens2
        this.inviteRegisterConfig.chatCount2 = content.chatCount2
        this.inviteRegisterConfig.advancedChatCount2 = content.advancedChatCount2
        this.inviteRegisterConfig.drawCount2 = content.drawCount2
        this.inviteRegisterConfig.days2 = content.days2
        this.inviteRegisterConfig.calcType2 = content.calcType2
      }).finally(() => {
        if (changeLoading) {
          this.loading = false
        }
      })
    },
    handleShowRegisterQuotaActivity() {
      this.registerQuotaActivityDialogVisible = true
    },
    handleReloadRegisterQuota() {
      this.loadRegisterQuotaConfig(true)
      this.registerQuotaActivityDialogVisible = false
    },
    handleCloseRegisterQuota() {
      this.registerQuotaActivityDialogVisible = false
    },
    handleShowInviteRegisterActivity() {
      this.inviteRegisterActivityDialogVisible = true
    },
    handleReloadInviteRegister() {
      this.loadInviteRegisterConfig(true)
      this.inviteRegisterActivityDialogVisible = false
    },
    handleCloseInviteRegister() {
      this.inviteRegisterActivityDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 10px;
}
::v-deep .config-dialog {
  min-width: 400px;
}
::v-deep .wide-config-dialog {
  min-width: 800px;
}
</style>
