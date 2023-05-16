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
          <el-select v-model="model.platformId" disabled>
            <el-option label="OpenAI" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="API KEY">
          <el-input v-model="model.key" />
        </el-form-item>

        <template v-if="model.id">
          <el-form-item label="状态">
            <el-radio-group v-model="model.state" disabled>
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="2">停用</el-radio>
              <el-radio :label="3">初始</el-radio>
              <el-radio :label="4">额度查询中</el-radio>
              <el-radio :label="5">key被禁用</el-radio>
              <el-radio :label="6">key不合法</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="创建者">
            <el-input v-model="model.creatorName" disabled />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="model.createTime" disabled />
          </el-form-item>
        </template>

      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

export default {
  name: 'ApiKeyEdit',
  directives: { elDragDialog },
  props: {
    apiKey: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogTableVisible: true,
      model: {
        id: null,
        platformId: null,
        key: null,
        state: null,
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
    this.model.platformId = this.apiKey && this.apiKey.platformId || 0
    this.model.state = this.apiKey && this.apiKey.state || 1
    this.model.key = this.apiKey && this.apiKey.key || ''
    this.model.creatorName = this.apiKey && this.apiKey.creatorName || ''
    this.model.createTime = this.apiKey && this.apiKey.createTime || ''
  },
  methods: {
    // v-el-drag-dialog onDrag callback function
    handleDrag() {

    },
    handleClose() {
      // console.log('close')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">

</style>
