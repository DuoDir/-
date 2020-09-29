<template>
  <div class="certification">
    <el-header class="header">
      <span>认证车辆列表</span>
      <div style="float:right;">
        <el-button type="primary" @click="selectFilter" icon="el-icon-search">查询</el-button>
        <el-button type="primary" plain @click="resetFilter" icon="el-icon-delete">清空</el-button>
      </div>
    </el-header>
    <!-- 筛选内容 -->
    <el-main style="padding-bottom: 15px;">
      <el-row class="main-content">
        <el-col :span="8">
          <el-row :gutter="10">
            <el-col class="el-col-test" :span="6">品牌车系</el-col>
            <el-col :span="18">
              <carBrandSerise
                :canClear="true"
                @seriseChangeVal="seriseChangeVal"
                @brandChangeVal="brandChangeVal"
                :oldBrandId="oldBrandId"
                :oldSeriesId="oldSeriesId"
                :hasModel="false"
              ></carBrandSerise>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-col class="el-col-test" :span="8">车架号</el-col>
            <el-col :span="16">
              <el-input size="mini" placeholder="请输入车架号" v-model="filterInfo.vin"></el-input>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="5">
          <el-row>
            <el-col class="el-col-test" :span="10">认证状态</el-col>
            <el-col :span="14">
              <el-select placeholder="选择认证状态" size="mini" v-model="filterInfo.certifiedStatus">
                <el-option
                  v-for="(certifiStatusItem,index) in certifiStatus"
                  :key="index"
                  :label="certifiStatusItem.name"
                  :value="certifiStatusItem.type"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="5">
          <el-row>
            <el-col class="el-col-test" :span="12">失效倒计时</el-col>
            <el-col :span="12">
              <el-select placeholder="选择失效倒计时" size="mini" v-model="filterInfo.failureCountdown">
                <el-option
                  v-for="(filtureStatusItem,index) in failturStatus"
                  :key="index"
                  :label="filtureStatusItem.name"
                  :value="filtureStatusItem.type"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="main-content">
        <el-col :span="8">
          <el-row :gutter="10">
            <el-col class="el-col-test" :span="6">申请时间</el-col>
            <el-col :span="9">
              <el-date-picker
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="开始时间"
                v-model="filterInfo.applyTimeStart"
                size="mini"
              ></el-date-picker>
            </el-col>
            <el-col :span="9">
              <el-date-picker
                type="date"
                placeholder="结束时间"
                value-format="yyyy-MM-dd"
                v-model="filterInfo.applyTimeEnd"
                size="mini"
              ></el-date-picker>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row :gutter="10">
            <el-col class="el-col-test" :span="8">认证时间</el-col>
            <el-col :span="8">
              <el-date-picker
                type="date"
                placeholder="开始时间"
                value-format="yyyy-MM-dd"
                v-model="filterInfo.passTimeStart"
                size="mini"
              ></el-date-picker>
            </el-col>
            <el-col :span="8">
              <el-date-picker
                type="date"
                placeholder="结束时间"
                value-format="yyyy-MM-dd"
                v-model="filterInfo.passTimeEnd"
                size="mini"
              ></el-date-picker>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="5">
          <el-row>
            <el-col class="el-col-test" :span="10">认证编号</el-col>
            <el-col :span="14">
              <el-input placeholder="请输入认证编号" size="mini" v-model="filterInfo.certifiedNum"></el-input>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="main-content">
        <el-button class="apply-btn" type="primary" @click="applayCertifi">申请认证</el-button>
        <el-table :data="tableData" border v-loading="loading">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <template v-for="(item,index) in tableHead">
            <el-table-column
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              show-overflow-tooltip
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  v-if="scope.column.property == 'inspectionReport'"
                  @click="toReoport(scope.row)"
                >查看</el-button>
                <span
                  v-else-if="scope.column.property == 'brandName'"
                >{{scope.row.brandName + "-" + scope.row.seriesName + "-" + scope.row.modelName}}</span>
                <span
                  v-else-if="scope.column.property == 'failureCountdown' && scope.row.passTime"
                  :class="{'danger':scope.row.failureCountdown < 10}"
                >{{ scope.row.failureCountdown ? scope.row.failureCountdown + "天" : "--"}}</span>
                <span
                  v-else
                >{{ scope.row[scope.column.property] ? scope.row[scope.column.property] : "--" }}</span>
              </template>
            </el-table-column>
          </template>
          <el-table-column label="操作" width="220" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                v-if="buttonLimits.includes(83)&&(scope.row.cerStatus =='1' || scope.row.cerStatus =='4' || scope.row.cerStatus =='5')"
                icon="el-icon-document"
                style="margin-top:5px;"
                @click="editCertifi(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                plain
                icon="el-icon-edit"
                style="margin-top:5px;"
                v-if="buttonLimits.includes(84) && (scope.row.cerStatus =='1')"
                @click="deleteInfo(scope.$index, scope.row)"
              >删除</el-button>
              <el-button
                size="mini"
                type="danger"
                plain
                icon="el-icon-edit"
                style="margin-top:5px;"
                v-if="buttonLimits.includes(82)"
                @click="detailInfo(scope.$index, scope.row)"
              >详情</el-button>
              <el-button
                size="mini"
                type="danger"
                plain
                icon="el-icon-sell"
                style="margin-top:5px;"
                v-if="(scope.row.cerStatus =='2')&&buttonLimits.includes(85)"
                @click="undoApplay(scope.$index, scope.row)"
              >撤销申请</el-button>
              <el-button
                size="mini"
                type="success"
                plain
                icon="el-icon-sell"
                style="margin-top:5px;margin-left:10px;"
                v-if="(scope.row.cerStatus =='8')&& buttonLimits.includes(86)"
                @click="downloadCertificate(scope.$index, scope.row)"
              >下载证书</el-button>
              <el-button
                size="mini"
                type="danger"
                plain
                icon="el-icon-sell"
                v-if="(scope.row.cerStatus =='8' && (scope.row.carStatus == 2 || scope.row.carStatus == 3|| scope.row.carStatus == 4))&&buttonLimits.includes(87)"
                style="margin-top:5px;"
                @click="cancelCertification(scope.$index, scope.row)"
              >取消认证</el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-sell"
                style="margin-top:5px;"
                @click="gotoReport(scope.row)"
                v-if="(scope.row.cerStatus =='8' && scope.row.carStatus == 6)&&buttonLimits.includes(88)"
              >认证汇报</el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-sell"
                style="margin-top:5px;"
                v-if="(scope.row.cerStatus =='11' && scope.row.carStatus == 6)&&buttonLimits.includes(89)"
                @click="editReport(scope.$index, scope.row)"
              >编辑汇报</el-button>
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
  </div>
</template>

<script>
/*********************************************************************************************
 **                                 车辆认证列表方法说明
 ** @function getCertificateList() 获取认证列表
 ** @function countDownDay() 剩余天数倒计时
 ** @function findCarBrand() 查询车辆品牌
 ** @function findCarSerise() 查询车系
 ** @function brandChange(selectId) 选择车辆品牌的方法   @param selectId 选择的id
 ** @function seriseChange(selectId) 选择车系的方法   @param selectId 选择的id
 ** @function handleSizeChange(pageSize) 选择每页显示条数出发的更改时间   @param pageSize 每页显示的条数
 ** @function handleCurrentChange(val) 切换页码触发的方法   @param val 页码
 ** @function applayCertifi() 申请认证
 ** @function selectFilter() 按条件筛选
 ** @function resetFilter() 重置筛选条件
 ** @function editCertifi(index, row) 编辑认证  @param index 序号 @param row 该行数据
 ** @function deleteInfo(index, row) 删除认证  @param index 序号 @param row 该行数据
 ** @function undoApplay(index, row) 撤销申请  @param index 序号 @param row 该行数据
 ** @function cancelCertification(index, row) 取消认证   @param index 序号 @param row 该行数据
 ** @function gotoReport() 去汇报
 ** @function editReport(index, row) 编辑汇报  @param index 序号 @param row 该行数据
 ** @function downloadCertificate(index, row) 下载证书  @param index 序号 @param row 该行数据
 ** @function detailInfo(index, row) 查看详情  @param index 序号 @param row 该行数据
 ** @function toReoport(index, row) 查看检测报告  @param index 序号 @param row 该行数据
 *
 *********************************************************************************************/
import carBrandSerise from "../../components/certification/selectCarBrand";
export default {
  name: "certification",
  components: {
    carBrandSerise,
  },
  data() {
    return {
      buttonLimits: [],
      loading: false,
      pageSize: 10,
      currentPage: 1, //当前页数
      totalPage: 1,
      totalElements: 0,
      // 筛选条件
      filterInfo: {
        brandName: "",
        seriesName: "",
        vin: "",
        certifiedStatus: "",
        failureCountdown: "",
        applyTimeStart: "",
        applyTimeEnd: "",
        passTimeStart: "",
        passTimeEnd: "",
        certifiedNum: "",
      },
      // 失效状态筛选条件
      failturStatus: [
        {
          type: "",
          name: "全部",
        },
        {
          type: "10",
          name: "小于10天",
        },
        {
          type: "30",
          name: "小于30天",
        },
        {
          type: "45",
          name: "小于45天",
        },
      ],
      // 认证状态筛选条件
      certifiStatus: [
        {
          type: "",
          name: "全部",
        },
        {
          type: 1,
          name: "录入中",
        },
        {
          type: 2,
          name: "待初审",
        },
        {
          type: 3,
          name: "待复审",
        },
        {
          type: 4,
          name: "申请驳回",
        },
        {
          type: 5,
          name: "已撤销",
        },
        {
          type: 6,
          name: "认证失效",
        },
        {
          type: 7,
          name: "取消认证",
        },
        {
          type: 8,
          name: "已认证",
        },
        {
          type: 9,
          name: "汇报待审核",
        },
        {
          type: 10,
          name: "汇报通过",
        },
        {
          type: 11,
          name: "汇报驳回",
        },
      ],
      // 表单头部
      tableHead: [
        {
          prop: "certifiedNum",
          label: "认证编号",
          width: 140,
        },
        {
          prop: "orgName",
          label: "经销商",
        },
        {
          prop: "provinceCity",
          label: "所在城市",
          width: 140,
        },
        {
          prop: "brandName",
          label: "品牌车型",
          width: 240,
        },
        {
          prop: "vin",
          label: "车架号",
          width: 140,
        },
        {
          prop: "inspectionReport",
          label: "检测报告",
          width: 140,
        },
        {
          prop: "carStatusName",
          label: "车辆状态",
          width: 140,
        },
        {
          prop: "certifiedStatusName",
          label: "认证状态",
          width: 140,
        },
        {
          prop: "applyTime",
          label: "申请时间",
          width: 180,
        },
        {
          prop: "passTime",
          label: "认证时间",
          width: 180,
        },
        {
          prop: "failureCountdown",
          label: "失效倒计时",
          width: 140,
        },
        {
          prop: "successTime",
          label: "汇报通过时间",
          width: 180,
        },
      ],
      // 表单数据
      tableData: [],
      carBrandName: "",
      carSeriesName: "",
      oldSeriesId: "",
      oldBrandId: "",
    };
  },
  methods: {
    getCertificateList() {
      this.loading = true;
      this.filterInfo.brandName = this.carBrandName;
      this.filterInfo.seriesName = this.carSeriesName;
      let params = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        buttonKey:this.$route.meta.buttonKey
      };
      for (var key in this.filterInfo) {
        if (this.filterInfo[key] !== "") {
          params[key] = this.filterInfo[key];
        }
      }
      
      this.$axios
        .post(this.pathItem.findCertificateList, params)
        .then((res) => {
          if (res.code == 0) {
            let r = res;
            this.tableData = res.result.records;
            this.totalElements = res.result.total;
          } else {
            this.$alert(res.message, "提示", {
              confirmButtonText: "确定",
              type: "error",
            });
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
    countDownDay(startday) {
      var startdate = new Date(startday.split(" ")[0]);
      var nowData = new Date();
      if (nowData - startdate >= 61 * 24 * 60 * 60 * 1000) {
        return "已过期";
      } else {
        var lastDay = Math.ceil((nowData - startdate) / 1000 / 60 / 60 / 24);
        return 61 - lastDay;
      }
    },

    brandChangeVal(selectName) {
      this.carBrandName = selectName.carBrandName;
      this.oldBrandId = selectName.carBrandId;
      this.filterInfo.brandName = this.carBrandName;
    },
    seriseChangeVal(selectName) {
      this.carSeriesName = selectName.carSeriesName;
      this.oldSeriesId = selectName.carSeriesId;
      this.filterInfo.seriesName = this.carSeriesName;
    },
    //每页条数改变时触发事件
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      tthis.handleCurrentChange(1);
    },
    //当前页码改变时触发事件
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCertificateList();
    },
    selectFilter() {
      this.handleCurrentChange(1);
    },
    resetFilter() {
      this.filterInfo = {
        brandName: "",
        seriesName: "",
        vin: "",
        certifiedStatus: "",
        failureCountdown: "",
        applyTimeStart: "",
        applyTimeEnd: "",
        passTimeStart: "",
        passTimeStart: "",
        certifiedNum: "",
      };
      this.carBrandName = "";

      this.carSeriesName = "";
      this.oldBrandId = "";
      this.oldSeriesId = "";
      this.handleCurrentChange(1);
    },
    applayCertifi() {
      this.$router.push({
        path: "/applyCertification",
      });
    },
    editCertifi(index, row) {
      this.$router.push({
        path: "/applyCertification",
        query: {
          id: row.id,
          vin: row.vin,
          carId: row.carId,
        },
      });
    },
    deleteInfo(index, row) {
      this.$confirm("是否删除该数据", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var params = {
            id: row.carId,
            cid: row.id,
            vin: row.vin,
            certifiedStatus: 0,
          };
          this.$axios
            .post(this.pathItem.certiSaveAndEdit, params)
            .then((res) => {
              if (res.code == 0) {
                let r = res;
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.getCertificateList();
              } else {
                this.$alert(res.message, "提示", {
                  confirmButtonText: "确定",
                  type: "error",
                });
              }
            })
            .catch((res) => {
              this.loading = false;
              this.$alert(res.message, "提示", {
                confirmButtonText: "确定",
                type: "error",
              });
            });
        })
        .catch(() => {});
    },
    undoApplay(index, row) {
      this.$confirm("是否撤销本次申请", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var params = {
            id: row.carId,
            cid: row.id,
            vin: row.vin,
            certifiedStatus: 5,
          };
          this.$axios
            .post(this.pathItem.certiSaveAndEdit, params)
            .then((res) => {
              if (res.code == 0) {
                let r = res;
                this.$message({
                  type: "success",
                  message: "撤销成功!",
                });
                this.getCertificateList();
              } else {
                this.$alert(res.message, "提示", {
                  confirmButtonText: "确定",
                  type: "error",
                });
              }
            })
            .catch((res) => {
              this.$alert(res.message, "提示", {
                confirmButtonText: "确定",
                type: "error",
              });
            });
        })
        .catch(() => {});
    },
    cancelCertification(index, row) {
      var params = {
        id: row.carId,
        cid: row.id,
        vin: row.vin,
        certifiedStatus: 7,
      };
      this.$confirm("是否要取消该车的认证标签", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .post(this.pathItem.certiSaveAndEdit, params)
            .then((res) => {
              if (res.code == 0) {
                let r = res;
                this.$message({
                  type: "success",
                  message: "取消成功!",
                });
                this.getCertificateList();
              } else {
                this.$alert(res.message, "提示", {
                  confirmButtonText: "确定",
                  type: "error",
                });
              }
            })
            .catch((res) => {
              this.$alert(res.message, "提示", {
                confirmButtonText: "确定",
                type: "error",
              });
            });
        })
        .catch(() => {});
    },
    downloadCertificate(index, row) {
      this.$router.push({
        path: "/downloadCertificate",
        query: {
          rid: row.id,
        },
      });
    },
    gotoReport(row) {
      this.$router.push({
        path: "/certificationReport",
        query: {
          id: row.id,
          vin: row.vin,
          carId: row.carId,
        },
      });
    },
    editReport(index, row) {
      this.$router.push({
        path: "/certificationReport",
        query: {
          id: row.id,
          vin: row.vin,
          carId: row.carId,
        },
      });
    },
    detailInfo(index, row) {
      this.$router.push({
        path: "/certificationDetails",
        query: {
          id: row.id,
          vin: row.vin,
          carId: row.carId,
        },
      });
    },
    toReoport(row) {
      this.$router.push({
        path: "/carExamineReport",
        query: {
          carId: row.carId,
          reportType: row.reportStatusLable,
        },
      });
    },
  },

  created() {
    this.buttonLimits = this.$route.meta.button;
    //  console.log(this.buttonLimits);
    this.getCertificateList();
  },
};
</script>

<style scoped lang="scss">
.certification {
  padding-bottom: 100px;
  .main-content {
    background-color: #fff;
    padding: 15px 30px;
    margin-bottom: 10px;
    font-size: 13px;
    &:first-child {
      margin-bottom: 0;
    }
    >>> .el-date-editor.el-input {
      width: 100%;
    }
    >>> .el-date-editor.el-input__inner {
      width: 100%;
    }
    .el-col-test {
      line-height: 28px;
      padding-right: 10px;
      text-align: right;
    }
    .apply-btn {
      margin-bottom: 20px;
    }
    .col-width {
      width: 41%;
    }
    .danger {
      color: #f56c6c;
    }
  }
}
</style>
