<template>
  <div class="carsAssessList">
    <!-- 信息筛选 -->
    <el-header class="header">
      <span>信息筛选</span>
      <div style="float:right;">
        <el-button type="primary" @click="handleCurrentChange(1)" icon="el-icon-search">查询</el-button>
        <el-button type="primary" plain @click="resetFilter" icon="el-icon-delete">清空</el-button>
      </div>
    </el-header>
    <!-- 筛选内容 -->
    <el-main style="padding-bottom: 15px;">
      <el-row class="main-content">
        <el-row>
          <el-col class="el-col-test" :span="2">评估价格</el-col>
          <el-col :span="22">
            <label class="price-style" v-for="price in carprices" :key="price.id" :class="nowPriceId==price.id?'price-active':''" @click="clickPrice(price)">{{price.label}}</label>
            <el-input v-model="filterMinEvaluatePrice" size="mini" style="width:50px;"></el-input>万 -
            <el-input v-model="filterMaxEvaluatePrice" size="mini" style="width:50px;"></el-input>万
          </el-col>
        </el-row>
        <el-row style="margin:5px auto;">
          <el-col class="el-col-test" :span="2">品牌车型</el-col>
          <el-col :span="4">
            <carBrandSerise @seriseChangeVal="seriseFilterChangeVal" @brandChangeVal="brandFilterChangeVal" @modelChangeVal="modelFilterChangeVal" :oldBrandId="filterBrandId" :oldSeriseId="filterSeriesId"
              :oldModelId="filterModelId" :hasModel="true" :hasBrandMult="true" :hasModelMult="true" :hasSeriesMult="true"></carBrandSerise>
          </el-col>
          <el-col class="el-col-test" :span="2">VIN码</el-col>
          <el-col :span="2">
            <el-input v-model="filterInfo.vin" maxlength="50" size="mini"></el-input>
          </el-col>
          <el-col class="el-col-test" :span="2">车牌号</el-col>
          <el-col :span="2">
            <el-input v-model="filterInfo.complicated" maxlength="50" size="mini"></el-input>
          </el-col>
          <el-col class="el-col-test" :span="2">经销商</el-col>
          <el-col :span="2">
            <el-input v-model="filterInfo.orgName" maxlength="50" size="mini"></el-input>
          </el-col>
          <el-col class="el-col-test" :span="2">评估师</el-col>
          <el-col :span="2">
            <el-select v-model="filterAssessor" @change="choseAssessor" size="mini">
              <el-option v-for="role in roleTypes" :key="role.id" :label="role.userName" :value="role.id"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin:5px auto;">
          <el-col class="el-col-test" :span="2">车主姓名</el-col>
          <el-col :span="4">
            <el-input v-model="filterInfo.bookName" maxlength="50" size="mini"></el-input>
          </el-col>
          <el-col class="el-col-test" :span="2">车主电话</el-col>
          <el-col :span="2">
            <el-input v-model="filterInfo.bookPhone" maxlength="50" size="mini"></el-input>
          </el-col>
          <el-col class="el-col-test" :span="2">录入人</el-col>
          <el-col :span="2">
            <el-select v-model="filterCreat" @change="choseOperator" size="mini">
              <el-option v-for="operator in operatorList" :key="operator.id" :label="operator.userName" :value="operator.id"></el-option>
            </el-select>
          </el-col>
          <el-col class="el-col-test" :span="2">录入时间</el-col>
          <el-col :span="6">
            <el-date-picker v-model="filterTime" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
              size="mini" style="width:100%;"></el-date-picker>
          </el-col>
        </el-row>
        <el-col class="el-col-test" :span="2">评估状态</el-col>

        <el-col :span="22" style="margin-top:5px;">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style="display:inline-block; margin-right:30px;">全部</el-checkbox>
          <el-checkbox-group v-model="assessStatusCheck" @change="handleCheckedCitiesChange" style="display:inline-block;">
            <el-checkbox v-for="checkItem in assessStatus" :key="checkItem.id" :label="checkItem.id">{{checkItem.label}}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <!-- 评估列表 -->
      <el-header class="header">
        <span>评估列表</span>
        <div class="createCard" v-if="buttonLimits.includes(111)" style="float:right;">
          <el-button type="primary" @click="dialogVisible = true" icon="el-icon-plus">车辆建卡</el-button>
        </div>
      </el-header>
      <el-row class="main-content">
        <el-table :data="tableData" border v-loading="loading">
          <template v-for="(item,index) in tableHead">
            <el-table-column :formatter="formatData" :key="index" :prop="item.prop" :label="item.label" :width="item.width" show-overflow-tooltip align="center"></el-table-column>
          </template>
          <el-table-column label="操作" width="240" align="center">
            <template slot-scope="scope">
              <el-button v-if="buttonLimits.includes(110)" size="mini" type="primary" plain icon="el-icon-document" style="margin-top:5px;" @click="gotoDetail(scope.$index, scope.row)">详情</el-button>
              <el-button v-if="buttonLimits.includes(137)&&scope.row.reportStatus != 4" size="mini" type="danger" plain icon="el-icon-edit" style="margin-top:5px;" @click="editAssess(scope.$index, scope.row)">编辑
              </el-button>
              <el-button size="mini" type="success" plain icon="el-icon-sell" style="margin-top:5px;" v-if="buttonLimits.includes(113)&&scope.row.reportStatus== 3" @click="putStorage(scope.$index, scope.row)">入库
              </el-button>
              <el-button v-if="buttonLimits.includes(138)&&(scope.row.reportStatusLable==1 || scope.row.reportStatusLable==2)" size="mini" type="warning" plain icon="el-icon-reading" style="margin-top:5px;"
                @click="readReport(scope.$index, scope.row)">查看检测报告</el-button>
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
    <buildCard v-if="dialogVisible" @closeBuildCard="closeBuild" @successBuild="successBuild"></buildCard>
    <!-- 入库弹框 -->
    <putInStorage v-if="dialogStorage" @successPutIn="successPutIn" @closePutIn="closePutInStorage" :putInStorageInfo="dialogStorageInfo"></putInStorage>
  </div>
</template>

<script>
/*********************************************************************************************
 **                                 车辆列表方法说明
 ** @function findCarList() 获取车辆列表
 ** @function handleSizeChange(pageSize) 改变分页条数回调 @param pageSize 每页条数
 ** @function handleCurrentChange(currentPage) 切换页码  @param currentPage 当前页码
 ** @function formatData(val,column,cellValue) 格式数据   @param val  该行数据 column列信息 cellValue 单元格数据
 ** @function formatWorkStatus(workStatus) 整备格式化 @param workStatus  整备状态
 ** @function formatSaleChannel(salePlant) 销售平台格式化 @param salePlant  销售平台
 ** @function formatSaleType(saleType) 销售类型格式化 @param saleType  销售类型
 ** @function formatCarState(carStatus) 车辆状态格式化 @param carStatus  车辆状态
 ** @function formatCertifiedStatus(cerStatus) 认证状态格式化 @param cerStatus  认证状态
 ** @function formatReportStatus(reportStatus) 评估状态格式化 @param reportStatus  评估状态
 ** @function formatOrderStatus(item) 订单状态格式化 @param item  订单状态
 ** @function getOrgList() 获取经销商
 ** @function choseOrg(val) 选择经销商 @param val 选择的信息
 ** @function brandFilterChangeVal(selectName) 筛选车牌品牌回调  @param selectName  选择的值 
 ** @function seriseFilterChangeVal(selectName) 筛选车系回调  @param selectName  选择的值 
 ** @function modelFilterChangeVal(selectName) 筛选车型回调  @param selectName  选择的值 
 ** @function clickPurchasePrice(item) 选择采购价格  @param item 选择的值
 ** @function clickTransactionPrice(item) 选择成交价格 @param item 选择的值
 ** @function clickSalesPrice(item) 选择销售价格 @param item 选择的值
 ** @function resetFilter() 清空筛选条件

 ** @function gotoDetail(index,row) 查看详情 @param index 次序 @param row 该行数据
 ** @function applyAuthentication(index,row) 申请认证  @param index 次序 @param row 该行数据
 ** @function reserveCarButton(index,row) 车辆预定 @param index 次序 @param row 该行数据

 ** @function applyHostling(index,row) 整备 @param index 次序 @param row 该行数据
 ** @function successHostling() 整备完成回调 
 ** @function closeHostlingDialog() 关闭整备弹窗
 ** @function showSellPriceDialog(index,row) 销售定价  @param index 次序 @param row 该行数据
 ** @function closeSalesPrice() 关闭销售定价弹窗
 ** @function upShelf(index,row) 上架 @param index 次序 @param row 该行数据
 ** @function downShelf(index,row) 下架 @param index 次序 @param row 该行数据

 ** @function openSaleImg(index,row) 上传销售照片 @param index 次序 @param row 该行数据
 ** @function coloseImgDialog() 关闭销售照片 
 ** @function successUpload() 上传成功回调 @param index 次序 @param row 该行数据
 ** @function editAssess(index,row) 编辑评估列表 @param index 次序 @param row 该行数据
 ** @function deleteAssess(index,row) 删除车辆 @param index 次序 @param row 该行数据
 ** @function putStorage(index,row) 入库 @param index 次序 @param row 该行数据

 ** @function closePutInStorage() 关闭入库 
 ** @function successPutIn() 入库成功
 ** @function readReport(index,row) 查看检查报告 @param index 次序 @param row 该行数据
 ** @function closeBuild() 关闭建卡
 ** @function successBuild(type,phone) 建卡成功回调 @param type 建卡方式 @param phone 手机号
 ** @function carTransfer(index,row) 车辆过户
 ** @function certificationReport(index,row) 认证汇报
 ** @function cancleCer(index,row)  汇报撤销
 ** @function showMessageBox() 页面弹窗
 *
 *
 *********************************************************************************************/
import carBrandSerise from "../../components/certification/selectCarBrand";
import putInStorage from "../../components/carManagement/putInStorage";
import buildCard from "../../components/carManagement/buildCard";
export default {
  components: {
    carBrandSerise,
    buildCard,
    putInStorage,
  },
  data() {
    return {
      buttonLimits: [], //按钮权限
      assessStatusCheck: [],
      nowPriceId: 1,
      filterInfo: {
        maxEvaluatePrice: "",
        minEvaluatePrice: "",
        brandNameList: [],
        seriesNameList: [],
        modelNameList: [],
        vin: "",
        complicated: "",
        orgName: "",
        assessor: "",
        bookName: "",
        bookPhone: "",
        createdName: "",
        maxCreatedAt: "",
        minCreatedAt: "",
        statusList: [1, 2, 3, 4],
      },
      filterMaxEvaluatePrice: "",
      filterMinEvaluatePrice: "",
      filterBrandId: "",
      filterSeriesId: "",
      filterModelId: "",
      filterAssessor: "",
      filterAssessorName: "",
      filterTime: "",
      filterCreat: "",
      filterCreatName: "",

      carprices: [
        {
          id: 1,
          label: "全部",
        },
        {
          id: 2,
          label: "5万以下",
        },
        {
          id: 3,
          label: "5-10万",
        },
        {
          id: 4,
          label: "10-20万",
        },
        {
          id: 5,
          label: "20-30万",
        },
        {
          id: 6,
          label: "30-40万",
        },
        {
          id: 7,
          label: "40万以上",
        },
      ],
      isIndeterminate: true,
      checkAll: false,
      assessStatus: [
        {
          id: 1,
          label: "待评估",
        },
        {
          id: 2,
          label: "评估中",
        },
        {
          id: 3,
          label: "已评估",
        },
        {
          id: 4,
          label: "评估失败",
        },
      ],
      pageSize: 10,
      currentPage: 1, //当前页数
      totalPage: 1,
      totalElements: 0,
      tableData: [],
      operatorList: [],
      loading: false, //加载数据

      tableHead: [
        {
          prop: "carNumber",
          label: "车辆编号",
          width: 140,
        },
        {
          prop: "brandType",
          label: "品牌车型",
          width: 140,
        },
        {
          prop: "vin",
          label: "VIN码",
        },
        {
          prop: "carNo",
          label: "原车牌号",
          width: 120,
        },
        {
          prop: "evaluatePrice",
          label: "评估价",
        },
        {
          prop: "mileage",
          label: "行驶里程（公里）",
        },
        {
          prop: "registeredDate",
          label: "注册时间",
          width: 140,
        },
        {
          prop: "orgName",
          label: "经销商",
          width: 140,
        },
        {
          prop: "createdName",
          label: "录入人",
        },
        {
          prop: "createdAt",
          label: "录入时间",
          width: 140,
        },
        {
          prop: "reportStatus",
          label: "评估状态",
        },
        {
          prop: "reportStatusLable",
          label: "进度标签",
          width: 120,
        },
      ],
      roleTypes: [],
      dialogVisible: false, //建卡弹框显示状态

      dialogStorage: false, //入库弹框显示状态
      storageCarInfo: {},
    };
  },
  watch: {
    filterMinEvaluatePrice(newVal, oldVal) {
      this.filterInfo.minEvaluatePrice = newVal * 10000;
    },
    filterMaxEvaluatePrice(newVal, oldVal) {
      this.filterInfo.maxEvaluatePrice = newVal * 10000;
    },
  },
  computed: {
    //获取vuex存储的已预览标签页
  },
  mounted() {
    this.buttonLimits = this.$route.meta.button;
    this.findAppraiserList();

    this.findCarList();
    this.getCreaters();
  },
  methods: {
    handleCheckAllChange(val) {
      this.assessStatusCheck = val ? [1, 2, 3, 4] : [];
      this.isIndeterminate = false;
      this.filterInfo.statusList =
        this.assessStatusCheck.length > 0
          ? this.assessStatusCheck
          : [1, 2, 3, 4];
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.assessStatus.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.assessStatus.length;
      this.filterInfo.statusList =
        this.assessStatusCheck.length > 0
          ? this.assessStatusCheck
          : [1, 2, 3, 4];
    },
    findCarList() {
      var params = {};
      if (
        this.filterInfo.maxEvaluatePrice &&
        this.filterInfo.minEvaluatePrice
      ) {
        if (
          this.filterInfo.maxEvaluatePrice < this.filterInfo.minEvaluatePrice
        ) {
          this.showMessageBox("error", "最大评估价格需大于最小评估价格");
          return;
        }
      }

      if (this.filterTime) {
        this.filterInfo.maxCreatedAt = this.filterTime[1];
        this.filterInfo.minCreatedAt = this.filterTime[0];
      } else {
        this.filterInfo.maxCreatedAt = "";
        this.filterInfo.minCreatedAt = "";
      }
      this.filterInfo.assessor = this.filterAssessorName;
      for (var key in this.filterInfo) {
        if (this.filterInfo[key]) {
          params[key] = this.filterInfo[key];
        }
      }
      params.carStatusList = [1];
      params.sortFlag = 3;

      params.pageSize = this.pageSize;
      params.pageNo = this.currentPage;
      params.buttonKey=this.$route.meta.buttonKey;
      this.loading = true;
      this.$axios
        .post(this.pathItem.findCarList, params)
        .then((res) => {
          if (res.code == 0) {
            this.tableData = res.result.records;
            this.totalElements = res.result.total;
          } else {
            this.tableData = [];
            this.totalElements = 0;
            this.showMessageBox("error", res.message);
          }

          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
          this.showMessageBox("error", res.message);
        });
    },
    //每页条数改变时触发事件
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.handleCurrentChange(1);
    },
    //当前页码改变时触发事件
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.findCarList();
    },
    formatReportStatus(reportStatus) {
      switch (reportStatus) {
        case 1:
          return "待评估";
          break;
        case 2:
          return "评估中";
          break;
        case 3:
          return "已评估";
          break;
        case 4:
          return "评估失败";
          break;
        default:
          break;
      }
    },
    formatReportStatusLable(reportStatusLable){
       switch (reportStatusLable) {
        case 1:
          return "初检完成";
          break;
        case 2:
          return "检测完成";
          break;
        case 3:
          return "验收完成";
          break;
        default:
           return "--";
          break;
      }
    },
    //格式化数据
    formatData(val, column, cellValue) {
      if (column.property == "reportStatus") {
        return this.formatReportStatus(cellValue);
      }
      if (column.property == "brandType") {
        if (val.brandName) {
          return val.brandName + val.seriesName + val.modelName;
        }
      }
      if(column.property == "reportStatusLable"){
        return this.formatReportStatusLable(cellValue)
      }

      return cellValue || "--";
    },
    clickPrice(item) {
      this.nowPriceId = item.id;
      switch (item.id) {
        case 1:
          this.filterInfo.maxEvaluatePrice = "";
          this.filterInfo.minEvaluatePrice = "";
          break;
        case 2:
          this.filterInfo.maxEvaluatePrice = 50000;
          this.filterInfo.minEvaluatePrice = 0;
          break;
        case 3:
          this.filterInfo.maxEvaluatePrice = 100000;
          this.filterInfo.minEvaluatePrice = 50000;
          break;
        case 4:
          this.filterInfo.maxEvaluatePrice = 200000;
          this.filterInfo.minEvaluatePrice = 100000;
          break;
        case 5:
          this.filterInfo.maxEvaluatePrice = 300000;
          this.filterInfo.minEvaluatePrice = 200000;
          break;
        case 6:
          this.filterInfo.maxEvaluatePrice = 400000;
          this.filterInfo.minEvaluatePrice = 300000;
          break;
        case 7:
          this.filterInfo.maxEvaluatePrice = "";
          this.filterInfo.minEvaluatePrice = 400000;
          break;
        default:
          break;
      }
    },
    getCreaters() {
      var that = this;
      this.$axios.post(this.pathItem.findCarOperator, {}).then((res) => {
        if (res.code == 0) {
          this.operatorList = res.result.systemUserInfoDealersList;
        }
      });
    },
    choseAssessor(val) {
      if (val) {
        var choseItem = this.roleTypes.filter((item) => {
          return item.id == val;
        });
        this.filterAssessorName = choseItem[0].userName;
      } else {
        this.filterAssessorName = "";
      }
    },
    choseOperator(val) {
      if (val) {
        var choseItem = this.operatorList.filter((item) => {
          return item.id == val;
        });
        this.filterInfo.createdName = choseItem[0].userName;
      } else {
        this.filterInfo.createdName = "";
      }
    },
    // 清空 重置
    resetFilter() {
      this.filterInfo = {
        carprice: 1,
        maxEvaluatePrice: "",
        minEvaluatePrice: "",
        brandNameList: [],
        seriesNameList: [],
        modelNameList: [],
        vin: "",
        complicated: "",
        orgName: "",
        assessor: "",
        bookName: "",
        bookPhone: "",
        createdName: "",
        maxCreatedAt: "",
        minCreatedAt: "",
        statusList: [1, 2, 3, 4],
      };
      this.assessStatusCheck = [];
      this.currentPage = 1;
      this.nowPriceId = 1;
      this.filterAssessor = "";
      this.filterAssessorName = "";
      this.filterBrandId = "";

      this.filterSeriesId = "";
      this.filterModelId = "";
      this.filterTime = "";
      this.filterCreat = "";
      this.filterCreatName = "";
    },
    // 查看详情
    gotoDetail(index, row) {
      this.$router.push({
        path: "/carAssessDetail",
        query: { from: "assess", id: row.id },
      });
    },
    // 编辑评估列表
    editAssess(index, row) {
      this.$router.push({
        path: "/carAssessOperation",
        query: { params: row.id },
      });
    },
    // 建卡
    closeBuild() {
      this.dialogVisible = false;
    },
    successBuild(buildResult) {

      if (buildResult.type == 2) {
        this.filterInfo.bookPhone = buildResult.phone;
        this.currentPage = 1;
        this.dialogVisible = false;
      } else {
        this.dialogVisible = false;
      }
      this.findCarList();
    },
    // 入库
    putStorage(index, row) {
      this.dialogStorageInfo = JSON.parse(JSON.stringify(row));
      this.dialogStorage = true;
    },
    closePutInStorage() {
      this.dialogStorage = false;
    },
    successPutIn() {
      this.dialogStorageInfo = {};
      this.dialogStorage = false;
      this.findCarList();
    },

    // 查看检测报告
    readReport(index, row) {
      this.$router.push({
        path: "/carExamineReport",
        query: {
          carId: row.id,
          reportType: row.reportStatusLable,
        },
      });
    },
    // 对话框确认操作   type：0仅保存  1保存并评估=
    showMessageBox(type, message) {
      this.$message({
        type: type,
        message: message,
        offset: 400,
        duration: 1000,
      });
    },

    brandFilterChangeVal(selectName) {
      this.filterInfo.brandNameList = selectName.carBrandName
        ? selectName.carBrandName.split(",")
        : [];
      this.filterBrandId = selectName.carBrandId
        ? String(selectName.carBrandId).split(",")
        : [];
    },

    seriseFilterChangeVal(selectName) {
      this.filterInfo.seriesNameList = selectName.carSeriesName
        ? selectName.carSeriesName.split(",")
        : [];
      this.filterSeriesId = selectName.carSeriesId
        ? String(selectName.carSeriesId).split(",")
        : [];
    },

    modelFilterChangeVal(selectName) {
       this.filterInfo.modelNameList = selectName.carModelName
        ? selectName.carModelName.split(",")
        : [];
      this.filterModelId = selectName.carModelId
        ? String(selectName.carModelId).split(",")
        : [];
    },
    findAppraiserList() {
      var params = {
        roleTypes: 2,
      };
      this.$axios.post(this.pathItem.findAppraiserList, params).then((res) => {
        if (res.code == 0) {
          this.roleTypes = res.result.systemUserInfoDealersList;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.carsAssessList {
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