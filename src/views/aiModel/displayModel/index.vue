<template>
  <el-drawer
    title="前台用户模型列表（展示模型管理）"
    size="80%"
    :visible="show"
    :before-close="handleClose"
    class="model-drawer"
  >
    <el-alert type="success" style="margin: 10px" :closable="false">
      该列表第一项将作为新建会话时的默认模型，已有会话若未修改过会话级别的配置，也会同步修改会话所使用的模型。
    </el-alert>
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
      <template v-slot:rowActions="slotProps">
        <el-button type="primary" plain icon="el-icon-edit" @click.stop="handleShowEdit(slotProps.row)">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" plain @click="handleDelete(slotProps.row)">删除</el-button>
      </template>

      <template v-slot:contentType="slotProps">
        <span>{{ slotProps.row.contentType }}</span>
      </template>

      <template v-slot:name="slotProps">
        <img
          v-if="slotProps.row.avatarEmoji"
          class="emoji"
          style="cursor: pointer;width: 15px; height: 15px;margin-right: 5px;"
          :src="`/emoji-date-apple-img-64-15.0.1/${slotProps.row.avatarEmoji}.png`"
        >
        <span>{{ slotProps.row.name }}</span>
      </template>

      <template v-slot:show="slotProps">
        <el-tag v-if="slotProps.row.show" type="success">展示</el-tag>
        <el-tag v-else type="warning">不展示</el-tag>
      </template>

    </ai-table>

    <detail
      :display-model="form"
      :dialog-visible.sync="dialogVisible"
      @changed="handleChanged"
    />

  </el-drawer>
</template>

<script>
// import { mapGetters } from 'vuex'
import AiTable from '@/components/Table'
import { getDisplayModels, deleteDisplayModel } from '@/api/aiModel.js'
import Detail from './detail'

export default {
  name: 'AiPlatformIndex',
  components: { AiTable, Detail },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableActions: [],
      tableColumns: [{
        label: '#',
        prop: 'id',
        width: 55
      }, {
        label: 'uuid',
        prop: 'uuid'
      }, {
        label: '前台展示名称',
        slot: 'name',
        width: 180
      }, {
        label: '类型',
        slot: 'contentType'
      }, {
        label: '置顶值',
        prop: 'order',
        width: 85
      }, {
        label: '前台显示',
        slot: 'show',
        width: 85
      }, {
        label: '模型总数',
        prop: 'modelsCount',
        width: 75
      }, {
        label: '备注',
        prop: 'remark'
      }, {
        label: '创建时间',
        prop: 'createTime',
        width: 135
      }],
      tableActionColumn: {
        width: 180
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
        uuid: null,

        name: null,
        remark: null,

        state: null,
        order: null,

        contentType: null,
        createTime: null,
        updateTime: null
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
      getDisplayModels().then(resp => {
        console.log('resp', resp)
        this.tableData = resp.data || []
        this.pagination.total = this.tableData.length
        if (this.dialogVisible) {
          const row = this.tableData.filter(item => item.id === row.id)
          this.handleShowEdit(row)
        }
      })
    },
    handleRefresh() {
      this.reload()
    },
    handleCreate() {
      this.dialogVisible = true
      this.form.id = null
      this.form.name = ''
      this.form.state = 1
      this.form.order = +new Date()
      this.form.remark = ''
      this.form.desc = ''
    },
    handleClose() {
      this.$emit('close')
    },
    // handleEdit(row) {
    //   console.log('edit', row)
    // },
    handleDelete(row) {
      this.$confirm('确定删除' + row.name + '？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'long-message',
        width: '600px',
        type: 'warning'
      }).then(async() => {
        deleteDisplayModel(row.uuid).then(resp => {
          console.log('resp', resp)
          this.$message.success('操作成功！')
          this.reload()
        })
      })
    },
    handleShowEdit(row) {
      this.dialogVisible = true
      this.form.id = row.id
      this.form.uuid = row.uuid
      this.form.name = row.name
      this.form.desc = row.desc
      this.form.avatarEmoji = row.avatarEmoji
      this.form.remark = row.remark || ''
      this.form.state = row.state
      this.form.order = row.order
      this.form.contentType = row.contentType || ''
      this.form.createTime = row.createTime
      this.form.updateTime = row.updateTime
    },
    handleChanged() {
      this.reload()
      this.dialogVisible = false
      this.$emit('changed')
    },
    handleCancel() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .model-drawer ::v-deep .el-drawer__body {
    height: calc(100% - 77px);
    overflow: auto;
  }
  </style>
