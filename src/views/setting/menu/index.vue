<template>
  <el-row>
    <div>
      <search_panel>
        <div slot="panelName">
          <span>系统菜单</span>
        </div>
        <!-- S 查询条件 -->
        <div slot="searchMain">
          <el-form v-model="menuFilter" :inline="true" size="medium">
            <el-form-item label="菜单名称">
              <el-input v-model="menuFilter.menuName" placeholder="按照菜单名称模糊搜索"></el-input>
            </el-form-item>
            <el-form-item label="菜单地址">
              <el-input v-model="menuFilter.menuUrl" placeholder="按照菜单地址模糊搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="initData" v-hasEntity="'menu:list'">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="editRow" v-hasEntity="'menu:edit'">新建</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- E 查询条件 -->
        <!-- S 查询结果 -->
        <div slot="searchResult">
          <el-table :data="tableData" v-loading="tableLoading">
            <el-table-column label="菜单名称" prop="menuName" width="200px" show-overflow-tooltip></el-table-column>
            <el-table-column label="菜单地址" prop="menuUrl"></el-table-column>
            <el-table-column label="菜单描述" prop="menuDesc" width="200px" show-overflow-tooltip></el-table-column>
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
                <el-button size="small" type="primary" v-hasEntity="'menu:edit'" icon="el-icon-edit" circle  @click="editRow(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-button size="small" type="danger" v-hasEntity="'menu:delete'" icon="el-icon-delete" circle  @click="deleteRow(scope.row.menuId)"></el-button>
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
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="editRowForm.menuName" placeholder="请输入菜单名称"></el-input>
          </el-form-item>
          <el-form-item label="菜单地址" prop="menuUrl">
            <el-input v-model="editRowForm.menuUrl" placeholder="请输入菜单地址"></el-input>
          </el-form-item>
          <el-form-item label="菜单描述" prop="menuDesc">
            <el-input type="textarea" v-model="editRowForm.menuDesc" placeholder="请输入菜单描述"></el-input>
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
import { saveMenu, deleteMenu, selectMenus } from './api/'
export default {
  name: 'setting',
  data () {
    return {
      menuFilter: {
        menuName: '',
        menuUrl: ''
      },
      tableData: [],
      tableLoading: false,
      savingData: false,
      editDialog: {
        title: '',
        visible: false
      },
      editRowForm: {
        menuName: '',
        menuDesc: '',
        menuUrl: ''
      },
      rowRules: {
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        menuDesc: [
          { max: 100, message: '长度不超过 100 个字符', trigger: 'blur' }
        ],
        menuUrl: [
          { required: true, message: '请输入菜单地址', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
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
      selectMenus(this.menuFilter.menuName, this.menuFilter.menuUrl,
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
      if (row.menuId) {
        // 编辑数据
        this.editDialog.title = '编辑菜单'
        // 使用序列化和反序列化的形式深复制要编辑的对象，防止表单中的值改变影响表格数据
        this.editRowForm = { ...row }
      } else {
        // 新增数据
        this.editDialog.title = '新建菜单'
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
          saveMenu(this.editRowForm).then(() => {
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
      this.$confirm('此操作将删除菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu(rowId).then(() => {
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
