<template>
  <div class="page-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>注册赠额</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="handleShowRegisterQuotaActivity">配置</el-button>
          </div>
          <div>注册即赠送额度</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>更多活动</span>
            <el-button style="float: right; padding: 3px 0" type="text" />
          </div>
          <div>敬请期待</div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      title="注册赠额活动配置"
      :visible.sync="registerQuotaActivityDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <register-quota-activity />
      <span slot="footer" class="dialog-footer">
        <el-button @click="registerQuotaActivityDialogVisible = false">关闭</el-button>
        <!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
      </span>
    </el-dialog>

  </div>
</template>

<script>

import RegisterQuotaActivity from './registerQuotaActivity'

export default {
  name: 'ActivityIndex',
  components: { RegisterQuotaActivity },
  data() {
    return {
      registerQuotaActivityDialogVisible: false
    }
  },
  methods: {
    handleShowRegisterQuotaActivity() {
      this.registerQuotaActivityDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 10px;
}
</style>
