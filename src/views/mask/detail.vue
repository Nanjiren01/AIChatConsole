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
          <!-- <el-input v-model="maskEntity.avatar" :disabled="disabled" /> -->
          <div style="display: flex; margin-bottom: 10px;">
            <img
              class="emoji"
              style="cursor: pointer;width: 50px; height: 50px;"
              :src="`https://cdn.staticfile.org/emoji-datasource-apple/14.0.0/img/apple/64/${maskEntity.avatar}.png`"
              @click="showEmojiDialog = !showEmojiDialog"
            >
            <span v-if="showEmojiDialog" style="margin-left: 20px;">
              <el-button type="primary" plain @click="showEmojiDialog = false">关闭</el-button>
            </span>
          </div>
          <div>
            <VEmojiPicker
              v-show="showEmojiDialog"
              :style="{ width: '440px', height: '200' }"
              label-search="搜索"
              lang="pt-BR"
              @select="onSelectEmoji"
            />
          </div>
        </el-form-item>
        <el-form-item label="语言">
          <el-select v-model="maskEntity.lang" :disabled="disabled">
            <el-option label="中文" value="cn" />
            <el-option label="英文" value="en" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="maskEntity.type" :disabled="disabled" />
        </el-form-item>
        <!-- <el-form-item label="配置">
          <el-input v-model="maskEntity.modelConfigJson" type="textarea" :rows="10" autosize :disabled="true" />
        </el-form-item> -->
        <el-form-item label="模型">
          <el-select
            v-model="modelConfig.model"
            :disabled="disabled"
            @change="handleRebuildModelConfigJson"
          >
            <el-option v-for="mdl in models" :key="mdl.name" :label="mdl.name" :value="mdl.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="随机性">
          <el-input-number v-model="modelConfig.temperature" :disabled="disabled" @change="handleRebuildModelConfigJson" />（temperature）
        </el-form-item>
        <el-form-item label="单次回复限制">
          <el-input-number v-model="modelConfig.max_tokens" :disabled="disabled" @change="handleRebuildModelConfigJson" />（max_tokens）
        </el-form-item>
        <el-form-item label="话题新鲜度">
          <el-input-number v-model="modelConfig.presence_penalty" :disabled="disabled" @change="handleRebuildModelConfigJson" />（presence_penalty）
        </el-form-item>
        <el-form-item label="频率惩罚度">
          <el-input-number v-model="modelConfig.frequency_penalty" :disabled="disabled" @change="handleRebuildModelConfigJson" />（frequency_penalty）
        </el-form-item>
        <el-form-item label="sendMemory">
          <el-switch v-model="modelConfig.sendMemory" :disabled="disabled" @change="handleRebuildModelConfigJson" />
        </el-form-item>
        <el-form-item label="附带历史消息数">
          <el-input-number v-model="modelConfig.historyMessageCount" :disabled="disabled" @change="handleRebuildModelConfigJson" />
        </el-form-item>
        <el-form-item label="历史消息长度压缩阈值">
          <el-input-number v-model="modelConfig.compressMessageLengthThreshold" :disabled="disabled" @change="handleRebuildModelConfigJson" />
        </el-form-item>
        <!-- <el-form-item label="上下文">
          <el-input v-model="maskEntity.contextJson" type="textarea" :rows="20" autosize :disabled="true" />
        </el-form-item> -->
        <el-form-item label="消息上下文">
          <div v-for="(message, index) in context" :key="index">
            <div class="chat-item">
              <el-select v-model="message.role" style="width: 70px;" @change="handleRebuildContextJson">
                <el-option label="系统" value="system" />
                <el-option label="用户" value="user" />
                <el-option label="AI" value="assistant" />
              </el-select>
              ：<i class="el-icon-delete delete-message-button" @click="handleDeleteMessage(index)">删除此消息</i>
              <el-input
                v-model="message.content"
                style="margin-top: 2px;"
                type="textarea"
                autosize
                @change="handleRebuildContextJson"
              />
            </div>
          </div>
          <div style="margin-top: 5px;">
            <i
              class="el-icon-plus"
              style="color: #67C23A; cursor: pointer"
              @click="context.push({role: 'system', content: '', date: ''}); handleRebuildContextJson()"
            >
              添加新消息
            </i>
          </div>
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
          <el-button
            v-if="maskEntity.id && [0, 10].includes(maskEntity.state)"
            type="success"
            plain
            @click.stop="handleToggleEnable()"
          >
            {{ maskEntity.state == 0 ? ' 发 布 ' : '取消发布' }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="disabled" style="width: 100%;" @click="handleSubmit">
            {{ loading ? '操作中……' : maskEntity.id ? '保 存' : '创 建' }}
          </el-button>
        </el-form-item>
      </el-form>
      <el-form style="margin-top: 100px;">
        <el-form-item v-if="maskEntity.id">
          <el-button type="danger" @click="handleDelete">
            删 除
          </el-button>
        </el-form-item>
      </el-form>

    </div>
  </el-drawer>
</template>

<script>

import { VEmojiPicker, emojisDefault, categoriesDefault } from 'v-emoji-picker'

import { createMask, updateMask, deleteMask, toDraft, toNormal } from '@/api/mask'

export default {
  name: 'MaskDetail',
  components: { VEmojiPicker },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    maskEntity: {
      type: Object,
      default: () => []
    },
    models: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      drawer: true,
      showEmojiDialog: false,
      modelConfig: {
        model: null,
        temperature: null,
        max_tokens: null,
        presence_penalty: null,
        frequency_penalty: null,
        sendMemory: null,
        historyMessageCount: null,
        compressMessageLengthThreshold: null
      },
      context: []
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
  watch: {
    maskEntity: {
      deep: true,
      immediate: true,
      handler(newValue) {
        // console.log('maskEntity changed', newValue)
        // if (!newValue) {
        //   this.modelConfig.model = ''
        //   this.modelConfig.temperature = 0.5
        //   this.modelConfig.max_tokens = 2000
        //   this.modelConfig.presence_penalty = 0
        //   this.modelConfig.sendMemory = true
        //   this.modelConfig.historyMessageCount = 4
        //   this.modelConfig.compressMessageLengthThreshold = 1000
        //   return
        // }
        var modelConfigJson = newValue.modelConfigJson
        console.log('modelConfigJson changed', modelConfigJson)
        const modelConfig = JSON.parse(modelConfigJson || '{}')
        this.modelConfig.model = modelConfig.model || ''
        this.modelConfig.temperature = modelConfig.temperature || 1
        this.modelConfig.max_tokens = modelConfig.max_tokens || 1000
        this.modelConfig.presence_penalty = modelConfig.presence_penalty || 0
        this.modelConfig.sendMemory = modelConfig.sendMemory || false
        this.modelConfig.historyMessageCount = modelConfig.historyMessageCount || 0
        this.modelConfig.compressMessageLengthThreshold = modelConfig.compressMessageLengthThreshold || 0
      }
    },
    'maskEntity.contextJson': {
      immediate: true,
      handler(contextJson) {
        if (!contextJson) {
          this.context = []
        }
        this.context.splice(0, this.context.length)
        this.context.push(...JSON.parse(contextJson || '[]'))
        console.log(this.context)
      }
    }
  },
  mounted() {
    // this.reload()
    console.log(categoriesDefault)
    console.log('Total emojis:', emojisDefault.length)
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
    },
    onSelectEmoji(emoji) {
      console.log('emoji', emoji)
      function emojiToUnicode(emoji) {
        const codePoint1 = emoji.charCodeAt(0)
        const codePoint2 = emoji.charCodeAt(1)
        console.log('codePoint', codePoint1, codePoint2)
        const highSurrogate = (codePoint1 - 0xD800) * 0x400
        const lowSurrogate = codePoint2 - 0xDC00
        const codePoint = highSurrogate + lowSurrogate + 0x10000
        return codePoint.toString(16)
      }
      this.showEmojiDialog = false
      var unicode = emojiToUnicode(emoji.data)
      this.maskEntity.avatar = unicode
      console.log('unicode', unicode)
    },
    getRoleText(role) {
      return ({
        user: '用户',
        system: '系统预设',
        assistant: 'AI'
      })[role]
    },
    handleRebuildModelConfigJson() {
      console.log('rebuild')
      this.maskEntity.modelConfigJson = JSON.stringify(this.modelConfig, null, '\t')
    },
    handleRebuildContextJson() {
      console.log('rebuild')
      this.maskEntity.contextJson = JSON.stringify(this.context, null, '\t')
    },
    handleDeleteMessage(index) {
      this.context.splice(index, 1)
      this.handleRebuildContextJson()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__body {
  height: calc(100% - 77px);
  overflow-y: auto;
}
.emoji {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 5px;
}
.emoji:hover {
  background-color: azure;
}

.chat-item {
  box-sizing: border-box;
  max-width: 100%;
  margin-top: 10px;
  border: 1px solid #d0d0d0;
  border-radius: 10px;
  background-color: rgba(0,0,0,.05);
  padding: 10px;
  font-size: 14px;
  -webkit-user-select: text;
  -moz-user-select: text;
  user-select: text;
  word-break: break-word;
  border: var(--border-in-light);
  position: relative;
  transition: all .3s ease;
}

.delete-message-button {
  color: #F56C6C;
  cursor: pointer;float: right;
  top: 6px;
  right: 5px;
  position: relative;
}
</style>
