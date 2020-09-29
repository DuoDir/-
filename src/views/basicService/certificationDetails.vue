<template>
  <div class="certification-detail">
    <el-header class="header">
      <span>车辆认证详情</span>
    </el-header>
    <el-main style="padding-bottom: 15px">
      <el-row class="main-content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="认证车辆详情" name="certification">
            <el-row :gutter="10">
              <el-col :xs="24" :sm="8" class="certification-left">
                <div class="certification-left-box">
                  <table class="table">
                    <tr>
                      <td class="column">
                        <span>认证状态</span>
                      </td>
                      <td class="colWidth">
                        <span>{{ formatCerStatus(cerStatus) }}</span>
                      </td>
                      <td class="column">
                        <span>车架号</span>
                      </td>
                      <td class="colWidth">
                        <span>{{ carInfo.vin }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="column">
                        <span>省市</span>
                      </td>
                      <td class="colWidth">
                        <span>{{
                          `${carInfo.carProvinceName}${carInfo.carCityName}`
                        }}</span>
                      </td>
                      <td class="column">
                        <span>经销商门店</span>
                      </td>
                      <td class="colWidth">
                        <span>{{ carInfo.orgName }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="column">
                        <span>品牌车型</span>
                      </td>
                      <td class="colWidth" colspan="3">
                        <span>{{
                          `${carInfo.brandName}${carInfo.seriesName}${carInfo.modelName}`
                        }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="column">
                        <span>发动机号</span>
                      </td>
                      <td class="colWidth">
                        <span>{{ carInfo.engineNumber }}</span>
                      </td>
                      <td class="column">
                        <span>车牌号</span>
                      </td>
                      <td class="colWidth">
                        <span>{{ carInfo.carNo }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="column">
                        <span>排量</span>
                      </td>
                      <td class="colWidth">
                        <span>{{
                          `${carInfo.displacement}${carInfo.displacementUnit}`
                        }}</span>
                      </td>
                      <td class="column">
                        <span>燃油类型</span>
                      </td>
                      <td class="colWidth">
                        <span>{{
                          formatFuleType(Number(carInfo.fuelType))
                        }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="column">
                        <span>注册日期</span>
                      </td>
                      <td class="colWidth">
                        <span>{{
                          carInfo.registeredDate | formatDate("yyyy-MM")
                        }}</span>
                      </td>
                      <td class="column">
                        <span>使用性质</span>
                      </td>
                      <td class="colWidth">
                        <span>{{
                          formatUseType(Number(carInfo.useType))
                        }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="column">
                        <span>认证申请行驶里程</span>
                      </td>
                      <td class="colWidth">
                        <span>{{ carInfo.mileage }}公里</span>
                      </td>
                      <td class="column">
                        <span>最后一次保养日期</span>
                      </td>
                      <td class="colWidth">
                        <span>{{
                          carInfo.maintenanceDate | formatDate("yyyy-MM-dd")
                        }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="column">
                        <span>最后一次保养里程</span>
                      </td>
                      <td class="colWidth" colspan="3">
                        <span>{{ carInfo.maintenanceMileage }}公里</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="column">
                        <span>事故检查</span>
                      </td>
                      <td class="colWidth">
                        <span>{{
                          formatMultArr(carInfo.accident, accidentList)
                        }}</span>
                      </td>
                      <td class="column">
                        <span>车况描述</span>
                      </td>
                      <td class="colWidth">
                        <span>{{
                          formatMultArr(carInfo.carDetail, carDetailList)
                        }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="column">
                        <span>车辆改装</span>
                      </td>
                      <td class="colWidth">
                        <span>{{
                          carInfo.carConverted == 1 ? "是" : "否"
                        }}</span>
                      </td>
                      <td class="column">
                        <span>是否已收购过户</span>
                      </td>
                      <td class="colWidth">
                        <span>{{ carInfo.ifTransfer == 1 ? "是" : "否" }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="column">
                        <span>备注</span>
                      </td>
                      <td class="colWidth" colspan="3">
                        <span>{{ bakCertified }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="column">
                        <span>新车主姓名</span>
                      </td>
                      <td class="colWidth">
                        <span>{{ carInfo.newOwner }}</span>
                      </td>
                      <td class="column">
                        <span>新车牌号</span>
                      </td>
                      <td class="colWidth">
                        <span>{{ carInfo.newCarNo }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="column">
                        <span>质保出单里程</span>
                      </td>
                      <td class="colWidth" colspan="3">
                        <span>{{ applyWarrantyMileage }}公里</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="column">
                        <span>备注</span>
                      </td>
                      <td class="colWidth" colspan="3">
                        <span>{{ bakReport }}</span>
                      </td>
                    </tr>
                  </table>
                </div>
              </el-col>
              <el-col :xs="24" :sm="16" class="certification-right">
                <div class="certification-right-box">
                  <el-tabs
                    v-model="certificationActiveTab"
                    type="border-card"
                    @tab-click="handleClick"
                  >
                    <el-tab-pane label="认证申请信息" name="applyCertification">
                      <div class="certification-title-box">
                        <span
                          class="certification-title-item"
                          :class="{
                            on:
                              applyCarouselTitle ==
                              certifiApplyPicTitleItem.title,
                          }"
                          v-for="(certifiApplyPicTitleItem,
                          index) in applyInfoPics"
                          :key="index"
                          @click="clickApplyTitle(certifiApplyPicTitleItem)"
                          >{{ certifiApplyPicTitleItem.title }}</span
                        >
                      </div>
                      <el-divider></el-divider>
                      <div class="carousel-box">
                        <div class="carousel-title">
                          {{ applyCarouselTitle }}
                        </div>
                        <div class="carousel-content">
                          <el-carousel :autoplay="false" arrow="hover">
                            <el-carousel-item
                              v-for="item in activeUrl"
                              :key="item.id"
                            >
                              <template v-if="!checkPdf(item.url)">
                                <el-image
                                  :src="item.url"
                                  class="active-img"
                                  fit="scale-down"
                                ></el-image>
                              </template>
                              <template v-if="checkPdf(item.url)">
                                <pdfView :pdfUrl="item.url"></pdfView>
                              </template>
                            </el-carousel-item>
                          </el-carousel>
                        </div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane
                      label="认证汇报信息"
                      name="reportCertification"
                    >
                      <div class="certification-title-box">
                        <span
                          class="certification-title-item"
                          :class="{
                            on:
                              reportCarouselTitle ==
                              certifiReoprtPicTitleItem.title,
                          }"
                          v-for="(certifiReoprtPicTitleItem,
                          index) in reportInfoPics"
                          :key="index"
                          @click="clickReportTitle(certifiReoprtPicTitleItem)"
                          >{{ certifiReoprtPicTitleItem.title }}</span
                        >
                      </div>
                      <el-divider></el-divider>
                      <div class="carousel-box">
                        <div class="carousel-title">
                          {{ reportCarouselTitle }}
                        </div>
                        <div class="carousel-content">
                          <el-carousel :autoplay="false" indicator-position="none" class="carousel-img-box" arrow="hover">
                            <el-carousel-item
                              v-for="item in reportActiveUrl"
                              :key="item.id"
                            >
                             <template v-if="!checkPdf(item.url)">
                                <el-image
                                  :src="item.url"
                                  class="active-img"
                                  fit="scale-down"
                                ></el-image>
                              </template>
                              <template v-if="checkPdf(item.url)">
                                <pdfView :pdfUrl="item.url"></pdfView>
                              </template>
                            </el-carousel-item>
                          </el-carousel>
                        </div>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="流转记录" name="circulation">
            <el-table :data="circulationTableData" border v-loading="loading">
              <el-table-column
                label="序号"
                type="index"
                width="80"
                align="center"
              ></el-table-column>
              <template v-for="(item, index) in circulationTableHead">
                <el-table-column
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  show-overflow-tooltip
                  align="center"
                ></el-table-column>
              </template>
            </el-table>
            <!-- <div class="page-box" v-if="!loading">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalElements"
              ></el-pagination>
            </div>-->
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-main>
  </div>
</template>

<script>
/*********************************************************************************************
 **                                 车辆认证列表方法说明
 ** @function handleClick() 切换tab 的回调方法
 ** @function changeApplyCarousel(nowIndex,oldIndex) 图片轮播切换文字   @param nowIndex 当前序号，@param oldIndex 上一个序号
 ** @function changeReportCarousel(nowIndex,oldIndex) 图片轮播切换文字   @param nowIndex 当前序号，@param oldIndex 上一个序号
 ** @function handleSizeChange(pageSize) 切换每页的条数 @param pageSize 每页条数
 ** @function handleCurrentChange(currentPage) 切换页码  @param currentPage 当前页码

 ** @function checkCarInfo(currentPage) 获取车辆信息
 ** @function findCertifiById() 获取认证信息
 ** @function formatCerStatus(cerStatus) 格式化认证状态  @param cerStatus 认证状态
 ** @function formatFuleType(fuleType) 格式化燃油状态  @param fuleType 燃油状态
 ** @function formatUseType(useType) 格式化使用状态  @param useType 使用类型
 ** @function queryCerLog() 查询流转记录  
 *
 *********************************************************************************************/
import pdfView from "../../components/certification/pdfView";
export default {
  name: "certificationDetails",
  components: {
    pdfView,
  },
  data() {
    return {
      activeName: "certification",
      certificationActiveTab: "applyCertification",

      applyInfoPics: [
        {
          title: "检查报告",
          img: "",
        },
        {
          title: "原行驶证",
          imgList: [],
          typeFile: "201",
          mainKey: "2",
        },
        {
          title: "登记证1-2页",
          typeFile: "204",
          imgList: [],
          mainKey: "2",
        },
        {
          title: "登记证3-4页",
          typeFile: "205",
          imgList: [],
          mainKey: "2",
        },
        {
          title: "登记证5-6页",
          typeFile: "206",
          imgList: [],
          mainKey: "2",
        },
        {
          title: "登记证7-8页",
          typeFile: "207",
          imgList: [],
          mainKey: "2",
        },
        {
          title: "里程表",
          typeFile: "601",
          imgList: [],
          mainKey: "6",
        },
        {
          title: "左前45度",
          typeFile: "101",
          imgList: [],
          mainKey: "1",
        },
        {
          title: "右后45度",
          typeFile: "110",
          imgList: [],
          mainKey: "1",
        },
        {
          title: "发动机舱",
          typeFile: "112",
          imgList: [],
          mainKey: "1",
        },
        {
          title: "内饰前仪表台",
          typeFile: "106",
          imgList: [],
          mainKey: "1",
        },
        {
          title: "内饰后座椅",
          typeFile: "105",
          imgList: [],
          mainKey: "1",
        },
        {
          title: "车辆后备厢",
          typeFile: "108",
          imgList: [],
          mainKey: "1",
        },
        {
          title: "维修历史记录",
          typeFile: "301",
          imgList: [],
          mainKey: "3",
        },
        {
          title: "二手车交易发票",
          typeFile: "502",
          imgList: [],
          mainKey: "5",
        },
        {
          title: "其他图片1",
          typeFile: "602",
          imgList: [],
          mainKey: "6",
        },
        {
          title: "其他图片2",
          typeFile: "603",
          imgList: [],
          mainKey: "6",
        },
      ],
      applyCarouselTitle: "检查报告",

      reportInfoPics: [
        {
          title: "新行驶证",
          imgList: [],
          mainKey: "5",
          typeFile: "501",
        },
        {
          title: "登记证1-2页",
          imgList: [],
          mainKey: "2",
          typeFile: "204",
        },
        {
          title: "登记证3-4页",
          imgList: [],
          mainKey: "2",
          typeFile: "205",
        },
        {
          title: "登记证5-6页",
          imgList: [],
          mainKey: "2",
          typeFile: "206",
        },
        {
          title: "登记证7-8页",
          imgList: [],
          mainKey: "2",
          typeFile: "207",
        },
        {
          title: "车主身份证（照片）",
          imgList: [],
          mainKey: "5",
          typeFile: "503",
        },
        {
          title: "车主身份证（国徽）",
          imgList: [],
          mainKey: "5",
          typeFile: "504",
        },
        {
          title: "二手车交易发票",
          imgList: [],
          mainKey: "5",
          typeFile: "502",
        },
        {
          title: "二手车交易合同",
          imgList: [],
          mainKey: "5",
          typeFile: "505",
        },
        {
          title: "二手车质保合同",
          imgList: [],
          mainKey: "5",
          typeFile: "506",
        },
        {
          title: "质保出单里程表照片",
          imgList: [],
          mainKey: "7",
          typeFile: "701",
        },
      ],
      reportCarouselTitle: "新行驶证",
      circulationTableHead: [
        {
          prop: "operator",
          label: "操作人",
          width: "",
        },
        {
          prop: "createdAt",
          label: "操作时间",
          width: "",
        },
        {
          prop: "actionItems",
          label: "操作项",
          width: "",
        },
        {
          prop: "remark",
          label: "备注",
          width: "",
        },
      ],
      loading: false,
      circulationTableData: [],
      pageSize: 10,
      currentPage: 1, //当前页数
      totalPage: 1,
      totalElements: 0,
      cerStatus: "",
      carInfo: {},
      bakReport: "",
      bakCertified: "",
      applyWarrantyMileage: "",
      id: "",
      vin: "",
      accidentList: [
        {
          name: "非事故车",
          id: 1,
        },
        {
          name: "非火烧车",
          id: 2,
        },
        {
          name: "非泡水车",
          id: 3,
        },
      ],
      carDetailList: [
        {
          name: "非走私车",
          id: 1,
        },
        {
          name: "非盗抢车",
          id: 2,
        },
        {
          name: "非海关罚没车",
          id: 3,
        },
        {
          name: "非涉及法律纠纷车",
          id: 4,
        },
      ],
      activeUrl: "",
      reportActiveUrl: "",
      currentPdfPage: 0,
      pageCount: 0,
    };
  },
  methods: {
    checkCarInfo() {
      var params = {
        vin: this.vin,
        id: this.$route.query.carId,
      };
      this.$axios
        .post(this.pathItem.cerFindCar, params)
        .then((res) => {
          if (res.code == 0) {
            let r = res;
            this.carInfo = res.result;
            if (!this.id) {
              this.carInfo["ifTransfer"] = 2;
            } else {
              this.findCertifiById();
            }
            this.getCarPicList();
            this.getReportPic();
          } else {
            this.$alert(res.message, "提示", {
              confirmButtonText: "确定",
              type: "error",
            });
          }

          // this.id = res.result.id;
        })
        .catch((res) => {
          this.$alert(res.message, "提示", {
            confirmButtonText: "确定",
            type: "error",
          });
        });
    },
    findCertifiById() {
      var params = {
        id: this.id,
      };
      this.$axios
        .post(this.pathItem.certiCarInfo, params)
        .then((res) => {
          // this.carInfo = res.result
          if (res.code == 0) {
            this.carInfo.ifTransfer = res.result.ifTransfer;
            this.bakCertified = res.result.bakCertified;
            this.cerStatus = res.result.cerStatus;
            this.bakReport = res.result.bakReport;
            this.applyWarrantyMileage = res.result.applyWarrantyMileage;
          } else {
            this.$alert(res.message, "提示", {
              confirmButtonText: "确定",
              type: "error",
            });
          }
        })
        .catch((res) => {
          this.$alert(res.message, "提示", {
            confirmButtonText: "确定",
            type: "error",
          });
        });
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
    formatCerStatus(cerStatus) {
      switch (cerStatus) {
        case 1:
          return "录入中";
          break;
        case 2:
          return "待初审";
          break;
        case 3:
          return "待复审";
          break;
        case 4:
          return "申请驳回";
          break;
        case 5:
          return "撤销";
          break;
        case 6:
          return "认证失效";
          break;
        case 7:
          return "取消认证";
          break;
        case 8:
          return "已认证";
          break;
        case 9:
          return "汇报待审核";
          break;
        case 10:
          return "汇报通过";
          break;
        case 11:
          return "汇报驳回";
          break;
        default:
          break;
      }
    },
    formatFuleType(fuleType) {
      switch (fuleType) {
        case 1:
          return "汽油";
          break;
        case 2:
          return "柴油";
          break;
        case 3:
          return "电动";
          break;
        case 4:
          return "有点混合";
          break;
        case 5:
          return "天然气";
          break;
        default:
          break;
      }
    },
    formatUseType(useType) {
      switch (useType) {
        case 1:
          return "营运";
          break;
        case 2:
          return "非营运";
          break;
        case 3:
          return "营转非";
          break;
        default:
          break;
      }
    },
    handleClick() {},

    changeReportCarousel(nowIndex, oldIndex) {
      this.reportCarouselTitle = this.reportInfoPics[nowIndex].title;
    },
    getCarPicList() {
      this.$axios
        .post(this.pathItem.getFileListByMainKeyAndTypeList, {
          mainKey: this.carInfo.id,
          typeFile: [
            "201",
            "204",
            "205",
            "206",
            "207",
            "601",
            "101",
            "110",
            "112",
            "106",
            "105",
            "108",
            "502",
            "602",
            "603",
            "301",
          ],
        })
        .then((res) => {
          if (res.code == 0) {
            res.result.forEach((item) => {
              for (let index = 0; index < this.applyInfoPics.length; index++) {
                const element = this.applyInfoPics[index];
                if (element.typeFile == item.typeFile) {
                  element.imgList.push(item);
                }
              }
            });
            this.activeUrl = this.applyInfoPics[1].imgList
              ? this.applyInfoPics[1].imgList
              : [];
            this.applyCarouselTitle = this.applyInfoPics[1].title;
          }
        });
    },
    clickApplyTitle(item) {
      // console.log(item);
      if (item.title == "检查报告") {
        this.$router.push({
          path: "/carExamineReport",
          query: {
            carId: this.carInfo.id,
            reportType: 2,
          },
        });
      } else {
        this.activeUrl = item.imgList ? item.imgList : [];
        this.applyCarouselTitle = item.title;
      }
      this.currentPdfPage = 0;
    },
    getReportPic() {
      this.$axios
        .post(this.pathItem.getFileListByMainKeyAndTypeList, {
          mainKey: this.carInfo.id,
          typeFile: [
            "501",
            "204",
            "205",
            "206",
            "207",
            "503",
            "504",
            "502",
            "505",
            "506",
            "701",
          ],
        })
        .then((res) => {
          if (res.code == 0) {
            res.result.forEach((item) => {
              for (let index = 0; index < this.reportInfoPics.length; index++) {
                const element = this.reportInfoPics[index];
                if (element.typeFile == item.typeFile) {
                  element.imgList.push(item);
                }
              }
            });
            this.reportActiveUrl = this.reportInfoPics[0].imgList
              ? this.reportInfoPics[0].imgList
              : [];
            this.reportCarouselTitle = this.reportInfoPics[0].title;
          }
        });
    },
    clickReportTitle(item) {
      this.reportActiveUrl = item.imgList ? item.imgList : [];
      this.reportCarouselTitle = item.title;
    },
    // 流转记录

    queryCerLog() {
      var that = this;
      var params = {
        operatorId: this.id,
        operatorType: 2,
      };
      this.$axios
        .post(this.pathItem.certiQueryLog, params)
        .then((res) => {
          if (res.code == 0) {
            this.circulationTableData = res.result;
          }
        })
        .catch((res) => {});
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
    },
    //当前页码改变时触发事件
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    checkPdf(url) {
      if (url.indexOf(".pdf") > -1 || url.indexOf(".PDF") > -1) {
        return true;
      } else {
        return false;
      }
    },
  },
  filters: {
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
      } else {
        return "--";
      }
    },
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.vin = this.$route.query.vin;
      this.checkCarInfo();
      this.queryCerLog();
    }
  },
};
</script>

<style scoped lang="scss">
.certification-detail {
  padding-bottom: 100px;
  .main-content {
    background-color: #fff;
    padding: 15px 30px;
    // margin-bottom: 10px;
    font-size: 13px;
    &:first-child {
      margin-bottom: 0;
    }

    .el-col-text {
      line-height: 28px;
      padding-right: 10px;
      text-align: right;
      flex-shrink: 0;
    }
    .el-col-content {
      line-height: 28px;
      padding-left: 10px;
      text-align: left;
    }
    .certification-left {
      .certification-left-box {
        border: 1px solid #cccccc;
        padding: 30px 0;
        .table {
          border-collapse: collapse;
          width: 100%;
          tr {
            td {
              border: 0.5px solid #ebeef5;
              text-align: center;
              // width: 10%;
              padding: 10px;
              &.column {
                background: #f5f7fa;
              }
              &.colWidth {
                min-width: 40px;
              }
              img {
                width: 15px;
                height: 15px;
              }
            }
          }
        }
        .certification-left-list {
          margin-bottom: 10px;
          .el-col-text {
            padding-right: 5px;
            border: 1px solid black;
          }
          .el-col-content {
            padding-left: 5px;
            word-break: break-word;
          }
        }
      }
    }
    .certification-right {
      .certification-right-box {
        border: 1px solid #cccccc;
        padding: 30px 15px;
        .certification-title-box {
          padding: 0 10px;

          .certification-title-item {
            margin-left: 5px;
            margin-right: 5px;
            line-height: 2;
            word-break: keep-all;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
            display: inline-block;
            padding: 0 5px;
            //  white-space: ;
            &.on {
              color: #409eff;
            }
          }
        }
        .carousel-title {
          text-align: center;
          padding: 15px;
          font-size: 18px;
        }
        .carousel-content {
          text-align: center;
          position: relative;
          .page-pre{
            position: absolute;
            top: 10px;
            left: 50px;
            font-size: 40px;
            cursor: pointer;
            // color: black;
          }
          .page-next{
            position: absolute;
            top: 40px;
            right: 10px;
            font-size: 40px;
            cursor: pointer;
            // color: black;
            z-index: 10;
          }
        }
        .active-img {
          min-width: 60%;
          height: 100%;
          // min-height: 200px;
          // background-color: ;
          max-width: 100%;
        }
      }
    }

    .col-width {
      width: 41%;
    }
  }
}
</style>
<style>
.active-img .el-image__error,
.active-img .el-image__inner,
.active-img .el-image__placeholder {
  min-height: 300px;
}
.carousel-img-box .el-carousel__container{
  height: auto;
  min-height: 500px;
  
}

</style>
