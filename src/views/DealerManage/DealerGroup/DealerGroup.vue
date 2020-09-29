<template>
  <el-container class="DealerGroup">
    <!-- 信息筛选 -->
    <el-header class="header">
      <span>信息筛选</span>
      <div style="float:right;">
        <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="clear" plain icon="el-icon-delete">清空</el-button>
      </div>
    </el-header>
    <el-main>
      <!-- 筛选内容 -->
      <el-row class="main-content">
        <el-row class="el_row">
          <el-col class="el-col-test" :span="2">集团编号:</el-col>
          <el-col :span="3">
            <el-input v-model="searchForm.number" clearable maxlength="30" autocomplete="off" size="mini" placeholder="请输入内容"></el-input>
          </el-col>
          <el-col class="el-col-test" :span="2">集团名称:</el-col>
          <el-col :span="3">
            <el-input v-model="searchForm.GroupName" clearable maxlength="30" autocomplete="off" size="mini" placeholder="请输入内容"></el-input>
          </el-col>
          <el-col class="el-col-test" :span="2">所在城市:</el-col>
          <el-col :span="3">
            <!-- <el-cascader ref="gaga" v-model="searchForm.ProvinceCity" :options="ProvinceCityOptions" @active-item-change="getCity($event)" size="mini"/> -->
            <el-col :span="12">
              <el-select v-model="searchForm.provinceId" @change="getCity(searchForm.provinceId[searchForm.provinceId.length-1])" multiple collapse-tags size="mini" placeholder="省">
                <el-option v-for="item in ProvinceOptions" :label="item.name" :value="item.code" :key="item.code"/>
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-select v-model="searchForm.cityId" multiple collapse-tags size="mini" :disabled="searchForm.provinceId.length>1" placeholder="市">
                <el-option v-for="item in CityOptions" :label="item.name" :value="item.code" :key="item.code"/>
              </el-select>
            </el-col>
          </el-col>
          <el-col class="el-col-test" :span="2">状态:</el-col>
          <el-col :span="3">
            <el-select v-model="searchForm.operatingStatus" clearable size="mini" placeholder="全部">
              <el-option label="运营" value="1" />
              <el-option label="终止" value="2" />
            </el-select>
          </el-col>
        </el-row>
      </el-row>
      <!-- 操作按钮 -->
      <el-header class="header">
        <span>经销商集团列表</span>
        <div style="float:right;">
          <el-button v-if="buttonLimits.includes(92)" type="primary" @click="jumpPerson" icon="el-icon-plus">新增人员</el-button>
        </div>
      </el-header>
      <!-- 经销商集团列表 -->
      <div style="padding: 15px 30px;">
        <el-table v-loading="loading" :data="tableData" class="tableBtn" border style="width: 100%;">
          <el-table-column prop="number" label="集团编号"></el-table-column>
          <el-table-column prop="organizationName" label="集团名称"></el-table-column>
          <el-table-column label="所在城市">
            <template slot-scope='{row}'>
              <span>{{row.provinceName}} - {{row.cityName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="specialtyStoresNumber" label="所有专营店"></el-table-column>
          <el-table-column prop="groupPersonnel" label="集团人员"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope='{row}'>
              <span v-show="row.isPerfect==0">待完善</span>
              <span v-show="row.isPerfect==1&&row.operatingStatus==1">运营</span>
              <span v-show="row.isPerfect==1&&row.operatingStatus==2">终止</span>
            </template>
          </el-table-column>
          <el-table-column label="账号状态">
            <template slot-scope='{row}'>
              <span v-show="row.status==1">开启</span>
              <span v-show="row.status==2">禁用</span>
            </template>
          </el-table-column>
          <el-table-column min-width="130px" label="操作">
            <template slot-scope='{row}'>
              <el-button v-if="buttonLimits.includes(93)" type="primary" @click="jumpDetail(row.id)" plain icon="el-icon-document" size="mini">详情</el-button>
              <el-button v-if="buttonLimits.includes(94)&&row.operatingStatus!=2" type="warning" @click="jumpEdit(row.id,row.number)" plain icon="el-icon-edit" size="mini">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="page-box block float-right" style="height: 150px;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="pageSizes" :page-size="pageSize" layout="total, prev, pager, next, sizes, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-main>
  </el-container>
</template>
<script>
/*********************************************************************************************
 **                                  经销商集团数据方法说明
 ** @function load 加载列表
 ** @function search 查询列表
 ** @function addCheck  新增保存检测
 ** @function addSave  新增集团保存
 ** @function edit 跳转 -> 编辑集团
 ** @function detail 跳转 -> 集团详情
 ** @function dele 删除
 ** @function clear 清空
 ** @function delePoint 删除提示
 ** @function dele 删除
 ** @function dele 删除
 *********************************************************************************************/
export default {
  data() {
    return {
      buttonLimits: [],
      rowData: {},
      searchForm: {
        number: "",
        GroupName: "",
        provinceId: [],
        cityId: [],
        operatingStatus: "",
      },
      tableData: [],
      currentPage: 1,
      pageNo: 1,
      pageSizes: [5, 10, 15, 20],
      total: 0,
      pageSize: 10,
      ProvinceOptions: [],
      CityOptions: [],
      formLabelWidth: "120px",
      loading: false,
    };
  },
  watch: {
    "searchForm.provinceId"(val) {
      console.log(val);
      if (val.length > 1) {
        this.searchForm.cityId = [];
      }
    },
  },
  created() {
    this.buttonLimits = this.$route.meta.button; //根据buttonKey判断按钮权限
    console.log(this.buttonLimits);
  },
  mounted() {
    this.load();
    this.getProvince();
  },
  methods: {
    // 加载列表
    load() {
      this.loading = true;
      let params = {
        pageNum: this.pageNo,
        pageSize: this.pageSize,
        systemOrganizationDealers: {
          number: this.searchForm.number,
          organizationName: this.searchForm.GroupName,
          provinceIdList: this.searchForm.provinceId,
          cityIdList: this.searchForm.cityId,
          operatingStatus: this.searchForm.operatingStatus
        }
      }
			this.$axios.post(this.pathItem.querySystemOrganizationDealersPage,params)
      .then(res=>{
        this.loading = false
        if(res.code == 0){
          this.tableData = res.result.records
          this.total =  res.result.total
        }else{
          this.errorMsg(res.message);
        }
      })
    },
    // 查询
    search() {
      this.currentPage = 1;
      this.pageNo = 1;
      this.load();
    },
    // 获取省
    getProvince() {
      this.$axios.post(this.pathItem.querySystemCityList, {}).then((res) => {
        if (res.code == 0) {
          this.ProvinceOptions = res.result.systemCityList;
        }
      });
    },
    // 获取市
    getCity(id) {
      this.CityOptions = []
      this.searchForm.cityId = []
      this.$axios.post(this.pathItem.querySystemCityList,{parentId:id}).then((res) => {
        if (res.code == 0) {
          this.CityOptions = res.result.systemCityList
        }
      })
    },
    //清空条件
    clear() {
      this.searchForm = {
        number: "",
        GroupName: "",
        provinceId: [],
        cityId: [],
        operatingStatus: "",
      };
    },
    // 新增人员
    jumpPerson() {
      this.$router.push({
        path: "/personAdd",
      });
    },
    // 集团详情
    jumpDetail(id) {
      this.$router.push({
        path: "/GroupDetail",
        query: { id: id },
      });
    },
    // 集团编辑
    jumpEdit(id, num) {
      this.$router.push({
        path: "/GroupEdit",
        query: { id: id, groupNum: num },
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.load();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.load();
    },
    // 时间戳转换时间
    timestampToTime(t) {
      if (t == null || t == "") {
        return "";
      }
      var date = new Date(t); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      // var h = date.getHours() < 10 ? "0" + date.getHours() + ":" : date.getHours() + ":"
      // var m = date.getMinutes() < 10 ? "0" + date.getMinutes() + ":" : date.getMinutes() + ":"
      // var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
      return Y + M + D;
    },
    // 错误提醒
    errorMsg(msg) {
      this.$alert(msg, "提示", { confirmButtonText: "确定", type: "warning" });
    },
    // 成功提醒
    successMsg(msg) {
      this.$message({ message: msg, type: "success" });
    },
  },
};
</script>
<style lang="scss" scoped>
.DealerGroup {
  background: #fff;
  .main-content {
    padding: 15px 30px;
    margin-bottom: 10px;
    font-size: 13px;
    .el-col-test {
      padding-right: 10px;
      text-align: right;
    }
  }
}
.el_row {
  line-height: 32px;
  margin-bottom: 10px;
}
.el-main {
  font-size: 14px;
}
.mt15 {
  margin-top: 15px;
}
.w6 {
  width: 60%;
}
.w8 {
  width: 80%;
}
.w9 {
  width: 90%;
}
.DealerGroup >>> .el-input.is-disabled .el-input__inner {
  color: #000000;
}
/* 表格样式 */
.tableBtn .el-button {
  margin: 5px;
}
.upload-demo {
  display: inline-block;
}
</style>