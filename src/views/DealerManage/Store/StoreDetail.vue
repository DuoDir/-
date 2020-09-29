<template>
  <el-container class="GroupDetail" v-loading="loading">
    <el-header class="header">
      <span>专营店详情</span>
    </el-header>
    <el-main>
      <div class='pageTitle'>{{orderInfo.organizationName}}</div>
      <table class="table-vertical">
        <tr><td class="column">集团全称</td> <td>{{orderInfo.organizationName}}</td> <td class="column">集团简称</td> <td>{{orderInfo.shortName}}</td> <td class="column">集团地址</td> <td>{{orderInfo.provinceName}}{{orderInfo.cityName}}{{orderInfo.CountyName}}{{orderInfo.address}}</td></tr>
        <tr><td class="column">负责人</td> <td>{{orderInfo.principalName}}</td> <td class="column">联系电话</td> <td>{{orderInfo.storeMobile}} {{orderInfo.phoneNumber}}</td> <td class="column"></td> <td></td></tr>
      </table>

      
      <el-row style="width: 90%;margin:30px auto;">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="专营店信息" name="1">
            <table class="table-vertical" style="width: 100%;">
              <tr><td class="column">专营店号</td> <td>{{StoreInfo.number}}</td> <td class="column">店面性质</td> <td>专营店</td> <td class="column">所属集团</td> <td>{{StoreInfo.parentName}}</td></tr>
              <tr><td class="column">组织类型</td> <td><span v-show="StoreInfo.storeType==1">集团</span><span v-show="StoreInfo.storeType==2">经销商门店</span></td> <td class="column">门店全称</td> <td>{{StoreInfo.organizationName}}</td> <td class="column">门店简称</td> <td>{{StoreInfo.shortName}}</td></tr>
              <tr><td class="column">营业地址</td> <td>{{StoreInfo.provinceName}}{{StoreInfo.cityName}}{{StoreInfo.CountyName}}{{StoreInfo.address}}</td> <td class="column">店内邮箱</td> <td>{{StoreInfo.email}}</td> <td class="column">营业时间</td> <td>{{StoreInfo.startTime}}--{{StoreInfo.endTime}}</td></tr>
              <tr><td class="column">合作时间</td> <td>{{StoreInfo.cooperationTime}}</td> <td class="column">店总经理</td> <td>{{StoreInfo.principalName}}</td> <td class="column">联系电话</td> <td>{{StoreInfo.storeMobile}} {{StoreInfo.phoneNumber}}</td></tr>
              <tr><td class="column">银行账户</td> <td>{{StoreInfo.bankAccount}}</td> <td class="column">开户银行</td> <td>{{StoreInfo.bankName}}</td> <td class="column">联行号</td> <td>{{StoreInfo.bankRelationNo}}</td></tr>
              <tr><td class="column">营业执照</td> <td><span class="link" @click="LookImg">查看</span></td> <td class="column">经营范围</td> <td><span v-show="StoreInfo.replacementBusiness==1">置换业务</span> <span v-show="StoreInfo.certificationBusiness==1">认证业务</span></td> <td class="column">状态</td> <td><span v-show="StoreInfo.operatingStatus==1">运营</span><span v-show="StoreInfo.operatingStatus==2">终止</span></td></tr>
              <tr><td class="column">创建时间</td> <td>{{StoreInfo.createdAt}}</td> <td class="column"></td> <td></td> <td class="column"></td> <td></td></tr>

            </table>
          </el-tab-pane>
          <el-tab-pane label="人员信息" name="2">
              <el-table v-loading="personLoad" :data="personTable" border style="width: 100%">
                <el-table-column prop="userName" label="姓名"> </el-table-column>
                <el-table-column prop="mobile"   label="手机号"> </el-table-column>
                <el-table-column prop="postName" label="岗位"> </el-table-column>
                <el-table-column prop="rolaName" label="角色"> </el-table-column>
                <el-table-column label="状态">
                  <template slot-scope='{row}'>
                    <span v-show="row.jobStatus==1">在职</span>
                    <span v-show="row.jobStatus==2">离职</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="{row}">
                    <el-button type="text" size="small" @click="jumpDetail(row)">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            <!-- 分页 -->
            <div class="page-box" style="height: 150px;">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page.sync="currentPage" :page-sizes="[5,10,15,20]" :page-size="pageSize"
              layout="total, prev, pager, next, sizes, jumper" :total="total">
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-row>
      <el-image-viewer
        v-if="showViewer"
        :on-close="closeViewer"
        :url-list="lookImgList" />
    </el-main>
  </el-container>
</template>
<script>
/*********************************************************************************************
 **                                  集团详情数据方法说明 
 ** @function echo 回显信息
 ** @function jumpDetail(num) 跳转详情  1 专营店  2 人员
 ** @function lookImg 查看照片
 
 *********************************************************************************************/
// 导入组件
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  data() {
    return {
      id: '',
      parentId: '',
      orderInfo: {},
      StoreInfo: {},
      personTable: [],
      lookImgList: [],
      showViewer: false,
      editAccountModel: false,
      Accountstatus: false,
      activeName: '1',
      formLabelWidth: '120px',
      editform: {c:''},
      loading: false,
      personLoad: false,
      currentPage: 1,
      pageNo: 1,
			total: 0,
      pageSize: 10,
    }
  },
  components: { ElImageViewer },
  watch: {
    activeName: {
      handler(val) {
        this.currentPage = 1
        this.pageNo = 1
        this.pageSize = 10
        this.total = 0
        this.load()
      }
    },
    editAccountModel(val) {
      if (val == false) {
        this.editform.c = ''
        this.$refs['editforms'].resetFields();
      }
    }
  },
  created() {
    this.id = this.$route.query.id
    this.parentId = this.$route.query.parentId
  },
  mounted() {
    this.Groupecho()
    this.load()
  },
  methods: {
    // 选项卡 列表查询
    load() {
      if (this.activeName == '1') { // 专营店
          var url = this.pathItem.querySystemOrganizationDealer
          var params = {
              id: this.id
          }
        } else if (this.activeName == '2') { // 人员
          this.personLoad = true
          var url = this.pathItem.querySystemUserInfoDealersPage
          var params = {
            pageNum: this.pageNo,
            pageSize: this.pageSize,
            systemUserInfoDealers: {
              organizationId: this.id
            }
          }
        }
      this.$axios.post(url,params)
        .then(res=>{
          if(res.code == 0){
            if (this.activeName == 1) {
              this.StoreInfo = res.result
              this.StoreInfo.createdAt = this.timestampToTime(res.result.createdAt)
              if (res.result.businessLicense&&res.result.businessLicense != '') {
                let businessLicense = res.result.businessLicense.split(',')
                businessLicense.forEach( item => {
                  this.lookImgList.push(item)
                })
              }
            } else if (this.activeName == 2) {
              this.personLoad = false
              this.personTable = []
              this.personTable.push(...(res.result.records))
            }
            this.total = res.result.total
          } else {
            this.personLoad = false
            this.errorMsg(res.message);
          }
        })
    },
    // 集团信息回显
    Groupecho() {
      this.loading = true
      this.$axios.post(this.pathItem.querySystemOrganizationDealer,{id:this.parentId})
      .then(res=>{
        this.loading = false
        if(res.code == 0){
          this.orderInfo = res.result
        } else {
          this.errorMsg(res.message);
        }
      })
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 查看图片
    LookImg() {
      if (this.lookImgList.length == 0) {
        this.errorMsg("没有图片")
        return;
      }
      this.showViewer = true
    },
    // 关闭图片查看器
    closeViewer() {
      this.showViewer = false
    },
    // 跳转人员详情
    jumpDetail(row) {
      this.$router.push({
        path: '/personDetail',
        query: {
          id: row.id
        }
      })
    },
    handleSizeChange(val){ 
			this.pageSize = val;
			this.load();
		},
		handleCurrentChange(val){ 
			this.pageNo = val;
			this.load();
    },
    // 时间戳转换时间
    timestampToTime(t) {
      if (t == null || t == '') {return ''}
      var date = new Date(t) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-"
      var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-"
      var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
      // var h = date.getHours() < 10 ? "0" + date.getHours() + ":" : date.getHours() + ":"
      // var m = date.getMinutes() < 10 ? "0" + date.getMinutes() + ":" : date.getMinutes() + ":"
      // var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
      return Y + M + D;
    },
    // 错误提醒	
    errorMsg(msg) {this.$alert(msg, '提示', {confirmButtonText: '确定',type:'warning',})},
    // 成功提醒	
    successMsg(msg) {this.$message({message:msg, type:'success'})},
  }
}
</script>
<style lang="scss" scoped>
  .GroupDetail{
    background: #fff;
    .pageTitle{
      width: 90%;
      margin: 0 auto;
      margin-top: 20px;
      margin-bottom: 20px;
      font-size: 23px;
    }
    .table-vertical{
      width: 90%;
      margin: 0 auto;
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
    & /deep/ .el-icon-circle-close {
      color: white;
    }
  }
  .el-main{
    font-size: 14px;
  }
  .el_row{
    line-height: 32px;
    margin-bottom: 10px;
  }
  .name{
    width: 120px;
    margin-right: 5px;
    text-align: right;
    display: inline-block;
  }
  .link{
    cursor: pointer;
    color: #409eff;
  }
  .w8{
    width:80%;
  }
</style>