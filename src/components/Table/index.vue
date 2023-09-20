<template>
  <div class="comp-container">
    <div class="filter-container">
      <slot name="filter" />
    </div>

    <div class="table-container" style="padding: 20px;">

      <div class="operation-container" style="margin-bottom: 10px; padding-left: 10px;">
        <el-button icon="el-icon-refresh" circle @click="handleClickRefreshButton" />
        <!-- <el-button type="primary" icon="el-icon-plus">新建</el-button>
        <el-button type="success" icon="el-icon-edit">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" disabled>删除</el-button> -->
        <slot name="topActions" />
      </div>

      <slot name="header" />

      <el-table
        :id="tableId"
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="width: 100%"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <slot name="leftColumns" />
        <el-table-column
          v-for="col in tableColumns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :type="col.type"
          :show-overflow-tooltip="col.showOverflowTooltip === undefined || col.showOverflowTooltip === null ? true : col.showOverflowTooltip"
        >
          <slot slot-scope="scope" :name="col.slot" :row="scope.row">
            {{ scope.row[col.prop] }}
          </slot>
        </el-table-column>
        <slot name="columns" />
        <el-table-column
          v-if="tableActions"
          label="操作"
          :width="tableActionColumn ? tableActionColumn.width : 0"
        >
          <el-button v-for="action in tableActions" :key="action.key" :type="action.type">
            {{ action.label }}
          </el-button>
          <slot slot-scope="scope" name="rowActions" :row="scope.row" />
        </el-table-column>
      </el-table>

      <el-pagination
        style="margin-top: 10px;"
        :current-page="pagination.pageNum"
        :page-sizes="[20, 200, 500]"
        :page-size="pagination.pageSize"
        :layout="paginationLayout"
        :total="pagination.total || 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'

export default {
  name: 'AiTable',
  components: {},
  props: {
    tableId: {
      type: String,
      default: () => '' + Math.random()
    },
    tableActions: {
      type: [Array, Boolean],
      default: () => []
    },
    tableColumns: {
      type: Array,
      default: () => []
    },
    tableActionColumn: {
      type: Object,
      default: () => {}
    },
    tableData: {
      type: Array,
      default: () => []
    },
    pagination: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentPage: 1
    }
  },
  computed: {
    paginationLayout() {
      if (!this.pagination) {
        return ''
      }
      const showDetail = this.pagination.showDetail
      if (showDetail === false) {
        return 'total'
      } else {
        return 'total, sizes, prev, pager, next, jumper'
      }
    }
  },
  created() {
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
  },
  methods: {
    handleSizeChange(pageSize) {
      this.$emit('pageSizeChanged', pageSize)
    },
    handleCurrentChange(page) {
      // console.log('page', page)
      this.$emit('pageCurrentChanged', page)
    },

    handleRowClick(row) {
      // console.log('row', row)
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 多选
    handleSelectionChange(rows) {
      this.$emit('selection-change', rows)
    },

    handleClickRefreshButton() {
      this.$emit('refresh')
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-container {
  background-color: #f1f3f6;
  padding: 10px;

  .filter-container {
    background-color: white;
    margin-bottom: 15px;
    padding: 20px;
  }

  .table-container {
    background-color: white;
  }
}

</style>
