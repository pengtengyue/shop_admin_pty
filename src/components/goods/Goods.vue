<template>
  <div class="goods">
    <el-button type='success' plain @click="$router.push('/goods-add')">添加商品</el-button>
    <el-table
      :data="goodList"
    >
      <el-table-column
        label="#"
        type='index'
        :index='indexMethod'
      >
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
      >
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格"
      >
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量">
      </el-table-column>
      <el-table-column
        prop="add_time"
        label="创建时间">
        <template slot-scope="{row}">
          {{row.add_time | dataFilter}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            type='primary'
            plain
            size='mini'
            circle
            icon='el-icon-edit'
          ></el-button>
          <el-button
            type='danger'
            plain
            size='mini'
            circle
            icon='el-icon-delete'
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodList: [],
      query: '',
      pageSize: 10,
      currentPage: 1,
      total: 0
    }
  },
  methods: {
    async getGoodList() {
      let res = await this.axios.get('goods', {
        params: {
          query: '',
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      // console.log(res)
      if (res.meta.status === 200) {
        this.goodList = res.data.goods
        this.total = res.data.total
        // console.log(res)
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getGoodList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getGoodList()
    },
    // 计算商品序号
    indexMethod(index) {
      return index + 1 + this.pageSize * (this.currentPage - 1)
    }
  },
  created() {
    this.getGoodList()
  }
}
</script>

<style lang="less" scoped>

</style>
