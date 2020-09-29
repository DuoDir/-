<template>
  <div style="position: relative;height: 100%;">
    <div style="height: 100%; overflow-y: auto">
      <pdf
        class="active-img"
        :src="pdfUrl"
        :page="currentPdfPage"
        @num-pages="pageCount = $event"
        @page-loaded="currentPdfPage = $event"
        @loaded="loadPdfHandler"
      ></pdf>
    </div>
    <div class="page-pre" @click="changePdfPage(0)" v-if="currentPdfPage > 1">
      <i class="el-icon-back"></i>
    </div>
    <div
      class="page-next"
      @click="changePdfPage(1)"
      v-if="currentPdfPage < pageCount && pageCount > 1"
    >
      <i class="el-icon-right"></i>
    </div>
  </div>
</template>

<script>
import pdf from "vue-pdf";
import CMapReaderFactory from "vue-pdf/src/CMapReaderFactory.js";
export default {
  props: {
    pdfUrl: "",
  },
  components: {
    pdf,
  },
  data() {
    return {
      currentPdfPage: 0,
      pageCount: 0,
    };
  },
  methods: {
    loadPdfHandler() {
      this.currentPdfPage = 1; // 加载的时候先加载第一页
    },
    // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
    changePdfPage(val) {
      if (val === 0 && this.currentPdfPage > 1) {
        this.currentPdfPage--;
      }
      if (val === 1 && this.currentPdfPage < this.pageCount) {
        this.currentPdfPage++;
      }
    },
  },
  mounted() {},
};
</script>

<style scoped>
.page-pre,
.page-next {
  position: absolute;
  bottom: 0px;
  font-size: 40px;
  left: 50%;
  z-index: 10;
  cursor: pointer;
}
.page-pre {
  margin-left: -80px;
}
.page-next {
  margin-right: -80px;
}
</style>