<template>
  <el-row>
    <search_panel>
      <div slot="panelName">
          <span>项目-普通用户</span>
      </div>
      <!-- S 查询条件 -->
      <div slot="searchMain">
        <el-form v-model="projFilter" :inline="true" size="medium">
          <el-form-item label="项目名称">
            <el-input v-model="projFilter.projName" placeholder="按照项目名称模糊搜索"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="initData" v-hasEntity="'project:list'">查询</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="primary" @click="editRow" v-hasEntity="'project:edit'">新建</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- E 查询条件 -->
      <!-- S 查询结果 -->
      <div slot="searchResult">
        <el-tabs type="card" v-model="activeName" @tab-click="initData">
          <el-tab-pane label="我的项目" name="my_project"></el-tab-pane>
          <el-tab-pane label="公开项目" name="public_project"></el-tab-pane>
        </el-tabs>
        <project-table :tableData="projects" ref="projectTable" @initData="initData" v-loading="tableLoading"></project-table>
      </div>
      <!-- E 查询结果 -->
    </search_panel>
  </el-row>
</template>
<script>
import ProjectTable from '../components/ProjectTable'
import {selectPublicProjects, selectUserProjects} from '../api'
export default {
  name: 'project-admin',
  components: { ProjectTable },
  data() {
    return {
      projFilter: {
        projName: null
      },
      activeName: 'my_project',
      projects: [],
      tableLoading: false
    }
  },
  methods: {
    initData() {
      this.tableLoading = true
      let pageInfo = this.$refs['projectTable'].getPageInfo()
      if (this.activeName === 'my_project') {
        selectUserProjects(this.projFilter.projName, pageInfo.pageNum, pageInfo.pageSize).then(res => {
          this.projects = res.data.list
          this.$refs['projectTable'].setTotal(res.data.total)
          this.tableLoading = false
        })
      } else {
        selectPublicProjects(this.projFilter.projName, '2', pageInfo.pageNum, pageInfo.pageSize).then(res => {
          this.projects = res.data.list
          this.$refs['projectTable'].setTotal(res.data.total)
          this.tableLoading = false
        })
      }
      
    },
    editRow() {

    }
  },
  mounted() {
    this.initData()
  }
}
</script>

