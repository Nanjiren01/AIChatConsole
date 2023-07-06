<template>
  <div>
    <div style="margin: 0 auto;">
      <el-form ref="form" :model="form" label-width="120px">
        <el-alert title="注册即赠送额度" :closable="false" style="padding: 5px 10px; margin-bottom: 10px;" />
        <el-alert title="当某个次数大于0时表示启用" :closable="false" style="padding: 5px 10px; margin-bottom: 10px;" />
        <el-alert title="天数设置为-1表示不限制有效期" :closable="false" style="padding: 5px 10px; margin-bottom: 10px;" />
        <el-form-item label="开启">
          <el-switch v-model="form.open" />
        </el-form-item>
        <div style="display: flex; flex-direction: row;">
          <div class="card">
            <el-divider content-position="left">被邀请人（注册人）</el-divider>
            <el-form-item label="天数">
              <el-input-number v-model="form.days" />
            </el-form-item>
            <el-form-item label="tokens">
              <el-input-number v-model="form.tokens" />
            </el-form-item>
            <el-form-item label="普通聊天次数">
              <el-input-number v-model="form.chatCount" />
            </el-form-item>
            <el-form-item label="高级聊天次数">
              <el-input-number v-model="form.advancedChatCount" />
            </el-form-item>
            <el-form-item label="AI绘图次数">
              <el-input-number v-model="form.drawCount" />
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="form.calcType">
                <el-option label="总额" value="Total" />
                <el-option label="每天" value="Daily" />
                <el-option label="每3小时" value="ThreeHourly" />
                <el-option label="每小时" value="Hourly" />
              </el-select>
            </el-form-item>
          </div>
          <div class="card">
            <el-divider content-position="left">邀请人</el-divider>
            <el-form-item label="天数">
              <el-input-number v-model="form.days2" />
            </el-form-item>
            <el-form-item label="tokens">
              <el-input-number v-model="form.tokens2" />
            </el-form-item>
            <el-form-item label="普通聊天次数">
              <el-input-number v-model="form.chatCount2" />
            </el-form-item>
            <el-form-item label="高级聊天次数">
              <el-input-number v-model="form.advancedChatCount2" />
            </el-form-item>
            <el-form-item label="AI绘图次数">
              <el-input-number v-model="form.drawCount2" />
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="form.calcType2">
                <el-option label="总额" value="Total" />
                <el-option label="每天" value="Daily" />
                <el-option label="每3小时" value="ThreeHourly" />
                <el-option label="每小时" value="Hourly" />
              </el-select>
            </el-form-item>
          </div>
        </div>

        <el-form-item>
          <el-button type="primary" :disabled="loading" @click="handleSubmit">
            {{ loading ? '保存中……' : '提 交' }}
          </el-button>
          <el-button :disabled="loading" @click="handleCancel">
            关闭（不提交）
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import { getInviteRegisterConfig, saveInviteRegisterConfig } from '@/api/globalConfig'

export default {
  name: 'InviteRegisterConfig',
  data() {
    return {
      loading: false,
      form: {
        open: null,
        days: null,
        tokens: null,
        chatCount: null,
        advancedChatCount: null,
        drawCount: null,
        calcType: null,
        days2: null,
        tokens2: null,
        chatCount2: null,
        advancedChatCount2: null,
        drawCount2: null,
        calcType2: null
      }
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload() {
      this.loading = true
      getInviteRegisterConfig().then(resp => {
        const content = resp.data.inviteRegisterContent
        this.form.open = content.open
        this.form.days = content.days
        this.form.tokens = content.tokens
        this.form.chatCount = content.chatCount
        this.form.advancedChatCount = content.advancedChatCount
        this.form.drawCount = content.drawCount
        this.form.calcType = content.calcType
        this.form.days2 = content.days2
        this.form.tokens2 = content.tokens2
        this.form.chatCount2 = content.chatCount2
        this.form.advancedChatCount2 = content.advancedChatCount2
        this.form.drawCount2 = content.drawCount2
        this.form.calcType2 = content.calcType2
      }).finally(() => {
        this.loading = false
      })
    },
    handleCancel() {
      this.$emit('close')
    },
    handleSubmit() {
      if (this.form.days <= 0 && this.form.days !== -1) {
        this.$message.error('天数不能小于等于0（-1除外）')
        return
      }
      if (this.form.tokens < 0) {
        this.$message.error('tokens不能小于0')
        return
      }
      if (this.form.chatCount < 0) {
        this.$message.error('普通聊天次数不能小于0')
        return
      }
      if (this.form.advancedChatCount < 0) {
        this.$message.error('高级聊天次数不能小于0')
        return
      }
      if (this.form.drawCount < 0) {
        this.$message.error('AI绘画次数不能小于0')
        return
      }
      if (this.form.days2 <= 0 && this.form.days2 !== -1) {
        this.$message.error('天数不能小于等于0（-1除外）')
        return
      }
      if (this.form.tokens2 < 0) {
        this.$message.error('tokens不能小于0')
        return
      }
      if (this.form.chatCount2 < 0) {
        this.$message.error('普通聊天次数不能小于0')
        return
      }
      if (this.form.advancedChatCount2 < 0) {
        this.$message.error('高级聊天次数不能小于0')
        return
      }
      if (this.form.drawCount2 < 0) {
        this.$message.error('AI绘画次数不能小于0')
        return
      }
      this.loading = true
      saveInviteRegisterConfig({
        inviteRegisterOpen: this.form.open,
        inviteRegisterDays: this.form.days,
        inviteRegisterTokens: this.form.tokens,
        inviteRegisterChatCount: this.form.chatCount,
        inviteRegisterAdvancedChatCount: this.form.advancedChatCount,
        inviteRegisterDrawCount: this.form.drawCount,
        inviteRegisterCalcType: this.form.calcType,
        inviteRegisterDays2: this.form.days2,
        inviteRegisterTokens2: this.form.tokens2,
        inviteRegisterChatCount2: this.form.chatCount2,
        inviteRegisterAdvancedChatCount2: this.form.advancedChatCount2,
        inviteRegisterDrawCount2: this.form.drawCount2,
        inviteRegisterCalcType2: this.form.calcType2
      }).then(() => {
        this.$message.success('保存成功！')
        this.$emit('reload')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid #DCDFE6;
  margin: 10px;
  padding: 10px;
}
</style>
