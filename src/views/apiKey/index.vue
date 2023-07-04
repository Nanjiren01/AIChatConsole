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
        <el-button icon="el-icon-edit" @click.stop="handleEdit(slotProps.row)">编辑</el-button>
        <el-button icon="el-icon-delete" @click.stop="handleDelete(slotProps.row)">删除</el-button>
      </template>
      <!-- <template #columns>
        <el-table-column type="selection" width="55" />
      </template> -->

      <template v-slot:state="slotProps">
        <el-tag v-if="slotProps.row.state == 1" type="success">正常</el-tag>
        <el-tag v-else type="danger">停用</el-tag>
        <el-button style="margin-left: 10px" icon="el-icon-disabled" @click.stop="toggleEnable(slotProps.row)">
          {{ slotProps.row.state == 1 ? '禁用' : '启用' }}
        </el-button>
      </template>

      <template v-slot:model="props">
        <template v-for="md in props.row.models">
          <el-tag :key="md.id" :type="props.row.state === 1 ? 'primary' : 'info'" style="margin: 0 2px;">{{ md.name }}</el-tag>
        </template>
        <el-tag v-if="!props.row.models || props.row.models.length === 0" :type="props.row.state === 1 ? 'success' : 'info'">所有模型</el-tag>
      </template>

      <template v-slot:billingState="props">
        <el-tag v-if="props.row.billingState == 0" type="warning">未知</el-tag>
        <el-tag v-else-if="props.row.billingState == 1" type="success">正常</el-tag>
        <el-tag v-else-if="props.row.billingState == 10" type="danger">异常</el-tag>
        <el-tag v-else-if="props.row.billingState == 11" type="danger">禁用</el-tag>
        <el-tag v-else-if="props.row.billingState == 12" type="danger">过期</el-tag>
        <el-tag v-else-if="props.row.billingState == 13" type="danger">非法</el-tag>
        <el-tag v-else-if="props.row.billingState == 14" type="danger">欠费</el-tag>
      </template>

      <template v-slot:billingUsage="props">
        <template v-if="props.row.billingUsage > -1">
          <span>${{ props.row.billingUsage }} / ${{ props.row.billingSubs }}</span>
        </template>
      </template>

      <template v-slot:platformName="slotProps">
        <el-tag>{{ slotProps.row.platformName }}</el-tag>
      </template>

      <template #header>
        <div style="margin: 5px 0">
          <el-alert
            title="只有处于启用状态的key才会被使用"
            type="info"
            :closable="false"
          />
        </div>
        <div style="margin: 5px 0">
          <el-alert
            title="账户状态及余额后台每小时更新一次（仅支持OpenAI），如需要立即更新，可以点击编辑后直接保存（然后过10秒钟刷新本页面）"
            type="info"
            :closable="false"
          />
        </div>
        <div style="margin: 5px 0">
          <el-alert
            title="账户状态异常时，系统不会将此key禁用，需要管理员手动操作"
            type="info"
            :closable="false"
          />
        </div>
      </template>

    </ai-table>

    <api-key-edit
      v-if="editShow"
      :api-key="edit"
      :all-models="allModels"
      :platforms="platforms"
      @close="handleCloseEditDialog"
      @created="handleCreated"
    />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import AiTable from '@/components/Table'
import ApiKeyEdit from './edit'
import { getApiKeys, storeApiKey, deleteApiKey } from '@/api/apiKey.js'
import { getAiPlatforms } from '@/api/aiPlatform.js'
import { getAiModels } from '@/api/aiModel.js'

export default {
  name: 'UserIndex',
  components: { AiTable, ApiKeyEdit },
  data() {
    return {
      platforms: [],
      allModels: [],
      tableActions: [],
      tableColumns: [{
        label: '#',
        prop: 'id',
        width: 55
      }, {
        label: '平台',
        prop: 'platformName',
        slot: 'platformName',
        width: 120
      }, {
        label: 'api key',
        prop: 'key'
      // }, {
      //   label: '可用模型',
      //   prop: 'models'
      }, {
        label: '使用次数',
        prop: 'callCount',
        width: 80
      }, {
        label: '状态',
        slot: 'state',
        width: 150
      }, {
        label: '适用模型',
        slot: 'model'
      }, {
        label: '账户状态',
        slot: 'billingState',
        width: 75
      }, {
        label: '余额',
        slot: 'billingUsage',
        width: 100
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
        width: 180
      },
      tableData: [],
      pagination: {
        total: 0,
        showDetail: false
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
    this.reloadPlatforms()
    this.reloadModels()
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
            modelIds: key.models.map(m => m.id),
            quota: key.quota,
            callCount: key.callCount,
            state: key.state,
            remark: key.remark,
            billingState: key.billingState,
            billingUsage: key.billingUsage,
            billingSubs: key.billingSubs,
            creatorName: key.creatorName,
            createTime: key.createTime,
            updateTime: key.updateTime
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
    reloadModels() {
      getAiModels().then(resp => {
        const models = resp.data || []
        this.allModels.splice(0, this.allModels.length)
        this.allModels.push(...models)
      })
    },
    handleRefresh() {
      this.reload()
    },
    handleCreate() {
      // this.$message.warning('开发中……')
      this.editShow = true
      this.edit.id = 0
      this.edit.platformId = null
      this.edit.key = null
      this.edit.modelIds = []
      this.edit.state = null
      this.edit.remark = null
      this.edit.billingState = null
      this.edit.billingUsage = null
      this.edit.billingSubs = null
      this.edit.creatorName = null
      this.edit.createTime = null
    },
    handleEdit(row) {
      // console.log('edit', row)
      this.editShow = true
      this.edit.id = row.id
      this.edit.platformId = row.platformId
      this.edit.key = row.key
      this.edit.modelIds = row.modelIds
      this.edit.state = row.state
      this.edit.remark = row.remark
      this.edit.billingState = row.billingState
      this.edit.billingUsage = row.billingUsage
      this.edit.billingSubs = row.billingSubs
      this.edit.creatorName = row.creatorName
      this.edit.createTime = row.createTime
    },
    handleDelete(row) {
      this.$confirm('确定删除' + row.key + '？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'long-message',
        width: '600px',
        type: 'warning'
      }).then(async() => {
        deleteApiKey(row.id).then(resp => {
          console.log('resp', resp)
          this.$message.success('操作成功！')
          this.reload()
        })
      })
    },
    toggleEnable(row) {
      // console.log('toggle', row)
      this.$confirm('确定' + (row.state === 1 ? '停用' : '启用') + row.key + '？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'long-message',
        width: '600px',
        type: 'warning'
      }).then(async() => {
        const targetState = row.state === 1 ? 2 : 1
        storeApiKey(row.id, row.key, targetState, row.platformId).then(resp => {
          console.log('resp', resp)
          this.$message.success('操作成功！')
          this.reload()
        })
      })
    },
    getStateName(state) {
      return ({
        1: '启用',
        2: '停用'
      })[state] || '未知'
    },
    handleCloseEditDialog() {
      this.editShow = false
    },
    handleCreated() {
      this.editShow = false
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

<style>
.long-message {
  width: 600px;
}
</style>
