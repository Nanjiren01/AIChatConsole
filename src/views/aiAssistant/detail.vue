<template>
  <el-dialog
    title="助手创建/修改"
    :visible="dialogVisible"
    width="500px"
    @close="handleClose"
  >
    <div style="margin: 0 auto;">
      <el-form ref="form" label-width="120px">
        <el-form-item label="助手名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="平台">
          <el-select v-model="form.platformId" clearable :disabled="!!form.id">
            <el-option
              v-for="item in platforms.filter(p => p.chatProtocol === 'OpenAiChat').filter(k => k.state === 1)"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="模型">
          <el-select v-model="form.modelId" clearable>
            <el-option
              v-for="mdl in models.filter(m => (!form.platformId || m.platformId === form.platformId)).filter(k => k.state === 1)"
              :key="mdl.id"
              :label="mdl.name"
              :value="mdl.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="API KEY">
          <el-select v-model="form.apiKeyId" clearable :disabled="!!form.id" placeholder="选择后，系统将使用该key创建助手">
            <el-option
              v-for="item in apiKeys.filter(m => (!form.platformId || m.platformId === form.platformId)).filter(k => k.state === 1)"
              :key="item.id"
              :label="item.key"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="助手描述">
          <el-input v-model="form.description" />
        </el-form-item>
        <el-form-item label="助手指令">
          <el-input v-model="form.instructions" />
        </el-form-item>
        <el-form-item label="可用工具">
          <el-input v-model="form.tools" disabled />
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

import { createAssistant, updateAssistant } from '@/api/aiAssistant.js'

export default {
  name: '',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    assistant: {
      type: Object,
      default: () => {}
    },
    platforms: {
      type: Array,
      default: () => []
    },
    models: {
      type: Array,
      default: () => []
    },
    apiKeys: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        id: null,
        name: null,
        platformId: null,
        modelId: null,
        apiKeyId: null,
        description: null,
        instructions: null,
        tools: '',
        state: null
      }
    }
  },
  computed: {
    selectedModel() {
      return (this.models || []).find(m => m.id === this.form.modelId)
    }
  },
  watch: {
    assistant: {
      deep: true,
      handler() {
        this.form.id = this.assistant.id
        this.form.uuid = this.assistant.uuid
        this.form.name = this.assistant.name
        this.form.description = this.assistant.description
        this.form.instructions = this.assistant.instructions
        this.form.tools = this.assistant.id ? this.assistant.tools : '[{"type":"code_interpreter"},{"type":"retrieval"}]'
        this.form.modelId = this.assistant.modelId
        this.form.apiKeyId = this.assistant.apiKeyId
        this.form.state = this.assistant.state

        this.form.platformId = this.selectedModel ? this.selectedModel.platformId : null
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
      if (!this.form.id) {
        createAssistant({
          name: this.form.name,
          description: this.form.description,
          instructions: this.form.instructions,
          tools: this.form.tools,
          modelId: this.form.modelId,
          apiKeyId: this.form.apiKeyId
        }).then(() => {
          this.$message.success('操作成功！')
          this.$emit('changed')
        }).finally(() => {
          this.loading = false
        })
        return
      }
      updateAssistant(this.form.uuid, {
        name: this.form.name,
        description: this.form.description,
        instructions: this.form.instructions || '',
        tools: this.form.tools,
        modelId: this.form.modelId
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

