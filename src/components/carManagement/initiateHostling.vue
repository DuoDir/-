<template>
  <div>
    <el-dialog title="整备申请" :visible="true" width="80%" @close="closeDialog">
      <table class="table-vertical" style="width:100%">
        <tr v-for="index in 2" :key="index">
          <td class="column">{{dialogHostlingTableKeys[index*3-3].title}}</td>
          <td>{{formatWorkData(dialogHostlingTableKeys[index*3-3].prop)}}</td>
          <td class="column">{{dialogHostlingTableKeys[index*3-2].title}}</td>
          <td>{{formatWorkData(dialogHostlingTableKeys[index*3-2].prop)}}</td>
          <td class="column">{{dialogHostlingTableKeys[index*3-1].title}}</td>
          <td>{{formatWorkData(dialogHostlingTableKeys[index*3-1].prop)}}</td>
        </tr>
      </table>
      <el-row style="margin:30px auto">
        <div class="subHead">整备项目信息</div>
        <el-row v-for="(item,index) in dialogHostlingInfo" :key="index" style="margin-bottom:10px;">
          <el-col :span="2" class="col-text-right">项目名称：</el-col>
          <el-col :span="3">
            <el-cascader
              size="mini"
              v-model="item.name"
              :show-all-levels="false"
              :options="hostlingList"
              :props="hostlingCascaderProps"
              @change="(val)=>{hostlingChange(val,index)}"
            ></el-cascader>
          </el-col>
          <el-col :span="3" class="col-text-right">费用（元）：</el-col>
          <el-col :span="3">
            <el-input class="dialog-input" v-model="item.estimateMoney" maxlength="10" size="small"></el-input>
          </el-col>
          <el-col :span="2" class="col-text-right">备注：</el-col>
          <el-col :span="7">
            <el-input class="dialog-input" v-model="item.remark" maxlength="10" size="small"></el-input>
          </el-col>
          <el-button
            v-if="dialogHostlingInfo.length!=1"
            type="danger"
            size="small"
            style="border:none;margin-left:10px;"
            @click="deleteDialogHostlingInfo(index)"
          >删除</el-button>
          <el-button
            v-if="index==(dialogHostlingInfo.length-1) && index < 19"
            type="primary"
            size="small"
            style="border:none;margin-left:10px;"
            @click="addDialogHostlingInfo"
          >添加</el-button>
        </el-row>
      </el-row>
      <span slot="footer">
        <div class="dialog-footer">
          <span>整备项目：共{{dialogHostlingInfo.length}}项</span>
          <span>整备预算：共{{totalMoney}}元</span>
        </div>
        <el-button @click="closeDialog">关 闭</el-button>
        <el-button type="primary" @click="dialogConfirmSave(2)">提 交</el-button>
        <el-button type="primary" @click="dialogConfirmSave(1)">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/*********************************************************************************************
 *                                车辆整备详情
 ** @function getHostLingList() 获取整备项目
 ** @function formatWorkData() 格式化整备状态
 ** @function hostlingChange() 选择整备排除
 ** @function addDialogHostlingInfo() 添加整备项目信息
 ** @function deleteDialogHostlingInfo() 删除整备项目信息
 ** @function closeDialog() 关闭弹窗
 ** @function showMessageBox() 页面弹窗
 *
 *********************************************************************************************/
export default {
  props: {
    initiateHostInfo: "",
  },
  data() {
    return {
      dialogHostlingData: "",
      dialogHostlingTableKeys: [
        {
          prop: "id",
          title: "车辆ID",
        },
        {
          prop: "brandType",
          title: "品牌车型",
        },
        {
          prop: "vin",
          title: "VIN码",
        },
        {
          prop: "carNo",
          title: "车牌号",
        },
        {
          prop: "mileage",
          title: "行驶里程",
        },
        {
          prop: "inTime",
          title: "入库时间",
        },
      ],
      hostlingList: [],
      hostlingCascaderProps: {
        label: "hostlingName",
        value: "hostlingName",
        children: "hostlingProjectList",
      },
      dialogHostlingInfo: [
        {
          name: "",
          estimateMoney: "",
          remark: "",
        },
      ],
    };
  },
  methods: {
    getHostLingList() {
      this.$axios
        .post(this.pathItem.getHostlingList)
        .then((res) => {
          if (res.code == 0) {
            this.hostlingList = res.result;
          }
        })
        .catch((res) => {});
    },
    formatWorkData(val) {
      if (val == "brandType") {
        return (
          this.dialogHostlingData.brandName +
          this.dialogHostlingData.seriesName +
          this.dialogHostlingData.modelName
        );
      }
      return this.dialogHostlingData[val] ? this.dialogHostlingData[val] : "";
    },
    hostlingChange(val, index) {
      if (val) {
        for (var i = 0; i < this.dialogHostlingInfo.length; i++) {
          if (val[1] == this.dialogHostlingInfo[i].name[1] && i !== index) {
            this.showMessageBox("error", "已添加该整备项目，请重新选择");
            this.dialogHostlingInfo[index].name = [];
            return false;
          }
        }
      }
    },
    //添加整备项目信息
    addDialogHostlingInfo() {
      if (this.dialogHostlingInfo.length >= 20) {
        this.showMessageBox("error", "请注意：整备项目信息最多可添加20条！");
        return;
      }
      let info = {
        name: "",
        estimateMoney: "",
        remark: "",
      };
      this.dialogHostlingInfo.push(info);
    },
    //删除整备项目信息
    deleteDialogHostlingInfo(index) {
      this.dialogHostlingInfo.splice(index, 1);
    },
    // 对话框确认操作   type：0仅保存  1保存并评估
    dialogConfirmSave(type) {
      var that = this;
      var params = [];
      for (let index = 0; index < this.dialogHostlingInfo.length; index++) {
        const element = this.dialogHostlingInfo[index];
        if (!element.name) {
          this.showMessageBox("error", "请填写整备项目");
          return;
        }
        if (!element.estimateMoney) {
          this.showMessageBox("error", "请填写整备项目金额");
          return;
        }
        params.push({
          name: element.name[1],
          estimateMoney: element.estimateMoney,
          remark: element.remark,
        });
      }
      var hostlingParams = {
        carId: this.dialogHostlingData.id,
        items: JSON.stringify(params),
        workStatus: type,
        itemNum: this.dialogHostlingInfo.length,
        workFee: this.totalMoney,
        workNumParent:"0"
      };
      this.$axios
        .post(this.pathItem.saveCarWorkOrder, hostlingParams)
        .then((res) => {
          if (res.code == 0) {
            this.showMessageBox("success", "提交成功");
            this.$emit("successHostling");
          }
        })
        .catch((res) => {});
    },
    closeDialog() {
      this.$emit("closeInitiate");
    },

    showMessageBox(type, message) {
      this.$message({
        type: type,
        message: message,
        offset: 400,
        duration: 1000,
      });
    },

  },
  computed: {
    totalMoney() {
      var totalMoney = 0;
      for (let index = 0; index < this.dialogHostlingInfo.length; index++) {
        const element = this.dialogHostlingInfo[index];
        totalMoney =
          Number(totalMoney) +
          Number(element.estimateMoney ? element.estimateMoney : 0);
      }
      return Number(totalMoney).toFixed(2);
    },
  },
  mounted() {
    this.dialogHostlingData = this.initiateHostInfo;
    this.getHostLingList();
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  float: left;
  line-height: 42px;
  padding-right: 20px;
  span {
    color: red;
    margin-right: 40px;
  }
}
</style>