<template>
  <div class="carSellPriceInfo">
    <table class="table-vertical" style="width: 100%">
      <tr v-for="index in 3" :key="index">
        <td class="column">{{ detailTableKeys[index * 3 - 3].title }}</td>
        <td>{{ formatTopVal(detailTableKeys[index * 3 - 3].prop) }}</td>
        <td class="column">{{ detailTableKeys[index * 3 - 2].title }}</td>
        <td>{{ formatTopVal(detailTableKeys[index * 3 - 2].prop) }}</td>
        <td class="column">{{ detailTableKeys[index * 3 - 1].title }}</td>
        <td>{{ formatTopVal(detailTableKeys[index * 3 - 1].prop) }}</td>
      </tr>
      <tr>
        <td class="column">备注</td>
        <td colspan="5">
          {{ formatTopVal("bak") }}
        </td>
      </tr>
    </table>
    <div class="subHead" style="margin-top: 30px">照片信息</div>
    <el-row :gutter="5">
      <div>新行驶证：<span v-if="carDriverList.length <= 0">无</span></div>
      <el-col
        v-for="(image, index) in carDriverList"
        :key="index"
        :span="3"
        class="cardetail-box"
      >
        <el-image class="image-item" :src="image.url"></el-image>
      </el-col>
    </el-row>
    <el-row :gutter="5" style="margin-top:20px;">
      <el-col :span="8">
        <div>新车主身份证（人物）：<span v-if="newOwnerFrontList.length <= 0">无</span></div>
        <el-col
          v-for="(image, index) in newOwnerFrontList"
          :key="index"
          :span="12"
          class="cardetail-box"
        >
          <el-image class="image-item" :src="image.url"></el-image>
        </el-col>
      </el-col>
      <el-col :span="8">
        <div>新车主身份证（国徽）：<span v-if="newOwnerBakList.length <= 0">无</span></div>
        <el-col
          v-for="(image, index) in newOwnerBakList"
          :key="index"
          :span="12"
          class="cardetail-box"
        >
          <el-image class="image-item" :src="image.url"></el-image>
        </el-col>
      </el-col>
    </el-row>
    <el-row :gutter="5" style="margin-top:20px;">
      <div>二手车交易发票: <span v-if="newOwnerFrontList.length <= 0">无</span></div>
      <el-col
        v-for="(image, index) in carTransInvoiceList"
        :key="index"
        :span="3"
        class="cardetail-box"
      >
        <el-image class="image-item" :src="image.url"></el-image>
      </el-col>
    </el-row>
     <el-row :gutter="5" style="margin-top:20px;">
      <div>二手车交易合同: <span v-if="carTradingContractList.length <= 0">无</span></div>
      <el-col
        v-for="(image, index) in carTradingContractList"
        :key="index"
        :span="3"
        class="cardetail-box"
      >
        <el-image v-if="!checkPdf(image.url)" class="image-item" :src="image.url"></el-image>
           <a v-if="checkPdf(image.url)" style="color:#409EFF" :href="image.url" target="_blank">二手车交易合同</a>
      </el-col>
    </el-row>
     <el-row :gutter="5" style="margin-top:20px;">
      <div>二手车质保合同: <span v-if="carQualityContractList.length <= 0">无</span></div>
      <el-col
        v-for="(image, index) in carQualityContractList"
        :key="index"
        :span="3"
        class="cardetail-box"
      >
        <el-image v-if="!checkPdf(image.url)" class="image-item" :src="image.url"></el-image>
        <a v-if="checkPdf(image.url)" style="color:#409EFF" :href="image.url" target="_blank">二手车质保合同</a>
      </el-col>
    </el-row>
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
      detailTableKeys: [
        {
          prop: "oldOwner",
          title: "原车主姓名",
        },
        {
          prop: "oldPhone",
          title: "原车主电话",
        },
        {
          prop: "oldCarNo",
          title: "原车牌号",
        },
        {
          prop: "newOwner",
          title: "新车主姓名",
        },
        {
          prop: "newPhone",
          title: "新车主电话",
        },
        {
          prop: "newCarNo",
          title: "新车牌号",
        },
        {
          prop: "transferLocation",
          title: "过户区域",
        },

        {
          prop: "salePerson",
          title: "销售顾问",
        },
        {
          prop: "transferPerson",
          title: "过户专员",
        },
        {
          prop: "bak",
          title: "备注",
        },
      ],
      carDriverList: [],
      newOwnerFrontList: [],
      newOwnerBakList: [],
      carTransInvoiceList: [],
      carTradingContractList: [],
      carQualityContractList: [],
    };
  },
  methods: {
    getSalesTable() {
      this.$axios
        .post(this.pathItem.carTransferInfoByCarId, {
          carId: this.carInfo.id,
        })
        .then((res) => {
          if (res.code == 0) {
            if (res.result) {
              this.tableData = res.result;
            }
          }
        });
    },
    getAllPic() {
      this.$axios
        .post(this.pathItem.getFileListByMainKeyAndTypeList, {
          mainKey: this.carInfo.id,
          typeFile: ["501", "502", "503", "504", "505", "506"],
        })
        .then((res) => {
          if (res.code == 0) {
            res.result.forEach((element) => {
              if (element.typeFile == 501) {
                this.carDriverList.push(element);
              }
              if (element.typeFile == 502) {
                this.carTransInvoiceList.push(element);
              }
              if (element.typeFile == 503) {
                this.newOwnerFrontList.push(element);
              }
              if (element.typeFile == 504) {
                this.newOwnerBakList.push(element);
              }
              if (element.typeFile == 505) {
                this.carTradingContractList.push(element);
              }
              if (element.typeFile == 506) {
                this.carQualityContractList.push(element);
              }
            });
          }
        });
    },
    formatTopVal(val) {
      if (val == "transferLocation") {
        if (this.tableData[val] == 1) {
          return "本地";
        }
        if (this.tableData[val] == 2) {
          return "外迁";
        }
      }
      return this.tableData[val] ? this.tableData[val] : "--";
    },
    checkPdf(url){
      if(url.indexOf(".pdf") > -1 || url.indexOf(".PDF") > -1){
        return true
      }else{
        return false
      }
    }
  },
  mounted() {
    this.getSalesTable();
    this.getAllPic();
  },
};
</script>