<template>
  <el-row>
    <div>
      <search_panel>
        <div slot="panelName">
          <span>权限分组</span>
        </div>
        <!-- S 查询条件 -->
        <div slot="searchMain">
          <el-form v-model="privilegeGroupFilter" :inline="true" size="medium">
            <el-form-item label="分组名称">
              <el-input v-model="privilegeGroupFilter.privilegeGroupName" placeholder="按照分组名称模糊搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="initData" v-hasEntity="'privilege:list'">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="editRow" v-hasEntity="'privilege:edit'">新建</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- E 查询条件 -->
        <!-- S 查询结果 -->
        <div slot="searchResult">
          <el-table :data="tableData" v-loading="tableLoading">
            <el-table-column type="expand">
               <div slot-scope="scope" class="expand_div">
                 <privilege :privilegeGroupId="scope.row.privilegeGroupId"></privilege>
               </div>
            </el-table-column>
            <el-table-column label="分组名称" prop="privilegeGroupName" width="200px" show-overflow-tooltip></el-table-column>
            <el-table-column label="分组描述" prop="privilegeGroupDesc" show-overflow-tooltip></el-table-column>
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
                <el-button size="small" type="primary" icon="el-icon-edit" v-hasEntity="'privilege:edit'" circle  @click="editRow(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-button size="small" type="danger" icon="el-icon-delete" v-hasEntity="'privilege:delete'" circle  @click="deleteRow(scope.row.privilegeGroupId)"></el-button>
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
          <el-form-item label="分组名称" prop="privilegeGroupName">
            <el-input v-model="editRowForm.privilegeGroupName" placeholder="请输入分组名称"></el-input>
          </el-form-item>
          <el-form-item label="分组描述" prop="privilegeGroupDesc">
            <el-input type="textarea" v-model="editRowForm.privilegeGroupDesc" placeholder="请输入分组描述"></el-input>
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
import { savePrivilegeGroup, deletePrivilegeGroup, selectPrivilegeGroups } from './api/'
import Privilege from '../privilege/index'
export default {
  name: 'privilege_group',
  components: { Privilege },
  data () {
    return {
      privilegeGroupFilter: {
        privilegeGroupName: ''
      },
      tableData: [],
      tableLoading: false,
      savingData: false,
      editDialog: {
        title: '',
        visible: false
      },
      editRowForm: {
        privilegeGroupName: '',
        privilegeGroupDesc: ''
      },
      rowRules: {
        privilegeGroupName: [
          { required: true, message: '请输入分组名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        privilegeGroupDesc: [
          { max: 100, message: '长度不超过 100 个字符', trigger: 'blur' }
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
      selectPrivilegeGroups(this.privilegeGroupFilter.privilegeGroupName,
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
      if (row.privilegeGroupId) {
        // 编辑数据
        this.editDialog.title = '编辑权限分组'
        this.editRowForm = { ...row }
      } else {
        // 新增数据
        this.editDialog.title = '新建权限分组'
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
          savePrivilegeGroup(this.editRowForm).then(() => {
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
      this.$confirm('此操作将删除权限分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePrivilegeGroup(rowId).then(() => {
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
<style lang="scss" scoped>
.el-table__expanded-cell {
  background-color: $background_color !important;
}
</style>
