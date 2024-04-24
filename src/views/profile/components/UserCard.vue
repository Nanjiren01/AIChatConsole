<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>个人信息</span>
    </div>

    <div class="user-profile">
      <el-form v-if="user" label-width="120px">
        <el-form-item label="昵称">
          <el-input v-model="user.name" disabled />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="user.username" disabled />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="user.email" disabled />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="user.phone" disabled />
        </el-form-item>
        <el-form-item label="角色">
          <el-tag>{{ getRoleName(user.role) }}</el-tag>
        </el-form-item>

        <el-form-item v-if="user" label="">
          <el-button type="primary" plain @click="handleShowPasswordDialog">修改密码</el-button>
        </el-form-item>
      </el-form>
    </div>

    <change-password
      ref="password"
      :password-dialog-visible="passwordDialogVisible"
      :show-old-password="true"
      @close="handlePasswordDialogClose"
    />

  </el-card>
</template>

<script>
// import PanThumb from '@/components/PanThumb'
import { mapGetters } from 'vuex'
import ChangePassword from '@/views/user/password'

export default {
  components: { ChangePassword }, // PanThumb
  props: {
    user: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      passwordDialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    getRoleName(role) {
      return ({
        1: '超级管理员',
        2: '普通管理员'
      })[role] || '未知'
    },
    handleShowPasswordDialog() {
      this.passwordDialogVisible = true
      this.$refs.password.init(this.user.id)
    },
    handlePasswordDialogClose() {
      console.log('handlePasswordDialogClose')
      this.passwordDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
