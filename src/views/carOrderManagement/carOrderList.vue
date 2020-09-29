<template>
  <div class="orderList">
    <!-- 订单列表 -->
    <el-header class="header">
      <span>订单列表</span>
      <div style="float:right;">
        <el-button type="primary" @click="handleCurrentChange(1)" icon="el-icon-search">查询</el-button>
        <el-button type="primary" plain @click="resetFilter" icon="el-icon-delete">清空</el-button>
      </div>
    </el-header>
    <!-- 筛选内容 -->
    <el-main style="padding-bottom: 15px;">
      <el-row class="main-content">
        <el-row>
          <el-col class="el-col-test" :span="2">
            所在省市
          </el-col>
          <el-col :span="7">
            <el-select v-model="filterInfo.provinceId" placeholder="请选择省份" style="width:48%;padding-right:1%;" size="mini" @change="querySystemCityList">
              <el-option v-for="item in provinceOptions" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
            <el-select v-model="filterInfo.cityId" placeholder="请选择城市" style="width:47%;padding-left:2%;" size="mini">
              <el-option v-for="item in cityOptions" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-col>
          <el-col class="el-col-test" :span="2">经销商</el-col>
          <el-col :span="3">
            <el-input v-model="filterInfo.organiztionName" placeholder="请输入经销商门店" maxlength="50" size="mini"></el-input>
          </el-col>
          <el-col class="el-col-test" :span="2">订单号</el-col>
          <el-col :span="3">
            <el-input v-model="filterInfo.orderNo" placeholder="请输入订单号" maxlength="50" size="mini"></el-input>
          </el-col>
          <el-col class="el-col-test" :span="2">客户信息</el-col>
          <el-col :span="3">
            <el-input v-model="filterInfo.customerName" placeholder="请输入客户姓名/电话" maxlength="50" size="mini"></el-input>
          </el-col>
        </el-row>
        <el-row style="margin:5px auto;">
          <el-col class="el-col-test" :span="2">
            品牌车系
          </el-col>
          <el-col :span="7">
            <carBrandSerise @seriseChangeVal="seriseChangeVal" @brandChangeVal="brandChangeVal" :oldBrandId="resetBrandId" :oldSeriseId="resetSeriesId" :hasModel="false"></carBrandSerise>

          </el-col>
          <el-col class="el-col-test" :span="2">车架号</el-col>
          <el-col :span="3">
            <el-input v-model="filterInfo.carVin" placeholder="请输入车架号" maxlength="50" size="mini"></el-input>
          </el-col>
          <el-col class="el-col-test" :span="2">销售类型</el-col>
          <el-col :span="3">
            <el-select v-model="filterInfo.salesType" placeholder="请选择" size="mini">
              <el-option v-for="item in salesTypes" :key="item.id" :label="item.label" :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col class="el-col-test" :span="2">销售顾问</el-col>
          <el-col :span="3">
            <el-input v-model="filterInfo.salesConsultantName" placeholder="请输入销售顾问" maxlength="50" size="mini"></el-input>
          </el-col>
        </el-row>
        <el-row style="margin:5px auto;">
          <el-col class="el-col-test" :span="2">支付状态</el-col>
          <el-col :span="7">
            <el-select v-model="filterInfo.gatheringStatus" placeholder="请选择" size="mini" style="width:60%;">
              <el-option label="定金" :value="1"> </el-option>
              <el-option label="全款" :value="2"> </el-option>
            </el-select>
          </el-col>
          <el-col class="el-col-test" :span="2">车辆来源</el-col>
          <el-col :span="3">
            <el-select v-model="filterInfo.carSource" size="mini">
              <el-option v-for="item in carSources" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col class="el-col-test" :span="2">是否认证车</el-col>
          <el-col :span="3">
            <el-select v-model="filterInfo.authenticationStatus" size="mini">
              <el-option label="已认证" :value="1"> </el-option>
              <el-option label="未认证" :value="2"> </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-col class="el-col-test" :span="2">订单状态</el-col>
        <el-col :span="22">
          <label class="price-style" v-for="item in orderStatus" :key="item.id" :class="filterInfo.orderStatus==item.id?'price-active':''" @click="filterInfo.orderStatus=item.id">{{item.label}}</label>
        </el-col>
      </el-row>
      <el-header class="header">
        <router-link to="createCarOrderInfo">
          <el-button v-if="buttonLimits.includes(71)" type="primary" icon="el-icon-plus">新增订单</el-button>
        </router-link>
      </el-header>
      <el-row class="main-content">
        <el-table :data="tableData" border v-loading="loading">
          <template v-for="(item,index) in tableHead">
            <el-table-column :formatter="formatData" :key="index" :prop="item.prop" :label="item.label" :width="item.width" show-overflow-tooltip align="center"></el-table-column>
          </template>
          <el-table-column label="操作" width="240" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="buttonLimits.includes(72)" size="mini" type="primary" plain icon="el-icon-document" style="margin-top:5px;" @click="gotoUrl(scope.row,'carOrderDetail')">详情</el-button>
              <el-button v-if="buttonLimits.includes(73)&&scope.row.orderStatus==1" size="mini" plain icon="el-icon-edit" style="margin-top:5px;" @click="gotoUrl( scope.row,'createCarOrderInfo')">编辑</el-button>
              <el-button v-if="buttonLimits.includes(74)&&scope.row.orderStatus==1" size="mini" type="danger" plain icon="el-icon-sell" style="margin-top:5px;"
                @click="cancelOrderOperation(scope.$index, scope.row,'cancel')">取消订单</el-button>
              <el-button v-if="buttonLimits.includes(75)&&scope.row.orderStatus==1&&scope.row.gatheringStatus==1&&scope.row.remainPrice==0&&scope.row.isPayment==2" size="mini" type="warning" plain icon="el-icon-reading"
                style="margin-top:5px;" @click="additionalPayment(scope.$index, scope.row)">
                追加尾款</el-button>
              <el-button v-if="buttonLimits.includes(76)&&scope.row.orderStatus==1" size="mini" type="success" plain icon="el-icon-reading" style="margin-top:5px;" @click="uploadContract(scope.$index, scope.row)">上传合同
              </el-button>
              <el-button v-if="buttonLimits.includes(77)&&scope.row.orderStatus==2" size="mini" type="info" plain icon="el-icon-reading" style="margin-top:5px;"
                @click="cancelOrderOperation(scope.$index, scope.row,'back')">退车</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-box" v-if="!loading">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="totalElements"></el-pagination>
        </div>
      </el-row>
    </el-main>
    <!-- 弹框 -->
    <!-- 追加尾款 -->
    <el-dialog title="追加尾款" :visible.sync="dialogVisible" width="50%">
      <el-form ref="form" :model="dialogAddPayment" label-width="120px" style="width:80%;margin:auto;" size="small">
        <el-form-item label="店内应收">
          <el-input v-model="dialogAddPayment.receivablePrice" disabled></el-input>
        </el-form-item>
        <el-form-item label="已收定金">
          <el-input v-model="dialogAddPayment.earnest" disabled></el-input>
        </el-form-item>
        <el-form-item label="尾款金额">
          <el-input v-model="dialogAddPayment.remainPrice" disabled></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="dialogAddPayment.finalPaymentRemark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogConfirmAddPayment()">提 交</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 取消订单 -->
    <el-dialog :title="dialogShowType=='cancel'?'取消订单':'退车'" :visible.sync="dialogCancelOrder" width="60%" @close="dialogCancelOperation">
      <el-form ref="cancelForm" :rules="rules" :model="dialogCancelOrderInfo" label-width="120px" style="width:90%;margin:auto;" size="small">
        <el-form-item :label="dialogShowType=='cancel'?'取消原因':'退车原因'">
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="dialogCancelOrderInfo.refundReason">
            <template v-if="dialogShowType=='cancel'">
              <el-radio label="1">订单重复</el-radio>
              <el-radio label="2">误操作</el-radio>
            </template>
            <template v-else>
              <el-radio label="5">质量问题</el-radio>
            </template>
            <el-radio label="3">客户退订</el-radio>
            <el-radio label="4">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="dialogCancelOrderInfo.remark"></el-input>
        </el-form-item>
        <el-form-item label="退款金额">
        </el-form-item>
        <template v-if="selectOrderData.gatheringStatus==1&&selectOrderData.remainPrice==0">
          <el-form-item label="车辆定金" prop="earnest">
            <el-input v-model.number="dialogCancelOrderInfo.earnest"></el-input>
            <div class="cRed">退款金额不得大于定金金额（￥{{selectOrderData.amountReceived}}）</div>
          </el-form-item>
        </template>
        <template v-if="selectOrderData.gatheringStatus==2">
          <el-form-item label="车辆成交价" prop="carUltimatelyPrice">
            <el-input v-model.number="dialogCancelOrderInfo.carUltimatelyPrice"></el-input>
            <div class="cRed">退款金额不得大于店内支付金额（成交价-贷款金额）
              （￥{{selectOrderData.carUltimatelyPrice-selectOrderData.loansPrice}}）
            </div>
          </el-form-item>
        </template>
        <template v-else-if="selectOrderData.remainPrice>0">
          <el-form-item label="车辆定金" prop="earnest">
            <el-input v-model.number="dialogCancelOrderInfo.earnest"></el-input>
            <div class="cRed">退款金额不得大于定金金额（￥{{selectOrderData.earnest}}）</div>
          </el-form-item>
          <el-form-item label="车辆余款" prop="remainPrice">
            <el-input v-model.number="dialogCancelOrderInfo.remainPrice"></el-input>
            <div class="cRed">退款金额不得大于店内支付车辆余款金额（成交价-贷款金额 -定金）
              （￥{{selectOrderData.carUltimatelyPrice-selectOrderData.loansPrice-selectOrderData.earnest}}）
            </div>
          </el-form-item>
        </template>
        <template v-if="selectOrderData.gatheringStatus!=1||selectOrderData.remainPrice>0">
          <el-form-item label="过户手续费" prop="transferServicePrice">
            <el-input v-model.number="dialogCancelOrderInfo.transferServicePrice"></el-input>
            <div class="cRed">退款金额不得大于过户手续费金额（￥{{selectOrderData.transferServicePrice}}）</div>
          </el-form-item>
          <el-form-item label="金融手续费" prop="financialServicePrice">
            <el-input v-model.number="dialogCancelOrderInfo.financialServicePrice"></el-input>
            <div class="cRed">退款金额不得大于金融手续费金额（￥{{selectOrderData.financialServicePrice}}）</div>
          </el-form-item>
          <el-form-item label="装潢及精品" prop="decorateBoutique">
            <el-input v-model.number="dialogCancelOrderInfo.decorateBoutique"></el-input>
            <div class="cRed">退款金额不得大于装潢及精品金额（￥{{selectOrderData.decorateBoutique}}）</div>
          </el-form-item>
          <el-form-item label="其他费用" prop="otherPrice">
            <el-input v-model.number="dialogCancelOrderInfo.otherPrice"></el-input>
            <div class="cRed">退款金额不得大于其他费用金额（￥{{selectOrderData.otherPrice}}）</div>
          </el-form-item>
        </template>
        <p class="text-right">退款合计 ￥{{refundPrice}}</p>
        <p class="cRed">请线下退回退款金额</p>
        <p>车辆需要重新上架</p>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogConfirmCancel">提 交</el-button>
        <el-button @click="dialogCancelOperation">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 上传合同 -->
    <uploadContractFile v-if="dialogUploadPhoto" :orderId="dialogImgOrderId" @closeImgDialog="coloseImgDialog" @successUpload="successUpload"></uploadContractFile>
  </div>
</template>

<script>
/*********************************************************************************************
 **                                 订单列表方法说明
 ** @function queryCarOrderPage() 查询车辆订单列表
 ** @function querySystemCityList() 获取城市选项
 ** @function handleSizeChange(pageSize) 改变分页条数回调 @param pageSize 每页条数
 ** @function handleCurrentChange(currentPage) 切换页码  @param currentPage 当前页码
 ** @function formatData(val,column,cellValue) 格式数据   @param val  该行数据 column列信息 cellValue 单元格数据
 ** @function brandChangeVal() 车系下拉框选择
 ** @function seriseChangeVal() 车型下拉框选择
 ** @function resetFilter() 清空筛选条件
 ** @function gotoUrl(row,url) 查看详情  @param row 该行数据 @param url 跳转路径
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
import carBrandSerise from "../../components/certification/selectCarBrand";
import uploadContractFile from "@/components/carOrderManagement/uploadContractFile";
export default {
  components: {
    carBrandSerise,
    uploadContractFile,
  },
  data() {
    return {
      buttonLimits: [],
      buttonKey: "",
      filterInfo: {
        provinceId: "", //省份
        cityId: "", //城市
        organiztionName: "", //经销商名字
        orderNo: "", //订单号
        customerName: "", //客户姓名
        brandId: "", //品牌Id
        seriesId: "", //车系Id
        carVin: "", //车架号
        salesType: "", //销售类型  : 1：认证零售 ,:2：普通零售 ,:3：批售
        salesConsultantName: "", //销售顾问名称
        gatheringStatus: "", //支付状态 1 定金 2全款
        carSource: "", //1：外采2：寄售3：置换4：退换车5：出口
        authenticationStatus: "", //是否认证车1已经认证 2 未认证
        orderStatus: "", //订单状态1：已预订2：已成交3：已取消4：已退车
      },
      provinceOptions: [], //省份
      cityOptions: [], //城市
      resetBrandId: 0, //品牌车型
      resetSeriesId: 0, //品牌车系
      salesTypes: [
        { id: 1, label: "认证零售" },
        { id: 2, label: "普通零售" },
        { id: 3, label: "批售" },
      ],
      carSources: [
        { id: 1, label: "外采" },
        { id: 2, label: "寄售" },
        { id: 3, label: "置换" },
        { id: 4, label: "退换" },
        { id: 5, label: "出口" },
      ],
      orderStatus: [
        { id: "", label: "全部" },
        { id: 1, label: "已预订" },
        { id: 2, label: "已成交" },
        { id: 3, label: "已取消" },
        { id: 4, label: "已退车" },
      ],
      pageSize: 10,
      currentPage: 1, //当前页数
      totalElements: 0,
      tableData: [],
      loading: false, //加载数据
      dialogShowType: "cancel", //取消订单 cancel  退车 back
      dialogVisible: false, //追加尾款弹框显示状态
      dialogAddPayment: {}, //追加尾款弹框数据信息
      dialogUploadPhoto: false, //上传图片
      dialogImgOrderId: "",
      dialogCancelOrder: false, //取消定金——只支付定金弹框显示状态
      selectOrderData: "", //选择操作的订单数据
      dialogCancelOrderInfo: {
        refundReason: "", //取消理由
        remark: "", //备注
        earnest: "", //定金
        transferServicePrice: "", //过户手续费
        financialServicePrice: "", //金融手续费
        decorateBoutique: "", //装潢及精品
        otherPrice: "", //其他费用
        carUltimatelyPrice: "", //车辆成交价
        remainPrice: "", //尾款金额
        refundPrice: "", //退款总金额
      }, //取消定金信息
      dialogReturnOrderInfo: {
        payStatus: 1,
      }, //退车定金信息
      buttonLimits: [], //按钮权限
      tableHead: [
        { prop: "orderNo", label: "订单号", width: 140 },
        { prop: "organiztionName", label: "经销商", width: 140 },
        { prop: "cityName", label: "所在省市", width: 140 },
        { prop: "brandModels", label: "品牌车型", width: 170 },
        { prop: "carVin", label: "车架号" },
        { prop: "carSource", label: "车辆来源" },
        { prop: "authenticationStatus", label: "是否认证车", width: 140 },
        { prop: "customerName", label: "客户姓名", width: 110 },
        { prop: "customerPhone", label: "客户电话", width: 120 },
        { prop: "salesConsultantName", label: "销售顾问", width: 110 },
        { prop: "salesType", label: "销售类型" },
        { prop: "carUltimatelyPrice", label: "车辆成交价", width: 120 },
        { prop: "receivablePrice", label: "店内应收金额", width: 120 },
        { prop: "amountReceived", label: "已收金额", width: 120 },
        { prop: "orderStatus", label: "订单状态" },
        { prop: "createdAt", label: "下单时间", width: 155 },
        { prop: "turnoverTime", label: "成交时间", width: 155 },
        { prop: "salesChannel", label: "销售渠道", width: 120 },
      ],
      // 表单认证规则
      rules: {
        carUltimatelyPrice: [
          { type: "number", message: "请输入正确的成交价格" },
        ],
        earnest: [{ type: "number", message: "请输入正确的金额" }],
        transferServicePrice: [{ type: "number", message: "请输入正确的金额" }],
        financialServicePrice: [
          { type: "number", message: "请输入正确的金额" },
        ],
        decorateBoutique: [{ type: "number", message: "请输入正确的金额" }],
        otherPrice: [{ type: "number", message: "请输入正确的金额" }],
        remainPrice: [{ type: "number", message: "请输入正确的已收金额" }],
      },
    };
  },
  computed: {
    refundPrice() {
      let price =
        Number(this.dialogCancelOrderInfo.earnest || 0) +
        Number(this.dialogCancelOrderInfo.carUltimatelyPrice || 0) +
        Number(this.dialogCancelOrderInfo.remainPrice || 0) +
        Number(this.dialogCancelOrderInfo.transferServicePrice || 0) +
        Number(this.dialogCancelOrderInfo.financialServicePrice || 0) +
        Number(this.dialogCancelOrderInfo.decorateBoutique || 0) +
        Number(this.dialogCancelOrderInfo.otherPrice || 0);
      this.dialogCancelOrderInfo.refundPrice = price;
      return price;
    },
  },
  mounted() {
    this.buttonLimits = this.$route.meta.button;
    this.buttonKey = this.$route.meta.buttonKey;
    this.queryCarOrderPage(); //订单信息列表
    this.querySystemCityList(); //查询城市
  },
  methods: {
    // 查询车辆订单列表
    queryCarOrderPage() {
      this.loading = true;
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        buttonKey: this.buttonKey,
        carOrder: this.filterInfo,
      };

      this.$axios.post(this.pathItem.queryCarOrderPage, params).then((res) => {
        if (res.code == 0) {
          this.tableData = res.result.records;
          this.totalElements = res.result.total;
        } else {
          this.$alert(res.message, "提示", {
            confirmButtonText: "确定",
            type: "warning",
          });
        }
        this.loading = false;
      });
    },
    // 获取城市下拉选项
    querySystemCityList() {
      let params = {
        parentId: this.filterInfo.provinceId,
      };
      this.$axios
        .post(this.pathItem.querySystemCityList, params)
        .then((res) => {
          if (res.code == 0) {
            if (this.filterInfo.provinceId) {
              this.cityOptions = res.result.systemCityList;
            } else {
              this.provinceOptions = res.result.systemCityList;
            }
          } else {
            this.$alert(res.message, "提示", {
              confirmButtonText: "确定",
              type: "warning",
            });
          }
        });
    },
    //每页条数改变时触发事件
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.queryCarOrderPage();
    },
    //当前页码改变时触发事件
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.queryCarOrderPage();
    },
    //格式化数据
    formatData(val, column, cellValue) {
      let salesTypeList = {
        type_1: "认证零售",
        type_2: "普通零售",
        type_3: "批售",
      };
      let orderStatusObj = {
        status_1: "已预订",
        status_2: "已成交",
        status_3: "已取消",
        status_4: "已退车",
      };
      let carSourceObj = {
        source_1: "外采",
        source_2: "寄售",
        source_3: "置换",
        source_4: "退换车",
        source_5: "出口",
      };
      let authenticationStatusObj = {
        type_1: "已认证",
        type_2: "未认证",
      };
      const cellVal = {
        salesType: salesTypeList["type_" + cellValue],
        orderStatus: orderStatusObj["status_" + cellValue],
        createdAt: this.formatDate(cellValue, "yyyy-MM-dd hh:mm:ss"),
        turnoverTime: this.formatDate(cellValue, "yyyy-MM-dd hh:mm:ss"),
        carSource: carSourceObj["source_" + cellValue],
        authenticationStatus: authenticationStatusObj["type_" + cellValue],
        salesChannel:
          cellValue == 1
            ? "哈弗智家"
            : cellValue == 2
            ? "H5营销平台"
            : val.otherSalesChannelName,
      };
      return cellVal[column.property] || cellValue || "--";
    },
    //选择的车系
    brandChangeVal(selectName) {
      this.resetBrandId = Number(selectName.carBrandId); //品牌车型
      this.filterInfo.brandId = this.resetBrandId;
    },
    //选择的车型
    seriseChangeVal(selectName) {
      this.resetSeriesId = Number(selectName.carSeriesId); //品牌车系
      this.filterInfo.seriesId = selectName.carSeriesId;
    },
    // 清空 重置
    resetFilter() {
      this.filterInfo = {
        provinceId: "", //省份
        cityId: "", //城市
        organiztionName: "", //经销商名字
        orderNo: "", //订单号
        customerName: "", //客户姓名
        brandId: "", //品牌Id
        seriesId: "", //车系Id
        carVin: "", //车架号
        salesType: "", //销售类型  : 1：认证零售 ,:2：普通零售 ,:3：批售
        salesConsultantName: "", //销售顾问名称
        gatheringStatus: "", //支付状态 1 定金 2全款
        carSource: "", //1：外采2：寄售3：置换4：退换车5：出口
        authenticationStatus: "", //是否认证车1已经认证 2 未认证
        orderStatus: "", //订单状态1：已预订2：已成交3：已取消4：已退车
      };
      this.resetBrandId = 0; //品牌车型
      this.resetSeriesId = 0; //品牌车系
      this.currentPage = 1;
    },
    // 查看详情/编辑订单
    gotoUrl(row, url) {
      this.$router.push({
        path: url,
        query: {
          orderId: row.id,
        },
      });
    },
    // 上传合同
    uploadContract(index, row) {
      this.dialogUploadPhoto = true;
      this.dialogImgOrderId = row.id;
    },
    //取消订单 or 退车
    cancelOrderOperation(index, row, type) {
      this.selectOrderData = row;
      this.dialogShowType = type;
      this.dialogCancelOrderInfo.orderId = row.id;
      let message = type == "cancel" ? "确定要取消该订单？" : "确定要退车？";
      this.$confirm(message, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.dialogCancelOrder = true;
        })
        .catch(() => {});
    },
    // 确认取消订单
    dialogConfirmCancel() {
      if (!this.dialogCancelOrderInfo.refundReason) {
        this.showMessageBox("error", "请选择取消原因");
        return;
      }
      if (
        !this.dialogCancelOrderInfo.remark &&
        (this.dialogCancelOrderInfo.refundReason == 3 ||
          this.dialogCancelOrderInfo.refundReason == 4)
      ) {
        this.showMessageBox("error", "请输入备注信息");
        return;
      }
      this.$refs.cancelForm.validate((valid) => {
        if (valid) {
          this.cancellationOrder();
        }
      });
    },
    cancellationOrder() {
      let pathUrl =
        this.dialogShowType == "cancel"
          ? this.pathItem.cancellationOrder
          : this.pathItem.BackCar;
      let params = {
        orderId: this.dialogCancelOrderInfo.orderId,
        refundReason: this.dialogCancelOrderInfo.refundReason, //取消理由
        remark: this.dialogCancelOrderInfo.remark, //备注
        earnest: this.dialogCancelOrderInfo.earnest || 0, //定金
        transferServicePrice:
          this.dialogCancelOrderInfo.transferServicePrice || 0, //过户手续费
        financialServicePrice:
          this.dialogCancelOrderInfo.financialServicePrice || 0, //金融手续费
        decorateBoutique: this.dialogCancelOrderInfo.decorateBoutique || 0, //装潢及精品
        otherPrice: this.dialogCancelOrderInfo.otherPrice || 0, //其他费用
        carUltimatelyPrice: this.dialogCancelOrderInfo.carUltimatelyPrice || 0, //车辆成交价
        remainPrice: this.dialogCancelOrderInfo.remainPrice || 0, //尾款金额
        refundPrice: this.dialogCancelOrderInfo.refundPrice || 0, //退款总金额
      };
      this.$axios.post(pathUrl, params).then((res) => {
        if (res.code == 0) {
          let message =
            this.dialogShowType == "cancel" ? "成功取消该订单" : "退车成功";
          this.showMessageBox("success", message);
          this.queryCarOrderPage();
          this.dialogCancelOperation();
        } else {
          this.showMessageBox("error", res.message);
        }
      });
    },
    //取消订单关闭对话框
    dialogCancelOperation() {
      this.dialogCancelOrder = false;
      this.dialogCancelOrderInfo = {
        refundReason: "", //取消理由
        remark: "", //备注
        earnest: "", //定金
        transferServicePrice: "", //过户手续费
        financialServicePrice: "", //金融手续费
        decorateBoutique: "", //装潢及精品
        otherPrice: "", //其他费用
        carUltimatelyPrice: "", //车辆成交价
        remainPrice: "", //尾款金额
        refundPrice: "", //退款总金额
      }; //取消定金信息
    },
    // 追加尾款
    additionalPayment(index, row) {
      this.dialogAddPayment = {
        id: row.id, //订单id
        remainPrice: row.receivablePrice - row.earnest, //订单尾款金额
        earnest: row.earnest, //定金
        receivablePrice: row.receivablePrice, //店内应收金额
        accessory: row.accessory, //合同路径
        finalPaymentRemark: "", //尾款备注
      };
      this.dialogVisible = true;
    },
    // 追加尾款对话框提交信息
    dialogConfirmAddPayment() {
      this.$axios
        .post(this.pathItem.additionalPayment, this.dialogAddPayment)
        .then((res) => {
          if (res.code == 0) {
            this.showMessageBox("success", "追加成功");
            this.queryCarOrderPage();
            this.dialogVisible = false;
          } else if (res.code == 1) {
            let message = "追加成功，" + res.message;
            this.$alert(message).then((res) => {
              this.queryCarOrderPage();
              this.dialogVisible = false;
            });
          } else {
            this.showMessageBox("error", res.message);
          }
        });
    },
    coloseImgDialog() {
      this.dialogUploadPhoto = false;
    },
    successUpload() {
      this.dialogUploadPhoto = false;
      this.queryCarOrderPage();
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
};
</script>

<style lang="scss" scoped>
.orderList {
  .main-content {
    background-color: #fff;
    padding: 15px 30px;
    margin-bottom: 10px;
    font-size: 13px;
    .el-col-test {
      line-height: 28px;
      padding-right: 10px;
      text-align: right;
    }
    .price-style {
      margin-left: 10px;
      padding: 5px 10px;
      &.price-active {
        background: #67c23a;
        color: #fff;
        border-radius: 4px;
      }
    }

    .col-width {
      width: 41%;
    }
  }
}
.dialog-footer {
  text-align: center;
}
</style>
<style>
.el-dialog__footer {
  text-align: center;
}
</style>