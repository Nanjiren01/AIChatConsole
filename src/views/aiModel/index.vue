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
        <el-button icon="el-icon-edit" @click.stop="handleEdit(slotProps.row)">查看</el-button>
        <el-button
          :type="slotProps.row.state == 1 ? 'danger' : 'success'"
          plain
          icon="el-icon-disabled"
          :disalbed="loading"
          @click.stop="toggleEnable(slotProps.row)"
        >
          {{ slotProps.row.state == 1 ? '禁用' : '启用' }}
        </el-button>
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

    <edit
      :show="showEdit"
      :model="editModel"
      :platforms="platforms"
      @close="handleCloseEdit"
      @changed="handleChanged"
    />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import AiTable from '@/components/Table'
import { getAiModels, updateAiModel } from '@/api/aiModel.js'
import { getAiPlatforms } from '@/api/aiPlatform.js'
import Edit from './edit'

export default {
  name: 'AiModelsIndex',
  components: { AiTable, Edit },
  data() {
    return {
      platforms: [],
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
        label: '展示名称',
        prop: 'showName'
      }, {
        label: 'path',
        prop: 'path'
      }, {
        label: '计费方式',
        slot: 'levelId',
        width: 85
      }, {
        label: '状态',
        slot: 'state',
        width: 65
      }, {
        label: '备注',
        prop: 'remark'
      }, {
        label: '创建时间',
        prop: 'createTime',
        width: 135
      }],
      tableActionColumn: {
        width: 170
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
        showName: null,
        platformId: null,
        platformName: null,
        state: null,
        level: null,
        levelId: null,
        path: null,
        remark: null,
        createTime: null
      },

      loading: false
    }
  },
  computed: {
  },
  mounted() {
    this.reload()
    this.reloadPlatforms()
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
            showName: model.showName,
            platformId: model.platformId,
            platformName: model.platformName,
            state: model.state,
            level: model.level,
            levelId: model.levelId,
            // models: key.models,
            // quota: key.quota,
            // state: key.state,
            // creatorName: key.creatorName,
            path: model.path,
            remark: model.remark,
            createTime: model.createTime
            // updateTime: key.updateTime
          }
        })
        this.pagination.total = this.tableData.length
      })
    },
    reloadPlatforms() {
      getAiPlatforms().then(resp => {
        this.platforms.splice(0, this.platforms.length)
        this.platforms.push(... (resp.data || []))
      })
    },
    handleRefresh() {
      this.reload()
    },
    handleCreate() {
      this.editModel.id = null
      this.editModel.name = ''
      this.editModel.showName = ''
      this.editModel.platformId = null
      this.editModel.platformName = null
      this.editModel.level = null
      this.editModel.levelId = null
      this.editModel.state = null
      this.editModel.path = null
      this.editModel.remark = null
      this.showEdit = true
    },
    handleEdit(row) {
      // console.log('edit', row)
      this.editModel.id = row.id
      this.editModel.name = row.name
      this.editModel.showName = row.showName
      this.editModel.platformId = row.platformId
      this.editModel.platformName = row.platformName
      this.editModel.level = row.level
      this.editModel.levelId = row.levelId
      this.editModel.state = row.state
      this.editModel.path = row.path
      this.editModel.remark = row.remark
      this.editModel.createTime = row.createTime
      this.showEdit = true
    },
    handleCloseEdit() {
      this.showEdit = false
    },
    handleChanged() {
      this.reload()
    },
    handleDelete(row) {
      console.log('delete', row)
    },
    toggleEnable(row) {
      this.loading = true
      this.$message.info('处理中……')
      updateAiModel({
        id: row.id,
        name: row.name,
        state: row.state === 1 ? 2 : 1,
        levelId: row.levelId,
        path: row.path
      }).then(() => {
        this.$message.success('操作成功！')
        this.reload()
      }).finally(() => {
        this.loading = false
      })
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
