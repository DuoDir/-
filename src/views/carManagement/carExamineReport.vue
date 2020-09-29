// 车辆检测报告
<template>
  <div class="carExamineReport">

    <div class="title">长城二手车检测报告</div>
    <div class="rightDate">检测时间：{{reportType==1?carBaseInfo.preliminaryTime:carBaseInfo.valuationTime}}</div>
    <el-divider></el-divider>
    <VerticalTable v-if="isShowTable" :tableData="carBaseInfo" :tableKeys="infoTableKeys" :columnsNum="4"></VerticalTable>
    <!-- 25项手续核查 -->
    <div class="titleBlack">
      <div class="titleBorder">25项手续核查</div>
    </div>
    <div class="fontBord">车辆信息</div>
    <VerticalTable v-if="isShowTable" :tableData="carBaseInfo" :tableKeys="carTableKeys" :columnsNum="4"></VerticalTable>
    <div class="fontBord">手续信息</div>
    <VerticalTable v-if="isShowTable" :tableData="carBaseInfo" :tableKeys="procedureTableKeys" :columnsNum="4"></VerticalTable>
    <!-- 156项专业检测 -->
    <div class="titleBlack">
      <div class="titleBorder">{{totalProject}}项专业检测</div>
    </div>
    <div class="grayBlock">
      <el-row>
        <template v-for="oneItem in oneListResult">
          <el-col class="fontsize20" :span="oneItem.id==3?12:6" :key="oneItem.id">
            {{oneItem.itemName}}
            <el-row style="margin-top:10px">
              <template v-for="twoItem in twoListResult">
                <el-col class="columnBlock" :span="twoItem.pareneId==3?12:24" :key="twoItem.id" v-if="twoItem.pareneId==oneItem.id">
                  <div class="textBlock">{{twoItem.itemName}}</div>
                  <div class="iconBlock">{{twoItem.childNums}}项<img class="iconIsRight" :src="twoItem.countBad==0?rightIcon:wrongIcon" /></div>
                </el-col>
              </template>
            </el-row>
          </el-col>
        </template>
        <el-col :span="24">
          <el-input class="prefixInput" v-if="isShowTable" v-model="reportData.reportComment.commentReport" readonly>
            <span slot="prefix">评估师评语：</span>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <template v-for="item in twoListResult">
      <div class="blockItme" :key="item.id">
        <div class="titleLine">{{item.itemName}}</div>
        <div style="border: 0.5px solid #ebeef5;" v-if="[4,5,9,10,11,12,13].includes(item.id)">
          <table class="table-vertical">
            <tr v-for="index in item.rowNum" :key="index">
              <td class="column">{{item.children[2*index-2].itemNameAndDetail}}</td>
              <td class="colWidth"><img class="iconIsRight" :src="item.children[2*index-2].assessment==1?rightIcon:wrongIcon" /></td>
              <td class="column" v-if="item.children[2*index-1]">{{item.children[2*index-1].itemNameAndDetail}}</td>
              <td class="colWidth" v-if="item.children[2*index-1]"><img class="iconIsRight" :src="item.children[2*index-1].assessment==1?rightIcon:wrongIcon" /></td>
            </tr>
          </table>
        </div>
        <!-- 事故车排查 -->
        <el-row v-if="[6].includes(item.id)">
          <el-col :span="10">
            <span class="purpleColor">重大事故检测：</span>
            <span class="fontsize15">共{{item.children.length}}个检测点</span>
          </el-col>
          <el-col :span="14"><span class="purpleColor" style="font-weight:600">排除重大碰撞</span></el-col>
          <el-col :span="10">
            <div class="carImagesBox">
              <img class="carImages" :src="accidentImageSrc" />
            </div>
            <div class="imageRemark">
              <i class="emptyCicle"></i>
              <span>实现圈表示为检测点</span>
              <span style="margin-left:16px">
                <i class="solidCicle"></i>
                <span>实心点表示为瑕疵点</span>
              </span>
            </div>
          </el-col>
          <el-col :span="14" style="margin-bottom: 70px;">
            {{item.children.length}}
            <table class="table-vertical">
              <thead class="tableHeader">
                <tr>
                  <td style="width:40px">编号</td>
                  <td>检查项</td>
                  <td>结果</td>
                  <td style="width:40px">编号</td>
                  <td>检查项</td>
                  <td>结果</td>
                </tr>
              </thead>
              <tr v-for="index in 7" :key="index">
                <td>{{index}}</td>
                <td>{{item.children[index-1].itemNameAndDetail}}</td>
                <td class="colWidth"><img class="iconIsRight" :src="item.children[index-1].assessment==1?rightIcon:wrongIcon" /></td>
                <td>{{index+7}}</td>
                <td v-if="item.children[index+6]">{{item.children[index+6].itemNameAndDetail}}</td>
                <td class="colWidth" v-if="item.children[index+6]"><img class="iconIsRight" :src="item.children[index+6].assessment==1?rightIcon:wrongIcon" /></td>
              </tr>
            </table>
          </el-col>
          <el-col :span="24">
            <table class="table-vertical">
              <thead class="tableHeader">
                <tr>
                  <td style="width:40px">编号</td>
                  <td>检查项</td>
                  <td>结果</td>
                  <td style="width:40px">编号</td>
                  <td>检查项</td>
                  <td>结果</td>
                </tr>
              </thead>
              <tr v-for="index in 8" :key="index">
                <td>{{index+14}}</td>
                <td>{{item.children[index+13].itemNameAndDetail}}</td>
                <td class="colWidth"><img class="iconIsRight" :src="item.children[index+13].assessment==1?rightIcon:wrongIcon" /></td>
                <td>{{index+14+8}}</td>
                <td v-if="item.children[index+14+7]">{{item.children[index+14+7].itemNameAndDetail}}</td>
                <td class="colWidth" v-if="item.children[index+14+7]"><img class="iconIsRight" :src="item.children[index+14+7].assessment==1?rightIcon:wrongIcon" /></td>
              </tr>
            </table>
          </el-col>
        </el-row>
        <el-row v-if="[7].includes(item.id)">
          <el-col :span="24">
            <span class="purpleColor">车身外观检测：</span>
            <span class="fontsize15">共包含{{item.children.length}}个检测点</span>
          </el-col>
          <el-col :span="10">
            <div class="carImagesBox">
              <img class="carImages" :src="carBodyImageSrc" />
            </div>
            <div class="imageRemark">
              <i class="emptyCicle"></i>
              <span>实现圈表示为检测点</span>
              <span style="margin-left:16px">
                <i class="solidCicle"></i>
                <span>实心点表示为瑕疵点</span>
              </span>
            </div>
          </el-col>
          <el-col :span="14" style="margin-bottom: 70px;">
            <table class="table-vertical">
              <thead class="tableHeader">
                <tr>
                  <td style="width:40px">编号</td>
                  <td>检查项</td>
                  <td>结果</td>
                  <td style="width:40px">编号</td>
                  <td>检查项</td>
                  <td>结果</td>
                </tr>
              </thead>
              <tr v-for="index in 9" :key="index">
                <td>{{index}}</td>
                <td>{{item.children[index-1].itemNameAndDetail}}</td>
                <td class="colWidth"><img class="iconIsRight" :src="item.children[index-1].assessment==1?rightIcon:wrongIcon" /></td>
                <td>{{index+9}}</td>
                <td v-if="item.children[index+8]">{{item.children[index+8].itemNameAndDetail}}</td>
                <td class="colWidth" v-if="item.children[index+8]"><img class="iconIsRight" :src="item.children[index+8].assessment==1?rightIcon:wrongIcon" /></td>
              </tr>
            </table>
          </el-col>
          <el-col :span="24">
            <table class="table-vertical">
              <thead class="tableHeader">
                <tr>
                  <td style="width:40px">编号</td>
                  <td>检查项</td>
                  <td>结果</td>
                  <td style="width:40px">编号</td>
                  <td>检查项</td>
                  <td>结果</td>
                  <td style="width:40px">编号</td>
                  <td>检查项</td>
                  <td>结果</td>
                </tr>
              </thead>
              <tr v-for="index in 7" :key="index">
                <td>{{index+18}}</td>
                <td>{{item.children[index+17].itemNameAndDetail}}</td>
                <td class="colWidth"><img class="iconIsRight" :src="item.children[index+17].assessment==1?rightIcon:wrongIcon" /></td>
                <td>{{index+18+7}}</td>
                <td v-if="item.children[index+17+7]">{{item.children[index+17+7].itemNameAndDetail}}</td>
                <td class="colWidth" v-if="item.children[index+17+7]"><img class="iconIsRight" :src="item.children[index+17+7].assessment==1?rightIcon:wrongIcon" /></td>
                <td>{{index+18+15}}</td>
                <td v-if="item.children[index+17+14]">{{item.children[index+17+14].itemNameAndDetail}}</td>
                <td class="colWidth" v-if="item.children[index+17+14]"><img class="iconIsRight" :src="item.children[index+17+14].assessment==1?rightIcon:wrongIcon" /></td>
              </tr>
            </table>
          </el-col>
        </el-row>
        <el-row v-if="[8].includes(item.id)">
          <el-col :span="24">
            <span class="purpleColor">车辆内饰检测：</span>
            <span class="fontsize15">共包含{{item.children.length}}个检测点</span>
          </el-col>
          <el-col :span="10">
            <div class="carImagesBox">
              <img class="carImages" :src="caInnerImageSrc" />
            </div>
            <div class="imageRemark">
              <i class="emptyCicle"></i>
              <span>实现圈表示为检测点</span>
              <span style="margin-left:16px">
                <i class="solidCicle"></i>
                <span>实心点表示为瑕疵点</span>
              </span>
            </div>
          </el-col>
          <el-col :span="14" style="margin-bottom: 70px;">
            <table class="table-vertical">
              <thead class="tableHeader">
                <tr>
                  <td style="width:40px">编号</td>
                  <td>检查项</td>
                  <td>结果</td>
                  <td style="width:40px">编号</td>
                  <td>检查项</td>
                  <td>结果</td>
                </tr>
              </thead>
              <tr v-for="index in 9" :key="index">
                <td>{{index}}</td>
                <td>{{item.children[index-1].itemNameAndDetail}}</td>
                <td class="colWidth"><img class="iconIsRight" :src="item.children[index-1].assessment==1?rightIcon:wrongIcon" /></td>
                <td>{{index+9}}</td>
                <td v-if="item.children[index+8]">{{item.children[index+8].itemNameAndDetail}}</td>
                <td class="colWidth" v-if="item.children[index+8]"><img class="iconIsRight" :src="item.children[index+8].assessment==1?rightIcon:wrongIcon" /></td>
              </tr>
            </table>
          </el-col>
          <el-col :span="24">
            <table class="table-vertical">
              <thead class="tableHeader">
                <tr>
                  <td>编号</td>
                  <td>检查项</td>
                  <td>结果</td>
                </tr>
              </thead>
              <tr>
                <td>19</td>
                <td>{{item.children[18].itemNameAndDetail}}</td>
                <td><img class="iconIsRight" :src="item.children[18].assessment==1?rightIcon:wrongIcon" /></td>
              </tr>
            </table>
          </el-col>
        </el-row>
      </div>
    </template>

  </div>
</template>

<script type="text/javascript" defer=true>
import VerticalTable from "@/components/carManagement/VerticalTable";
let canvas;
export default {
  props: {
    id: String,
    type: Number,
  },
  components: {
    VerticalTable,
  },
  data() {
    return {
      carId: "", //车辆ID
      reportType: "", //检测状态 1：初检；2：复检 ；3：验收 。
      reportData: {}, //报告信息
      carBaseInfo: {}, //车辆基本信息
      oneListResult: [], //一级项目
      twoListResult: [], //二级项目
      threeListResult: [], //三级项目
      totalProject: "", //检测项总数
      projectPostion: "", //坐标数据
      rightIcon: require("@/assets/images/icon_right@3x.png"),
      wrongIcon: require("@/assets/images/icon_wrong@3x.png"),
      accidentImageSrc: "", //事故
      carBodyImageSrc: "", //车身
      caInnerImageSrc: "", //车内饰
      isShowTable: false,
      infoTableKeys: [
        { prop: "brand", title: "厂牌" },
        { prop: "brandModel", title: "型号" },
        { prop: "modelName", title: "车型" },
        { prop: "vin", title: "VIN" },
      ],
      carTableKeys: [
        { prop: "engineNumber", title: "发动机号" },
        { prop: "emissionStandard", title: "排放标准" },
        { prop: "displacement", title: "排量" },
        { prop: "outDate", title: "出厂年月" },
        { prop: "gearbox", title: "变速箱类型" },
        { prop: "color", title: "颜色" },
        { prop: "mileage", title: "表里里程" },
        { prop: "", title: "" },
      ],
      procedureTableKeys: [
        { prop: "carOwnerInfo", title: "车主信息" },
        { prop: "carNo", title: "车牌号" },
        { prop: "carProvince", title: "车辆归属地" },
        { prop: "transferTimes", title: "过户次数" },
        { prop: "keyNum", title: "车钥匙" },
        { prop: "driving", title: "行驶证" },
        { prop: "certificate", title: "登记证书" },
        { prop: "hangTime", title: "初次登记日期" },
        { prop: "useType", title: "使用性质" },
        { prop: "legal", title: "合法状态" },
        { prop: "scrappingStandard", title: "报废标准" },
        { prop: "buyTax", title: "购置税" },
        { prop: "violation", title: "违章情况" },
        { prop: "upInsurance", title: "出险记录" },
        { prop: "maintenance", title: "维保记录" },
        { prop: "inspectionDate", title: "年检有效期" },
        { prop: "compulsoryInsuranceDate", title: "交强险有效期" },
        { prop: "carNetworkDate", title: "互联网有效期" },
        { prop: "", title: "" },
        { prop: "", title: "" },
      ],
    };
  },
  mounted() {
    this.carId = this.$route.query.carId || this.id || 117;
    this.reportType = this.$route.query.reportType || this.type || 2;
    this.findItemAndCarBaseInfoByTypeAndCarId(); //通过订单id获取订单信息
    this.carExamineProject(); //获取坐标点
  },
  methods: {
    initCanvas() {
      for (let i = 0; i < this.twoListResult.length; i++) {
        this.totalProject =
          Number(this.totalProject) + Number(this.twoListResult[i].childNums);
        if (this.twoListResult[i].id == 6) {
          this.accidentCarImage(this.twoListResult[i]);
        }
        if (this.twoListResult[i].id == 7) {
          this.carBodyImage(this.twoListResult[i]);
        }
        if (this.twoListResult[i].id == 8) {
          this.carInnerImage(this.twoListResult[i]);
        }
      }
    },
    carExamineProject() {
      this.$axios.get(this.pathItem.carExamineProject).then((res) => {
        this.projectPostion = res;
      });
    },
    //事故车
    accidentCarImage(project) {
      let _this = this;
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let img = new Image();
      let pot = this.projectPostion.accidentCar;
      img.src = require("@/assets/images/img_chenei@3x.png");
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0); //画图（与图片等宽高）

        // 画圈
        if (project.badChildlist.length) {
          project.badChildlist.map((item) => {
            ctx.beginPath();
            ctx.arc(
              pot["position_x_" + item.id],
              pot["position_y_" + item.id],
              26,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = "rgba(175,59,30,1)";
            ctx.fill();
          });
        }
        _this.accidentImageSrc = canvas.toDataURL("image/jpg");
      };
    },
    //车身
    carBodyImage(project) {
      let _this = this;
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let pot = this.projectPostion.carBody;
      let img = new Image();
      img.src = require("@/assets/images/img_chewai@3x.png");
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0); //画图（与图片等宽高）
        // 画圈
        if (project.badChildlist.length) {
          project.badChildlist.map((item) => {
            ctx.beginPath();
            ctx.arc(
              pot["position_x_" + item.id],
              pot["position_y_" + item.id],
              22,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = "rgba(175,59,30,1)";
            ctx.fill();
          });
        }
        _this.carBodyImageSrc = canvas.toDataURL("image/jpg");
      };
    },
    //车内饰
    carInnerImage(project) {
      let _this = this;
      let pot = this.projectPostion.carInner;
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let img = new Image();
      img.src = require("@/assets/images/img_neishi@3x.png");
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0); //画图（与图片等宽高）
        // 画圈
        if (project.badChildlist.length) {
          project.badChildlist.map((item) => {
            ctx.beginPath();
            ctx.arc(
              pot["position_x_" + item.id],
              pot["position_y_" + item.id],
              26,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = "rgba(175,59,30,1)";
            ctx.fill();
          });
        }
        _this.caInnerImageSrc = canvas.toDataURL("image/jpg");
      };
    },

    // 通过订单id获取订单信息
    findItemAndCarBaseInfoByTypeAndCarId() {
      const loading = this.$loading({
        target: document.querySelector(".carExamineReport"), //loading需要覆盖的DOM节点，默认为body
      });
      let params = {
        carId: this.carId,
        reportType: this.reportType, //请求项目的类型。1：初检；2：复检 ；3：验收 。
      };
      let _this = this;
      this.$axios
        .post(this.pathItem.findItemAndCarBaseInfoByTypeAndCarId, params)
        .then((res) => {
          if (res.code == 0) {
            this.reportData = res.result;
            this.carBaseInfo = this.reportData.carBaseInfo;

            this.oneListResult = this.reportData.oneList_result;
            this.twoListResult = this.reportData.twoList_result;
            this.threeListResult = this.reportData.threeList_result;

            this.formatTableData();
          } else {
            this.$alert(res.message, "提示", {
              confirmButtonText: "确定",
              type: "warning",
            });
          }
          loading.close();
        });
    },
    formatTableData() {
      let emissionStandardList = {
        status_1: "国I",
        status_2: "国II",
        status_3: "国III",
        status_4: "国IV",
        status_5: "国V",
        status_6: "国VI",
        status_7: "其他",
      };
      let gearboxStatus = {
        status_1: "自动",
        status_2: "手动",
      };
      let colorList = {
        status_1: "黑色",
        status_2: "红色",
        status_3: "白色",
        status_4: "蓝色",
        status_5: "黄色",
        status_6: "绿色",
        status_7: "银色",
        status_8: "深灰色",
        status_9: "香槟色",
        status_10: "彩色",
      };
      let useTypeList = {
        status_1: "营运",
        status_2: "非营运",
        status_3: "营转非",
      };
      let legalStatus = {
        status_1: "合法",
        status_2: "不合法",
      };
      let scrappingStatus = {
        status_1: "是",
        status_2: "否",
      };
      let buyTaxStatus = {
        status_1: "有",
        status_2: "无",
      };
      let upInsuranceStauts = {
        status_1: "已核查",
        status_2: "未核查",
      };
      this.carBaseInfo.outDate = this.carBaseInfo.outDate
        ? this.formatDate(this.carBaseInfo.outDate, "yyyy年MM月")
        : "";
      this.carBaseInfo.preliminaryTime = this.carBaseInfo.preliminaryTime
        ? this.formatDate(this.carBaseInfo.preliminaryTime, "yyyy年MM月dd日 ")
        : "";
      this.carBaseInfo.valuationTime = this.carBaseInfo.valuationTime
        ? this.formatDate(this.carBaseInfo.valuationTime, "yyyy年MM月dd日 ")
        : "";
        this.carBaseInfo.inspectionDate = this.carBaseInfo.inspectionDate
        ? this.formatDate(this.carBaseInfo.inspectionDate, "yyyy年MM月 ")
        : "";
        this.carBaseInfo.compulsoryInsuranceDate = this.carBaseInfo.compulsoryInsuranceDate
        ? this.formatDate(this.carBaseInfo.compulsoryInsuranceDate, "yyyy年MM月 ")
        : "";
        this.carBaseInfo.carNetworkDate = this.carBaseInfo.carNetworkDate
        ? this.formatDate(this.carBaseInfo.carNetworkDate, "yyyy年MM月 ")
        : "";
      this.carBaseInfo.emissionStandard =
        emissionStandardList["status_" + this.carBaseInfo.emissionStandard];
      this.carBaseInfo.gearbox =
        gearboxStatus["status_" + this.carBaseInfo.gearbox];
      this.carBaseInfo.color = colorList["status_" + this.carBaseInfo.color];
      this.carBaseInfo.useType =
        useTypeList["status_" + this.carBaseInfo.useType];
      this.carBaseInfo.legal = legalStatus["status_" + this.carBaseInfo.legal];
      this.carBaseInfo.scrappingStandard =
        scrappingStatus["status_" + this.carBaseInfo.scrappingStandard];
      this.carBaseInfo.buyTax =
        buyTaxStatus["status_" + this.carBaseInfo.buyTax];
      this.carBaseInfo.upInsurance =
        upInsuranceStauts["status_" + this.carBaseInfo.upInsurance];
      this.carBaseInfo.violation =
        buyTaxStatus["status_" + this.carBaseInfo.violation];

      this.twoListResult.map((item, index) => {
        let badList = [];
        let obj = this.threeListResult.filter((child) => {
          if (child.parentId == item.id) {
            if (child.assessment == 2) {
              badList.push(child);
            }
            return child;
          }
        });
        item.badChildlist = badList;
        item.children = obj;
        item.rowNum = Math.round(obj.length / 2);
      });
      this.isShowTable = true;
      this.initCanvas();
    },
    formatTopVal(val) {
      return this.carBaseInfo[val];
    },
  },
};
</script>

<style lang="scss" scoped>
.carExamineReport {
  padding: 70px;
  background-color: #fff;
  color: #232931;
  .title {
    font-size: 35px;
    font-weight: 500;
    text-align: center;
    letter-spacing: 2px;
  }
  .titleBlack {
    width: 315px;
    height: 44px;
    line-height: 44px;
    margin: 44px auto 33px;
    color: #fff;
    font-size: 24px;
    font-weight: 500;
    text-align: center;
    background-color: #5335e1;
    letter-spacing: 2px;
    position: relative;
    &::after {
      content: "";
      border: 2px solid #5335e1;
      position: absolute;
      top: 5px;
      height: 41px;
      width: 312px;
      left: 5px;
    }
  }
  .titleLine {
    background: #f5f3ff;
    margin: 40px auto 20px;
    height: 44px;
    line-height: 44px;
    padding-left: 20px;
    color: #5335e1;
    font-size: 20px;
    font-weight: 600;
    position: relative;
    &::after {
      content: "";
      height: 24px;
      width: 5px;
      background: #5335e1;
      position: absolute;
      left: 10px;
      top: 10px;
    }
  }
  .fontsize15 {
    font-size: 15px;
    font-weight: 400;
  }
  .purpleColor {
    color: #5335e1;
    line-height: 40px;
    font-size: 15px;
  }
  .rightDate {
    text-align: right;
    padding: 25px 90px 0px;
  }
  .fontBord {
    font-weight: 600;
    margin-bottom: 10px;
    margin-top: 36px;
  }
  .grayBlock {
    margin-top: 54px;
    padding: 24px 18px;
    background: #fafafa;
    border: 1px solid #e8e8e8;
    .fontsize20 {
      font-size: 20px;
      font-weight: 600;
      padding-bottom: 6px;
    }

    .columnBlock {
      margin-top: 10px;
      font-size: 15px;
      font-weight: 400;
      div {
        display: inline-block;
        width: 90px;
        &.iconBlock {
          width: 90px;
          text-align: right;
        }
      }
    }
  }

  img.iconIsRight {
    width: 15px;
    height: 15px;
    margin-left: 10px;
    vertical-align: text-top;
  }
  .carImagesBox {
    margin-top: 30px;
    padding-right: 30px;
    position: relative;
    img.carImages {
      width: 100%;
    }
  }
  .imageRemark {
    text-align: center;
    margin-top: 40px;
    .emptyCicle {
      border: 1px solid #53d6c4;
      width: 21px;
      height: 21px;
      display: inline-block;
      border-radius: 11px;
      vertical-align: top;
    }
  }
  .solidCicle {
    background: #af3b1e;
    width: 21px;
    height: 21px;
    display: inline-block;
    border-radius: 11px;
    vertical-align: top;
  }
  .prefixInput {
    margin-top: 20px;
    /deep/ .el-input__inner {
      padding-left: 110px;
    }
    /deep/ .el-input__prefix {
      font-size: 15px;
      color: #232931;
      line-height: 40px;
      margin-left: 10px;
    }
  }
  .table-vertical {
    border-collapse: collapse;
    width: 100%;
    .tableHeader {
      background: #fafafa;
    }
    tr {
      td {
        border: 0.5px solid #ebeef5;
        text-align: center;
        // width: 10%;
        padding: 10px;
        &.column {
          background: #f5f7fa;
          width: 40%;
        }
        &.colWidth {
          width: 10%;
        }
        img {
          width: 15px;
          height: 15px;
        }
      }
    }
  }
}
</style>