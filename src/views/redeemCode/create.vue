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
        <el-form-item label="tokens">
          <el-input-number v-model="member.tokens" />
        </el-form-item>
        <el-form-item label="普通聊天次数">
          <el-input-number v-model="member.chatCount" />
        </el-form-item>
        <el-form-item label="高级聊天次数">
          <el-input-number v-model="member.advancedChatCount" />
        </el-form-item>
        <el-form-item label="AI绘图次数">
          <el-input-number v-model="member.drawCount" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="member.calcType">
            <el-option label="总额" value="Total" />
            <el-option label="每天" value="Daily" />
            <el-option label="每3小时" value="ThreeHourly" />
            <el-option label="每小时" value="Hourly" />
          </el-select>
        </el-form-item>
        <el-form-item label="天数">
          <el-input-number v-model="member.days" />
        </el-form-item>
        <el-form-item label="渠道">
          <el-input v-model="member.channel" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="member.remark" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="member.count" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="member.state">
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">立即生效</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" :disabled="loading" @click="handleSubmit">提 交</el-button>
        </el-form-item>

      </el-form>

    </div>
  </el-drawer>
</template>

<script>

import { batchCreate } from '@/api/redeemCode'

export default {
  name: 'RedeemCodeCreate',
  components: { },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      member: {
        calcType: 'Total',
        tokens: 0,
        chatCount: 0,
        advancedChatCount: 0,
        drawCount: 0,
        days: 0,
        channel: null,
        remark: null,
        count: null,
        state: 0
      }
    }
  },
  computed: {
    title() {
      return '生成兑换码'
    }
  },
  mounted() {
    // this.reload()
  },
  methods: {
    clear() { // 对外接口
      this.member.tokens = 0
      this.member.chatCount = 0
      this.member.advancedChatCount = 0
      this.member.drawCount = 0
      this.member.days = null
      this.member.calcType = 'Total'
      this.member.channel = null
      this.member.remark = null
      this.member.count = null
      this.member.state = 0
    },
    handleClose() {
      this.$emit('close')
    },
    handleSubmit() {
      this.loading = true
      batchCreate({
        tokens: this.member.tokens,
        chatCount: this.member.chatCount,
        advancedChatCount: this.member.advancedChatCount,
        drawCount: this.member.drawCount,
        days: this.member.days,
        calcType: this.member.calcType,
        channel: this.member.channel,
        remark: this.member.remark,
        state: this.member.state,
        count: this.member.count
      }).then(resp => {
        if (resp.code === 0) {
          this.$emit('created')
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
