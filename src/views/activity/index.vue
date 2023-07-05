<template>
  <div class="page-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6" style="margin-top: 10px;">
        <el-card class="box-card">
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
      <register-quota-activity @reload="handleReloadRegisterQuota" @close="handleClose" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="registerQuotaActivityDialogVisible = false">关闭</el-button>
        <!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
      </span>
    </el-dialog>

  </div>
</template>

<script>

import { getRegisterQuotaConfig } from '@/api/globalConfig'

import RegisterQuotaActivity from './registerQuotaActivity'

export default {
  name: 'ActivityIndex',
  components: { RegisterQuotaActivity },
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
      registerQuotaActivityDialogVisible: false
    }
  },
  mounted() {
    this.loadRegisterQuotaConfig()
  },
  methods: {
    loadRegisterQuotaConfig() {
      this.loading = true
      getRegisterQuotaConfig().then(resp => {
        // console.log('resp', resp)
        const content = resp.data.registerQuotaContent
        this.registerQuotaConfig.tokens = content.tokens
        this.registerQuotaConfig.chatCount = content.chatCount
        this.registerQuotaConfig.advancedChatCount = content.advancedChatCount
        this.registerQuotaConfig.drawCount = content.drawCount
        this.registerQuotaConfig.days = content.days
        this.registerQuotaConfig.calcType = content.calcType
      }).finally(() => {
        this.loading = false
      })
    },
    handleShowRegisterQuotaActivity() {
      this.registerQuotaActivityDialogVisible = true
    },
    handleReloadRegisterQuota() {
      this.loadRegisterQuotaConfig()
      this.registerQuotaActivityDialogVisible = false
    },
    handleClose() {
      this.registerQuotaActivityDialogVisible = false
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
</style>
