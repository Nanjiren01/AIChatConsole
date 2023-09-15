<template>
  <div class="page-container">
    <ai-table
      :table-actions="tableActions"
      :table-columns="tableColumns"
      :table-data="tableData"
      :table-action-column="tableActionColumn"
      :pagination="pagination"
      :loading="loading"
      @pageSizeChanged="handlePageSizeChange"
      @pageCurrentChanged="handlePageCurrentChanged"
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
            <el-input v-model="filter.phone" placeholder="请输入手机号" />
          </el-col>
          <el-col :span="6" :xs="24">
            <el-button type="primary" plain :disabled="loading" @click="handleSearch">搜索</el-button>
            <el-button type="info" plain @click="handleResetFilter">重置</el-button>
          </el-col>
        </el-row>
      </template>
      <template #topActions>
        <el-button type="primary" icon="el-icon-plus" @click="handleCreate">新建</el-button>

      <!-- <el-button type="danger" icon="el-icon-delete" disabled>删除</el-button> -->
      </template>
      <template v-slot:rowActions="slotProps">
        <el-button icon="el-icon-edit" @click.stop="handleEdit(slotProps.row)">编辑</el-button>
        <el-button @click.stop="handleToggleEnable(slotProps.row)">
          {{ slotProps.row.state == 1 ? '停用' : '取消停用' }}
        </el-button>
      </template>
      <!-- <template #columns>
        <el-table-column type="selection" width="55" />
      </template> -->

      <template v-slot:balances="props">
        <template v-if="props.row.balance">
          <span>
            {{ props.row.balance.tokens }} /
            {{ props.row.balance.chatCount }} /
            {{ props.row.balance.advancedChatCount }}/
            {{ props.row.balance.drawCount }}，
            {{ props.row.balance.expireTime }}
          </span>
          <span>，有效套餐数：{{ props.row.balances.length }}</span>
        </template>
      </template>
      <!-- <template v-slot:tokens="slotProps">
        <el-tag v-if="slotProps.row.tokens == -1" type="success">无限制</el-tag>
        <el-tag v-else-if="slotProps.row.tokens === 0" type="danger">{{ slotProps.row.tokens }}</el-tag>
        <el-tag v-else-if="slotProps.row.tokens < 50" type="warning">{{ slotProps.row.tokens }}</el-tag>
        <el-tag v-else type="success">{{ slotProps.row.tokens }}</el-tag>
      </template>
      <template v-slot:chatCount="slotProps">
        <el-tag v-if="slotProps.row.chatCount == -1" type="success">无限制</el-tag>
        <el-tag v-else-if="slotProps.row.chatCount === 0" type="danger">{{ slotProps.row.chatCount }}</el-tag>
        <el-tag v-else-if="slotProps.row.chatCount < 5" type="warning">{{ slotProps.row.chatCount }}</el-tag>
        <el-tag v-else type="success">{{ slotProps.row.chatCount }}</el-tag>
      </template>
      <template v-slot:advancedChatCount="slotProps">
        <el-tag v-if="slotProps.row.advancedChatCount == -1" type="success">无限制</el-tag>
        <el-tag v-else-if="slotProps.row.advancedChatCount === 0" type="danger">{{ slotProps.row.advancedChatCount }}</el-tag>
        <el-tag v-else-if="slotProps.row.advancedChatCount < 5" type="warning">{{ slotProps.row.advancedChatCount }}</el-tag>
        <el-tag v-else type="success">{{ slotProps.row.advancedChatCount }}</el-tag>
      </template>
      <template v-slot:drawCount="slotProps">
        <el-tag v-if="slotProps.row.drawCount === -1" type="success">无限制</el-tag>
        <el-tag v-else-if="slotProps.row.drawCount === 0" type="danger">{{ slotProps.row.drawCount }}</el-tag>
        <el-tag v-else-if="slotProps.row.drawCount < 5" type="warning">{{ slotProps.row.drawCount }}</el-tag>
        <el-tag v-else type="success">{{ slotProps.row.drawCount }}</el-tag>
      </template> -->
      <template v-slot:state="slotProps">
        <el-tag v-if="slotProps.row.state == 1" type="success">正常</el-tag>
        <el-tag v-else-if="slotProps.row.state == 2" type="danger">停用</el-tag>
        <el-tag v-else type="warning">审核中</el-tag>
      </template>

      <template v-slot:username="props">
        <el-tag type="primary" class="username-tag">{{ props.row.username }}</el-tag>
        <el-tag v-if="props.row.email" type="primary" class="username-tag">{{ props.row.email }}</el-tag>
        <el-tag v-if="props.row.phone" type="primary" class="username-tag">{{ props.row.phone }}</el-tag>
        <el-tag v-if="props.row.wechatOpenId" type="primary" class="username-tag">{{ props.row.wechatOpenId.substring(0, 6) + '...' }}</el-tag>
      </template>

    </ai-table>

    <create
      ref="create"
      :show="showCreate"
      @close="handleCloseCreate"
      @created="handleCreated"
    />

    <detail
      ref="detail"
      :show="showDetail"
      :member="detailModel"
      @changed="handleChanged"
      @close="handleCloseDetail"
    />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import AiTable from '@/components/Table'
import { getMembers } from '@/api/member'
import { enableUser } from '@/api/user'
import Detail from './detail'
import Create from './create'

export default {
  name: 'MemberIndex',
  components: { AiTable, Detail, Create },
  data() {
    return {
      loading: false,
      showCreate: false,
      showDetail: false,
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
        slot: 'username'
      }, {
        label: '状态',
        slot: 'state',
        width: 60
      }, {
        label: '套餐',
        slot: 'balances',
        width: 380
      // }, {
      //   label: '剩余tokens',
      //   prop: 'tokens',
      //   slot: 'tokens',
      //   width: 120
      // }, {
      //   label: '剩余基础聊天积分',
      //   prop: 'chatCount',
      //   slot: 'chatCount',
      //   width: 120
      // }, {
      //   label: '剩余高级聊天积分',
      //   prop: 'advancedChatCount',
      //   slot: 'advancedChatCount',
      //   width: 120
      // }, {
      //   label: '剩余绘画积分',
      //   prop: 'drawCount',
      //   slot: 'drawCount',
      //   width: 120
      }, {
        label: '创建时间',
        prop: 'createTime',
        width: 140
      // }, {
      //   label: '更新时间',
      //   prop: 'update_time'
      }],
      tableActionColumn: {
        width: 185
      },
      tableData: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 20
        // showDetail: false
      },
      filter: {
        username: null,
        email: null,
        phone: null
      },
      detailModel: {
        id: null,
        name: null,
        username: null,
        state: null,
        role: null,
        email: null,
        phone: null,
        balances: null,
        // tokens: null,
        // chatCount: null,
        // advancedChatCount: null,
        // drawCount: null,
        createTime: null
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
      return getMembers({
        username: this.filter.username,
        email: this.filter.email,
        phone: this.filter.phone,
        page: this.pagination.pageNum,
        size: this.pagination.pageSize
      }).then(resp => {
        console.log('resp', resp)
        const page = resp.data
        const users = page.list
        this.tableData = users.map(user => {
          return {
            id: user.id,
            username: user.username,
            name: user.name,
            // tokens: user.tokens,
            role: user.role,
            state: user.state,
            email: user.email,
            phone: user.phone,
            qq: user.qq,
            remark: user.remark,
            wechatOpenId: user.wechatOpenId,
            balance: user.balances && user.balances[0] || null,
            balances: user.balances || [],
            // chatCount: user.chatCount,
            // advancedChatCount: user.advancedChatCount,
            // drawCount: user.drawCount,
            createTime: user.createTime,
            updateTime: user.updateTime
          }
        })
        this.pagination.total = page.total
        this.pagination.pageNum = page.pageNum
        this.pagination.pageSize = page.pageSize
      }).then(() => {
        console.log('this.showDetail', this.showDetail)
        if (this.showDetail) {
          const row = this.tableData.filter(r => r.id === this.detailModel.id)[0]
          console.log('row', row)
          if (row) {
            this.updateDetail(row)
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },
    updateDetail(row) {
      console.log('updateDetail')
      this.detailModel = {
        id: row.id,
        name: row.name,
        username: row.username,
        state: row.state,
        role: row.role,
        // tokens: row.tokens,
        email: row.email,
        phone: row.phone,
        qq: row.qq,
        remark: row.remark,
        wechatOpenId: row.wechatOpenId,
        // chatCount: row.chatCount,
        // advancedChatCount: row.advancedChatCount,
        // drawCount: row.drawCount,
        createTime: row.createTime
      }
      this.$nextTick(() => {
        this.$refs.detail.reload()
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
    handlePageSizeChange(size) {
      this.pagination.pageNum = 1
      this.pagination.pageSize = size
      this.reload()
    },
    handlePageCurrentChanged(page) {
      console.log('page', page)
      this.pagination.pageNum = page
      this.reload()
    },
    handleCreate() {
      // this.$message.warning('开发中……')
      this.showCreate = true
      this.$refs.create.clear()
    },
    handleEdit(row) {
      this.showDetail = true
      this.updateDetail(row)
    },
    handleCloseDetail() {
      this.showDetail = false
    },
    handleCloseCreate() {
      this.showCreate = false
    },
    handleChanged() {
      this.reload()
    },
    handleCreated() {
      this.handleCloseCreate()
      this.reload()
    },
    handleToggleEnable(row) {
      console.log('handleToggleEnable')
      this.$confirm(
        row.state === 1 ? ('确定对' + row.username + '进行停用吗？') : ('确定对' + row.username + '取消停用吗？'),
        '操作确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async() => {
        const enable = row.state === 2
        enableUser(row.id, enable).then(resp => {
          console.log('resp', resp)
          this.$message.success('操作成功！')
          this.reload()
        })
      })
    },
    handleResetFilter() {
      this.filter.username = ''
      this.filter.email = ''
      this.filter.phone = ''
      this.pagination.pageNum = 1
      // this.pagination.pageSize = 20
      this.reload()
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
.username-tag {
  margin-right: 5px;
}
</style>
