<template>
  <el-row>
    <div>
      <search_panel>
        <div slot="panelName">
          <span>系统权限</span>
        </div>
        <!-- S 查询条件 -->
        <div slot="searchMain">
          <el-form v-model="privilegeFilter" :inline="true" size="medium">
            <el-form-item label="权限名称">
              <el-input v-model="privilegeFilter.privilegeName" placeholder="按照权限名称模糊搜索"></el-input>
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
            <el-table-column label="权限名称" prop="privilegeName" width="200px" show-overflow-tooltip></el-table-column>
            <el-table-column label="权限描述" prop="privilegeDesc" show-overflow-tooltip></el-table-column>
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
                <el-button size="small" type="danger" icon="el-icon-delete" v-hasEntity="'privilege:delete'" circle  @click="deleteRow(scope.row.privilegeId)"></el-button>
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
          <el-form-item label="权限名称" prop="privilegeName">
            <el-input v-model="editRowForm.privilegeName" placeholder="请输入权限名称"></el-input>
          </el-form-item>
          <el-form-item label="权限描述" prop="privilegeDesc">
            <el-input type="textarea" v-model="editRowForm.privilegeDesc" placeholder="请输入权限描述"></el-input>
          </el-form-item>
          <el-form-item label="关联菜单" prop="rlatMenuIds">
            <el-select filterable multiple v-model="editRowForm.rlatMenuIds" placeholder="请权限权限相关的菜单">
              <el-option v-for="(item, index) in menus" :key="index"
               :label="item.menuUrl" :value="item.menuId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联实体" prop="rlatEntityIds">
            <el-select filterable multiple v-model="editRowForm.rlatEntityIds" placeholder="请权限权限相关的权限实体">
              <el-option v-for="(item, index) in entities" :key="index"
               :label="item.entityCode" :value="item.entityId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联资源" prop="rlatResourceIds">
            <el-select filterable multiple v-model="editRowForm.rlatResourceIds" placeholder="请权限权限相关的系统资源">
              <el-option v-for="(item, index) in resources" :key="index"
               :label="item.resourceUrl" :value="item.resourceId"></el-option>
            </el-select>
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
import { savePrivilege, deletePrivilege, selectPrivileges } from './api/'
import { selectMenus } from '../../menu/api'
import { selectEntities } from '../../entity/api'
import { selectResources } from '../../resource/api'
export default {
  name: 'privilege',
  props: {
    privilegeGroupId: {
      type: String
    }
  },
  data () {
    return {
      privilegeFilter: {
        privilegeName: ''
      },
      tableData: [],
      tableLoading: false,
      savingData: false,
      editDialog: {
        title: '',
        visible: false
      },
      editRowForm: {
        privilegeName: '',
        privilegeDesc: '',
        rlatMenuIds: [],
        rlatEntityIds: [],
        rlatResourceIds: []
      },
      rowRules: {
        privilegeName: [
          { required: true, message: '请输入权限名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        privilegeDesc: [
          { max: 100, message: '长度不超过 100 个字符', trigger: 'blur' }
        ]
      },
      menus: [],
      entities: [],
      resources: []
    }
  },
  methods: {
    // 初始化表格数据
    initData () {
      // 从分页组件中获取查询条件中的分页信息
      let pageInfo = this.$refs['pageInfo'].getPageInfo()
      // 设置表格状态为加载中
      this.tableLoading = true
      selectPrivileges(this.privilegeFilter.privilegeName,
        this.privilegeGroupId,
        pageInfo.pageNum, pageInfo.pageSize).then(res => {
        this.tableData = res.data.list
        // 设置子组件中显示的total值
        this.$refs['pageInfo'].setTotal(res.data.total)
        // 关闭加载中状态
        this.tableLoading = false
      })
    },
    getMenus () {
      selectMenus(null, null, 1, 0).then(res => {
        this.menus = res.data.list
      })
    },
    getEntities () {
      selectEntities(null, null, 1, 0).then(res => {
        this.entities = res.data.list
      })
    },
    getResources () {
      selectResources(null, null, 1, 0).then(res => {
        this.resources = res.data.list
      })
    },
    // 编辑表格行
    editRow (row) {
      if (row.privilegeId) {
        // 填充关联的菜单ID
        if (row.rlatMenus) {
          row.rlatMenuIds = []
          row.rlatMenus.forEach(each => {
            row.rlatMenuIds.push(each.menuId)
          })
        }
        // 填充关联的权限实体ID
        if (row.rlatEntities) {
          row.rlatEntityIds = []
          row.rlatEntities.forEach(each => {
            row.rlatEntityIds.push(each.entityId)
          })
        }
        // 填充关联的资源ID
        if (row.rlatResources) {
          row.rlatResourceIds = []
          row.rlatResources.forEach(each => {
            row.rlatResourceIds.push(each.resourceId)
          })
        }
        // 编辑数据
        this.editDialog.title = '编辑权限权限'
        // 使用序列化和反序列化的形式深复制要编辑的对象，防止表单中的值改变影响表格数据
        this.editRowForm = { ...row }
      } else {
        // 新增数据
        this.editDialog.title = '新建权限权限'
        this.editRowForm = {}
      }

      this.editRowForm.privilegeGroupId = this.privilegeGroupId
      this.editDialog.visible = true
    },
    // 保存编辑内容
    saveRow () {
      this.$refs['editRowForm'].validate((validate) => {
        if (validate) {
          // 修改保存按钮状态为正在加载中
          this.savingData = true
          savePrivilege(this.editRowForm).then(() => {
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
      this.$confirm('此操作将删除权限权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePrivilege(rowId).then(() => {
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
    this.getMenus()
    this.getEntities()
    this.getResources()
  }
}
</script>
