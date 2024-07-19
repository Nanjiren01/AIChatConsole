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
            style="display: block; margin-top: 5px;"
            active-text="手动上传"
            inactive-text="emoji"
          />
          <div style="display: flex; margin: 10px 0;">
            <img
              v-if="form.avatarEmoji && !form.avatarType"
              class="emoji"
              style="cursor: pointer;width: 50px; height: 50px;border: 1px solid #e0e0e0; margin-right: 20px;"
              :src="`/emoji-date-apple-img-64-15.0.1/${form.avatarEmoji}.png`"
              @click="showEmojiDialog = !showEmojiDialog"
            >
            <img
              v-if="form.avatarFileUuid && form.avatarType"
              class="emoji"
              style="cursor: pointer;width: 50px; height: 50px;border: 1px solid #e0e0e0; margin-right: 20px;"
              :src="`${BASE_URL}/file/${form.avatarFileUuid}`"
            >
            <template v-if="!form.avatarType">
              <span v-if="showEmojiDialog">
                <el-button type="primary" plain @click="showEmojiDialog = false">关闭</el-button>
              </span>
              <span v-else-if="form.avatarEmoji">
                <el-button type="primary" plain @click="handleClickClearEmoji">清空</el-button>
              </span>
              <span v-else>
                <el-button type="primary" plain @click="showEmojiDialog = true">选择emoji</el-button>
              </span>
            </template>
          </div>
          <div>
            <VEmojiPicker
              v-show="showEmojiDialog && !form.avatarType"
              :style="{ width: '440px', height: '200' }"
              label-search="搜索"
              lang="pt-BR"
              @select="onSelectEmoji"
            />
            <el-upload
              v-if="form.avatarType"
              ref="upload"
              class="upload-demo"
              accept=".png,.jpg,.bmp,.gif"
              drag
              :headers="headers"
              :data="{ usage: 'model' }"
              :action="BASE_URL + '/file/upload'"
              :auto-upload="true"
              :show-file-list="false"
              :on-change="handleChange"
              :on-error="handleError"
              :on-success="handleSuccess"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将图片拖到此处，或<em>点击选择图片</em></div>
              <div slot="tip" class="el-upload__tip">只能上传不超过500KB的图片</div>
            </el-upload>
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

import { getToken } from '@/utils/auth'

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
      },

      BASE_URL: process.env.VUE_APP_BASE_API || '',
      fileList: []
    }
  },
  computed: {
    headers() {
      return {
        Authorization: 'Bearer ' + getToken()
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
    },
    handleSuccess(resp, file, fileList) {
      // this.$emit('changed')
      // console.log(resp, file, fileList)
      this.form.avatarFileUuid = resp.data.uuid
      this.$message.success('上传成功！')
      this.$nextTick(() => {
        this.fileList.splice(0, this.fileList.length)
        console.log('this.fileList', this.fileList)
      })
    },
    handleError(err, file, fileList) {
      try {
        const json = JSON.parse(err.message)
        if (json.code === 11001) {
          this.$message.error('上传失败！请先删除原来的logo！')
          return
        }
        this.$message.error('上传失败！原因：' + json.message)
      } catch (e) {
        this.$message.error('上传失败！原因：' + err)
        console.error(err)
      }
    },
    handleChange(file, fileList) {
      // console.log('handleChange', file, fileList)
      this.fileList.splice(0, this.fileList.length, ...fileList)
      // console.log(this.fileList)
    }
  }
}
</script>

