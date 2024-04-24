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
            <el-input v-model="filter.phone" placeholder="请输入手机号" />
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :xl="12" :lg="18" :md="18" :sm="24" :xs="24" class="filter-item">
            <div class="filter-item-inner">
              <span style="color: #606266;flex-shrink: 0;flex-grow: 0;flex-basis: 80px;text-align: left;">类型</span>
              <el-checkbox-group v-model="filter.types" style="display: flex;flex-wrap: wrap;">
                <el-checkbox label="imagine">生图(imagine)</el-checkbox>
                <el-checkbox label="upscale">放大(upscale)</el-checkbox>
                <el-checkbox label="variation">变换(variation)</el-checkbox>
                <el-checkbox label="vary">vary</el-checkbox>
                <el-checkbox label="reroll">重绘(reroll)</el-checkbox>
                <el-checkbox label="zoomOut">缩放(zoomOut)</el-checkbox>
                <el-checkbox label="describe">识图(describe)</el-checkbox>
                <el-checkbox label="blend">混图(blend)</el-checkbox>
                <el-checkbox label="pan">移焦(pan)</el-checkbox>
                <el-checkbox label="square">转正(square)</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :xl="12" :lg="18" :md="18" :sm="24" :xs="24" class="filter-item">
            <div class="filter-item-inner">
              <span style="color: #606266;flex-shrink: 0;flex-grow: 0;flex-basis: 80px;text-align: left;">状态</span>
              <el-checkbox-group v-model="filter.states" style="display: flex;flex-wrap: wrap;">
                <el-checkbox :label="0">待提交</el-checkbox>
                <el-checkbox :label="10">已提交</el-checkbox>
                <el-checkbox :label="20">处理中</el-checkbox>
                <el-checkbox :label="30">成功</el-checkbox>
                <el-checkbox :label="40">失败</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :xl="12" :lg="18" :md="18" :sm="24" :xs="24" class="filter-item">
            <div class="filter-item-inner create-time-filter">
              <span style="color: #606266;flex-shrink: 0;flex-grow: 0;flex-basis: 80px;text-align: left;">创建时间</span>
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
        <div style="background-color: white; margin-bottom: 20px; padding: 20px; color: #999; font-size: 14px;">
          <div>
            本页总共{{ tableData.length }}次，
            生图{{ tableData.filter(v => v.type === 'imagine').length }}次，
            放大{{ tableData.filter(v => v.type === 'upscale').length }}次，
            变换{{ tableData.filter(v => v.type === 'variation').length }}次，
            vary{{ tableData.filter(v => v.type === 'vary').length }}次，
            重绘{{ tableData.filter(v => v.type === 'reroll').length }}次，
            缩放{{ tableData.filter(v => v.type === 'zoomOut').length }}次，
            识图{{ tableData.filter(v => v.type === 'describe').length }}次，
            混图{{ tableData.filter(v => v.type === 'blend').length }}次，
            移焦{{ tableData.filter(v => v.type === 'pan').length }}次，
            转正{{ tableData.filter(v => v.type === 'square').length }}次
          </div>

          <template v-for="mode in ['turob', 'fast', 'mixed', 'relax']">
            <div :key="mode">
              <div style="margin-top: 10px;">其中{{ mode }}模式：</div>
              <div>
                <div>
                  总共{{ tableData.filter(v => v.processMode === mode).length }}次，
                  生图{{ tableData.filter(v => v.processMode === mode).filter(v => v.type === 'imagine').length }}次，
                  放大{{ tableData.filter(v => v.processMode === mode).filter(v => v.type === 'upscale').length }}次，
                  变换{{ tableData.filter(v => v.processMode === mode).filter(v => v.type === 'variation').length }}次，
                  vary{{ tableData.filter(v => v.processMode === mode).filter(v => v.type === 'vary').length }}次，
                  重绘{{ tableData.filter(v => v.processMode === mode).filter(v => v.type === 'reroll').length }}次，
                  缩放{{ tableData.filter(v => v.processMode === mode).filter(v => v.type === 'zoomOut').length }}次，
                  识图{{ tableData.filter(v => v.processMode === mode).filter(v => v.type === 'describe').length }}次，
                  混图{{ tableData.filter(v => v.processMode === mode).filter(v => v.type === 'blend').length }}次，
                  移焦{{ tableData.filter(v => v.processMode === mode).filter(v => v.type === 'pan').length }}次，
                  转正{{ tableData.filter(v => v.processMode === mode).filter(v => v.type === 'square').length }}次
                </div>
              </div>
            </div>
          </template>

        </div>
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

      <template v-slot:type="props">
        <span v-if="props.row.type === 'imagine' ">{{ props.row.type }}</span>
        <span v-else>{{ props.row.type }}::{{ props.row.targetIndex || props.row.zoomRatio }}</span>
      </template>

      <template v-slot:state="slotProps">
        <el-tag v-if="slotProps.row.state == 0" type="info">待提交</el-tag>
        <el-tag v-else-if="slotProps.row.state == 10" type="primary">已提交</el-tag>
        <el-tag v-else-if="slotProps.row.state == 20" type="warning">处理中</el-tag>
        <el-tag v-else-if="slotProps.row.state == 30" type="success">成功</el-tag>
        <el-tag v-else-if="slotProps.row.state == 40" type="danger">失败</el-tag>
      </template>

    </ai-table>

    <detail
      ref="detail"
      :show="showDetail"
      :draw-task-entity="detailModel"
      @changed="handleChanged"
      @close="handleCloseDetail"
    />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import AiTable from '@/components/Table'
import { getDrawTasks } from '@/api/drawTask'
import Detail from './detail'

export default {
  name: 'DrawTaskIndex',
  components: { AiTable, Detail },
  data() {
    return {
      loading: false,
      showDetail: false,
      filter: {
        username: null,
        email: null,
        phone: null,
        types: [],
        states: [],
        startTime: null,
        endTime: null
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
        label: '类型',
        slot: 'type',
        width: 100
      }, {
        label: '模式',
        prop: 'processMode',
        width: 100
      }, {
        label: 'prompt',
        prop: 'prompt'
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
        userId: null,
        username: null,
        email: null,
        type: null,
        state: null,
        processMode: null,
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
      getDrawTasks({
        username: this.filter.username,
        email: this.filter.email,
        phone: this.filter.phone,
        types: this.filter.types,
        states: this.filter.states,
        createTimeStart: this.filter.startTime,
        createTimeEnd: this.filter.endTime,
        page: this.pagination.pageNum,
        size: this.pagination.pageSize
      }).then(resp => {
        // console.log('resp', resp)
        const page = resp.data
        const tasks = page.list
        this.tableData = tasks.map(item => {
          item = {
            ...item
          }
          if (item.baseImages) {
            item.baseImages = JSON.parse(item.baseImages)
          }
          return item
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
      this.detailModel = { ...row }
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
      this.filter.phone = ''
      this.filter.types = []
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
</style>
