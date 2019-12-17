<template>
  <div class="category">
    <el-button type="success" plain @click="showAdd">添加分类</el-button>
    <el-table
      :data="categoryList"
      v-loading="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-text="拼命加载中"
      element-loading-background="rgba(0, 0, 0, 0.2)"
    >
      <el-table-tree-column
        label="分类名称"
        prop="cat_name"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
      ></el-table-tree-column>
      <el-table-column label="是否删除" prop="cat_deleted">
        <template slot-scope="scope">{{scope.row.cat_deleted ? '是' : '否'}}</template>
      </el-table-column>
      <el-table-column label="排序" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" icon="el-icon-edit" plain circle size="mini"></el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="mini" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      background
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible" width="30%">
      <el-form :rules="rules" ref="addForm" status-icon :model="addForm" label-width="80px">
        <el-form-item label="分类名称" prop='cat_name'>
          <el-input v-model="addForm.cat_name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop='cat_pid'>
          <el-cascader
            v-model="addForm.cat_pid"
            :options="options"
            :props="props"
            clearable
            v-loading="caLoading"
            element-loading-spinner="el-icon-loading"
            element-loading-text="加载中"
            element-loading-background="rgba(0, 0, 0, 0.2)"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryList: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      loading: true,
      dialogFormVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: []
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        checkStrictly: true
      },
      rules: {
        cat_name: [
          { required: true, message: '分类名不能为空', trigger: 'blur' }
        ]
      },
      caLoading: true
    }
  },
  methods: {
    // 获取分类数据
    async getCategoryList() {
      this.loading = true
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      // console.log(res)
      if (res.meta.status === 200) {
        this.categoryList = res.data.result
        // console.log(this.categoryList)
        this.total = res.data.total
        setTimeout(() => {
          this.loading = false
        }, 100)
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getCategoryList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getCategoryList()
    },
    async showAdd() {
      this.dialogFormVisible = true
      this.accordion = true
      let res = await this.axios.get('categories?type=2')
      if (res.meta.status === 200) {
        this.options = res.data
        this.caLoading = false
      }
    },
    // 添加商品分类
    async addCategory() {
      try {
        await this.$refs.addForm.validate()
        let {cat_pid: catPid, cat_name: catName} = this.addForm
        let res = await this.axios.post('categories', {
          cat_pid: catPid[catPid.length - 1] || 0,
          cat_name: catName,
          cat_level: catPid.length
        })
        if (res.meta.status === 201) {
          this.getCategoryList()
          this.$refs.addForm.resetFields()
          this.dialogFormVisible = false
          this.$message.success('添加分类成功')
          console.log(res)
        }
      } catch (e) {
        return false
      }
    }
  },
  created() {
    this.getCategoryList()
  }
}
</script>

<style lang="less" scoped>
</style>
