<template>
  <div class="workOrderHostling">
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
        <el-row style="margin:5px auto;">
          <el-col class="el-col-test" :span="2">品牌车型</el-col>
          <el-col :span="4">
            <carBrandSerise
              @seriseChangeVal="seriseFilterChangeVal"
              @brandChangeVal="brandFilterChangeVal"
              @modelChangeVal="modelFilterChangeVal"
              :oldBrandId="filterBrandId"
              :oldSeriseId="filterSeriesId"
              :oldModelId="filterModelId"
              :hasModel="true"
              :hasBrandMult="true"
              :hasModelMult="true"
              :hasSeriesMult="true"
            ></carBrandSerise>
          </el-col>
          <el-col class="el-col-test" :span="2">车辆信息</el-col>
          <el-col :span="4">
            <el-input v-model="filterInfo.vin" placeholder="请输入车牌号、VIN码" maxlength="50" size="mini"></el-input>
          </el-col>
          <el-col class="el-col-test" :span="2">经销商</el-col>
          <el-col :span="4">
            <el-input v-model="filterInfo.orgName" maxlength="50" size="mini"></el-input>
          </el-col>
          <el-col class="el-col-test" :span="2">录入人</el-col>
          <el-col :span="4">
            <el-select v-model="opactorId" @change="choseUser" size="mini">
              <el-option
                :label="opactor.userName"
                :value="opactor.id"
                :key="opactor.id"
                v-for="opactor in opactorList"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-col class="el-col-test" :span="2">整备状态</el-col>
        <el-col :span="22" style="margin-top:5px;">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            style="display:inline-block; margin-right:30px;"
          >全部</el-checkbox>
          <el-checkbox-group
            v-model="hostlingStatusCheck"
            @change="handleCheckedChange"
            style="display:inline-block;"
          >
            <el-checkbox
              v-for="checkItem in hostlingStatus"
              :key="checkItem.id"
              :label="checkItem.id"
            >{{checkItem.label}}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <!-- 整备工单列表 -->
      <el-row class="main-content">
        <el-table :data="tableData" border v-loading="loading">
          <template v-for="(item,index) in tableHead">
            <el-table-column
              :formatter="formatData"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              show-overflow-tooltip
              align="center"
            ></el-table-column>
          </template>
          <el-table-column label="操作" width="240" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                plain
                v-if="buttonLimits.includes(136)"
                icon="el-icon-document"
                style="margin-top:5px;"
                @click="gotoDetail(scope.$index, scope.row)"
              >详情</el-button>
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
    <!-- 整备详情 -->
    <CarHostlingDialog
      v-if="hostlingDialog"
      :hostlingId="hostId"
      @closedDialog="closeHostlingDialog"
    ></CarHostlingDialog>

    <carHostlingChildInfo
      v-if="hostlingChildDialog"
      :hostlingId="hostId"
      @closedChildDialog="closeHostlingChildDialog"
    ></carHostlingChildInfo>
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
import CarHostlingDialog from "@/components/carManagement/CarHostlingDialog"; //整备详情
import carHostlingChildInfo from "@/components/carManagement/carHostlingChildInfo"; //子订单整备详情
import carBrandSerise from "../../components/certification/selectCarBrand";
export default {
  components: {
    CarHostlingDialog,
    carBrandSerise,
    carHostlingChildInfo,
  },
  data() {
    return {
      buttonLimits: [],
      hostlingStatusCheck: [],
      filterInfo: {
        vin: "",
        workStates: "",
        orgName: "",
        creator: "",
        modelName: "",
        brandName: "",
        seriesName: "",
      },
      filterBrandId: "",
      filterModelId: "",
      filterSeriesId: "",

      checkAll: false,
      isIndeterminate: true,
      hostlingStatus: [
        {
          id: 1,
          label: "待提交",
        },
        {
          id: 2,
          label: "待审核",
        },
        {
          id: 3,
          label: "审核驳回",
        },
        {
          id: 4,
          label: "整备中",
        },
        {
          id: 5,
          label: "待验收",
        },
        {
          id: 6,
          label: "验收通过",
        },
        {
          id: 7,
          label: "验收完成",
        },
        {
          id: 8,
          label: "已作废",
        },
      ],
      pageSize: 10,
      currentPage: 1, //当前页数
      totalPage: 1,
      totalElements: 0,
      tableData: [],
      loading: false, //加载数据
      hostlingDialog: false, //整备申请弹框显示状态
      hostId: "",
      tableHead: [
        {
          prop: "workNum",
          label: "整备单号",
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
          label: "车牌号",
          width: 120,
        },
        {
          prop: "orgName",
          label: "经销商",
          width: 140,
        },
        {
          prop: "workFee",
          label: "整备预算",
        },
        {
          prop: "workStatus",
          label: "整备状态",
        },
        {
          prop: "createdAt",
          label: "创建时间",
          width: 120,
        },
      ],
      opactorList: [],
      opactorId: "",
      hostlingChildDialog: false,
    };
  },
  computed: {
    //获取vuex存储的已预览标签页
  },
  mounted() {
    // this.initButtonLimits(); //设置按钮权限
    this.findCarList();
    this.getAllOpactor();
    this.buttonLimits = this.$route.meta.button;
  },
  methods: {
    
    handleCheckAllChange(val) {
      this.hostlingStatusCheck = val ? [1, 2, 3, 4, 5, 6, 7, 8] : [];
      this.filterInfo.workStates = val ? [1, 2, 3, 4, 5, 6, 7, 8] : " ";
      this.isIndeterminate = false;
    },
    handleCheckedChange(value) {
      let checkedCount = value.length;
      console.log(checkedCount);
      this.checkAll = checkedCount === this.filterInfo.workStates.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.hostlingStatus.length;
       
      this.filterInfo.workStates =
        checkedCount > 0 ? this.hostlingStatusCheck : "";
    },
    findCarList() {
      this.loading = true;
  
      var params = {
        pageSize: this.pageSize,
        pageIndex: this.currentPage,
        buttonKey:this.$route.meta.buttonKey,
        requestBody: {
          ...this.filterInfo,
        },
      };
      this.loading = true;
      this.$axios
        .post(this.pathItem.findWorkCarList, params)
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
        for (let i in this.hostlingStatus) {
          if (this.hostlingStatus[i].id == cellValue) {
            return this.hostlingStatus[i].label;
          }
        }
      }
      if (column.property == "brandType") {
        if (val.brandName) {
          return val.brandName + val.seriesName + val.modelName;
        }
      }
      return cellValue || "--";
    },
    brandFilterChangeVal(selectName) {
      this.filterInfo.brandName = selectName.carBrandName;
      // this.filterBrandId = selectName.carBrandId;
    },

    seriseFilterChangeVal(selectName) {
      this.filterInfo.seriesName = selectName.carSeriesName;
    },

    modelFilterChangeVal(selectName) {
      this.filterInfo.modelName = selectName.carModelName;
    },
    // 通过角色名称查询角色
    selectFilter() {
      this.handleCurrentChange(1);
    },
    // 清空 重置
    resetFilter() {
      this.filterInfo = {
        vin: "",
        workStates: "",
        orgName: "",
        creator: "",
        modelName: "",
        brandName: "",
        seriesName: "",
      };
      this.opactorId = "";
      this.filterBrandId = [];
      this.filterModelId = [];
      this.filterSeriesId = [];
      this.hostlingStatusCheck = [];
      this.checkAll = false;
      this.isIndeterminate = true;
      // this.currentPage = 1;
      // this.handleCurrentChange(1);
    },
    getAllOpactor() {
      this.$axios
        .post(this.pathItem.getAllOpactor, {})
        .then((res) => {
          if (res.code == 0) {
            this.opactorList = res.result.systemUserInfoDealersList;
          }
        })
        .catch((res) => {});
    },
    choseUser(val) {
      if (val) {
        var choseItem = this.opactorList.filter((item) => {
          return item.id == val;
        });
        this.filterInfo.creator = choseItem[0].userName;
      } else {
        this.filterInfo.creator = "";
      }
    },
    // 查看详情
    gotoDetail(index, row) {
      if (row.workNumParent == 0) {
        this.hostlingDialog = true;
      } else {
        this.hostlingChildDialog = true;
      }
      this.hostId = row.id;
    },

    closeHostlingDialog() {
      this.hostlingDialog = false;
      this.findCarList();
    },
    closeHostlingChildDialog() {
      this.hostlingChildDialog = false;
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
.workOrderHostling {
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