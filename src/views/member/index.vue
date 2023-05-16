<template>
  <div class="page-container">
    <ai-table
      :table-actions="tableActions"
      :table-columns="tableColumns"
      :table-data="tableData"
      :table-action-column="tableActionColumn"
      :pagination="pagination"
      @refresh="handleRefresh"
    >
      <template #topActions>
        <!-- <el-button type="primary" icon="el-icon-plus" @click="handleCreate">新建</el-button> -->
        <!-- <el-button type="success" icon="el-icon-edit">编辑</el-button> -->
        <!-- <el-button type="danger" icon="el-icon-delete" disabled>删除</el-button> -->
      </template>
      <!-- <template #columns>
        <el-table-column type="selection" width="55" />
      </template> -->

      <template v-slot:state="slotProps">
        {{ getStateName(slotProps.row.state) }}
      </template>

    </ai-table>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import AiTable from '@/components/Table'
import { getMembers } from '@/api/member'

export default {
  name: 'MemberIndex',
  components: { AiTable },
  data() {
    return {
      tableActions: [{
        key: 'increase-tokens',
        label: '添加tokens',
        type: 'primary'
      }, {
        key: 'tokens-record',
        label: 'token记录'
      }, {
        key: 'message-record',
        label: '聊天记录'
      }, {
        key: 'edit',
        label: '编辑'
      }],
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
        label: '状态',
        prop: 'state',
        slot: 'state'
      }, {
        label: '剩余tokens',
        prop: 'tokens'
      }, {
        label: '创建时间',
        prop: 'createTime',
        width: 140
      // }, {
      //   label: '更新时间',
      //   prop: 'update_time'
      }],
      tableActionColumn: {
        width: 400
      },
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
      getMembers().then(resp => {
        console.log('resp', resp)
        const users = resp.data || []
        this.tableData = users.map(user => {
          return {
            id: user.id,
            username: user.username,
            name: user.name,
            tokens: user.tokens,
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
    getStateName(state) {
      return ({
        1: '正常',
        2: '禁用'
      })[state] || '未知'
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 10px;
}

</style>
