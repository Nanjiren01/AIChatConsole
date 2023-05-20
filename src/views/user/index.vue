<template>
  <div class="page-container">
    <ai-table
      :table-actions="tableActions"
      :table-columns="tableColumns"
      :table-action-column="tableActionColumn"
      :table-data="tableData"
      :pagination="pagination"
      @refresh="handleRefresh"
    >
      <!-- <template #topActions>
        <el-button type="primary" icon="el-icon-plus" @click="handleCreate">新增</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleDelete">删除</el-button>
      </template> -->
      <template v-slot:rowActions="slotProps">
        <el-button icon="el-icon-set-up" @click.stop="handleShowChangePassword(slotProps.row)">修改密码</el-button>
      </template>

      <template v-slot:state="slotProps">
        {{ getStateName(slotProps.row.state) }}
      </template>

      <template v-slot:role="slotProps">
        {{ getRoleName(slotProps.row.role) }}
      </template>
    </ai-table>

    <el-dialog
      title="提示"
      :visible.sync="passwordDialogVisible"
      width="400px"
      :append-to-body="true"
      :close-on-click-modal="false"
      @close="handlePasswordDialogClose"
    >
      <el-form ref="passwordForm" label-width="80px">
        <el-form-item label="旧密码">
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
        <el-button @click="passwordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlePasswordChangeSubmit">确定修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import AiTable from '@/components/Table'
import { getUsers, changePassword } from '@/api/user'

export default {
  name: 'UserIndex',
  components: { AiTable },
  data() {
    return {
      tableActions: [
      //   {
      //   key: 'edit',
      //   label: '编辑'
      // }, {
      //   key: 'change-password',
      //   label: '修改密码'
      // }
      ],
      tableActionColumn: {
        width: 200
      },
      tableColumns: [{
        label: '#',
        prop: 'id',
        width: 55
      }, {
        label: '昵称',
        prop: 'name'
      }, {
        label: '登录账号',
        prop: 'username'
      }, {
        label: '角色',
        prop: 'role',
        slot: 'role'
      }, {
        label: '状态',
        prop: 'state',
        slot: 'state'
      }, {
        label: '创建时间',
        prop: 'createTime',
        width: 140
      }, {
        label: '更新时间',
        prop: 'updateTime',
        width: 140
      }],
      tableData: [],
      pagination: {
        total: 0

      },

      passwordDialogVisible: false,
      passwordDialogInfo: {
        id: 0,
        oldPassword: '',
        newPassword: '',
        newPassword2: ''
      }
    }
  },
  computed: {
  },
  created() {
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload() {
      getUsers().then(resp => {
        console.log('resp', resp)
        const users = resp.data || []
        this.tableData = users.map(user => {
          return {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
            state: user.state,
            createTime: user.createTime,
            updateTime: user.updateTime
          }
        })
        this.pagination.total = this.tableData.length
      })
    },
    handleRefresh() {
      this.reload()
    },
    handleCreate() {
      this.$message.warning('开发中……')
    },
    handleDelete() {
      this.$message.warning('开发中……')
    },
    getStateName(state) {
      return ({
        1: '正常',
        2: '禁用'
      })[state] || '未知'
    },
    getRoleName(role) {
      return ({
        1: '超级管理员',
        2: '普通管理员'
      })[role] || '未知'
    },
    handleShowChangePassword(row) {
      this.passwordDialogVisible = true
      this.passwordDialogInfo.id = row.id
    },
    handlePasswordChangeSubmit() {
      // todo 修改别人的密码
      if (!this.passwordDialogInfo.oldPassword) {
        this.$message.error('请输入旧密码！')
        return
      }
      if (this.passwordDialogInfo.oldPassword.length < 6 || this.passwordDialogInfo.oldPassword.length > 64) {
        this.$message.error('旧密码长度应该在6-64之间！')
        return
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
      changePassword(this.passwordDialogInfo.id, this.passwordDialogInfo.oldPassword,
        this.passwordDialogInfo.newPassword).then(resp => {
        console.log('resp', resp)
        this.$message.success('修改密码成功！')
        this.passwordDialogVisible = false
      })
    },
    handlePasswordDialogClose() {
      console.log('handlePasswordDialogClose')
      this.passwordDialogInfo.oldPassword = ''
      this.passwordDialogInfo.newPassword = ''
      this.passwordDialogInfo.newPassword2 = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 10px;
}

</style>
