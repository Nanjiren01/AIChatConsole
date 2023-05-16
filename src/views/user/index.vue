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

      <template v-slot:state="slotProps">
        {{ getStateName(slotProps.row.state) }}
      </template>

      <template v-slot:role="slotProps">
        {{ getRoleName(slotProps.row.role) }}
      </template>
    </ai-table>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import AiTable from '@/components/Table'
import { getUsers } from '@/api/user'

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
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 10px;
}

</style>
