<template>
  <div class="carHostlingInfo">
    <template>
      <el-table :data="tableData" border v-loading="loading">
        <template v-for="(item, index) in tableHead">
          <el-table-column :formatter="formatData" :key="index" :prop="item.prop" :label="item.label" :width="item.width" show-overflow-tooltip align="center"></el-table-column>
        </template>
        <el-table-column label="操作" width="240" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain icon="el-icon-document" style="margin-top: 5px" @click="gotoDetail(scope.$index, scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>
<script>
/*********************************************************************************************
 *                                车辆整备子订单信息详情
 ** @function closeApprovalLogDialog() 关闭流转记录
 ** @function closeHostlingDialog() 关闭父整备弹窗
 ** @function findCarList() 获取整备工单
 ** @function handleSizeChange() 分页
 ** @function handleCurrentChange(val) 分页 @param val value
 ** @function gotoDetail(val) 查看详情  @param val value
 ** @function formatData(val) 格式化表格

 *
 *********************************************************************************************/

export default {
  props: {
    carInfo: "",
  },
  data() {
    return {
      tableHead: [
        {
          prop: "orderNo",
          label: "订单号",
          width: 140,
        },
        {
          prop: "organiztionName",
          label: "经销商",
          width: 140,
        },
        {
          prop: "carSource",
          label: "车辆来源",
        },
        {
          prop: "customerName",
          label: "客户姓名",
          width: 120,
        },
        {
          prop: "customerPhone",
          label: "客户电话",
          width: 140,
        },
        {
          prop: "salesConsultantName",
          label: "销售顾问",
        },
        {
          prop: "salesType",
          label: "销售类型",
        },
        {
          prop: "carUltimatelyPrice",
          label: "车辆成交价",
          width: 120,
        },
        {
          prop: "orderStatus",
          label: "订单状态",
          width: 120,
        },
        {
          prop: "createdAt",
          label: "下单时间",
          width: 120,
        },
        {
          prop: "turnoverTime",
          label: "成交时间",
          width: 120,
        },
        {
          prop: "salesChannel",
          label: "销售渠道",
          width: 120,
        },
      ],
      tableData: [],

      loading: false,
      orderStatus: [
        {
          value: 1,
          label: "已预订",
        },
        {
          value: 2,
          label: "已成交",
        },
        {
          value: 3,
          label: "已取消",
        },
        {
          value: 4,
          label: "已退车",
        },
      ],
      carSource: [
        {
          value: 1,
          label: "外采",
        },
        {
          value: 2,
          label: "寄售",
        },
        {
          value: 3,
          label: "置换",
        },
        {
          value: 4,
          label: "退换车",
        },
        {
          value: 5,
          label: "出口",
        },
      ],
      salesType: [
        {
          value: 1,
          label: "认证零售",
        },
        {
          value: 2,
          label: "普通零售",
        },
        {
          value: 3,
          label: "批售",
        },
      ],
      salesChannel: [
        // {
        //   value: 1,
        //   label: "哈弗智家",
        // },
        {
          value: 2,
          label: "H5营销平台",
        },
        {
          value: 3,
          label: "其他",
        },
      ],
    };
  },
  methods: {
    //格式化数据
    formatData(val, column, cellValue) {
      if (column.property == "orderStatus") {
        return this.formatList(cellValue, this.orderStatus);
      }
      if (column.property == "carSource") {
        return this.formatList(cellValue, this.carSource);
      }
      if (column.property == "salesType") {
        return this.formatList(cellValue, this.salesType);
      }
      if (column.property == "salesChannel") {
        return this.formatMultArr(cellValue, this.salesChannel);
      }
      return cellValue || "--";
    },

    findCarList() {
      this.loading = true;
      var params = {
        carId: this.carInfo.id,
      };
      this.loading = true;
      this.$axios
        .post(this.pathItem.queryCarOrderList, params)
        .then((res) => {
          if (res.code == 0) {
            this.tableData = res.result.carOrderList;
          } else {
            this.tableData = [];
          }
          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
        });
    },
    gotoDetail(index, row) {
      this.$router.push({
        path: "/carOrderDetail",
        query: {
          orderId: row.id,
        },
      });
    },
    formatList(val, choseList) {
      for (let index = 0; index < choseList.length; index++) {
        const element = choseList[index];
        if (element.value == val) {
          return element.label ? element.label : element.name;
        }
      }
      return "--";
    },
    formatMultArr(val, choseList) {
      var lastString = "";

      if (val) {
        var valArr = String(val).split(",");
        choseList.filter((item) => {
          valArr.map((valItem) => {
            if (item.value == valItem) {
              lastString = lastString + (lastString ? "," : "") + item.label;
            }
          });
        });
        return lastString;
      } else {
        return "--";
      }
    },
  },
  mounted() {
    this.findCarList();
  },
};
</script>