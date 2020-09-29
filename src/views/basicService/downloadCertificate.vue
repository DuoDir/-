<template>
  <div class="download-certificate">
    <el-header class="header">
      <span>车辆认证报告</span>
      <div style="float:right;">
        <el-button type="primary" icon="el-icon-download" @click="getPdf('认证证书')">保存到本地</el-button>
      </div>
    </el-header>
    <el-main style="padding-bottom: 15px;">
      <div style="padding:10px;max-width:1200px;margin:0 auto;min-height:500px" v-loading="loading">
        <!-- <pdf :src="pdfUrl" v-if="pdfUrl" ></pdf> -->
        <div class="pdf-box" id="pdfDom">
          <canvas class="pdf-canvas" id="pdfCanvas"></canvas>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script>
/*********************************************************************************************
 ** @function getPdfUrl() 获取pdf
 ** @function savePdf() 下载pdf
 *
 *********************************************************************************************/
import pdf from "vue-pdf";
import CMapReaderFactory from "vue-pdf/src/CMapReaderFactory.js";
export default {
  components: {
    pdf,
  },
  data() {
    return {
      rid: "",
      src: "",
      pdfUrl: "",
      loading: false,
      pdfData: "",
      textData: [
        {
          name: "",
          left: 680,
          top: 875,
        },
        {
          name: "",
          left: 1620,
          top: 870,
        },
        {
          name: "",
          left: 510,
          top: 1010,
          type: 2,
        },
        {
          name: "",
          left: 1680,
          top: 1015,
        },
        {
          name: "",
          left: 550,
          top: 1150,
        },
        {
          name: "",
          left: 1620,
          top: 1150,
        },
        {
          name: "",
          left: 720,
          top: 1290,
        },
        {
          name: "",
          left: 1620,
          top: 1290,
        },
        {
          name: "",
          left: 1600,
          top: 2275,
        },
      ],
      htmlTitle: "认证证书",
    };
  },
  mounted() {
    this.getPdfInfo();
  },
  methods: {
    getPdfUrl() {
      var that = this;
      this.$axios
        .post(
          this.pathItem.downLoadPdf,
          {
            rid: this.rid,
          },
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          if (res.code == 1) {
            this.$message.error(res.message);
          }
          let reader = new window.FileReader();
          // 使用readAsArrayBuffer读取文件, result属性中将包含一个 ArrayBuffer 对象以表示所读取文件的数据
          reader.readAsArrayBuffer(res);
          var that = this;
          reader.onload = function (e) {
            const result = e.target.result;
            // 生成blob图片,需要参数(字节数组, 文件类型)
            const blob = new Blob([result], {
              type: "application/pdf;charset=UTF-8",
            });
            // 使用 Blob 创建一个指向类型化数组的URL, URL.createObjectURL是new Blob文件的方法,可以生成一个普通的url,可以直接使用,比如用在img.src上
            var url = window.URL.createObjectURL(blob);
            that.src = url;
            that.pdfUrl = pdf.createLoadingTask({
              url: url,
              CMapReaderFactory,
            });
            that.loading = false;
          };
        });
    },
    getPdfInfo() {
      this.$axios
        .post(this.pathItem.getPdfData, {
          rid: this.rid,
        })
        .then((res) => {
          this.loading = false;
          if (res.code == 0) {
            this.pdfData = res.result;
            this.textData[0].name = res.result.orgName;
            this.textData[1].name = res.result.certifiedNum;
            this.textData[2].name = res.result.seriesModel;
            this.textData[3].name = res.result.engineNumber;
            this.textData[4].name = res.result.vin;
            this.textData[5].name =
              (res.result.mileage
                ? Number(res.result.mileage / 10000).toFixed(2)
                : "") + "万公里";
            this.textData[6].name = this.formatDate(
              res.result.registeredDate,
              "yyyy-MM"
            );
            this.textData[7].name = this.formatDate(
              res.result.passTime,
              "yyyy-MM-dd"
            );
            this.textData[8].name = res.result.assessor;
            this.$nextTick(() => {
              this.initPdfCanvas();
            });
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((res) => {
          this.$message.error(res.message);
        });
    },
    initPdfCanvas() {
      var that = this;
      var canvas = document.getElementById("pdfCanvas");
      var context = canvas.getContext("2d");
      var img = new Image();
      img.src = require("@/assets/images/receipt-bg.png");
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);

        for (let index = 0; index < that.textData.length; index++) {
          const element = that.textData[index];
          context.font = "54px Microsoft YaHei";
          context.fillStyle = "#333333";
          if (element.type == 2) {
                // context.font = "45px Microsoft YaHei";
            var text = element.name
            var chr = text.split("");
            var temp = "";
            var row = [];
            for (var a = 0; a < chr.length; a++) {
              if (context.measureText(temp).width < 760) {
                temp += chr[a];
              } else {
                a--; 
                row.push(temp);
                temp = "";
              }
            }
            row.push(temp);
            // if(row.length > 1){
            //     context.font = "45px Microsoft YaHei";
            // }
            for (var b = 0; b < row.length; b++) {
              context.fillText(row[b], element.left, element.top + b * 60);
            }
          } else {
            context.fillText(element.name, element.left, element.top);
          }
        }
      };
    },
    savePdf() {
      let aTag = document.createElement("a");
      aTag.href = this.src;
      aTag.download = "认证证书.pdf";
      // aTag.click();
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, true);
      aTag.dispatchEvent(evt);
    },
    formatDate(value, format) {
      if (value) {
        value = new Date(value);
        let o = {
          "M+": value.getMonth() + 1,
          "d+": value.getDate(),
          "h+": value.getHours(),
          "m+": value.getMinutes(),
          "s+": value.getSeconds(),
        };

        if (/(y+)/.test(format)) {
          format = format.replace(
            RegExp.$1,
            (value.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
          for (let k in o) {
            if (new RegExp(`(${k})`).test(format)) {
              format = format.replace(
                RegExp.$1,
                RegExp.$1.length == 1
                  ? o[k]
                  : ("00" + o[k]).substr(("" + o[k]).length)
              );
            }
          }
          return format;
        } else {
          return "--";
        }
      }
    },
  },
  created() {
    this.rid = this.$route.query.rid;
  },
};
</script>

<style scoped>
.pdf-bg {
  width: 100%;
  height: 100%;
}
.pdf-canvas {
  width: 100%;
  height: 100%;
}
</style>