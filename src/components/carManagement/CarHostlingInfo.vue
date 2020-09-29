<template>
  <div class="carHostlingInfo">
    <template>
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
    </template>
    <CarHostlingDialog
      v-if="hostlingDialog"
      :hostlingId="hostId"
      :optionBtn="false"
      @closedDialog="closeHostlingDialog"
    ></CarHostlingDialog>
  </div>
</template>
<script>
/*********************************************************************************************
 *                                车辆整备子订单信息详情
 ** @function closeApprovalLogDialog() 关闭流转记录


 ** @function closeHostlingDialog() 关闭父整备弹窗
 ** @function findCarList() 获取整备工单
 ** @function handleSizeChange() 分页
 ** @function handleCurrentChange(val) 分页 @param val value
 ** @function gotoDetail(val) 查看详情  @param val value
 ** @function formatData(val) 格式化表格

 *
 *********************************************************************************************/
import CarHostlingDialog from "../../components/carManagement/CarHostlingDialog";
export default {
  components: {
    CarHostlingDialog,
  },
  props: {
    carInfo: "",
  },
  data() {
    return {
      hostlingList: [],
      hostlingDialog: false,
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
      tableData: [],
      pageSize: 10,
      currentPage: 1, //当前页数
      totalPage: 1,
      totalElements: 0,
      loading: false,
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
    };
  },
  methods: {
    closeApprovalLogDialog() {
      this.showAppovalLogDialog = false;
    },
    //格式化数据
    formatData(val, column, cellValue) {
      if (column.property == "workStatus") {

        for (let i in this.hostlingStatus) {
          if (this.hostlingStatus[i].value == cellValue) {
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
    findCarList() {
      this.loading = true;
      var params = {
        pageSize: this.pageSize,
        pageIndex: this.currentPage,
        requestBody: {
          carId: this.carInfo.id,
          type: 1,
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
          }

          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
        });
    },
    gotoDetail(index, row) {
      this.hostlingDialog = true;
      this.hostId = row.id;
    },
    closeHostlingDialog() {
      this.hostlingDialog = false;
    },
  },
  mounted() {
    this.findCarList();
  },
};
</script>