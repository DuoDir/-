<template>
  <div class="carSellPriceInfo">
    <el-table :data="tableData" border :header-cell-style="{background:'#f5f7fa',color:'#606266'}" style="width: 100%">
      <el-table-column v-for="item in sellPriceTable" :key="item.prop" :prop="item.prop" :formatter="formatData" :label="item.title" align="center"></el-table-column>
    </el-table>
  </div>
</template>
<script>
/*********************************************************************************************
 *                                车辆销售定价详情
 ** @function getSalesTable() 获取销售定价
 ** @function formatData() 格式化数据
 *
 *********************************************************************************************/
export default {
  props: {
    carInfo: "",
  },
  data() {
    return {
      tableData: [],
      sellPriceTable: [
        {
          prop: "saleType",
          title: "销售类型",
        },
        {
          prop: "saleChannel",
          title: "销售平台",
        },
        {
          prop: "taxPrice",
          title: "新车含税价",
        },
        {
          prop: "upPrice",
          title: "批售价格",
        },
        {
          prop: "upSalePrice",
          title: "挂牌价",
        },
        {
          prop: "upTime",
          title: "上架时间",
        },
      ],
      salePlant: [
        // {
        //   id: 1,
        //   name: "哈弗智家",
        // },
        {
          id: 2,
          name: "H5营销平台",
        },
        {
          id: 3,
          name: "其他",
        },
      ],
    };
  },
  methods: {
    getSalesTable() {
      this.$axios
        .post(this.pathItem.findCarPeiceByCondition, {
          carId: this.carInfo.id,
        })
        .then((res) => {
          if (res.code == 0) {
            if (res.result) {
              this.tableData = [res.result];
              this.tableData[0].upTime = this.carInfo.screatedAt;
              this.tableData[0].upSalePrice =
                res.result.saleType != 3 ? res.result.upPrice : "--";
            }
          }
        });
    },
    formatData(val, column, cellValue) {
      if (column.property == "saleChannel") {
        return this.formatSaleChannel(val.saleChannel);
      }
      if (column.property == "saleType") {
        if (val.saleType == 1) {
          return "认证销售";
        }
        if (val.saleType == 2) {
          return "普通零售";
        }
        if (val.saleType == 3) {
          return "批售";
        }
      }
      if (column.property == "upPrice") {
        if (val.saleType != 3) {
          return "--";
        }
      }

      return cellValue || "--";
    },
    formatSaleChannel(salePlant) {
      if (salePlant) {
        var salePlantString = "";
        var salePlantArr = salePlant.split(",");
        for (let index = 0; index < salePlantArr.length; index++) {
          const element = salePlantArr[index];
          this.salePlant.forEach((item) => {
            if (item.id == element) {
              salePlantString += (index > 0 ? "," : "") + item.name;
            }
          });
        }
        return salePlantString;
      } else {
        return "--";
      }
    },
  },
  mounted() {
    this.getSalesTable();
  },
};
</script>