<template>
  <el-container v-loading="loading">
    <el-main style="text-align:center">
      <!-- 表格 -->
      <el-table :data="tableData" class="tableBtn" border style=" ;margin:20px auto;">
        <el-table-column prop="userName" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="postName" label="岗位"></el-table-column>
        <el-table-column prop="rolaName" label="角色"></el-table-column>
        <el-table-column prop="status" label="状态">
            <template slot-scope="scope"> 
                <span v-if="scope.row.status == 1">正常</span>
                <span v-else-if="scope.row.status == 2">禁用</span>
                <span  v-else-if="scope.row.status == 3">注销</span>
                <span v-else>--</span>
            </template>
        </el-table-column>
        <el-table-column min-width="110px" label="操作">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="jumpDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, prev, pager, next, sizes, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-main>
  </el-container>
</template>
<script>
export default {
  props: {
    userInfo: {},
    userId: ''
  },
  data() {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [5, 10, 15, 20],
      loading: false
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    // 加载列表
    getUserList() {
      this.loading = true
      this.$axios
        .post(this.pathItem.querySystemUserInfoDealersPage, {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          systemUserInfoDealers: {
            jurisdictionIds: this.userInfo.jurisdictionIds,
            id: this.userId
          },
        })
        .then((res) => {
          this.loading = false
          if (res.code == 0) {
            this.tableData = res.result.records
            this.total = res.result.total
          } else {
            this.errorMsg(res.message)
          }
        })
        .catch((res) => {
          this.errorMsg(res.message)
        });
    },
    // 页码
    handleSizeChange(val) {
      this.pageSize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getUserList();
    },
    // 跳转详情
    jumpDetail(row){
      this.$emit("changeUser",row.id)
    },
    // 错误提醒	
    errorMsg(msg) {this.$alert(msg, '提示', {confirmButtonText: '确定',type:'warning',})},
    // 成功提醒	
    successMsg(msg) {this.$message({message:msg, type:'success'})}
  },
};
</script>
<style scoped>
.red {
  color: red;
}
.mt15 {
  margin-top: 15px;
}
/* 分页 */
.right {
  float: right;
}
.block {
  padding: 10px 0;
  height: 100px;
}
.el-main::-webkit-scrollbar {
  display: none;
}
.el-table td,
.el-table th {
  text-align: center;
}
</style>