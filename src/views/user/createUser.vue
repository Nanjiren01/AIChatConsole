<template>

  <el-dialog
    title="创建用户"
    :visible="dialogVisible"
    width="400px"
    :append-to-body="true"
    :close-on-click-modal="false"
    @close="handleDialogClose"
  >
    <el-form ref="form" label-width="120px">
      <el-form-item label="昵称">
        <el-input v-model="dialogInfo.name" />
      </el-form-item>
      <el-form-item label="用户名(账号)">
        <el-input v-model="dialogInfo.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="dialogInfo.password" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleDialogClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { createUser } from '@/api/user'

export default {
  name: 'CreateUser',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogInfo: {
        name: null,
        username: null,
        password: null
      }
    }
  },
  methods: {
    init() {
      this.dialogInfo.name = ''
      this.dialogInfo.username = ''
      this.dialogInfo.password = ''
    },
    handleDialogClose() {
      this.$emit('close')
    },
    handleSubmit() {
      createUser(this.dialogInfo.name, this.dialogInfo.username, this.dialogInfo.password).then(resp => {
        console.log('resp', resp)
        this.$message.success('创建成功！')
        this.$emit('created')
      })
    }
  }
}
</script>

<style lang="scss" scope>

</style>
