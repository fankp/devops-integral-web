<template>
  <el-row>
    <search-panel>
      <div slot="panel-name">
        <span>权限管理</span>
      </div>
      <div slot="panel-search">
        <el-form :inline="true">
          <el-form-item label="权限组">
            <el-input placeholder="请输入权限组名称进行查询"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="panel-result">
        <el-table>
          <el-table-column prop="date" label="角色名称"></el-table-column>
          <el-table-column prop="name" label="角色描述"></el-table-column>
          <el-table-column prop="address" label="创建时间"></el-table-column>
          <el-table-column prop="address" label="更新时间"></el-table-column>
          <el-table-column prop="address" label="操作员"></el-table-column>
        </el-table>
      </div>
    </search-panel>
  </el-row>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>
