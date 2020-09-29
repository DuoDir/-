<template>
  <el-container>
    <el-header></el-header>

    <el-main>
      <div>
        <span class="firstText">抱歉！页面跑丢了~</span>
      </div>
      <div class="area404">
        <span class="titleFont">4</span>
        <el-image style="width: 100px; height: 100px" :src="failImg" fit="fit"></el-image>
        <span class="titleFont">4</span>
      </div>
      <div>
        <span class="firstText">请查看您要打开的链接是否正确</span><br>
        <span class="firstText">或者询问管理员您是否有权限查看该页面</span>
      </div>
      <div class="lastArea">
        <span @click="goToLogin()">
          返回登录页
        </span>
      </div>
    </el-main>
    <!-- <el-footer></el-footer> -->
  </el-container>

</template>

<script>
import failImg from "@/assets/images/false.png";

export default {
  components: {},

  data() {
    return {
      failImg: failImg,
    };
  },

  methods: {
    goToLogin() {
      this.$router.push({ path: "/login" });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-container {
  width: 100%;
  height: 100%;
  background-color: #272f41;
  overflow: auto;
}

.el-header {
  // background-color: #f2f2f2;
  color: #fff;
  line-height: 64px;
  font-size: 18px;
  position: relative;
  margin-bottom: 40px;
}
.el-main {
  // background-color: #fff;
  color: #fff;
  // line-height: 64px;
  font-size: 18px;
  position: relative;
  width: 900px;
  text-align: center;
  margin: 0 auto;
  padding: 0;
  display: contents;
}
.area404 {
  margin: 15px 0;
}
.firstText {
  font-size: 26px;
}
.titleFont {
  font-size: 160px;
  color: #409eff;
  margin: 0 15px;
}
.lastArea {
  margin-top: 30px;
  color: #409eff;
}
.lastArea > span {
  cursor: pointer;
}
.margin-top {
  min-height: 95%;
  margin-top: 51px;
  overflow: auto;
}
</style>