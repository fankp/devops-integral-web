<template>
  <el-row>
    <el-table :data="tableData">
      <el-table-column label="项目名称" prop="projName" width="240px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.projType === '2' ? '公开项目': '私有项目'" placement="top-start">
            <i :class="scope.row.projType === '2' ? 'iconfont icon_password_unlock': 'iconfont icon_password'"></i>
          </el-tooltip>
          <span style="pading-left: 10px">{{scope.row.projName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目描述" prop="projDesc" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" prop="createDate" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="stateDate" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.stateDate | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作员" prop="operatorName" width="180px"></el-table-column>
      <el-table-column label="操作" prop="operatorName" width="100px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="进入项目" placement="top-start">
          <el-button size="small" type="primary" icon="el-icon-right" circle @click="intoProject(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination @refreshData="initData" ref="pageInfo"></pagination>
  </el-row>  
</template>

<script>
export default {
  name: 'project-table',
  props: {
    tableData: {
      type: Array
    }
  },
  methods: {
    getPageInfo() {
      return this.$refs['pageInfo'].getPageInfo()
    },
    setTotal(total) {
      this.$refs['pageInfo'].setTotal(total)
    },
    initData() {
      this.$emit('initData')
    },
    intoProject(project) {
      this.$store.dispatch('SetProject', project).then(() => {
        this.$store.dispatch('RemoveRoute').then(() => {
          this.$router.push({path: '/project/dashboard/index'})
        })
      })
    }
  }
}
</script>
