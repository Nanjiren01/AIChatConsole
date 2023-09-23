<template>
  <div>
    <ai-table
      v-loading="loading"
      :table-actions="tableActions"
      :table-columns="tableColumns"
      :table-data="tableData"
      :table-action-column="tableActionColumn"
      :pagination="pagination"
      @refresh="handleRefresh"
    >
      <!-- <template #topActions>
        <el-button type="primary" @click="handleShowAddPackageDialog">增加套餐</el-button>
      </template> -->

    </ai-table>

  </div>
</template>

<script>

import AiTable from '@/components/Table'
import { getInviteInfo } from '@/api/member'

export default {
  name: 'InviteInfo',
  components: { AiTable },
  props: {
    userId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false,
      tableActions: false,
      tableColumns: [{
        label: '#',
        prop: 'id',
        width: 55
      }, {
        label: '用户名',
        prop: 'username'
      }, {
        label: '邮箱',
        prop: 'email'
      }, {
        label: '手机号',
        prop: 'phone'
      }, {
        label: '状态',
        prop: 'state',
        slot: 'state',
        width: 75
      }, {
        label: '邀请时间',
        prop: 'createTime',
        width: 140
      }],
      tableData: [],
      tableActionColumn: {
        width: 180
      },
      pagination: {
        total: 0,
        showDetail: false
      }
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload() {
      this.loading = true
      getInviteInfo(this.userId).then(resp => {
        console.log('resp', resp)
        this.tableData = resp.data.map(user => {
          return { ... user }
        })
        this.pagination.total = this.tableData.length
      }).finally(() => {
        this.loading = false
      })
    },
    handleRefresh() {
      this.reload()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
