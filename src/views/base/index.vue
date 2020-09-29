<template>
  <el-container>
    <!--页面头部-->
    <el-header style="height:64px;">
      <Header />
    </el-header>
    <el-container>
      <!--左侧目录-->
      <el-aside>
        <SideBar />
      </el-aside>
      <!--页面主要内容-->
      <el-container>
        <el-main>
          <Tags />
          <div class="margin-top">
            <keep-alive v-if="isRouterAlive">
              <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="isRouterAlive && !$route.meta.keepAlive" />
          </div>
        </el-main>
        <!--<el-footer>Footer</el-footer>-->
      </el-container>
    </el-container>
  </el-container>

</template>

<script>
import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/SideBar";
import Tags from "@/components/Tags";
export default {
  components: {
    Header,
    SideBar,
    Tags,
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  beforeRouteEnter(to, from, next) {
    //监听刷新
    next();
  },
  mounted() {
    this.getToken();
  },
  methods: {
    // 获取并保存token
    getToken() {
      let token = this.$route.query._token;
      if (token != "" && token != undefined) {
        localStorage.setItem("_token", token);
        this.$router.push({ name: "" });
      }
    },

    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-container {
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
}

.el-header {
  background-color: #272f41;
  color: #fff;
  line-height: 64px;
  font-size: 18px;
  position: relative;
}

.margin-top {
  height: 95%;
  margin-top: 60px;
}
</style>