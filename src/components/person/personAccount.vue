<template>
  <el-container style="background-color:#fff;padding-bottom:50px" >
    <el-main style="overflow:auto" class="personAdd">
      <div style="margin:20px">
        <div class="personAccount">
          <el-row class="el_row">
            <el-col :span="2">登录账号：</el-col>
            <el-col :span="3"> {{userInfo.account}} </el-col>
            <el-col :span="5">
              <el-button type="warning" size="mini" @click="EditaccountDialog=true" round>编辑</el-button>
              <el-button type="danger" size="mini" @click="resetPassworld" round>重置密码</el-button>
            </el-col>
          </el-row>
          <el-row class="el_row">
            <el-col :span="2">账号状态：</el-col>
            <el-col :span="3"> {{userInfo.status == 1 ? "正常" :(userInfo.status == 2 ? '禁用' : "注销") }}</el-col>
            <el-col :span="2">
              <el-button
                v-if="userInfo.status == 1 || userInfo.status == 2"
                :type="userInfo.status == 1 ? 'danger' : 'success'"
                @click="stopUserAccount"
                round
                size="mini"
              >{{userInfo.status == 1?'禁用':'启用'}}</el-button>
            </el-col>
            <el-col :span="10" style="font-size:14px;color:#F56C6C">( 禁用后，该账号不可登录系统 )</el-col>
          </el-row>
          <el-row class="el_row">
            <el-col :span="2">角色：</el-col>
            <span>{{userInfo.rolaName || '无'}}</span>
            <!-- <el-col :span="10"> {{userInfo.rolaName || '无'}} </el-col> -->
            <el-button type="warning" size="mini" @click="setRoleDialog=true" round style="margin-left:15px">编辑</el-button>
          </el-row>
        </div>
      </div>
    </el-main>
    <!-- 编辑账号模态框 -->
    <el-dialog title="编辑账号" class="dialogStyle" :visible.sync="EditaccountDialog" width="30%">
      <el-form>
        <el-form-item label="登陆账号:" label-width="120px" :required="true">
          <el-input v-model="account" class="w8" maxlength="30" autocomplete="off" size="mini" placeholder="请输入新的账号"/>
        </el-form-item>
      </el-form>
      <el-row class="text-center">
        <el-button type="primary" @click="EditaccountSave">提交</el-button>
      </el-row>
    </el-dialog>

    <!-- 设置角色模态框 -->
    <el-dialog title="设置角色" class="dialogStyle" :visible.sync="setRoleDialog" width="30%" v-loading="loading">
      <el-form>
        <el-form-item label="经销商角色:" label-width="120px" :required="true">
          <el-select class="w8" v-model="roleIdList" size="mini" multiple collapse-tags  placeholder="选择角色">
            <el-option v-for="item in roleOptions" :label="item.roleName" :value="item.id" :key="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <el-row class="text-center">
        <el-button type="primary" @click="EditRoleSave">提交</el-button>
      </el-row>
    </el-dialog>
  </el-container>
</template>
<script>
export default {
  props: {
    userInfo: {},
  },
  data() {
    return {
      account: "", // 编辑账号
      roleIdList: [], // 选择角色list
      roleOptions: [], //角色list
      EditaccountDialog: false, //修改账号模态框
      setRoleDialog: false, // 设置角色 模态框
      loading: false
    };
  },
  mounted() {
    this.querySystemRoleDealersList() // 角色下拉
  },
  watch: {
    EditaccountDialog(val) {
      if (val == false) {
        this.account = ''
      }
    },
    setRoleDialog(val) {
      if (val == false) {
        this.roleIdList = []
      }
    }
  },
  methods: {
    // 角色下拉
    querySystemRoleDealersList() {
        this.$axios.post(this.pathItem.querySystemRoleDealersList,{})
        .then(res=>{
            if(res.code == 0){
                this.roleOptions = res.result.systemRoleDealersList
            }else{
                this.errorMsg(res.message)
            }
        })
      },
    // 修改账号状态
    stopUserAccount() {
      var states = "",
          message = "";
      if (this.userInfo.status == 1) {
        states = 2;
        message = "确定禁用该账号？";
      } else {
        states = 1;
        message = "确定启用该账号？";
      }
      this.$confirm(message, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true
          this.$axios.post(this.pathItem.updateupDealerUserInfo, {
              id: this.userInfo.id,
              status: states,
            })
            .then((res) => {
              this.loading = false
              if (res.code == 0) {
                // this.userInfo.status = states;
                this.successMsg("修改状态成功")
                this.$emit("changeUser")
              } else {
                this.errorMsg(res.message)
              }
            }).catch(res=>{
              this.errorMsg(res.message)
            })
        })
        .catch(() => {});
    },
    // 编辑账号保存
    EditaccountSave() {
      if (this.account == '') {
        this.errorMsg("请输入新的账号")
        return;
      }
      this.loading = true
      this.$axios.post(this.pathItem.updateupDealerUserInfo, {
        id: this.userInfo.id,
        account: this.account,
      })
      .then((res) => {
        if (res.code == 0) {
          this.loading = false
          this.successMsg("修改账号成功")
          this.EditaccountDialog = false
          this.$emit("changeUser")
        } else {
          this.errorMsg(res.message)
        }
      }).catch(res=>{
          this.errorMsg(res.message)
      })
    },
    // 重置密码
    resetPassworld() {
      this.$confirm("确认要重置密码么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          this.loading = true
          this.$axios.post(this.pathItem.updateupDealerUserInfo, {
              id: this.userInfo.id,
              idCard: this.userInfo.idCard,
              resetPasswords: '1'
            })
            .then((res) => {
              this.loading = false
              if (res.code == 0) {
                this.successMsg(res.message)
                this.$emit("changeUser")
              } else {
                this.errorMsg(res.message)
              }
            }).catch(res=>{
                this.errorMsg(res.message)
            })
        })
        .catch(() => {
          this.errorMsg(res.message)
        })
    },
    // 设置角色
    EditRoleSave() {
      if (this.roleIdList.length == 0) {
        this.errorMsg("请先选择角色")
        return;
      }
      this.loading = true
      this.$axios.post(this.pathItem.updateupDealerUserInfo, {
        id: this.userInfo.id,
        roleIdList: this.roleIdList,
      })
      .then((res) => {
        this.loading = false
        if (res.code == 0) {
          this.setRoleDialog = false
          this.successMsg("编辑角色成功")
          this.$emit("changeUser")
        } else {
          this.errorMsg(res.message)
        }
      })
         
    },
    // 错误提醒	
    errorMsg(msg) {this.$alert(msg, '提示', {confirmButtonText: '确定',type:'warning',})},
    // 成功提醒	
    successMsg(msg) {this.$message({message:msg, type:'success'})}
  },
};
</script>
<style scoped>
.personAccount{
  margin: 20px;
  padding: 20px;
}
.el_row{
  line-height: 40px;
}
.w8{
  width: 80%;
}
</style>