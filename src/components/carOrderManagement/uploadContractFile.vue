<template>
  <div>
    <el-dialog title="上传销售合同" :visible="true" width="70%" @close="closeDialog">
      <el-upload action ref="uploadImg" class="avatar-uploader" :multiple="true" :limit="limit" accept=".jpg,.jpeg,.png,.gif,.pdf,.JPG,.JPEG,.GIF,.PDF" :auto-upload="false" :http-request="uploadfile"
        :file-list="fileList" :on-change="fileChange" :on-exceed="handleExceed">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png/pdf文件，且不超过500kb</div>
      </el-upload>
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

export default {
  props: {
    orderId: "",
  },
  data() {
    return {
      limit: 30,
      fileList: [],
    };
  },
  methods: {
    savaImg() {
      if (this.fileList.length == 0) {
        this.showMessageBox("error", "请先上传文件");
        return;
      }
      this.formate = new FormData();
      this.$refs.uploadImg.submit();

      this.$axios
        .post(this.pathItem.imagesUpload, this.formate, {
          headers: {
            "Content-Type": "multipart/form-data",
            enctype: "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.code == 0) {
            if (res.result && res.result.length > 0) {
              var orderFile = "",
                fileType = 1;
              res.result.forEach((item, index) => {
                fileType =
                  item.postfix == "pdf" || item.postfix == "PDF" ? 1 : 2;
                if (index == 0) {
                  orderFile = item.objectUrl;
                } else {
                  orderFile = orderFile + "," + item.objectUrl;
                }
              });
              this.choseIMG(orderFile, fileType);
            }
          } else {
            this.$message.error(res.message);
          }
        });
    },
    choseIMG(orderFile, fileType) {
      let params = {
        id: this.orderId,
        accessory: orderFile,
        fileType: fileType,
      };
      this.$axios
        .post(this.pathItem.uploadSalesContract, params)
        .then((res) => {
          if (res.code == 0) {
            this.showMessageBox("success", "上传成功");
            this.$emit("successUpload");
          } else if (res.code == -1) {
            let message = "上传成功，" + res.message;
            this.$alert(message, "提示", {
              confirmButtonText: "确认",
              type: "warning",
            });
            this.$emit("successUpload");
          } else {
            this.showMessageBox("error", res.message);
          }
        });
    },
    closeDialog() {
      this.$emit("closeImgDialog");
    },
    uploadfile(param) {
      this.formate.append("multipartFiles", param.file);
    },
    fileChange(file, fileList) {
      let typeList = ["jpg", "jpeg", "gif", "JPG", "JPEG", "GIF", "png"];
      let raw = file.raw.type.split("/")[1];

      if (raw == "pdf" || raw == "PDF") {
        this.fileList = [];
        this.fileList.push(file);
      } else {
        this.fileList = fileList.filter((item) => {
          let fileType = item.raw.type.split("/")[1];
          if (typeList.includes(fileType)) {
            return item;
          }
        });
      }
      if (!typeList.includes(raw) && raw != "pdf" && raw == "PDF") {
        this.showMessageBox("error", "请上传jpg/png/pdf文件");
      }
    },
    handleExceed(files, fileList) {
      this.showMessageBox("error", `最多上传${this.limit}个文件`);
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

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload-list--picture-card .el-upload-list__item-thumbnail {
  border-radius: 6px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
</style>