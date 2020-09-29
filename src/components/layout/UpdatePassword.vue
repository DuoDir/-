<template>
  <div class="updatePassword">
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="60%" @close="closeDialog()" :close-on-click-modal="false" :show-close="fromUrl!='login'">
      <el-form :model="passwordForm" status-icon :rules="rules" ref="passwordForm" label-width="100px">
        <el-form-item label="原密码" prop="oldPassWord">
          <el-input v-model="passwordForm.oldPassWord" placeholder="请输入原密码" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassWord">
          <el-input type="password" v-model="passwordForm.newPassWord" autocomplete="off" placeholder="请输入新密码" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password">
          <el-input type="password" v-model="passwordForm.password" autocomplete="off" placeholder="再次输入新密码" maxlength="30"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <span slot="footer">
          <el-button type="primary" @click="submitUpdate('passwordForm')">提 交</el-button>
          <el-button v-if="fromUrl!='login'" @click="closeDialog">取 消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    fromUrl: String,
  },
  data() {
    var checkAccNumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
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
      dialogVisible: true,
      passwordForm: {
        oldPassWord: "",
        newPassWord: "",
        password: "",
      },

      rules: {
        oldPassWord: [{ validator: validatePass, trigger: "blur" }],
        newPassWord: [{ validator: checkAccNumber, trigger: "blur" }],
        password: [{ validator: checkAccNumber, trigger: "blur" }],
      },
    };
  },
  methods: {
    //关闭，取消修改
    closeDialog() {
      this.$emit("closedDialog");
    },
    submitUpdate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.passwordForm.newPassWord != this.passwordForm.password) {
            this.$message.error({
              message: "请保持新密码与确认密码一致",
              offset: 300,
            });
            return;
          }
          this.$axios
            .post(this.pathItem.updatePassword, this.passwordForm)
            .then((res) => {
              let r = res;
              if (r.code == 0) {
                this.$message.success({
                  message: "修改成功",
                  offset: 300,
                });
                this.$emit("closedDialog");
              } else {
                this.$message.error({
                  message: res.message,
                  offset: 300,
                });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>