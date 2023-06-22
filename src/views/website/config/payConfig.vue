<template>
  <div>
    <div style="margin: 0 auto; width: 500px;">
      <el-form ref="form" :model="form" label-width="180px">
        <el-form-item label="默认支付方式">
          <el-select v-model="form.thirdpartName">
            <el-option :label="'虎皮椒'" :value="'xunhu'" />
            <el-option :label="'蓝兔'" :value="'lantu'" />
          </el-select>
        </el-form-item>
        <el-form-item label="虎皮椒AppId">
          <el-input v-model="form.xunhuAppId" />
        </el-form-item>
        <el-form-item label="虎皮椒AppSecret">
          <el-input v-model="form.xunhuAppSecret" type="password" />
        </el-form-item>
        <el-form-item label="蓝兔商户号">
          <el-input v-model="form.lantuAppId" />
        </el-form-item>
        <el-form-item label="蓝兔商户秘钥">
          <el-input v-model="form.lantuAppSecret" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="loading" @click="handleSubmit">
            {{ loading ? '保存中……' : '提 交' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import { getPayConfig, savePayConfig } from '@/api/globalConfig'

export default {
  name: 'PayConfig',
  data() {
    return {
      loading: false,
      form: {
        thirdpartName: '',
        xunhuAppId: '',
        xunhuAppSecret: '',
        lantuAppId: '',
        lantuAppSecret: ''
      }
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload() {
      this.loading = true
      getPayConfig().then(resp => {
        // console.log('resp', resp)
        const content = resp.data.payContent
        this.form.thirdpartName = content.thirdpartName
        this.form.xunhuAppId = content.xunhuAppId
        this.form.xunhuAppSecret = content.xunhuAppSecret
        this.form.lantuAppId = content.lantuAppId
        this.form.lantuAppSecret = content.lantuAppSecret
      }).finally(() => {
        this.loading = false
      })
    },
    handleSubmit() {
      this.loading = true
      savePayConfig({
        thirdpartPayName: this.form.thirdpartName,
        xunhuAppId: this.form.xunhuAppId,
        xunhuAppSecret: this.form.xunhuAppSecret,
        lantuAppId: this.form.lantuAppId,
        lantuAppSecret: this.form.lantuAppSecret
      }).then(() => {
        this.$message.success('保存成功！')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
