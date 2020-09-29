<template>
  <div class="customerInfoDialog">
    <el-dialog title="客户列表" :visible.sync="dialogVisible" width="80%" @close="closeDialog()">
      <el-row style="margin-bottom:10px;">
        <el-col :span="3" class="el-col-test">客户信息</el-col>
        <el-col :span="6">
          <el-input v-model="filterInfo.name" placeholder="请输入客户姓名/手机号" size="mini"></el-input>
        </el-col>
        <el-col :span="3" class="el-col-test">销售顾问</el-col>
        <el-col :span="7">
          <el-select v-model="filterInfo.salesAdvisorId" placeholder="请选择销售顾问" size="mini">
            <el-option v-for="sale in salesAdvisorList" :key="sale.id" :label="sale.userName" :value="sale.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3" class="el-col-test">
          <el-button type="primary" size="mini" @click="queryCustomerPage">查询</el-button>
        </el-col>
      </el-row>
      <el-table ref="multipleTable" :data="dataList" @select="select" @select-all="selectAll" v-loading="loading" border :header-cell-style="{background:'#f5f7fa',color:'#606266'}" style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column v-for="item in tableHeader" :key="item.prop" :prop="item.prop" :label="item.title" :formatter="formatterTable" align="center">
        </el-table-column>
      </el-table>
      <div class="page-box" style="height:auto">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="totalElements"></el-pagination>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="closeDialog(1)">提 交</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      filterInfo: {
        salesAdvisorId: "", //销售顾问
        name: "", //客户信息
      },
      salesAdvisorList: [],
      pageSize: 10,
      currentPage: 1, //当前页数
      totalElements: 0,
      dataList: [], //列表数据
      selectData: "", //选择的车辆
      dialogVisible: true,
      tableHeader: [
        { prop: "name", title: "客户姓名" },
        { prop: "phone", title: "手机号" },
        { prop: "idcard", title: "身份证号" },
        { prop: "sex", title: "性别" },
        { prop: "salesAdvisorName", title: "销售顾问" },
      ],
    };
  },
  mounted() {
    this.queryCustomerPage();
    this.querySystemUserInfoDealersList();
  },
  methods: {
    queryCustomerPage() {
      this.loading = true;
      let params = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        requestBody: this.filterInfo,
      };
      this.$axios.post(this.pathItem.queryCustomerPage, params).then((res) => {
        if (res.code == 0) {
          this.dataList = res.result.records;
          this.totalElements = res.result.total;
        } else {
          this.$alert(res.message, "提示", {
            confirmButtonText: "确定",
            type: "warning",
          });
        }
        this.loading = false;
      });
    },
    querySystemUserInfoDealersList() {
      let params = {
        roleTypes: 5, //角色类型1：二手车经理2：评估师3：翻新技师\r\n4：整备师5：二手车销售6：二手车信息员
      };
      this.$axios
        .post(this.pathItem.querySystemUserInfoDealersList, params)
        .then((res) => {
          if (res.code == 0) {
            this.salesAdvisorList = res.result.systemUserInfoDealersList;
          } else {
            this.$alert(res.message, "提示", {
              confirmButtonText: "确定",
              type: "warning",
            });
          }
        });
    },
    formatterTable(val, column, cellValue) {
      if (column.property == "sex") {
        cellValue = cellValue == 1 ? "男" : cellValue == 2 ? "女" : "";
      }
      return cellValue || "--";
    },
    //每页条数改变时触发事件
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.queryCustomerPage();
    },
    //当前页码改变时触发事件
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.queryCustomerPage();
    },
    select(selection, row) {
      this.selectData = row.id == this.selectData.id ? "" : row;
      if (selection.length > 1) {
        let del_row = selection.shift();
        this.$refs.multipleTable.toggleRowSelection(del_row, false);
      }
    },
    selectAll(selection) {
      if (selection.length > 1) {
        selection.length = 1;
      }
    },
    // 关闭对话框 1提交 2 关闭
    closeDialog(type) {
      if (type == 1 && !this.selectData) {
        this.$message.error({
          message: "请选择在售车辆",
          offset: 300,
        });
        return;
      }
      let data = type == 1 ? this.selectData : "";
      this.$emit("submitCustomerData", data);
    },
  },
};
</script>
<style lang="scss" scoped>
.customerInfoDialog {
  .el-col-test {
    line-height: 28px;
    padding-right: 10px;
    text-align: right;
  }
}
</style>