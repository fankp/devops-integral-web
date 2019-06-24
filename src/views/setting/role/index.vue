<template>
  <el-row>
    <div>
      <search_panel>
        <div slot="panelName">
          <span>角色管理</span>
        </div>
        <!-- S 查询条件 -->
        <div slot="searchMain">
          <el-form v-model="roleFilter" :inline="true" size="medium">
            <el-form-item label="角色名称">
              <el-input v-model="roleFilter.roleName" placeholder="按照角色名称模糊搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="initData" v-hasEntity="'role:list'">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="editRow" v-hasEntity="'role:edit'">新建</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- E 查询条件 -->
        <!-- S 查询结果 -->
        <div slot="searchResult">
          <el-table :data="tableData" v-loading="tableLoading">
            <el-table-column label="角色名称" prop="roleName" width="200px" show-overflow-tooltip></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户类型" prop="roleType">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.roleType === '1'">系统级角色</el-tag>
                <el-tag v-if="scope.row.roleType === '2'">项目级角色</el-tag>
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
            <el-table-column label="操作" width="150px">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="授权" placement="top-start">
                  <el-button size="small" type="primary" icon="iconfont icon_access" v-hasEntity="'role:edit'" circle  @click="accessRole(scope.row.roleId)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                  <el-button size="small" type="primary" icon="el-icon-edit" v-hasEntity="'role:edit'" circle  @click="editRow(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-button size="small" type="danger" icon="el-icon-delete" v-hasEntity="'role:delete'" circle  @click="deleteRow(scope.row.roleId)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- E 查询结果 -->
      </search_panel>
    </div>
    <!-- S 编辑弹框 -->
    <el-dialog :title="editDialog.title" :visible.sync="editDialog.visible" append-to-body>
      <el-row>
        <el-form :model="editRowForm" ref="editRowForm" :rules="rowRules" size="medium">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRowForm.roleName" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input type="textarea" v-model="editRowForm.roleDesc" placeholder="请输入角色描述"></el-input>
          </el-form-item>
          <el-form-item label="角色类型" prop="roleType">
            <el-tooltip class="item" effect="dark" content="系统级别角色，可直接在用户管理中赋予给用户" placement="top-start">
              <el-radio v-model="editRowForm.roleType" label="1">系统级角色</el-radio>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="项目级别角色，必须在项目内成员管理中赋予角色" placement="top-start">
              <el-radio v-model="editRowForm.roleType" label="2">项目级角色</el-radio>
            </el-tooltip>
          </el-form-item>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="editDialog.visible = false" size="medium">取 消</el-button>
        <el-button type="primary" @click="saveRow" size="medium" :loading="savingData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- E 编辑弹框 -->
    <!-- S 角色授权 -->
    <el-dialog title="角色授权" :visible.sync="accessDialog.visible" append-to-body>
      <el-row>
        <el-col class="form-tip"><span>提示：在勾选编辑、删除、导出等权限时需要勾选对应的查询权限，否则可能会导致功能不可用</span></el-col>
        <el-col :span=24 v-for="(item, index) in rolePrivilges" :key="index">
          <el-col :span=24>
            <span class="privilege_title">{{item.privilegeGroupName}}</span>
          </el-col>
          <el-col :span=6 v-for="(each, inx) in item.privileges" :key="inx">
            <el-checkbox v-model="each.accessed">{{each.privilegeName}}</el-checkbox>
          </el-col>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button @click="accessDialog.visible = false" size="medium">取 消</el-button>
        <el-button type="primary" @click="saveRoleAccess" size="medium" :loading="savingData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- E 角色授权 -->
  </el-row>
</template>
<script>
import { saveRole, deleteRole, selectRoles, selectPrivilegeGroupsWithPrivilege, accessRole } from './api/'
export default {
  name: 'setting',
  data () {
    return {
      roleFilter: {
        roleName: '',
      },
      tableData: [],
      tableLoading: false,
      savingData: false,
      editDialog: {
        title: '',
        visible: false
      },
      editRowForm: {
        roleName: '',
        roleDesc: '',
        roleType: ''
      },
      rowRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { max: 100, message: '长度不超过 100 个字符', trigger: 'blur' }
        ]
      },
      accessDialog: {
        visible: false,
        roleId: ''
      },
      rolePrivilges: []
    }
  },
  methods: {
    // 初始化表格数据
    initData () {
      // 设置表格状态为加载中
      this.tableLoading = true
      selectRoles(this.roleFilter.roleName).then(res => {
        this.tableData = res.data
        // 关闭加载中状态
        this.tableLoading = false
      })
    },
    // 编辑表格行
    editRow (row) {
      if (row.roleId) {
        // 编辑数据
        this.editDialog.title = '编辑角色'
        // 使用序列化和反序列化的形式深复制要编辑的对象，防止表单中的值改变影响表格数据
        this.editRowForm = { ...row }
      } else {
        // 新增数据
        this.editDialog.title = '新建角色'
        this.editRowForm = {
          roleType: '2'
        }
      }
      this.editDialog.visible = true
    },
    // 保存编辑内容
    saveRow () {
      this.$refs['editRowForm'].validate((validate) => {
        if (validate) {
          // 修改保存按钮状态为正在加载中
          this.savingData = true
          saveRole(this.editRowForm).then(() => {
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
        deleteRole(rowId).then(() => {
          this.$message.success({
            message: '删除成功',
            showClose: true
          })
          // 刷新表格数据
          this.initData()
        })
      })
      
    },
    accessRole(roleId) {
      selectPrivilegeGroupsWithPrivilege(roleId).then(res=> {
        this.rolePrivilges = res.data
        this.accessDialog.roleId = roleId
        this.accessDialog.visible = true
      })
    },
    saveRoleAccess() {
      this.savingData = true
      this.accessDialog.visible = false
      let privilegeIds = []
      this.rolePrivilges.forEach(each => {
        each.privileges.forEach(item => {
          if (item.accessed) {
            privilegeIds.push(item.privilegeId)
          }
        })
      })
      accessRole(this.accessDialog.roleId, privilegeIds).then(() => {
        this.$message.success({
              message: '保存成功',
              showClose: true
        })
        // 关闭数据加载状态
        this.savingData = false
        // 关闭弹框
        this.accessDialog.visible = false
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
.privilege_title {
  font-size: 16px;
  font-weight: 600;
  line-height: 40px;
}
</style>
