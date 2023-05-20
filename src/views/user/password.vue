<template>

  <el-dialog
    title="提示"
    :visible="passwordDialogVisible"
    width="400px"
    :append-to-body="true"
    :close-on-click-modal="false"
    @close="handlePasswordDialogClose"
  >
    <el-form ref="passwordForm" label-width="80px">
      <el-form-item v-if="showOldPassword" label="旧密码">
        <el-input v-model="passwordDialogInfo.oldPassword" />
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="passwordDialogInfo.newPassword" />
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="passwordDialogInfo.newPassword2" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handlePasswordDialogClose">取 消</el-button>
      <el-button type="primary" @click="handlePasswordChangeSubmit">确定修改</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { changePassword } from '@/api/user'

export default {
  name: 'PasswordChangeDialog',
  props: {
    passwordDialogVisible: {
      type: Boolean,
      default: false
    },
    showOldPassword: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      passwordDialogInfo: {
        userId: null,
        oldPassword: '',
        newPassword: '',
        newPassword2: ''
      }
    }
  },
  methods: {
    init(userId) { // 对外接口
      this.passwordDialogInfo.userId = userId
      this.passwordDialogInfo.oldPassword = ''
      this.passwordDialogInfo.newPassword = ''
      this.passwordDialogInfo.newPassword2 = ''
    },
    handlePasswordDialogClose() {
      this.$emit('close')
    },
    handlePasswordChangeSubmit() {
      // todo 修改别人的密码
      if (this.showOldPassword) {
        if (!this.passwordDialogInfo.oldPassword) {
          this.$message.error('请输入旧密码！')
          return
        }
        if (this.passwordDialogInfo.oldPassword.length < 6 || this.passwordDialogInfo.oldPassword.length > 64) {
          this.$message.error('旧密码长度应该在6-64之间！')
          return
        }
      }

      if (!this.passwordDialogInfo.newPassword) {
        this.$message.error('请输入新密码！')
        return
      }
      if (this.passwordDialogInfo.newPassword.length < 6 || this.passwordDialogInfo.newPassword.length > 64) {
        this.$message.error('新密码长度应该在6-64之间！')
        return
      }
      if (!this.passwordDialogInfo.newPassword2) {
        this.$message.error('请输入确认密码！')
        return
      }
      if (this.passwordDialogInfo.newPassword !== this.passwordDialogInfo.newPassword2) {
        this.$message.error('两次输入的密码不一致！')
        return
      }
      changePassword(this.passwordDialogInfo.userId, this.passwordDialogInfo.oldPassword,
        this.passwordDialogInfo.newPassword).then(resp => {
        console.log('resp', resp)
        this.$message.success('修改密码成功！')
        this.$emit('close')
      })
    }
  }
}
</script>
