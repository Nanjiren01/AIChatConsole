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
      <!-- <template #topActions>
        <el-button type="primary" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      </template> -->
      <!-- <template v-slot:rowActions="slotProps">
        <el-button type="success" icon="el-icon-edit" @click="handleEdit(slotProps.row)">编辑</el-button>
        <el-button type="warn" icon="el-icon-disabled" @click="toggleEnable(slotProps.row)">
          {{ slotProps.row.state == 1 ? '禁用' : '启用' }}
        </el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleDelete(slotProps.row)">删除</el-button>
      </template> -->
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
import { getAiPlatforms } from '@/api/aiPlatform.js'

export default {
  name: 'AiPlatformIndex',
  components: { AiTable },
  data() {
    return {
      tableActions: false,
      tableColumns: [{
        label: '#',
        prop: 'id',
        width: 55
      }, {
        label: '平台名称',
        prop: 'name'
      }, {
        label: '模型总数',
        prop: 'modelsCount'
      }, {
        label: '状态',
        prop: 'state',
        slot: 'state'
      }, {
        label: '创建时间',
        prop: 'createTime'
      }],
      tableActionColumn: {
        width: 400
      },
      tableData: [],
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
      getAiPlatforms().then(resp => {
        console.log('resp', resp)
        const platforms = resp.data || []
        this.tableData = platforms.map(platform => {
          return {
            id: platform.id,
            name: platform.name,
            state: platform.state,
            modelsCount: platform.modelsCount,
            createTime: platform.createTime
            // updateTime: key.updateTime
          }
        })
        this.pagination.total = this.tableData.length
      })
    },
    handleRefresh() {
      this.reload()
    },
    // handleCreate() {
    //   this.$message.warning('开发中……')
    // },
    // handleEdit(row) {
    //   console.log('edit', row)
    // },
    // handleDelete(row) {
    //   console.log('delete', row)
    // },
    // toggleEnable(row) {
    //   console.log('toggle', row)
    // },
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
