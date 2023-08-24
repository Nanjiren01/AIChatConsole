<template>
  <div class="page-container">
    <ai-table
      :table-actions="tableActions"
      :table-columns="tableColumns"
      :table-data="tableData"
      :pagination="pagination"
      @refresh="handleRefresh"
    >
      <template #filter>
        <el-row :gutter="20">
          <el-col :span="6" :xs="24">
            <el-input v-model="filter.username" placeholder="请输入用户名" />
          </el-col>
          <el-col :span="6" :xs="24">
            <el-input v-model="filter.email" placeholder="请输入邮箱" />
          </el-col>
          <el-col :span="6" :xs="24">
            <el-button type="primary" plain :disabled="loading" @click="handleSearch">搜索</el-button>
            <el-button type="info" plain @click="handleResetFilter">重置</el-button>
          </el-col>
        </el-row>
      </template>
      <template #topActions>
        <!-- <el-button type="primary" icon="el-icon-plus" @click="handleCreate">新增</el-button> -->
        <!-- <el-button type="danger" icon="el-icon-delete" @click="handleDelete">删除</el-button> -->
      </template>
      <!-- <template v-slot:rowActions="slotProps">
        <el-button icon="el-icon-set-up" @click.stop="handleShowChangePassword(slotProps.row)">修改密码</el-button>
      </template> -->

      <template v-slot:entryId="slotProps">
        <el-tag :type="slotProps.row.entryId == 1 ? 'success' : slotProps.row.entryId == 2 ? 'primary' : 'danger' ">
          {{ getEntryName(slotProps.row.entryId) }}
        </el-tag>
      </template>

      <!-- <template v-slot:role="slotProps">
        {{ getRoleName(slotProps.row.role) }}
      </template> -->
    </ai-table>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import AiTable from '@/components/Table'
import { getLogins } from '@/api/login'

export default {
  name: 'LoginIndex',
  components: { AiTable },
  data() {
    return {
      loading: false,
      tableActions: false,
      tableActionColumn: {
        width: 200
      },
      tableColumns: [{
        label: '#',
        prop: 'id',
        width: 55
      }, {
        label: '用户id',
        prop: 'userId'
      // }, {
      //   label: '昵称',
      //   prop: 'name'
      }, {
        label: '用户名（账号）',
        prop: 'username'
      }, {
        label: '邮箱',
        prop: 'email'
      }, {
        label: '手机号',
        prop: 'phone'
      }, {
        label: 'ip',
        prop: 'ip'
      }, {
        label: 'userAgent',
        prop: 'userAgent'
      }, {
        label: '系统',
        slot: 'entryId'
      }, {
        label: '登录时间',
        prop: 'createTime',
        width: 140
      }],
      tableData: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 20
        // showDetail: false
      },
      filter: {
        username: null,
        email: null
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
      this.loading = true
      getLogins({
        username: this.filter.username,
        email: this.filter.email,
        page: this.pagination.pageNum,
        size: this.pagination.pageSize
      }).then(resp => {
        console.log('resp', resp)
        const page = resp.data
        const users = page.list
        this.tableData = users.map(user => {
          return {
            id: user.id,
            userId: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            phone: user.phone,
            ip: user.ip,
            entryId: user.entryId,
            createTime: user.createTime,
            userAgent: user.userAgent
          }
        })
        this.pagination.total = page.total
        this.pagination.pageNum = page.pageNum
        this.pagination.pageSize = page.pageSize
      }).finally(() => {
        this.loading = false
      })
    },
    handleSearch() {
      this.pagination.pageNum = 1 // 搜索时只是跳回第一页，不调整分页数量
      // this.pagination.pageSize = 20
      this.reload()
    },
    handleRefresh() {
      this.reload()
    },
    handleResetFilter() {
      this.filter.username = ''
      this.filter.email = ''
      this.pagination.pageNum = 1
      // this.pagination.pageSize = 20
      this.reload()
    },
    getEntryName(entryId) {
      return ({
        1: '前台',
        2: '后台'
      })[entryId] || '未知'
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 10px;
}

</style>
