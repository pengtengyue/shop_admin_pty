<template>
  <el-container class="home">
    <el-header>
      <div class="logo"></div>
      <div class="title">
        <h1>后台管理系统</h1>
      </div>
      <div class="logout">
        <span>欢迎光临</span>
        <el-button type="danger" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          default-active="1-1"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="2-1">
              <i class="el-icon-menu"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>
            <el-menu-item index="2-2">
              <i class="el-icon-menu"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$confirm('是否退出系统', '提示', {
        confirmButtonText: '是的,我要退出',
        cancelButtonText: '不了,我在看看',
        type: 'warning'
      })
        .then(() => {
          localStorage.removeItem('token')
          this.$router.push('/login')
          this.$message.success('退出系统成功')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出',
            duration: 1000
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-header {
    background-color: rgb(255, 255, 255);
    display: flex;
    .logo {
      width: 180px;
      background-image: url('~@/assets/images/pty.jpg');
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center center;
    }
    .title {
      flex: 1;
      h1 {
        text-align: center;
        line-height: 60px;
        color: rgb(0, 0, 0);
        font-size: 30px;
      }
    }
    .logout {
      width: 180px;
      font-weight: 700;
      text-align: right;
      line-height: 60px;
      span {
        margin-right: 5px;
        color: #b700ff;
      }
      a {
        color: rgba(240, 198, 11, 0.924);
      }
    }
  }
  .el-aside {
    background-color: rgba(127, 255, 212, 0.787);
    .el-menu {
      height: 100%;
      border-right: none;
    }
  }
  .el-main {
    background-color: rgb(137, 240, 240);
  }
}
</style>
