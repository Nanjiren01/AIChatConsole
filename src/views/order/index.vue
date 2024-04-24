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
          <el-col :span="6" :xs="24" class="filter-item">
            <el-input v-model="filter.username" placeholder="请输入用户名" />
          </el-col>
          <el-col :span="6" :xs="24" class="filter-item">
            <el-input v-model="filter.email" placeholder="请输入邮箱" />
          </el-col>
          <el-col :span="6" :xs="24" class="filter-item">
            <el-input v-model="filter.title" placeholder="请输入标题" />
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :xl="12" :lg="18" :md="18" :sm="24" :xs="24" class="filter-item">
            <div class="filter-item-inner">
              <span style="color: #606266;flex-shrink: 0;flex-grow: 0;flex-basis: 80px;text-align: left;">状态</span>
              <el-checkbox-group v-model="filter.states" style="display: flex;flex-wrap: wrap;">
                <el-checkbox :label="0">待提交</el-checkbox>
                <el-checkbox :label="5">待支付</el-checkbox>
                <el-checkbox :label="10">支付成功</el-checkbox>
                <el-checkbox :label="12">支付失败</el-checkbox>
                <el-checkbox :label="6">提交失败</el-checkbox>
                <el-checkbox :label="20">已取消</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :xl="12" :lg="18" :md="18" :sm="24" :xs="24" class="filter-item">
            <div class="filter-item-inner create-time-filter">
              <span style="color: #606266;flex-shrink: 0;flex-grow: 0;flex-basis: 80px;text-align: left;">下单时间</span>
              <div style="display: flex;flex-wrap: wrap;">
                <el-date-picker
                  v-model="filter.startTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择开始日期"
                />
                <span style="margin: 0 5px;">-</span>
                <el-date-picker
                  v-model="filter.endTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  default-time="23:59:59"
                  placeholder="选择结束日期"
                />
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6" :xs="24" class="filter-item">
            <el-button type="primary" plain :disabled="loading" @click="handleSearch">搜索</el-button>
            <el-button type="info" plain @click="handleResetFilter">重置</el-button>
          </el-col>
        </el-row>
      </template>

      <template #top>
        <el-row :gutter="20" class="panel-group" style="padding: 10px 0;">
          <el-col :xs="24" :sm="12" :lg="6" :xl="6" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-money">
                <svg-icon icon-class="shopping" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  当页订单总数
                </div>
                <count-to :start-val="0" :end-val="basicData.orderCount" :duration="1500" class="card-panel-num" />
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6" :xl="6" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-shopping">
                <svg-icon icon-class="money" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  当页订单金额
                </div>
                <count-to :start-val="0" :end-val="basicData.orderFeeSum" :duration="1500" :decimals="2" prefix="¥ " class="card-panel-num" />
              </div>
            </div>
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
import CountTo from 'vue-count-to'
// import { mapGetters } from 'vuex'
import AiTable from '@/components/Table'
import { getOrders } from '@/api/order'
import Detail from './detail'

export default {
  name: 'OrderIndex',
  components: { AiTable, Detail, CountTo },
  data() {
    return {
      loading: false,
      showDetail: false,
      filter: {
        username: null,
        email: null,
        title: null,
        states: [],
        startTime: null,
        endTime: null
      },
      basicData: {
        orderCount: 0,
        orderFeeSum: 0
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
        states: this.filter.states,
        createTimeStart: this.filter.startTime,
        createTimeEnd: this.filter.endTime,
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

        this.basicData.orderCount = this.tableData.length
        this.basicData.orderFeeSum = page.totalPrice
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
      this.filter.states = []
      this.filter.startTime = null
      this.filter.endTime = null
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
.filter-item {
  margin: 5px 0;

  .filter-item-inner {
    line-height: 28px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    padding: 0 15px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
  }
}

.create-time-filter {
  ::v-deep {
    .el-input__inner {
      border: none;
    }
  }
}

.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 10px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      text-align: right;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
