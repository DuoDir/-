<template>
  <div class="carHostlingDialog">
    <el-dialog
      title="整备明细"
      :visible.sync="dialogHostling"
      width="80%"
      @close="closeDialog()"
      :showClose="false"
    >
      <span class="button-slot">
        <el-button
          type="primary"
          v-if="hostlingData.workStatus == 2  && optionBtn"
          @click="ApplyButtonOperation(4)"
        >同 意</el-button>
        <el-button
          type="danger"
          v-if="(hostlingData.workStatus == 2 || hostlingData.workStatus == 5)  && optionBtn"
          @click="ApplyButtonOperation(5)"
        >驳 回</el-button>
          <el-button
          type="primary"
          v-if="hostlingData.workStatus == 3  && optionBtn"
          @click="ApplyButtonOperation(10)"
        >重新提交</el-button>
         <el-button
          type="danger"
          v-if="(hostlingData.workStatus == 1 || hostlingData.workStatus == 4 || hostlingData.workStatus == 3) && optionBtn"
          @click="ApplyButtonOperation(2)"
        >作 废</el-button>
      </span>
      <el-row>
        <el-button type="text" @click="openCarFirstHost">{{"关联整备工单："+hostlingData.workNumParent}}</el-button>
      </el-row>
      <table class="table-vertical" style="width:100%">
        <tr v-for="index in 2" :key="index">
          <td class="column">{{hostlingTableKeys[index*3-3].title}}</td>
          <td>{{formatHostling(hostlingTableKeys[index*3-3].prop)}}</td>
          <td class="column">{{hostlingTableKeys[index*3-2].title}}</td>
          <td>{{formatHostling(hostlingTableKeys[index*3-2].prop)}}</td>
          <td class="column">{{hostlingTableKeys[index*3-1].title}}</td>
          <td>{{formatHostling(hostlingTableKeys[index*3-1].prop)}}</td>
        </tr>
      </table>
      <el-row style="margin:30px auto">
        <div class="subHead">追加项目信息</div>
        <el-row style="margin-bottom:10px;">
          <el-col :span="4">整备工单号：{{hostlingData.workNum}}</el-col>
          <el-col :span="3">整备状态：{{formatHostStatus(hostlingData.workStatus)}}</el-col>
          <el-col :span="3">整备项目：共{{hostlingData.itemNum}}项</el-col>
          <el-col :span="3">整备预算：共{{hostlingData.workFee}}元</el-col>
          <el-col :span="3">创建人：{{hostlingData.creator}}</el-col>
          <el-col :span="5">创建时间：{{hostlingData.createdAt}}</el-col>
          <el-col :span="3" >
            <a class="color-blue" @click="openAppovalLogDialog(hostlingData.id)">查看审批记录</a>
          </el-col>
        </el-row>
        <el-table
          :data="hostlingList"
          border
          :header-cell-style="{background:'#f5f7fa',color:'#606266'}"
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" align="center" width="80px"></el-table-column>
          <el-table-column
            v-for="item in tableHeader"
            :key="item.prop"
            :prop="item.prop"
            :label="item.title"
            align="center"
          ></el-table-column>
        </el-table>
      </el-row>
      <span slot="footer">
        <el-button type="primary" @click="closeDialog">关 闭</el-button>
      </span>
    </el-dialog>
    <LookApprovalLogDialog
      v-if="showAppovalLogDialog"
      @closedDialog="closeApprovalLogDialog"
      :orderId="orderId"
    ></LookApprovalLogDialog>
    <CarHostlingDialog
      v-if="hostlingDialog"
  
      :workNumber="workNumber"
      @closedDialog="closeHostlingDialog"
    ></CarHostlingDialog>
  </div>
</template>

<script>
/*********************************************************************************************
 *                                车辆整备子订单信息详情
 ** @function closeApprovalLogDialog() 关闭流转记录 
 ** @function openAppovalLogDialog(id) 打开流转记录  @param id 流转id 
 ** @function closeDialog() 关闭弹窗  
 ** @function closeHostlingDialog() 关闭父整备弹窗 
 ** @function openCarFirstHost() 打开父整备弹窗
 ** @function getHostLingInfo() 获取整备信息
 ** @function formatHostling(val) 格式化整备信息 @param val value
 ** @function formatHostStatus(val) 格式化整备状态  @param val value
 ** @function formatWorkData(val) 格式化整备信息  @param val value
 ** @function invalidChildOrder(id) 作废整备单操作  @param id 整备单id
 ** @function ApplyButtonOperation(type) 正被单操作  @param type 操作类型
 ** @function confirmDialog() 确认弹窗
 ** @function showMessageBox() 页面弹窗 
 *
 *********************************************************************************************/
import LookApprovalLogDialog from "@/components/carManagement/LookApprovalLogDialog"; //查看审批记录
import CarHostlingDialog from "@/components/carManagement/CarHostlingDialog"; //查看审批记录
export default {
  components: {
    LookApprovalLogDialog,
    CarHostlingDialog,
  },
  props: {
    hostlingId: "",
    optionBtn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      hostlingList: [],
      hostlingDialog: false,
      workNumber:"",
      hostId: "",
      dialogHostling: true,
      showAppovalLogDialog: false, //查看审批记录

      hostlingTableKeys: [
        {
          prop: "carId",
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
      tableHeader: [
        {
          prop: "name",
          title: "整备项目",
        },
        {
          prop: "estimateMoney",
          title: "整备费用（元）",
        },
        {
          prop: "remark",
          title: "备注",
        },
      ],

      hostlingData: "",

      dialogHostlingData: {},
      orderId: "",
    };
  },
  computed: {
    //获取vuex存储的已预览标签页
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
  methods: {
    closeApprovalLogDialog() {
      this.showAppovalLogDialog = false;
    },
    openAppovalLogDialog(id) {
      this.orderId = id;
      this.showAppovalLogDialog = true;
    },
    closeDialog() {
      this.$emit("closedChildDialog");
    },
    closeHostlingDialog() {
      this.hostlingDialog = false;
    },
    openCarFirstHost() {
      this.workNumber = this.hostlingData.workNumParent;
      this.hostlingDialog = true;
    },
    getHostLingInfo() {
      var parmas = {
        id: this.hostlingId,
      };
      this.$axios
        .post(this.pathItem.gethostInfo, parmas)
        .then((res) => {
          if (res.code == 0) {
            this.hostlingData = res.result;
            this.hostlingList = JSON.parse(res.result.items);
          }
 
        })
        .catch((res) => {
 
        });
    },

    formatHostling(val) {
      if (val == "brandType") {
        return (
          this.hostlingData.brandName +
          this.hostlingData.seriesName +
          this.hostlingData.modelName
        );
      }
      if (val == "mileage") {
        return this.hostlingData.mileage + "公里";
      }

      return this.hostlingData[val] ? this.hostlingData[val] : "--";
    },
    formatHostStatus(workStatus) {
      switch (workStatus) {
        case 1:
          return "待提交";
          break;
        case 2:
          return "待审核";
          break;
        case 3:
          return "审核驳回";
          break;
        case 4:
          return "整备中";
          break;
        case 5:
          return "待验收";
          break;
        case 6:
          return "验收通过";
          break;
        case 7:
          return "验收完成";
          break;
        case 8:
          return "已作废";
          break;
        default:
          return "--";
          break;
      }
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

    // 整备申请操作  type:  0---撤回  1---同意   2---驳回   8---录入结算单
    invalidChildOrder(id) {
      this.$prompt("请再次确认要作废此追加项目", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          var params = {};
          params.id = id;
          params.remark = value;
          this.$axios
            .post(this.pathItem.invalidHostlingItem, params)
            .then((res) => {
              if (res.code == 0) {
                this.showMessageBox("success", "操作成功");
                this.closeDialog();
              }else{
                this.showMessageBox("error",res.message)
              }
            }).catch(res=>{
              this.showMessageBox("error",res.message)
            });
        })
        .catch(() => {});
    },
    ApplyButtonOperation(type) {
      if (type == 2) {
        this.$prompt(
          "请再次确认要作废此工单，其追加项目也会一并作废？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          }
        )
          .then(({ value }) => {
            var params = {};

            params.id = this.hostlingData.id;
            params.remark = value;
            this.$axios
              .post(this.pathItem.invalidHostlingItem, params)
              .then((res) => {
                if (res.code == 0) {
                  this.showMessageBox("success", "操作成功");
                  this.closeDialog();
                }else{
                  this.showMessageBox("error",res.message)
                }
              }).catch(res=>{
                this.showMessageBox("error",res.message)
              });
          })
          .catch(() => {});
      }
      if (type == 4) {
        let confirmFun = () => {
          var params = {};
          params.id = this.hostlingData.id;
          this.$axios
            .post(this.pathItem.agreeAndRejectWorkOrder, params)
            .then((res) => {
              if (res.code == 0) {
                this.showMessageBox("success", "车辆整备申请已通过");
                this.closeDialog();
              }else{
                this.showMessageBox("error",res.message)
              }
            }).catch(res=>{
              this.showMessageBox("error",res.message)
            })
        };
        let cancelFun = () => {};
        this.confirmDialog(
          "请再次确认要同意此工单",
          confirmFun,
          cancelFun,
          "确定",
          "取消"
        );
      }
      if (type == 5) {
        this.$prompt("请再次确认要驳回此工单", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputValidator: (val) => {
            if (val) {
              return true;
            }
            return false;
          },
          inputErrorMessage: "请输入驳回原因",
        })
          .then(({ value }) => {
            var params = {};

            params.id = this.hostlingData.id;
            params.remark = value;
            var url =
              this.hostlingData.workStatus == 2
                ? this.pathItem.rejectWorkOrder
                : this.pathItem.agreeAndRejectWorkOrder;

            this.$axios.post(url, params).then((res) => {
              if (res.code == 0) {
                this.closeDialog();
              }else{
                this.showMessageBox("error",res.message)
              }
            }).catch(res=>{
              this.showMessageBox("error",res.message)
            });
          })
          .catch(() => {});
      }
      if (type == 10) {
        let confirmFun = () => {
          var params = {};
          params.id = this.hostlingData.id;
          this.$axios.post(this.pathItem.reSubmitOrder, params).then((res) => {
            if (res.code == 0) {
              this.showMessageBox("success", "车辆提交完成");
              this.closeDialog();
            }else{
              this.showMessageBox("error",res.message)
            }
          }).catch(res=>{
            this.showMessageBox("error",res.message)
          });
        };
        let cancelFun = () => {};
        this.confirmDialog(
          "请再次确认要重新提交此工单",
          confirmFun,
          cancelFun,
          "确定",
          "取消"
        );
      }
    },

    confirmDialog(
      message,
      confirmFun,
      cancelFun,
      confirmButtonText = "确定",
      cancelButtonText = "取消"
    ) {
      this.$confirm(message, "提示", {
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
      })
        .then(confirmFun)
        .catch(cancelFun);
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
  mounted() {},
  created() {
    this.getHostLingInfo();
  },
};
</script>
<style lang="scss" scoped>
.carHostlingDialog {
  .button-slot {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
.table-vertical {
  border-collapse: collapse;
  tr {
    td {
      border: 1px solid #ebeef5;
      text-align: center;
      width: 10%;
      padding: 10px;
      &.column {
        background: #f5f7fa;
      }
    }
  }
}
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