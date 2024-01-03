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
      <template #topActions>
        <el-button type="primary" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      </template>
      <template v-slot:rowActions="slotProps">
        <el-button type="primary" plain icon="el-icon-edit" @click.stop="handleShowEdit(slotProps.row)">编辑</el-button>
        <el-button
          :type="slotProps.row.state == 10 ? 'danger' : 'success'"
          plain
          icon="el-icon-disabled"
          :disalbed="loading"
          @click.stop="toggleEnable(slotProps.row)"
        >
          {{ slotProps.row.state == 10 ? '禁用' : '启用' }}
        </el-button>
        <!-- <el-button type="danger" icon="el-icon-delete" @click="handleDelete(slotProps.row)">删除</el-button> -->
      </template>

      <template v-slot:state="slotProps">
        <el-tag v-if="slotProps.row.state == 10" type="success">启用</el-tag>
        <el-tag v-else-if="slotProps.row.state == 20" type="danger">禁用</el-tag>
        <el-tag v-else type="warning">草稿</el-tag>
      </template>

      <template v-slot:modelName="slotProps">
        <span>{{ getModelName(slotProps.row) }}</span>
      </template>

    </ai-table>

    <detail
      :assistant="form"
      :platforms="platforms"
      :models="models"
      :api-keys="apiKeys"
      :dialog-visible.sync="dialogVisible"
      @changed="handleChanged"
    />

  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import AiTable from '@/components/Table'
import { getAiPlatforms } from '@/api/aiPlatform.js'
import { getAiModels } from '@/api/aiModel.js'
import { getApiKeys } from '@/api/apiKey.js'
import { getAssistant, enableAssistant, disableAssistant } from '@/api/aiAssistant.js'
import Detail from './detail'

export default {
  name: 'AiAssistantIndex',
  components: { AiTable, Detail },
  data() {
    return {
      platforms: [],
      models: [],
      apiKeys: [],
      loading: false,
      tableActions: [],
      tableColumns: [{
        label: '#',
        prop: 'id',
        width: 55
      }, {
        label: '助手名称',
        prop: 'name'
      }, {
        label: '模型',
        slot: 'modelName'
      }, {
        label: '介绍',
        prop: 'description'
      }, {
        label: '状态',
        prop: 'state',
        slot: 'state',
        width: 65
      }, {
        label: '创建时间',
        prop: 'createTime',
        width: 135
      }],
      tableActionColumn: {
        width: 175
      },
      tableData: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 20,
        showDetail: false
      },

      dialogVisible: false,
      form: {
        id: null,
        name: null,
        state: null
      }
    }
  },
  computed: {
  },
  async mounted() {
    this.reload()
    getAiPlatforms().then(resp => {
      this.platforms = resp.data || []
    })
    getAiModels().then(resp => {
      this.models = resp.data || []
    })
    getApiKeys().then(resp => {
      this.apiKeys = resp.data || []
    })
  },
  methods: {
    reload() {
      this.loading = true
      getAssistant({
        page: this.pagination.pageNum,
        size: this.pagination.pageSize
      }).then(resp => {
        console.log('resp', resp)
        const assistants = resp.data.list
        this.tableData = assistants.map(assistant => {
          return { ... assistant }
        })
        this.pagination.total = this.tableData.length
      }).finally(() => {
        this.loading = false
      })
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
    handleRefresh() {
      this.reload()
    },
    handleCreate() {
      this.dialogVisible = true
      this.form.id = null
      this.form.uuid = null
      this.form.modelId = null
      this.form.apiKeyId = null
      this.form.name = ''
      this.form.description = ''
      this.form.instructions = ''
      this.form.tools = ''
      this.form.state = 0
    },
    handleShowEdit(row) {
      this.dialogVisible = true
      this.form.id = row.id
      this.form.uuid = row.uuid
      this.form.name = row.name
      this.form.description = row.description
      this.form.instructions = row.instructions
      this.form.tools = row.tools
      this.form.modelId = row.modelId
      this.form.apiKeyId = row.apiKeyId
      this.form.state = row.state
    },
    handleChanged() {
      this.reload()
      this.dialogVisible = false
    },
    handleCancel() {
      this.dialogVisible = false
    },
    toggleEnable(row) {
      this.loading = true
      this.$message.info('处理中……')
      if (row.state !== 10) {
        enableAssistant(row.uuid).then(resp => {
          if (resp.code !== 0) {
            return this.$message.error('操作失败！' + resp.message)
          }
          this.reload()
        }).finally(e => {
          console.error(e)
          this.loading = false
        })
      } else {
        disableAssistant(row.uuid).then(resp => {
          if (resp.code !== 0) {
            return this.$message.error('操作失败！' + resp.message)
          }
          this.reload()
        }).finally(e => {
          console.error(e)
          this.loading = false
        })
      }
    },
    getStateName(state) {
      return ({
        1: '启用',
        2: '禁用'
      })[state] || '未知'
    },
    getModelName(row) {
      const model = this.models ? this.models.find(m => m.id === row.modelId) : null
      return model ? model.name : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 10px;
}

</style>
