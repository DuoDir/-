<template>
  <div class="carAssessOperation">
    <!-- 销售过户 -->
    <el-header class="header">
      <span>销售过户</span>
    </el-header>
    <el-main style="padding-bottom: 15px;">
      <el-row class="main-content">
        <div class="subHead">基础信息</div>
        <el-row>
          <el-col class="text-right" :span="3">车辆编号：</el-col>
          <el-col :span="5">{{carInfo.carNumber}}</el-col>
          <el-col class="text-right" :span="3">品牌车系车型：</el-col>
          <el-col :span="12">{{carInfo.brandName + carInfo.seriesName + carInfo.modelName}}</el-col>
        </el-row>
        <el-row>
          <el-col class="col-text-right" :span="3">
            <span class="cRed">*</span>原车主姓名：
          </el-col>
          <el-col :span="5">
            <el-input v-model="transferData.oldOwner" size="mini" maxlength="20"></el-input>
          </el-col>
          <el-col class="col-text-right" :span="3">
            <span class="cRed">*</span>原车主电话：
          </el-col>
          <el-col :span="5">
            <el-input v-model="transferData.oldPhone" size="mini" maxlength="11"></el-input>
          </el-col>
          <el-col class="col-text-right" :span="3">原车牌号：</el-col>
          <el-col :span="5">
            <el-input v-model="transferData.oldCarNo" size="mini" maxlength="10"></el-input>
          </el-col>
          <el-col class="col-text-right" :span="3">
            <span class="cRed">*</span>新车主姓名：
          </el-col>
          <el-col :span="5">
            <el-input v-model="transferData.newOwner" size="mini" maxlength="20"></el-input>
          </el-col>
          <el-col class="col-text-right" :span="3">
            <span class="cRed">*</span>新车主电话：
          </el-col>
          <el-col :span="5">
            <el-input v-model="transferData.newPhone" size="mini" maxlength="11"></el-input>
          </el-col>
          <el-col class="col-text-right" :span="3">新车牌号：</el-col>
          <el-col :span="5">
            <el-input v-model="transferData.newCarNo" size="mini" maxlength="10"></el-input>
          </el-col>
          <el-col class="col-text-right" :span="3">过户地区：</el-col>
          <el-col :span="5">
            <el-select v-model="transferData.transferLocation" size="mini">
              <el-option label="本地" :value="1"></el-option>
              <el-option label="外迁" :value="2"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="col-text-right" :span="3">
            <span class="cRed">*</span>销售顾问：
          </el-col>
          <el-col :span="5">
            <el-select v-model="transferData.salePerson" size="mini">
              <el-option
                v-for="item in salesList"
                :key="item.id"
                :label="item.userName"
                :value="item.userName"
              ></el-option>
            </el-select>
          </el-col>
          <el-col class="col-text-right" :span="3">
            <span class="cRed">*</span>过户专员：
          </el-col>
          <el-col :span="5">
            <el-select v-model="transferData.transferPerson" size="mini">
              <el-option
                v-for="item in transList"
                :key="item.id"
                :label="item.userName"
                :value="item.userName"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="col-text-right" :span="3">备注：</el-col>
          <el-col :span="12">
            <el-input type="textarea" v-model="transferData.bak" maxlength="100"></el-input>
          </el-col>
        </el-row>
      </el-row>
      <el-row class="main-content">
        <div class="subHead">
          照片信息
          <small style="color:#DCDFE6;font-weight:400">（图片支持jpg/png等）</small>
        </div>
        <el-row>
          <el-col class="col-text-right" :span="3">新行驶证：</el-col>
          <el-col :span="8">
            <uploadImg
              :type="1"
              ref="newDriveCard"
              @imgUpload="choseNewDrive"
              :carId="carId"
              :limit="10"
              :tableName="5"
              :typeFile="501"
            ></uploadImg>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="col-text-right" :span="3">
            新车主身份证：
            <p>（人物）</p>
          </el-col>
          <el-col :span="6">
            <uploadImg
              :type="1"
              ref="newOwnerFront"
              @imgUpload="choseNewOwnerFront"
              :carId="carId"
              :limit="1"
              :tableName="5"
              :typeFile="503"
            ></uploadImg>
          </el-col>
          <el-col class="col-text-right" :span="3">
            新车主身份证：
            <p>（国徽）</p>
          </el-col>
          <el-col :span="8">
            <uploadImg
              :type="1"
              ref="newOwnerBack"
              @imgUpload="choseNewOwnerBack"
              :carId="carId"
              :limit="1"
              :tableName="5"
              :typeFile="504"
            ></uploadImg>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="col-text-right" :span="3">二手车交易发票：</el-col>
          <el-col :span="8">
            <uploadImg
              :type="1"
              ref="transInvoice"
              @imgUpload="choseTransInvoice"
              :carId="carId"
              :limit="10"
              :tableName="5"
              :typeFile="502"
            ></uploadImg>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="col-text-right" :span="3">二手车交易合同：</el-col>
          <el-col :span="8">
            <uploadImg
              :type="2"
              ref="transContract"
              @imgUpload="choseTransContract"
              :carId="carId"
              :limit="10"
              name="二手车交易合同"
              :tableName="5"
              :typeFile="505"
            ></uploadImg>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="col-text-right" :span="3">二手车质保合同：</el-col>
          <el-col :span="8">
            <uploadImg
              :type="2"
              ref="quAContract"
              @imgUpload="choseQuAContract"
              :carId="carId"
              :limit="10"
               name="二手车质保合同"
              :tableName="5"
              :typeFile="506"
            ></uploadImg>
          </el-col>
        </el-row>
      </el-row>
      <div class="text-right" style="padding-right:40px;">
        <el-button @click="operationAssessWindow(0)">关 闭</el-button>
        <el-button type="primary" @click="operationAssessWindow(1)">保 存</el-button>
      </div>
    </el-main>
  </div>
</template>

<script>
/*********************************************************************************************
 **                                 车辆列表方法说明
 ** @function getCarInfo() 获取车辆信息
 ** @function getTransList() 获取过户人员
 ** @function getSalesList() 获取销售人员
 ** @function operationAssessWindow() 保存过户
 ** @function validatorAssessInfo() 校验过户
 ** @function checkPhone() 校验手机号
 ** @function saveTrans() 保存
 ** @function closePage() 关闭页面

 ** @function showMessageBox() 页面弹窗
 *
 *
 *********************************************************************************************/
import uploadImg from "../../components/certification/uploadImg";
export default {
  components: {
    uploadImg,
  },
  data() {
    return {
      transferData: {
        carId: "",
        carNumber: "",
        transferLocation: "",
        salePerson: "",
        transferPerson: "",
        oldOwner: "",
        oldPhone: "",
        oldCarNo: "",
        newOwner: "",
        newPhone: "",
        newCarNo: "",
        bak: "",
        brandCarModels: "",
      },
      carId: "",
      carInfo: "",
      salesList: [],
      transList: [],
      imageUrl: "",
      fileList: [],
    };
  },
  computed: {
    //获取vuex存储的已预览标签页
  },
  created() {
    if (this.$route.query.id) {
      this.carId = this.$route.query.id;
    }
    this.getCarInfo();
    this.getTransList();
    this.getSalesList();
  },
  mounted() {
    // this.getRoleData();
  },
  methods: {
    getCarInfo() {
      this.$axios
        .post(this.pathItem.findParticularsById, {
          id: this.carId,
        })
        .then((res) => {
          if (res.code == 0) {
            this.carInfo = res.result;
            this.transferData.oldOwner = res.result.bookName;
            this.transferData.oldPhone = res.result.bookPhone;
            this.transferData.oldCarNo = res.result.carNo;
            this.transferData.carNumber = res.result.carNumber;
          }
        });
    },
    getTransList() {
      this.$axios.post(this.pathItem.getAllOpactor, {}).then((res) => {
        if (res.code == 0) {
          this.transList = res.result.systemUserInfoDealersList;
        }
      });
    },
    getSalesList() {
      this.$axios
        .post(this.pathItem.querySystemUserInfoDealersList, {})
        .then((res) => {
          if (res.code == 0) {
            this.salesList = res.result.systemUserInfoDealersList;
          }
        });
    },
    // 对话框确认操作   type：0关闭  1保存
    operationAssessWindow(type) {
      let message = "";
      let thenOperation = "";
      if (type == 0) {
        message = "若直接关闭当前窗口，所有信息将不能保存，请再次确认！";
        thenOperation = () => {
          this.closePage();
        };
      } else {
        message = "是否确认过户？";
        thenOperation = () => {
          this.saveTrans();
        };
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
          index: this.transferData.oldOwner,
          msg: "请输入原车主姓名",
        },
        {
          index: this.transferData.oldPhone,
          msg: "请输入原车主电话",
        },
        {
          index: this.transferData.newOwner,
          msg: "请输入新车主姓名",
        },
        {
          index: this.transferData.newPhone,
          msg: "请输入新车主电话",
        },
        {
          index: this.transferData.salePerson,
          msg: "请选择销售顾问",
        },
      ];
      if (
        !this.checkPhone(this.transferData.oldPhone) ||
        !this.checkPhone(this.transferData.newPhone)
      ) {
        this.showMessageBox("error", "请输入正确的手机号");
        isValidator = false;
        return;
      }
      for (var i in validatorList) {
        if (!validatorList[i].index) {
          isValidator = false;
          this.showMessageBox("error", validatorList[i].msg);
          break;
        }
      }
      return isValidator;
    },
    checkPhone(phoneNum) {
      var re = /^1[3456789]\d{9}$/;
      if (re.test(phoneNum)) {
        return true;
      } else {
        return false;
      }
    },
    saveTrans() {
      this.transferData.carId = this.carId;
      if (!this.validatorAssessInfo()) {
        return;
      }
      this.$refs.newDriveCard.saveImg();

      // this.transferData.carInfo = this.carInfo;
    },
    choseNewDrive(choseInfo) {

      if (choseInfo.status) {
        if (choseInfo.carFileList && choseInfo.carFileList.length) {
          this.fileList = this.fileList.concat(choseInfo.carFileList);
        }
        this.$refs.newOwnerFront.saveImg();
      }
    },
    choseNewOwnerFront(choseInfo) {
      if (choseInfo.status) {
        if (choseInfo.carFileList && choseInfo.carFileList.length) {
          this.fileList = this.fileList.concat(choseInfo.carFileList);
        }
        this.$refs.newOwnerBack.saveImg();
      }
    },
    choseNewOwnerBack(choseInfo) {
      if (choseInfo.status) {
        if (choseInfo.carFileList && choseInfo.carFileList.length) {
          this.fileList = this.fileList.concat(choseInfo.carFileList);
        }
        this.$refs.transInvoice.saveImg();
      }
    },
    choseTransInvoice(choseInfo) {
      if (choseInfo.status) {
        if (choseInfo.carFileList && choseInfo.carFileList.length) {
          this.fileList = this.fileList.concat(choseInfo.carFileList);
        }
        this.$refs.transContract.saveImg();
      }
    },
    choseTransContract(choseInfo) {
      if (choseInfo.status) {
        if (choseInfo.carFileList && choseInfo.carFileList.length) {
          this.fileList = this.fileList.concat(choseInfo.carFileList);
        }
        this.$refs.quAContract.saveImg();
      }
    },
    choseQuAContract(choseInfo) {
      if (choseInfo.status) {
        if (choseInfo.carFileList && choseInfo.carFileList.length) {
          this.fileList = this.fileList.concat(choseInfo.carFileList);
        }
        this.transferData.brandCarModels =
          this.carInfo.brandName +
          this.carInfo.seriesName +
          this.carInfo.modelName;
        this.$axios
          .post(this.pathItem.saveOrEditCarTransferInfo, this.transferData)
          .then((res) => {
            if (res.code == 0) {
              this.showMessageBox("success", "保存成功");

              if (this.fileList.length) {
                this.$axios
                  .post(this.pathItem.addOrUpdateFileList, {
                    carFileList: this.fileList,
                  })
                  .then((imgRes) => {
                    
                    if (imgRes.code != 0) {
                      this.$message.error(imgRes.message);
                    } else {
                      this.showMessageBox("success", "上传成功");
                       
                    }
                    this.closePage();
                  })
                  .catch((imgCatres) => {
                    this.$message.error(imgCatres.message);
                  });
              } else {
                this.closePage();
              }
            } else {
              this.showMessageBox("error", res.message);
            }
          })
          .catch((res) => {
            this.showMessageBox("error", res.message);
          });
      }
    },
    closePage() {
      var createWorkList = {
        name: "sellTransferEdit",
        query: this.$route.query,
      };

      this.$store.dispatch("delVisitedViews", createWorkList).then(() => {
        this.$router.back();
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
.carAssessOperation {
  padding-bottom: 100px;
  .main-content {
    background-color: #fff;
    padding: 15px 30px;
    margin-bottom: 10px;
    font-size: 13px;
    .form-content {
      margin: auto 30px;
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
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}

.dialog-footer {
  text-align: center;
}
</style>
<style>
.carAssessOperation .el-col {
  margin-top: 12px;
}
.avatar-uploader .el-upload {
  background-color: #fbfdff;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
</style>