<template>
  <div class="carsInventoryList">
    <!-- 信息筛选 -->
    <el-header class="header">
      <span>信息筛选</span>
      <div style="float:right;">
        <el-button type="primary" @click="selectFilter" icon="el-icon-search">查询</el-button>
        <el-button type="primary" plain @click="resetFilter" icon="el-icon-delete">清空</el-button>
      </div>
    </el-header>
    <!-- 筛选内容 -->
    <el-main style="padding-bottom: 15px;">
      <el-row class="main-content">
        <el-row>
          <el-col class="el-col-test" :span="3">车辆品牌</el-col>
          <el-col :span="8">
            <carBrandSerise @seriseChangeVal="seriseFilterChangeVal" @brandChangeVal="brandFilterChangeVal" @modelChangeVal="modelFilterChangeVal" :oldBrandId="filterBrandId" :oldSeriseId="filterSeriesId"
              :oldModelId="filterModelId" :hasModel="true" :hasBrandMult="true" :hasSeriesMult="true" :hasModelMult="true"></carBrandSerise>
          </el-col>
        </el-row>
        <el-row style="margin:5px auto;">
          <el-col class="el-col-test" :span="3">采购价格</el-col>
          <el-col :span="21">
            <label class="price-style" v-for="price in carprices" :key="price.id" :class="purchaseId==price.id?'price-active':''" @click="clickPurchasePrice(price)">{{price.label}}</label>
            <el-input v-model="filterMinPurchasePrice" size="mini" style="width:50px;"></el-input>万 -
            <el-input v-model="filterMaxPurchasePrice" size="mini" style="width:50px;"></el-input>万
          </el-col>
        </el-row>
        <el-row style="margin:5px auto;">
          <el-col class="el-col-test" :span="3">挂牌价/销售底价</el-col>
          <el-col :span="21">
            <label class="price-style" v-for="price in carprices" :key="price.id" :class="sales==price.id?'price-active':''" @click="clickSalesPrice(price)">{{price.label}}</label>
            <el-input v-model="filterMinStickerPrice" size="mini" style="width:50px;"></el-input>万 -
            <el-input v-model="filterMaxStickerPrice" size="mini" style="width:50px;"></el-input>万
          </el-col>
        </el-row>
        <el-row style="margin:5px auto;">
          <el-col class="el-col-test" :span="3">成交价格</el-col>
          <el-col :span="21">
            <label class="price-style" v-for="price in carprices" :key="price.id" :class="transactionPriceId==price.id?'price-active':''" @click="clickTransactionPrice(price)">{{price.label}}</label>
            <el-input v-model="filterMinTransactionPrice" size="mini" style="width:50px;"></el-input>万 -
            <el-input v-model="filterMaxTransactionPrice" size="mini" style="width:50px;"></el-input>万
          </el-col>
        </el-row>
        <el-row style="margin:5px auto;">
          <el-col class="el-col-test" :span="3">车辆年份</el-col>
          <el-col :span="21">
            <label class="price-style" v-for="price in carUsedYears" :key="price.id" :class="yearId==price.id?'price-active':''" @click="clickYear(price)">{{price.label}}</label>
          </el-col>
        </el-row>
        <el-row style="margin:5px auto;">
          <el-col class="el-col-test" :span="3">车辆信息</el-col>
          <el-col :span="5">
            <el-input v-model="filterInfo.complicated" placeholder="请输入编号/VIN码/车牌号等" maxlength="50" size="mini"></el-input>
          </el-col>
          <el-col class="el-col-test" :span="2">车主信息</el-col>
          <el-col :span="5">
            <el-input v-model="filterInfo.carOwnerInfo" maxlength="50" size="mini" placeholder="请输入原车主姓名/电话"></el-input>
          </el-col>
          <el-col class="el-col-test" :span="2">经销商</el-col>
          <el-col :span="5">
            <el-select v-model="filterOrgNameId" size="mini" @change="choseOrg">
              <el-option :label="orgItem.organizationName" :value="orgItem.id" v-for="orgItem in orgList" :key="orgItem.id"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin:5px auto;">
          <el-col class="el-col-test" :span="3">车辆状态</el-col>
          <el-col :span="5">
            <el-select v-model="filterInfo.carStatusList" multiple size="mini">
              <el-option v-for="item in carStatus" :key="item.id" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col class="el-col-test" :span="2">入库时间</el-col>
          <el-col :span="5">
            <el-date-picker v-model="inTime" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" size="mini"
              style="width:100%;"></el-date-picker>
          </el-col>
          <el-col class="el-col-test" :span="2">在库天数</el-col>
          <el-col :span="5">
            <el-input v-model="filterInfo.minDay" size="mini" style="width:45%;"></el-input>-
            <el-input v-model="filterInfo.maxDay" size="mini" style="width:45%;"></el-input>
          </el-col>
        </el-row>
        <el-row style="margin:5px auto;">
          <el-col class="el-col-test" :span="3">发售方式</el-col>
          <el-col :span="5">
            <el-select v-model="filterInfo.saleTypeList" multiple size="mini">
              <el-option :label="saleTypeItem.name" :value="saleTypeItem.id" v-for="saleTypeItem in saleType" :key="saleTypeItem.id"></el-option>
            </el-select>
          </el-col>
          <el-col class="el-col-test" :span="2">销售平台</el-col>
          <el-col :span="5">
            <el-select v-model="filterInfo.saleChannelList" multiple size="mini">
              <el-option :label="salePlantItem.name" :value="salePlantItem.id" v-for="salePlantItem in salePlant" :key="salePlantItem.id"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin:5px auto;">
          <el-col class="el-col-test" :span="3">整备状态</el-col>
          <el-col :span="5">
            <el-select v-model="filterInfo.workStatusList" multiple size="mini">
              <el-option v-for="item in hostlingStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col class="el-col-test" :span="2">认证状态</el-col>
          <el-col :span="5">
            <el-select v-model="filterInfo.certifiedStatusList" multiple size="mini">
              <el-option v-for="item in certifiStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-row>
      <!-- 车辆列表 -->
      <el-header class="header">
        <span>车辆列表</span>
        <div class="createCard" style="float:right;">
          <el-button v-if="buttonLimits.includes(155)" type="primary" @click="dialogVisible = true" icon="el-icon-plus">车辆建卡</el-button>
        </div>
      </el-header>
      <el-row class="main-content">
        <el-table :data="tableData" border v-loading="loading">
          <template v-for="(item,index) in tableHead">
            <el-table-column :formatter="formatData" :key="index" :prop="item.prop" :label="item.label" :width="item.width" show-overflow-tooltip align="center" :fixed="item.fixed"></el-table-column>
          </template>
          <el-table-column label="操作" width="220" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="buttonLimits.includes(139)" size="mini" type="primary" plain icon="el-icon-document" style="margin-top:5px;" @click="gotoDetail(scope.$index, scope.row)">详情</el-button>
              <el-button v-if="buttonLimits.includes(140)&&scope.row.reportStatus != 4  && scope.row.carStatus == 1" size="mini" type="danger" plain icon="el-icon-edit" style="margin-top:5px;"
                @click="editAssess(scope.$index, scope.row)">编辑
              </el-button>
              <el-button v-if="buttonLimits.includes(153)&&scope.row.carStatus == 1" size="mini" type="danger" icon="el-icon-delete" style="margin-top:5px;" @click="deleteAssess(scope.$index, scope.row)">删除</el-button>
              <el-button size="mini" type="success" plain icon="el-icon-sell" style="margin-top:5px;" v-if="buttonLimits.includes(141)&&scope.row.reportStatus== 3 && scope.row.carStatus == 1"
                @click="putStorage(scope.$index, scope.row)">入库
              </el-button>
              <el-button v-if="buttonLimits.includes(142)&&(scope.row.reportStatusLable==1 || scope.row.reportStatusLable==2)  && scope.row.carStatus == 1" size="mini" type="warning" plain icon="el-icon-reading"
                style="margin-top:5px;" @click="readReport(scope.$index, scope.row)">查看检测报告</el-button>
              <el-button size="mini" type="success" plain icon="el-icon-sell" style="margin-top:5px;" v-if="buttonLimits.includes(146)&&scope.row.carStatus == 2" @click="showSellPriceDialog(scope.$index, scope.row)">
                销售定价</el-button>
              <el-button size="mini" type="success" plain icon="el-icon-sell" style="margin-top:5px;" v-if="buttonLimits.includes(147)&&scope.row.carStatus == 2" @click="upShelf(scope.$index, scope.row)">上架</el-button>
              <el-button size="mini" type="success" plain icon="el-icon-sell" style="margin-top:5px;" v-if="buttonLimits.includes(148)&&scope.row.carStatus == 3" @click="downShelf(scope.$index, scope.row)">下架</el-button>
              <el-button size="mini" type="success" plain icon="el-icon-sell" style="margin-top:5px;" v-if="buttonLimits.includes(149)&&scope.row.carStatus == 2 && (!scope.row.workStatus || scope.row.workStatus == 7 || scope.row.workStatus == 8)" @click="applyHostling(scope.$index, scope.row)">发起整备
              </el-button>
              <el-button size="mini" type="success" plain icon="el-icon-sell" style="margin-top:5px;" v-if="buttonLimits.includes(150)&&scope.row.carStatus == 2 && scope.row.workStatus == 7 && !scope.row.certifiedStatus && certiAuth == 1"
                @click="applyAuthentication(scope.$index, scope.row)">申请认证</el-button>
              <el-button size="mini" type="success" plain icon="el-icon-sell" style="margin-top:5px;" v-if="buttonLimits.includes(151)&&scope.row.carStatus == 3" @click="reserveCarButton(scope.$index, scope.row)">车辆预定
              </el-button>
              <el-button size="mini" type="success" plain icon="el-icon-sell" style="margin-top:5px;" v-if="buttonLimits.includes(152)&&scope.row.carStatus == 2" @click="openSaleImg(scope.$index, scope.row)">上传销售照片
              </el-button>
              <el-button size="mini" type="primary" v-if="buttonLimits.includes(143)&&scope.row.carStatus == 5&& scope.row.orderStatus == 2" icon="el-icon-edit" style="margin-top:5px;" @click="carTransfer(scope.$index, scope.row)">车辆过户</el-button>
              <el-button size="mini" type="primary" v-if="buttonLimits.includes(144)&&scope.row.carStatus == 6 && scope.row.certifiedStatus == 8" icon="el-icon-sell" style="margin-top:5px;"
                @click="certificationReport(scope.$index, scope.row)">认证汇报
              </el-button>
              <!-- <el-button size="mini" type="danger" v-if="buttonLimits.includes(154)&&scope.row.carStatus == 6 && scope.row.certifiedStatus == 9" icon="el-icon-sell" style="margin-top:5px;"
                @click="cancleCer(scope.$index, scope.row)">汇报撤回
              </el-button>
              <el-button size="mini" type="primary" v-if="buttonLimits.includes(144)&&scope.row.carStatus == 6 && scope.row.certifiedStatus == 11" icon="el-icon-sell" style="margin-top:5px;"
                @click="certificationReport(scope.$index, scope.row)">
                重新汇报</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="page-box">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="totalElements"></el-pagination>
        </div>
      </el-row>
    </el-main>
    <!-- 建卡 -->
    <buildCard v-if="dialogVisible" @closeBuildCard="closeBuild" @successBuild="successBuild"></buildCard>
    <!-- 入库弹框 -->
    <putInStorage v-if="dialogStorage" @successPutIn="successPutIn" @closePutIn="closePutInStorage" :putInStorageInfo="dialogStorageInfo"></putInStorage>
    <!-- 发起整备 -->

    <initiateHostling v-if="dialogHostling" :initiateHostInfo="dialogHostlingData" @closeInitiate="closeHostlingDialog" @successHostling="successHostling"></initiateHostling>
    <!-- 销售定价 -->
    <!-- dialogSellPrice -->
    <salesPrice v-if="dialogSellPrice" :salesPriceInfo="dialogSellPriceInfo" @closeSalesPrice="closeSalesPrice"></salesPrice>
    <!-- 上传销售照片 -->

    <uploadSalesPic v-if="dialogUploadPhoto" :carId="dialogImgCarId" @closeImgDialog="coloseImgDialog" @successUpload="successUpload"></uploadSalesPic>
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
import carBrandSerise from "../../components/certification/selectCarBrand"; //选择车型车系
import initiateHostling from "../../components/carManagement/initiateHostling"; //发起整备
import salesPrice from "../../components/carManagement/salesPrice"; //销售定价
import uploadSalesPic from "../../components/carManagement/uploadSalesPic"; //上传销售图片
import putInStorage from "../../components/carManagement/putInStorage"; //入库
import buildCard from "../../components/carManagement/buildCard"; //建卡
export default {
  components: {
    carBrandSerise,
    initiateHostling,
    salesPrice,
    uploadSalesPic,
    buildCard,
    putInStorage,
  },
  data() {
    return {
      buttonLimits: [], //按钮权限
      filterInfo: {
        brandNameList: [],
        seriesNameList: [],
        modelNameList: [],
        maxPurchasePrice: "",
        minPurchasePrice: "",

        maxStickerPrice: "",
        minStickerPrice: "",
        minTransactionPrice: "",
        maxTransactionPrice: "",
        maxYear: "",
        minYear: "",
        complicated: "",

        carOwnerInfo: "",
        orgName: "",
        carStatusList: [],
        maxDay: "",
        minDay: "",
        saleTypeList: [],
        saleChannelList: [],
        workStatusList: [],
        certifiedStatusList: [],
      },
      filterBrandId: "",
      filterSeriesId: "",
      filterModelId: "",
      filterMinPurchasePrice: "",
      filterMaxPurchasePrice: "",
      filterMinStickerPrice: "",
      filterMaxStickerPrice: "",
      filterMinTransactionPrice: "",
      filterMaxTransactionPrice: "",
      transactionPriceId: 1,
      purchaseId: 1,
      sales: 1,
      yearId: 1,
      inTime: [],
      fliterOrgName: "",
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
      carUsedYears: [
        {
          id: 1,
          label: "全部",
        },
        {
          id: 2,
          label: "1年以内",
        },
        {
          id: 3,
          label: "1-3年",
        },
        {
          id: 4,
          label: "3-5年",
        },
        {
          id: 5,
          label: "5-8年",
        },
        {
          id: 6,
          label: "8年以上",
        },
      ],

      // 整备状态
      hostlingStatus: [
        {
          value: 0,
          label: "未整备",
        },
        {
          value: 1,
          label: "待提交",
        },
        {
          value: 2,
          label: "待审核",
        },
        {
          value: 3,
          label: "审核驳回",
        },
        {
          value: 4,
          label: "整备中",
        },
        {
          value: 5,
          label: "待验收",
        },
        {
          value: 6,
          label: "验收通过",
        },
        {
          value: 7,
          label: "验收完成",
        },
        {
          value: 8,
          label: "已作废",
        },
      ],
      // 认证状态筛选条件
      certifiStatus: [
        {
          value: 1,
          label: "录入中",
        },
        {
          value: 2,
          label: "待初审",
        },
        {
          value: 3,
          label: "待复审",
        },
        {
          value: 4,
          label: "申请驳回",
        },
        {
          value: 5,
          label: "已撤销",
        },
        {
          value: 6,
          label: "认证失效",
        },
        {
          value: 7,
          label: "取消认证",
        },
        {
          value: 8,
          label: "已认证",
        },
        {
          value: 9,
          label: "汇报待审核",
        },
        {
          value: 10,
          label: "汇报通过",
        },
        {
          value: 11,
          label: "汇报驳回",
        },
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
          fixed:true
        },
        {
          prop: "brandType",
          label: "品牌车型",
          width: 140,
           fixed:true
        },
        {
          prop: "vin",
          label: "VIN码",
          width: 110,
           fixed:true
        },
        {
          prop: "carNo",
          label: "车牌号",
          width: 100,
           fixed:true
        },
        {
          prop: "evaluatePrice",
          label: "评估价",
          width: 140,
        },
        {
          prop: "mileage",
          label: "行驶里程（公里）",
          width: 140,
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
          width: 140,
        },
        {
          prop: "createdAt",
          label: "录入时间",
          width: 140,
        },
        {
          prop: "carStatus",
          label: "车辆状态",
          width: 140,
        },
        {
          prop: "reportStatus",
          label: "评估状态",
          width: 140,
        },
        {
          prop: "workStatus",
          label: "整备状态",
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
      carStatus: [
        {
          value: 1,
          label: "未入库",
        },
        {
          value: 2,
          label: "在库",
        },
        {
          value: 3,
          label: "在售",
        },
        {
          value: 4,
          label: "已预订",
        },
        {
          value: 5,
          label: "已出库",
        },
        {
          value: 6,
          label: "已过户",
        },
      ],
      saleType: [
        {
          id: 1,
          name: "认证零售",
        },
        {
          id: 2,
          name: "普通零售",
        },
        {
          id: 3,
          name: "批售",
        },
      ],
      salePlant: [
        // {
        //   id: 1,
        //   name: "哈弗智家",
        // },
        {
          id: 2,
          name: "H5营销平台",
        },
        {
          id: 3,
          name: "其他",
        },
      ],
      orgList: [],
      filterOrgNameId: "",

      dialogHostling: false, //整备弹框
      dialogHostlingData: {},

      dialogSellPrice: false, //销售定价对话框
      dialogSellPriceInfo: "",

      dialogUploadPhoto: false, //上传销售照片
      dialogImgCarId: "",

      dialogVisible: false, //建卡弹框显示状态

      dialogStorage: false, //入库弹框显示状态
      dialogStorageInfo: "",
      certiAuth:""
    };
  },
  computed: {},
  mounted() {
    this.buttonLimits = this.$route.meta.button;
    this.findCarList();
    this.getOrgList();
    this.certiAuth = JSON.parse(window.localStorage.getItem("organizationInfo")).certificationBusiness;

  },
  watch: {
    filterMaxStickerPrice(newVal, oldVal) {
      this.filterInfo.maxStickerPrice = newVal * 10000;
    },
    filterMinStickerPrice(newVal, oldVal) {
      this.filterInfo.minStickerPrice = newVal * 10000;
    },
    filterMaxPurchasePrice(newVal, oldVal) {
      this.filterInfo.maxPurchasePrice = newVal * 10000;
    },
    filterMinStickerPrice(newVal, oldVal) {
      this.filterInfo.minPurchasePrice = newVal * 10000;
    },
    filterMinTransactionPrice(newVal, oldVal) {
      this.filterInfo.minTransactionPrice = newVal * 10000;
    },
    filterMaxTransactionPrice(newVal, oldVal) {
      this.filterInfo.maxTransactionPrice = newVal * 10000;
    },
  },
  methods: {
    findCarList() {
      var params = {};
      if (
        this.filterInfo.maxPurchasePrice &&
        this.filterInfo.minPurchasePrice
      ) {
        if (
          this.filterInfo.maxPurchasePrice < this.filterInfo.minPurchasePrice
        ) {
          this.showMessageBox("error", "最大价格需大于最小价格");
          return;
        }
      }
      if (this.filterInfo.maxStickerPrice && this.filterInfo.minStickerPrice) {
        if (this.filterInfo.maxStickerPrice < this.filterInfo.minStickerPrice) {
          this.showMessageBox("error", "最大价格需大于最小价格");
          return;
        }
      }
      if (this.inTime) {
        this.filterInfo.maxTime = this.inTime[1];
        this.filterInfo.minTime = this.inTime[0];
      } else {
        this.filterInfo.maxTime = "";
        this.filterInfo.minTime = "";
      }

      this.filterInfo.orgName = this.fliterOrgName;
      for (var key in this.filterInfo) {
        if (this.filterInfo[key]) {
          params[key] = this.filterInfo[key];
        }
      }
      if (params.minDay || params.maxDay) {
        params.carStatusList = [2, 3];
      }
      params.pageSize = this.pageSize;
      params.pageNo = this.currentPage;
      params.sortFlag = 1;
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
      if (column.property == "workStatus") {
        return this.formatWorkStatus(cellValue);
      }
      if (column.property == "usaleChannel") {
        return this.formatSaleChannel(cellValue);
      }
      if (column.property == "saleType") {
        return this.formatSaleType(cellValue);
      }
      if (column.property == "carStatus") {
        return this.formatCarState(cellValue);
      }
      if (column.property == "certifiedStatus") {
        return this.formatCertifiedStatus(cellValue);
      }
      if (column.property == "reportStatus") {
        return this.formatReportStatus(cellValue);
      }
      if (column.property == "orderStatus") {
        return this.formatOrderStatus(cellValue);
      }

      if (column.property == "brandType") {
        if (val.brandName) {
          return val.brandName + val.seriesName + val.modelName;
        }
      }
      return cellValue || "--";
    },
    // 整备格式化
    formatWorkStatus(workStatus) {
      switch (workStatus) {
        case 0:
          return "未整备";
          break;
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
          return "完成";
          break;
        case 8:
          return "已作废";
          break;
        default:
          return "--";
          break;
      }
    },
    // 销售平台格式化
    formatSaleChannel(salePlant) {
      if (salePlant) {
        var salePlantString = "";
        var salePlantArr = salePlant.split(",");
        for (let index = 0; index < salePlantArr.length; index++) {
          const element = salePlantArr[index];
          this.salePlant.forEach((item) => {
            if (item.id == element) {
              salePlantString += (index > 0 ? "," : "") + item.name;
            }
          });
        }
        return salePlantString;
      } else {
        return "--";
      }
    },
    formatSaleType(saleType) {
      switch (saleType) {
        case 1:
          return "认证零售";
          break;
        case 2:
          return "普通零售";
          break;
        case 3:
          return "批售";
          break;
        default:
          return "--";
          break;
      }
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
    // 通过角色名称查询角色
    selectFilter() {
      this.handleCurrentChange(1);
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
    brandFilterChangeVal(selectName) {
      this.filterInfo.brandNameList = selectName.carBrandName
        ? selectName.carBrandName.split(",")
        : [];
      this.filterBrandId = selectName.carBrandId
        ? selectName.carBrandId.split(",")
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
    clickPurchasePrice(item) {
      this.purchaseId = item.id;
      switch (item.id) {
        case 1:
          this.filterInfo.maxPurchasePrice = "";
          this.filterInfo.minPurchasePrice = "";
          break;
        case 2:
          this.filterInfo.maxPurchasePrice = 50000;
          this.filterInfo.minPurchasePrice = 0;
          break;
        case 3:
          this.filterInfo.maxPurchasePrice = 100000;
          this.filterInfo.minPurchasePrice = 50000;
          break;
        case 4:
          this.filterInfo.maxPurchasePrice = 200000;
          this.filterInfo.minPurchasePrice = 100000;
          break;
        case 5:
          this.filterInfo.maxPurchasePrice = 300000;
          this.filterInfo.minPurchasePrice = 200000;
          break;
        case 6:
          this.filterInfo.maxPurchasePrice = 400000;
          this.filterInfo.minPurchasePrice = 300000;
          break;
        case 7:
          this.filterInfo.maxPurchasePrice = "";
          this.filterInfo.minPurchasePrice = 400000;
          break;
        default:
          break;
      }
    },
    clickTransactionPrice(item) {
      this.transactionPriceId = item.id;
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
    clickSalesPrice(item) {
      this.sales = item.id;
      switch (item.id) {
        case 1:
          this.filterInfo.maxStickerPrice = "";
          this.filterInfo.minStickerPrice = "";
          break;
        case 2:
          this.filterInfo.maxStickerPrice = 50000;
          this.filterInfo.minStickerPrice = 0;
          break;
        case 3:
          this.filterInfo.maxStickerPrice = 100000;
          this.filterInfo.minStickerPrice = 50000;
          break;
        case 4:
          this.filterInfo.maxStickerPrice = 200000;
          this.filterInfo.minStickerPrice = 100000;
          break;
        case 5:
          this.filterInfo.maxStickerPrice = 300000;
          this.filterInfo.minStickerPrice = 200000;
          break;
        case 6:
          this.filterInfo.maxStickerPrice = 400000;
          this.filterInfo.minStickerPrice = 300000;
          break;
        case 7:
          this.filterInfo.maxStickerPrice = "";
          this.filterInfo.minStickerPrice = 400000;
          break;
        default:
          break;
      }
    },
    clickYear(item) {
      this.yearId = item.id;
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
    // 清空 重置
    resetFilter() {
      this.filterInfo = {
        brandNameList: [],
        seriesNameList: [],
        modelNameList: [],
        maxPurchasePrice: "",
        minPurchasePrice: "",

        maxStickerPrice: "",
        minStickerPrice: "",

        maxYear: "",
        minYear: "",
        complicated: "",

        carOwnerInfo: "",
        orgName: "",
        carStatus: "",
        maxDay: "",
        minDay: "",
        carStatusList: [],
        saleTypeList: [],
        saleChannelList: [],
        workStatusList: [],
        certifiedStatusList: [],
      };
      this.filterBrandId = 0;
      this.filterSeriesId = 0;
      this.filterModelId = 0;
      this.filterMinPurchasePrice = "";
      this.filterMaxPurchasePrice = "";
      this.filterMinStickerPrice = "";
      this.filterMaxStickerPrice = "";
      this.purchaseId = 1;
      this.sales = 1;
      this.yearId = 1;
      this.inTime = [];
      this.fliterOrgName = "";
      this.filterOrgNameId = "";
      // this.currentPage = 1;
    },
    // 查看详情
    gotoDetail(index, row) {
      this.$router.push({
        path: "/carAssessDetail",
        query: { from: "inventory", id: row.id },
      });
    },

    applyAuthentication(index, row) {
      var nowTime = new Date();
      var lastTime = new Date(row.registeredDate);
      var lastmaintenanceDate = new Date(row.maintenanceDate);
      // console.log(lastTime > nowTime);
      // console.log((nowTime - lastTime) / 1000 / 60 / 60 / 24 / 365 > 4);
      // console.log(lastmaintenanceDate > nowTime);
      // console.log(row.maintenanceDate);
      // console.log((nowTime - lastmaintenanceDate) / 1000 / 60 / 60 / 24 / 30);
      if (
        lastTime > nowTime ||
        (nowTime - lastTime) / 1000 / 60 / 60 / 24 / 365 > 4 ||
        lastmaintenanceDate > nowTime ||
        (nowTime - lastmaintenanceDate) / 1000 / 60 / 60 / 24 / 30 > 6
      ) {
        let message = "此车辆暂不符合认证要求";
        this.$alert(message, "警告", {
          confirmButtonText: "确定",
        });
        return;
      }
      if (
        !row.accident ||
        !row.carDetail ||
        row.accident.split(",").length != 3 ||
        row.carDetail.split(",").length != 4
      ) {
        let message = "此车辆暂不符合认证要求";
        this.$alert(message, "警告", {
          confirmButtonText: "确定",
        });
        return;
      }
      if (
        row.fuelType != "1" ||
        row.useType != "2" ||
        row.mileage > 80000 ||
        row.mileage - row.maintenanceMileage > 8000
      ) {
        let message = "此车辆暂不符合认证要求";
        this.$alert(message, "警告", {
          confirmButtonText: "确定",
        });
        return;
      }

      this.$router.push({
        path: "/applyCertification",
        query: {
          carId: row.id,
          vin: row.vin,
        },
      });
    },
    reserveCarButton(index, row) {
      this.$router.push({
        path: "/createCarOrderInfo",
        query: {
          vin: row.vin,
        },
      });
    },

    // 整备操作
    applyHostling(index, row) {
      this.dialogHostling = true;
      this.dialogHostlingData = JSON.parse(JSON.stringify(row));
    },
    successHostling() {
      this.dialogHostling = false;
      this.dialogHostlingData = {};
      this.findCarList();
    },
    closeHostlingDialog() {
      this.dialogHostling = false;
      this.dialogHostlingData = {};
    }, //整备操作end

    //销售定价
    showSellPriceDialog(index, row) {
      this.dialogSellPriceInfo = {
        dialogSellPlant: [],
        ...JSON.parse(JSON.stringify(row)),
      };

      this.dialogSellPrice = true;
    },
    closeSalesPrice() {
      this.dialogSellPriceInfo = "";
      this.dialogSellPrice = false;
      this.findCarList();
    }, //销售定价end

    // 上架
    upShelf(index, row) {
      let message = "";
      if (row.compileStatus == 1 && row.priceStatus == 1) {
        message = "信息均填写完整，请确认发布上架？";
      } else {
        message = "销售定价（或销售照片）信息缺乏，请完善后再发布上架";
      }

      this.$confirm(message, "提示", {
        dangerouslyUseHTMLString: true,
      })
        .then(() => {
          if (row.compileStatus == 1 && row.priceStatus == 1) {
            this.$axios
              .post(this.pathItem.putawayCarById, {
                id: row.id,
              })
              .then((res) => {
                if (res.code == 0) {
                  this.showMessageBox("success", "上架成功");
                  this.findCarList();
                } else {
                  this.showMessageBox("error", res.message);
                }
              })
              .catch((res) => {
                this.showMessageBox("error", res.message);
              });
          } else {
          }
        })
        .catch(() => {});
    },
    //下架
    downShelf(index, row) {
      this.$confirm(
        "<div style='text-align:center;'><p style='font-size:18px;font-weight:bord;'>确定要下架该车辆？</p><p style='margin:20px'>提示：一经下架，所有销售平台会同时下架</p></div>",
        "提示",
        {
          dangerouslyUseHTMLString: true,
        }
      )
        .then(() => {
          this.$axios
            .post(this.pathItem.soldOutCarById, {
              id: row.id,
            })
            .then((res) => {
              if (res.code == 0) {
                this.showMessageBox("success", "下架成功");
                this.findCarList();
              } else {
                this.showMessageBox("error", res.message);
              }
            })
            .catch((res) => {
              this.showMessageBox("error", res.message);
            });
        })
        .catch(() => {});
    },
    // 上传销售照片
    openSaleImg(index, row) {
      this.dialogUploadPhoto = true;
      this.dialogImgCarId = row.id;
    },
    coloseImgDialog() {
      this.dialogUploadPhoto = false;
    },
    successUpload() {
      this.dialogUploadPhoto = false;
      this.findCarList();
    }, //上传销售照片end
    // 编辑评估列表
    editAssess(index, row) {
      this.$router.push({
        path: "/carAssessOperation",
        query: { params: row.id },
      });
    },
    // 删除车辆
    deleteAssess(index, row) {
      this.$confirm("请再次确认是否删除此车辆?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .post(this.pathItem.deleteCar, {
              id: row.id,
            })
            .then((res) => {
              if (res.code == 0) {
                this.showMessageBox("success", "删除成功");
                this.findCarList();
              } else {
                this.showMessageBox("error", res.message);
              }
            })
            .catch((res) => {
              this.showMessageBox("error", res.message);
            });
        })
        .catch(() => {});
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
    }, // 入库end
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

    // 建卡
    closeBuild() {
      this.dialogVisible = false;
    },
    successBuild(buildResult) {
      if (buildResult.type == 2) {
        this.filterInfo.carOwnerInfo = buildResult.phone;
        this.currentPage = 1;
        this.dialogVisible = false;
      } else {
        this.dialogVisible = false;
      }
      this.findCarList();
    }, // 建卡
    // 车辆过户
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
    // 汇报撤销
    cancleCer(index, row) {
      var params = {
        id: row.id,
        cid: row.cid,
        vin: row.vin,
        certifiedStatus: 5,
      };
      this.$confirm("是否要撤回该车的认证汇报", "提示", {
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