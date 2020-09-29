<template>
  <el-container class="personDetail" v-loading="loading">
    <el-header class="header">
      <span>人员详情</span>
    </el-header>
    <el-main>
      <div class="card">
        <el-tabs type="border-card">
          <el-row>
            <el-col :span="3">
              <el-image fit="contain" :src="userInfo.identificationPhoto"></el-image>
            </el-col>
            <el-col :span="21">

              <el-row class="el_row">
                <el-col :span="20" :offset="1" class="userinfo">
                  <span>{{userInfo.userName || 'xxx'}}</span>
                  <span v-show="userInfo.sex == 1">男</span>
                  <span v-show="userInfo.sex == 2">女</span>
                  <span>{{userInfo.mobile || 'xxxxxxxxxxx'}}</span>
                </el-col>
              </el-row>

              <el-row class="el_row">
                <el-col :span="20" :offset="1" class="userinfo">
                  <span>{{userInfo.organizationName || 'xxxxx单位'}}</span>
                  <span class="border-box" v-show="userInfo.jobStatus == 1">在职</span><span v-show="userInfo.jobStatus == 2">离职</span>
                </el-col>
              </el-row>

              <el-row class="el_row" style="margin-top:10px;">
                <el-col :span="7" :offset="1">
                  <span class="titletag">身份证号：</span>
                  <span>{{userInfo.idCard}}</span>
                </el-col>
                <el-col :span="6">
                  <span class="titletag">出生日期：</span>
                  <span>{{userInfo.dateBirth}}</span>
                </el-col>
                <el-col :span="6">
                  <span class="titletag">学历：</span>
                  <span>{{userInfo.educationBackground}}</span>
                </el-col>
                <el-col :span="4">
                  <span class="titletag">工作年限：</span>
                  <span>{{userInfo.yearsWork}} 年</span>
                </el-col>
              </el-row>

              <el-row class="el_row">
                <el-col :span="7" :offset="1">
                  <span class="titletag">工号：</span>
                  <span>{{userInfo.jobNumber}}</span>
                </el-col>
                <el-col :span="6">
                  <span class="titletag">当前岗位：</span>
                  <span>{{userInfo.postName}}</span>
                </el-col>
                <el-col :span="6">
                  <span class="titletag">入职时间：</span>
                  <span>{{userInfo.entryTime}}</span>
                </el-col>
              </el-row>

            </el-col>
          </el-row>
        </el-tabs>
        <el-tabs v-model="activeIndex" class="menuStyle" @tab-click="togoleMenu">
          <el-tab-pane label="基本信息" name="basic"></el-tab-pane>
          <el-tab-pane label="账号信息" name="account"></el-tab-pane>
          <el-tab-pane label="组员信息" name="member"></el-tab-pane>
          <router-view :is="msgPath" :userInfo="userInfo" :userId="userId" @changeUser="changeUser"></router-view>
        </el-tabs>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import personBase from "@/components/person/personBase";
import personAccount from "@/components/person/personAccount";
import personMember from "@/components/person/personMember";
export default {
  components: { personBase, personAccount, personMember },
  data() {
    return {
      activeIndex: "basic",
      userId: "",
      msgPath: personBase, //组件路径
      // 人员数据
      userInfo: {
        sex: "",
        userName: "",
        mobile: "",
        organizationName: "",
        jobStatus: 1,
        idCard: "",
        dateBirth: "",
        educationBackground: "",
        yearsWork: "",
        jobNumber: "",
        postName: "",
        entryTime: "",
        identificationPhoto: ''
      },
      //模态框
      loading: false,
    };
  },
  created() {
    this.userId = this.$route.query.id;
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    // 切换菜单
    togoleMenu(key, event) {
      if (key.name == "basic") {
        this.msgPath = personBase;
      } else if (key.name == "account") {
        this.msgPath = personAccount;
      } else if (key.name == "member") {
        this.msgPath = personMember;
      }
    },
    // 获取人员信息
    getUserInfo() {
      this.loading = true;
      this.$axios
        .post(this.pathItem.queryDealerUserInById, { id: this.userId })
        .then((res) => {
          this.loading = false;
          if (res.code == 0) {
            this.userInfo = res.result;
          } else {
            this.errorMsg(res.message);
          }
        })
        .catch((res) => {
          this.errorMsg(res.message);
        });
    },
    // 修改账户
    changeUser(id) {
      this.activeIndex = "basic";
      this.msgPath = personBase;
      if (id) {
        this.userId = id;
      }
      this.getUserInfo();
    },
    // 时间戳转换时间
    timestampToTime(t) {
      if (t == null || t == "") {
        return "";
      }
      var date = new Date(t); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      // var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours() + ":"
      // var m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes() + ":"
      // var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
      return Y + M + D;
    },
    // 错误提醒
    errorMsg(msg) {
      this.$alert(msg, "提示", { confirmButtonText: "确定", type: "warning" });
    },
    // 成功提醒
    successMsg(msg) {
      this.$message({ message: msg, type: "success" });
    },
  },
};
</script>
<style lang="scss" scoped>
.personDetail {
  height: auto;
  padding-bottom: 100px;
  .el-image {
    width: 100%;
    height: 165px;
  }
  .card {
    margin: 20px;
    .el-tabs {
      border-radius: 10px;
      margin-bottom: 20px;
      padding-bottom: 20px;
    }
    .titletag {
      display: inline-block;
      width: 80px;
      text-align: right;
    }
  }
  .userinfo {
    span {
      margin-right: 20px;
    }
  }
  .border-box {
    border: 1px solid #dedede;
    padding: 8px 20px;
  }
  .text-right {
    text-align: right;
  }
  .el_row {
    line-height: 40px;
  }
}
.workerMsg span {
  width: auto;
  padding: 0 20px;
}
// .contentText {
//   display: inline-block;
//   text-align: left;
//   padding: 0 10px;
// }
</style>
<style>
.menuStyle .el-tabs__nav-wrap {
  background-color: #ffffff;
  padding: 10px 20px 0 20px;
}
.menuStyle .el-tabs__nav-wrap .el-tabs__item {
  font-size: 18px;
  font-weight: 600;
}
</style>