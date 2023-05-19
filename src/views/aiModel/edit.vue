<template>
  <el-drawer
    :title="title"
    size="60%"
    :visible.sync="drawer"
    :before-close="handleClose"
  >
    <div style="padding: 20px">
      <el-form ref="form" label-width="260px" style="padding-right: 180px">
        <el-form-item label="用户名（账号）">
          <el-select v-model="model.platformId" disabled>
            <el-option :value="1" label="OpenAI" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="model.name" disabled />
        </el-form-item>
        <el-form-item label="状态">
          <el-tag v-if="model.state == 1" type="success">正常</el-tag>
          <el-tag v-else type="danger">停用</el-tag>
        </el-form-item>
        <el-form-item label="计费方式">
          <el-select v-model="model.levelId" disabled>
            <el-option :value="1" label="普通聊天" />
            <el-option :value="2" label="高级聊天（GPT4）" />
            <el-option :value="3" label="tokens" />
            <el-option :value="4" label="绘画" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="model.createTime" disabled />
        </el-form-item>
      </el-form>

    </div>
  </el-drawer>
</template>

<script>

// import AiTable from '@/components/Table'
// import { getBalanceRecordByUserId } from '@/api/balance'

export default {
  name: 'MemberDetail',
  components: { },
  props: {
    model: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      drawer: true,
      innerModel: {
        id: this.model.id,
        name: this.model.name,
        level: this.model.level,
        levelId: this.model.levelId,
        platformId: this.model.platformId,
        platformName: this.model.platformName,
        createTime: this.model.platformName
      }
    }
  },
  computed: {
    title() {
      return this.model.name ? ('查看模型：' + this.model.name) : '新建模型'
    }
  },
  mounted() {
    // this.reload()
  },
  methods: {
    // reload() {
    //   getAiModelById(this.model.id).then(resp => {
    //     console.log('resp', resp)

    //   })
    // },
    handleClose() {
      this.drawer = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
