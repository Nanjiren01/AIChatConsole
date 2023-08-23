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
        <el-form-item v-if="drawTaskEntity.id" label="#">
          <el-input v-model="drawTaskEntity.id" disabled />
        </el-form-item>
        <el-form-item v-if="drawTaskEntity.uuid" label="uuid">
          <el-input v-model="drawTaskEntity.uuid" disabled />
        </el-form-item>
        <el-form-item label="用户">
          <span class="order-form-item">{{ drawTaskEntity.username + '(#' + drawTaskEntity.userId + ')' }}</span>
        </el-form-item>
        <!-- <el-form-item label="所用平台">
          <span class="order-form-item">#{{ drawTaskEntity.platformId }}</span>
        </el-form-item> -->
        <el-form-item label="所用模型">
          <span class="order-form-item">#{{ drawTaskEntity.modelId }}</span>
        </el-form-item>
        <el-form-item label="所用Key">
          <span class="order-form-item">#{{ drawTaskEntity.apiKeyId }}</span>
        </el-form-item>
        <el-form-item label="所用套餐">
          <span class="order-form-item">#{{ drawTaskEntity.balanceId }}</span>
        </el-form-item>
        <el-form-item label="额度消耗记录">
          <span class="order-form-item">#{{ drawTaskEntity.balanceRecordId }}</span>
        </el-form-item>
        <el-form-item label="类型">
          <span class="order-form-item">
            {{ drawTaskEntity.type }}<span v-if="drawTaskEntity.targetIndex || drawTaskEntity.zoomRatio">::{{ drawTaskEntity.targetIndex || drawTaskEntity.zoomRatio }}</span>
            <span v-if="drawTaskEntity.targetTaskId">::{{ drawTaskEntity.targetTaskId }}</span>
          </span>
        </el-form-item>
        <el-form-item label="prompt">
          <span class="order-form-item">{{ drawTaskEntity.prompt }}</span>
        </el-form-item>
        <el-form-item label="第三方id">
          <span class="order-form-item">{{ drawTaskEntity.thirdpartId }}</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <span class="order-form-item">{{ drawTaskEntity.createTime }}</span>
        </el-form-item>
        <el-form-item label="提交时间">
          <span class="order-form-item">{{ drawTaskEntity.submitTime }}</span>
        </el-form-item>
        <el-form-item label="进度更新时间">
          <span class="order-form-item">{{ drawTaskEntity.progressTime }}</span>
        </el-form-item>
        <el-form-item label="状态">
          <span style="margin-right: 10px">
            <el-tag v-if="drawTaskEntity.state == 0" type="info">待提交</el-tag>
            <el-tag v-else-if="drawTaskEntity.state == 10" type="primary">已提交</el-tag>
            <el-tag v-else-if="drawTaskEntity.state == 20" type="warning">处理中{{ drawTaskEntity.progress }}%</el-tag>
            <el-tag v-else-if="drawTaskEntity.state == 30" type="success">成功</el-tag>
            <el-tag v-else-if="drawTaskEntity.state == 40" type="danger">失败</el-tag>
          </span>
          <el-alert
            v-if="drawTaskEntity.state == 40"
            :title="drawTaskEntity.error || '未知错误'"
            type="error"
            :closble="false"
          />
        </el-form-item>
        <el-form-item v-if="drawTaskEntity.state == 30" label="结果">
          <img :src="getUrl(drawTaskEntity)" style="max-width: 800px;">
        </el-form-item>

      </el-form>

    </div>
  </el-drawer>
</template>

<script>

export default {
  name: 'DrawTaskDetail',
  components: { },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    drawTaskEntity: {
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
      return this.drawTaskEntity.title + '详情'
    }
  },
  mounted() {
    // this.reload()
  },
  methods: {
    reload() { // 对外接口
      if (!this.drawTaskEntity.id) {
        return
      }
    },
    handleClose() {
      this.$emit('close')
    },
    handleRefresh() {
      this.reload()
    },
    getUrl(drawTaskEntity) {
      if (!drawTaskEntity.result) {
        return ''
      }
      try {
        const result = JSON.parse(drawTaskEntity.result)
        return result.url
      } catch (e) {
        console.error(e)
      }
      return {
        url: ''
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
