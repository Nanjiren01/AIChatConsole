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
        <el-button type="danger" icon="el-icon-delete" plain @click="handleDelete(slotProps.row)">删除</el-button>
      </template>

      <template v-slot:state="slotProps">
        <el-tag v-if="slotProps.row.state == 1" type="success">启用</el-tag>
        <el-tag v-else type="danger">停用</el-tag>
      </template>
      <template v-slot:balanceProtocol="props">
        <el-tag :type="props.row.state !== 1 ? 'info' : '' ">
          <span
            v-if="props.row.balanceProtocol == 'OpenAI' || props.row.baseUrl && props.row.baseUrl.startsWith('https://gptapi.nextweb.fun/')"
            type="success"
          >OpenAI</span>
          <span v-else-if="props.row.balanceProtocol == 'GoApi'" type="info">GoApi</span>
          <span v-else-if="props.row.balanceProtocol == 'AImage'" type="success">AImage</span>
          <span v-else-if="props.row.balanceProtocol == 'Other'" type="primary">其他</span>
          <span v-else type="info">未知</span>
        </el-tag>
      </template>

      <template v-slot:chatProtocol="slotProps">
        <el-tag :type="slotProps.row.state !== 1 ? 'info' : '' ">
          <span v-if="slotProps.row.chatProtocol === 'OpenAiChat'">OpenAI聊天协议</span>
          <span v-if="slotProps.row.chatProtocol === 'AzureOpenAiChat'">Azure OpenAI聊天协议</span>
          <span v-if="slotProps.row.chatProtocol === 'ZhipuChat'">智谱清言（GLM）聊天协议</span>
          <span v-else-if="slotProps.row.chatProtocol === 'BaiduChat'">百度聊天协议</span>
          <span v-else-if="slotProps.row.chatProtocol === 'AliQwenChat'">阿里千问聊天协议</span>
          <span v-else-if="slotProps.row.chatProtocol === 'EmbeddingMjProxyDraw'">内置MJ-Proxy绘画协议</span>
          <span v-else-if="slotProps.row.chatProtocol === 'MjProxyDraw'">MJ-Proxy绘画协议</span>
          <span v-else-if="slotProps.row.chatProtocol === 'GoApiDraw'">GoApi绘画协议</span>
          <span v-else-if="slotProps.row.chatProtocol === 'AimageDraw'">AImage绘画协议</span>
          <span v-else-if="slotProps.row.chatProtocol === 'MjProxyPlusDraw'">MJ-Proxy-Plus绘画协议</span>
        </el-tag>
      </template>

      <template v-slot:baseUrl="props">
        <span v-if="props.row.baseUrl">{{ props.row.baseUrl }}</span>
        <i v-else style="color: #888">
          系统默认（
          <template v-if="props.row.chatProtocol === 'OpenAiChat'">https://api.openai.com</template>
          <template v-else-if="props.row.chatProtocol === 'AzureOpenAiChat'">×</template>
          <template v-else-if="props.row.chatProtocol === 'ZhipuChat'">https://open.bigmodel.cn/api/paas/v4</template>
          <template v-else-if="props.row.chatProtocol === 'BaiduChat'">https://aip.baidubce.com/rpc/2.0/ai_custom</template>
          <template v-else-if="props.row.chatProtocol === 'AliQwenChat'">×</template>
          <template v-else-if="props.row.chatProtocol === 'EmbeddingMjProxyDraw'">×</template>
          <template v-else-if="props.row.chatProtocol === 'MjProxyDraw'">×</template>
          <template v-else-if="props.row.chatProtocol === 'GoApiDraw'">https://api.midjourneyapi.xyz</template>
          <template v-else-if="props.row.chatProtocol === 'AimageDraw'">https://aimageapi.nanjiren.online/draw</template>
          <template v-else-if="props.row.chatProtocol === 'MjProxyPlusDraw'">×</template>
          ）
        </i>
      </template>

    </ai-table>

    <detail
      :platform="form"
      :dialog-visible.sync="dialogVisible"
      @changed="handleChanged"
    />

  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import AiTable from '@/components/Table'
import { getAiPlatforms, updateAiPlatform, deleteAiPlatform } from '@/api/aiPlatform.js'
import Detail from './detail'

export default {
  name: 'AiPlatformIndex',
  components: { AiTable, Detail },
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
        width: 260
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
        state: null,
        baseUrl: null,
        remark: null,
        balanceProtocol: null,
        chatProtocol: null,
        config: null
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
            config: platform.config,
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
      this.form.state = 1
      this.form.baseUrl = ''
      this.form.remark = ''
      this.form.balanceProtocol = ''
      this.form.config = null
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
        deleteAiPlatform(row.id).then(resp => {
          console.log('resp', resp)
          this.$message.success('操作成功！')
          this.reload()
        })
      })
    },
    handleShowEdit(row) {
      this.dialogVisible = true
      this.form.id = row.id
      this.form.name = row.name
      this.form.state = row.state
      this.form.baseUrl = row.baseUrl || ''
      this.form.remark = row.remark || ''
      this.form.balanceProtocol = row.balanceProtocol || ''
      this.form.chatProtocol = row.chatProtocol || ''
      this.form.config = row.config || ''
    },
    handleChanged() {
      this.reload()
      this.dialogVisible = false
    },
    handleCancel() {
      this.dialogVisible = false
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
        chatProtocol: row.chatProtocol,
        balanceProtocol: row.balanceProtocol,
        config: row.config
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
