<template>
  <el-row>
    <div>
      <search_panel>
        <div slot="panelName">
          <span>用户管理</span>
        </div>
        <!-- S 查询条件 -->
        <div slot="searchMain">
          <el-form v-model="userFilter" :inline="true" size="medium">
            <el-form-item label="用户名称">
              <el-input v-model="userFilter.userName" placeholder="按照用户名称模糊搜索"></el-input>
            </el-form-item>
            <el-form-item label="用户账号">
              <el-input v-model="userFilter.userAcct" placeholder="按照用户账号模糊搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="initData" v-hasEntity="'user:list'">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="editRow" v-hasEntity="'user:edit'">新建</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- E 查询条件 -->
        <!-- S 查询结果 -->
        <div slot="searchResult">
          <el-table :data="tableData" v-loading="tableLoading">
            <el-table-column label="用户名称" prop="userName" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户账号" prop="userAcct" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户邮箱" prop="userMail" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户电话" prop="userMobile" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户角色">
              <template slot-scope="scope">
                <template v-for="(item, index) in scope.row.roles">
                  <el-tag :key="index" v-if="item.roleType === '1'">{{item.roleName}}</el-tag>
                </template>
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
                <el-button size="small" type="primary" icon="el-icon-edit" v-hasEntity="'user:edit'" circle  @click="editRow(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-button size="small" type="danger" icon="el-icon-delete" v-hasEntity="'user:delete'" circle  @click="deleteRow(scope.row.userId)"></el-button>
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
        <el-col class="form-tip"><span>提示：请正确填写用户邮箱，邮箱主要用于用户激活、密码重置、接收系统消息等</span></el-col>
        <el-form :model="editRowForm" ref="editRowForm" :rules="rowRules" size="medium">
          <el-form-item label="用户名称" prop="userName">
            <el-input v-model="editRowForm.userName" placeholder="请输入用户名称"></el-input>
          </el-form-item>
          <el-form-item label="用户账号" prop="userAcct">
            <el-input v-model="editRowForm.userAcct" placeholder="请输入用户账号"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="userMail">
            <el-input v-model="editRowForm.userMail" placeholder="请输入用户邮箱"></el-input>
          </el-form-item>
          <el-form-item label="用户电话" prop="userMobile">
            <el-input v-model="editRowForm.userMobile" placeholder="请输入用户邮箱"></el-input>
          </el-form-item>
          <el-form-item label="用户角色" prop="userRoleIds">
            <el-select v-model="editRowForm.userRoleIds" multiple placeholder="请选择用户角色">
              <template v-for="item in roles">
                <el-option
                :key="item.roleId"
                v-if="item.roleType === '1'"
                :label="item.roleName"
                :value="item.roleId">
              </el-option>
              </template>
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
import { selectUsers, deleteUser, saveUser } from './api/'
import { selectRoles } from '../role/api'
export default {
  name: 'setting',
  data () {
    var checkMail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('邮箱不能位空'));
      } else {
        let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$")
        if (!reg.test(value)) {
          callback(new Error('邮箱格式不正确'));
        } else {
          callback();
        }
      }
    }
    var checkMobile = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        let reg = new RegExp("^1[3456789]\\d{9}$")
        if (!reg.test(value)) {
          callback(new Error('手机号码格式不正确'));
        } else {
          callback();
        }
      }
    }
    return {
      userFilter: {
        userName: null,
        userAcct: null
      },
      tableData: [],
      tableLoading: false,
      savingData: false,
      editDialog: {
        title: '',
        visible: false
      },
      editRowForm: {
        userName: '',
        userAcct: '',
        userMail: '',
        userMobile: '',
        userRoleIds: []
      },
      roles: [],
      rowRules: {
        userName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        userAcct: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        userMail: [
          { required: true, validator: checkMail, trigger: 'blur' },
        ],
        userMobile: [
          { required: false, validator: checkMobile, trigger: 'blur' }
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
      selectUsers(this.userFilter.userName, this.userFilter.userAcct,
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
      if (row.userId) {
        // 编辑数据
        this.editDialog.title = '编辑用户'
        if (row.roles) {
          row.userRoleIds = []
          row.roles.forEach(each => {
            row.userRoleIds.push(each.roleId)
          });
        }
        // 深复制要编辑的对象，防止表单中的值改变影响表格数据
        this.editRowForm = { ...row }
      } else {
        // 新增数据
        this.editDialog.title = '新建用户'
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
          saveUser(this.editRowForm).then(() => {
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
      this.$confirm('此操作将删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(rowId).then(() => {
          this.$message.success({
            message: '删除成功',
            showClose: true
          })
          // 刷新表格数据
          this.initData()
        })
      })
    },
    getRoles() {
      selectRoles().then(res=> {
        this.roles = res.data
      })
    }
  },
  mounted () {
    // 加载表格是数据
    this.initData()
    // 获取角色列表
    this.getRoles()
  }
}
</script>
