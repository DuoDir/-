<template>
  <div class="assessDetail">
    <!-- 评估信息 -->
    <el-header class="header">
      <span>{{carInfo.carStatus == 1 ?'评估详情':'车辆详情'}}</span>
    </el-header>
    <!-- 车主信息 -->
    <el-main style="padding-bottom: 15px;">
      <el-row class="main-content">
        <el-row>
          <el-col :span="7" v-if="carInfo.compileStatus == 1  && salesImgList.length > 0">
            <!-- swiper1 -->
            <swiper class="swiper gallery-top" :options="swiperOptionTop" ref="swiperTop">
              <swiper-slide class="slide-1" v-for="item in salesImgList" :key="item.id">
                <img :src="item.url" style="width:100%" />
              </swiper-slide>
              <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
              <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
            </swiper>
            <!-- swiper2 Thumbs -->
            <swiper class="swiper gallery-thumbs" :options="swiperOptionThumbs" ref="swiperThumbs">
              <swiper-slide class="slide-1" v-for="item in salesImgList" :key="item.id">
                <img :src="item.url" />
              </swiper-slide>
            </swiper>
          </el-col>
          <el-col :span="17">
            <div class="content-top">
              <p class="title">
                <span>{{`${carInfo.brandName}${carInfo.seriesName}${carInfo.modelName}`}}</span>
                <img v-if="carInfo.certifiedStatus > 8" src="@/assets/images/renzheng@2x.png" />
                <img v-if="carInfo.certifiedStatus == 6" src="@/assets/images/yishixiao@2x.png" />
                <small class="color-blue" v-if="carInfo.certifiedStatus > 8" @click="goReport" style="font-weight:400;">下载认证证书</small>
              </p>
              <p class="color-gray">
                <span style="margin-right:20px;">编号：{{carInfo.carNumber}}</span>
                <span style="margin-right:20px;">录入时间：{{carInfo.createdAt}}</span>
                <span>录入人：{{carInfo.createdName}}</span>
              </p>
            </div>
            <ul class="content-center">
              <li>
                <p>{{carInfo.registeredDate}}</p>
                <p class="color-gray">首次上牌</p>
              </li>
              <li class="center-line"></li>
              <li>
                <p>{{(carInfo.mileage/10000).toFixed(2)}}万公里</p>
                <p class="color-gray">行驶里程</p>
              </li>
              <li class="center-line"></li>
              <li>
                <p>{{(carInfo.provinceName ?carInfo.provinceName :"")  + (carInfo.cityName ?carInfo.cityName :"")}}</p>
                <p class="color-gray">车牌注册地</p>
              </li>
              <li class="center-line"></li>
              <li>
                <p>{{formatEmission(carInfo.emissionStandard)}}</p>
                <p class="color-gray">排放标准</p>
              </li>
              <li class="center-line"></li>
              <li>
                <p>{{formatColor(carInfo.color)}}</p>
                <p class="color-gray">车辆颜色</p>
              </li>
            </ul>
          </el-col>
        </el-row>

        <el-row class="main-content">
          <div v-if="carInfo.operateTypeList && carInfo.operateTypeList.length">
            <div class="subHead">时间节点</div>
            <el-steps
              :active="carInfo.operateTypeList[carInfo.operateTypeList.length - 1]"
              align-center
              process-status="finish"
              finish-status="success"
            >
              <el-step
                v-for="(item,index) in timeNodes"
                :key="index"
                :title="item.title"
                :description="item.description"
              ></el-step>
            </el-steps>
          </div>
        </el-row>
        <el-row class="main-content">
          <el-tabs v-model="activeTabName" type="card" @tab-click="handleClickTabs">
            <el-tab-pane label="车辆信息" name="carInfo"></el-tab-pane>
            <el-tab-pane label="照片信息" name="photoInfo"></el-tab-pane>
            <el-tab-pane label="评估信息" name="assessInfo"></el-tab-pane>
            <el-tab-pane v-if="carInfo.workStatus" label="整备信息" name="hostlingInfo"></el-tab-pane>
            <el-tab-pane v-if="carInfo.priceStatus" label="销售定价信息" name="sellPriceInfo"></el-tab-pane>
            <el-tab-pane label="检测报告" name="testReportInfo"></el-tab-pane>
            <el-tab-pane v-if="carInfo.workStatus > 5" label="验收报告" name="reportInfo"></el-tab-pane>
            <el-tab-pane v-if="carInfo.carStatus == 6" label="销售过户" name="transInfo"></el-tab-pane>
            <el-tab-pane label="订单信息" v-if="carInfo.orderStatus == 9" name="carOrderInfo"></el-tab-pane>
            <el-tab-pane label="操作日志" name="operationInfo"></el-tab-pane>
          </el-tabs>
          <CarDetails v-if="activeTabName=='carInfo'" :carInfo="carInfo"></CarDetails>
          <CarPhotoList v-if="activeTabName=='photoInfo'" :carInfo="carInfo"></CarPhotoList>
          <CarAssessInfo v-if="activeTabName=='assessInfo'" :carInfo="carInfo"></CarAssessInfo>

          <CarHostlingInfo v-if="activeTabName=='hostlingInfo'" :carInfo="carInfo"></CarHostlingInfo>
          <CarSellPriceInfo v-if="activeTabName=='sellPriceInfo'" :carInfo="carInfo"></CarSellPriceInfo>
          <CarOperationLog v-if="activeTabName=='operationInfo'" :carInfo="carInfo"></CarOperationLog>
          <carExamineReport v-if="activeTabName=='testReportInfo'" :id="carInfo.id" :type="carInfo.reportStatusLable > 2 ? 2 : carInfo.reportStatusLable"></carExamineReport>
          <carExamineReport v-if="activeTabName=='reportInfo'" :id="carInfo.id" :type="3"></carExamineReport>
          <CarSellTrans v-if="activeTabName=='transInfo'" :carInfo="carInfo"></CarSellTrans>
          <CarOrderInfo v-if="activeTabName=='carOrderInfo'" :carInfo="carInfo"></CarOrderInfo>
        </el-row>
      </el-row>
    </el-main>
  </div>
</template>

<script>
/*********************************************************************************************
 **                                 车辆详情方法说明
 ** @function getCarInfo() 获取车辆详情
 ** @function formatColor() 车颜色格式化
 ** @function formatEmission() 车环保类型格式化
 ** @function handleClickTabs() tab标签切换
 ** @function operationAssessWindow(type) 保存评估信息 @param type：0关闭  1保存
 ** @function validatorAssessInfo() 验证评估信息必填
 ** @function getSalesImg() 获取销售照片
 ** @function goReport() 下载认证证书
 *
 *
 *********************************************************************************************/
import CarDetails from "@/components/carManagement/CarDetails"; //车辆信息
import CarPhotoList from "@/components/carManagement/CarPhotoList"; //照片信息
import CarAssessInfo from "@/components/carManagement/CarAssessInfo"; //评估信息
import CarOperationLog from "@/components/carManagement/CarOperationLog"; //操作日志
import CarHostlingInfo from "@/components/carManagement/CarHostlingInfo"; //整备信息
import CarSellPriceInfo from "@/components/carManagement/CarSellPriceInfo";
import carExamineReport from "./carExamineReport"; //检测报告，验收报告
import CarSellTrans from "@/components/carManagement/carSellTrans"; //过户详情
import CarOrderInfo from "@/components/carManagement/carOrderInfo"; //订单信息

import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
export default {
  components: {
    CarDetails,
    CarPhotoList,
    CarAssessInfo,
    CarOperationLog,
    CarHostlingInfo,
    CarSellPriceInfo,
    carExamineReport,
    CarSellTrans,
    CarOrderInfo,
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      swiperOptionTop: {
        loop: true,
        loopedSlides: 5, // looped slides should be the same
        spaceBetween: 10,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
      swiperOptionThumbs: {
        loop: true,
        loopedSlides: 5, // looped slides should be the same
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: "auto",
        touchRatio: 0.2,
        slideToClickedSlide: true,
      },
      salesImgList: [],
      id: "",
      fromPage: "assess", //车辆状态  评估状态1 库存状态2
      // 车辆信息
      carInfo: {},
      // 时间节点
      timeNodes: [
        {
          title: "检测录入",
        },
        {
          title: "采购入库",
        },
        {
          title: "上架销售",
        },
        {
          title: "已预订",
        },
        {
          title: "销售成交",
        },
      ],
      activeTabName: "carInfo", //选择tab框

      // 颜色list
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
      // 环保类型list
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
    };
  },
  computed: {},
  mounted() {
    if (this.$route.query.from) {
      this.fromPage = this.$route.query.from;
      this.id = this.$route.query.id;
    }

    // this.getRoleData();

    this.getCarInfo();
  },
  methods: {
    getCarInfo() {
      var params = {
        id: this.id,
      };
      this.$axios
        .post(this.pathItem.findParticularsById, params)
        .then((res) => {
          if (res.code == 0) {
            this.carInfo = res.result;
            if (this.carInfo.carStatus == 2) {
              this.getSalesImg();
            }
            var timeNodes = res.result.operateTypeList;
            timeNodes.forEach((element) => {
              if (element == 1) {
                this.timeNodes[element - 1].description =
                  res.result.lcreatedAt + " " + res.result.loperator;
              }
              if (element == 2) {
                this.timeNodes[element - 1].description =
                  res.result.rcreatedAt + " " + res.result.roperator;
              }
              if (element == 3) {
                this.timeNodes[element - 1].description =
                  res.result.screatedAt + " " + res.result.soperator;
              }
              if (element == 4) {
                this.timeNodes[element - 1].description =
                  res.result.ycreatedAt + " " + res.result.yoperator;
              }
              if (element == 5) {
                this.timeNodes[element - 1].description =
                  res.result.xcreatedAt + " " + res.result.xoperator;
              }
            });
          }
        });
    },
    formatColor(color) {
      for (let index = 0; index < this.colorList.length; index++) {
        const element = this.colorList[index];
        if (element.id == color) {
          return element.label;
        }
      }
    },
    formatEmission(emission) {
      for (let index = 0; index < this.emissionStandardList.length; index++) {
        const element = this.emissionStandardList[index];
        if (element.id == emission) {
          return element.name;
        }
      }
    },
    // 标签选择
    handleClickTabs(val) {},
    // 对话框确认操作   type：0关闭  1保存
    operationAssessWindow(type) {
      let message = "";
      let thenOperation = "";
      if (type == 0) {
        message = "若直接关闭当前窗口，所有信息将不能保存，请再次确认！";
        thenOperation = () => {};
      } else {
        message = "车辆照片、评估信息请于手机端APP继续完善！";
        thenOperation = () => {};
      }
      this.$confirm(message, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(thenOperation)
        .catch(() => {});
    },
    validatorAssessInfo() {
      let isValidator = true;
      let validatorList = [
        {
          index: this.roleName,
          msg: "请输入车主姓名",
        },
      ];
      for (var i in validatorList) {
        if (!validatorList[i].index) {
          isValidator = false;
          this.showMessageBox("error", validatorList[i].msg);
          break;
        }
      }
      return isValidator;
    },
    goReport() {
      this.$router.push({
        path: "/downloadCertificate",
        query: {
          rid: this.carInfo.rid,
        },
      });
    },
    getSalesImg() {
      this.$axios
        .post(this.pathItem.getFileListByTableAndMainKey, {
          tableName: 4,
          mainKey: this.id,
          typeFile: "401",
        })
        .then((res) => {
          if (res.code == 0) {
            this.salesImgList = res.result;
            if (this.salesImgList.length) {
              this.$nextTick(() => {
                const swiperTop = this.$refs.swiperTop.$swiper;
                const swiperThumbs = this.$refs.swiperThumbs.$swiper;
                swiperTop.controller.control = swiperThumbs;
                swiperThumbs.controller.control = swiperTop;
              });
            }
          } else {
            this.salesImgList = [];
          }
        })
        .catch((res) => {
          this.showMessageBox("error", res.message);
        });
    },
    showMessageBox(type, message) {
      this.$message({
        type: type,
        message: message,
        offset: 400,
        duration: 1000,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.assessDetail {
  padding-bottom: 100px;
  .main-content {
    background-color: #fff;
    padding: 15px 30px;
    margin-bottom: 10px;
    font-size: 13px;

    .content-top {
      padding-left: 40px;
      p.title {
        font-size: 18px;
        font-weight: bold;
        img {
          margin-left: 20px;
          margin-right: 20px;
          width: 80px;
          vertical-align: text-bottom;
        }
      }
    }
    ul.content-center {
      li {
        display: inline-block;
        &.center-line {
          width: 1px;
          background-color: #e5e5e5;
          height: 40px;
          margin: auto 15px;
        }
      }
    }
    .price-style {
      margin-left: 10px;
      padding: 5px 10px;
      &.price-active {
        background: #67c23a;
        color: #fff;
        border-radius: 4px;
      }
    }

    .col-width {
      width: 41%;
    }
  }
}

.dialog-footer {
  text-align: center;
}
.thumb-example {
  height: 480px;
  background-color: greenyellow;
}
.swiper {
  .swiper-slide {
    background-size: cover;
    background-position: center;
  }
  &.gallery-top {
    height: 80%;
    width: 100%;
  }
  &.gallery-thumbs {
    height: 50px;
    box-sizing: border-box;
    padding: 10px 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
  &.gallery-thumbs .swiper-slide {
    width: 40px;
    height: 100%;
    opacity: 0.4;
  }
  &.gallery-thumbs .swiper-slide-active {
    opacity: 1;
  }
}
</style>
<style lang="scss">
.table-vertical {
  border-collapse: collapse;
  tr {
    td {
      border: 1px solid #ebeef5;
      text-align: center;
      width: 10%;
      padding: 10px;
      &.column {
        background: #f5f7fa;
      }
    }
  }
}
</style>