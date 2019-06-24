<template>
  <el-row>
    <div>
      <search_panel>
        <div slot="panelName">
          <span>资源管理</span>
        </div>
        <!-- S 查询条件 -->
        <div slot="searchMain">
          <el-form v-model="resourceFilter" :inline="true" size="medium">
            <el-form-item label="资源名称">
              <el-input v-model="resourceFilter.resourceName" placeholder="按照资源名称模糊搜索"></el-input>
            </el-form-item>
            <el-form-item label="资源地址">
              <el-input v-model="resourceFilter.resourceUrl" placeholder="按照资源地址模糊搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="initData" v-hasEntity="'resource:list'">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="editRow" v-hasEntity="'resource:edit'">新建</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- E 查询条件 -->
        <!-- S 查询结果 -->
        <div slot="searchResult">
          <el-table :data="tableData" v-loading="tableLoading">
            <el-table-column label="资源名称" prop="resourceName" width="150px" show-overflow-tooltip></el-table-column>
            <el-table-column label="资源地址" prop="resourceUrl" show-overflow-tooltip></el-table-column>
            <el-table-column label="资源描述" prop="resourceDesc" width="200px" show-overflow-tooltip></el-table-column>
            <el-table-column label="白名单">
              <template slot-scope="scope">
                <i class="el-icon-check" v-if="scope.row.permitAll === '1'"></i>
              </template>
            </el-table-column>
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
            <el-table-column label="操作" width="100px">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                <el-button size="small" type="primary" icon="el-icon-edit" v-hasEntity="'resource:edit'" circle  @click="editRow(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-button size="small" type="danger" icon="el-icon-delete" v-hasEntity="'resource:delete'" circle  @click="deleteRow(scope.row.resourceId)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <pagination @refreshData="initData" ref="pageInfo">
          </pagination>
        </div>
        <!-- E 查询结果 -->
      </search_panel>
    </div>
    <!-- S 编辑弹框 -->
    <el-dialog :title="editDialog.title" :visible.sync="editDialog.visible" append-to-body>
      <el-row>
        <el-form :model="editRowForm" ref="editRowForm" :rules="rowRules" size="medium">
          <el-form-item label="资源名称" prop="resourceName">
            <el-input v-model="editRowForm.resourceName" placeholder="请输入资源名称"></el-input>
          </el-form-item>
          <el-form-item label="资源地址" prop="resourceUrl">
            <el-input v-model="editRowForm.resourceUrl" placeholder="请输入资源地址"></el-input>
          </el-form-item>
          <el-form-item label="资源描述" prop="resDesc">
            <el-input type="textarea" v-model="editRowForm.resourceDesc" placeholder="请输入资源描述"></el-input>
          </el-form-item>
          <el-form-item label="其他选项">
            <el-checkbox v-model="editRowForm.permitAll" true-label="1" false-label="0">白名单</el-checkbox>
          </el-form-item>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="editDialog.visible = false" size="medium">取 消</el-button>
        <el-button type="primary" @click="saveRow" size="medium" :loading="savingData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- E 编辑弹框 -->
  </el-row>
</template>
<script>
import { saveResource, deleteResource, selectResources } from './api/'
export default {
  name: 'setting',
  data () {
    return {
      resourceFilter: {
        resourceName: '',
        resourceUrl: ''
      },
      tableData: [],
      tableLoading: false,
      savingData: false,
      editDialog: {
        title: '',
        visible: false
      },
      editRowForm: {
        resourceName: '',
        menuDesc: '',
        resourceUrl: ''
      },
      rowRules: {
        resourceName: [
          { required: true, message: '请输入资源名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        menuDesc: [
          { max: 100, message: '长度不超过 100 个字符', trigger: 'blur' }
        ],
        resourceUrl: [
          { required: true, message: '请输入资源地址', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 初始化表格数据
    initData () {
      // 从分页组件中获取查询条件中的分页信息
      let pageInfo = this.$refs['pageInfo'].getPageInfo()
      // 设置表格状态为加载中
      this.tableLoading = true
      selectResources(this.resourceFilter.resourceName, this.resourceFilter.resourceUrl,
        pageInfo.pageNum, pageInfo.pageSize).then(res => {
        this.tableData = res.data.list
        // 设置子组件中显示的total值
        this.$refs['pageInfo'].setTotal(res.data.total)
        // 关闭加载中状态
        this.tableLoading = false
      })
    },
    // 编辑表格行
    editRow (row) {
      if (row) {
        // 编辑数据
        this.editDialog.title = '编辑资源'
        // 深复制要编辑的对象，防止表单中的值改变影响表格数据
        this.editRowForm = {...row}
      } else {
        // 新增数据
        this.editDialog.title = '新建资源'
        this.editRowForm = {}
      }
      this.editDialog.visible = true
    },
    // 保存编辑内容
    saveRow () {
      this.$refs['editRowForm'].validate((validate) => {
        if (validate) {
          // 修改保存按钮状态为正在加载中
          this.savingData = true
          saveResource(this.editRowForm).then(() => {
            this.$message.success({
              message: '保存成功',
              showClose: true
            })
            // 还原按钮状态
            this.savingData = false
            // 关闭弹框
            this.editDialog.visible = false
            // 刷新表格数据
            this.initData()
          }).catch(() => {
            // 还原按钮状态
            this.savingData = false
            // 关闭弹框
            this.editDialog.visible = false
          })
        }
      })
    },
    // 删除表格行
    deleteRow (rowId) {
      this.$confirm('此操作将删除资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteResource(rowId).then(() => {
          this.$message.success({
            message: '删除成功',
            showClose: true
          })
          // 刷新表格数据
          this.initData()
        })
      })
    }
  },
  mounted () {
    // 加载表格是数据
    this.initData()
  }
}
</script>
