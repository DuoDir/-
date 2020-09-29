<template>
  <div>
    <el-dialog title="上传销售照片（最多20张）" :visible="true" width="70%" @close="closeDialog">
      <div slot="title">
        <div class="">上传销售照片（最多20张）<span style="color:#F56C6C">*照片尺寸：支持 1：0.73</span></div>
      </div>
      <uploadImg
        ref="uploadImg"
        :type="1"
        :isNeed="true"
        @imgUpload="choseIMG"
        :limit="20"
        :name="imgName"
        :tableName="4"
        :typeFile="401"
        :carId="carId"
      ></uploadImg>
      <span slot="footer">
        <el-button type="primary" @click="savaImg">保 存</el-button>
        <el-button @click="closeDialog">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/*********************************************************************************************
 *                                车辆上传销售照片
 ** @function dialogConfirmStorage() 对话框操作
 ** @function closeDialog() 关闭弹窗
 ** @function showMessageBox() 页面弹窗
 *
 *********************************************************************************************/
import uploadImg from "../../components/certification/uploadImg"; //图片上传
export default {
  props: {
    carId: "",
  },
  components: {
    uploadImg,
  },
  data() {
    return {
      dialogImgCarId: "",
      imgName: "左前45°",
    };
  },
  methods: {
    savaImg(params) {
      this.$refs.uploadImg.saveImg();
    },
    choseIMG(upResult) {
      if (upResult.status) {
        if (upResult.carFileList && upResult.carFileList.length) {
          this.$axios
            .post(this.pathItem.addOrUpdateFileList, {
              carFileList: upResult.carFileList,
            })
            .then((imgRes) => {
              if (imgRes.code != 0) {
  
                this.$message.error(imgRes.message);
              } else {
                this.showMessageBox("success", "上传成功");
                this.$emit("successUpload");
              }
            })
            .catch((imgCatres) => {
              this.$message.error(imgCatres.message);
            });
        }else{
            this.$emit("successUpload");
        }
      }
    },
    closeDialog() {
      this.$emit("closeImgDialog");
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
  mounted() {
    this.dialogImgCarId = this.carId;
  },
};
</script>

<style>
</style>