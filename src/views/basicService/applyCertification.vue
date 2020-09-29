<template>
  <div class="apply-certification">
    <el-header class="header">
      <span>{{id ? '编辑' :'申请'}}车辆认证</span>
    </el-header>
    <el-main style="padding-bottom: 15px;">
      <el-row class="main-content">
        <div class="model-box">
          <div class="danger" style="color:#f56c6c;margin:10px 0;">温馨提示：以下信息如有编辑或添加，会同步到车辆信息中</div>
          <div class="subHead">车辆信息</div>
          <el-row>
            <el-col :span="8">
              <el-row>
                <el-col :span="6" class="el-col-text">车架号</el-col>
                <el-col :span="12" class="el-col-content">
                  <el-input
                    placeholder="输入VIN码，按【回车】确认"
                    v-model="vin"
                    @keyup.enter.native="checkCarInfo()"
                    size="mini"
                    :disabled="id != ''"
                  ></el-input>
                </el-col>
                <el-col :span="6" class="el-col-content">
                  <el-button
                    type="primary"
                    size="mini"
                    :disabled="id != ''"
                    @click="showDiaolg"
                  >选择车辆</el-button>
                </el-col>
              </el-row>
            </el-col>
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
          </el-row>
          <el-row class="car-info-list">
            <el-col :span="8">
              <el-col class="el-col-text" :span="6">发动机号</el-col>
              <el-col class="el-col-content" :span="18">
                <el-input size="mini" maxlength="20" v-model="carInfo.engineNumber"></el-input>
              </el-col>
            </el-col>
            <el-col :span="8">
              <el-col class="el-col-text" :span="6">原车牌号</el-col>
              <el-col class="el-col-content" :span="18">
                <el-input size="mini" maxlength="10" placeholder="请输入原车牌号" v-model="carInfo.carNo"></el-input>
              </el-col>
            </el-col>
            <el-col :span="8">
              <el-col class="el-col-text" :span="6">排气量</el-col>
              <el-col class="el-col-content" :span="12">
                <el-input
                  size="mini"
                  maxlength="10"
                  v-model="carInfo.displacement"
                  placeholder="请输入排气量"
                ></el-input>
              </el-col>
              <el-col class="el-col-content" :span="6">
                <el-select size="mini" v-model="carInfo.displacementUnit" placeholder="请选择">
                  <el-option label="L" value="L"></el-option>
                  <el-option label="T" value="T"></el-option>
                </el-select>
              </el-col>
            </el-col>
          </el-row>
          <el-row class="car-info-list">
            <el-col :span="8">
              <!-- <span class="el-col-content">{{carInfo.registeredDate | formatDate("yyyy-MM-dd")}}</span> -->

              <el-col class="el-col-text" :span="6">注册日期</el-col>
              <el-col class="el-col-content" :span="18">
                <el-date-picker
                  size="mini"
                  v-model="carInfo.registeredDate"
                  type="date"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-col>
            </el-col>
            <el-col :span="8">
              <el-col class="el-col-text" :span="6">使用性质</el-col>
              <el-col class="el-col-content" :span="18">
                <el-select placeholder="请选择" v-model="carInfo.useType" size="mini">
                  <el-option
                    :label="usingItem.name"
                    :value="usingItem.type"
                    v-for="usingItem in usingNature"
                    :key="usingItem.type"
                  ></el-option>
                </el-select>
              </el-col>
            </el-col>
            <el-col :span="8">
              <el-col class="el-col-text" :span="6">燃油类型</el-col>
              <el-col class="el-col-content" :span="18">
                <el-select placeholder="请选择" size="mini" v-model="carInfo.fuelType">
                  <el-option
                    :label="fuelItem.name"
                    :value="fuelItem.type"
                    v-for="fuelItem in fuelType"
                    :key="fuelItem.type"
                  ></el-option>
                </el-select>
              </el-col>
            </el-col>
          </el-row>
          <el-row class="car-info-list">
            <el-col :span="8">
              <el-col class="el-col-text" :span="6">事故检查</el-col>
              <el-col class="el-col-content" :span="18">
                <el-select v-model="accident" multiple size="mini">
                  <el-option label="非事故车" value="1"></el-option>
                  <el-option label="非火烧车" value="2"></el-option>
                  <el-option label="非泡水车" value="3"></el-option>
                </el-select>
              </el-col>
            </el-col>
            <el-col :span="8">
              <el-col class="el-col-text" :span="6">车况描述</el-col>
              <el-col class="el-col-content" :span="18">
                <el-select v-model="carDetail" multiple size="mini">
                  <el-option label="非走私车" value="1"></el-option>
                  <el-option label="非盗抢车" value="2"></el-option>
                  <el-option label="非海关罚没车" value="3"></el-option>
                  <el-option label="非涉及法律纠纷车" value="4"></el-option>
                </el-select>
              </el-col>
            </el-col>
            <el-col :span="8">
              <el-col class="el-col-text" :span="6">车辆改装</el-col>
              <el-col class="el-col-content" :span="18">
                <el-radio-group v-model.number="carInfo.carConverted">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="2">否</el-radio>
                </el-radio-group>
              </el-col>
            </el-col>
          </el-row>
          <el-row class="car-info-list">
            <el-col :span="8">
              <div class="mileage">
                <el-col class="el-col-text" :span="6">行驶里程</el-col>
                <el-col class="el-col-content" :span="18">
                  <el-input
                    placeholder="请输入行驶里程"
                    size="mini"
                    maxlength="11"
                    v-model="carInfo.mileage"
                    class="mileage-input"
                  ></el-input>公里
                </el-col>
              </div>
              <div class="danger">
                <el-col
                  :span="18"
                  :offset="6"
                >里程风险提示：认证申请里程不超过8万公里，质保出单时里程距认证申请时里程不超过100公里，且最终出单里程不超过8万公里</el-col>
              </div>
            </el-col>
            <el-col :span="8">
              <el-col class="el-col-text" :span="6">最后一次保养日期</el-col>
              <el-col class="el-col-content" :span="18">
                <el-date-picker
                  size="mini"
                  v-model="carInfo.maintenanceDate"
                  type="date"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-col>
            </el-col>
            <el-col :span="8">
              <el-col class="el-col-text" :span="6">最后一次保养里程</el-col>
              <el-col class="el-col-content" :span="18">
                <el-input
                  placeholder="请输入保养里程"
                  size="mini"
                  maxlength="11"
                  v-model="carInfo.maintenanceMileage"
                  class="mileage-input"
                ></el-input>
              </el-col>
            </el-col>
          </el-row>
          <el-row class="car-info-list">
            <el-col :span="8">
              <div class="mileage">
                <el-col class="el-col-text" :span="6">是否已收购过户</el-col>
                <el-col class="el-col-content" :span="18">
                  <el-radio-group v-model="hasTransed" @change="changeTrans">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </el-col>
              </div>
              <div class="danger">
                <el-col :span="18" :offset="6">（已收购过户车辆，请上传（收购）二手车交易发票）</el-col>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-row>
      <el-row class="main-content">
        <div class="model-box">
          <div class="subHead">
            检测报告
            <el-button size="mini" type="primary" @click="goToReport" style="margin-left:50px;">查看</el-button>
          </div>
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
              <el-image
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
              <div class="licenese-info-title">
                <span
                  class="licenese-info-need"
                  v-if="licenseInfoOption[4*(licenseInfoItemPart-1) + (num -1)].isNeed"
                >*</span>
                {{licenseInfoOption[4*(licenseInfoItemPart-1) + (num -1)].name}}
              </div>
            </el-col>
          </el-row>
        </div>
      </el-row>
      <el-row class="main-content">
        <div class="model-box">
          <div class="subHead">备注</div>
          <el-input
            type="textarea"
            :rows="3"
            v-model="bakCertified"
            resize="none"
            maxlength="200"
            placeholder="请输入内容"
          ></el-input>
        </div>
      </el-row>
      <el-row class="main-content">
        <el-divider></el-divider>
        <div class="model-box" style="text-align:center;">
          <el-button type="primary" size="medium" @click="saveCertification(1)">暂存</el-button>
          <el-button type="primary" size="medium" @click="saveCertification(2)">提交</el-button>
          <el-button plain size="medium" @click="cancleSave">取消</el-button>
        </div>
      </el-row>
    </el-main>
    <find-car-dialog
      :libraryDialog="libraryDialog"
      @closeDialog="closeDialog"
      @changeCarInfo="changeCarInfo"
    ></find-car-dialog>
    <el-dialog title="图片上传" v-if="imgDialogVisible" center :visible="true" @close="canclePicSave">
      <uploadImg
        :type="1"
        ref="cerPic"
        :limit="dialogImg.limit"
        :carId="carInfo.id"
        :isNeed="dialogImg.isNeed"
        :name="dialogImg.name"
        :tableName="dialogImg.mainKey"
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
 **                                 车辆认证列表方法说明
 ** @function closeDialog() 关闭弹窗
 ** @function showDiaolg() 打开弹窗
 ** @function checkCarInfo() 获取车辆信息
 ** @function brandChangeVal(selectVal) 车品牌选择回调 @param selectVal 选择的车品信息
 ** @function seriseChangeVal(selectVal) 车品牌选择回调 @param selectVal 选择的车品信息
 ** @function modelChangeVal(selectVal) 车品牌选择回调 @param selectVal 选择的车品信息

 ** @function changeCarInfo(carInfo) 车选择回调 @param carInfo 选择的车信息
 ** @function findCertifiById() 通过id 获取认证信息
 ** @function saveCertification(type) 保存认证信息 @param type 按钮类型
 ** @function formatDate(value,format) 时间格式化 @param value 时间 @param format 时间类型
 ** @function changeTrans(val) 选择过户回调 @param val 选择的值
 ** @function checkImg(type) 检查图片是否上传 @param type 1暂存 2 提交
 ** @function cancleSave() 取消保存
 ** @function colosPage() 关闭页面
 ** @function getCarPicList() 获取对应的图片
 ** @function goToReport() 检查报告跳转
 ** @function clickPic() 点击图片新增编辑
 ** @function canclePicSave() 取消操作图片
 ** @function savePicImg() 保存图片
 ** @function saveImg(saveImgObj) 图片上传完成后回调 @param saveImgObj 上传完的图片信息
 *
 *********************************************************************************************/
import uploadImg from "../../components/certification/uploadImg"; //上传图片
import findCarDialog from "../../components/certification/findcar"; //查询车辆
import carBrandSerise from "../../components/certification/selectCarBrand"; //车型车系
export default {
  name: "applyCertification",
  components: {
    uploadImg,
    findCarDialog,
    carBrandSerise,
  },
  data() {
    return {
      id: "", //编辑id
      // 证照资料
      licenseInfoOption: [
        {
          index: 0,
          typeFile: "201",
          name: "原行驶证",
          isNeed: true,
          imgList: [],
          limit: 1,
          mainKey: "2",
        },
        {
          index: 1,
          typeFile: "204",
          imgList: [],
          name: "登记证1-2页",
          isNeed: true,
          limit: 1,
          mainKey: "2",
        },
        {
          index: 2,
          typeFile: "205",
          imgList: [],
          name: "登记证3-4页",
          isNeed: true,
          limit: 1,
          mainKey: "2",
        },
        {
          index: 3,
          typeFile: "206",
          imgList: [],
          name: "登记证5-6页",
          isNeed: false,
          limit: 1,
          mainKey: "2",
        },
        {
          index: 4,
          typeFile: "207",
          imgList: [],
          name: "登记证7-8页",
          isNeed: false,
          limit: 1,
          mainKey: "2",
        },
        {
          index: 5,
          typeFile: "601",
          imgList: [],
          name: "申请认证里程表图片",
          isNeed: true,
          limit: 1,
          mainKey: "6",
        },
        {
          index: 6,
          typeFile: "101",
          imgList: [],
          name: "左前45°照片",
          isNeed: true,
          limit: 1,
          mainKey: "1",
        },
        {
          index: 7,
          typeFile: "110",
          imgList: [],
          name: "右后45°照片",
          isNeed: true,
          limit: 1,
          mainKey: "1",
        },
        {
          index: 8,
          typeFile: "112",
          imgList: [],
          name: "发动机舱",
          isNeed: true,
          limit: 1,
          mainKey: "1",
        },
        {
          index: 9,
          typeFile: "106",
          imgList: [],
          name: "内饰前仪表盘",
          isNeed: true,
          limit: 1,
          mainKey: "1",
        },
        {
          index: 10,
          typeFile: "105",
          imgList: [],
          name: "内饰后座椅",
          isNeed: true,
          limit: 1,
          mainKey: "1",
        },
        {
          index: 11,
          typeFile: "108",
          imgList: [],
          name: "车辆后备厢打开照片",
          isNeed: true,
          limit: 1,
          mainKey: "1",
        },
        {
          index: 12,
          typeFile: "301",
          imgList: [],
          name: "车辆维修历史记录",
          isNeed: true,
          limit: 15,
          mainKey: "3",
        },
        {
          index: 13,
          typeFile: "502",
          imgList: [],
          name: "（收购）二手车交易发票",
          isNeed: false,
          limit: 1,
          mainKey: "5",
        },
        {
          index: 14,
          typeFile: "602",
          imgList: [],
          name: "其他图片1",
          isNeed: false,
          limit: 1,
          mainKey: "6",
        },
        {
          index: 15,
          typeFile: "603",
          imgList: [],
          name: "其他图片2",
          isNeed: false,
          limit: 1,
          mainKey: "6",
        },
      ],
      // 在库车辆弹窗
      libraryDialog: false,
      vin: "",
      carInfo: {},
      hasTransed: 2,
      fuelType: [
        {
          type: "1",
          name: "汽油",
        },
        {
          type: "2",
          name: "柴油",
        },
        {
          type: "3",
          name: "电动",
        },
        {
          type: "4",
          name: "油电混动",
        },
        {
          type: "5",
          name: "天然气",
        },
      ],

      usingNature: [
        {
          type: "1",
          name: "营运",
        },
        {
          type: "2",
          name: "非营运",
        },
        {
          type: "3",
          name: "营转非",
        },
      ],
      bakCertified: "",
      // 事故检查
      accident: [],
      // 车况描述
      carDetail: [],
      imgDialogVisible: false,
      dialogImg: "",
      activeIndex: "",
      carFileList: [],
    };
  },
  methods: {
    checkCarInfo() {
      var params = {
        vin: this.vin,
      };
      var url = this.id
        ? this.pathItem.cerFindCar
        : this.pathItem.certiindeCarInfoByVin;
      if (this.id) {
        params.id = this.$route.query.carId;
      }
      this.$axios
        .post(url, params)
        .then((res) => {
          let r = res;
          if (res.code == 0) {
            this.carInfo = res.result;
            this.getCarPicList();
            if (this.carInfo.accident) {
              if (this.carInfo.accident.indexOf(",") > -1) {
                this.accident = this.carInfo.accident.split(",");
              } else {
                this.accident = [this.carInfo.accident];
              }
            }
            if (this.carInfo.carDetail) {
              if (this.carInfo.carDetail.indexOf(",") > -1) {
                this.carDetail = this.carInfo.carDetail.split(",");
              } else {
                this.carDetail = [this.carInfo.carDetail];
              }
            }
            if (!this.id) {
              this.hasTransed = 2;
            } else {
              this.findCertifiById();
            }
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((res) => {
          this.loading = false;
          this.$alert(res.message, "提示", {
            confirmButtonText: "确定",
            type: "error",
          });
        });
    },
    changeTrans(val) {
      // console.log(val);
      if (val == 1) {
        this.licenseInfoOption[13].isNeed = true;
      } else {
        this.licenseInfoOption[13].isNeed = false;
      }
    },
    brandChangeVal(selectVal) {
      this.carInfo.brandId = String(selectVal.carBrandId);
      this.carInfo.brandName = selectVal.carBrandName;
    },
    seriseChangeVal(selectVal) {
      this.carInfo.seriesId = String(selectVal.carSeriesId);
      this.carInfo.seriesName = selectVal.carSeriesName;
    },
    modelChangeVal(selectVal) {
      this.carInfo.modelId = String(selectVal.carModelId);
      this.carInfo.modelName = selectVal.carModelName;
    },

    closeDialog() {
      this.libraryDialog = false;
    },
    showDiaolg() {
      this.libraryDialog = true;
    },
    changeCarInfo(carInfo) {
      this.vin = carInfo.vin;
      this.checkCarInfo();
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
            this.hasTransed = res.result.ifTransfer
              ? Number(res.result.ifTransfer)
              : 2;
            this.bakCertified = res.result.bakCertified;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((res) => {
          this.$message.error(res.message);
        });
    },
    saveCertification(type) {
      if (type == 2) {
        if (!this.checkImg(type)) {
          return;
        } else {
          this.carFileList = this.checkImg(type);
        }
        // var nowTime = new Date();
        // var lastTime = new Date(this.carInfo.registeredDate);
        // var lastmaintenanceDate = new Date(this.carInfo.maintenanceDate);

        // if (
        //   lastTime > nowTime ||
        //   (nowTime - lastTime) / 1000 / 60 / 60 / 24 / 365 > 4 ||
        //   lastmaintenanceDate > nowTime ||
        //   (nowTime - lastmaintenanceDate) / 1000 / 60 / 60 / 24 / 30 > 6
        // ) {
        //   let message = "注册日期不满足认证要求";
        //   this.$alert(message, "警告", {
        //     confirmButtonText: "确定",
        //   });
        //   return;
        // }
        // if (
        //   this.carInfo.accident.split(",").length != 3 ||
        //   this.carInfo.carDetail.split(",").length != 4
        // ) {
        //   let message = "注册日期不满足认证要求";
        //   this.$alert(message, "警告", {
        //     confirmButtonText: "确定",
        //   });
        //   return;
        // }
        // if (
        //   this.carInfo.fuelType != "1" ||
        //   this.carInfo.useType != "2" ||
        //   this.carInfo.mileage > 80000 ||
        //   this.carInfo.mileage - this.carInfo.maintenanceMileage > 8000
        // ) {
        //   let message = "注册日期不满足认证要求";
        //   this.$alert(message, "警告", {
        //     confirmButtonText: "确定",
        //   });
        //   return;
        // }
      } else {
        this.carFileList = this.checkImg(type);
      }

      var params = {
        ...this.carInfo,
      };
      params.carId = this.carInfo.id;
      if (this.id) {
        params.cid = this.id;
        params.rid = this.id;
      }
      if (this.accident.length > 0) {
        params.accident = this.accident.join(",");
      } else {
        params.accident = "";
      }
      if (this.carDetail.length > 0) {
        params.carDetail = this.carDetail.join(",");
      } else {
        params.carDetail = "";
      }
      if(params.registeredDate){
        params.registeredDate = this.formatDate(params.registeredDate,"yyyy-MM-dd hh:mm:ss");
      }
      if(params.maintenanceDate){
        params.maintenanceDate = this.formatDate(params.maintenanceDate,"yyyy-MM-dd hh:mm:ss");
      }
      params.certifiedStatus = type;
      params.bakCertified = this.bakCertified;
      if (this.hasTransed) {
        params.ifTransfer = this.hasTransed;
      }
      if (this.carFileList.length) {
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
                    this.$message.success("保存成功");
                    this.colosPage();
                  } else {
                    this.$message.error(res.message);
                  }
                })
                .catch((res) => {
                  this.$message.error(res.message);
                });
            } else {
              this.$message.error(imgRes.message);
            }
          })
          .catch((res) => {
            this.$message.error(res.message);
          });
      } else {
        this.$axios
          .post(this.pathItem.certiSaveAndEdit, params)
          .then((res) => {
            if (res.code == 0) {
              this.$message.success("保存成功");
              this.colosPage();
            } else {
              this.$message.error(res.message);
            }
          })
          .catch((res) => {
            this.$message.error(res.message);
          });
      }
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
    cancleSave() {
      // this.$confirm("是否取消认证", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      // })
      //   .then(() => {
      //     this.colosPage();
      //   })
      //   .catch(() => {});
      this.colosPage();
    },
    colosPage() {
      var createWorkList = {
        name: "applyCertification",
        query: this.$route.query,
      };

      this.$store.dispatch("delVisitedViews", createWorkList).then(() => {
        this.$router.back();
      });
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

    goToReport() {
      this.$router.push({
        path: "/carExamineReport",
        query: {
          carId: this.carInfo.id,
          reportType: this.carInfo.reportStatusLable,
        },
      });
    },
    clickPic(item, index) {
      if (this.carInfo.id) {
        this.imgDialogVisible = true;
        this.dialogImg = item;
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
          // console.log(format);
          return format;
        } else {
          return "--";
        }
      }
    },
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
    }
    this.vin = this.$route.query.vin;
    if (this.vin) {
      this.checkCarInfo();
    }
  },
};
</script>

<style scoped lang="scss">
.apply-certification {
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
