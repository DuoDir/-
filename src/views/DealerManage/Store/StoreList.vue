<template>
  <el-container class="StoreList">
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
          <el-col class="el-col-test" :span="2">专营店编号:</el-col>
          <el-col :span="3">
            <el-input v-model="searchForm.number" clearable maxlength="8" autocomplete="off" size="mini" @input="handlemoney($event, 'number')" placeholder="请输入内容"></el-input>
          </el-col>
          <el-col class="el-col-test" :span="2">专营店名称:</el-col>
          <el-col :span="3">
            <el-input v-model="searchForm.GroupName" clearable maxlength="30" autocomplete="off" size="mini" placeholder="请输入内容"></el-input>
          </el-col>
          <el-col class="el-col-test" :span="2">所在城市:</el-col>
          <el-col :span="3">
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
            <!-- <el-cascader ref="gaga" v-model="searchForm.ProvinceCity" :options="ProvinceCityOptions" @active-item-change="getCity($event)" size="mini"/> -->
          </el-col>
          <el-col class="el-col-test" :span="2">门店类型:</el-col>
          <el-col :span="3">
            <el-select v-model="searchForm.storeProperties" size="mini">
              <el-option label="专营店" value=""></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="el_row">
          <el-col class="el-col-test" :span="2">经营范围:</el-col>
          <el-col :span="3">
            <el-select v-model="searchForm.businessScope" clearable size="mini">
              <el-option label="置换业务" value="1"></el-option>
              <el-option label="认证业务" value="2"></el-option>
            </el-select>
          </el-col>
          <el-col class="el-col-test" :span="2">状态:</el-col>
          <el-col :span="3">
            <el-select v-model="searchForm.operatingStatus" clearable size="mini">
              <el-option label="运营" value="1" />
              <el-option label="终止" value="2" />
            </el-select>
          </el-col>
        </el-row>
      </el-row>
      <!-- 操作按钮 -->
      <el-header class="header">
        <span>专营店列表</span>
        <div style="float:right;">
          <el-button v-if="buttonLimits.includes(96)" type="primary" icon="el-icon-plus" @click="jumpPerson">新增人员</el-button>
        </div>
      </el-header>
      <!-- 专营店列表 -->
      <div style="padding: 15px 30px;">
        <el-table v-loading="loading" :data="tableData" class="tableBtn" border style="width: 100%;">
          <el-table-column prop="number" label="专营店号"></el-table-column>
          <el-table-column prop="organizationName" label="专营店名称"></el-table-column>
          <el-table-column prop="parentName" label="所属集团"></el-table-column>
          <el-table-column label="所在城市">
            <template slot-scope='{row}'>
              <span>{{row.provinceName}} - {{row.cityName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="店面性质">专营店</el-table-column>
          <el-table-column label="经营范围">
            <template slot-scope='{row}'>
              <span v-show="row.replacementBusiness==1">置换业务</span>
              <span v-show="row.certificationBusiness==1">认证业务</span>
            </template>
          </el-table-column>
          <el-table-column prop="operatingStatus" label="状态">
            <template slot-scope='{row}'>
              <span v-show="!row.operatingStatus">待完善</span>
              <span v-show="row.operatingStatus==1">运营</span>
              <span v-show="row.operatingStatus==2">终止</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="账号状态">
            <template slot-scope='{row}'>
              <span v-show="row.status==1">开启</span>
              <span v-show="row.status==2">禁用</span>
            </template>
          </el-table-column>
          <el-table-column min-width="130px" label="操作">
            <template slot-scope='{row}'>
              <el-button v-if="buttonLimits.includes(97)" type="primary" @click="jumpDetail(row)" plain icon="el-icon-document" size="mini">详情</el-button>
              <el-button v-if="buttonLimits.includes(98)&&row.operatingStatus!=2" type="warning" @click="jumpEdit(row)" plain icon="el-icon-edit" size="mini">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="page-box" style="height: 150px;">
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
 ** @function add  跳转 -> 新增集团
 ** @function infoConfirm 信息确认
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
      tableData: [],
      currentPage: 1,
      pageNo: 1,
      pageSizes: [5, 10, 15, 20],
      total: 0,
      pageSize: 10,
      loading: false,
      ProvinceOptions: [],
      CityOptions: [],
      searchForm: {
        number: "",
        GroupName: "",
        provinceId: [],
        cityId: [],
        parentId: "",
        storeProperties: "",
        businessScope: "",
        operatingStatus: "",
      },
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
  mounted() {
    this.buttonLimits = this.$route.meta.button; //根据buttonKey判断按钮权限
    console.log(this.buttonLimits);
    this.getProvince();
    this.load();
  },
  methods: {
    // 获取省
    getProvince() {
      this.$axios.post(this.pathItem.querySystemCityList, {}).then((res) => {
        if (res.code == 0) {
          this.ProvinceOptions = res.result.systemCityList;
        } else {
          this.errorMsg(res.message);
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
        } else {
          this.errorMsg(res.message)
        }
      });
    },
    // 列表加载
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
          replacementBusiness: this.searchForm.businessScope==1?'1':'',
          certificationBusiness: this.searchForm.businessScope==2?'1':'',
          operatingStatus: this.searchForm.operatingStatus
        }
      }
      this.$axios.post(this.pathItem.queryDealerPage,params)
      .then(res=>{
        this.loading = false
        if (res.code == 0) {
          this.tableData = res.result.records;
          this.total = res.result.total;
        } else {
          this.errorMsg(res.message);
        }
      });
    },
    // 查询
    search() {
      this.currentPage = 1;
      this.pageNo = 1;
      this.load();
    },
    // 清空
    clear() {
      this.searchForm = {
        number: "",
        GroupName: "",
        provinceId: [],
        cityId: [],
        parentId: "",
        storeProperties: "",
        businessScope: "",
        operatingStatus: "",
      };
    },
    // 新增人员
    jumpPerson() {
      this.$router.push({
        path: "/personAdd",
      });
    },
    // 详情
    jumpDetail(row) {
      this.$router.push({
        path: "/StoreDetail",
        query: {
          id: row.id,
          parentId: row.parentId,
        },
      });
    },
    // 编辑
    jumpEdit(row) {
      this.$router.push({
        path: "/StoreEdit",
        query: {
          id: row.id,
          number: row.number,
        },
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
    // 纯数字
    handlemoney(eve, name) {
      let neweve = eve.replace(/[^\d.]/g, "");
      this.searchForm[name] = neweve;
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
.StoreList {
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
.w8 {
  width: 80%;
}
.w9 {
  width: 90%;
}
/* 表格样式 */
.tableBtn .el-button {
  margin: 5px;
}
.upload-demo {
  display: inline-block;
}
.StoreList >>> .el-input.is-disabled .el-input__inner {
  color: #000000;
}
</style>