<template>
  <el-drawer
    :title="title"
    size="60%"
    :visible.sync="drawer"
    :before-close="handleClose"
  >
    <div style="padding: 20px">
      <el-form ref="form" label-width="160px" style="padding-right: 40px">
        <el-form-item label="用户名（账号）">
          <el-input v-model="member.username" disabled />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="member.name" disabled />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch
            :value="member.state == 1"
            disabled
          />
        </el-form-item>
        <el-form-item label="剩余tokens">
          <el-input v-model="member.tokens" disabled />
        </el-form-item>
        <el-form-item label="剩余询问次数">
          <el-input v-model="member.chatCount" disabled />
        </el-form-item>
        <el-form-item label="剩余询问次数（GPT4）">
          <el-input v-model="member.advancedChatCount" disabled />
        </el-form-item>
        <el-form-item label="剩余绘图次数">
          <el-input v-model="member.drawCount" disabled />
        </el-form-item>
      </el-form>

      <el-tabs v-model="activeName" style="padding: 10px;" @tab-click="handleTabClick">
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
              <span>{{ getTypeText(slotProps.row.typeId) }}</span>
            </template>
          </ai-table>

        </el-tab-pane>
      </el-tabs>

    </div>
  </el-drawer>
</template>

<script>

import AiTable from '@/components/Table'
import { getBalanceRecordByUserId } from '@/api/balance'

export default {
  name: 'MemberDetail',
  components: { AiTable },
  props: {
    member: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      drawer: true,
      activeName: 'balanceRecord',
      tableActions: [],
      tableColumns: [{
        label: '#',
        prop: 'id',
        width: 55
      }, {
        label: '类型',
        prop: 'typeId',
        slot: 'type'
      }, {
        label: '变动',
        prop: 'delta'
      }, {
        label: '时间',
        prop: 'createTime'
      }],
      tableData: [],
      tableActionColumn: {

      },
      pagination: {
        total: 0
      }

    }
  },
  computed: {
    title() {
      return this.member.username
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload() {
      getBalanceRecordByUserId(this.member.id).then(resp => {
        console.log('resp', resp)
        this.tableData = resp.data.map(item => {
          return {
            id: item.id,
            type: item.type,
            typeId: item.typeId,
            delta: item.delta,
            createTime: item.createTime
          }
        })
      })
    },
    handleClose() {
      this.drawer = false
      this.$emit('close')
    },
    handleRefresh() {
      this.reload()
    },
    handleTabClick() {

    },
    getTypeText(typeId) {
      return ({
        1: '普通询问',
        2: '高级询问',
        3: 'Token',
        4: '绘图'
      })[typeId] || '未知'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
