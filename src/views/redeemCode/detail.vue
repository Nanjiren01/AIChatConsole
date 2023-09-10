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
        <el-form-item label="#">
          <el-input v-model="member.id" disabled />
        </el-form-item>
        <el-form-item label="卡号">
          <el-input v-model="member.key" disabled />
        </el-form-item>
        <el-form-item label="tokens">
          <el-input-number v-model="member.tokens" disabled />
        </el-form-item>
        <el-form-item label="普通聊天积分">
          <el-input-number v-model="member.chatCount" disabled />
        </el-form-item>
        <el-form-item label="高级聊天积分">
          <el-input-number v-model="member.advancedChatCount" disabled />
        </el-form-item>
        <el-form-item label="绘图积分">
          <el-input-number v-model="member.drawCount" disabled />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="member.calcType" disabled>
            <el-option label="总额" value="Total" />
            <el-option label="每天" value="Daily" />
            <el-option label="每3小时" value="ThreeHourly" />
            <el-option label="每小时" value="Hourly" />
          </el-select>
        </el-form-item>
        <el-form-item label="天数">
          <el-input-number v-model="member.days" disabled />
        </el-form-item>
        <el-form-item label="渠道">
          <el-input v-model="member.channel" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="member.remark" disabled />
        </el-form-item>
        <el-form-item label="状态">
          <el-tag v-if="member.state == 0" type="info">草稿</el-tag>
          <el-tag v-if="member.state == 1" type="success">生效中</el-tag>
          <el-tag v-if="member.state == 2" type="success">已作废</el-tag>
          <el-tag v-if="member.state == 3" type="success">已删除</el-tag>
        </el-form-item>
        <el-form-item label="兑换状态">
          <el-tag v-if="member.state == 0" type="success">未兑换</el-tag>
          <el-tag v-if="member.state == 1" type="info">已兑换</el-tag>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="member.createTime" disabled />
        </el-form-item>
        <el-form-item label="兑换时间">
          <el-input v-model="member.redeemTime" disabled />
        </el-form-item>
        <el-form-item v-if="member.cancelTime" label="作废时间">
          <el-input v-model="member.cancelTime" disabled />
        </el-form-item>
      </el-form>

    </div>
  </el-drawer>
</template>

<script>

export default {
  name: 'RedeemCodeDetail',
  components: { },
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
    }
  },
  computed: {
    title() {
      return this.member.key + '兑换码详情'
    }
  },
  mounted() {
    // this.reload()
  },
  methods: {
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
