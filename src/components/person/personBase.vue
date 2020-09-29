<template>
  <el-container class="personBase">
    <el-main style="overflow:auto">
      <div style="margin:20px">
        <el-row class="secondTitle">工作经历</el-row>
        <div class="jobStyle" v-if="workList.length">
          <el-row v-for="(item,index) in workList" :key="index" :gutter="20">
            <el-col :span="6">
              <span>{{item.wrokTimeStr}}</span>
            </el-col>
            <el-col :span="8">
              <span>{{item.compan}}</span>
            </el-col>
            <el-col :span="5">
              <span>{{item.jobName}}</span>
              <span v-if="item.remark">
                (
                <span>{{item.remark}}</span>)
              </span>
            </el-col>
            <el-col :span="5" class="right">
              <span @click="clickOpen(item,index)" class="togoleIcon">
                <i :class="item.open?'el-icon-arrow-right':'el-icon-arrow-down'"></i>
              </span>
            </el-col>
            <el-col :span="24" v-show="item.open" style="line-height:30px;margin-top:20px">
              <span>工作内容:</span>
              <span>{{item.jobContent}}</span>
            </el-col>
          </el-row>
        </div>
        <el-row class="secondTitle">资质资料</el-row>
        <div class="imgbak">
          <el-row>
            <el-col :span="24">
              <span style="display:inline-block;line-height:40px;">厂家资质证书:</span>
              <el-row :gutter="20" v-if="userInfo.manufacturerQualificationCertificate != ''">
                <el-col :span="5" v-for="(item,index) in manufacturerQualificationCertificate" :key="index">
                  <el-image fit="fill" :src="item" :preview-src-list="manufacturerQualificationCertificate"></el-image>
                </el-col>
              </el-row>
              <el-row :gutter="20" v-else>
                <el-col :span="8">暂无图片</el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span style="display:inline-block;line-height:40px;">第三方资质证书:</span>
              <el-row :gutter="20" v-if="userInfo.thirdPartyQualificationCertificate != ''">
                <el-col :span="5" v-for="(item,index) in thirdPartyQualificationCertificate" :key="index">
                  <el-image fit="fill" :src="item" :preview-src-list="thirdPartyQualificationCertificate"></el-image>
                </el-col>
              </el-row>
              <el-row :gutter="20" v-else>
                <el-col :span="8">暂无图片</el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span style="display:inline-block;line-height:40px;">其他证书:</span>
              <el-row :gutter="20" v-if="userInfo.otherCertificates != ''">
                <el-col :span="5" v-for="(item,index) in otherCertificates" :key="index">
                  <el-image fit="fill" :src="item" :preview-src-list="otherCertificates"></el-image>
                </el-col>
              </el-row>
              <el-row :gutter="20" v-else>
                <el-col :span="8">暂无图片</el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <el-row class="secondTitle">离职信息</el-row>
        <div class="selectStyle">
          <el-row>
            <el-col :span="12">
              <span>离职原因：</span>
              <div class="contentText">{{userInfo.leaveReason}}</div>
            </el-col>
            <el-col :span="12">
              <span>离职时间：</span>
              <div class="contentText">{{userInfo.resignationTime}}</div>
            </el-col>
          </el-row>
        </div>
        <el-row class="secondTitle">系统信息</el-row>
        <div class="selectStyle">
          <el-row>
            <el-col :span="12">
              <span>创建人：</span>
              <div class="contentText">{{userInfo.createdByName}}</div>
            </el-col>
            <el-col :span="12">
              <span>创建时间：</span>
              <div class="contentText">{{userInfo.createdAt}}</div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
export default {
  props: {
    userInfo: {},
  },
  data() {
    return {
      // 工作经历
      workList: [],
      manufacturerQualificationCertificate: [],
      thirdPartyQualificationCertificate: [],
      otherCertificates: []
    };
  },
  watch: {
    userInfo: {
      handler(val) {
        console.log(val);
        if (val.workExperience) {
          this.workList = JSON.parse(val.workExperience);
          this.workList.forEach((element, index, arr) => {
            element.open = false;
            this.$set(this.workList, index, element);
          });
          console.log(this.workList);
        }
        if (val.manufacturerQualificationCertificate&&val.manufacturerQualificationCertificate != '') {
          this.manufacturerQualificationCertificate = (val.manufacturerQualificationCertificate).split(',')
        }
        if (val.thirdPartyQualificationCertificate&&val.thirdPartyQualificationCertificate != '') {
          this.thirdPartyQualificationCertificate = (val.thirdPartyQualificationCertificate).split(',')
        }
        if (val.otherCertificates&&val.otherCertificates != '') {
          this.otherCertificates = (val.otherCertificates).split(',')
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    clickOpen(item, index) {
      item.open = !item.open;
      this.$set(this.workList, index, item);
    },
  },
};
</script>
<style scoped>
.personBase {
  background-color: #fff;
  padding-bottom: 50px;
}
.workerMsg span {
  width: auto;
  padding: 0 20px;
}
.menuStyle .el-menu-item {
  font-size: 18px;
  font-weight: 700;
}
.secondTitle {
  font-size: 16px;
  font-weight: 700;
}
.contentText {
  display: inline-block;
  text-align: left;
  padding: 0 10px;
}
/* 工作经历样式 */
.jobStyle {
  padding: 10px;
}
.jobStyle .el-row {
  padding: 10px 0 20px 20px;
}
.jobStyle .el-button {
  margin-left: 12px;
}
.jobStyle .togoleIcon {
  display: inline-block;
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.jobStyle .right {
  text-align: right;
}
.el-image {
  width: 100%;
  height: 165px;
}
.imgbak /deep/ .el-icon-circle-close {
  color: white;
}
</style>