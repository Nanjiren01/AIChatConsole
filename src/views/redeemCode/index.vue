<template>
  <div class="page-container">
    <ai-table
      :table-id="'redeem-code-table'"
      :table-actions="tableActions"
      :table-columns="tableColumns"
      :table-data="tableData"
      :table-action-column="tableActionColumn"
      :pagination="pagination"
      :loading="loading"
      @pageSizeChanged="handlePageSizeChange"
      @pageCurrentChanged="handlePageCurrentChanged"
      @refresh="handleRefresh"
      @selection-change="handleSelectionChange"
    >
      <template #filter>
        <el-row :gutter="20">
          <el-col :span="6" :xs="24">
            <el-input v-model="filter.keys" placeholder="请输入卡号（精确搜索）" />
          </el-col>
          <el-col :span="6" :xs="24">
            <el-input v-model="filter.channel" placeholder="请输入渠道（模糊搜索）" />
          </el-col>
          <el-col :span="6" :xs="24">
            <el-input v-model="filter.remark" placeholder="请输入备注（模糊搜索）" />
          </el-col>
          <el-col :span="6" :xs="24">
            <el-button type="primary" plain :disabled="loading" @click="handleSearch">搜索</el-button>
            <el-button type="info" plain @click="handleResetFilter">重置</el-button>
          </el-col>
        </el-row>
      </template>
      <template #topActions>
        <el-button type="primary" icon="el-icon-plus" @click="handleCreate">批量生成</el-button>
        <el-button type="success" @click="handldNormal">批量生效</el-button>
        <el-button type="danger" @click="handldDelete">批量删除</el-button>
        <el-button type="info" @click="handldCancel">批量作废</el-button>
        <el-button type="info" :disabled="exporting" @click="handleExportPage">{{ exporting ? '导出中……' : '导出本页' }}</el-button>
      </template>
      <template v-slot:rowActions="slotProps">
        <el-button icon="el-icon-edit" @click.stop="handleEdit(slotProps.row)">查看</el-button>
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
      <template v-slot:balances="props">
        <span>
          {{ props.row.tokens }} /
          {{ props.row.chatCount }} /
          {{ props.row.advancedChatCount }} /
          {{ props.row.drawCount }}，
          {{ props.row.days }}天，
          {{ getCalcTypeText(props.row.calcTypeId) }}
        </span>
      </template>

      <template v-slot:state="slotProps">
        <el-tag v-if="slotProps.row.state == 0" type="info">草稿</el-tag>
        <el-tag v-if="slotProps.row.state == 1" type="success">生效中</el-tag>
        <el-tag v-if="slotProps.row.state == 2" type="info">已作废</el-tag>
        <el-tag v-if="slotProps.row.state == 3" type="success">已删除</el-tag>
      </template>
      <template v-slot:redeemState="slotProps">
        <el-tag
          v-if="slotProps.row.redeemState == 0"
          :type="[1].includes(slotProps.row.state) ? 'success' : 'info' "
        >未兑换</el-tag>
        <template v-if="slotProps.row.redeemState == 1">
          <el-tag type="info">已兑换</el-tag> {{ slotProps.row.username || slotProps.row.userEmail }}(#{{ slotProps.row.userId }})
        </template>
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
import { getRedeemCodes, batchDelete, batchCancel, batchNormal } from '@/api/redeemCode'
import Create from './create'
import Detail from './detail'
import { export_table_to_excel } from '@/vendor/Export2Excel'

export default {
  name: 'MemberIndex',
  components: { AiTable, Create, Detail },
  data() {
    return {
      loading: false,
      exporting: false,
      showDetail: false,
      showCreateDialog: false,
      selectedRows: null,
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
        label: '额度',
        slot: 'balances',
        width: 380
      }, {
        label: '备注',
        prop: 'remark'
      }, {
        label: '状态',
        slot: 'state',
        width: 70
      }, {
        label: '兑换',
        slot: 'redeemState'
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
        keys: null,
        channel: null,
        remark: null
      },
      detailModel: {
        id: null,
        key: null,
        calcType: null,
        calcTypeId: null,
        tokens: null,
        chatCount: null,
        advancedChatCount: null,
        drawCount: null,
        days: null,
        channel: null,
        remark: null,
        state: null,
        redeemState: null,
        createTime: null,
        redeemTime: null,
        cancelTime: null
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
        channel: this.filter.channel,
        remark: this.filter.remark,
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
            calcType: code.calcType || null,
            calcTypeId: code.calcTypeId || null,
            tokens: code.tokens || null,
            chatCount: code.chatCount || null,
            advancedChatCount: code.advancedChatCount || null,
            drawCount: code.drawCount || null,
            days: code.days || null,
            channel: code.channel || null,
            remark: code.remark || null,
            state: code.state,
            userId: code.userId,
            username: code.username,
            userEmail: code.userEmail,
            redeemState: code.redeemState,
            createTime: code.createTime,
            redeemTime: code.redeemTime,
            cancelTime: code.cancelTime
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
        calcType: row.calcType || null,
        calcTypeId: row.calcTypeId || null,
        tokens: row.tokens || null,
        chatCount: row.chatCount || null,
        advancedChatCount: row.advancedChatCount || null,
        drawCount: row.drawCount || null,
        days: row.days || null,
        channel: row.channel,
        state: row.state,
        userId: row.userId,
        username: row.username,
        userEmail: row.userEmail,
        redeemState: row.redeemState,
        remark: row.remark,
        createTime: row.createTime,
        redeemTime: row.redeemTime,
        cancelTime: row.cancelTime
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
    getCalcTypeText(calcTypeId) {
      return ({
        1: '总额',
        2: '每天',
        3: '每小时',
        4: '每3小时'
      })[calcTypeId]
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
      this.filter.channel = ''
      this.filter.remark = ''
      this.pagination.pageNum = 1
      // this.pagination.pageSize = 20
      this.reload()
    },
    handleCreated() {
      this.handleResetFilter()
      this.handleCloseCreateDialog()
    },
    handldDelete() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请选择要删除的兑换码！')
        return
      }
      this.$confirm('确定删除选中的' + this.selectedRows.length + '个兑换码？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'long-message',
        width: '600px',
        type: 'warning'
      }).then(async() => {
        this.loading = true
        batchDelete(this.selectedRows.map(row => row.id)).then(() => {
          this.$message.success('删除成功！')
          this.reload()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    handldCancel() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请选择要作废的兑换码！')
        return
      }
      this.$confirm('确定作废选中的' + this.selectedRows.length + '个兑换码？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'long-message',
        width: '600px',
        type: 'warning'
      }).then(async() => {
        this.loading = true
        batchCancel(this.selectedRows.map(row => row.id)).then(() => {
          this.$message.success('作废成功！')
          this.reload()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    handldNormal() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请选择要生效的兑换码！')
        return
      }
      this.$confirm('确定生效选中的' + this.selectedRows.length + '个兑换码？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'long-message',
        width: '600px',
        type: 'warning'
      }).then(async() => {
        this.loading = true
        batchNormal(this.selectedRows.map(row => row.id)).then(() => {
          this.$message.success('操作成功！')
          this.reload()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    handleSelectionChange(rows) {
      console.log('rows', rows)
      this.selectedRows = rows
    },
    handleExportPage() {
      this.exporting = true
      function formatDate(date) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')

        return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`
      }
      setTimeout(() => {
        export_table_to_excel('redeem-code-table', formatDate(new Date()) + '.xlsx')
        this.exporting = false
      }, 50)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 10px;
}

</style>
