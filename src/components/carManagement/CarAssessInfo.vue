<template>
  <div class="carAssessInfo">
    <el-row class="info-header">
      <el-col :span="6">
        <span class="title">{{carInfo.reportStatusLable == 1 ?'初检' : '复检'}}时间：</span>
        {{ carInfo.reportStatusLable == 1? reportCarInfo.preliminaryTime : reportCarInfo.valuationTime}}
      </el-col>
      <el-col :span="4">
        <span class="title">评估师：</span>
        {{reportCarInfo.assessor}}
      </el-col>
      <el-col :span="14">
        <span class="title">评估师评语：</span>
        {{reportInfo ? reportInfo.commentReport :""}}
      </el-col>
    </el-row>
    <div class="divider-dashed"></div>
    <div v-for="secondReportItem in secondReport" :key="secondReportItem.id">
      <div class="subHead">{{secondReportItem.itemName}}</div>
      <el-table :data="getReportTableData(secondReportItem.id)" border v-loading="loading">
          <el-table-column type="index" width="80px" align="center" label="序号"></el-table-column>
        <el-table-column prop="itemNameAndDetail" label="项目名称" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="assessment" label="结果" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{scope.row.assessment == 1 ? '是' : '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bakItem" label="备注" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              plain
              @click="editRoleItem(scope.$index, scope.row)"
            >查看照片</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="图片" class="pic-dialog"  :visible.sync="dialogPicVisible">
      <el-image style="width: 80%;" :src="url" fit="fit"></el-image>
    </el-dialog>
  </div>
</template>
<script>
/*********************************************************************************************
 *                                车辆评估详情
 ** @function getAssessInfo() 获取评估内容
 ** @function getReportTableData(parentId) 筛选评估表格 @param parentId 父级评估id
 ** @function editRoleItem(selectName) 查看评估图片
 *
 *********************************************************************************************/
export default {
  props: {
    carInfo: "",
  },
  data() {
    return {
      loading: false,
      waterCarData: [
        {
          id: 1,
          projectName: "安全带根部是否正常",
          result: "异常",
          remark: "损害",
        },
      ],

      reportCarInfo: "",
      secondReport: [],
      thirdReport: [],
      reportInfo: "",
      url:"",
      dialogPicVisible:false
    };
  },
  watch: {
    carInfo(newval, oldVal) {
      if (newval) {
        this.getAssessInfo();
      }
    },
  },
  methods: {
    getAssessInfo() {
      this.loading =true
      this.$axios
        .post(this.pathItem.findItemAndCarBaseInfoByTypeAndCarId, {
          carId: this.carInfo.id,
          reportType: this.carInfo.reportStatusLable,
          // carId: 117,
          // reportType: 2,
        })
        .then((res) => {
          this.loading = false
          if (res.code == 0) {
            this.reportCarInfo = res.result.carBaseInfo;
            this.secondReport = res.result.twoList_result;
            this.thirdReport = res.result.threeList_result;
            this.reportInfo = res.result.reportComment;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((res) => {
          this.loading = false
          this.$message.error(res.message);
        });
    },
    getReportTableData(parentId) {
      var nowList = this.thirdReport.filter((item) => {
        return item.parentId == parentId;
      });
      return nowList;
    },
    editRoleItem(index, row) {
      if(row.urlItem){
        this.url = row.urlItem
        this.dialogPicVisible = true
      }else{
        this.url = "";
        this.$message.warning("暂无图片")
      }
    },
  },
  mounted() {
    this.getAssessInfo();
  },
  created() {
 
  },
};
</script>
<style lang="scss" scoped>
.carAssessInfo {
  padding-top: 10px;
  .info-header {
    font-size: 18px;
    .title {
      font-weight: bold;
    }
  }
  .subHead {
    margin-top: 20px;
  }
  .divider-dashed {
    margin: 20px 0;
    border: 1px dashed #ebeef5;
  }
  .pic-dialog{
    >>>.el-dialog__body{
      text-align: center;
    }
  }
}
</style>