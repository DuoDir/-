<template>
  <div class="sellCarsDialog">
    <el-dialog title="在售车辆" :visible.sync="dialogVisible" width="80%" @close="closeDialog()">
      <el-row style="margin-bottom:10px;">
        <el-col :span="3" class="el-col-test">品牌车系</el-col>
        <el-col :span="7">
          <carBrandSerise @seriseChangeVal="seriseChangeVal" @brandChangeVal="brandChangeVal" :hasModel="false"></carBrandSerise>
        </el-col>
        <el-col :span="3" class="el-col-test">车辆信息</el-col>
        <el-col :span="6">
          <el-input v-model="filterInfo.carInfo" placeholder="请输入车辆VIN码/原车牌号" size="mini"></el-input>
        </el-col>
        <el-col :span="3" class="el-col-test">
          <el-button type="primary" size="mini" @click="findCarInfo">查询</el-button>
        </el-col>
      </el-row>
      <el-table ref="multipleTable" :data="sellCarsList" @select="select" @select-all="selectAll" v-loading="loading" border max-height="450" :header-cell-style="{background:'#f5f7fa',color:'#606266'}"
        style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column v-for="item in tableHeader" :key="item.prop" :prop="item.prop" :label="item.title" :formatter="formatterTable" align="center">
        </el-table-column>
      </el-table>
      <div class="page-box" style="height:auto">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="filterInfo.pageNo" :page-sizes="[5, 10, 15, 20]" :page-size="filterInfo.pageSize"
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
import carBrandSerise from "../../components/certification/selectCarBrand";

export default {
  components: {
    carBrandSerise,
  },
  data() {
    return {
      loading: false,
      filterInfo: {
        brandId: "",
        seriesId: "",
        carInfo: "",
        pageSize: 10,
        pageNo: 1, //当前页数
      },
      totalElements: 0,
      sellCarsList: [], //列表数据
      selectCarData: "", //选择的车辆
      dialogVisible: true,
      tableHeader: [
        { prop: "brandName", title: "品牌车型" },
        { prop: "vin", title: "车架号" },
        { prop: "carNo", title: "原车牌号" },
        { prop: "putawayTime", title: "上架时间" },
        { prop: "certifiedStatus", title: "认证状态" },
      ],
    };
  },
  mounted() {
    this.findCarInfo();
  },
  methods: {
    findCarInfo() {
      this.loading = true;
      this.$axios
        .post(this.pathItem.findCarInfo, this.filterInfo)
        .then((res) => {
          if (res.code == 0) {
            this.sellCarsList = res.result.records;
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
    formatterTable(val, column, cellValue) {
      let certifiStatusObj = {
        status_1: "录入中",
        status_2: "待初审",
        status_3: "待复审",
        status_4: "申请驳回",
        status_5: "已撤销",
        status_6: "认证失效",
        status_7: "取消认证",
        status_8: "已认证",
        status_9: "汇报待审核",
        status_10: "汇报通过",
        status_11: "汇报驳回",
      };
      if (column.property == "brandName") {
        cellValue = cellValue + val.seriesName + val.modelName;
      }
      if (column.property == "certifiedStatus") {
        cellValue = certifiStatusObj["status_" + cellValue];
      }
      return cellValue || "--";
    },
    //选择的车系
    brandChangeVal(selectName) {
      this.filterInfo.brandId = selectName.carBrandId;
    },
    //选择的车型
    seriseChangeVal(selectName) {
      this.filterInfo.seriesId = selectName.carSeriesId;
    },
    //每页条数改变时触发事件
    handleSizeChange(pageSize) {
      this.filterInfo.pageSize = pageSize;
      this.findCarInfo();
    },
    //当前页码改变时触发事件
    handleCurrentChange(currentPage) {
      this.filterInfo.pageNo = currentPage;
      this.findCarInfo();
    },
    select(selection, row) {
      this.selectCarData = row.id == this.selectCarData.id ? "" : row;
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
      if (type == 1 && !this.selectCarData) {
        this.$message.error({
          message: "请选择在售车辆",
          offset: 300,
        });
        return;
      }
      let data = type == 1 ? this.selectCarData : "";
      this.$emit("submitCarData", data);
    },
  },
};
</script>
<style lang="scss" scoped>
.sellCarsDialog {
  .el-col-test {
    line-height: 28px;
    padding-right: 10px;
    text-align: right;
  }
}
</style>