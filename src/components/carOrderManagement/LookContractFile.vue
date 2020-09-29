<template>
  <div class="LookContractFile">
    <el-dialog title="销售合同" :visible="true" width="80%" top="10vh" @close="closeDialog()">
      <template v-if="fileType==2">
        <el-carousel indicator-position="outside" :autoplay="false">
          <el-carousel-item v-for="item in filesList" :key="item">
            <img class="fileImg" :src="item">
          </el-carousel-item>
        </el-carousel>
      </template>
      <template v-else>
        <div >
           <pdfView :pdfUrl="filesList[0]"></pdfView>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import pdfView from "../../components/certification/pdfView";
// import CMapReaderFactory from "vue-pdf/src/CMapReaderFactory.js";
export default {
  components: {
    pdfView,
  },
  props: {
    fileList: String,
    fileType: Number,
  },
  data() {
    return {
      dialogVisible: true,
      filesList: [],
    };
  },
  mounted() {
    this.filesList = this.fileList.split(",");
  },
  methods: {
    closeDialog() {
      this.$emit("closeFileDialog");
    },
  },
};
</script>
<style lang="scss" scoped>
.LookContractFile {
  .fileImg {
    width: 100%;
    height: 100%;
  }
  /deep/ .el-carousel__container {
    height: 800px;
  }
}
</style>