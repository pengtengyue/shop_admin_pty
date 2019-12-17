<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="success" plain @click="showAdd">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="rolesList">
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-row class="l1" v-for="l1 in row.children" :key="l1.id">
            <!-- 一级权限 -->
            <el-col :span="4">
              <el-tag @close="delRight(row, l1.id)" closable>{{l1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!-- 二级权限 -->
            <el-col :span="20">
              <el-row class="l2" v-for="l2 in l1.children" :key="l2.id">
                <el-col :span="4">
                  <el-tag @close="delRight(row, l2.id)" type="warning" closable>{{l2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="20">
                  <el-tag
                    @close="delRight(row, l3.id)"
                    class="l3"
                    type="info"
                    closable
                    v-for="l3 in l2.children"
                    :key="l3.id"
                  >{{l3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            plain
            circle
            @click="showEdit(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            plain
            circle
            @click="delRole(row.id)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            plain
            @click="showAssign(row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="assignDialogVisible" width="40%">
      <!-- 树状结构 -->
      <el-tree
        show-checkbox
        default-expand-all
        :data="rightList"
        :props="defaultProps"
        node-key="id"
        ref="tree"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户及修改用户 共用的 对话框 -->
    <el-dialog :title="addForm.id ? '修改角色' : '添加角色'" :visible.sync="addDialogVisible" width="40%">
      <!-- 添加用户的信息表格 -->
      <el-form status-icon ref="addForm" :model="addForm" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input placeholder="请输入角色描述" v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      assignDialogVisible: false,
      // 所有权限信息
      rightList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      addDialogVisible: false,
      addForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc: [{ message: '请输入用户描述', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async getRolesList() {
      let res = await this.axios.get('roles')
      this.rolesList = res.data
    },
    // 删除权限
    async delRight(row, rightId) {
      let res = await this.axios.delete(`roles/${row.id}/rights/${rightId}`)
      if (res.meta.status === 200) {
        // this.getRolesList()
        // 不能直接渲染整个角色， 只是重新渲染当前这个角色的权限信息
        row.children = res.data
        this.$message.success('删除权限成功')
      }
    },
    async showAssign(row) {
      this.roleId = row.id
      // 弹出修改权限对话框
      this.assignDialogVisible = true
      // 发送请求，获取所有权限列表
      let res = await this.axios.get('rights/tree')
      if (res.meta.status === 200) {
        // 把拿到的数据存起来
        this.rightList = res.data
      }
      // 权限列表数据回显 到树形控件中
      let ids = []
      row.children.forEach(l1 => {
        l1.children.forEach(l2 => {
          l2.children.forEach(l3 => {
            ids.push(l3.id)
          })
        })
      })
      this.$refs.tree.setCheckedKeys(ids)
    },
    async assignRight() {
      // 获取到选定的三级权限的id
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      // 获取到半选定的权限的id
      let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      // 两个id数组合并，并且转字符串
      let rids = checkedKeys.concat(halfCheckedKeys).join()
      // 发送请求
      let res = await this.axios.post(`roles/${this.roleId}/rights`, { rids })
      if (res.meta.status === 200) {
        // 关闭对话框
        this.assignDialogVisible = false
        this.getRolesList()
        this.$message.success('更新权限成功')
      }
    },
    // 删除用户
    async delRole(id) {
      try {
        await this.$confirm('是否确认删除？', '提示', { type: 'warning' })
        let res = await this.axios.delete(`roles/${id}`)
        if (res.meta.status === 200) {
          // 重新渲染
          this.getRolesList()
          // 弹出成功
          this.$message.success('删除成功')
        }
      } catch (e) {
        this.$message.info('取消删除成功')
      }
    },
    // 添加按钮事件，打开添加对话框
    showAdd() {
      // 把addForm里面的数据清空   防止因为刚点了修改没有确定就点添加而导致addForm里有值
      this.addForm.id = ''
      this.addForm.roleName = ''
      this.addForm.roleDesc = ''
      this.addDialogVisible = true
    },
    // 点击确定按钮 发送添加或者修改用户请求请求
    async addRole() {
      try {
        // 点了确定并校验成功
        await this.$refs.addForm.validate()
        /*         请求     地址      状态码
          添加用户  post   roles      201
          修改用户  put    roles/:id  200
        */
        let method = this.addForm.id ? 'put' : 'post'
        let url = this.addForm.id ? `roles/${this.addForm.id}` : 'roles'
        let status = this.addForm.id ? 200 : 201
        // 发送请求
        let res = await this.axios[method](url, this.addForm)
        if (res.meta.status === status) {
          // 重新渲染
          this.getRolesList()
          // 关闭对话框
          this.addDialogVisible = false
          // 重置表单
          this.$refs.addForm.resetFields()
          // 弹出对话框
          this.$message.success('操作成功了')
        }
      } catch (e) {
        return false
      }
    },
    // 显示修改对话框  使用添加对话框
    showEdit(row) {
      this.addDialogVisible = true
      // 数据回显
      this.addForm.id = row.id
      this.addForm.roleName = row.roleName
      this.addForm.roleDesc = row.roleDesc
    }
  },
  created() {
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
.l1 {
  border-bottom: 1px solid #9dd2a3;
  margin-bottom: 50px;
}
.l2 {
  margin-bottom: 10px;
}
.l3 {
  margin-bottom: 10px;
  margin-right: 5px;
}
</style>
