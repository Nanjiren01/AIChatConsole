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
        <el-button type="primary" icon="el-icon-plus" disabled @click="handleCreate">新建</el-button>
      </template>
      <template v-slot:rowActions="slotProps">
        <el-button icon="el-icon-edit" @click.stop="handleEdit(slotProps.row)">查看</el-button>
        <!-- <el-button type="warn" icon="el-icon-disabled" @click="toggleEnable(slotProps.row)">
          {{ slotProps.row.state == 1 ? '禁用' : '启用' }}
        </el-button> -->
        <!-- <el-button type="danger" icon="el-icon-delete" @click="handleDelete(slotProps.row)">删除</el-button> -->
      </template>
      <!-- <template #columns>
        <el-table-column type="selection" width="55" />
      </template> -->

      <template v-slot:levelId="slotProps">
        <el-tag>{{ getLevelText(slotProps.row.levelId) }}</el-tag>
      </template>
      <template v-slot:state="slotProps">
        <el-tag v-if="slotProps.row.state == 1" type="success">启用</el-tag>
        <el-tag v-else type="danger">停用</el-tag>
      </template>

    </ai-table>

    <edit :show="showEdit" :model="editModel" @close="handleCloseEdit" />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import AiTable from '@/components/Table'
import { getAiModels } from '@/api/aiModel.js'
import Edit from './edit'

export default {
  name: 'AiModelsIndex',
  components: { AiTable, Edit },
  data() {
    return {
      tableActions: [],
      tableColumns: [{
        label: '#',
        prop: 'id',
        width: 55
      }, {
        label: '平台名称',
        prop: 'platformName'
      }, {
        label: '模型名称',
        prop: 'name'
      }, {
        label: '计费方式',
        prop: 'levelId',
        slot: 'levelId'
      }, {
        label: '状态',
        prop: 'state',
        slot: 'state'
      }, {
        label: '创建时间',
        prop: 'createTime',
        width: 140
      }],
      tableActionColumn: {
        width: 280
      },
      tableData: [],
      pagination: {
        total: 0,
        showDetail: false
      },
      showEdit: false,
      editModel: {
        id: null,
        name: null,
        platformId: null,
        platformName: null,
        state: null,
        level: null,
        levelId: null,
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
      getAiModels().then(resp => {
        console.log('resp', resp)
        const models = resp.data || []
        this.tableData = models.map(model => {
          return {
            id: model.id,
            name: model.name,
            platformName: model.platformName,
            state: model.state,
            level: model.level,
            levelId: model.levelId,
            // models: key.models,
            // quota: key.quota,
            // state: key.state,
            // creatorName: key.creatorName,
            createTime: model.createTime
            // updateTime: key.updateTime
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
      // console.log('edit', row)
      this.editModel.id = row.id
      this.editModel.name = row.name
      this.editModel.platformId = row.platformId
      this.editModel.platformName = row.platformName
      this.editModel.level = row.level
      this.editModel.levelId = row.levelId
      this.editModel.state = row.state
      this.editModel.createTime = row.createTime
      this.showEdit = true
    },
    handleCloseEdit() {
      this.showEdit = false
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
    getLevelText(levelId) {
      return ({
        1: '普通聊天',
        2: '高级聊天',
        3: 'tokens',
        4: '绘画'
      })[levelId] || '未知'
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 10px;
}

</style>
