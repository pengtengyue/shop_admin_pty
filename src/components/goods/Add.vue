<template>
  <div class="add">
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
    </el-steps>
    <el-tabs tab-position="left" @tab-click='change'>
      <el-tab-pane label="基本信息">基本信息</el-tab-pane>
      <el-tab-pane label="商品图片">商品图片</el-tab-pane>
      <el-tab-pane label="商品内容">商品内容</el-tab-pane>
    </el-tabs>
    <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0
    }
  },
  methods: {
    next() {
      if (this.active++ > 2) this.active = 0
    },
    change() {
      if (this.active++ > 2) this.active = 0
    }
  }
}
</script>

<style lang="less" scoped>

</style>
