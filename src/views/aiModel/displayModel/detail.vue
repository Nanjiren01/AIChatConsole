<template>
  <el-dialog
    title="展示模型修改"
    :visible="dialogVisible"
    width="800px"
    append-to-body
    @close="handleClose"
  >
    <div style="margin: 0 auto;">
      <el-form ref="form" label-width="180px">
        <el-form-item label="uudi">
          <el-input v-model="form.uuid" disabled />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" />
        </el-form-item>
        <el-form-item label="置顶值">
          <el-input-number v-model="form.order" :controls="false" />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="form.createTime" disabled />
        </el-form-item>
        <el-form-item label="更新时间">
          <el-input v-model="form.updateTime" disabled />
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleEditSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { updateDisplayModel } from '@/api/aiModel.js'

export default {
  name: '',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    displayModel: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      modelConfig: {},
      form: {
        id: null,
        uuid: null,
        name: null,
        remark: null,
        contentType: null,
        state: null,
        order: null,
        createTime: null,
        updateTime: null
      }
    }
  },
  watch: {
    displayModel: {
      deep: true,
      handler() {
        this.form.id = this.displayModel.id
        this.form.uuid = this.displayModel.uuid
        this.form.name = this.displayModel.name
        this.form.remark = this.displayModel.remark
        this.form.contentType = this.displayModel.contentType
        this.form.order = this.displayModel.order
        this.form.state = this.displayModel.state
        this.form.createTime = this.displayModel.createTime
        this.form.updateTime = this.displayModel.updateTime
      }
    }
  },
  methods: {
    handleEditSubmit() {
      if (!this.form.name) {
        this.$message.error('名称不能为空！')
        return
      }
      this.loading = true
      updateDisplayModel({
        uuid: this.form.uuid,
        name: this.form.name,
        remark: this.form.remark,
        order: this.form.order
      }).then(() => {
        this.$message.success('操作成功！')
        this.$emit('changed')
      }).finally(() => {
        this.loading = false
      })
    },
    handleCancel() {
      this.handleClose()
    },
    handleClose() {
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

