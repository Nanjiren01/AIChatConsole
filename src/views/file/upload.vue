<template>
  <div style="padding: 10px;">

    <div style="border: #ccc 1px solid; border-radius: 4px;padding: 10px;">
      <el-form label-width="120px" style="max-width: 600px; margin: 0 auto;">
        <el-form-item label="用途">
          <el-select v-model="fileUsage">
            <el-option label="Logo" value="logo" />
            <el-option label="公告" value="notice" />
            <el-option label="余额相关" value="balance" />
            <el-option label="其他" value="others" />
          </el-select>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            :headers="headers"
            :file-list="fileList"
            :data="uploadData"
            :action="BASE_URL + '/file/upload'"
            :auto-upload="false"
            :on-change="handleChange"
            :on-error="handleError"
            :on-success="handleSuccess"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击选择文件</em></div>
            <div slot="tip" class="el-upload__tip">只能上传不超过500KB的文件</div>
          </el-upload>
        </el-form-item>
        <el-button type="primary" style="width: 100%;margin-bottom: 20px" @click="upload">上传</el-button>
        <!-- <el-form-item label="操作">
          <el-button type="primary" style="width: 100%;" @click="upload">上传</el-button>
        </el-form-item> -->
      </el-form>

    </div>

  </div>
</template>

<script>

import { getToken } from '@/utils/auth'

export default {
  name: 'FileUpload',
  data() {
    return {
      BASE_URL: process.env.VUE_APP_BASE_API || '',
      fileUsage: 'logo',
      imageUrl: '',
      fileList: []
    }
  },
  computed: {
    uploadData() {
      return {
        usage: this.fileUsage
      }
    },
    headers() {
      return {
        Authorization: 'Bearer ' + getToken()
      }
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 < 500

      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    upload() {
      console.log('this.fileList', this.fileList)
      if (this.fileList.length === 0) {
        this.$message.error('请选择文件！')
        return
      }
      this.$refs.upload.submit()
    },
    // uploadFile(e) {
    //   this.$refs.upload.submit()
    //   // 创建FormData对象
    //   // console.log('this.$refs.upload.$el', this.$refs.upload.$el, this.fileList)
    //   // const formData = new FormData()
    //   // formData.append('usage', this.fileUsage)
    //   // formData.append('file', this.$refs.upload.$el) // file是一个File对象，表示要上传的文件

    //   // // 发起上传请求
    //   // request.post('/file/upload', formData, {
    //   //   headers: {
    //   //     'Content-Type': 'multipart/form-data' // 设置请求头，指定为multipart/form-data类型
    //   //   }
    //   // }).then(response => {
    //   //   console.log('success')
    //   // }).catch(error => {
    //   //   console.error('error', error)
    //   // })
    // },
    handleSuccess() { // response, file, fileList
      this.$emit('changed')
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
    // handleProress(event, file, fileList) {
    //   console.log(event, file, fileList)
    // }
  }
}
</script>

<style scoped lang="scss">
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
::v-deep .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
