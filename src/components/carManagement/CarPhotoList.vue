<template>
  <div class="carPhotoList">
    <div class="subHead">车辆照片</div>
    <el-row :gutter="5">
      <el-col v-for="(image,index)  in carImageList" :key="index" :span="3" class="cardetail-box">
        <el-image class="image-item" :src="image.url" ></el-image>
        <p style="text-align:center;">{{fomratImgName(Number(image.typeFile))}}</p>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <div class="subHead">手续照片</div>
    <el-row :gutter="5">
      <el-col v-for="(image,index)  in produceImageList" :key="index" :span="3" class="cardetail-box">
           <el-image class="image-item" :src="image.url" ></el-image>
        <!-- <img class="image-item" :src="image.url" :preview-src-list="" /> -->
        <p style="text-align:center;">{{fomratImgName(Number(image.typeFile))}}</p>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import fomratImgName from "../../assets/js/utils";
export default {
  props: {
    carInfo: "",
  },
  data() {
    return {
      carImageList: [],
      produceImageList: [],
      carId: "",
      carImgList: [],
      produceSrcList: [],
    };
  },
  methods: {
    getCarImg() {
      this.$axios
        .post(this.pathItem.getFileListByTableAndMainKey, {
          mainKey: this.carId,
          tableName: 1,
        })
        .then((res) => {
          if (res.code == 0) {
            this.carImageList = res.result;
            res.result.forEach((element) => {
              this.carImgList.push(element.url);
            });
          } else {
            this.carImageList = [];
          }
        });
    },
    getProduceImg() {
      this.$axios
        .post(this.pathItem.getFileListByTableAndMainKey, {
          mainKey: this.carId,
          tableName: 2,
        })
        .then((res) => {
          if (res.code == 0) {
            this.produceImageList = res.result;
            res.result.forEach((element) => {
              this.produceSrcList.push(element.url);
            });
          } else {
            this.carImageList = [];
          }
        });
    },
    fomratImgName(type) {
      return fomratImgName(type);
    },
  },
  mounted() {
    this.carId = this.carInfo.id;
    this.getCarImg();
    this.getProduceImg();
  },
};
</script>

<style lang="scss" scoped>
.image-item {
  // border: 3px solid #ebeef5;
  // padding: 3px;
  // width: 80%;
  max-height: 150px;
  width: 100%;
}
.cardetail-box{
  height: 190px;
}
</style>
<style>
.cardetail-box .el-image__error, 
.cardetail-box .el-image__inner, 
.cardetail-box .el-image__placeholder {
    min-height: 120px;
}
</style>