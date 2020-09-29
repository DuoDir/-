<template>
  <div class="createOrderInfo">
    <!-- 新建订单 -->
    <el-header class="header">
      <span>{{orderId?"编辑订单":"新增订单"}}</span>
    </el-header>
    <el-main style="padding-bottom: 15px;">
      <el-row class="main-content">
        <el-form ref="orderForm" :rules="rules" :model="orderData" label-width="120px" size="small">
          <el-row>
            <el-col :span="11" style="border-right:1px solid #DCDFE6;padding-right:20px;margin-right:20px;">
              <div class="subHead">
                车辆信息
              </div>
              <!-- <el-form ref="carform" :rules="rules" :model="orderData" label-width="120px" size="small"> -->
              <el-form-item label="车架号" prop="carVin">
                <el-input v-model="orderData.carVin" size="mini" style="width:70%" maxlength="30" @blur="blurInputFindCarInfo" :disabled="orderId?true:false"></el-input>
                <el-button type="primary" size="mini" @click="sellCarDialog = true;">选择车辆</el-button>
              </el-form-item>
              <el-form-item label="品牌车型">
                <el-input v-model="orderData.brandModels" disabled></el-input>
              </el-form-item>
              <el-form-item label="原车牌号">
                <el-input v-model="orderData.carNo" disabled></el-input>
              </el-form-item>
              <el-form-item label="车辆来源">
                <el-input v-model="carSourceObj['source_'+orderData.carSource]" disabled></el-input>
              </el-form-item>
              <el-form-item label="是否认证车">
                <el-input v-model="certifiStatusObj['status_'+orderData.authenticationStatus]" disabled></el-input>
              </el-form-item>
              <!-- </el-form> -->
            </el-col>
            <el-col :span="11">
              <div style="float:right;padding-top:10px">
                <el-checkbox v-model="isNewCustomer" @change="changeIsNewCustomer">新客户</el-checkbox>
              </div>
              <div class="subHead">
                客户信息
              </div>
              <el-form-item label="客户姓名" prop="customerName">
                <el-input v-model="orderData.customerName" size="mini" style="width:70%" maxlength="30" :disabled="!isNewCustomer"></el-input>
                <el-button type="primary" size="mini" @click="customerDialog=true">选择客户</el-button>
              </el-form-item>
              <el-form-item label="客户电话" prop="customerPhone">
                <el-input v-model.number="orderData.customerPhone" :disabled="!isNewCustomer" maxlength="11"></el-input>
              </el-form-item>
              <el-form-item label="身份证号" prop="customerICard">
                <el-input v-model="orderData.customerICard" :disabled="!isNewCustomer&&orderData.customerICard!=''" maxlength="18"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="customerSex">
                <el-radio-group v-model="orderData.customerSex" :disabled="!isNewCustomer">
                  <el-radio label="1">男</el-radio>
                  <el-radio label="2">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="预计提车日期">
                <el-date-picker v-model="orderData.expectedPickupDate" type="date" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="subHead">
            订单信息
          </div>
          <el-row>
            <el-col :span="11" style="padding-right:21px;margin-right:20px;">
              <el-form-item label="销售类型" prop="salesType">
                <el-button type="primary" @click="orderData.salesType = 1" :plain="orderData.salesType != 1">认证零售</el-button>
                <el-button type="primary" @click="orderData.salesType = 2" :plain="orderData.salesType != 2">普通零售</el-button>
                <el-button type="primary" @click="orderData.salesType = 3" :plain="orderData.salesType != 3">批售</el-button>
              </el-form-item>
              <el-form-item label="销售挂牌价">
                <el-input v-model="orderData.listingPrice" disabled></el-input>
              </el-form-item>
              <el-form-item label="是否贷款" prop="loansPrice">
                <el-select v-model="orderData.isLoans" size="mini" style="width:25%" @change="orderData.loansPrice=''">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="2"></el-option>
                </el-select>
                <el-input v-model.number="orderData.loansPrice" placeholder="请输入贷款金额" style="width:70%" maxlength="9" :disabled="orderData.isLoans==2"></el-input>
              </el-form-item>
              <el-form-item label="金融手续费" prop="financialServicePrice">
                <el-input v-model.number="orderData.financialServicePrice" maxlength="9"></el-input>
              </el-form-item>
              <el-form-item label="其他费用" prop="otherPrice">
                <el-input v-model.number="orderData.otherPrice" maxlength="9"></el-input>
              </el-form-item>
              <el-form-item label="店内应收">
                <el-input v-model="receivablePrice" placeholder="订单金额-贷款金额" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="销售渠道" prop="salesChannel">
                <!-- <el-button type="primary" @click="orderData.salesChannel = 1;orderData.otherSalesChannelName=''" :plain="orderData.salesChannel !=1">哈弗智家</el-button> -->
                <el-button type="primary" @click="orderData.salesChannel = 2;orderData.otherSalesChannelName=''" :plain="orderData.salesChannel !=2">H5营销平台</el-button>
                <el-input v-model="orderData.otherSalesChannelName" placeholder="请输入其他渠道" style="width:40%" @blur="orderData.salesChannel=3"></el-input>
              </el-form-item>
              <el-form-item label="车辆成交价" prop="carUltimatelyPrice">
                <el-input v-model.number="orderData.carUltimatelyPrice" maxlength="9"></el-input>
              </el-form-item>
              <el-form-item label="过户手续费" prop="transferServicePrice">
                <el-input v-model.number="orderData.transferServicePrice" maxlength="9"></el-input>
              </el-form-item>
              <el-form-item label="装潢及精品" prop="decorateBoutique">
                <el-input v-model.number="orderData.decorateBoutique" maxlength="9"></el-input>
              </el-form-item>
              <el-form-item label="订单金额">
                <el-input v-model="totalPrice" placeholder="车辆成交价+过户手续费+金融手续费+装潢+其他" disabled></el-input>
              </el-form-item>
              <el-form-item label="销售顾问" prop="salesConsultantId">
                <el-select v-model="orderData.salesConsultantId" size="mini" ref="salesSelect" :disabled="!isNewCustomer">
                  <el-option v-for="sale in salesOptions" :key="sale.id" :label="sale.userName" :value="sale.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="subHead">
            收款信息
          </div>
          <el-row>
            <el-col :span="11" style="padding-right:21px;margin-right:20px;">
              <el-form-item label="已收款项" prop="gatheringStatus">
                <el-select v-model="orderData.gatheringStatus" size="mini" @change="changeGatheringStatus" :disabled="orderData.remainPrice>0">
                  <el-option label="定金" :value="1"></el-option>
                  <el-option label="全款" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="已收金额" prop="amountReceived">
                <el-input v-model.number="orderData.amountReceived" maxlength="9" @blur="orderHint"></el-input>
                <span v-if="orderData.remainPrice==0" class="warnTest">{{warnMessage}}</span>
              </el-form-item>
              <el-form-item label="收款备注">
                <el-input type="textarea" v-model="orderData.earnestRemark" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" v-if="orderData.gatheringStatus==1&&orderData.remainPrice>0">
              <el-form-item label="已收款项" prop="gatheringStatus">
                <el-select v-model="lastPrice" size="mini">
                  <el-option label="尾款" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="已收金额" prop="remainPrice">
                <el-input v-model.number="orderData.remainPrice" @blur="orderHint"></el-input>
                <span class="warnTest">{{warnMessage}}</span>
              </el-form-item>
              <el-form-item label="收款备注">
                <el-input type="textarea" v-model="orderData.finalPaymentRemark" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <div style="text-align:center">
        <el-button type="primary" @click="submitForm()">提 交</el-button>
        <el-button @click="closePage">关 闭</el-button>
      </div>
    </el-main>
    <sellCarsDialog v-if="sellCarDialog" @submitCarData="submitCarData"></sellCarsDialog>
    <customerInfoDialog v-if="customerDialog" @submitCustomerData="submitCustomerData"></customerInfoDialog>

  </div>
</template>

<script>
/*********************************************************************************************
 **                                 创建订单方法说明
 ** @function queryCarOrderById() 通过订单id获取订单信息
 ** @function queryCarOrderPage() 查询车辆订单列表
 ** @function querySystemCityList() 获取城市选项
 ** @function handleSizeChange(pageSize) 改变分页条数回调 @param pageSize 每页条数
 ** @function handleCurrentChange(currentPage) 切换页码  @param currentPage 当前页码
 ** @function formatData(val,column,cellValue) 格式数据   @param val  该行数据 column列信息 cellValue 单元格数据
 ** @function brandChangeVal() 车系下拉框选择
 ** @function seriseChangeVal() 车型下拉框选择
 ** @function selectFilter() 筛选
 ** @function resetFilter() 清空筛选条件
 ** @function gotoDetail(index,row) 查看详情 @param index 次序 @param row 该行数据
 ** @function createOrderInfo() 新增订单
 ** @function editCarOrder(index,row) 编辑订单 @param index 次序 @param row 该行数据
 ** @function uploadContract(index,row) 上传合同 @param index 次序 @param row 该行数据
 ** @function cancelOrderOperation(index,row) 取消订单/退车 @param index 次序 @param row 该行数据
 ** @function dialogConfirmCancel() 确定取消订单认证
 ** @function cancellationOrder() 确定取消订单
 ** @function dialogCancelOperation() 对话框取消按钮操作
 ** @function additionalPayment(index,row) 追加尾款  @param index 次序 @param row 该行数据
 ** @function dialogConfirmAddPayment() 确定追加尾款
 ** @function showMessageBox() 页面弹窗
 *
 *********************************************************************************************/
import sellCarsDialog from "@/components/carOrderManagement/sellCarsDialog";
import customerInfoDialog from "@/components/carOrderManagement/customerInfoDialog";
export default {
  components: {
    sellCarsDialog,
    customerInfoDialog,
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的手机号码"));
      } else {
        callback();
      }
    };
    return {
      orderId: this.$route.query.orderId, //页面状态
      sellCarDialog: false, //选择车辆弹框
      customerDialog: false, //选择客户弹框
      isNewCustomer: false, //是否是新客户
      salesOptions: [], //销售顾问下拉选
      lastPrice: "1", //尾款
      warnMessage: "", //警告消息
      //订单信息
      orderData: {
        carId: "", //车辆id
        carVin: "", //车架号
        brandId: "", //车型id
        seriesId: "", //车系id
        brandModels: "", //品牌车型
        carNo: "", //车牌号
        carSource: "", //车辆来源
        authenticationStatus: "", //是否认证
        engineNumber: "", //发动号
        isNewClientele: 2, //是否是新客户
        customerName: "", //客户姓名
        customerPhone: "", //客户电话
        customerICard: "", //身份证号
        customerSex: "", //性别d
        expectedPickupDate: "", //预计提车日期
        salesType: "", //销售类型
        salesChannel: "", //销售渠道
        otherSalesChannelName: "", //其他渠道
        listingPrice: "", //挂牌价
        carUltimatelyPrice: "", //车辆成交价
        isLoans: 2, //是否贷款 1 是 2 否
        loansPrice: "", //贷款金额
        transferServicePrice: "", //过户手续费
        financialServicePrice: "", //金融手续费
        decorateBoutique: "", //装潢及精品
        otherPrice: "", //其他费用
        totalPrice: "", // 订单金额
        receivablePrice: "", //店内应收
        salesConsultantId: "", //销售顾问
        salesConsultantName: "", //销售顾问
        gatheringStatus: "", //已收款项
        amountReceived: "", //已收金额
        earnestRemark: "", //收款备注
        remainPrice: "", //尾款已收金额
        finalPaymentRemark: "", //尾款备注
      },
      carSourceObj: {
        source_1: "外采",
        source_2: "寄售",
        source_3: "置换",
        source_4: "退换车",
        source_5: "出口",
      },
      certifiStatusObj: {
        status_1: "已认证",
        status_2: "未认证",
      },
      // 表单认证规则
      rules: {
        carVin: [
          { required: true, message: "请输入车辆VIN码", trigger: "blur" },
        ],
        customerName: [
          { required: true, message: "请输入客户姓名", trigger: "blur" },
        ],
        customerPhone: [
          { required: true, message: "请输入客户电话", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
        customerICard: [
          { required: true, message: "请输入客户身份证号", trigger: "blur" },
        ],
        customerSex: [
          { required: true, message: "请选择客户性别", trigger: "change" },
        ],
        salesType: [{ required: true, message: "请选择销售类型" }],
        salesChannel: [{ required: true, message: "请选择或输入销售渠道" }],
        carUltimatelyPrice: [
          { required: true, message: "请输入正确的成交价格" },
          { type: "number", message: "请输入正确的成交价格" },
        ],
        loansPrice: [{ type: "number", message: "请输入正确的贷款金额" }],
        transferServicePrice: [{ type: "number", message: "请输入正确的金额" }],
        financialServicePrice: [
          { type: "number", message: "请输入正确的金额" },
        ],
        decorateBoutique: [{ type: "number", message: "请输入正确的金额" }],
        otherPrice: [{ type: "number", message: "请输入正确的金额" }],
        salesConsultantId: [{ required: true, message: "请选择销售顾问" }],
        gatheringStatus: [{ required: true, message: "请选择已收款项" }],
        amountReceived: [
          { required: true, message: "请输入已收金额" },
          { type: "number", message: "请输入正确的已收金额" },
        ],
        remainPrice: [
          { required: true, message: "请输入已收金额" },
          { type: "number", message: "请输入正确的已收金额" },
        ],
      },
    };
  },
  computed: {
    // 计算订单金额
    totalPrice() {
      let total =
        Number(this.orderData.carUltimatelyPrice || 0) +
        Number(this.orderData.transferServicePrice || 0) +
        Number(this.orderData.financialServicePrice || 0) +
        Number(this.orderData.decorateBoutique || 0) +
        Number(this.orderData.otherPrice || 0);
      this.orderData.totalPrice = total;
      return total;
    },
    // 计算店内应收金额
    receivablePrice() {
      let price =
        Number(this.orderData.totalPrice || 0) -
        Number(this.orderData.loansPrice || 0);
      this.orderData.receivablePrice = price;
      return price;
    },
  },
  mounted() {
    if (this.orderId) {
      this.queryCarOrderById(); //通过订单id获取订单信息
    }
    if (this.$route.query.vin) {
      this.orderData.carVin = this.$route.query.vin;
      this.blurInputFindCarInfo();
    }
  },
  methods: {
    // 通过订单id获取订单信息
    queryCarOrderById() {
      let params = {
        id: this.orderId,
      };
      let _this = this;
      this.$axios.post(this.pathItem.queryCarOrderById, params).then((res) => {
        if (res.code == 0) {
          Object.keys(this.orderData).forEach((key) => {
            this.orderData[key] = res.result[key] || this.orderData[key];
          });
          this.orderData.id = res.result.id;
          this.orderData.remainPrice = res.result.remainPrice;
          this.orderData.finalPaymentRemark = res.result.finalPaymentRemark;
          this.orderData.earnest =
            this.orderData.gatheringStatus == 1
              ? this.orderData.earnest
              : this.orderData.amountReceived;
          this.isNewCustomer =
            this.orderData.isNewClientele == 1 ? true : false;
          let saleInfo = {
            userName: this.orderData.salesConsultantName,
            id: this.orderData.salesConsultantId,
          };
          this.salesOptions.push(saleInfo);
        } else {
          this.$alert(res.message, "提示", {
            confirmButtonText: "确定",
            type: "warning",
          });
        }
      });
    },
    //获取下拉选项
    querySystemUserInfo() {
      // 获取销售顾问
      let params = {
        roleTypes: 5, //角色类型1：二手车经理2：评估师3：翻新技师\r\n4：整备师5：二手车销售6：二手车信息员
      };
      this.$axios
        .post(this.pathItem.querySystemUserInfoDealersList, params)
        .then((res) => {
          if (res.code == 0) {
            this.salesOptions = res.result.systemUserInfoDealersList;
          } else {
            this.$alert(res.message, "提示", {
              confirmButtonText: "确定",
              type: "warning",
            });
          }
        });
    },

    //输入车架号失去焦点判断车辆信息
    blurInputFindCarInfo() {
      if (!this.orderData.carVin) return;
      let params = {
        vin: this.orderData.carVin,
      };
      this.$axios
        .post(this.pathItem.findCarInfoAndPriceByVin, params)
        .then((res) => {
          if (res.code == 0) {
            if (!res.result) {
              this.$alert("该车未开始销售，不能创建订单", "提示", {
                confirmButtonText: "确定",
                type: "warning",
              });
            }
            let result = res.result;
            this.orderData.carId = result.id; //车辆id
            this.orderData.carVin = result.vin; //车架号
            this.orderData.brandId = result.brandId; //车型id
            this.orderData.seriesId = result.seriesId; //车系id
            this.orderData.brandModels =
              result.brandName + result.seriesName + result.modelName; //品牌车型
            this.orderData.carNo = result.carNo; //车牌号
            this.orderData.carSource = result.carSource; //车辆来源

            this.orderData.engineNumber = result.engineNumber; //发动机号
            this.orderData.listingPrice = result.upPrice; //挂牌价
            let certifiedList = [8, 9, 10, 11];
            this.orderData.authenticationStatus = certifiedList.includes(
              result.certifiedStatus
            )
              ? 1
              : 2; //是否认证
          } else {
            this.$alert(res.message, "提示", {
              confirmButtonText: "确定",
              type: "warning",
            });
          }
        });
    },
    orderHint() {
      let params = {
        orderId: this.orderId,
        gatheringStatus: this.orderData.gatheringStatus,
        amountReceived: this.orderData.amountReceived || 0,
        remainPrice: this.orderData.remainPrice || 0,
        receivablePrice: this.orderData.receivablePrice || 0,
      };
      this.$axios.post(this.pathItem.orderHint, params).then((res) => {
        if (res.code == 1) {
          this.warnMessage = res.message;
        }
      });
    },
    //确认选择车辆
    submitCarData(data) {
      if (data) {
        this.orderData.carId = data.id; //车辆id
        this.orderData.carVin = data.vin; //车架号
        this.orderData.brandId = data.brandId; //车型id
        this.orderData.seriesId = data.seriesId; //车系id
        this.orderData.brandModels =
          data.brandName + data.seriesName + data.modelName; //品牌车型
        this.orderData.carNo = data.carNo; //车牌号
        this.orderData.carSource = data.carSource; //车辆来源
        this.orderData.engineNumber = data.engineNumber; //发动机号
        this.orderData.salesType = data.salesType; //销售类型
        this.orderData.saleChannel = data.saleChannel; //销售渠道
        this.orderData.listingPrice = data.upPrice; //挂牌价
        let certifiedList = [8, 9, 10, 11];
        this.orderData.authenticationStatus = certifiedList.includes(
          data.certifiedStatus
        )
          ? 1
          : 2; //是否认证
      }
      this.sellCarDialog = false;
    },
    //确认选择客户
    submitCustomerData(data) {
      if (data) {
        this.orderData.customerId = data.id; //客户姓名
        this.orderData.customerName = data.name; //客户姓名
        this.orderData.customerPhone = data.phone; //客户电话
        this.orderData.customerICard = data.idcard; //客户身份证号
        this.orderData.customerSex = data.sex; //客户性别
        this.orderData.salesConsultantId = data.salesAdvisorId; //销售顾问id
        this.orderData.salesConsultantName = data.salesAdvisorName; //销售顾问name
        this.orderData.customerBirthday = data.birthday; //客户生日
        let saleInfo = {
          userName: data.salesAdvisorName,
          id: data.salesAdvisorId,
        };
        this.salesOptions.push(saleInfo);
      }
      this.customerDialog = false;
    },
    //新客户选择框变更时
    changeIsNewCustomer() {
      this.orderData.customerName = ""; //客户姓名
      this.orderData.customerPhone = ""; //客户电话
      this.orderData.customerICard = ""; //客户身份证号
      this.orderData.customerSex = ""; //客户性别
      this.orderData.isNewClientele = this.isNewCustomer ? 1 : 2;
      this.querySystemUserInfo(); //获取下拉选项
    },
    //已收款项改变时
    changeGatheringStatus(val) {
      this.orderData.amountReceived =
        val == 2
          ? this.orderData.totalPrice - (this.orderData.loansPrice || 0)
          : "";
    },
    // 对话框确认操作   type：close关闭  orderData保存
    submitForm() {
      // 设置默认值
      this.orderData.salesConsultantName = this.$refs.salesSelect.selectedLabel; //销售顾问名称
      this.orderData.loansPrice =
        this.orderData.isLoans == 2 ? 0 : this.orderData.loansPrice; //贷款默认值
      this.orderData.transferServicePrice =
        this.orderData.transferServicePrice || 0; //过户手续费
      this.orderData.financialServicePrice =
        this.orderData.financialServicePrice || 0; //金融手续费
      this.orderData.decorateBoutique = this.orderData.decorateBoutique || 0; //装潢及精品
      this.orderData.otherPrice = this.orderData.otherPrice || 0; //其他费用
      this.orderData.expectedPickupDate = this.orderData.expectedPickupDate
        ? this.formatDate(this.orderData.expectedPickupDate, "yyyy-MM-dd")
        : "";
      this.$refs.orderForm.validate((valid) => {
        if (valid) {
          this.addCarOrder();
        }
      });
    },
    // 添加订单信息接口
    addCarOrder() {
      let pathUrl = this.orderId
        ? this.pathItem.updateCarOrder
        : this.pathItem.addCarOrder;

      this.$axios.post(pathUrl, this.orderData).then((res) => {
        if (res.code == 0) {
          let message = this.orderId ? "编辑成功" : "添加成功";
          this.$message.success({
            message: message,
            offset: 300,
          });
          this.closePage();
        } else {
          this.$alert(res.message, "提示", {
            confirmButtonText: "确定",
            type: "warning",
          });
        }
      });
    },
    // 关闭页面
    closePage() {
      let createCarOrderInfo = {
        name: "createCarOrderInfo",
      };
      this.$store.dispatch("delVisitedViews", createCarOrderInfo).then(() => {
        this.$router.replace("carOrderList");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.createOrderInfo {
  padding-bottom: 100px;
  .main-content {
    background-color: #fff;
    padding: 15px 30px;
    margin-bottom: 10px;
    font-size: 13px;
    .warnTest {
      color: rgb(245, 108, 108);
      font-size: 12px;
      position: absolute;
      left: 0;
      bottom: -25px;
    }
  }
}
</style>