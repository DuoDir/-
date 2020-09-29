<template>
  <div>
    <el-dialog title="销售定价" :visible="true" width="70%" @close="closeDialog">
      <el-form
        ref="dialogSellPriceInfo"
        :model="dialogSellPriceInfo"
        label-width="120px"
        style="width:80%;margin:auto;"
        size="small"
        :rules="rules"
      >
        <el-form-item label="品牌车型：">
          <el-input disabled v-model="dialogSellBrandName"></el-input>
        </el-form-item>
        <el-form-item label="所属经销商：">
          <el-input disabled v-model="dialogSellPriceInfo.orgName"></el-input>
        </el-form-item>
        <el-form-item label="评估价：">
          <el-input disabled v-model="dialogSellPriceInfo.evaluatePrice"></el-input>
        </el-form-item>
        <el-form-item label="采购价格：">
          <el-input disabled v-model="dialogSellPriceInfo.buyPrice"></el-input>
        </el-form-item>
        <el-form-item label="整备实际费用：">
          <el-input disabled v-model="dialogSellPriceInfo.workFee"></el-input>
        </el-form-item>
        <el-form-item label="销售类型：" prop="usalesType">
          <el-radio-group v-model="dialogSellPriceInfo.usalesType">
            <el-radio :label="1">认证零售</el-radio>
            <el-radio :label="2">普通零售</el-radio>
            <el-radio :label="3">批售</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="销售平台：" prop="dialogSellPlant">
          <el-checkbox-group v-model="dialogSellPriceInfo.dialogSellPlant">
      
            <el-checkbox label="2">H5营销平台</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="新车含税价：" prop="taxPrice">
          <el-input v-model.number="dialogSellPriceInfo.taxPrice"></el-input>
        </el-form-item>
        <el-form-item label="批售底价：" v-if="dialogSellPriceInfo.usalesType == 3" prop="upPrice">
          <el-input v-model.number="dialogSellPriceInfo.upPrice"></el-input>
          <span class="color-gray">预估毛利率为：{{marginRate}}（计算公式=（批售底价-收购价-整备费）/批售底价）</span>
        </el-form-item>
        <el-form-item label="挂牌价：" v-if="dialogSellPriceInfo.usalesType != 3" prop="upPrice">
          <el-input v-model.number="dialogSellPriceInfo.upPrice"></el-input>
          <span class="color-gray">预估毛利率为：{{marginRate}}（计算公式=（挂牌价-收购价-整备费）/挂牌价）</span>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="dialogConfirmStorage">保 存</el-button>
        <el-button @click="closeDialog">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/*********************************************************************************************
 *                                车辆销售定价
 ** @function dialogConfirmStorage() 对话框操作
 ** @function closeDialog() 关闭弹窗
 ** @function showMessageBox() 页面弹窗
 *
 *********************************************************************************************/
export default {
  props: {
    salesPriceInfo: "",
  },
  data() {
    return {
      dialogSellPriceInfo: {
        dialogSellPlant: [], //销售定价信息
      },
      dialogSellBrandName: "",
      rules: {
        usalesType: [
          { required: true, message: "请选择销售类型", trigger: "change" },
        ],
        dialogSellPlant: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个销售平台",
            trigger: "change",
          },
        ],
        taxPrice: [
          { required: true, message: "请输入新车含税价", trigger: "blur" },
          { type: "number", message: "价格必须为数字值" },
        ],
        upPrice: [
          { required: true, message: "请输入价格", trigger: "blur" },
          { type: "number", message: "价格必须为数字值" },
        ],
      },
    };
  },
  methods: {
    //对话框确定入库操作
    dialogConfirmStorage() {
      this.$refs["dialogSellPriceInfo"].validate((valid) => {
        if (valid) {
          var params = {};
          if (this.dialogSellPriceInfo.uid) {
            params.id = this.dialogSellPriceInfo.uid;
          }
          params.upPrice = this.dialogSellPriceInfo.upPrice;
          params.taxPrice = this.dialogSellPriceInfo.taxPrice;
          params.saleType = this.dialogSellPriceInfo.usalesType;
          params.saleChannel = this.dialogSellPriceInfo.dialogSellPlant.join(
            ","
          );
          params.carId = this.dialogSellPriceInfo.id;
          params.buyPrice = this.dialogSellPriceInfo.buyPrice;
          params.repairFee = this.dialogSellPriceInfo.workFee;
          this.$axios
            .post(this.pathItem.addOrUpdSalesPrice, params)
            .then((res) => {
              if (res.code == 0) {
                this.showMessageBox("success", "保存成功");
                this.closeDialog();
              }
            });
        } else {
          return false;
        }
      });
    },
    closeDialog() {
      this.$emit("closeSalesPrice");
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
  computed: {
    marginRate() {
      var upPrice = this.dialogSellPriceInfo.upPrice
        ? Number(this.dialogSellPriceInfo.upPrice)
        : 0;
      var buyPrice = this.dialogSellPriceInfo.buyPrice
        ? Number(this.dialogSellPriceInfo.buyPrice)
        : 0;
      var workFee = this.dialogSellPriceInfo.workFee
        ? Number(this.dialogSellPriceInfo.workFee)
        : 0;

      var marginRates = (upPrice - buyPrice - workFee) / upPrice;
      var lastNum =  isNaN(marginRates) || marginRates== -Infinity ? "" :  (marginRates * 100).toFixed(2) + "%";
      return lastNum;
    },
  },
  mounted() {
    this.dialogSellPriceInfo = this.salesPriceInfo;
    if (this.dialogSellPriceInfo.usaleChannel) {
      this.dialogSellPriceInfo.dialogSellPlant = String(
        this.dialogSellPriceInfo.usaleChannel
      ).split(",");
      this.dialogSellPriceInfo.salesType = this.dialogSellPriceInfo.usalesType;

    } else {
      this.dialogSellPriceInfo.dialogSellPlant = [];
    }
    this.dialogSellBrandName =
      this.dialogSellPriceInfo.brandName +
      this.dialogSellPriceInfo.seriesName +
      this.dialogSellPriceInfo.modelName;
  },
  created() {},
};
</script>

<style>
</style>