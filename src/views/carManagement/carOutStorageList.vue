<template>
  <div class="carsInventoryList">
    <!-- 信息筛选 -->
    <el-header class="header">
      <span>信息筛选</span>
      <div style="float: right">
        <el-button type="primary" @click="selectFilter" icon="el-icon-search"
          >查询</el-button
        >
        <el-button
          type="primary"
          plain
          @click="resetFilter"
          icon="el-icon-delete"
          >清空</el-button
        >
      </div>
    </el-header>
    <!-- 筛选内容 -->
    <el-main style="padding-bottom: 15px">
      <el-row class="main-content">
        <el-row>
          <el-col class="el-col-test" :span="2">车辆品牌</el-col>
          <el-col :span="8">
            <carBrandSerise
              @seriseChangeVal="seriseFilterChangeVal"
              @brandChangeVal="brandFilterChangeVal"
              @modelChangeVal="modelFilterChangeVal"
              :oldBrandId="filterBrandId"
              :oldSeriseId="filterSeriesId"
              :oldModelId="filterModelId"
              :hasBrandMult="true"
              :hasSeriesMult="true"
              :hasModelMult="true"
              :hasModel="true"
            ></carBrandSerise>
          </el-col>
        </el-row>
        <el-row style="margin: 5px auto">
          <el-col class="el-col-test" :span="2">成交价格</el-col>
          <el-col :span="22">
            <label
              class="price-style"
              v-for="price in carprices"
              :key="price.id"
              :class="nowPriceId == price.id ? 'price-active' : ''"
              @click="clickPrice(price)"
              >{{ price.label }}</label
            >
            <el-input
              v-model="filterMinTransactionPrice"
              size="mini"
              style="width: 50px"
            ></el-input
            >万 -
            <el-input
              v-model="filterMaxTransactionPrice"
              size="mini"
              style="width: 50px"
            ></el-input
            >万
          </el-col>
        </el-row>
        <el-row style="margin: 5px auto">
          <el-col class="el-col-test" :span="2">车辆年份</el-col>
          <el-col :span="22">
            <label
              class="price-style"
              v-for="price in carUsedYears"
              :key="price.id"
              :class="nowYearId == price.id ? 'price-active' : ''"
              @click="clickYear(price)"
              >{{ price.label }}</label
            >
          </el-col>
        </el-row>
        <el-row style="margin: 5px auto">
          <el-col class="el-col-test" :span="2">车辆信息</el-col>
          <el-col :span="5">
            <el-input
              v-model="filterInfo.complicated"
              placeholder="请输入编号/VIN码/车牌号等"
              maxlength="50"
              size="mini"
            ></el-input>
          </el-col>
          <el-col class="el-col-test" :span="2">客户信息</el-col>
          <el-col :span="5">
            <el-input
              v-model="filterInfo.clientInfo"
              maxlength="50"
              size="mini"
            ></el-input>
          </el-col>
          <el-col class="el-col-test" :span="2">经销商</el-col>
          <el-col :span="5">
            <el-select v-model="filterOrgNameId" @change="choseOrg" size="mini">
              <el-option
                :label="orgItem.organizationName"
                :value="orgItem.id"
                v-for="orgItem in orgList"
                :key="orgItem.id"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin: 5px auto">
          <el-col class="el-col-test" :span="2">销售顾问</el-col>
          <el-col :span="5">
            <el-input
              v-model="filterInfo.salesConsultantName"
              maxlength="50"
              size="mini"
            ></el-input>
          </el-col>
          <el-col class="el-col-test" :span="2">入库时间</el-col>
          <el-col :span="5">
            <el-date-picker
              v-model="filterInTimeArr"
              type="daterange"
              :default-time="['00:00:00', '23:59:59']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
          <el-col class="el-col-test" :span="2">出库时间</el-col>
          <el-col :span="5">
            <el-date-picker
              v-model="filterOutTimeArr"
              type="daterange"
              :default-time="['00:00:00', '23:59:59']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
        </el-row>
        <el-row style="margin: 5px auto">
          <el-col class="el-col-test" :span="2">车辆状态</el-col>
          <el-col :span="5">
            <el-select multiple v-model="filterInfo.carStatusList" size="mini">
              <el-option
                :label="carStatusItem.name"
                :key="carStatusItem.id"
                :value="carStatusItem.id"
                v-for="carStatusItem in carStatus"
              ></el-option>
            </el-select>
          </el-col>
          <el-col class="el-col-test" :span="2">订单状态</el-col>
          <el-col :span="5">
            <el-select
              multiple
              v-model="filterInfo.orderStatusList"
              size="mini"
            >
              <el-option
                :label="orderStatusItem.name"
                :key="orderStatusItem.id"
                :value="orderStatusItem.id"
                v-for="orderStatusItem in orderStatus"
              ></el-option>
            </el-select>
          </el-col>
          <el-col class="el-col-test" :span="2">销售天数</el-col>
          <el-col :span="5">
            <el-input
              v-model="filterInfo.minDay"
              size="mini"
              style="width: 45%"
            ></el-input
            >-
            <el-input
              v-model="filterInfo.maxDay"
              size="mini"
              style="width: 45%"
            ></el-input>
          </el-col>
        </el-row>
      </el-row>
      <!-- 库存车辆列表 -->
      <el-header class="header">
        <span>出库车辆列表</span>
      </el-header>
      <el-row class="main-content">
        <el-table :data="tableData" border v-loading="loading">
          <template v-for="(item, index) in tableHead">
            <el-table-column
              :formatter="formatData"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              show-overflow-tooltip
              :fixed="item.fixed"
              align="center"
            ></el-table-column>
          </template>
          <el-table-column
            label="操作"
            width="220"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                v-if="buttonLimits.includes(134)"
                size="mini"
                type="primary"
                plain
                icon="el-icon-document"
                style="margin-top: 5px"
                @click="gotoDetail(scope.$index, scope.row)"
                >详情</el-button
              >
              <el-button
                size="mini"
                type="primary"
                v-if="buttonLimits.includes(115) && scope.row.carStatus == 5 && scope.row.orderStatus == 2"
                icon="el-icon-edit"
                style="margin-top: 5px"
                @click="carTransfer(scope.$index, scope.row)"
                >车辆过户</el-button
              >
              <el-button
                size="mini"
                type="primary"
                v-if="
                  buttonLimits.includes(145) &&
                  scope.row.carStatus == 6 &&
                  scope.row.certifiedStatus == 8
                "
                icon="el-icon-sell"
                style="margin-top: 5px"
                @click="certificationReport(scope.$index, scope.row)"
                >认证汇报</el-button
              >
              <!-- <el-button
                size="mini"
                type="danger"
                v-if="
                  buttonLimits.includes(145) &&
                  scope.row.carStatus == 6 &&
                  scope.row.certifiedStatus == 9
                "
                icon="el-icon-sell"
                style="margin-top: 5px"
                @click="cancleCer(scope.$index, scope.row)"
                >汇报撤回
              </el-button>
              <el-button
                size="mini"
                type="primary"
                v-if="
                  buttonLimits.includes(145) &&
                  scope.row.carStatus == 6 &&
                  scope.row.certifiedStatus == 11
                "
                icon="el-icon-sell"
                style="margin-top: 5px"
                @click="certificationReport(scope.$index, scope.row)"
                >重新汇报</el-button -->
              <!-- > -->
            </template>
          </el-table-column>
        </el-table>
        <div class="page-box" v-if="!loading">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalElements"
          ></el-pagination>
        </div>
      </el-row>
    </el-main>
    <!-- 弹框 -->
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
 ** @function selectFilter() 筛选
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
export default {
  components: {
    carBrandSerise,
  },
  data() {
    return {
      buttonLimits: [], //按钮权限
      nowPriceId: 1,
      nowYearId: 1,
      filterInfo: {
        clientInfo: "",
        salesConsultantName: "",
        minTransactionPrice: "",
        maxTransactionPrice: "",
        minDay: "",
        maxDay: "",
        minTime: "",
        maxTime: "",
        complicated: "",
        minYear: "",
        maxYear: "",
        brandNameList: [],
        seriesNameList: [],
        modelNameList: [],
        orderStatusList: [],
        carStatusList: [],
        maxComeTime: "",
        minComeTime: "",
        orgName: "",
      },
      filterBrandId: "",
      filterSeriesId: "",
      filterModelId: "",
      filterMaxTransactionPrice: "",
      filterMinTransactionPrice: "",
      filterInTimeArr: [],
      filterOutTimeArr: [],
      fliterOrgName: "",
      filterOrgNameId: "",
      orgList: [],
      carprices: [
        { id: 1, label: "全部" },
        { id: 2, label: "5万以下" },
        { id: 3, label: "5-10万" },
        { id: 4, label: "10-20万" },
        { id: 5, label: "20-30万" },
        { id: 6, label: "30-40万" },
        { id: 7, label: "40万以上" },
      ],
      carUsedYears: [
        { id: 1, label: "全部" },
        { id: 2, label: "1年以内" },
        { id: 3, label: "1-3年" },
        { id: 4, label: "3-5年" },
        { id: 5, label: "5-8年" },
        { id: 6, label: "8年以上" },
      ],
      orderStatus: [
        { id: 2, name: "已成交" },
        { id: 4, name: "已退车" },
      ],
      carStatus: [
        { id: 5, name: "已出库" },
        { id: 6, name: "已过户" },
      ],
      pageSize: 10,
      currentPage: 1, //当前页数
      totalPage: 1,
      totalElements: 0,
      tableData: [],
      loading: false, //加载数据
      tableHead: [
        {
          prop: "carNumber",
          label: "车辆编号",
          width: 140,
          fixed: true,
        },
        {
          prop: "brandType",
          label: "品牌车型",
          width: 140,
          fixed: true,
        },
        {
          prop: "vin",
          label: "VIN码",
          fixed: true,
        },
        {
          prop: "inTime",
          label: "入库时间",
          width: 140,
        },
        {
          prop: "buyPrice",
          label: "收购价格",
          width: 140,
        },
        {
          prop: "orgName",
          label: "经销商",
          width: 140,
        },
        {
          prop: "customerName",
          label: "客户姓名",
          width: 140,
        },
        {
          prop: "customerPhone",
          label: "客户电话",
          width: 140,
        },
        {
          prop: "comeTime",
          label: "出库时间",
          width: 140,
        },
        {
          prop: "carUltimatelyPrice",
          label: "成交价格",
          width: 140,
        },
        {
          prop: "salesConsultantName",
          label: "销售顾问",
          width: 140,
        },
        {
          prop: "carStatus",
          label: "车辆状态",
          width: 140,
        },
        {
          prop: "certifiedStatus",
          label: "认证状态",
          width: 140,
        },
        {
          prop: "orderStatus",
          label: "订单状态",
          width: 140,
        },
      ],
    };
  },
  computed: {
    //获取vuex存储的已预览标签页
  },
  watch: {
    filterMaxTransactionPrice(newVal, oldVal) {
      this.filterInfo.maxTransactionPrice = newVal * 10000;
    },
    filterMinTransactionPrice(newVal, oldVal) {
      this.filterInfo.minTransactionPrice = newVal * 10000;
    },
  },
  mounted() {
    this.buttonLimits = this.$route.meta.button;
    this.findCarList();
    this.getOrgList();
  },
  methods: {
    findCarList() {
      var params = {};
      if (
        this.filterInfo.maxTransactionPrice &&
        this.filterInfo.minTransactionPrice
      ) {
        if (
          this.filterInfo.maxTransactionPrice <
          this.filterInfo.minTransactionPrice
        ) {
          this.showMessageBox("error", "最大价格需大于最小价格");
          return;
        }
      }

      if (this.filterInTimeArr) {
        this.filterInfo.maxTime = this.filterInTimeArr[1];
        this.filterInfo.minTime = this.filterInTimeArr[0];
      } else {
        this.filterInfo.maxTime = "";
        this.filterInfo.minTime = "";
      }

      if (this.filterOutTimeArr) {
        this.filterInfo.maxComeTime = this.filterOutTimeArr[1];
        this.filterInfo.minComeTime = this.filterOutTimeArr[0];
      } else {
        this.filterInfo.maxComeTime = "";
        this.filterInfo.minComeTime = "";
      }

      for (var key in this.filterInfo) {
        if (this.filterInfo[key]) {
          params[key] = this.filterInfo[key];
        }
      }
      params.pageSize = this.pageSize;
      params.pageNo = this.currentPage;
      params.sortFlag = 2;
      if (params.carStatusList.length <= 0) {
        params.carStatusList = [5, 6];
      }
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
    //格式化数据
    formatData(val, column, cellValue) {
      if (column.property == "carStatus") {
        return this.formatCarState(cellValue);
      }
      if (column.property == "orderStatus") {
        return this.formatOrderStatus(cellValue);
      }

      if (column.property == "certifiedStatus") {
        return this.formatCertifiedStatus(cellValue);
      }
      if (column.property == "brandType") {
        if (val.brandName) {
          return val.brandName + val.seriesName + val.modelName;
        }
      }
      return cellValue || "--";
    },
    // 通过信息筛选获取数据
    selectFilter() {
      this.currentPage = 1;
      this.findCarList();
    },
    // 格式化车状态
    formatCarState(carStatus) {
      switch (carStatus) {
        case 1:
          return "未入库";
          break;
        case 2:
          return "在库";
          break;
        case 3:
          return "在售";
          break;
        case 4:
          return "已预订";
          break;
        case 5:
          return "已出库";
          break;
        case 6:
          return "已过户";
          break;
        default:
          return "--";
          break;
      }
    },
    formatCertifiedStatus(cerStatus) {
      switch (cerStatus) {
        case 1:
          return "录入中";
          break;
        case 2:
          return "待初审";
          break;
        case 3:
          return "待复审";
          break;
        case 4:
          return "申请驳回";
          break;
        case 5:
          return "已撤销";
          break;
        case 6:
          return "认证失效";
          break;
        case 7:
          return "取消认证";
          break;
        case 8:
          return "已认证";
          break;
        case 9:
          return "汇报待审核";
          break;
        case 10:
          return "汇报通过";
          break;
        case 11:
          return "汇报驳回";
          break;
        default:
          return "--";
          break;
      }
    },
    formatOrderStatus(item) {
      switch (item) {
        case 1:
          return "已预订";
          break;
        case 2:
          return "已成交";
          break;
        case 3:
          return "已取消";
          break;
        case 4:
          return "已退车";
          break;

        default:
          return "--";
          break;
      }
    },
    // 清空 重置
    resetFilter() {
      this.filterInfo = {
        clientInfo: "",
        salesConsultantName: "",
        minTransactionPrice: "",
        maxTransactionPrice: "",
        minDay: "",
        maxDay: "",
        minTime: "",
        maxTime: "",
        complicated: "",
        minYear: "",
        maxYear: "",
        brandNameList: [],
        seriesNameList: [],
        modelNameList: [],
        orderStatusList: [],
        carStatusList: [],
        maxComeTime: "",
        minComeTime: "",
      };
      this.filterBrandId = 0;
      this.filterSeriesId = 0;
      this.filterModelId = 0;
      this.filterMaxTransactionPrice = "";
      this.filterMinTransactionPrice = "";
      this.filterInTimeArr = [];
      this.filterOutTimeArr = [];
      this.currentPage = 1;
    },
    showMessageBox(type, message) {
      this.$message({
        type: type,
        message: message,
        offset: 400,
        duration: 1000,
      });
    },
    getOrgList() {
      this.$axios
        .post(this.pathItem.getOrgNameList, {})
        .then((res) => {
          if (res.code == 0) {
            this.orgList = res.result.systemOrganizationDealersList;
          }
        })
        .catch((res) => {});
    },
    choseOrg(val) {
      if (val) {
        var choseItem = this.orgList.filter((item) => {
          return item.id == val;
        });
        this.fliterOrgName = choseItem[0].organizationName;
      } else {
        this.fliterOrgName = "";
      }
    },
    // 查看详情
    gotoDetail(index, row) {
      this.$router.push({
        path: "/carAssessDetail",
        query: { from: "outStorage", id: row.id },
      });
    },
    carTransfer(index, row) {
      this.$router.push({
        path: "/sellTransferEdit",
        query: {
          id: row.id,
        },
      });
    },
    //认证汇报
    certificationReport(index, row) {
      this.$router.push({
        path: "/certificationReport",
        query: {
          vin: row.vin,
          id: row.cid,
          carId:row.id,
        },
      });
    },
    // 汇报撤销
    cancleCer(index, row) {
      var params = {
        id: row.id,
        cid: row.cid,
        vin: row.vin,
        certifiedStatus: 5,
      };
      this.$confirm("是否要撤回该车的汇报", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .post(this.pathItem.certiSaveAndEdit, params)
            .then((res) => {
              let r = res;
              this.$message({
                type: "success",
                message: "取消成功!",
              });
            })
            .catch((res) => {
              this.loading = false;
              this.$alert(res.message, "提示", {
                confirmButtonText: "确定",
                type: "error",
              });
            });
        })
        .catch(() => {
         
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
    clickPrice(item) {
      this.nowPriceId = item.id;
      switch (item.id) {
        case 1:
          this.filterInfo.maxTransactionPrice = "";
          this.filterInfo.minTransactionPrice = "";
          break;
        case 2:
          this.filterInfo.maxTransactionPrice = 50000;
          this.filterInfo.minTransactionPrice = 0;
          break;
        case 3:
          this.filterInfo.maxTransactionPrice = 100000;
          this.filterInfo.minTransactionPrice = 50000;
          break;
        case 4:
          this.filterInfo.maxTransactionPrice = 200000;
          this.filterInfo.minTransactionPrice = 100000;
          break;
        case 5:
          this.filterInfo.maxTransactionPrice = 300000;
          this.filterInfo.minTransactionPrice = 200000;
          break;
        case 6:
          this.filterInfo.maxTransactionPrice = 400000;
          this.filterInfo.minTransactionPrice = 300000;
          break;
        case 7:
          this.filterInfo.maxTransactionPrice = "";
          this.filterInfo.minTransactionPrice = 400000;
          break;
        default:
          break;
      }
    },
    clickYear(item) {
      this.nowYearId = item.id;
      switch (item.id) {
        case 1:
          this.filterInfo.maxYear = "";
          this.filterInfo.minYear = "";
          break;
        case 2:
          this.filterInfo.maxYear = 1;
          this.filterInfo.minYear = "";
          break;
        case 3:
          this.filterInfo.maxYear = 3;
          this.filterInfo.minYear = 1;
          break;
        case 4:
          this.filterInfo.maxYear = 5;
          this.filterInfo.minYear = 3;
          break;
        case 5:
          this.filterInfo.maxYear = 8;
          this.filterInfo.minYear = 5;
          break;
        case 6:
          this.filterInfo.maxYear = "";
          this.filterInfo.minYear = 8;
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.carsInventoryList {
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
  .dialog-footer {
    float: left;

    line-height: 42px;
    padding-right: 20px;
    span {
      color: red;
      margin-right: 40px;
    }
  }
  .image-item {
    border: 6px solid #ebeef5;
    padding: 3px;
    width: 80%;
    max-height: 150px;
  }
}
</style>
<style lang="scss">
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
</style>