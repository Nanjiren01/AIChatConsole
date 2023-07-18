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

      <template v-slot:state="props">
        <el-tag>{{ getStateText(props.row.state) }}</el-tag>
      </template>

      <template v-slot:count="props">
        <el-tag>{{ props.row.contexts.length }}</el-tag>
      </template>

    </ai-table>

    <detail
      ref="detail"
      :show="showDetail"
      :mask-entity="detailModel"
      @changed="handleChanged"
      @close="handleCloseDetail"
    />
  </div>
</template>

<script>
import AiTable from '@/components/Table'
import { getMasks } from '@/api/mask'
import Detail from './detail'

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
        width: 55
      }, {
        label: '名称',
        prop: 'name'
      }, {
        label: '语言',
        prop: 'lang',
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
        width: 200
      },
      tableData: [],
      pagination: {
        total: 0,
        showDetail: false
      },
      detailModel: {
        id: null,
        name: '',
        avatar: '',
        state: null,
        lang: null,
        // count: null,
        type: '',
        modelConfigJson: '',
        contextJson: '',
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
      getMasks().then(resp => {
        const items = resp.data || []
        this.tableData = items.map(item => {
          return {
            id: item.id,
            name: item.name,
            state: item.state,
            avatar: item.avatar,
            lang: item.lang,
            type: item.type,
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
    updateDetail(row) {
      this.detailModel.id = row.id
      this.detailModel.name = row.name || ''
      this.detailModel.avatar = row.avatar || ''
      this.detailModel.lang = row.lang || ''
      this.detailModel.state = row.state || 0
      this.detailModel.type = row.type || ''
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
        avatar: '',
        lang: '',
        state: 0,
        type: '',
        modelConfigJson: '',
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
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 10px;
}

</style>
