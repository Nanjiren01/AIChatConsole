<template>
  <div class="page-container">
    <ai-table
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
            <div class="block">
              <el-date-picker
                v-model="filter.startTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择开始时间"
              />
            </div>
          </el-col>
          <el-col :span="6" :xs="24" class="filter-item">
            <div class="block">
              <el-date-picker
                v-model="filter.endTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择结束时间"
              />
            </div>
          </el-col>
          <el-col :span="6" :xs="24" class="filter-item">
            <el-button type="primary" plain :disabled="loading" @click="handleSearch">搜索</el-button>
            <el-button type="info" plain @click="handleResetFilter">重置</el-button>
          </el-col>
        </el-row>
      </template>
      <template v-slot:rowActions="props">
        <el-button type="primary" plain icon="el-icon-edit" @click.stop="handleShowEdit(props.row)">查看</el-button>
      </template>

      <template v-slot:username="props">
        <span>{{ props.row.username || props.row.email }}({{ props.row.userId }})</span>
      </template>

      <template v-slot:status="props">
        <el-tag v-if="props.row.status === 0" type="success">成功</el-tag>
        <el-tag v-else type="danger">错误({{ props.row.status }})</el-tag>
      </template>

    </ai-table>

    <el-dialog
      title="聊天详情"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <div style="margin: 0 auto;">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="form.username" disabled />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form.email" disabled />
          </el-form-item>
          <el-form-item label="时间">
            <el-input v-model="form.createTime" disabled />
          </el-form-item>
          <el-form-item label="状态">
            <el-tag v-if="form.status === 0" type="success">成功</el-tag>
            <el-tag v-else type="danger">错误({{ form.status }})</el-tag>
          </el-form-item>
          <el-form-item label="平台">
            <el-input v-model="form.platformName" disabled />
          </el-form-item>
          <el-form-item label="模型">
            <el-input v-model="form.modelName" disabled />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import AiTable from '@/components/Table'
import { getLogs } from '@/api/chat.js'

export default {
  name: 'ChatIndex',
  components: { AiTable },
  data() {
    return {
      filter: {
        username: null,
        email: null,
        startTime: null,
        endTime: null
      },
      tableActions: [],
      tableColumns: [{
        label: '#',
        prop: 'id',
        width: 55
      }, {
        label: '用户名',
        slot: 'username'
      }, {
        label: '平台',
        prop: 'platformName'
      }, {
        label: '模型',
        prop: 'modelName'
      }, {
        label: '结果',
        slot: 'status'
      }, {
        label: '创建时间',
        prop: 'createTime',
        width: 135
      }],
      tableActionColumn: {
        width: 95
      },
      tableData: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 20
        // showDetail: true
      },
      loading: false,

      dialogVisible: false,
      form: {
        id: null,
        userId: null,
        username: null,
        email: null,
        status: null,
        platformName: null,
        modelName: null,
        createTime: null
      }
    }
  },
  computed: {
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload() {
      getLogs({
        username: this.filter.username,
        email: this.filter.email,
        startTime: this.filter.startTime,
        endTime: this.filter.endTime,
        page: this.pagination.pageNum,
        size: this.pagination.pageSize
      }).then(resp => {
        console.log('resp', resp)
        const page = resp.data
        const logs = page.list
        this.tableData = logs.map(log => {
          return {
            id: log.id,
            userId: log.userId,
            username: log.username,
            email: log.email,
            status: log.status,
            platformName: log.platformName,
            modelName: log.modelName,
            createTime: log.createTime
          }
        })
        this.pagination.total = page.total
        this.pagination.pageNum = page.pageNum
        this.pagination.pageSize = page.pageSize
      })
    },
    handleRefresh() {
      this.reload()
    },
    handleShowEdit(row) {
      this.dialogVisible = true
      this.form.id = row.id
      this.form.userId = row.userId
      this.form.username = row.username
      this.form.email = row.email
      this.form.status = row.status
      this.form.platformName = row.platformName
      this.form.modelName = row.modelName
      this.form.createTime = row.createTime
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
    handleSearch() {
      this.pagination.pageNum = 1 // 搜索时只是跳回第一页，不调整分页数量
      // this.pagination.pageSize = 20
      this.reload()
    },
    handleResetFilter() {
      this.filter.username = ''
      this.filter.email = ''
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
  margin: 10px;
}
</style>
