<template>
  <div class="certification-report">
    <el-header class="header">
      <span>{{id ? '编辑' :'申请'}}认证汇报</span>
    </el-header>
    <el-main style="padding-bottom: 15px;">
      <el-row class="main-content">
        <div class="model-box">
          <div class="subHead">车辆信息</div>
          <el-row class="car-info-list" :gutter="10">
            <el-col :span="8">
              <el-col class="el-col-text" :span="6">品牌车型</el-col>
              <el-col class="el-col-content" :span="18">
                <carBrandSerise
                  @modelChangeVal="modelChangeVal"
                  @brandChangeVal="brandChangeVal"
                  @seriseChangeVal="seriseChangeVal"
                  :hasModel="true"
                  :oldBrandId="carInfo.brandId"
                  :oldSeriseId="carInfo.seriesId"
                  :oldModelId="carInfo.modelId"
                ></carBrandSerise>
              </el-col>
            </el-col>
            <el-col :span="8">
              <el-col :span="6" class="el-col-text">车架号</el-col>
              <el-col :span="18" class="el-col-content">
                <el-input placeholder="请输入车架号" disabled v-model="vin" size="mini"></el-input>
              </el-col>
            </el-col>
            <el-col :span="8">
              <el-col class="el-col-text" :span="6">申请里程认证</el-col>
              <el-col class="el-col-content" :span="18">
                <el-input size="mini" v-model="carInfo.mileage" disabled></el-input>
              </el-col>
            </el-col>
          </el-row>
          <el-row class="car-info-list" :gutter="10">
            <el-col :span="8">
              <el-col class="el-col-text" :span="6">新车主姓名</el-col>
              <el-col class="el-col-content" :span="18">
                <el-input size="mini" v-model="carInfo.newOwner" maxlength="20"></el-input>
              </el-col>
            </el-col>
            <el-col :span="8">
              <el-col class="el-col-text" :span="6">新车牌号</el-col>
              <el-col class="el-col-content" :span="18">
                <el-input size="mini" v-model="carInfo.newCarNo" maxlength="10"></el-input>
              </el-col>
            </el-col>
            <el-col :span="8">
              <el-col class="el-col-text" :span="6">申请质保里程</el-col>
              <el-col class="el-col-content" :span="18">
                <el-input size="mini" v-model="applyWarrantyMileage" maxlength="11" @keyup.native="proving"></el-input>
              </el-col>
            </el-col>
          </el-row>
        </div>
      </el-row>
      <el-row class="main-content">
        <div class="model-box">
          <div class="subHead">照证资料</div>
          <el-row
            v-for="licenseInfoItemPart in Math.ceil(licenseInfoOption.length / 4)"
            :key="licenseInfoItemPart"
          >
            <el-col :span="6" v-for="num in  4" :key="num" class="img-box">
              <div v-if="licenseInfoOption[4*(licenseInfoItemPart-1) + (num -1)]">
                <el-image
                  v-if="(4*(licenseInfoItemPart-1) + (num -1) != 8 && 4*(licenseInfoItemPart-1) + (num -1) != 9 )"
                  :src="licenseInfoOption[4*(licenseInfoItemPart-1) + (num -1)].imgList[0] ? licenseInfoOption[4*(licenseInfoItemPart-1) + (num -1)].imgList[0].url : ''"
                  class="image-slot"
                  @click="clickPic(licenseInfoOption[4*(licenseInfoItemPart-1) + (num -1)],4*(licenseInfoItemPart-1) + (num -1))"
                >
                  <!-- <div slot="placeholder" class="image-slot">
                  <i class="el-icon-plus"></i>
                  </div>-->
                  <div
                    slot="error"
                    @click="clickPic(licenseInfoOption[4*(licenseInfoItemPart-1) + (num -1)],4*(licenseInfoItemPart-1) + (num -1))"
                  >
                    <i class="el-icon-plus"></i>
                  </div>
                </el-image>
                <el-image
                  :src="require('../../assets/images/pdf-bg.png')"
                  class="image-slot"
                  v-if="(4*(licenseInfoItemPart-1) + (num -1) == 8 ||4*(licenseInfoItemPart-1) + (num -1) == 9 )"
                  @click="clickPic(licenseInfoOption[4*(licenseInfoItemPart-1) + (num -1)],4*(licenseInfoItemPart-1) + (num -1))"
                >
                </el-image>
                <div class="licenese-info-title">
                  <span
                    class="licenese-info-need"
                    v-if="licenseInfoOption[4*(licenseInfoItemPart-1) + (num -1)].isNeed"
                  >*</span>
                  {{licenseInfoOption[4*(licenseInfoItemPart-1) + (num -1)].name}}
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-row>
      <el-row class="main-content">
        <div class="model-box">
          <div class="subHead">备注</div>
          <el-input type="textarea" :rows="3" v-model="bakReport" resize="none" maxlength="200" placeholder="请输入内容"></el-input>
        </div>
      </el-row>
      <el-row class="main-content">
        <el-divider></el-divider>
        <div class="model-box" style="text-align:center;">
          <el-button type="primary" size="medium" @click="saveCertification">提交</el-button>
          <el-button plain size="medium" @click="cancleReoprt">返回</el-button>
        </div>
      </el-row>
    </el-main>
    <el-dialog title="图片上传" v-if="imgDialogVisible" center :visible="true" @close="canclePicSave">
      <uploadImg
        ref="cerPic"
        :limit="dialogImg.limit"
        :carId="carInfo.id"
        :isNeed="dialogImg.isNeed"
        :name="dialogImg.name"
        :type="dialogImg.type"
        :tableName="dialogImg.tableName"
        :typeFile="dialogImg.typeFile"
        :hasUrl="dialogImg.imgList"
        @imgUpload="saveImg"
      ></uploadImg>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canclePicSave" size="mini">取 消</el-button>
        <el-button type="primary" @click="savePicImg" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/*********************************************************************************************
 ** @function checkCarInfo(currentPage) 获取车辆信息
 ** @function findCertifiById() 获取认证信息
 ** @function brandChangeVal(selectVal) 车辆品牌选择  @param selectVal 品牌信息
 ** @function seriseChangeVal(selectVal) 车辆车系选择  @param selectVal 车系信息
 ** @function modelChangeVal(selectVal) 车辆型选择  @param selectVal 品牌信息
 ** @function saveCertification() 保存认证信息
 *
 *********************************************************************************************/
import uploadImg from "../../components/certification/uploadImg";
import carBrandSerise from "../../components/certification/selectCarBrand";

export default {
  name: "certificationReport",
  components: {
    uploadImg,
    carBrandSerise,
  },
  data() {
    return {
      id: "", //编辑id
      vin: "",
      // 证照资料
      licenseInfoOption: [
        {
          index: 0,
          name: "新行驶证",
          isNeed: true,
          tableName: "5",
          typeFile: "501",
          imgList: [],
          limit: 1,
          type:1,
        },
        {
          index: 1,
          name: "登记证1-2页",
          isNeed: true,
          tableName: "2",
          typeFile: "204",
          imgList: [],
          limit: 1,
          type:1,
        },
        {
          index: 2,
          name: "登记证3-4页",
          isNeed: true,
          tableName: "2",
          typeFile: "205",
          imgList: [],
          limit: 1,
          type:1,
        },
        {
          index: 3,
          name: "登记证5-6页",
          isNeed: false,
          tableName: "2",
          typeFile: "206",
          imgList: [],
          limit: 1,
          type:1,
        },
        {
          index: 4,
          name: "登记证7-8",
          isNeed: false,
          tableName: "2",
          typeFile: "207",
          imgList: [],
          limit: 1,
          type:1,
        },
        {
          index: 5,
          name: "车主身份证（照片）",
          isNeed: true,
          tableName: "5",
          typeFile: "503",
          imgList: [],
          limit: 1,
          type:1,
        },
        {
          index: 6,
          name: "车主身份证（国徽）",
          isNeed: true,
          tableName: "5",
          typeFile: "504",
          imgList: [],
          limit: 1,
          type:1,
        },
        {
          index: 7,
          name: "二手车交易发票",
          isNeed: true,
          tableName: "5",
          typeFile: "502",
          imgList: [],
          limit: 1,
          type:1,
        },
        {
          index: 8,
          name: "二手车交易合同",
          isNeed: true,
          tableName: "5",
          typeFile: "505",
          imgList: [],
          limit: 10,
          type:2,
        },
        {
          index: 9,
          name: "二手车质保合同",
          isNeed: true,
          tableName: "5",
          typeFile: "506",
          imgList: [],
          limit: 10,
          type:2,
        },
        {
          index: 10,
          name: "申请质保里程表照片",
          isNeed: true,
          tableName: "7",
          typeFile: "701",
          imgList: [],
          limit: 1,
          type:1,
        },
      ],
      carInfo: {},
      bakReport: "",
      imgDialogVisible: false,
      dialogImg: "",
      activeIndex: "",
      carFileList: [],
      applyWarrantyMileage:""
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
    brandChangeVal(selectVal) {
      this.carInfo.brandId = selectVal.carBrandId;
      this.carInfo.brandName = selectVal.carBrandName;
    },
    seriseChangeVal(selectVal) {
      this.carInfo.seriesId = selectVal.carSeriesId;
      this.carInfo.seriesName = selectVal.carSeriesName;
    },
    modelChangeVal(selectVal) {
      this.carInfo.modelId = selectVal.carModelId;
      this.carInfo.modelName = selectVal.carModelName;
    },
    findCertifiById() {
      var params = {
        id: this.id,
      };

      this.$axios
        .post(this.pathItem.certiCarInfo, params)
        .then((res) => {
          if (res.code == 0) {
            this.carInfo.ifTransfer = res.result.ifTransfer;
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
    getCarPicList() {
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
              for (
                let index = 0;
                index < this.licenseInfoOption.length;
                index++
              ) {
                const element = this.licenseInfoOption[index];
                if (element.typeFile == item.typeFile) {
                  element.imgList.push(item);
                }
              }
            });
          }
        });
    },
    saveCertification() {
      if (!this.checkImg(2)) {
        return;
      } else {
        this.carFileList = this.checkImg(2);
      }
      var params = {
        ...this.carInfo,
      };
      params.carId = this.carInfo.id;
      if (this.id) {
        params.cid = this.id;
        params.rid = this.id;
      }
      params.applyWarrantyMileage = this.applyWarrantyMileage
      params.certifiedStatus = 9;
      params.bakReport = this.bakReport;

      this.$axios
        .post(this.pathItem.addOrUpdateFileList, {
          carFileList: this.carFileList,
        })
        .then((imgRes) => {
          if (imgRes.code == 0) {
            this.$axios
              .post(this.pathItem.certiSaveAndEdit, params)
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success("提交成功");
                  this.colosPage();
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
          } else {
            this.$message.error(imgRes.message);
          }
        })
        .catch((res) => {
          this.$message.error(res.message);
        });
    },
    checkImg(type) {
      var carFileList = [];
      for (let index = 0; index < this.licenseInfoOption.length; index++) {
        const element = this.licenseInfoOption[index];
        if (type == 2) {
          if (element.isNeed && element.imgList.length <= 0) {
            this.$message.error("请上传图片");
            return false;
          }
        }

        carFileList = carFileList.concat(element.imgList);
      }
      return carFileList;
    },
    cancleReoprt() {
      this.$confirm("是否取消审核", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.colosPage();
        })
        .catch(() => {});
    },
    colosPage() {
      var createWorkList = {
        name: "certificationReport",
        query: this.$route.query,
      };

      this.$store.dispatch("delVisitedViews", createWorkList).then(() => {
        this.$router.back();
      });
    },
    clickPic(item, index) {
      if (this.carInfo.id) {
        this.imgDialogVisible = true;
        this.dialogImg = JSON.parse(JSON.stringify(item));
        this.activeIndex = index;
      } else {
        this.$message.error("请先选择车辆");
      }
    },
    canclePicSave() {

      this.imgDialogVisible = false;
      this.dialogImg = "";
      this.activeIndex = "";
    },
    savePicImg() {
      this.$refs.cerPic.saveImg();
    },
    saveImg(saveImgObj) {
      if (saveImgObj.status) {
        if (saveImgObj.carFileList && saveImgObj.carFileList.length) {
          this.licenseInfoOption[this.activeIndex].imgList =
            saveImgObj.carFileList;
        }
        this.imgDialogVisible = false;
        this.dialogImg = "";
        this.activeIndex = "";
      }
    },
    checkUrlIsFile(url){
      if(url.indexOf(".pdf") > -1){
           
      }
    },
    proving(){
      this.applyWarrantyMileage = this.applyWarrantyMileage.replace(/[^\.\d]/g,'');
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.vin = this.$route.query.vin;
    this.checkCarInfo();
  },
};
</script>

<style scoped lang="scss">
.certification-report {
  padding-bottom: 100px;
  .main-content {
    background-color: #fff;
    padding: 15px 30px;
    // margin-bottom: 10px;
    font-size: 13px;
    &:first-child {
      margin-bottom: 0;
    }
    .model-box {
      margin-bottom: 30px;
      .img-box {
        text-align: center;
        .licenese-info-title {
          text-align: center;
          padding: 10px 0;
          .licenese-info-need {
            color: #f56c6c;
          }
        }
      }
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
    .car-info-list {
      margin-top: 20px;
      .mileage {
        // display: flex;
        .mileage-input {
          width: 50%;
        }
      }
      .danger {
        color: #f56c6c;
        font-size: 12px;
        padding-right: 20px;
        margin-top: 10px;
      }
    }

    .col-width {
      width: 41%;
    }
    .el-image {
      max-width: 100%;
    }
    .image-slot {
      background-color: #fbfdff;
      border: 1px dashed #c0ccda;
      border-radius: 6px;
      box-sizing: border-box;
      width: 148px;
      height: 148px;
      max-width: 100%;
      max-height: 100%;
      cursor: pointer;
      line-height: 146px;
      vertical-align: top;
    }
  }
}
</style>
