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
      </el-form>
    </div>

  </el-card>
</template>

<script>
// import PanThumb from '@/components/PanThumb'

export default {
  components: { }, // PanThumb
  props: {
    user: {
      type: Object,
      default: () => null
    }
  },
  methods: {
    getRoleName(role) {
      return ({
        1: '超级管理员',
        2: '普通管理员'
      })[role] || '未知'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
