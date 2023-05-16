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
        <el-button type="primary" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      </template>
      <template v-slot:rowActions="slotProps">
        <el-button type="success" icon="el-icon-edit" @click.stop="handleEdit(slotProps.row)">编辑</el-button>
        <el-button type="warn" icon="el-icon-disabled" @click.stop="toggleEnable(slotProps.row)">
          {{ slotProps.row.state == 1 ? '禁用' : '启用' }}
        </el-button>
        <el-button type="danger" icon="el-icon-delete" @click.stop="handleDelete(slotProps.row)">删除</el-button>
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
import { getApiKeys } from '@/api/apiKey.js'

export default {
  name: 'UserIndex',
  components: { AiTable },
  data() {
    return {
      tableActions: [],
      tableColumns: [{
        label: '#',
        prop: 'id',
        width: 55
      }, {
        label: '所属平台',
        prop: 'platform'
      }, {
        label: 'api key',
        prop: 'key'
      }, {
        label: '可用模型',
        prop: 'models'
      }, {
        label: '额度',
        prop: 'quota'
      }, {
        label: '状态',
        prop: 'state',
        slot: 'state'
      }, {
        label: '创建人',
        prop: 'creatorName',
        width: 150
      }, {
        label: '创建时间',
        prop: 'createTime',
        width: 140
      }],
      tableActionColumn: {
        width: 260
      },
      tableData: [{
        id: 1,
        platform: 'OpenAI',
        key: 'sk-123456',
        models: 'gpt-3.5-turbo,gpt4',
        quota: '$118.20',
        state: 1,
        creatorName: '超级管理员(aichat)',
        createTime: '2023-05-16 17:30:08'
      }, {
        id: 2,
        platform: 'OpenAI',
        key: 'sk-123456',
        models: 'gpt-3.5-turbo,gpt4',
        quota: '$118.20',
        state: 1,
        creatorName: '超级管理员(aichat)',
        createTime: '2023-05-16 17:30:08'
      }],
      pagination: {
        total: 0

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
      getApiKeys().then(resp => {
        console.log('resp', resp)
        const keys = resp.data || []
        this.tableData = keys.map(key => {
          return {
            id: key.id,
            platform: key.platform,
            models: key.models,
            quota: key.quota,
            state: key.state,
            creatorName: key.creatorName,
            createTime: key.createTime,
            updateTime: key.updateTime
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
    handleEdit(row) {
      console.log('edit', row)
    },
    handleDelete(row) {
      console.log('delete', row)
    },
    toggleEnable(row) {
      console.log('toggle', row)
    },
    getStateName(state) {
      return ({
        1: '启用',
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
