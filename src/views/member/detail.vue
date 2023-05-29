<template>
  <el-drawer
    :title="title"
    size="60%"
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
        <el-form-item label="状态">
          <el-tag v-if="member.state == 1" type="success">正常</el-tag>
          <el-tag v-else type="danger">停用</el-tag>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="member.createTime" disabled />
        </el-form-item>
        <!-- <el-form-item label="剩余tokens">
          <el-input v-model="member.tokens" disabled />
        </el-form-item>
        <el-form-item label="剩余聊天次数">
          <el-input v-model="member.chatCount" disabled />
        </el-form-item>
        <el-form-item label="剩余高级聊天次数（GPT4）">
          <el-input v-model="member.advancedChatCount" disabled />
        </el-form-item>
        <el-form-item label="剩余绘图次数">
          <el-input v-model="member.drawCount" disabled />
        </el-form-item>
        <el-form-item label="操作">
          <el-button type="primary" @click="handleShowQuotaEditDialog">手动添加次数</el-button>
        </el-form-item> -->
      </el-form>

      <el-tabs v-model="activeName" style="padding: 10px;" @tab-click="handleTabClick">
        <el-tab-pane label="套餐列表" name="balance">
          <balances ref="balances" :user-id="member.id" :member="member" />
        </el-tab-pane>
        <el-tab-pane label="额度变动记录" name="balanceRecord">
          <ai-table
            :table-actions="tableActions"
            :table-columns="tableColumns"
            :table-data="tableData"
            :table-action-column="tableActionColumn"
            :pagination="pagination"
            @refresh="handleRefresh"
          >
            <template v-slot:type="slotProps">
              <el-tag>{{ getTypeText(slotProps.row.typeId) }}</el-tag>
            </template>
            <template v-slot:sourceId="slotProps">
              <el-tag>{{ getSourceText(slotProps.row.sourceId) }}</el-tag>
            </template>
          </ai-table>
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
import { getBalanceRecordByUserId } from '@/api/balance'
import ChangePassword from '../user/password'

export default {
  name: 'MemberDetail',
  components: { AiTable, ChangePassword, Balances },
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
        label: '时间',
        prop: 'createTime',
        width: 140
      }],
      tableData: [],
      tableActionColumn: {

      },
      pagination: {
        total: 0,
        showDetail: false
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
      this.$refs.balances.reload()
      getBalanceRecordByUserId(this.member.id).then(resp => {
        console.log('resp', resp)
        this.tableData = resp.data.map(item => {
          return {
            id: item.id,
            type: item.type,
            typeId: item.typeId,
            delta: item.delta,
            balanceId: item.balanceId,
            createTime: item.createTime,
            source: item.source,
            sourceId: item.sourceId
          }
        })
        this.pagination.total = this.tableData.length
      })
    },
    handleClose() {
      // this.drawer = false
      this.$emit('close')
    },
    handleRefresh() {
      this.reload()
    },
    handleTabClick() {

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
        3: '后台管理员增加',
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
