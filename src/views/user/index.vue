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
      <template #topActions>
        <el-button type="primary" icon="el-icon-plus" @click="handleCreate">创建</el-button>
        <!-- <el-button type="danger" icon="el-icon-delete" @click="handleDelete">删除</el-button> -->
      </template>
      <template v-slot:rowActions="slotProps">
        <el-button
          icon="el-icon-set-up"
          :disabled="!enableModifyPassword(slotProps.row)"
          @click.stop="handleShowChangePassword(slotProps.row)"
        >修改密码</el-button>
      </template>

      <template v-slot:state="slotProps">
        <el-tag :type="slotProps.row.state === 1 ? 'primary' : slotProps.row.state === 3 ? 'warning' : 'danger'">
          {{ getStateName(slotProps.row.state) }}
        </el-tag>
      </template>

      <template v-slot:role="slotProps">
        {{ getRoleName(slotProps.row.role) }}
      </template>
    </ai-table>
    <change-password
      ref="password"
      :password-dialog-visible="passwordDialogVisible"
      :show-old-password="showOldPassword"
      @close="handlePasswordDialogClose"
    />
    <create-user
      ref="createUser"
      :dialog-visible="createUserDialogVisible"
      @close="handleCreateUserDialogClose"
      @created="handleCreateUserDialogCreated"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AiTable from '@/components/Table'
import { getUsers } from '@/api/user'
import ChangePassword from './password'
import CreateUser from './createUser'

export default {
  name: 'UserIndex',
  components: { AiTable, ChangePassword, CreateUser },
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
        total: 0,
        showDetail: false
      },

      passwordDialogVisible: false,
      showOldPassword: false,

      createUserDialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
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
      if (!this.user || this.user.role !== 1) {
        return this.$message.error('仅超级管理员支持创建管理员')
      }
      this.createUserDialogVisible = true
      this.$refs.createUser.init()
    },
    handleDelete() {
      this.$message.warning('开发中……')
    },
    getStateName(state) {
      return ({
        1: '正常',
        2: '禁用',
        3: '审核中'
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
      this.showOldPassword = this.user && (this.user.role !== 1) // 不是超管的情况下，需要提供自己的旧密码
      this.$refs.password.init(row.id)
    },
    handlePasswordDialogClose() {
      console.log('handlePasswordDialogClose')
      this.passwordDialogVisible = false
    },
    handleCreateUserDialogClose() {
      this.createUserDialogVisible = false
    },
    handleCreateUserDialogCreated() {
      this.handleCreateUserDialogClose()
      this.reload()
    },
    enableModifyPassword(target) {
      if (this.user && (this.user.role === 1)) { // 超管
        return true
      }
      // 普通管理员只能修改自己的密码
      return this.user && (target.id === this.user.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 10px;
}

</style>
