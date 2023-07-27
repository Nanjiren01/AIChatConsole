<template>
  <div class="page-container">
    <ai-table
      :table-actions="tableActions"
      :table-columns="tableColumns"
      :table-data="tableData"
      :pagination="pagination"
      @refresh="handleRefresh"
    >
      <template #topActions>
        <!-- <el-button type="primary" icon="el-icon-plus" @click="handleCreate">新增</el-button> -->
        <!-- <el-button type="danger" icon="el-icon-delete" @click="handleDelete">删除</el-button> -->
      </template>
      <!-- <template v-slot:rowActions="slotProps">
        <el-button icon="el-icon-set-up" @click.stop="handleShowChangePassword(slotProps.row)">修改密码</el-button>
      </template> -->

      <!-- <template v-slot:entryId="slotProps">
        <el-tag :type="slotProps.row.entryId == 1 ? 'success' : slotProps.row.entryId == 2 ? 'primary' : 'danger' ">
          {{ getEntryName(slotProps.row.entryId) }}
        </el-tag>
      </template> -->

      <template v-slot:state="props">
        <el-tag :type="props.row.state == 10 ? 'primary' : 'info' ">{{ getStateName(props.row.state) }}</el-tag>
        <el-button type="text" style="margin-left: 10px;" @click.native.stop="handleToggle(props.row)">
          点此{{ props.row.state == 10 ? '取消发布' : '发布' }}
        </el-button>
      </template>

      <template v-slot:builtin="props">
        <el-switch :value="props.row.builtin" />
      </template>

      <template v-slot:alone="props">
        {{ getAloneName(props.row.alone) }}
      </template>
    </ai-table>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import AiTable from '@/components/Table'
import { getAllPlugins, togglePlugin } from '@/api/plugin'

export default {
  name: 'PluginIndex',
  components: { AiTable },
  data() {
    return {
      loading: false,
      tableActions: false,
      tableActionColumn: {
        width: 200
      },
      tableColumns: [{
        label: '#',
        prop: 'id',
        width: 55
      }, {
        label: 'uuid',
        prop: 'uuid'
      // }, {
      //   label: '昵称',
      //   prop: 'name'
      }, {
        label: '名称',
        prop: 'name'
      }, {
        label: '类型',
        slot: 'alone'
      }, {
        label: '内置',
        slot: 'builtin'
      }, {
        label: '状态',
        slot: 'state'
      }, {
        label: '创建时间',
        prop: 'createTime',
        width: 140
      }],
      tableData: [],
      pagination: {
        total: 0,
        showDetail: false
      }
    }
  },
  computed: {
  },
  created() {
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload() {
      this.loading = true
      getAllPlugins().then(resp => {
        // console.log('resp', resp)
        this.tableData = resp.data.map(plugin => {
          return {
            id: plugin.id,
            name: plugin.name,
            uuid: plugin.uuid,
            alone: plugin.alone,
            builtin: plugin.builtin,
            state: plugin.state,
            createTime: plugin.createTime
          }
        })
        this.pagination.total = resp.data.length
      }).finally(() => {
        this.loading = false
      })
    },
    handleToggle(row) {
      this.loading = true
      togglePlugin(row.uuid, row.state !== 10).then(resp => {
        // console.log('resp', resp)
        this.reload()
        this.$message.success('操作成功！')
      }).finally(() => {
        this.loading = false
      })
    },
    handleRefresh() {
      this.reload()
    },
    getAloneName(alone) {
      return alone ? '全局插件' : '模型插件'
    },
    getStateName(state) {
      return ({
        0: '草稿',
        10: '已发布'
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
