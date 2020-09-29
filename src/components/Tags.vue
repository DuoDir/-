<template>
  <!--页面顶部选项卡-->
  <div class="tags">
    <el-menu mode="horizontal" text-color="#687596" active-text-color="#687596">
      <el-menu-item v-for="(item, index) in visitedViews" :key="index" :class="activeIndex==item.name?'isActive':''" @click="selectTab(item)">
        <template v-if="item.query&&item.query.orderId">
          {{titleEditList[item.name]||item.title}}
        </template>
        <template v-else>
          {{item.title}}
        </template>
        <i class="el-icon-close" @click.prevent.stop="removeTab(item)"></i>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeView: "",
      titleEditList: {
        createCarOrderInfo: "编辑订单",
      },
    };
  },
  computed: {
    //获取vuex存储的已预览标签页
    visitedViews() {
      return this.$store.state.tagsview.visitedViews;
    },
    //获取当前预览标签
    activeIndex() {
      return this.$store.state.tagsview.activeView;
    },
  },
  methods: {
    selectTab(item) {
      this.$store.dispatch("addVisitedViews", item);
      this.$router.push(item.fullPath);
    },
    isActive(route) {
      return route.name === this.$route.name;
    },
    //删除标签页
    removeTab(route) {
      this.$route.meta.flag = "delete";
      this.$route.meta.keepAlive = false;
      this.confirmDelete(route);
    },
    confirmDelete(route) {
      var _this = this;
      this.$store.dispatch("delVisitedViews", route).then((views) => {
        if (_this.isActive(route)) {
          let lastView = views.slice(-1)[0];
          if (lastView) {
            _this.$router.push({
              path: lastView.fullPath,
              query: lastView.query,
            });
          } else {
            _this.$router.push("/");
          }
        }
      });
    },
  },
};
</script>

<style>
.tags {
  position: fixed;
  background: #fff;
  width: 100%;
  z-index: 1000;
}

.tags .el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: transparent;
}

.tags .isActive {
  border-bottom: 2px solid #409eff !important;
}
</style>