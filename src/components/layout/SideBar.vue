<template>
  <div class="navMenu">
    <el-menu :default-active="activeIndex" @select="handleSelect" background-color="#515a6e" text-color="#fff" active-text-color="#ffd04b" style="height: 100%;overflow: hidden;">
      <NavMenu :navMenus="routesList"></NavMenu>
    </el-menu>
  </div>
</template>

<script>
import NavMenu from "@/components/layout/NavMenu";
export default {
  components: {
    NavMenu,
  },
  data() {
    return {};
  },
  computed: {
    routesList() {
      return this.$store.state.routesListData.routesList;
    },
    //获取当前预览标签
    activeIndex() {
      return this.$store.state.tagsview.activeView;
    },
  },
  methods: {
    handleSelect(key, keyPath) {
      // 跳页面之前 需先判断 (专营店/集团)是否已经完善信息  如果未完善 其他页面不能点击
      this.$axios.post(this.pathItem.findUserRedisInfo,{}).then((res) => {
          if (res.code == 0) {
            console.log(res)
            if (res.result.organizationInfo.isPerfect === 0 && res.result.organizationInfo.storeType === 1) { // 集团
              this.errorMsg("请先完善集团信息")
              return;
            } else if (res.result.organizationInfo.isPerfect === 0 && res.result.organizationInfo.storeType === 2) { // 专营店
              this.errorMsg("请先完善专营店信息")
              return;
            }
            this.$router.push(key);
          } else {
            this.errorMsg(res.message)
          }
        })
      
    },
    // 错误提醒	
    errorMsg(msg) {this.$alert(msg, '提示', {confirmButtonText: '确定',type:'warning',})},
    // 成功提醒	
    successMsg(msg) {this.$message({message:msg, type:'success'})}
  },
};
</script>

<style scoped>
.el-menu-item {
  height: 60px;
  line-height: 60px;
}
</style>