<template>
  <div>
    <el-dialog
      v-el-drag-dialog
      :visible.sync="dialogTableVisible"
      :title="title"
      width="70%"
      style=""
      @dragDialog="handleDrag"
      @close="handleClose"
    >
      <!-- <el-select ref="select" v-model="value" placeholder="请选择">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select> -->
      <!-- <el-table :data="gridData">
        <el-table-column property="date" label="Date" width="150" />
        <el-table-column property="name" label="Name" width="200" />
        <el-table-column property="address" label="Address" />
      </el-table> -->
      <el-form ref="form" :model="model" label-width="80px">
        <el-form-item label="平台">
          <el-select v-model="model.platformId">
            <el-option v-for="p in platforms" :key="p.id" :label="p.name" :value="p.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="API KEY">
          <el-input v-model="model.key" />
        </el-form-item>
        <el-form-item label="适用模型">
          <el-select v-model="model.modelIds" multiple style="width: 100%" placeholder="未选择时默认适用于该平台下所有模型，若希望不适用于任何模型，请禁用此key">
            <el-option v-for="md in allModels.filter(m => m.platformId === model.platformId)" :key="md.id" :label="md.platformName + '-' + md.name" :value="md.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="!model.id" label="备注">
          <el-input v-model="model.remark" type="textarea" :row="1" autosize />
        </el-form-item>

        <template v-if="model.id">
          <el-form-item label="状态">
            <el-radio-group v-model="model.state" disabled>
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="账户状态">
            <el-tag v-if="model.billingState == 0" type="warning">未知</el-tag>
            <el-tag v-else-if="model.billingState == 1" type="success">正常</el-tag>
            <el-tag v-else-if="model.billingState == 10" type="danger">异常</el-tag>
            <el-tag v-else-if="model.billingState == 11" type="danger">禁用</el-tag>
            <el-tag v-else-if="model.billingState == 12" type="danger">过期</el-tag>
            <el-tag v-else-if="model.billingState == 13" type="danger">非法</el-tag>
            <el-tag v-else-if="model.billingState == 14" type="danger">欠费</el-tag>
          </el-form-item>
          <el-form-item label="余额">
            <template v-if="model.billingUsage > -1">
              <span>${{ model.billingUsage }} / ${{ model.billingSubs }}</span>
            </template>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="model.remark" type="textarea" :row="1" autosize />
          </el-form-item>
          <el-form-item label="创建者">
            <el-input v-model="model.creatorName" disabled />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="model.createTime" disabled />
          </el-form-item>
        </template>
        <template>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
          </el-form-item>
        </template>

      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { storeApiKey } from '@/api/apiKey.js'

export default {
  name: 'ApiKeyEdit',
  directives: { elDragDialog },
  props: {
    apiKey: {
      type: Object,
      default: () => {}
    },
    platforms: {
      type: Array,
      default: () => []
    },
    allModels: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogTableVisible: true,
      model: {
        id: null,
        platformId: null,
        key: null,
        modelIds: [],
        state: null,
        remark: null,
        billingState: null,
        creatorName: null,
        createTime: null
      }
    }
  },
  computed: {
    title() {
      return this.model.id ? 'API KEY编辑' : 'API KEY添加'
    }
  },
  created() {
    this.model.id = this.apiKey && this.apiKey.id || 0
    this.model.platformId = this.apiKey && this.apiKey.platformId
    this.model.state = this.apiKey && this.apiKey.state || 1
    this.model.billingState = this.apiKey && this.apiKey.billingState || 0
    this.model.key = this.apiKey && this.apiKey.key || ''
    this.model.remark = this.apiKey && this.apiKey.remark || ''
    this.model.modelIds = this.apiKey && this.apiKey.modelIds || []
    this.model.billingUsage = this.apiKey && this.apiKey.billingUsage || -1
    this.model.billingSubs = this.apiKey && this.apiKey.billingSubs || -1
    this.model.creatorName = this.apiKey && this.apiKey.creatorName || ''
    this.model.createTime = this.apiKey && this.apiKey.createTime || ''
  },
  methods: {
    // v-el-drag-dialog onDrag callback function
    handleDrag() {

    },
    handleClose() {
      this.$emit('close')
    },
    handleSubmit() {
      if (!this.model.platformId) {
        this.$message.error('请选择平台！')
        return
      }
      if (!this.model.key) {
        this.$message.error('请输入key！')
        return
      }
      storeApiKey(this.model.id, this.model.key, this.model.state, this.model.platformId, this.model.modelIds,
        this.model.remark).then(resp => {
        this.$message.success(this.model.id ? '修改成功！' : '添加成功！')
        this.$emit('created')
        this.$emit('close')
      })
    }
  }
}
</script>

<style lang="scss">

</style>
