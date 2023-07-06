<template>
  <el-drawer
    :title="title"
    size="60%"
    :visible="show"
    :before-close="handleClose"
  >
    <div style="padding: 20px">
      <el-form ref="form" label-width="260px" style="padding-right: 180px">
        <el-form-item label="平台">
          <el-select v-model="model.platformId" :disabled="!!model.id">
            <el-option v-for="p in platforms" :key="p.id" :value="p.id" :label="p.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="model.name" />
        </el-form-item>
        <el-form-item label="展示名称">
          <el-input v-model="model.showName" />
        </el-form-item>
        <el-form-item label="path">
          <el-input v-model="model.path" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="model.remark" type="textarea" :row="1" autosize />
        </el-form-item>
        <el-form-item v-if="model.id" label="状态">
          <el-tag v-if="model.state == 1" type="success">正常</el-tag>
          <el-tag v-else type="danger">停用</el-tag>
        </el-form-item>
        <el-form-item label="计费方式">
          <el-select v-model="model.levelId">
            <el-option :value="1" label="普通聊天（GPT3.5）" />
            <el-option :value="2" label="高级聊天（GPT4）" />
            <el-option :value="3" label="tokens" />
            <el-option :value="4" label="绘画" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="model.createTime" label="创建时间">
          <el-input v-model="model.createTime" disabled />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave">
            {{ loading ? '保存中……' : '保 存' }}
          </el-button>
        </el-form-item>
      </el-form>

    </div>
  </el-drawer>
</template>

<script>

import { updateAiModel, createAiModel } from '@/api/aiModel.js'

export default {
  name: 'ModelDetail',
  components: { },
  props: {
    platforms: {
      type: Array,
      default: () => []
    },
    model: {
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
      loading: false
    }
  },
  computed: {
    title() {
      return this.model.name ? (this.model.name + '模型信息') : '新建模型'
    }
  },
  mounted() {
    // this.reload()
  },
  methods: {
    handleClose() {
      this.$emit('close')
      this.$emit('update:show', false)
    },
    handleSave() {
      this.loading = true
      if (!this.model.id) {
        createAiModel({
          id: this.model.id,
          platformId: this.model.platformId,
          name: this.model.name,
          showName: this.model.showName,
          state: 0,
          levelId: this.model.levelId,
          path: this.model.path,
          remark: this.model.remark
        }).then(() => {
          this.$message.success('操作成功！')
          this.$emit('changed')
          this.$emit('close')
        }).finally(() => {
          this.loading = false
        })
        return
      }
      updateAiModel({
        id: this.model.id,
        name: this.model.name,
        showName: this.model.showName,
        state: this.model.state,
        levelId: this.model.levelId,
        path: this.model.path,
        remark: this.model.remark
      }).then(() => {
        this.$message.success('操作成功！')
        this.$emit('changed')
        this.$emit('close')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
