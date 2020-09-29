<template>
  <div class="bodyview" ref="bodyView">
    <el-row class="contentCard" ref="contentCard" :style="{top:paddingTop}">
      <el-col :span="14">
        <img src="@/assets/images/pic_bj@1x.png" />
      </el-col>
      <el-col :span="9">
        <h2 style="text-align:center;">二手车营销管理平台</h2>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="30px" class="demo-ruleForm">
          <el-form-item prop="accnumber">
            <el-input v-model="ruleForm.accnumber" placeholder="请输入登录账号"></el-input>
          </el-form-item>
          <el-form-item prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off" placeholder="请输入登录密码"></el-input>
          </el-form-item>
          <el-form-item prop="pass">
            <el-input v-model="ruleForm.securityCode" autocomplete="off" placeholder="请输入验证码" style="width:55%"></el-input>
            <div style="width:45%;float:right">
              <SecurityCode ref="refreshCode"></SecurityCode>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" style="width:100%">提 交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <UpdatePassword v-if="updatePwd" @closedDialog="closeUpdatePwd" :fromUrl="fromPage"></UpdatePassword>
  </div>
</template>

<script>
import SecurityCode from "@/components/view/SecurityCode"; //获取验证码
import UpdatePassword from "@/components/layout/UpdatePassword"; //修改密码
export default {
  components: {
    SecurityCode,
    UpdatePassword,
  },
  data() {
    var checkAccNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };

    return {
      fromPage: "login",
      updatePwd: false,
      paddingTop: "10%",
      ruleForm: {
        pass: "",
        accnumber: "",
        securityCode: "",
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],

        accnumber: [{ validator: checkAccNumber, trigger: "blur" }],
      },
    };
  },
  created() {
    setTimeout(() => {
      this.paddingTop =
        (this.$refs.bodyView.clientHeight -
          this.$refs.contentCard.$el.clientHeight) /
          2 +
        "px";
    }, 50);
    if (this.$route.params.into == 1) {
      // 如果是登出 需要刷新一下
      location.reload();
    }
  },
  mounted() {
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.goBack, false);
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            account: this.ruleForm.accnumber,
            password: this.ruleForm.pass,
            clientId: 2, //经销商
            securityCode: this.ruleForm.securityCode,
          };
          this.$axios
            .post(this.pathItem.login, params)
            .then((res) => {
              let r = res.result;
              if (res.code == 0) {
                window.localStorage.organizationInfo = JSON.stringify(
                  r.organizationInfo
                );
                window.localStorage.user = JSON.stringify(r.user);
                window.localStorage.token = r.token;

                if (r.user.isResetPassword == 1) {
                  // 已经重置密码
                  this.$router.push("/");
                  return;
                }
                this.updatePwd = true;
              } else {
                this.ruleForm.securityCode = "";
                this.$refs.refreshCode.getSecurityCode();
                this.$message.error({
                  message: res.message,
                  offset: 500,
                });
              }
            })
            .catch((res) => {
              this.$message.error({
                message: res.message,
                offset: 500,
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    closeUpdatePwd() {
      this.updatePwd = false;
      this.$refs.refreshCode.getSecurityCode();
      this.ruleForm = {
        pass: "",
        accnumber: "",
        securityCode: "",
      };
    },
    goBack() {
      if (this.updatePwd) {
        localStorage.removeItem("token");
        return;
      }
    },
  },
  destroyed() {
    window.removeEventListener("popstate", this.goBack, false);
  },
};
</script>


<style lang="scss" scope="scoped">
.bodyview {
  width: 100%;
  height: 100%;
  background: linear-gradient(#9263fa, #5833ea);
  .contentCard {
    background-color: #fff;
    box-shadow: 0 0 24px 0 rgba(164, 164, 164, 0.1);
    border-radius: 10px;
    padding: 10% 6%;
    position: relative;
    width: 80%;
    margin: auto;
    img {
      width: 100%;
    }
  }
}
</style>