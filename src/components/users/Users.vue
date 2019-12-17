<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item to="/users">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-input placeholder="请输入需要查找内容的关键字" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="searchUsers"></el-button>
    </el-input>
    <el-button type="success" plain @click="showAdd">添加用户</el-button>

    <!-- 表格 -->
    <el-table :data="userList" style="width: 100%">
      <el-table-column label="姓名" prop="username" width="200"></el-table-column>
      <el-table-column label="邮箱" prop="email" width="200"></el-table-column>
      <el-table-column label="电话" prop="mobile" width="200"></el-table-column>
      <el-table-column label="状态" prop="mg_state" width="200">
        <template slot-scope="scope">
          <el-switch
            @change="changeState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click="showEdit(scope.row)"
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            @click="delUser(scope.row.id)"
            circle
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            plain
            round
            @click="showAssign(scope.row)"
          >分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加对话框===添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%">
      <el-form status-icon ref="addForm" :rules="rules" label-width="80px" :model="addForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入长度在5-12个字符的用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" placeholder="请输入用户密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入用户邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile" placeholder="请输入用户手机号号码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框===修改用户 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="40%">
      <el-form status-icon ref="editForm" :rules="rules" label-width="80px" :model="addForm">
        <el-form-item label="用户名">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入用户邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="请输入用户手机号号码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配角色" :visible.sync="assignDialogVisible" width="40%">
      <!-- 表单 -->
      <el-form ref="assignForm" :model="assignForm" label-width="80px">
        <el-form-item label="用户姓名">
          <el-tag type="info">{{assignForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色分配">
          <el-select v-model="assignForm.rid" placeholder="请选择角色">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  data() {
    return {
      // 所有数据
      userList: [],
      // 查询关键字
      query: '',
      // 当前是第几页
      currentPage: 1,
      // 一页几条数据数
      pageSize: 2,
      // 数据总条数
      total: 0,
      // 添加用户对话框的显示和隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单的校验
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            min: 5,
            max: 12,
            message: '长度在 5 到 12 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { type: 'email', message: '请输入合格的邮箱', trigger: 'blur' }
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入一个合格的手机号码',
            trigger: 'blur'
          }
        ]
      },
      // 修改用户对话框的显示和隐藏
      editDialogVisible: false,
      // 修改的数据 双向绑定
      editForm: {
        email: '',
        mobile: '',
        username: '',
        id: ''
      },
      assignDialogVisible: false,
      assignForm: {
        id: '',
        username: '',
        rid: ''
      },
      roleList: []
    }
  },
  // 钩子函数，组件实例一加载就执行
  created() {
    this.getUserList()
  },
  methods: {
    // 发送axios请求
    async getUserList() {
      let res = await this.axios({
        methods: 'get',
        url: 'users',
        // get请求是通过params传递参数
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      // 对传进来的对象参数进行解构
      let {
        meta: { status },
        data: { users, total }
      } = res
      // 当请求成功的时候,保存拿到的数据
      if (status === 200) {
        this.userList = users
        this.total = total
      }
    },
    // 一页显示几条数据的方法
    handleSizeChange(val) {
      this.pageSize = val
      this.getUserList()
    },
    // 点击页码显示第几页
    handleCurrentChange(val) {
      this.currentPage = val
      this.getUserList()
    },
    // 查找用户
    searchUsers() {
      this.currentPage = 1
      this.getUserList()
    },
    // 修改用户状态 对传进来的对象参数进行了解构
    async changeState({ id, mg_state: mgState }) {
      // console.log(user)
      let {
        meta: { status, msg }
      } = await this.axios({
        method: 'put',
        url: `users/${id}/state/${mgState}`
      })
      if (status === 200) {
        // 修改状态成功
        this.$message.success(msg)
        // 重新渲染，其实也可以不用，但是预防多人登入系统同时更改状态而导致页面没有更新
        this.getUserList()
      } else {
        this.$message.error('修改状态失败')
      }
    },
    // 删除用户
    async delUser(id) {
      if (id === 500) {
        this.$message('这是超级管理员,无权限删除哦')
        return
      }
      try {
        await this.$confirm('是否确定删除该用户?', '提示', {
          type: 'warning'
        })
        let res = await this.axios({
          method: 'delete',
          url: `users/${id}`
        })
        if (res.meta.status === 200) {
          // 删除成功
          // 如果当前页只剩一条,并且不是第一页，则从新渲染的时候渲染上一页
          if (this.userList.length <= 1 && this.currentPage > 1) {
            this.currentPage--
          }
          this.getUserList()
          this.$message.success('删除成功')
        } else {
          this.$message.error('删除失败')
        }
      } catch (e) {
        this.$message.info('取消删除')
      }
    },
    // 显示对话框
    showAdd() {
      // 弹出对话框
      this.addDialogVisible = true
    },
    // 点击确定 添加用户
    async addUser() {
      // 数据全部校验一次，通过则参数valid值为false
      try {
        await this.$refs.addForm.validate()
        let {
          meta: { msg, status }
        } = await this.axios({
          method: 'post',
          url: 'users',
          data: this.addForm
        })
        if (status === 201) {
          // 重置表单数据
          this.$refs.addForm.resetFields()
          // 关闭对话框
          this.addDialogVisible = false
          // 重新渲染数据 先总数+1,然后算出当前页 就可以直接跳到添加数据的页码
          this.total++
          this.currentPage = Math.ceil(this.total / this.pageSize)
          this.getUserList()
          // 弹出成功提示
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
      } catch (e) {
        return false
      }

      /* this.$refs.addForm.validate(valid => {
        if (!valid) return false
        // 发送添加用户的请求
        this.axios({
          method: 'post',
          url: 'users',
          data: this.addForm
        }).then(({meta: {msg, status}}) => {
          if (status === 201) {
            // 重置表单数据
            this.$refs.addForm.resetFields()
            // 关闭对话框
            this.addDialogVisible = false
            // 重新渲染数据 先总数+1,然后算出当前页 就可以直接跳到添加数据的页码
            this.total++
            this.currentPage = Math.ceil(this.total / this.pageSize)
            this.getUserList()
            // 弹出成功提示
            this.$message.success(msg)
          } else {
            this.$message.error(msg)
          }
        })
      }) */
    },
    // 显示修改对话框
    showEdit(users) {
      this.editDialogVisible = true
      // 把该数据保存到editForm中
      this.editForm.email = users.email
      this.editForm.mobile = users.mobile
      this.editForm.username = users.username
      this.editForm.id = users.id
    },
    // 修改确定，发送axios
    async updateUser() {
      // 表单校验
      await this.$refs.editForm.validate()
      let {
        meta: { msg, status }
      } = await this.axios({
        method: 'put',
        url: `users/${this.editForm.id}`,
        data: this.editForm
      })
      if (status === 200) {
        // 重新渲染
        this.getUserList()
        // 重置表单数据
        this.$refs.editForm.resetFields()
        this.editDialogVisible = false
        // 关闭修改对话框gVisible = false
        // 弹出对话框
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
    },
    // 获取角色rid
    async getRid(id) {
      let res = await this.axios.get(`users/${id}`)
      // console.log(res)
      let rid = res.data.rid
      if (res.data.rid === -1) {
        rid = ''
      }
      if (res.data.rid === 0) {
        rid = '超级管理员'
      }
      this.assignForm.rid = rid
    },
    // 点击分配权限 显示分配权限对话框
    async showAssign(user) {
      // console.log(user.id)
      this.assignDialogVisible = true
      this.assignForm.username = user.username
      this.assignForm.id = user.id
      // 回显rid
      this.getRid(user.id)
      // 发送请求 获取角色列表
      let res = await this.axios.get('roles')
      // console.log(res)
      if (res.meta.status === 200) {
        this.roleList = res.data
      }
    },
    // 点击确定，分配角色
    async assignRole() {
      // 解构
      let { id, rid } = this.assignForm
      // console.log(id, rid)
      if (!rid) {
        this.$message.error('请选择一个角色')
        return
      }
      let res = await this.axios.put(`users/${id}/role`, { rid })
      console.log(res)
      if (res.meta.status === 200) {
        this.assignDialogVisible = false
        this.getUserList()
        this.$message.success('分配角色成功')
      } else {
        this.$message.error('分配角色失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.input-with-select {
  width: 400px;
  margin-bottom: 5px;
}
</style>
