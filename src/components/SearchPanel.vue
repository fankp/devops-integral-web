<template>
  <el-row class="search_container">
    <el-row class="search_card">
      <el-row class="panel_name">
        <slot name="panel-name"></slot>
      </el-row>
      <el-row class="panel_search" v-if="enableSearch">
        <slot name="panel-search"></slot>
      </el-row>
    </el-row>
    <el-row class="panel_result">
      <slot name="panel-result"></slot>
    </el-row>
  </el-row>
</template>
<script>
export default {
  name: 'search-panel',
  props: {
    enableSearch: {
      type: Boolean,
      default: true
    },
  },
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.search_container {
  .search_card {
    background-color: #fff;
    border-radius: 5px;
    border: 1px solid #ebeef5;
    .panel_name {
      font-size: 18px;
      height: 50px;
      line-height: 50px;
      font-weight: 600;
      padding-left: 10px;
      border-bottom: 1px solid #ebeef5;
    }
    .panel_search {
      padding: 15px 10px;
    }
  }
  .panel_result {
    background-color: #fff;
    height: 100%;
    border: 1px solid #ebeef5;
    border-radius: 5px;
    margin-top: 15px;
    // padding: 10px;
  }
}
</style>
