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
        <el-form-item v-if="maskEntity.id" label="#">
          <el-input v-model="maskEntity.id" disabled />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="maskEntity.name" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model="maskEntity.avatar" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="语言">
          <el-input v-model="maskEntity.lang" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="maskEntity.type" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="配置">
          <el-input v-model="maskEntity.modelConfigJson" type="textarea" :rows="10" autosize :disabled="disabled" />
        </el-form-item>
        <el-form-item label="上下文">
          <el-input v-model="maskEntity.contextJson" type="textarea" :rows="20" autosize :disabled="disabled" />
        </el-form-item>
        <el-form-item v-if="maskEntity.id" label="内置（builtin）">
          <el-switch :value="true" disabled />
        </el-form-item>
        <el-form-item v-if="maskEntity.id" label="状态">
          <span style="margin-right: 10px;">
            <el-tag v-if="maskEntity.state === 0" type="priamry">草稿</el-tag>
            <el-tag v-if="maskEntity.state === 10" type="success">已发布</el-tag>
            <el-tag v-if="maskEntity.state === 20" type="success">已删除</el-tag>
          </span>
          <el-button v-if="maskEntity.id && [0, 10].includes(maskEntity.state)" type="primary" @click.stop="handleToggleEnable()">
            {{ maskEntity.state == 0 ? '发布' : '取消发布' }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="disabled" @click="handleSubmit">
            {{ loading ? '操作中……' : maskEntity.id ? '保存' : '创建' }}
          </el-button>
        </el-form-item>
      </el-form>
      <el-form style="margin-top: 100px;">
        <el-form-item v-if="maskEntity.id">
          <el-button type="danger" @click="handleDelete">
            删除
          </el-button>
        </el-form-item>
      </el-form>

    </div>
  </el-drawer>
</template>

<script>

import { createMask, updateMask, deleteMask, toDraft, toNormal } from '@/api/mask'

export default {
  name: 'MaskDetail',
  components: { },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    maskEntity: {
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
      return this.maskEntity.id ? ((this.maskEntity.name || '') + '详情') : '创建面具'
    },
    disabled() {
      return (this.loading) || this.maskEntity.state === 20 // 20-删除
    }
  },
  mounted() {
    // this.reload()
  },
  methods: {
    reload() { // 对外接口
      if (!this.maskEntity.id) {
        return
      }
    },
    handleClose() {
      this.$emit('close')
    },
    handleRefresh() {
      this.reload()
    },
    handleSubmit() {
      if (!this.maskEntity.name) {
        this.$message.error('名称不能为空！')
        return
      }
      if (!this.maskEntity.contextJson) {
        this.$message.error('上下文不能为空')
        return
      }
      if (!this.maskEntity.modelConfigJson) {
        this.$message.error('配置不能为空')
        return
      }
      if (!this.maskEntity.avatar) {
        this.$message.error('头像不能为空！')
        return
      }
      if (!this.maskEntity.lang) {
        this.$message.error('语言不能为空！')
        return
      }
      if (this.maskEntity.id) {
        if (this.maskEntity.state === 20) {
          this.$message.error('已删除的数据无法修改！')
          return
        }
        this.loading = true
        updateMask(this.maskEntity).then((resp) => {
          this.$message.success('操作成功！')
          this.$emit('changed', this.maskEntity.id)
        }).finally(() => {
          this.loading = false
        })
      } else {
        this.loading = true
        createMask({
          name: this.maskEntity.name,
          avatar: this.maskEntity.avatar,
          lang: this.maskEntity.lang,
          type: this.maskEntity.type,
          modelConfigJson: this.maskEntity.modelConfigJson,
          contextJson: this.maskEntity.contextJson
        }).then((resp) => {
          this.$message.success('创建成功！')
          this.$emit('changed', resp.data.id)
        }).finally(() => {
          this.loading = false
        })
      }
    },
    handleToggleEnable() {
      const row = this.maskEntity
      if (row.state === 10) {
        toDraft(row.id).then(() => {
          this.$message.success('操作成功！')
          this.$emit('changed', row.id)
        })
      } else {
        toNormal(row.id).then(() => {
          this.$message.success('操作成功！')
          this.$emit('changed', row.id)
        })
      }
    },
    handleDelete() {
      const row = this.maskEntity
      this.$confirm('确定删除' + row.name + '吗？',
        '删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async() => {
        deleteMask(row.id).then(() => {
          this.$message.success('操作成功！')
          this.$emit('changed')
          this.$emit('close')
        })
      })
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
