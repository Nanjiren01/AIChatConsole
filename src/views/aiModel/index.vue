<template>
  <div class="page-container">
    <ai-table
      :table-actions="tableActions"
      :table-columns="oldView ? oldTableColumns : tableColumns"
      :table-data="oldView ? oldTableData : tableData"
      :table-action-column="tableActionColumn"
      :pagination="pagination"
      @refresh="handleRefresh"
    >
      <template #topActions>
        <el-button type="primary" icon="el-icon-plus" @click="handleCreate(null)">添加模型</el-button>
        <el-switch v-model="oldView" style="margin-left: 10px" active-text="全列表视图" />
      </template>
      <template v-slot:rowActions="slotProps">
        <template v-if="oldView">
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
      </template>
      <!-- <template #columns>
        <el-table-column type="selection" width="55" />
      </template> -->

      <template v-slot:models="pp">
        <el-tag
          v-for="mdl in pp.row.models"
          :key="mdl.id"
          :type="mdl.state == 1 ? 'success' : 'danger'"
          size="middle"
          class="model-tag"
          @click.stop="handleEdit(mdl)"
        >
          {{ mdl.name || '未设置' }}{{ mdl.showName ? `(${mdl.showName})` : '' }}
        </el-tag>
        <el-tag
          type="info"
          size="middle"
          class="model-tag"
          @click.stop="handleCreate(pp.row.id)"
        ><i class="el-icon-plus" />添加模型</el-tag>
      </template>

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
      oldView: false,
      platforms: [],
      tableActions: [],
      oldTableColumns: [{
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
      tableColumns: [{
        label: '#',
        prop: 'id',
        width: 55
      }, {
        label: '平台名称',
        prop: 'name',
        width: 150
      }, {
        label: '模型',
        slot: 'models',
        showOverflowTooltip: false
      }],
      tableActionColumn: {
        width: 170
      },

      tableData: [],
      oldTableData: [],
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
        config: null,
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
        const platforms = []

        models.forEach(model => {
          let platform = platforms.find(p => p.id === model.platformId)
          console.log('platform', platform)
          if (!platform) {
            platform = {
              id: model.platformId,
              name: model.platformName,
              models: []
            }
            platforms.push(platform)
          }
          platform.models.push({ ... model })
          this.oldTableData.push({ ... model })
        })
        console.log('platforms', platforms)
        this.tableData.splice(0, this.tableData.length, ...platforms)
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
    handleCreate(platformId) {
      this.editModel.id = null
      this.editModel.name = ''
      this.editModel.showName = ''
      this.editModel.platformId = platformId || null
      this.editModel.platformName = null
      this.editModel.level = null
      this.editModel.levelId = null
      this.editModel.state = null
      this.editModel.path = null
      this.editModel.config = null
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
      this.editModel.config = row.config
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
        showName: row.showName,
        state: row.state === 1 ? 2 : 1,
        levelId: row.levelId,
        path: row.path,
        config: row.config,
        remark: row.remark
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
.model-tag {
  margin-right: 5px;
  margin-bottom: 4px;
  cursor: pointer;
}
.model-tag:hover {
  user-select: none;
}
.model-tag.el-tag--danger:hover {
  background-color: darken(#ffeded, 5%);
}
.model-tag.el-tag--success:hover {
  background-color: darken(#e7faf0, 5%);
}
.model-tag.el-tag--primary:hover {
  background-color: darken(#e8f4ff, 5%);
}
.model-tag.el-tag--info:hover {
  background-color: darken(#f4f4f5, 5%);
}

</style>
