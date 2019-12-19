<template>
  <div class="pagination">
    <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page.pageNum"
            :page-sizes="pageSizes"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: 'pagination',
  data () {
    return {
      page: {
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      pageSizes: [20, 50, 100, 200]
    }
  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
      this.$emit('refreshData')
    },
    handleCurrentChange (current) {
      this.page.pageNum = current
      this.$emit('refreshData')
    },
    getPageInfo () {
      return this.page
    },
    setTotal (total) {
      this.total = parseInt(total)
    }
  }
}
</script>
<style lang="scss" scoped>
.pagination {
  margin-top: 10px;
  float: right;
  margin-bottom: 10px;
}
</style>
