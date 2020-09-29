<template>
  <div class="orderDetail">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelectMenu" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="1">订单详情</el-menu-item>
      <el-menu-item index="2">操作日志</el-menu-item>
    </el-menu>
    <!-- 订单信息 -->
    <template v-if="activeIndex==1">
      <el-main style="padding-bottom: 15px;">
        <el-row class="main-content">
          <div class="content-top">
            <p>
              <span class="title">{{orderData.orderNo}}</span>
              <a id="copy_text" class="color-blue" :data-clipboard-text="orderData.orderNo" @click="copyOrderNum">复制</a>
              <span>{{orderData.customerName}} </span>
              <span>{{orderData.customerPhone}}</span>
            </p>
            <p class="color-gray">
              <span style="margin-right:20px;">订单金额：{{orderData.totalPrice}}</span>
              <span style="margin-right:20px;">下单时间：{{orderData.createdAt}}</span>
              <span style="margin-right:20px;">成交时间：{{orderData.turnoverTime}}</span>
              <span>销售顾问：{{orderData.salesConsultantName}}</span>
            </p>
          </div>
        </el-row>
        <el-row class="main-content">
          <div class="subHead">
            客户信息
          </div>
          <el-row :gutter="20">
            <el-col class="text-right" :span="3">
              <p>客户姓名</p>
              <p>身份证号</p>
              <p>出生日期</p>
            </el-col>
            <el-col :span="7">
              <p>{{orderData.customerName}}</p>
              <p>{{orderData.customerICard}}</p>
              <p>{{orderData.customerBirthday||"--"}}</p>
            </el-col>
            <el-col class="text-right" :span="3">
              <p>电话</p>
              <p>性别</p>
              <p>预计提车时间</p>
            </el-col>
            <el-col :span="7">
              <p>{{orderData.customerPhone}}</p>
              <p>{{sexObj['type_'+orderData.customerSex]}}</p>
              <p>{{orderData.expectedPickupDate||"--"}}</p>
            </el-col>
          </el-row>
          <div class="subHead" style="margin-top:20px">
            成交车辆
          </div>
          <el-row :gutter="20">
            <el-col class="text-right" :span="3">
              <p>品牌车型</p>
              <p>发动机号</p>
              <p>车辆来源</p>
              <p>费用明细</p>
            </el-col>
            <el-col :span="7">
              <p>{{orderData.brandModels}}</p>
              <p>{{orderData.engineNumber||"--"}}</p>
              <p>{{carSourceObj['source_'+orderData.carSource]}}</p>
            </el-col>
            <el-col class="text-right" :span="3">
              <p>车架号</p>
              <p>原车牌号</p>
              <p>是否认证车</p>
            </el-col>
            <el-col :span="7">
              <p>{{orderData.carVin}}</p>
              <p>{{orderData.carNo||"--"}}</p>
              <p>{{authenticationStatusObj["status_"+orderData.authenticationStatus]}}</p>
            </el-col>
            <el-col :span="22" :offset="2">
              <el-table :data="feeDetailData" border :header-cell-style="{background:'#f5f7fa',color:'#606266'}" style="width: 100%">
                <el-table-column v-for="item in feeDetailTable" :key="item.prop" :prop="item.prop" :label="item.title" align="center">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <div class="subHead" style="margin-top:20px">
            收款信息
          </div>
          <el-row>
            <el-col :span="22" :offset="2">
              <el-table :data="feePayData" border :header-cell-style="{background:'#f5f7fa',color:'#606266'}" style="width: 100%">
                <el-table-column type="index" width="50" align="center">
                </el-table-column>
                <el-table-column v-for="item in feePayTable" :key="item.prop" :prop="item.prop" :label="item.title" :formatter="formatterPayTable" align="center">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <div class="subHead" style="margin-top:20px">
            销售合同
          </div>
          <el-row :gutter="20">
            <el-col class="text-right" :span="3">
              <p>销售合同</p>
            </el-col>
            <el-col :span="6">
              <p><a class="color-blue" @click="previewContract">查看</a></p>
            </el-col>
          </el-row>
          <template v-if="orderData.orderRefundRecord">
            <div class="subHead" style="margin-top:20px">
              退订信息
            </div>
            <el-row :gutter="20">
              <el-col class="text-right" :span="3">
                <p>退订原因</p>
                <p>退款</p>
              </el-col>
              <el-col :span="6">
                <p>{{refundReasonObj['status_'+orderData.orderRefundRecord.refundReason]}}</p>
              </el-col>
              <el-col :span="22" :offset="2">
                <el-table :data="feeReturnData" border :header-cell-style="{background:'#f5f7fa',color:'#606266'}" style="width: 100%">
                  <el-table-column type="index" width="50" align="center">
                  </el-table-column>
                  <el-table-column v-for="item in feeReturnTable" :key="item.prop" :prop="item.prop" :label="item.title" align="center">
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </template>
        </el-row>
      </el-main>
    </template>
    <OrderOperationLog v-if="activeIndex==2"></OrderOperationLog>
    <LookContractFile v-if="fileDialog" :fileList="orderData.accessory" :fileType="orderData.fileType" @closeFileDialog="closeFileDialog"></LookContractFile>
  </div>
</template>

<script>
/*********************************************************************************************
 **                                 订单详情方法说明
 ** @function queryCarOrderById(); 通过订单id获取订单信息
 ** @function formatterPayTable(val,column,cellValue) 格式数据   @param val  该行数据 column列信息 cellValue 单元格数据
 ** @function copyOrderNum() 复制文本
 *
 *********************************************************************************************/
import OrderOperationLog from "@/components/carOrderManagement/OrderOperationLog";
import LookContractFile from "@/components/carOrderManagement/LookContractFile";
export default {
  components: {
    OrderOperationLog,
    LookContractFile,
  },
  data() {
    return {
      orderId: this.$route.query.orderId, //页面状态
      orderData: {}, //订单信息
      activeIndex: "1",
      feeDetailData: [], //费用明细
      feePayData: [], //收款信息
      feeReturnData: [], //退款信息
      fileDialog: false, //查看合同
      sexObj: { type_1: "男", type_2: "女" },
      carSourceObj: {
        source_1: "外采",
        source_2: "寄售",
        source_3: "置换",
        source_4: "退换车",
        source_5: "出口",
      },
      refundReasonObj: {
        status_1: "订单重复",
        status_2: "误操作",
        status_3: "客户退订",
        status_4: "其他",
        status_5: "质量问题",
      },
      authenticationStatusObj: { status_1: "已经认证", status_2: "未认证" },
      feeDetailTable: [
        { prop: "listingPrice", title: "销售挂牌价" },
        { prop: "carUltimatelyPrice", title: "车辆成交价" },
        { prop: "loansPrice", title: "贷款金额" },
        { prop: "transferServicePrice", title: "过户手续费" },
        { prop: "financialServicePrice", title: "金融手续费" },
        { prop: "decorateBoutique", title: "装潢及精品" },
        { prop: "otherPrice", title: "其他费用" },
        { prop: "totalPrice", title: "订单金额" },
        { prop: "receivablePrice", title: "店内应收" },
      ],
      feePayTable: [
        { prop: "businessStatus", title: "收款款项" },
        { prop: "businessPrice", title: "收款金额" },
        { prop: "businessTime", title: "收款时间" },
        { prop: "remark", title: "备注" },
      ],
      feeReturnTable: [
        { prop: "transferServicePrice", title: "过户手续费" },
        { prop: "financialServicePrice", title: "金融手续费" },
        { prop: "decorateBoutique", title: "装潢及精品" },
        { prop: "otherPrice", title: "其他费用" },
        { prop: "carUltimatelyPrice", title: "车辆成交价" },
        { prop: "remainPrice", title: "尾款金额" },
        { prop: "earnest", title: "定金" },
        { prop: "refundPrice", title: "退款金额" },
        { prop: "createdAt", title: "退款时间" },
      ],
    };
  },
  mounted() {
    this.queryCarOrderById(); //通过订单id获取订单信息
  },
  methods: {
    // 通过订单id获取订单信息
    queryCarOrderById() {
      const loading = this.$loading({
        target: document.querySelector(".orderDetail"), //loading需要覆盖的DOM节点，默认为body
      });
      let params = {
        id: this.orderId,
      };
      let _this = this;
      this.$axios.post(this.pathItem.queryCarOrderById, params).then((res) => {
        if (res.code == 0) {
          this.orderData = res.result;
          this.feeDetailData.push(this.orderData);
          this.feePayData = this.orderData.orderBusinessRecordList;
          if (this.orderData.orderRefundRecord) {
            this.feeReturnData.push(this.orderData.orderRefundRecord);
          }
        } else {
          this.$alert(res.message, "提示", {
            confirmButtonText: "确定",
            type: "warning",
          });
        }
        loading.close();
      });
    },
    formatterPayTable(val, column, cellValue) {
      let status = {
        status_1: "定金",
        status_2: "尾款",
        status_3: "全款",
        status_4: "退款",
      };
      if (column.property == "businessStatus") {
        return status["status_" + cellValue];
      }
      return cellValue;
    },
    // 复制订单号
    copyOrderNum() {
      let _this = this;
      let clipboard = new this.clipboard("#copy_text");
      clipboard.on("success", (e) => {
        console.log("复制成功");
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        console.log("该浏览器不支持自动复制");
        // 释放内存
        clipboard.destroy();
      });
    },
    //标签选择
    handleSelectMenu(val) {
      this.activeIndex = val;
    },
    previewContract() {
      if (this.orderData.accessory) {
        this.fileDialog = true;
      } else {
        this.$message({
          type: "error",
          message: "暂无合同信息",
          offset: 400,
          duration: 1000,
        });
      }
    },
    closeFileDialog() {
      this.fileDialog = false;
    },
  },
  beforeRouteEnter(to, from, next) {
    if (!to.query.orderId) {
      next((vm) => {
        vm.$router.replace("carOrderList");
      });
    } else {
      next();
    }
  },
};
</script>

<style lang="scss" scoped>
.orderDetail {
  padding-bottom: 100px;
  .main-content {
    background-color: #fff;
    padding: 15px 30px;
    margin-bottom: 10px;
    font-size: 13px;
    .content-top {
      padding-left: 40px;
      a {
        margin: auto 20px;
      }
      .title {
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
}
</style>