<template>
  <div class="page-container">
    <ai-table
      :loading="loading"
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
      </template>

      <template v-slot:name="props">
        <span style="display: flex;">
          <img
            v-if="props.row.avatar"
            class="emoji"
            style="width: 20px; height: 20px;"
            :src="`/emoji-date-apple-img-64-15.0.1/${props.row.avatar}.png`"
          >
          {{ props.row.name }}
        </span>
      </template>

      <template v-slot:state="props">
        <el-tag :type="props.row.state === 0 ? 'info' : 'success'">{{ getStateText(props.row.state) }}</el-tag>
      </template>
      <template v-slot:lang="props">
        <span>{{ getLangText(props.row.lang) }}</span>
      </template>

      <template v-slot:count="props">
        <el-tag>{{ props.row.contexts.length }}</el-tag>
      </template>

    </ai-table>

    <detail
      v-if="detailModel"
      ref="detail"
      :show="showDetail"
      :mask-entity="detailModel"
      :models="ALL_MODELS"
      @changed="handleChanged"
      @close="handleCloseDetail"
    />
  </div>
</template>

<script>
import AiTable from '@/components/Table'
import { getMasks } from '@/api/mask'
import Detail from './detail'
import { getAiModels } from '@/api/aiModel.js'

export default {
  name: 'MaskIndex',
  components: { AiTable, Detail },
  data() {
    return {
      loading: false,
      showDetail: false,
      tableActions: [],
      tableColumns: [{
        label: '#',
        prop: 'id',
        width: 100
      }, {
        label: '名称',
        slot: 'name'
      }, {
        label: '描述',
        prop: 'description'
      }, {
        label: '语言',
        slot: 'lang',
        width: 75
      }, {
        label: '类型',
        prop: 'type',
        width: 100
      }, {
        label: '状态',
        slot: 'state',
        width: 80
      // }, {
      //   label: '上下文数量',
      //   slot: 'count',
      //   width: 100
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
        width: 95
      },
      tableData: [],
      pagination: {
        total: 0,
        showDetail: false
      },
      detailModel: {
        id: null,
        name: '',
        description: null,
        avatar: '',
        state: null,
        lang: null,
        hideContext: null,
        // count: null,
        type: '',
        modelConfigJson: '',
        contextJson: '',
        createTime: null,
        updateTime: null
      },
      ALL_MODELS: []
    }
  },
  mounted() {
    this.reload()
    this.loadModels()
  },
  methods: {
    reload() {
      getMasks().then(resp => {
        const items = resp.data || []
        this.tableData = items.map(item => {
          return {
            id: item.id,
            name: item.name,
            description: item.description,
            state: item.state,
            avatar: item.avatar,
            lang: item.lang,
            type: item.type,
            hideContext: item.hideContext,
            modelConfigJson: item.modelConfigJson,
            contextJson: item.contextJson,
            createTime: item.createTime,
            updateTime: item.updateTime
          }
        })
        this.pagination.total = this.tableData.length
      }).then(() => {
        if (this.showDetail) {
          const row = this.tableData.filter(r => r.id === this.detailModel.id)[0]
          // console.log('row', row)
          if (row) {
            this.updateDetail(row)
          }
        }
      })
    },
    loadModels() {
      getAiModels().then(resp => {
        console.log('resp', resp)
        const models = resp.data || []
        this.ALL_MODELS.splice(0, this.ALL_MODELS.length)
        models.forEach(model => {
          const exists = this.ALL_MODELS.filter(m => m.name === model.name).length > 0
          if (!exists) {
            this.ALL_MODELS.push({
              id: model.id,
              name: model.name
            })
          }
          // return {
          //   id: model.id,
          //   name: model.name,
          //   showName: model.showName,
          //   platformId: model.platformId,
          //   platformName: model.platformName,
          //   state: model.state,
          //   level: model.level,
          //   levelId: model.levelId,
          //   path: model.path,
          //   remark: model.remark,
          //   createTime: model.createTime
          //   // updateTime: key.updateTime
          // }
        })
      })
    },
    updateDetail(row) {
      this.detailModel.id = row.id
      this.detailModel.name = row.name || ''
      this.detailModel.description = row.description || ''
      this.detailModel.avatar = row.avatar || ''
      this.detailModel.lang = row.lang || ''
      this.detailModel.state = row.state || 0
      this.detailModel.type = row.type || ''
      this.detailModel.hideContext = row.hideContext || false
      this.detailModel.modelConfigJson = row.modelConfigJson || ''
      this.detailModel.contextJson = row.contextJson || ''
      this.detailModel.createTime = row.createTime
      this.detailModel.updateTime = row.updateTime
      this.$nextTick(() => {
        this.$refs.detail.reload()
      })
    },
    handleRefresh() {
      this.reload()
    },
    handleCreate() {
      this.showDetail = true
      this.updateDetail({
        id: null,
        name: '',
        description: '',
        avatar: '1f600',
        lang: 'cn',
        state: 0,
        type: '',
        hideContext: false,
        modelConfigJson: JSON.stringify({
          model: 'gpt-3.5-turbo',
          temperature: 1.0,
          max_tokens: 2000,
          presence_penalty: 0,
          frequency_penalty: 0,
          sendMemory: true,
          historyMessageCount: 8,
          compressMessageLengthThreshold: 1000
        }),
        contextJson: '',
        createTime: null,
        updateTime: null
      })
    },
    handleEdit(row) {
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
    getStateText(state) {
      if (state === 0) {
        return '草稿'
      } else if (state === 10) {
        return '已发布'
      } else {
        return state
      }
    },
    getLangText(lang) {
      return ({
        cn: '中文',
        en: '英文'
      })[lang] || lang
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 10px;
}

</style>
