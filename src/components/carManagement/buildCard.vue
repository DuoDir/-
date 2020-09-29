<template>
  <div>
    <!-- 建卡弹框 -->
    <el-dialog title="建卡" :visible="true" width="70%" @close="closeDialog">
      <el-row style="margin:15px auto">
        <el-col :span="4" class="col-text-right">
          <span class="cRed">*</span>车主姓名：
        </el-col>
        <el-col :span="7">
          <el-input
            class="dialog-input"
            v-model="dialogEditData.bookName"
            maxlength="10"
            size="small"
          ></el-input>
        </el-col>
        <el-col :span="4" class="col-text-right">
          <span class="cRed">*</span>车主电话：
        </el-col>
        <el-col :span="7">
          <el-input
            class="dialog-input"
            v-model="dialogEditData.bookPhone"
            maxlength="11"
            @blur="checkPhoneUse"
            size="small"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="margin:15px auto">
        <el-col :span="4" class="col-text-right">
          <span class="cRed">*</span>品牌车型：
        </el-col>
        <el-col :span="7">
          <carBrandSerise
            @seriseChangeVal="seriseChangeVal"
            @brandChangeVal="brandChangeVal"
            @modelChangeVal="modelChangeVal"
            :hasModel="true"
          ></carBrandSerise>
        </el-col>
        <el-col :span="4" class="col-text-right">车牌号：</el-col>
        <el-col :span="7">
          <el-input class="dialog-input" v-model="dialogEditData.carNo" maxlength="10" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin:15px auto">
        <el-col :span="4" class="col-text-right">
          <span class="cRed">*</span>评估师：
        </el-col>
        <el-col :span="7">
          <el-select
            v-model="dialogEditData.assessorId"
            placeholder="请选择角色类型"
            size="small"
            @change="assessorChange"
          >
            <el-option
              v-for="role in roleTypes"
              :key="role.id"
              :label="role.userName"
              :value="role.id"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogConfirmSave(0)">保 存</el-button>
        <!-- <el-button type="primary" @click="dialogConfirmSave(1)">保存并检测</el-button> -->
        <el-button @click="closeDialog">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/*********************************************************************************************
 *                                车辆建卡
 ** @function findAppraiserList() 获取评估师
 ** @function seriseChangeVal(selectName) 选择车辆车系 @param selectName 选择的内容
 ** @function brandChangeVal(selectName) 选择车辆品牌 @param selectName 选择的内容
 ** @function modelChangeVal(selectName) 选择车辆型号 @param selectName 选择的内容
 ** @function dialogConfirmSave() 保存建卡
 ** @function showMessageBox() 页面弹窗
 ** @function checkPhone() 校验手机号
 ** @function assessorChange() 选择评估师
 ** @function closeDialog() 关闭弹窗

 *********************************************************************************************/
import carBrandSerise from "../../components/certification/selectCarBrand";
export default {
  components: {
    carBrandSerise,
  },
  data() {
    return {
      dialogEditData: {
        bookName: "",
        bookPhone: "",
        assessor: "",
        assessorId: "",
        carNo: "",
        brandName: "",
        brandId: "",
        seriesName: "",
        seriesId: "",
        modelName: "",
        modelId: "",
      },
      carBrandName: "",
      carSeriesName: "",
      carModelName: "",
      appraiserId: "",
      roleTypes: [],
    };
  },
  mounted() {
    this.findAppraiserList();
  },
  methods: {
    findAppraiserList() {
      var params = {
        roleTypes: 2,
      };
      this.$axios.post(this.pathItem.findAppraiserList, params).then((res) => {
        if (res.code == 0) {
          this.roleTypes = res.result.systemUserInfoDealersList;
        }
      });
    },
    seriseChangeVal(selectName) {
      this.carSeriesName = selectName.carSeriesName;
      this.dialogEditData.seriesName = this.carSeriesName;
      this.dialogEditData.seriesId = selectName.carSeriesId;
    },
    brandChangeVal(selectName) {
      this.carBrandName = selectName.carBrandName;
      this.dialogEditData.brandName = this.carBrandName;
      this.dialogEditData.brandId = selectName.carBrandId;
    },
    modelChangeVal(selectName) {
      this.carModelName = selectName.carModelName;
      this.dialogEditData.modelName = this.carModelName;
      this.dialogEditData.modelId = selectName.carModelId;
    },
    dialogConfirmSave(type) {
      let validatorList = [
        {
          index: this.dialogEditData.bookName,
          msg: "请输入车主姓名",
        },
        {
          index: this.dialogEditData.assessorId,
          msg: "请选择评估师",
        },
        {
          index: this.dialogEditData.brandName,
          msg: "请选择品牌车型",
        },
        {
          index: this.dialogEditData.seriesName,
          msg: "请选择品牌车型",
        },
        {
          index: this.dialogEditData.modelName,
          msg: "请选择品牌车型",
        },
        {
          index: this.dialogEditData.bookPhone,
          msg: "请输入手机号",
        },
      ];
      for (var i in validatorList) {
        if (!validatorList[i].index) {
          this.showMessageBox("error", validatorList[i].msg);
          return;
        }
      }
      if (!this.checkPhone(this.dialogEditData.bookPhone)) {
        this.showMessageBox("error", "请输入正确的手机号");
        return;
      }

      var params = {};
      for (var key in this.dialogEditData) {
        if (this.dialogEditData[key] !== "") {
          params[key] = this.dialogEditData[key];
        }
      }

      this.$axios
        .post(this.pathItem.addOrUpdCar, params)
        .then((res) => {
          if (res.code == 0) {
            this.showMessageBox("success", "车辆建卡成功");
            this.$emit("successBuild", { type: 1 });
          } else {
            this.showMessageBox("error", res.message);
          }
        })
        .catch((res) => {
          this.showMessageBox("error", res.message);
        });

      // this.dialogVisible = false;
      // if (type == 1) {
      //   this.$router.push({
      //     path: "/carAssessOperation",
      //     // query: { params: row.roleName },
      //   });
      // } else {
      //   this.showMessageBox("error", "调接口");
      // }
    },

    showMessageBox(type, message) {
      this.$message({
        type: type,
        message: message,
        offset: 400,
        duration: 1000,
      });
    },

    checkPhone(phoneNum) {
      var re = /^1[3456789]\d{9}$/;
      if (re.test(phoneNum)) {
        return true;
      } else {
        return false;
      }
    },
    assessorChange(val) {
      if (val) {
        var choseItem = this.roleTypes.filter((item) => {
          return item.id == val;
        });
        this.dialogEditData.assessor = choseItem[0].userName;
      } else {
        this.dialogEditData.assessor = "";
      }
    },
    checkPhoneUse() {
      var phoneParams = {};
      phoneParams.bookPhone = this.dialogEditData.bookPhone;
      phoneParams.pageNo = 1;
      phoneParams.pageSize = 10;
      this.$axios
        .post(this.pathItem.checkUserCar, phoneParams)
        .then((res) => {
          if (res.result.records.length > 0) {
            this.$confirm("该电话已预约车辆进行检测，请直接查看", "提示", {
              cancelButtonText: "关闭",
              confirmButtonText: "去查看",
              type: "warning",
            })
              .then(() => {
                this.$emit("successBuild", {
                  type: 2,
                  phone: this.dialogEditData.bookPhone,
                });
              })
              .catch(() => {});
          } else {
          }
        })
        .catch((res) => {});
    },
    closeDialog() {
      this.$emit("closeBuildCard", false);
    },
  },
  created() {},
};
</script>

<style>
</style>