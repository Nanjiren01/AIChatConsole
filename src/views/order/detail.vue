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
      <el-form ref="form" label-width="220px" style="padding-right: 180px">
        <el-form-item v-if="orderEntity.id" label="#">
          <el-input v-model="orderEntity.id" disabled />
        </el-form-item>
        <el-form-item v-if="orderEntity.uuid" label="uuid">
          <el-input v-model="orderEntity.uuid" disabled />
        </el-form-item>
        <el-form-item label="用户">
          <span class="order-form-item">{{ orderEntity.username + '(#' + orderEntity.userId + ')' }}</span>
        </el-form-item>
        <el-form-item label="标题">
          <span class="order-form-item">{{ orderEntity.title }}</span>
        </el-form-item>
        <el-form-item label="支付方式">
          <span class="order-form-item">{{ getChannelText(orderEntity) }}</span>
        </el-form-item>
        <el-form-item label="价格（元）">
          <span>￥{{ orderEntity.price }}</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <span class="order-form-item">{{ orderEntity.createTime }}</span>
        </el-form-item>
        <el-form-item label="提交时间">
          <span class="order-form-item">{{ orderEntity.submitTime }}</span>
        </el-form-item>
        <el-form-item label="支付时间">
          <span class="order-form-item">{{ orderEntity.payTime }}</span>
        </el-form-item>
        <el-form-item label="取消时间">
          <span class="order-form-item">{{ orderEntity.cancelTime }}</span>
        </el-form-item>
        <el-form-item label="状态">
          <span style="margin-right: 10px">
            <el-tag v-if="orderEntity.state == 0" type="info">待提交</el-tag>
            <el-tag v-else-if="orderEntity.state == 5" type="primary">待支付</el-tag>
            <el-tag v-else-if="orderEntity.state == 6" type="danger">提交失败</el-tag>
            <el-tag v-else-if="orderEntity.state == 10" type="success">支付成功</el-tag>
            <el-tag v-else-if="orderEntity.state == 12" type="danger">支付失败</el-tag>
            <el-tag v-else-if="orderEntity.state == 20" type="info">已取消</el-tag>
            <el-tag v-else-if="orderEntity.state == 30" type="danger">已删除</el-tag>
          </span>
        </el-form-item>
        <el-form-item>
          <el-button v-if="orderEntity.id && [0, 5].includes(orderEntity.state)" type="primary" @click.stop="handleCancel()">
            取消支付
          </el-button>
        </el-form-item>
      </el-form>
      <el-form v-if="orderEntity.state == 20">
        <div style="margin-bottom: 100px;" />
        <el-form-item v-if="orderEntity.id">
          <el-button type="danger" @click="handleDelete">
            删除
          </el-button>
        </el-form-item>
      </el-form>

    </div>
  </el-drawer>
</template>

<script>

import { cancelOrder, deleteOrder } from '@/api/order'

export default {
  name: 'OrderDetail',
  components: { },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    orderEntity: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      drawer: true
    }
  },
  computed: {
    title() {
      return this.orderEntity.title + '详情'
    }
  },
  mounted() {
    // this.reload()
  },
  methods: {
    reload() { // 对外接口
      if (!this.orderEntity.id) {
        return
      }
    },
    handleClose() {
      this.$emit('close')
    },
    handleRefresh() {
      this.reload()
    },
    handleCancel() {
      this.$confirm(`确认取消此订单（#${this.orderEntity.uuid}）？`,
        '操作确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async() => {
        cancelOrder(this.orderEntity.uuid).then(() => {
          this.$message.success('操作成功！')
          this.$emit('changed', this.orderEntity.id)
        })
      })
    },
    handleDelete() {
      this.$confirm(`确认删除此订单（#${this.orderEntity.uuid}）？`,
        '删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }
      ).then(async() => {
        deleteOrder(this.orderEntity.uuid).then(() => {
          this.$message.success('操作成功！')
          this.$emit('changed', this.orderEntity.id)
          this.$emit('close')
        })
      })
    },
    getChannelText(order) {
      if (order.payChannel === 'xunhu') {
        return '虎皮椒'
      } else if (order.payChannel === 'lantu') {
        return '蓝兔'
      } else {
        return order.payChannel
      }
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
