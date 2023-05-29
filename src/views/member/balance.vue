<template>
  <div>
    <ai-table
      :table-actions="tableActions"
      :table-columns="tableColumns"
      :table-data="tableData"
      :table-action-column="tableActionColumn"
      :pagination="pagination"
      @refresh="handleRefresh"
    >
      <template #leftColumns>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item label="tokens">
                <span>{{ props.row.tokens }}</span>
              </el-form-item>
              <el-form-item label="普通聊天次数">
                <span>{{ props.row.chatCount }}</span>
              </el-form-item>
              <el-form-item label="高级聊天次数">
                <span>{{ props.row.advancedChatCount }}</span>
              </el-form-item>
              <el-form-item label="绘画次数">
                <span>{{ props.row.drawCount }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </template>
      <template v-slot:sourceId="slotProps">
        <el-tag>{{ getSourceText(slotProps.row.sourceId) }}</el-tag>
      </template>
      <template v-slot:calcTypeId="slotProps">
        <el-tag>{{ getCalcTypeText(slotProps.row.calcTypeId) }}</el-tag>
      </template>
      <template v-slot:count="slotProps">
        <span>{{ slotProps.row.tokens }}, {{ slotProps.row.chatCount }}, {{ slotProps.row.advancedChatCount }}, {{ slotProps.row.drawCount }}</span>
      </template>
      <template v-slot:state="slotProps">
        <el-tag :type="slotProps.row.state == 1 ? 'primary' : 'danger'">{{ getStateText(slotProps.row.state) }}</el-tag>
      </template>
      <template v-slot:rowActions="slotProps">
        <el-button
          v-if="slotProps.row.state == 1 || slotProps.row.state == 2"
          :type="slotProps.row.state == 2 ? 'primary' : 'danger'"
          plain
          @click.stop="handleToggleEnable(slotProps.row)"
        >
          {{ slotProps.row.state == 1 ? '废除' : '恢复' }}
        </el-button>
        <el-button v-if="slotProps.row.state == 1" type="primary" @click.stop="handleShowQuotaEditDialog(slotProps.row)">赠送</el-button>
      </template>
    </ai-table>

    <el-dialog
      :title="'为' + member.username + '添加使用次数'"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="50%"
    >
      <el-form label-width="160px">
        <el-form-item label="类型">
          <el-select v-model="increaseType">
            <el-option label="剩余聊天次数" :value="1" />
            <el-option label="剩余高级聊天次数（GPT4）" :value="2" />
            <el-option label="剩余tokens" :value="3" />
            <el-option label="剩余绘画次数" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="次数">
          <el-input v-model="increaseCount" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="increasing" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="increasing" @click="handleQuotaAdd">
          {{ increasing ? '处理中' : '确 定' }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import AiTable from '@/components/Table'
import { getBalancesByUserId, increaseBalance, setDisable, setEnable } from '@/api/balance'

export default {
  name: 'Balances',
  components: { AiTable },
  props: {
    userId: {
      type: Number,
      default: 0
    },
    member: {
      type: Object,
      default: () => {}
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
        label: '来源',
        prop: 'sourceId',
        slot: 'sourceId'
      }, {
        label: '类型',
        prop: 'calcTypeId',
        slot: 'calcTypeId'
      }, {
        label: '次数',
        slot: 'count',
        width: 150
      }, {
        label: '状态',
        prop: 'state',
        slot: 'state',
        width: 75
      }, {
        label: '创建时间',
        prop: 'createTime',
        width: 140
      }, {
        label: '过期时间',
        prop: 'expireTime',
        width: 140
      }],
      tableData: [],
      tableActionColumn: {
        width: 160
      },
      pagination: {
        total: 0,
        showDetail: false
      },

      dialogVisible: false,
      increaseType: null,
      increaseCount: 0,
      increasing: false,
      increaseBalanceId: 0
    }
  },
  methods: {
    reload() {
      getBalancesByUserId(this.userId).then(resp => {
        console.log('resp', resp)
        this.tableData = resp.data.map(balance => {
          return {
            id: balance.id,
            sourceId: balance.sourceId,
            source: balance.source,
            calcTypeId: balance.calcTypeId,
            calcType: balance.calcType,
            tokens: balance.tokens,
            chatCount: balance.chatCount,
            advancedChatCount: balance.advancedChatCount,
            drawCount: balance.drawCount,
            createTime: balance.createTime,
            expireTime: balance.expireTime,
            state: balance.state
          }
        })
        this.pagination.total = this.tableData.length
      })
    },
    handleRefresh() {
      this.reload()
    },
    handleToggleEnable(row) {
      this.$confirm(
        row.state === 1 ? ('套餐废除后用户将无法继续使用，确定废除#' + row.id + '套餐吗？') : ('确认恢复#' + row.id + '套餐吗？'),
        '操作确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async() => {
        if (row.state === 1) {
          setDisable(row.id).then(() => {
            this.$message.success('操作成功！')
            this.reload()
          })
        } else {
          setEnable(row.id).then(() => {
            this.$message.success('操作成功！')
            this.reload()
          })
        }
      })
    },
    handleShowQuotaEditDialog(row) {
      this.dialogVisible = true
      this.increaseCount = 0
      this.increaseType = 1
      this.increaseBalanceId = row.id
    },
    handleQuotaAdd() {
      const count = +this.increaseCount
      if (isNaN(count)) {
        this.$message.error('次数填写错误！')
        return
      }
      if (count <= 0) {
        this.$message.error('次数必须是一个大于0的数！')
        return
      }
      this.increasing = true
      increaseBalance(this.member.id, this.increaseBalanceId, this.increaseType, count).then(resp => {
        console.log('resp', resp)
        this.$message.success('操作成功！')
        this.dialogVisible = false
        this.$emit('changed')
      }).catch(err => {
        console.error(err)
      }).finally(() => {
        this.increasing = false
      })
    },
    getSourceText(sourceId) {
      return ({
        1: '注册',
        2: '每日签到',
        3: '邀请新用户',
        4: '购买',
        5: '后台操作'
      })[sourceId]
    },
    getCalcTypeText(calcTypeId) {
      return ({
        1: '总额',
        2: '每天',
        3: '每小时',
        4: '每3小时'
      })[calcTypeId]
    },
    getStateText(state) {
      return ({
        0: '初始化',
        1: '正常',
        2: '废除'
      })[state]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
