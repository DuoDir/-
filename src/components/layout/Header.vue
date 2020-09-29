<template>
  <div>
    <el-col :span="6"><span @click="goToIndex()">二手车后台系统 | 经销商</span></el-col>
    <div class="header-right">
      <div class="dot-box">
        <i class="el-icon-bell"></i>
        <el-badge :max="10" class="item">
        </el-badge>
      </div>
      <el-dropdown style="margin-right:20px" @command="handleCommand">
        <span class="el-dropdown-link">
          {{selectValue}}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="updataPwd">修改密码</el-dropdown-item>
          <el-dropdown-item command="exit">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <UpdatePassword v-if="updatePwd" @closedDialog="closeUpdatePwd" :fromUrl="fromPage"></UpdatePassword>
  </div>
</template>

<script>
import UpdatePassword from "@/components/layout/UpdatePassword"; //修改密码

export default {
  components: {
    UpdatePassword,
  },
  data() {
    return {
      selectValue: "",
      updatePwd: false,
      fromPage: "index",
    };
  },
  mounted() {
    this.selectValue = JSON.parse(localStorage.user).userName;
  },
  methods: {
    //回到首页
    handleCommand(command) {
      if (command == "exit") {
        localStorage.removeItem("token");
        this.$store.state.tagsview.visitedViews = [];
        this.$store.state.routesListData.routesList = "";
        this.$router.push({
          name: "login",
          params: {into:1}
          
        });
      } else {
        this.updatePwd = true;
      }
    },
    closeUpdatePwd() {
      this.updatePwd = false;
      this.$router.push({
        path: "/login",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.header-right {
  position: absolute;
  top: 0;
  right: 20px;
  display: flex;
  .dot-box {
    margin-right: 15px;
    .item {
      right: 12px;
      top: -7px;
    }
  }

  .el-dropdown-link {
    color: #fff;
  }
}
</style>