<template>
  <div class="findcar-dialog">
    <el-dialog
      title="在库车辆"
      :visible="libraryDialog"
      :lock-scroll="true"
      :close-on-click-modal="false"
      width="800px"
      @close="closeCar"
    >
      <el-row :gutter="20" class="main-content">
        <el-col :span="12">
          <el-row :gutter="10">
            <el-col class="el-col-text" :span="5">品牌车系</el-col>
            <el-col :span="16">
              <carBrandSerise
                @brandChangeVal="brandChangeVal"
                @seriseChangeVal="seriseChangeVal"
                :hasModel="false"
                :canClear="true"
              ></carBrandSerise>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row :gutter="10">
            <el-col class="el-col-text" :span="6">车辆信息</el-col>
            <el-col :span="13">
              <el-input clearable placeholder="请输入车辆VIN码/原车牌号" v-model="findCarParams.carInfo" size="mini"></el-input>
            </el-col>
            <el-col :span="3">
              <el-button size="mini" type="primary" @click="findCarList">查询</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-table
        :data="carData"
        @select-all="onSelectAll"
        @selection-change="selectItem"
        @row-click="onSelectOp"
        v-loading="loading"
        ref="multipleTable"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <template v-for="(item,index) in dataHead">
          <el-table-column
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.column.property == 'brand'"
              >{{scope.row.brandName + "-" + scope.row.seriesName}}</span>
              <span
                v-else-if="scope.column.property == 'inTime'"
              >{{ scope.row.inTime | formatDate("yyyy-MM-dd hh:mm")}}</span>
              <span
                v-else-if="scope.column.property == 'workStatus'"
              >{{formatWorkStatus(scope.row.workStatus)}}</span>
              <span v-else>{{ scope.row[scope.column.property] }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <div class="danger">每次只能选择一条数据</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCar" size="medium">确 定</el-button>
        <el-button @click="closeCar" size="medium">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/*********************************************************************************************
 **                                 车辆认证列表方法说明
 ** @function onSelectAll() 控制全选为false
 ** @function selectItem() 控制勾选为一个
 ** @function onSelectOp() 点击行选中数据
 ** @function submitCar() 点击确定提交数据
 ** @function closeCar() 关闭弹窗
 ** @function brandChangeVal(selectInfo) 车品牌选择
 ** @function seriseChange(selectInfo) 车系选择
 ** @function findCarList() 获取车辆列表
 ** @function formatWorkStatus() 格式化整备状态
 *
 *********************************************************************************************/
import carBrandSerise from "../../components/certification/selectCarBrand"; //选择车型车系
export default {
  name: "findCarDialog",
  components: {
    carBrandSerise,
  },
  props: {
    libraryDialog: Boolean,
  },
  data() {
    return {
      dataHead: [
        {
          prop: "brand",
          label: "品牌车型",
          width: 140,
        },
        {
          prop: "vin",
          label: "车架号",
          width: 140,
        },
        {
          prop: "carNo",
          label: "车牌号",
          width: 140,
        },
        {
          prop: "inTime",
          label: "入库时间",
          width: 140,
        },
        {
          prop: "workStatus",
          label: "整备状态",
          width: 140,
        },
      ],
      carData: [],
      loading: false,

      selectlist: [],
      carBrand: [],
      carBrandId: "",
      carBrandName: "",
      carSeries: [],
      carSeriesId: "",
      carSeriesName: "",
      findCarParams: {
        brandName: "",
        seriesName: "",
        carInfo: "",
      },
    };
  },
  methods: {
    brandChangeVal(selectInfo) {
      this.findCarParams.brandName = selectInfo.carBrandName;
    },
    seriseChangeVal(selectInfo) {
      this.findCarParams.seriesName = selectInfo.carSeriesName;
    },
    findCarList() {
      this.loading = true;
      var params = {};
      for (var key in this.findCarParams) {
        if (this.findCarParams[key] !== "") {
          params[key] = this.findCarParams[key];
        }
      }

      this.$axios
        .post(this.pathItem.certiFindCarInfo, params)
        .then((res) => {
          if (res.code == 0) {
            this.carData = res.result;
          } else {
            this.carData = [];
          }

          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
          this.$alert(res.message, "提示", {
            confirmButtonText: "确定",
            type: "error",
          });
        });
    },
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
          break;
      }
    },
    onSelectAll() {
      this.$refs.multipleTable.clearSelection();
    },
    selectItem(rows) {
      if (rows.length > 1) {
        var newRows = rows.filter((it, index) => {
          if (index == rows.length - 1) {
            this.$refs.multipleTable.toggleRowSelection(it, true);
            return true;
          } else {
            this.$refs.multipleTable.toggleRowSelection(it, false);
            return false;
          }
        });
        this.selectlist = newRows;
      } else {
        this.selectlist = rows;
      }
    },
    onSelectOp(row) {
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(row, true);
      this.selectlist = [];
      this.selectlist.push(row);
    },
    submitCar() {
      if (this.selectlist.length) {
        this.$emit("closeDialog");
        this.$emit("changeCarInfo", this.selectlist[0]);
      } else {
        this.$message.error("请选择车辆");
      }
    },
    closeCar() {
      this.$emit("closeDialog");
    },
  },
  filters: {
    formatDate(value, format) {
      if (value) {
        value = new Date(value);
        let o = {
          "M+": value.getMonth() + 1,
          "d+": value.getDate(),
          "h+": value.getHours(),
          "m+": value.getMinutes(),
          "s+": value.getSeconds(),
        };

        if (/(y+)/.test(format)) {
          format = format.replace(
            RegExp.$1,
            (value.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
          for (let k in o) {
            if (new RegExp(`(${k})`).test(format)) {
              format = format.replace(
                RegExp.$1,
                RegExp.$1.length == 1
                  ? o[k]
                  : ("00" + o[k]).substr(("" + o[k]).length)
              );
            }
          }
          return format;
        } else {
          return "--";
        }
      }
    },
  },
  created() {},
};
</script>

<style scoped lang="scss">
.findcar-dialog {
  padding-bottom: 100px;
  >>> .el-dialog__header {
    border-bottom: 1px solid #cccccc;
  }
  .danger {
    color: #f56c6c;
    font-size: 12px;
    padding-right: 20px;
    margin-top: 10px;
  }
  .dialog-footer {
    text-align: center;
  }
  .main-content {
    background-color: #fff;
    padding: 5px 20px;
    // margin-bottom: 10px;
    font-size: 13px;
    &:first-child {
      margin-bottom: 0;
    }

    .model-box {
      margin-bottom: 30px;
      .img-box {
        text-align: center;
        .licenese-info-title {
          text-align: center;
          padding: 10px 0;
          .licenese-info-need {
            color: #f56c6c;
          }
        }
      }
    }
    .el-col-text {
      line-height: 28px;
      padding-right: 10px;
      text-align: right;
      flex-shrink: 0;
    }
    .el-col-content {
      line-height: 28px;
      padding-left: 10px;
      text-align: left;
    }
    .car-info-list {
      margin-top: 20px;
      .mileage {
        // display: flex;
        .mileage-input {
          width: 50%;
        }
      }
    }

    .col-width {
      width: 41%;
    }
  }
}
</style>