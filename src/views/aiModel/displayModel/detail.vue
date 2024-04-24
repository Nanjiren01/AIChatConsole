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
        <el-form-item label="uuid">
          <el-input v-model="form.uuid" disabled />
        </el-form-item>
        <el-form-item label="头像">
          <el-switch
            v-model="form.avatarType"
            :disabled="true"
            style="display: block; margin-top: 5px;"
            active-text="文件"
            inactive-text="emoji"
          />
          <div style="display: flex; margin: 10px 0;">
            <img
              v-if="form.avatarEmoji"
              class="emoji"
              style="cursor: pointer;width: 50px; height: 50px;border: 1px solid #e0e0e0; margin-right: 20px;"
              :src="`/emoji-date-apple-img-64-15.0.1/${form.avatarEmoji}.png`"
              @click="showEmojiDialog = !showEmojiDialog"
            >
            <span v-if="showEmojiDialog">
              <el-button type="primary" plain @click="showEmojiDialog = false">关闭</el-button>
            </span>
            <span v-else-if="form.avatarEmoji">
              <el-button type="primary" plain @click="handleClickClearEmoji">清空</el-button>
            </span>
            <span v-else>
              <el-button type="primary" plain @click="showEmojiDialog = true">选择emoji</el-button>
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
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.desc" />
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

import { VEmojiPicker, emojisDefault, categoriesDefault } from 'v-emoji-picker'

import { updateDisplayModel } from '@/api/aiModel.js'

export default {
  name: '',
  components: { VEmojiPicker },
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
      showEmojiDialog: false,
      form: {
        id: null,
        avatarType: false,
        avatarEmoji: null,
        avatarFileUuid: null,
        uuid: null,
        name: null,
        desc: null,
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
        this.form.desc = this.displayModel.desc
        this.form.remark = this.displayModel.remark
        this.form.contentType = this.displayModel.contentType
        this.form.order = this.displayModel.order
        this.form.state = this.displayModel.state
        this.form.avatarEmoji = this.displayModel.avatarEmoji
        this.form.avatarFileUuid = this.displayModel.avatarFileUuid
        this.form.avatarType = (this.displayModel.avatarFileUuid ? 'file' : 'emoji') === 'file'
        this.form.createTime = this.displayModel.createTime
        this.form.updateTime = this.displayModel.updateTime
      }
    }
  },
  mounted() {
    console.log(categoriesDefault)
    console.log('Total emojis:', emojisDefault.length)
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
        desc: this.form.desc,
        remark: this.form.remark,
        order: this.form.order,
        avatarEmoji: this.form.avatarType ? null : this.form.avatarEmoji,
        avatarFileUuid: this.form.avatarType ? this.form.avatarFileUuid : null
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
      this.form.avatarEmoji = unicode
      console.log('unicode', unicode)
    },
    handleClickClearEmoji() {
      this.form.avatarEmoji = null
    }
  }
}
</script>

