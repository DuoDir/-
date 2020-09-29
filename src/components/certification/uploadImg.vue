<template>
  <div class="upload-components">
    <div v-if="type == 1">
      <el-upload
        action
        :class="{ disable: hasLimitTop }"
        ref="myUpload"
        class="avatar-uploader"
        :multiple="true"
        :limit="limit"
        :auto-upload="false"
        :http-request="uploadfile"
        :file-list="fileList"
        :on-change="fileChange"
        :on-exceed="handleExceed"
        accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.GIF"
        list-type="picture-card"
      >
        <i slot="default" class="el-icon-plus"></i>
        <div slot="file" slot-scope="{ file }" class="img-box">
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <i class="el-icon-zoom-in"></i>
            </span>
            <span
              class="el-upload-list__item-delete"
              @click="handleRemove(file, fileList)"
            >
              <i class="el-icon-delete"></i>
            </span>
          </span>
          <div
            class="img-name"
            v-if="name && fileList.length && fileList[0] == file"
          >
            <span v-if="isNeed" style="color: #f56c6c">*</span>
            {{ name }}
          </div>
        </div>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
    </div>

    <div v-if="type == 2">
      <el-upload
        class="file-uploader"
        action
        ref="myUpload"
        multiple
        list-type="picture"
        :limit="limit"
        :on-exceed="handleExceed"
        :auto-upload="false"
        :http-request="uploadfile"
        :file-list="fileList"
        accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.GIF,.pdf,.PDF"
        :on-change="fileChange"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="file" slot-scope="{ file }" class="img-box">
          <img
            class="el-upload-list__item-thumbnail"
            :src="checkPdf(file) ? pdfUrl : file.url"
            alt
          />
          <div>{{ name }}</div>
          <span class="el-upload-list__item-actions">
            <span class="preview-btn" @click="handlePictureCardPreview(file)">
              <i class="el-icon-zoom-in"></i>
            </span>
            <span class="file-upload-delete" @click="handleRemove(file)">
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png/pdf文件</div>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible" width="80%" height="80%">
        <template v-if="picOrPdf == 1">
          <img width="100%" :src="dialogImageUrl" alt />
        </template>
        <template v-if="picOrPdf == 2">
          <div class="page-pre" @click="changePdfPage(0)" v-if="currentPage > 1">
            <i class="el-icon-arrow-left"></i>
          </div>
          <div class="page-next"  @click="changePdfPage(1)" v-if="currentPage < pageCount && pageCount > 1"><i class="el-icon-arrow-right"></i></div>
          <pdf
            style="width: 100%; min-height: 500px"
            :src="dialogImageUrl"
            :page="currentPage"
            @num-pages="pageCount = $event"
            @page-loaded="currentPage = $event"
            @loaded="loadPdfHandler"
          ></pdf>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
/*********************************************************************************************
 *                               上传文件组件说明
 ** @function fileChange(file,fileList) 文件change 的回调 @param file 上传的文件 @param fileList 文件列表
 ** @function checkPdf(file) 检车是否为pdf 文件 @param file 文件实体
 ** @function handleRemove(file,fileList) 删除文件  @param file 删除的文件
 ** @function removePic(url,fileList) 删除文件list 中对应的项 @param url 文件地址, @param fileList 文件集合
 ** @function handleExceed() 文件超出数量后的回调
 ** @function handlePictureCardPreview(file) 图片，文件预览 @param file 文件实体
 ** @function getImgList() h获取对应的文件列表
 ** @function uploadfile() 上传文件
 ** @function saveImg() 保存图片
 ** @function changePdfPage(val) pdf 翻页 @param val 0上一页 1下一页
 *
 *********************************************************************************************/
import pdf from "vue-pdf";
import CMapReaderFactory from "vue-pdf/src/CMapReaderFactory.js";

export default {
  name: "uploadImg",
  props: {
    limit: "", //上传文件的限制数量
    tableName: "", //文件主表
    typeFile: "", //文件子分类
    carId: "", //车辆id
    name: "", //文件名称
    hasUrl: "",//回显文件信息
    isNeed: false, //是否必须，
    type: "", //文件类型，1图片 2文件
  },
  components: {
    pdf,
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      formate: "",
      fileList: [],
      unUploadFiles: [],
      picOrPdf: 1,
      hasLimitTop: false,
      deleteList: [],
      currentPage: 0,
      pageCount:0,
      pdfLoading: false,
    };
  },
  mounted() {
    this.getImgList();
  },
  watch: {
    carId(val) {
      this.getImgList();
    },
  },
  computed: {
    pdfUrl() {
      return require("../../assets/images/pdf-bg.png");
    },
  },
  methods: {
    fileChange(file, fileList) {
      let typeList = ["jpg", "jpeg", "gif", "JPG", "JPEG", "GIF", "png"];
      let message = "只能上传png/jpg文件";
      if (this.type == 2) {
        typeList = typeList.concat(["pdf", "PDF"]);
        message = "只能上传png/jpg/pdf文件";
      }
      this.fileList = fileList.filter((item) => {
        let fileType = "";
        if (item.raw) {
          fileType = item.raw.type.split("/")[1];
        } else {
          fileType = item.url.substring(item.url.lastIndexOf(".") + 1);
        }
        if (typeList.includes(fileType)) {
          return item;
        } else {
          this.$message.error(message);
        }
      });
    },
    checkPdf(file) {
      if (file.name) {
        if (file.name.indexOf(".pdf") > -1 || file.name.indexOf(".PDF") > -1) {
          return true;
        }
      }
      if (file.url) {
        if (file.url.indexOf(".pdf") > -1 || file.url.indexOf(".PDF") > -1) {
          return true;
        }
      }
      return false;
    },

    handleRemove(file, fileList) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (file.id) {
            this.fileList.forEach((item) => {
              if (item.id == file.id) {
                item.isDelete = 2;
                this.deleteList.push(item);
              }
            });
            this.removePic(file.url, this.fileList);
          } else {
            if (file.tableName) {
              this.removePic(file.url, this.fileList);
            } else {
              this.removePic(file.url, this.$refs.myUpload.uploadFiles);
            }
          }
        })
        .catch(() => {});
    },
    removePic(url, fileList) {
      for (let index = 0; index < fileList.length; index++) {
        const element = fileList[index];
        if (element.url == url) {
          fileList.splice(index, 1);
          break;
        }
      }
    },
    handleExceed(files, fileList) {
      this.$message.error(`最多上传${this.limit}个文件`);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      if (this.checkPdf(file)) {
        this.picOrPdf = 2;
        this.dialogImageUrl = pdf.createLoadingTask({
          url: file.url,
          CMapReaderFactory,
        });
      } else {
        this.picOrPdf = 1;
      }
      this.dialogVisible = true;
    },
    getImgList() {
      this.$axios
        .post(this.pathItem.getFileListByTableAndMainKey, {
          tableName: this.tableName,
          mainKey: this.carId,
          typeFile: this.typeFile,
        })
        .then((res) => {
          if (res.code == 0) {
            this.fileList = res.result.filter((item) => {
              return item.isDelete != 2;
            });
            if (this.hasUrl) {
              this.fileList = this.hasUrl.filter((item) => {
                return item.isDelete != 2;
              });
            }
          } else {
            this.fileList = [];
            if (this.hasUrl) {
              this.fileList = this.hasUrl.filter((item) => {
                return item.isDelete != 2;
              });
            }
          }
        });
    },

    uploadfile(param) {
      this.formate.append("multipartFiles", param.file);
    },
    cancleDelete() {
      this.deleteList.forEach((item) => {
        item.isDelete == 1;
      });
      this.fileList = this.fileList.concat(this.deleteList);
    },
    saveImg() {
      this.formate = new FormData();
      this.$refs.myUpload.submit();
      if (this.fileList.length == 0) {
        if (this.isNeed) {
          this.$message.error("请先上传文件");
          this.$emit("imgUpload", { status: false });
          return false;
        }
        this.$emit("imgUpload", { status: true });
      } else {
        var newFile = this.fileList.filter((item) => {
          return !item.id;
        });
        var carFileList = [];
        if (newFile.length > 0) {
          this.$axios
            .post(this.pathItem.imagesUpload, this.formate, {
              headers: {
                "Content-Type": "multipart/form-data",
                enctype: "multipart/form-data",
              },
            })
            .then((res) => {
              if (res.code == 0) {
                if (res.result.length > 0 && res.result) {
                  res.result.forEach((item) => {
                    carFileList.push({
                      tableName: this.tableName,
                      mainKey: this.carId,
                      typeFile: this.typeFile,
                      nameFile: this.name,
                      url: item.objectUrl,
                    });
                  });
                }
                carFileList = carFileList.concat(this.deleteList);
                this.$emit("imgUpload", {
                  status: true,
                  carFileList: carFileList,
                });
              } else {
                this.$message.error(res.message);
                this.$emit("imgUpload", { status: false });
              }
            })
            .catch((res) => {
              this.$message.error(res.message);
            });
        } else {
          carFileList = carFileList.concat(this.deleteList);
          this.$emit("imgUpload", {
            status: true,
            carFileList: carFileList,
          });
        }
      }
    },
    // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
    changePdfPage(val) {
  
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--;
    
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++;
      }
    },
    // pdf加载时
    loadPdfHandler(e) {
      this.currentPage = 1; // 加载的时候先加载第一页
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
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.img-box {
  max-width: 146px;
  height: 146px;
}
.avatar-uploader .img-box {
  position: relative;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.img-name {
  position: absolute;
  bottom: -25px;
  left: 0;
  width: 100%;
  text-align: left;
  padding-left: 5px;
}
.file-uploader .el-upload-list__item-actions {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  border: none;
  text-align: center;
  line-height: 1.8;
  -webkit-transition: opacity 0.3s;
  transition: opacity 0.3s;
  opacity: 0;
  font-size: 20px;
  cursor: pointer;
  color: #ffffff;
}
.file-uploader .el-upload-list__item-actions:hover {
  opacity: 1;
}
.file-uploader .el-upload-list__item-actions span {
  display: none;
  cursor: pointer;
}
.file-uploader .el-upload-list__item-actions:hover span {
  display: inline-block;
}
.file-uploader .preview-btn {
  margin-top: 25px;
  margin-right: 15px;
}
.page-pre,
.page-next {
  width: 100px;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  position: absolute;
  left: 0;
  top: 40%;
  z-index: 10;
  cursor: pointer;
}
.page-next {
  left: auto;
  right: 0;
  text-align: right;
}
.page-pre i,
.page-next i {
  font-size: 60px;
}
</style>
<style>
.avatar-uploader .el-upload-list--picture-card .el-upload-list__item {
  overflow: visible;
  height: 170px;
  border: none;
}
</style>