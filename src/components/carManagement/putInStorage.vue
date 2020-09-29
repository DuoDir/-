<template>
  <div>
    <el-dialog title="车辆入库" :visible="true" width="60%" @close="closePutIn">
      <el-row style="margin:15px auto">
        <el-col :span="4" class="text-right">车辆编号：</el-col>
        <el-col :span="5">{{dialogStorageInfo.carNumber}}</el-col>
        <el-col :span="4" class="text-right">品牌车型：</el-col>
        <el-col
          :span="9"
        >{{dialogStorageInfo.brandName + dialogStorageInfo.seriesName + dialogStorageInfo.modelName}}</el-col>
      </el-row>
      <el-row style="margin:15px auto">
        <el-col :span="4" class="text-right">车牌号：</el-col>
        <el-col :span="5">{{dialogStorageInfo.carNo}}</el-col>
        <el-col :span="4" class="text-right">VIN码：</el-col>
        <el-col :span="9">{{dialogStorageInfo.vin}}</el-col>
      </el-row>

      <el-row style="margin-top:55px;">
        <el-col :span="4" class="col-text-right">采购价格：</el-col>
        <el-col :span="9">
          <el-input
            class="dialog-input"
            v-model="dialogStorageInfo.buyPrice"
            maxlength="10"
            size="small"
            @input="validatorPrice"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="margin:15px auto">
        <el-col :span="4" class="col-text-right">入库时间：</el-col>
        <el-col :span="12">
          <el-date-picker
            v-model="dialogStorageInfo.inTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            size="small"
          ></el-date-picker>
        </el-col>
      </el-row>
      <el-row style="margin:15px auto">
        <el-col :span="4" class="col-text-right">入库备注：</el-col>
        <el-col :span="12">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="dialogStorageInfo.inBak"
            maxlength="100"
          ></el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogConfirmStorage">确定入库</el-button>
        <el-button @click="closePutIn">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/*********************************************************************************************
 *                                车辆入库详情
 ** @function dialogConfirmStorage() 对话框确定入库操作
 ** @function closePutIn() 关闭弹窗
 ** @function validatorPrice() 校验采购价格
 ** @function showMessageBox() 页面弹窗
 *
 *********************************************************************************************/
export default {
  props: {
    putInStorageInfo: "",
  },
  data() {
    return {
      dialogStorageInfo: "", //车辆入库信息
    };
  },
  mounted() {
    this.dialogStorageInfo = this.putInStorageInfo;
  },
  methods: {
    //对话框确定入库操作
    dialogConfirmStorage() {
      this.dialogStorage = false;
      var params = {};
      params.id = this.dialogStorageInfo.id;
      params.buyPrice = this.dialogStorageInfo.buyPrice;
      params.inTime = this.dialogStorageInfo.inTime;
      params.inBak = this.dialogStorageInfo.inBak;
      if (!params.buyPrice) {
        this.showMessageBox("error", "请输入采购价格");
        return;
      }
      if (!params.inTime) {
        this.showMessageBox("error", "请输入入库时间");
        return;
      }
      this.$axios
        .post(this.pathItem.carputStorage, params)
        .then((res) => {
          if (res.code == 0) {
            this.showMessageBox("success", "入库成功");
    
            this.$emit("successPutIn")
          }
        })
        .catch((res) => {});
    },
    closePutIn(){
      this.$emit("closePutIn")
    },
    //校验采购价格
    validatorPrice(val) {
      var reg = /^([1-9]\d{0,10})|10000000000|0/;
      if (!reg.test(val)) {
        this.dialogStorageInfo.buyPrice = val.substring(0, val.length - 1);
      }
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
  created() {},
};
</script>

<style>
</style>