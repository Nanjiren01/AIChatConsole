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
        <!-- <el-button type="danger" icon="el-icon-delete" disabled>删除</el-button> -->
      </template>
      <template v-slot:rowActions="slotProps">
        <el-button icon="el-icon-edit" @click.stop="handleEdit(slotProps.row)">编辑</el-button>
        <!-- <el-button v-if="[0, 1, 2].includes(slotProps.row.state)" @click.stop="handleToggleEnable(slotProps.row)">
          {{ slotProps.row.state == 1 ? '下架' : '上架' }}
        </el-button> -->
      </template>

      <template v-slot:tokens="slotProps">
        <el-tag v-if="slotProps.row.tokens == -1" type="success">无限制</el-tag>
        <el-tag v-else-if="slotProps.row.tokens === 0" type="danger">{{ slotProps.row.tokens }}</el-tag>
        <el-tag v-else-if="slotProps.row.tokens < 50" type="warning">{{ slotProps.row.tokens }}</el-tag>
        <el-tag v-else type="success">{{ slotProps.row.tokens }}</el-tag>
      </template>
      <template v-slot:chatCount="slotProps">
        <el-tag v-if="slotProps.row.chatCount == -1" type="success">无限制</el-tag>
        <el-tag v-else-if="slotProps.row.chatCount === 0" type="danger">{{ slotProps.row.chatCount }}</el-tag>
        <el-tag v-else-if="slotProps.row.chatCount < 5" type="warning">{{ slotProps.row.chatCount }}</el-tag>
        <el-tag v-else type="success">{{ slotProps.row.chatCount }}</el-tag>
      </template>
      <template v-slot:advancedChatCount="slotProps">
        <el-tag v-if="slotProps.row.advancedChatCount == -1" type="success">无限制</el-tag>
        <el-tag v-else-if="slotProps.row.advancedChatCount === 0" type="danger">{{ slotProps.row.advancedChatCount }}</el-tag>
        <el-tag v-else-if="slotProps.row.advancedChatCount < 5" type="warning">{{ slotProps.row.advancedChatCount }}</el-tag>
        <el-tag v-else type="success">{{ slotProps.row.advancedChatCount }}</el-tag>
      </template>
      <template v-slot:drawCount="slotProps">
        <el-tag v-if="slotProps.row.drawCount === -1" type="success">无限制</el-tag>
        <el-tag v-else-if="slotProps.row.drawCount === 0" type="danger">{{ slotProps.row.drawCount }}</el-tag>
        <el-tag v-else-if="slotProps.row.drawCount < 5" type="warning">{{ slotProps.row.drawCount }}</el-tag>
        <el-tag v-else type="success">{{ slotProps.row.drawCount }}</el-tag>
      </template>
      <template v-slot:state="slotProps">
        <el-tag v-if="slotProps.row.state == 10" type="success">上架</el-tag>
        <el-tag v-else-if="slotProps.row.state == 20" type="warning">下架</el-tag>
        <el-tag v-else-if="slotProps.row.state == 0" type="primary">草稿</el-tag>
        <el-tag v-else-if="slotProps.row.state == 30" type="info">删除</el-tag>
      </template>
      <template v-slot:calcType="slotProps">
        <el-tag v-if="slotProps.row.calcTypeId == 0">未设置</el-tag>
        <el-tag v-else-if="slotProps.row.calcTypeId == 1">总额</el-tag>
        <el-tag v-else-if="slotProps.row.calcTypeId == 2">按天</el-tag>
        <el-tag v-else-if="slotProps.row.calcTypeId == 3">按小时</el-tag>
        <el-tag v-else-if="slotProps.row.calcTypeId == 4">按3小时</el-tag>
        <el-tag v-else>未知</el-tag>
      </template>

    </ai-table>

    <detail
      ref="detail"
      :show="showDetail"
      :package-entity="detailModel"
      @changed="handleChanged"
      @close="handleCloseDetail"
    />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import AiTable from '@/components/Table'
import { getPackages } from '@/api/package'
import Detail from './detail'

export default {
  name: 'PackageIndex',
  components: { AiTable, Detail },
  data() {
    return {
      showDetail: false,
      tableActions: [{
        key: 'detail',
        label: '详情',
        type: 'primary'
      }],
      tableColumns: [{
        label: '#',
        prop: 'id',
        width: 55
      }, {
        label: 'uuid',
        prop: 'uuid',
        width: 260
      }, {
        label: '标题',
        prop: 'title'
      }, {
        label: '价格',
        prop: 'price',
        width: 75
      }, {
        label: '类型',
        slot: 'calcType',
        width: 100
      }, {
        label: '状态',
        prop: 'state',
        slot: 'state',
        width: 60
      }, {
        label: 'tokens',
        prop: 'tokens',
        slot: 'tokens',
        width: 70
      }, {
        label: '普通聊天次数',
        prop: 'chatCount',
        slot: 'chatCount',
        width: 95
      }, {
        label: '高级聊天次数',
        prop: 'advancedChatCount',
        slot: 'advancedChatCount',
        width: 95
      }, {
        label: '绘画次数',
        prop: 'drawCount',
        slot: 'drawCount',
        width: 70
      }, {
        label: '天数',
        prop: 'days',
        width: 75
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
        width: 100
      },
      tableData: [],
      pagination: {
        total: 0,
        showDetail: false
      },
      detailModel: {
        id: null,
        uuid: null,
        title: null,
        subTitle: null,
        state: null,
        top: null,
        tokens: null,
        days: null,
        price: null,
        calcTypeId: null,
        calcType: null,
        chatCount: null,
        advancedChatCount: null,
        drawCount: null,
        createTime: null,
        updateTime: null
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
      getPackages().then(resp => {
        // console.log('resp', resp)
        const items = resp.data || []
        this.tableData = items.map(item => {
          return {
            id: item.id,
            uuid: item.uuid,
            title: item.title,
            subTitle: item.subTitle,
            state: item.state,
            top: item.top,
            tokens: item.tokens,
            days: item.days,
            price: item.price,
            calcType: item.calcType,
            calcTypeId: item.calcTypeId,
            chatCount: item.chatCount,
            advancedChatCount: item.advancedChatCount,
            drawCount: item.drawCount,
            createTime: item.createTime,
            updateTime: item.updateTime
          }
        })
        this.pagination.total = this.tableData.length
      }).then(() => {
        console.log('this.showDetail', this.showDetail)
        if (this.showDetail) {
          const row = this.tableData.filter(r => r.id === this.detailModel.id)[0]
          console.log('row', row)
          if (row) {
            this.updateDetail(row)
          }
        }
      })
    },
    updateDetail(row) {
      // console.log('updateDetail')
      this.detailModel = {
        id: row.id,
        uuid: row.uuid,
        title: row.title,
        subTitle: row.subTitle,
        top: row.top,
        state: row.state,
        tokens: row.tokens,
        days: row.days,
        price: row.price,
        calcType: row.calcType,
        calcTypeId: row.calcTypeId,
        chatCount: row.chatCount,
        advancedChatCount: row.advancedChatCount,
        drawCount: row.drawCount,
        createTime: row.createTime,
        updateTime: row.updateTime
      }
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
        uuid: '',
        title: '',
        subTitle: '',
        top: 0,
        state: 0,
        days: 0,
        price: null,
        calcType: null,
        calcTypeId: null,
        tokens: 0,
        chatCount: 0,
        advancedChatCount: 0,
        drawCount: 0,
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
    handleChanged() {
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