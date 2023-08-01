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
      <template v-slot:balanceProtocol="props">
        <el-tag
          v-if="props.row.balanceProtocol == 'OpenAI' || props.row.baseUrl && props.row.baseUrl.startsWith('https://gptapi.nextweb.fun/')"
          type="success"
        >OpenAI</el-tag>
        <el-tag v-else-if="props.row.balanceProtocol == 'Other'" type="primary">其他</el-tag>
        <el-tag v-else type="info">未知</el-tag>
      </template>

      <template v-slot:chatProtocol="slotProps">
        <el-tag v-if="slotProps.row.chatProtocol === 'OpenAiChat'">OpenAI聊天协议</el-tag>
        <el-tag v-if="slotProps.row.chatProtocol === 'BaiduChat'">百度聊天协议</el-tag>
        <el-tag v-if="slotProps.row.chatProtocol === 'AliQwenChat'">阿里千问聊天协议</el-tag>
      </template>

      <template v-slot:baseUrl="props">
        <span v-if="props.row.baseUrl">{{ props.row.baseUrl }}</span>
        <i v-else style="color: #888">
          系统默认（
          <template v-if="props.row.chatProtocol === 'OpenAiChat'">https://api.openai.com</template>
          <template v-if="props.row.chatProtocol === 'BaiduChat'">https://aip.baidubce.com/rpc/2.0/ai_custom</template>
          <template v-if="props.row.chatProtocol === 'AliQwenChat'">×</template>
          ）
        </i>
      </template>

    </ai-table>

    <el-dialog
      title="平台创建/修改"
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
          <el-form-item label="聊天协议">
            <el-select v-model="form.chatProtocol">
              <el-option label="OpenAI聊天协议" value="OpenAiChat" />
              <el-option label="百度聊天协议" value="BaiduChat" />
              <el-option label="阿里千问聊天协议" value="AliQwenChat" />
            </el-select>
          </el-form-item>
          <el-form-item label="余额协议">
            <el-select v-model="form.balanceProtocol">
              <el-option label="OpenAI" value="OpenAI" />
              <el-option label="其他" value="Other" />
            </el-select>
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
        label: '聊天协议',
        slot: 'chatProtocol'
      }, {
        label: 'BASE_URL',
        slot: 'baseUrl'
      }, {
        label: '余额协议',
        slot: 'balanceProtocol',
        width: 85
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
        remark: null,
        balanceProtocol: null,
        chatProtocol: null
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
            balanceProtocol: platform.balanceProtocol,
            chatProtocol: platform.chatProtocol,
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
      this.form.balanceProtocol = ''
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
      this.form.balanceProtocol = row.balanceProtocol || ''
      this.form.chatProtocol = row.chatProtocol || ''
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
          remark: this.form.remark,
          balanceProtocol: this.form.balanceProtocol
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
        remark: this.form.remark,
        balanceProtocol: this.form.balanceProtocol,
        chatProtocol: this.form.chatProtocol
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
        remark: row.remark,
        chatProtocol: row.chatProtocol
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
