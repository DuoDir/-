<template>
  <div class="orderOperationLog">
    <el-table :data="orderLogData" border :header-cell-style="{background:'#f5f7fa',color:'#606266'}" style="width: 100%">
      <el-table-column type="index" width="80" label="序号" align="center">
      </el-table-column>
      <el-table-column v-for="item in logDetailTable" :key="item.prop" :formatter="formatData" :prop="item.prop" :label="item.title" align="center">
      </el-table-column>
    </el-table>
    <div class="page-box" v-if="!loading">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="totalElements"></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderId: this.$route.query.orderId,
      loading: false,
      orderLogData: [], //操作日志
      totalElements: 0,
      currentPage: 1,
      pageSize: 10,
      logDetailTable: [
        { prop: "createdAt", title: "操作时间" },
        { prop: "operator", title: "操作人" },
        { prop: "content", title: "操作内容" },
        { prop: "remark", title: "备注" },
      ],
    };
  },
  mounted() {
    this.getLogData();
  },
  methods: {
    getLogData() {
      let params = {
        mainId: this.orderId,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        operateType: 4,
      };
      this.$axios
        .post(this.pathItem.getLogByTypeAndMainId, params)
        .then((res) => {
          if (res.code == 0) {
            this.orderLogData = res.result.records;
            this.totalElements = res.result.total;
          }
        })
        .catch((res) => {
          this.$message.error(res.message);
        });
    },
    formatData(val, column, cellValue) {
      const cellVal = {
        createdAt: this.formatDate(cellValue, "yyyy-MM-dd hh:mm:ss"),
      };
      return cellVal[column.property] || cellValue || "--";
    },
    //每页条数改变时触发事件
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getLogData();
    },
    //当前页码改变时触发事件
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getLogData();
    },
  },
};
</script>
<style scoped>
.orderOperationLog {
  padding: 20px;
}
</style>