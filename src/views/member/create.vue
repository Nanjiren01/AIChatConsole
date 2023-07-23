<template>
  <el-drawer
    :title="title"
    size="80%"
    :visible="show"
    :modal-append-to-body="true"
    :before-close="handleClose"
    style="height: 100%"
  >
    <div style="padding: 20px; overflow-y: auto;">
      <el-form ref="form" label-width="260px" style="padding-right: 180px">
        <el-form-item label="用户名">
          <el-input v-model="member.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="member.password" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="member.name" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="member.email" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="member.phone" />
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-select v-model="member.state">
            <el-option label="正常" :value="1" />
            <el-option label="停用" :value="2" />
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" :disabled="loading" @click="handleSubmit">
            {{ loading ? '保存中……' : '提 交' }}
          </el-button>
        </el-form-item>
      </el-form>

    </div>
  </el-drawer>
</template>

<script>

import { createMember } from '@/api/user'

export default {
  name: 'MemberCreate',
  components: { },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      drawer: true,
      loading: false,
      member: {
        name: null,
        username: null,
        password: null,
        email: null,
        phone: null
        // state: 1
      }
    }
  },
  computed: {
    title() {
      return '创建成员'
    }
  },
  mounted() {
    // this.reload()
  },
  methods: {
    handleClose() {
      // this.drawer = false
      this.$emit('close')
    },
    handleSubmit() {
      this.loading = true
      createMember(this.member).then(resp => {
        console.log('resp', resp)
        if (resp.code === 0) {
          this.$message.success('创建成功！')
          this.$emit('created')
        } else {
          this.$message.error(resp.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    clear() {
      this.member.name = null
      this.member.username = null
      this.member.password = null
      this.member.email = null
      this.member.phone = null
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__body {
  height: calc(100% - 77px);
  overflow-y: auto;
}
</style>
