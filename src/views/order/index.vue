<template>
  <div class="page-container">
    <ai-table
      v-loading="loading"
      :table-actions="tableActions"
      :table-columns="tableColumns"
      :table-data="tableData"
      :table-action-column="tableActionColumn"
      :pagination="pagination"
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
            <el-input v-model="filter.title" placeholder="请输入标题" />
          </el-col>
          <el-col :span="6" :xs="24">
            <el-button type="primary" plain :disabled="loading" @click="handleSearch">搜索</el-button>
            <el-button type="info" plain @click="handleResetFilter">重置</el-button>
          </el-col>
        </el-row>
      </template>
      <template #topActions>
        <!-- <el-button type="primary" icon="el-icon-plus" @click="handleCreate">新建</el-button> -->
        <!-- <el-button type="danger" icon="el-icon-delete" disabled>删除</el-button> -->
      </template>
      <template v-slot:rowActions="slotProps">
        <el-button icon="el-icon-edit" @click.stop="handleShow(slotProps.row)">查看</el-button>
      </template>

      <template v-slot:username="props">
        <span>{{ props.row.username }}(#{{ props.row.userId }})</span>
      </template>

      <template v-slot:state="slotProps">
        <el-tag v-if="slotProps.row.state == 0" type="info">待提交</el-tag>
        <el-tag v-else-if="slotProps.row.state == 5" type="primary">待支付</el-tag>
        <el-tag v-else-if="slotProps.row.state == 6" type="danger">提交失败</el-tag>
        <el-tag v-else-if="slotProps.row.state == 10" type="success">支付成功</el-tag>
        <el-tag v-else-if="slotProps.row.state == 12" type="danger">支付失败</el-tag>
        <el-tag v-else-if="slotProps.row.state == 20" type="info">已取消</el-tag>
        <el-tag v-else-if="slotProps.row.state == 30" type="danger">已删除</el-tag>
      </template>

    </ai-table>

    <detail
      ref="detail"
      :show="showDetail"
      :order-entity="detailModel"
      @changed="handleChanged"
      @close="handleCloseDetail"
    />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import AiTable from '@/components/Table'
import { getOrders } from '@/api/order'
import Detail from './detail'

export default {
  name: 'OrderIndex',
  components: { AiTable, Detail },
  data() {
    return {
      loading: false,
      showDetail: false,
      filter: {
        username: null,
        email: null,
        title: null
      },
      tableActions: [],
      tableColumns: [{
        label: '#',
        prop: 'id',
        width: 55
      }, {
        label: 'uuid',
        prop: 'uuid',
        width: 160
      }, {
        label: '用户',
        slot: 'username'
      }, {
        label: '标题',
        prop: 'title'
      }, {
        label: '金额',
        prop: 'price',
        width: 100
      }, {
        label: '状态',
        slot: 'state',
        width: 100
      }, {
        label: '创建时间',
        prop: 'createTime',
        width: 140
      }, {
        label: '更新时间',
        prop: 'updateTime',
        width: 140
      }],
      tableActionColumn: {
        width: 100
      },
      tableData: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 20
        // showDetail: false
      },
      detailModel: {
        id: null,
        uuid: null,
        username: '',
        title: null,
        price: null,
        state: null,
        payChannel: null,
        createTime: null,
        updateTime: null
      }
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload() {
      this.loading = true
      getOrders({
        username: this.filter.username,
        email: this.filter.email,
        title: this.filter.title,
        page: this.pagination.pageNum,
        size: this.pagination.pageSize
      }).then(resp => {
        // console.log('resp', resp)
        const page = resp.data
        const orders = page.list
        this.tableData = orders.map(item => {
          return {
            id: item.id,
            uuid: item.uuid,
            userId: item.userId,
            username: item.username,
            title: item.title,
            price: item.price,
            state: item.state,
            payChannel: item.payChannel,
            createTime: item.createTime,
            updateTime: item.updateTime,
            submitTime: item.submitTime,
            payTime: item.payTime,
            cancelTime: item.cancelTime
          }
        })
        this.pagination.total = this.tableData.length
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
      // console.log('updateDetail')
      this.detailModel.id = row.id
      this.detailModel.uuid = row.uuid
      this.detailModel.userId = row.userId
      this.detailModel.username = row.username
      this.detailModel.title = row.title
      this.detailModel.price = row.price
      this.detailModel.state = row.state
      this.detailModel.payChannel = row.payChannel
      this.detailModel.createTime = row.createTime
      this.detailModel.updateTime = row.updateTime
      this.detailModel.submitTime = row.submitTime
      this.detailModel.payTime = row.payTime
      this.detailModel.cancelTime = row.cancelTime
      this.$nextTick(() => {
        this.$refs.detail.reload()
      })
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
    handleShow(row) {
      this.showDetail = true
      this.updateDetail(row)
    },
    handleCloseDetail() {
      this.showDetail = false
    },
    handleChanged(id) {
      this.detailModel.id = id
      this.reload()
    },
    handleSearch() {
      this.pagination.pageNum = 1 // 搜索时只是跳回第一页，不调整分页数量
      // this.pagination.pageSize = 20
      this.reload()
    },
    handleResetFilter() {
      this.filter.username = ''
      this.filter.email = ''
      this.filter.title = ''
      this.pagination.pageNum = 1
      // this.pagination.pageSize = 20
      this.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 10px;
}

</style>
