<template>
  <el-row class="search_container">
    <el-row class="search_card">
      <el-row class="panel_name">
        <slot name="panelName"></slot>
      </el-row>
      <el-row class="search_main">
        <slot name="searchMain"></slot>
      </el-row>
    </el-row>
    <el-row class="search_result">
      <slot name="searchResult"></slot>
    </el-row>
  </el-row>
</template>
<script>
export default {
  name: 'search-panel',
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.search_container {
  .search_card {
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,.1);
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
    .search_main {
      padding: 10px;
    }
  }
  .search_result {
    background-color: #fff;
    height: 100%;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,.1);
    border: 1px solid #ebeef5;
    border-radius: 5px;
    margin-top: 20px;
    padding: 10px;
  }
}
</style>
