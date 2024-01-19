<template>
  <el-drawer
    :title="title"
    size="80%"
    :visible="show"
    :modal-append-to-body="true"
    :before-close="handleClose"
    style="height: 100%"
  >
    <div style="padding: 20px; overflow-y: auto;">
      <el-form ref="form" label-width="260px" style="padding-right: 180px">
        <el-form-item label="用户名（账号）">
          <el-input v-model="member.username" disabled />
        </el-form-item>
        <el-form-item label="密码">
          <el-button @click="handleShowChangePassword">修改密码</el-button>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="member.name" disabled />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="member.email" disabled />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="member.phone" disabled />
        </el-form-item>
        <el-form-item label="微信Open Id">
          <el-input v-model="member.wechatOpenId" disabled />
        </el-form-item>
        <el-form-item label="QQ">
          <el-input v-model="member.qq" disabled />
        </el-form-item>
        <el-form-item label="邀请人">
          <span v-if="member.invitor.id">{{ member.invitor.username || member.invitor.email || member.invitor.phone }}(#{{ member.invitor.id }})</span>
          <span v-else>无</span>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="member.remark" disabled />
        </el-form-item>
        <el-form-item label="状态">
          <el-tag v-if="member.state === 1" type="success">正常</el-tag>
          <el-tag v-else-if="member.state === 2" type="danger">停用</el-tag>
          <el-tag v-else type="warning">审核中</el-tag>
          <span v-if="member.state === 3" style="margin-left: 10px;">
            <el-button type="success" @click="() => audit(1)">审核通过（转为正常）</el-button>
            <el-button type="warning" @click="() => audit(2)">审核不通过（转为正常）</el-button>
          </span>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="member.createTime" disabled />
        </el-form-item>
        <!-- <el-form-item label="剩余tokens">
          <el-input v-model="member.tokens" disabled />
        </el-form-item>
        <el-form-item label="剩余聊天积分">
          <el-input v-model="member.chatCount" disabled />
        </el-form-item>
        <el-form-item label="剩余高级聊天积分">
          <el-input v-model="member.advancedChatCount" disabled />
        </el-form-item>
        <el-form-item label="剩余绘图积分">
          <el-input v-model="member.drawCount" disabled />
        </el-form-item>
        <el-form-item label="操作">
          <el-button type="primary" @click="handleShowQuotaEditDialog">手动添加积分</el-button>
        </el-form-item> -->
      </el-form>

      <el-tabs v-model="activeName" style="padding: 10px;" @tab-click="handleTabClick">
        <el-tab-pane label="套餐列表" name="balance">
          <balances ref="balances" :user-id="member.id" :member="member" @changed="handleBalanceChanged" />
        </el-tab-pane>
        <el-tab-pane label="额度变动记录" name="balanceRecord">
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
            <template v-slot:type="slotProps">
              <el-tag>{{ getTypeText(slotProps.row.typeId) }}</el-tag>
            </template>
            <template v-slot:state="props">
              <el-tag v-if="props.row.state === 1" type="success">成功</el-tag>
              <el-tag v-if="props.row.state === 0" type="warning">处理中</el-tag>
              <el-tooltip v-if="props.row.state === 2" effect="dark" :content="getReason(props.row)" placement="top">
                <el-tag type="warning">已回滚</el-tag>
              </el-tooltip>
            </template>
            <template v-slot:sourceId="slotProps">
              <el-tag>{{ getSourceText(slotProps.row.sourceId) }}</el-tag>
            </template>
          </ai-table>
        </el-tab-pane>
        <el-tab-pane label="邀请列表" name="invite">
          <invite ref="invite" :user-id="member.id" />
        </el-tab-pane>
      </el-tabs>

      <change-password
        ref="password"
        :password-dialog-visible="passwordDialogVisible"
        :show-old-password="false"
        @close="handlePasswordDialogClose"
      />
    </div>
  </el-drawer>
</template>

<script>

import AiTable from '@/components/Table'
import Balances from './balance'
import Invite from './invite'
import { getBalanceRecordByUserId } from '@/api/balance'
import ChangePassword from '../user/password'
import { audit } from '@/api/user'

export default {
  name: 'MemberDetail',
  components: { AiTable, ChangePassword, Balances, Invite },
  props: {
    member: {
      type: Object,
      default: () => []
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      drawer: true,
      loading: false,
      activeName: 'balance',
      tableActions: false,
      tableColumns: [{
        label: '#',
        prop: 'id',
        width: 55
      }, {
        label: '对应套餐',
        prop: 'balanceId'
      }, {
        label: '来源',
        prop: 'sourceId',
        slot: 'sourceId'
      }, {
        label: '类型',
        prop: 'typeId',
        slot: 'type'
      }, {
        label: '变动',
        prop: 'delta',
        width: 80
      }, {
        label: '状态',
        slot: 'state',
        width: 80
      }, {
        label: '时间',
        prop: 'createTime',
        width: 140
      }],
      tableData: [],
      tableActionColumn: {

      },
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 20
        // showDetail: false
      },

      passwordDialogVisible: false
    }
  },
  computed: {
    title() {
      return this.member.username + '详情'
    }
  },
  // watch: {
  //   show(oldValue, value) {
  //     console.
  //     if (value) {
  //       this.reload()
  //     }
  //   }
  // },
  mounted() {
    // this.reload()
  },
  methods: {
    reload() { // 对外接口
      if (!this.member.id) {
        return
      }
      this.loading = true
      this.$refs.balances.reload()
      this.$refs.invite.reload()
      getBalanceRecordByUserId(this.member.id, this.pagination.pageNum, this.pagination.pageSize).then(resp => {
        console.log('resp', resp)
        this.tableData = resp.data.list.map(item => {
          return {
            id: item.id,
            type: item.type,
            typeId: item.typeId,
            delta: item.delta,
            balanceId: item.balanceId,
            createTime: item.createTime,
            state: item.state,
            source: item.source,
            sourceId: item.sourceId,
            reason: item.reason
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
    handleClose() {
      // this.drawer = false
      this.$emit('close')
    },
    handleRefresh() {
      this.reload()
    },
    handlePageSizeChange(size) {
      console.log('size', size)
      this.pagination.pageNum = 1
      this.pagination.pageSize = size
      this.reload()
    },
    handlePageCurrentChanged(page) {
      console.log('page', page)
      this.pagination.pageNum = page
      this.reload()
    },
    handleTabClick() {

    },
    handleBalanceChanged() {
      this.reload()
    },
    getTypeText(typeId) {
      return ({
        1: '普通聊天',
        2: '高级聊天',
        3: 'tokens',
        4: '绘图'
      })[typeId] || '未知'
    },
    getSourceText(sourceId) {
      return ({
        1: '聊天消耗',
        2: '绘图消耗',
        3: '后台管理员操作',
        4: '注册赠送'
      })[sourceId] || '未知'
    },

    handleShowChangePassword() {
      this.passwordDialogVisible = true
      this.$refs.password.init(this.member.id)
    },
    handlePasswordDialogClose() {
      console.log('handlePasswordDialogClose')
      this.passwordDialogVisible = false
    },
    audit(state) {
      this.$confirm(`确定将用户状态置为${state === 1 ? '正常' : '停用'}？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'long-message',
        width: '600px',
        type: 'warning'
      }).then(async() => {
        audit(this.member.id, state).then(resp => {
          console.log('resp', resp)
          this.$message.success('操作成功！')
          this.$emit('changed')
        })
      })
    },
    getReason(row) {
      if (!row.jsonReason) {
        try {
          row.jsonReason = row.reason ? JSON.parse(row.reason) : null
        } catch (e) {
          console.error(e)
        }
      }
      if (!row.jsonReason) {
        row.jsonReason = {
          message: '无具体回滚原因'
        }
      }
      return row.jsonReason.message
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__body {
  height: calc(100% - 77px);
  overflow-y: auto;
}
</style>
