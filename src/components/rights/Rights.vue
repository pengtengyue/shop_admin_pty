<template>
  <div class="rights">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item to="/rights">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table :data="rightList">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="权限名字" prop="authName"></el-table-column>
      <el-table-column label="路劲" prop="path"></el-table-column>
      <el-table-column label="层级" prop="level">
        <template slot-scope="{row}">
          <span v-if="row.level === '0'">一级</span>
          <span v-else-if="row.level === '1'">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightList: []
    }
  },
  methods: {
    async getRightList() {
      let res = await this.axios.get(`rights/list`)
      if (res.meta.status === 200) {
        this.rightList = res.data
      }
    }
  },
  created() {
    this.getRightList()
  }
}
</script>

<style lang="less" scoped>
</style>
