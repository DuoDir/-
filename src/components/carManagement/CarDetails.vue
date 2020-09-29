<template>
  <div class="carDetails">
    <div class="subHead">详细信息</div>
    <table class="table-vertical" style="width: 100%">
      <tr v-for="index in 12" :key="index">
        <td class="column">{{ detailTableKeys[index * 3 - 3].title }}</td>
        <td>{{ formatTopVal(detailTableKeys[index * 3 - 3].prop) }}</td>
        <td class="column">{{ detailTableKeys[index * 3 - 2].title }}</td>
        <td>{{ formatTopVal(detailTableKeys[index * 3 - 2].prop) }}</td>
        <td class="column">{{ detailTableKeys[index * 3 - 1].title }}</td>
        <td>{{ formatTopVal(detailTableKeys[index * 3 - 1].prop) }}</td>
      </tr>
    </table>
    <div class="subHead" style="margin-top: 20px">价格信息</div>
    <template v-if="carInfo.carStatus == 1">
      <el-table
        :data="priceTableData"
        border
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
        style="width: 100%"
      >
        <el-table-column
          prop="evaluatePrice"
          label="评估师评估价"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="buyPrice"
          label="采购价格"
          align="center"
        ></el-table-column>
      </el-table>
    </template>
    <template v-if="carInfo.carStatus > 1">
      <el-table
        :data="priceTableData"
        border
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
        style="width: 100%"
      >
        <el-table-column
          v-for="item in priceTable"
          :key="item.prop"
          :prop="item.prop"
          :label="item.title"
          align="center"
        ></el-table-column>
      </el-table>
    </template>
    <div class="subHead" style="margin-top: 20px">手续信息</div>
    <table class="table-vertical" style="width: 100%">
      <tr v-for="index in 5" :key="index">
        <td class="column">{{ procedureTableKeys[index * 3 - 3].title }}</td>
        <td>{{ fomratProcedure(procedureTableKeys[index * 3 - 3].prop) }}</td>
        <td class="column">{{ procedureTableKeys[index * 3 - 2].title }}</td>
        <td>{{ fomratProcedure(procedureTableKeys[index * 3 - 2].prop) }}</td>
        <td class="column">{{ procedureTableKeys[index * 3 - 1].title }}</td>
        <td>{{ fomratProcedure(procedureTableKeys[index * 3 - 1].prop) }}</td>
      </tr>
    </table>
    <el-row v-if="imageList.length">
      <p>维修保养历史记录：</p>
      <el-row>
        <el-col
          v-for="(image, index) in imageList"
          :key="index"
          :span="3"
          class="img-content-box"
        >
          <img class="image-item" :src="image.url" />
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script>
/*********************************************************************************************
 *                                车辆信息详情
 ** @function formatTopVal(val) 格式化枚举类 @param val 枚举类key
 ** @function formatOneOrTwo(val) 格式化是和否  @param val value
 ** @function formatOneOrTwoHave(val) 格式化有和无  @param val value
 ** @function formatCarSource(val) 格式化车来源  @param val value
 ** @function formatChangeSpeed(val) 变声箱类型  @param val value
 ** @function formatList(val) 格式化list  @param val value
 ** @function formatMultArr(val) 格式化多选list  @param val value
 ** @function fomratProcedure(val) 格式化手续信息  @param val value
 *
 *********************************************************************************************/
export default {
  props: {
    carInfo: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      carStatus: "", //车辆状态
      carDetailInfo: { id: 1233, price: "12万" },
      priceTableData: [],
      imageList: [],
      detailTableKeys: [
        {
          prop: "carNumber",
          title: "车辆编号",
        },
        {
          prop: "vin",
          title: "VIN码",
        },
        {
          prop: "brand",
          title: "厂牌",
        },
        {
          prop: "guidancePrice",
          title: "新车指导价",
        },
        {
          prop: "brandModel",
          title: "品牌型号",
        },
        {
          prop: "brandType",
          title: "品牌车型",
        },
        {
          prop: "ifRegistered",
          title: "是否上牌",
        },

        {
          prop: "carNo",
          title: "车牌号",
        },
        {
          prop: "registeredDate",
          title: "注册日期",
        },
        {
          prop: "carNoProvince",
          title: "车牌注册地",
        },
        {
          prop: "carSource",
          title: "车辆来源",
        },
        {
          prop: "carProvince",
          title: "车辆所在地",
        },
        {
          prop: "engineNumber",
          title: "发动机号",
        },
        {
          prop: "gearbox",
          title: "变速箱",
        },
        {
          prop: "color",
          title: "车辆颜色",
        },
        {
          prop: "displacement",
          title: "排气量",
        },
        {
          prop: "mileage",
          title: "行驶里程",
        },
        {
          prop: "outDate",
          title: "出厂年份",
        },
        {
          prop: "useType",
          title: "使用性质",
        },
        {
          prop: "fuelType",
          title: "燃料类型",
        },
        {
          prop: "transferTimes",
          title: "过户次数",
        },
        {
          prop: "keyNum",
          title: "钥匙数量（把）",
        },
        {
          prop: "carType",
          title: "车辆属性",
        },
        {
          prop: "driveType",
          title: "驱动形式",
        },
        {
          prop: "weight",
          title: "车辆自重",
        },
        {
          prop: "carLoad",
          title: "车辆载重",
        },
        {
          prop: "engineType",
          title: "发动机型号",
        },
        {
          prop: "horsepower",
          title: "马力",
        },
        {
          prop: "accident",
          title: "事故检查",
        },
        {
          prop: "carDetail",
          title: "车况描述",
        },
        {
          prop: "carConverted",
          title: "车辆改装",
        },
        {
          prop: "convertedItem",
          title: "改装项目",
        },
        {
          prop: "seatNum",
          title: "座位数量",
        },
        {
          prop: "emissionStandard",
          title: "环保标准",
        },
        {
          prop: "carAllocation",
          title: "车辆配置",
        },
        {
          prop: "carInsideDetail",
          title: "内部车况描述",
        },
      ],
      procedureTableKeys: [
        {
          prop: "upInsurance",
          title: "出险记录",
        },
        {
          prop: "carTax",
          title: "车船税",
        },
        {
          prop: "buyTax",
          title: "购置税",
        },
        {
          prop: "violation",
          title: "违章",
        },
        {
          prop: "scrappingStandard",
          title: "达到国家强制报废标准",
        },
        {
          prop: "legal",
          title: "手续合法及车辆合法状态",
        },
        {
          prop: "carNetworkDate",
          title: "车联网到期",
        },
        {
          prop: "inspectionDate",
          title: "年检到期",
        },
        {
          prop: "compulsoryInsuranceDate",
          title: "交强险到期",
        },
        {
          prop: "compulsoryInsuranceCompany",
          title: "交强险公司",
        },
        {
          prop: "compulsoryInsuranceProvinceName",
          title: "交强险所在地",
        },
        {
          prop: "commercialInsuranceDate",
          title: "商业险到期",
        },
        {
          prop: "commercialInsuranceCompany",
          title: "商业险公司",
        },
        {
          prop: "maintenanceDate",
          title: "最后一次保养日期",
        },
        {
          prop: "maintenanceMileage",
          title: "最后一次保养里程",
        },
      ],
      priceTable: [
        {
          prop: "evaluatePrice",
          title: "评估师评估价",
        },
        {
          prop: "buyPrice",
          title: "实际收购价",
        },
        {
          prop: "workFee",
          title: "整备维修预算",
        },
        {
          prop: "workTotalFee",
          title: "整备实际价格",
        },
        {
          prop: "upPrice",
          title: "挂牌价",
        },
      ],
      colorList: [
        {
          id: 1,
          label: "黑色",
        },
        {
          id: 2,
          label: "红色",
        },
        {
          id: 3,
          label: "白色",
        },
        {
          id: 4,
          label: "蓝色",
        },
        {
          id: 5,
          label: "黄色",
        },
        {
          id: 6,
          label: "绿色",
        },
        {
          id: 7,
          label: "银色",
        },
        {
          id: 8,
          label: "深灰色",
        },
        {
          id: 9,
          label: "香槟色",
        },
        {
          id: 10,
          label: "彩色",
        },
      ],
      emissionStandardList: [
        {
          id: "6",
          name: "国VI",
        },
        {
          id: "5",
          name: "国V",
        },
        {
          id: "4",
          name: "国IV",
        },
        {
          id: "3",
          name: "国III",
        },
        {
          id: "2",
          name: "国II",
        },
        {
          id: "1",
          name: "国I",
        },
        {
          id: "7",
          name: "其他",
        },
      ],
      fuelType: [
        {
          id: 1,
          label: "汽油",
        },
        {
          id: 2,
          label: "柴油",
        },
        {
          id: 3,
          label: "电动",
        },
        {
          id: 4,
          label: "油电混合",
        },
        {
          id: 5,
          label: "天然气",
        },
      ],
      carProperties: [
        {
          id: 1,
          label: "乘用车",
        },
        {
          id: 2,
          label: "商用车",
        },
        {
          id: 3,
          label: "工程车",
        },
        {
          id: 4,
          label: "特种车",
        },
      ],
      useType: [
        {
          id: "1",
          name: "营运",
        },
        {
          id: "2",
          name: "非营运",
        },
        {
          id: "3",
          name: "营转非",
        },
      ],
      driveType: [
        {
          id: "1",
          label: "前驱",
        },
        {
          id: "2",
          label: "后驱",
        },
        {
          id: "3",
          label: "四驱",
        },
      ],
      accidentList: [
        {
          id: "1",
          name: "非事故车",
        },
        {
          id: "2",
          name: "非火烧车",
        },
        {
          id: "3",
          name: "非泡水车",
        },
      ],
      carDetailList: [
        {
          id: "1",
          name: "非走私车",
        },
        {
          id: "2",
          name: "非盗抢车",
        },
        {
          id: "3",
          name: "非海关罚没车",
        },
        {
          id: "4",
          name: "非涉及法律纠纷车",
        },
      ],
      insuranceCompany: [
        {
          id: "1",
          name: "人保汽车保险",
        },
        {
          id: "2",
          name: "太平汽车保险",
        },
        {
          id: "3",
          name: "平安车险",
        },
        {
          id: "4",
          name: "太平洋汽车保险",
        },
        {
          id: "5",
          name: "天安车险",
        },
        {
          id: "6",
          name: "中华联合车险",
        },
        {
          id: "7",
          name: "安邦车险",
        },
        {
          id: "8",
          name: "阳光汽车保险",
        },
        {
          id: "9",
          name: "永安车险",
        },
        {
          id: "10",
          name: "大地车险",
        },
        {
          id: "11",
          name: "其他",
        },
      ],
    };
  },
  methods: {
    formatTopVal(val) {
      if (val == "brandType") {
        return (
          this.carInfo.brandName +
          this.carInfo.seriesName +
          this.carInfo.modelName
        );
      }
      if (val == "ifRegistered" || val == "carConverted") {
        return this.formatOneOrTwo(this.carInfo[val]);
      }
      if (val == "outDate" || val == "registeredDate") {
        return this.formatDate(this.carInfo[val], "yyyy-MM");
      }
      if (val == "displacement") {
        return this.carInfo.displacement + this.carInfo.displacementUnit;
      }
      if (val == "carSource") {
        return this.formatCarSource(this.carInfo[val]);
      }
      if (val == "gearbox") {
        return this.formatChangeSpeed(this.carInfo[val]);
      }
      if (val == "color") {
        return this.formatList(this.carInfo[val], this.colorList);
      }
      if (val == "emissionStandard") {
        return this.formatList(this.carInfo[val], this.emissionStandardList);
      }
      if (val == "fuelType") {
        return this.formatList(this.carInfo[val], this.fuelType);
      }
      if (val == "useType") {
        return this.formatList(this.carInfo[val], this.useType);
      }
      if (val == "carType") {
        return this.formatList(this.carInfo[val], this.carProperties);
      }
      if (val == "driveType") {
        return this.formatList(this.carInfo[val], this.driveType);
      }
      if (val == "accident") {
        return this.formatMultArr(this.carInfo[val], this.accidentList);
      }
      if (val == "carDetail") {
        return this.formatMultArr(this.carInfo[val], this.carDetailList);
      }
      if (val == "carProvince") {
        return this.carInfo.carProvinceName + this.carInfo.carCityName;
      }
      if (val == "carNoProvince") {
        return (
          (this.carInfo.provinceName ? this.carInfo.provinceName : "") +
          (this.carInfo.cityName ? this.carInfo.cityName : "")
        );
      }

      return this.carInfo[val] ? this.carInfo[val] : "--";
    },
    formatOneOrTwo(val) {
      return val == "1" ? "是" : "否";
    },
    formatOneOrTwoHave(val) {
      return val == "1" ? "有" : "无";
    },
    formatCarSource(item) {
      switch (item) {
        case 1:
          return "外采";
          break;
        case 2:
          return "寄售";
          break;
        case 3:
          return "置换";
          break;
        case 4:
          return "退换车";
          break;
        case 5:
          return "出口";
          break;
        default:
          return "--";
          break;
      }
    },
    formatChangeSpeed(item) {
      switch (item) {
        case "1":
          return "自动";
          break;
        case "2":
          return "手动";
          break;
        default:
          return "--";
          break;
      }
    },
    formatList(val, choseList) {
      for (let index = 0; index < choseList.length; index++) {
        const element = choseList[index];
        if (element.id == val) {
          return element.label ? element.label : element.name;
        }
      }
      return "--";
    },
    formatMultArr(val, choseList) {
      var lastString = "";
      if (val) {
        var valArr = val.split(",");
        choseList.filter((item) => {
          valArr.map((valItem) => {
            if (item.id == valItem) {
              lastString = lastString + (lastString ? "," : "") + item.name;
            }
          });
        });
        return lastString;
      } else {
        return "--";
      }
    },
    fomratProcedure(val) {
      if (
        val == "upInsurance" ||
        val == "carTax" ||
        val == "buyTax" ||
        val == "violation"
      ) {
        return this.formatOneOrTwoHave(this.carInfo[val]);
      }
      if (val == "scrappingStandard" || val == "legal") {
        return this.formatOneOrTwo(this.carInfo[val]);
      }
      if (
        val == "carNetworkDate" ||
        val == "commercialInsuranceDate" ||
        val == "compulsoryInsuranceDate" ||
        val == "inspectionDate"
      ) {
        return this.formatDate(this.carInfo[val], "yyyy-MM");
      }
      if (val == "maintenanceDate") {
        return this.formatDate(this.carInfo[val], "yyyy-MM-dd");
      }
      if (val == "compulsoryInsuranceProvinceName") {
        return (
          this.carInfo.compulsoryInsuranceProvinceName +
          this.carInfo.compulsoryInsuranceCityName
        );
      }
      if (
        val == "commercialInsuranceCompany" ||
        val == "compulsoryInsuranceCompany"
      ) {
        return this.formatList(this.carInfo[val], this.insuranceCompany);
      }
      return this.carInfo[val] ? this.carInfo[val] : "--";
    },
    formatDate(value, format) {
      if (value) {
        value = new Date(value);
        let o = {
          "M+": value.getMonth() + 1,
          "d+": value.getDate(),
          "h+": value.getHours(),
          "m+": value.getMinutes(),
          "s+": value.getSeconds(),
        };

        if (/(y+)/.test(format)) {
          format = format.replace(
            RegExp.$1,
            (value.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
          for (let k in o) {
            if (new RegExp(`(${k})`).test(format)) {
              format = format.replace(
                RegExp.$1,
                RegExp.$1.length == 1
                  ? o[k]
                  : ("00" + o[k]).substr(("" + o[k]).length)
              );
            }
          }
          return format;
        } else {
          return "--";
        }
      }
    },
    getAfterSaleImg() {
      this.$axios
        .post(this.pathItem.getFileListByTableAndMainKey, {
          tableName: 3,
          mainKey: this.carInfo.id,
        })
        .then((res) => {
          if (res.code == 0) {
            this.imageList = res.result;
          }
        })
        .catch((res) => {});
    },
  },
  watch: {
    carInfo() {
      this.priceTableData = [this.carInfo];
      this.getAfterSaleImg();
    },
  },
  filters: {},
  mounted() {
    this.priceTableData = [this.carInfo];
    this.carStatus = this.carInfo.carStatus;
    this.getAfterSaleImg();
  },
};
</script>

<style lang="scss" scoped>
.img-content-box {
  height: 160px;
  margin-bottom: 15px;
}
.image-item {
  border: 6px solid #ebeef5;
  padding: 3px;
  width: 80%;
  min-height: 100px;
}
</style>