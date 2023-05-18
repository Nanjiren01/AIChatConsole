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

      <template #header>
        <div style="margin: 5px 0">
          <el-alert
            title="只有处于启用状态的key才会被使用"
            type="info"
            :closable="false"
          />
        </div>
      </template>

    </ai-table>

    <api-key-edit v-if="editShow" :api-key="edit" @close="handleCloseEditDialog" />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import AiTable from '@/components/Table'
import ApiKeyEdit from './edit'
import { getApiKeys } from '@/api/apiKey.js'

export default {
  name: 'UserIndex',
  components: { AiTable, ApiKeyEdit },
  data() {
    return {
      tableActions: [],
      tableColumns: [{
        label: '#',
        prop: 'id',
        width: 55
      }, {
        label: '平台',
        prop: 'platformName'
      }, {
        label: 'api key',
        prop: 'key'
      // }, {
      //   label: '可用模型',
      //   prop: 'models'
      }, {
        label: '使用次数',
        prop: 'callCount'
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
      tableData: [],
      pagination: {
        total: 0

      },
      editShow: false,
      edit: {
        id: 0
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
            platformId: key.platformId,
            platformName: key.platformName,
            key: key.key,
            models: key.models,
            quota: key.quota,
            callCount: key.callCount,
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
      // this.$message.warning('开发中……')
      this.editShow = true
      this.edit.id = 0
      this.edit.platformId = 1
      this.edit.key = null
      this.edit.state = null
      this.edit.creatorName = null
      this.edit.createTime = null
    },
    handleEdit(row) {
      // console.log('edit', row)
      this.editShow = true
      this.edit.id = row.id
      this.edit.platformId = row.platformId
      this.edit.key = row.key
      this.edit.state = row.state
      this.edit.creatorName = row.creatorName
      this.edit.createTime = row.createTime
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
    },
    handleCloseEditDialog() {
      this.editShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 10px;
}

</style>
