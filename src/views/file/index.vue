<template>
  <div>
    <file-upload v-if="showUploadDialog" @changed="reload" />

    <ai-table
      :loading="loading"
      :table-columns="tableColumns"
      :table-data="files"
      :table-action-column="tableActionColumn"
      :pagination="pagination"
      @refresh="handleRefresh"
    >

      <template #filter>
        <div v-if="!loadingConfig && !frontBaseUrl">
          <el-alert title="请先前往「网站管理」->「页面配置」设置网站基址！" type="warning" :closable="false" />
        </div>
      </template>
      <template #topActions>
        <el-button type="primary" icon="el-icon-plus" plain @click="handleShowUpload">
          {{ showUploadDialog ? '关闭' : '上传' }}
        </el-button>
        <!-- <el-button type="danger" icon="el-icon-delete" disabled>删除</el-button> -->
      </template>
      <template v-slot:rowActions="slotProps">
        <el-button icon="el-icon-delete" type="danger" plain @click.stop="handleDelete(slotProps.row)">删除</el-button>
      </template>

      <template v-slot:originalName="props">
        <div>
          文件名：{{ props.row.originalName }}
        </div>
        <div>
          前台链接：{{ frontBaseUrl + '/api/file/' + props.row.uuid }}
          <el-button
            v-clipboard:copy="frontBaseUrl + '/api/file/' + props.row.uuid"
            v-clipboard:success="() => copyLinkSuccess(props.row)"
            type="text primary"
            @click.stop="() => copyLink(props.row, $event)"
          >复制</el-button>
        </div>
      </template>
      <template v-slot:content="props">
        <img
          :src="getSrc(props.row)"
          style="max-width: 150px; max-height: 100px;"
        >
      </template>
    </ai-table>
  </div>
</template>

<script>

import request from '@/utils/request'
// import clip from '@/utils/clipboard' // use clipboard directly
import { getWebsiteConfig } from '@/api/globalConfig'
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive

import { getToken } from '@/utils/auth'

import AiTable from '@/components/Table'
import FileUpload from './upload'

export default {
  name: 'FileIndex',
  components: { AiTable, FileUpload },
  directives: {
    clipboard
  },
  data() {
    return {
      BASE_URL: process.env.VUE_APP_BASE_API || '',
      loading: false,
      loadingConfig: false,
      showUploadDialog: false,
      frontBaseUrl: '',
      files: [],
      tableColumns: [{
        label: '#',
        prop: 'id',
        width: 55
      }, {
        label: '图片',
        slot: 'content',
        width: 160
      // }, {
      //   label: 'uuid',
      //   prop: 'uuid',
      //   width: '120'
      }, {
        label: '文件名',
        slot: 'originalName'
      }, {
        label: '大小',
        prop: 'size',
        width: 80
      }, {
        label: '用途',
        prop: 'usage',
        width: 100
      }, {
        label: '上传时间',
        prop: 'createTime',
        width: 160
      }],
      tableActionColumn: {
        width: 100
      },
      pagination: {
        total: 0,
        showDetail: false
      }
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload() {
      this.loading = true
      request({
        url: '/file/all/normal',
        method: 'get',
        params: {}
      }).then(resp => {
        // console.log('resp', resp.data)
        this.files.splice(0, this.files.length)
        resp.data.forEach(file => {
          this.files.push({ ... file })
        })
        this.pagination.total = this.files.length
      }).finally(() => {
        this.loading = false
      })
      this.refreshWebsiteConfig()
    },
    refreshWebsiteConfig() {
      this.loadingConfig = true
      getWebsiteConfig().then(resp => {
        const config = resp.data
        this.frontBaseUrl = config.websiteContent.frontBaseUrl
      }).finally(() => {
        this.loadingConfig = false
      })
    },
    handleRefresh() {
      this.reload()
    },
    handleShowUpload() {
      this.showUploadDialog = !this.showUploadDialog
    },
    getSuffix(row) {
      if (!row.originalName) {
        return ''
      }
      const index = row.originalName.lastIndexOf('.')
      if (index === -1) {
        return ''
      }
      return row.originalName.substring(index + 1)
    },
    copyLinkSuccess(row) {
      this.$message({
        message: '复制成功！',
        type: 'success'
      })
    },
    handleDelete(row) {
      this.$confirm('确定删除' + row.originalName + '吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'long-message',
        width: '600px',
        type: 'warning'
      }).then(async() => {
        this.loading = true
        request({
          url: '/file/' + row.uuid,
          method: 'delete',
          headers: {
            Authorization: 'Bearer ' + getToken()
          }
        }).then(resp => {
          this.reload()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    getSrc(row) {
      if (row.mimeType === 'image/svg+xml') {
        return this.BASE_URL + '/file/' + row.uuid
      }
      return 'data:image/' + this.getSuffix(row) + ';base64,' + row.content
    }
  }
}
</script>

<style scoped lang="scss">

</style>
