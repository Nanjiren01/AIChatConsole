<template>
  <div>
    <ai-table
      v-loading="loading"
      :table-actions="tableActions"
      :table-columns="tableColumns"
      :table-data="tableData"
      :table-action-column="tableActionColumn"
      :pagination="pagination"
      @pageSizeChanged="handlePageSizeChange"
      @pageCurrentChanged="handlePageCurrentChanged"
      @refresh="handleRefresh"
    >
      <template #leftColumns>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item label="tokens">
                <span>{{ props.row.tokens }}</span>
              </el-form-item>
              <el-form-item label="普通聊天积分">
                <span>{{ props.row.chatCount }}</span>
              </el-form-item>
              <el-form-item label="高级聊天积分">
                <span>{{ props.row.advancedChatCount }}</span>
              </el-form-item>
              <el-form-item label="绘画积分">
                <span>{{ props.row.drawCount }}</span>
              </el-form-item>
            </el-form>
            <el-alert v-if="props.row.calcTypeId == 1" title="此为总额套餐，以上数值将会随着使用而减少" type="success" />
            <el-alert v-if="[2, 3, 4].includes(props.row.calcTypeId)" title="此为周期套餐，以上数值表示周期内的总额，不会随着使用而减少" type="success" />
          </template>
        </el-table-column>
      </template>
      <template #topActions>
        <el-button type="primary" @click="handleShowAddPackageDialog">增加套餐</el-button>
      </template>
      <template v-slot:sourceId="slotProps">
        <el-tag :type="slotProps.row.expired ? 'info' : '' ">{{ getSourceText(slotProps.row.sourceId) }}</el-tag>
      </template>
      <template v-slot:calcTypeId="slotProps">
        <el-tag :type="slotProps.row.expired ? 'info' : '' ">{{ getCalcTypeText(slotProps.row.calcTypeId) }}</el-tag>
      </template>
      <template v-slot:count="slotProps">
        <span>{{ slotProps.row.tokens }}, {{ slotProps.row.chatCount }}, {{ slotProps.row.advancedChatCount }}, {{ slotProps.row.drawCount }}</span>
      </template>
      <template v-slot:state="slotProps">
        <el-tag :type="slotProps.row.expired ? 'info' : slotProps.row.state == 1 ? 'primary' : 'danger'">{{ getStateText(slotProps.row.state) }}</el-tag>
        <el-tag v-if="slotProps.row.expired" style="margin-left: 5px;" type="info">已过期</el-tag>
      </template>
      <template v-slot:rowActions="slotProps">
        <el-button
          v-if="slotProps.row.state == 1 || slotProps.row.state == 2"
          :type="slotProps.row.expired ? 'info' : slotProps.row.state == 2 ? 'primary' : 'danger'"
          plain
          @click.stop="handleToggleEnable(slotProps.row)"
        >
          {{ slotProps.row.state == 1 ? '废除' : '恢复' }}
        </el-button>
        <el-button :type="slotProps.row.expired ? 'info' : 'primary'" :plain="slotProps.row.expired" @click.stop="handleShowQuotaEditDialog(slotProps.row)">
          {{ slotProps.row.calcTypeId == 1 ? '调整额度' : '调整限额' }}
        </el-button>
        <el-button :type="slotProps.row.expired ? 'info' : 'success'" plain @click.stop="handleShowTimeEditDialog(slotProps.row)">
          修改有效期
        </el-button>
      </template>
    </ai-table>

    <el-dialog
      :title="'为' + member.username + (increaseCalcTypeId == 1 ? '调整额度' : '调整限额')"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="450px"
    >
      <el-form label-width="80px">
        <el-form-item label="类型">
          <el-select v-model="increaseType">
            <el-option label="基础聊天积分" :value="1" />
            <el-option label="高级聊天积分" :value="2" />
            <el-option label="tokens" :value="3" />
            <el-option label="绘画积分" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="积分">
          <el-input-number v-model="increaseCount" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="increasing" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="increasing" @click="handleQuotaAdd">
          {{ increasing ? '处理中' : '确 定' }}
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'为' + member.username + '增加套餐'"
      :visible.sync="packageDialogVisible"
      :append-to-body="true"
      width="30%"
    >
      <el-form label-width="100px">
        <el-form-item label="选择套餐">
          <el-select v-model="packageId">
            <el-option v-for="pkg in packages" :key="pkg.id" :label="pkg.title" :value="pkg.id" />
          </el-select>

        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="increasing" @click="packageDialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="increasing" @click="handlePackageAdd">
          {{ increasing ? '处理中' : '确 定' }}
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="'为' + member.username + ('修改套餐有效期')"
      :visible.sync="dialogTimeVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="450px"
    >
      <el-form label-width="100px">
        <el-form-item label="#">
          <el-input :value="timeBalanceId" :disabled="true" style="width: 130px" />
        </el-form-item>
        <el-form-item label="修改方式">
          <el-radio-group v-model="timeStyle">
            <el-radio label="days">按天</el-radio>
            <el-radio label="date">指定日期</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="天数">
          <el-input-number v-model="timeDays" :disabled="timeStyle !== 'days'" />
        </el-form-item>
        <el-form-item label="指定日期">
          <el-date-picker
            v-model="timeExpireTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :disabled="timeStyle !== 'date'"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="increasing" @click="dialogTimeVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="timeSubmitting" @click="handleTimeEdit">
          {{ timeSubmitting ? '提交中' : '确 定' }}
        </el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

import AiTable from '@/components/Table'
import { getBalancesByUserId, increaseBalance, setDisable, setEnable, addPackage, updateExpireTime } from '@/api/balance'
import { getPackages } from '@/api/package'

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
      loading: false,
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
        label: '积分',
        slot: 'count',
        width: 150
      }, {
        label: '状态',
        prop: 'state',
        slot: 'state',
        width: 120
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
        width: 280
      },
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 20
        // showDetail: false
      },

      dialogVisible: false,
      increaseType: null,
      increaseCount: 0,
      increasing: false,
      increaseBalanceId: 0,
      increaseCalcTypeId: 0,

      dialogTimeVisible: false,
      timeBalanceId: 0,
      timeExpireTime: null,
      timeStyle: 'days',
      timeSubmitting: false,
      timeDays: null,

      packages: [],
      packageDialogVisible: false,
      packageId: null
    }
  },
  mounted() {
    getPackages().then(resp => {
      this.packages = resp.data.map(pkg => {
        return { ...pkg }
      })
    })
  },
  methods: {
    reload() {
      this.loading = true
      getBalancesByUserId(this.userId, this.pagination.pageNum, this.pagination.pageSize).then(resp => {
        console.log('resp', resp)
        this.tableData = resp.data.list.map(balance => {
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
            state: balance.state,
            expired: balance.expired
          }
        })
        this.pagination.total = this.tableData.length
        this.pagination.total = resp.data.total
        this.pagination.pageNum = resp.data.pageNum
        this.pagination.pageSize = resp.data.pageSize
      }).finally(() => {
        this.loading = false
      })
    },
    handleRefresh() {
      this.reload()
    },
    handlePageSizeChange(size) {
      this.pagination.pageNum = 1
      this.pagination.pageSize = size
      this.reload()
    },
    handlePageCurrentChanged(page) {
      console.log('page', page)
      this.pagination.pageNum = page
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
        this.loading = true
        if (row.state === 1) {
          setDisable(row.id).then(() => {
            this.$message.success('操作成功！')
            this.reload()
          }).finally(() => {
            this.loading = false
          })
        } else {
          setEnable(row.id).then(() => {
            this.$message.success('操作成功！')
            this.reload()
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    handleShowQuotaEditDialog(row) {
      this.dialogVisible = true
      this.increaseCount = 0
      this.increaseType = 1
      this.increaseBalanceId = row.id
      this.increaseCalcTypeId = row.calcTypeId
    },
    handleQuotaAdd() {
      const count = +this.increaseCount
      if (count === 0) {
        this.$message.error('积分不能为0！')
        return
      }
      // if (count <= 0) {
      //   this.$message.error('积分必须是一个大于0的数！')
      //   return
      // }
      this.increasing = true
      increaseBalance(this.member.id, this.increaseBalanceId, this.increaseType, count).then(resp => {
        console.log('resp', resp)
        this.$message.success('操作成功！')
        this.dialogVisible = false
        this.$emit('changed')
        // this.reload()
      }).catch(err => {
        console.error(err)
      }).finally(() => {
        this.increasing = false
      })
    },
    handleShowAddPackageDialog() {
      this.packageDialogVisible = true
      this.packageId = null
    },
    handleShowTimeEditDialog(row) {
      this.dialogTimeVisible = true
      this.timeBalanceId = row.id
      this.timeExpireTime = row.expireTime
      this.timeDays = 0
      this.timeStyle = 'days'
    },
    handleTimeEdit() {
      if (this.timeStyle === 'days') {
        if (this.timeDays === 0) {
          return this.$message.error('天数不能为0！')
        }
      } else if (this.timeStyle === 'date') {
        if (!this.timeExpireTime) {
          return this.$message.error('有效期不能为空！')
        }
      }
      updateExpireTime(this.timeBalanceId,
        this.timeStyle === 'days' ? this.timeDays : null,
        this.timeStyle === 'date' ? this.timeExpireTime : null).then(resp => {
        if (resp.code === 0) {
          this.$message.success('修改成功！')
          this.reload()
          this.dialogTimeVisible = false
        } else {
          this.$message.error('修改失败！' + resp.message)
        }
      }).catch(e => {
        console.error(e)
      })
    },
    handlePackageAdd() {
      if (!this.packageId) {
        this.$message.error('请选择套餐！')
        return
      }
      this.increasing = true
      addPackage(this.userId, this.packageId).then(() => {
        this.reload()
        this.packageDialogVisible = false
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
        5: '后台操作',
        6: '兑换'
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
