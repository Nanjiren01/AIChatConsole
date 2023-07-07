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
            <el-input v-model="filter.keys" placeholder="请输入卡号" />
          </el-col>
          <el-col :span="6" :xs="24">
            <el-button type="primary" plain :disabled="loading" @click="handleSearch">搜索</el-button>
            <el-button type="info" plain @click="handleResetFilter">重置</el-button>
          </el-col>
        </el-row>
      </template>
      <template #topActions>
        <el-button type="primary" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      </template>
      <template v-slot:rowActions="slotProps">
        <el-button icon="el-icon-edit" @click.stop="handleEdit(slotProps.row)">查看</el-button>
      </template>

      <template v-slot:tokens="slotProps">
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
      </template>
      <template v-slot:state="slotProps">
        <el-tag v-if="slotProps.row.state == 0" type="info">草稿</el-tag>
        <el-tag v-if="slotProps.row.state == 1" type="success">生效中</el-tag>
        <el-tag v-if="slotProps.row.state == 2" type="success">已作废</el-tag>
        <el-tag v-if="slotProps.row.state == 3" type="success">已删除</el-tag>
      </template>
      <template v-slot:redeemState="slotProps">
        <el-tag v-if="slotProps.row.redeemState == 0" type="success">未兑换</el-tag>
        <el-tag v-if="slotProps.row.redeemState == 1" type="info">已兑换</el-tag>
      </template>

    </ai-table>

    <create
      ref="create"
      :show.sync="showCreateDialog"
      @close="handleCloseCreateDialog"
      @created="handleCreated"
    />

    <detail
      ref="detail"
      :show="showDetail"
      :member="detailModel"
      @close="handleCloseDetail"
    />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import AiTable from '@/components/Table'
import { getRedeemCodes } from '@/api/redeemCode'
import Create from './create'
import Detail from './detail'

export default {
  name: 'MemberIndex',
  components: { AiTable, Create, Detail },
  data() {
    return {
      loading: false,
      showDetail: false,
      showCreateDialog: false,
      tableActions: [],
      tableColumns: [{
        label: '#',
        prop: 'id',
        width: 55
      }, {
        label: '卡号',
        prop: 'key'
      }, {
        label: '渠道',
        prop: 'channel',
        width: 150
      }, {
        label: '备注',
        prop: 'remark'
      }, {
        label: '状态',
        slot: 'state',
        width: 70
      }, {
        label: '兑换',
        slot: 'redeemState',
        width: 70
      }, {
        label: '创建时间',
        prop: 'createTime',
        width: 140
      }],
      tableActionColumn: {
        width: 95
      },
      tableData: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 20
        // showDetail: false
      },
      filter: {
        keys: null
      },
      detailModel: {
        id: null,
        key: null,
        channel: null,
        remark: null,
        state: null,
        redeemState: null,
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
      return getRedeemCodes({
        keys: this.filter.keys,
        page: this.pagination.pageNum,
        size: this.pagination.pageSize
      }).then(resp => {
        console.log('resp', resp)
        const page = resp.data
        const codes = page.list
        this.tableData = codes.map(code => {
          return {
            id: code.id,
            key: code.key,
            channel: code.channel,
            remark: code.remark,
            state: code.state,
            redeemState: code.redeemState,
            createTime: code.createTime
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
        key: row.key,
        channel: row.channel,
        state: row.state,
        redeemState: row.redeemState,
        remark: row.remark,
        createTime: row.createTime
      }
      // this.$nextTick(() => {
      //   this.$refs.detail.reload()
      // })
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
      this.showCreateDialog = true
      this.$refs.create.clear()
    },
    handleEdit(row) {
      this.showDetail = true
      this.updateDetail(row)
    },
    handleCloseDetail() {
      this.showDetail = false
    },
    handleCloseCreateDialog() {
      this.showCreateDialog = false
    },
    handleChanged() {
      this.reload()
    },
    handleResetFilter() {
      this.filter.keys = ''
      this.pagination.pageNum = 1
      // this.pagination.pageSize = 20
      this.reload()
    },
    handleCreated() {
      this.handleResetFilter()
      this.handleCloseCreateDialog()
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 10px;
}

</style>
