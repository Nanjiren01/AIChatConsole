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
        <el-form-item label="处理模式">
          <span class="order-form-item">{{ drawTaskEntity.processMode }}</span>
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
        <el-form-item label="结束时间">
          <span class="order-form-item">
            <span
              v-if="(!drawTaskEntity.finishTime)"
              style="background-color: #f4f4f5; color: #909399;line-height: 30px;display: inline-block;padding: 0 10px;border-radius: 6px;"
            >
              {{ drawTaskEntity.state === 30 || drawTaskEntity.state === 40 ? 'v0.9.5后支持' : '未结束' }}
            </span>
            {{ drawTaskEntity.finishTime }}
          </span>
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
        <el-form-item label="基础图片">
          <div
            v-if="drawTaskEntity.baseImages && drawTaskEntity.baseImages.urls && drawTaskEntity.baseImages.urls.length"
          >
            <template v-for="(url, idx) in drawTaskEntity.baseImages.urls">
              <el-link
                :key="idx"
                type="primary"
                :href="parseUrl(url)"
                class="base-image-item-container"
                target="_blank"
                :underline="false"
              >
                <img
                  :src="parseUrl(url)"
                  class="base-image"
                >
              </el-link>
            </template>
          </div>
        </el-form-item>
        <el-form-item v-if="drawTaskEntity.state == 30" label="结果">
          <el-link target="_blank" :underline="false" :href="getUrl(drawTaskEntity)">
            <img :src="getUrl(drawTaskEntity)" style="max-width: 800px;width: 100%;">
          </el-link>
        </el-form-item>
        <el-form-item label="request">
          <span class="order-form-item">{{ drawTaskEntity.request }}</span>
        </el-form-item>
        <el-form-item label="response">
          <span class="order-form-item">{{ drawTaskEntity.response }}</span>
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
    parseUrl(url) {
      if (url.startsWith('/')) {
        return process.env.VUE_APP_BASE_API + url
      }
      return url
    },
    getUrl(drawTaskEntity) {
      if (!drawTaskEntity.result) {
        return ''
      }
      try {
        const result = JSON.parse(drawTaskEntity.result)
        const url = result.url
        if (url.startsWith('/')) {
          return process.env.VUE_APP_BASE_API + url
        }
        return url
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
.base-image-item-container {
  display: inline-block;
  margin: 5px;

  &:hover img.base-image {
    border-color: #409EFF;
  }
}

.base-image {
  width: 100px;
  height: 100px;
  object-fit: scale-down;
  border: 1px solid #ccc
}
</style>
