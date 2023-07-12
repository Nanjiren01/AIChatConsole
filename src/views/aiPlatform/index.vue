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
        <el-button type="primary" plain icon="el-icon-edit" @click.stop="handleShowEdit(slotProps.row)">编辑</el-button>
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

      <template v-slot:state="slotProps">
        <el-tag v-if="slotProps.row.state == 1" type="success">启用</el-tag>
        <el-tag v-else type="danger">停用</el-tag>
      </template>

      <template v-slot:baseUrl="props">
        <span v-if="props.row.baseUrl">{{ props.row.baseUrl }}</span>
        <i v-else style="color: #888">系统默认（https://api.openai.com）</i>
      </template>

    </ai-table>

    <el-dialog
      title="平台修改"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <div style="margin: 0 auto;">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="名称">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="BASE_URL">
            <el-input v-model="form.baseUrl" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSubmit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import AiTable from '@/components/Table'
import { getAiPlatforms, updateAiPlatform, createAiPlatform } from '@/api/aiPlatform.js'

export default {
  name: 'AiPlatformIndex',
  components: { AiTable },
  data() {
    return {
      tableActions: [],
      tableColumns: [{
        label: '#',
        prop: 'id',
        width: 55
      }, {
        label: '平台名称',
        prop: 'name'
      }, {
        label: 'BASE_URL',
        slot: 'baseUrl'
      }, {
        label: '模型总数',
        prop: 'modelsCount',
        width: 75
      }, {
        label: '备注',
        prop: 'remark'
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
        showDetail: false
      },
      loading: false,

      dialogVisible: false,
      form: {
        id: null,
        name: null,
        baseUrl: null,
        remark: null
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
            baseUrl: platform.baseUrl,
            remark: platform.remark,
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
    handleCreate() {
      this.dialogVisible = true
      this.form.id = null
      this.form.name = ''
      this.form.state = 0
      this.form.baseUrl = ''
      this.form.remark = ''
    },
    // handleEdit(row) {
    //   console.log('edit', row)
    // },
    // handleDelete(row) {
    //   console.log('delete', row)
    // },
    handleShowEdit(row) {
      this.dialogVisible = true
      this.form.id = row.id
      this.form.name = row.name
      this.form.state = row.state
      this.form.baseUrl = row.baseUrl || ''
      this.form.remark = row.remark || ''
    },
    handleEditSubmit() {
      if (!this.form.name) {
        this.$message.error('名称不能为空！')
        return
      }
      if (this.form.baseUrl) {
        if (!this.form.baseUrl.startsWith('http')) {
          this.$message.error('BASE_URL必须以http开头')
          return
        }
      }
      this.loading = true
      if (!this.form.id) {
        createAiPlatform({
          // id: this.form.id,
          name: this.form.name,
          state: this.form.state,
          baseUrl: this.form.baseUrl,
          remark: this.form.remark
        }).then(() => {
          this.$message.success('操作成功！')
          this.reload()
          this.dialogVisible = false
        }).finally(() => {
          this.loading = false
        })
        return
      }
      updateAiPlatform({
        id: this.form.id,
        name: this.form.name,
        state: this.form.state,
        baseUrl: this.form.baseUrl,
        remark: this.form.remark
      }).then(() => {
        this.$message.success('操作成功！')
        this.reload()
        this.dialogVisible = false
      }).finally(() => {
        this.loading = false
      })
    },
    toggleEnable(row) {
      this.loading = true
      this.$message.info('处理中……')
      updateAiPlatform({
        id: row.id,
        name: row.name,
        state: row.state === 1 ? 2 : 1,
        baseUrl: row.baseUrl,
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
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 10px;
}

</style>
