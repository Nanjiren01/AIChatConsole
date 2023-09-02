<template>
  <div class="dashboard-editor-container">

    <!-- <el-alert
      title="此页面数据为假数据，后续版本将会接入真实数据"
      type="warning"
      :closable="false"
    /> -->

    <panel-group :basic-data="basicData" />
    <!--  @handleSetLineChartData="handleSetLineChartData" -->

    <el-alert
      title="订单总数、金额仅统计已支付的订单。订单金额仅保留整数部分。"
      type="warning"
      :closable="false"
      style="margin-bottom: 20px;"
    />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :dates="dates" :chart-data="userData" title="用户总数" />
    </el-row>
    <!--
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>
     -->
    <!--
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row> -->
  </div>
</template>

<script>

import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
// import PieChart from './components/PieChart'
// import BarChart from './components/BarChart'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'
import { getBasic } from '@/api/dashboard'

export default {
  name: 'DashboardAdmin',
  components: {
    // GithubCorner,
    PanelGroup,
    LineChart
    // RaddarChart,
    // PieChart,
    // BarChart,
    // TransactionTable,
    // TodoList,
    // BoxCard
  },
  data() {
    return {
      userData: {
        data: [],
        itemStyle: {
          normal: {
            color: '#FF005A',
            lineStyle: {
              color: '#FF005A',
              width: 2
            }
          }
        }
      },
      basicData: {
        memberCount: 0,
        apiCallCount: 0
      }
    }
  },
  computed: {
    dates() {
      const dates = []
      for (let i = 0; i < 30; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const year = date.getFullYear()
        const month = ('0' + (date.getMonth() + 1)).slice(-2)
        const day = ('0' + date.getDate()).slice(-2)
        dates.push(year + '-' + month + '-' + day)
      }
      return dates.reverse()
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload() {
      getBasic().then(resp => {
        const data = resp.data
        this.basicData.memberCount = data.memberCount
        this.basicData.apiCallCount = data.apiCallCount

        const userMap = {}
        data.userInfos.forEach(info => {
          userMap[info.date] = info
        })
        this.userData.data.splice(0, this.userData.data.length)
        this.dates.forEach(date => {
          if (userMap[date]) {
            this.userData.data.push(userMap[date].count)
          } else {
            this.userData.data.push(0)
          }
        })
        console.log(this.dates, this.userData.data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
