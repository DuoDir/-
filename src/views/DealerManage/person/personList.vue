<template>
  <el-container class="personList">
    <el-main>
      <el-header class="header">
        <span>人员列表</span>
        <div style="float:right;">
          <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
          <el-button type="primary" @click="resetSearch" plain icon="el-icon-delete">清空</el-button>
        </div>
      </el-header>
      <!-- 查询条件 -->
      <el-row class="main-content">
        <el-row class="el_row" :gutter="10">
          <el-col :span="5">
            <el-col class="el-col-test" :span="10">工号:</el-col>
            <el-col :span="14">
              <el-input
                v-model="searchForm.jobNumber"
                clearable
                maxlength="30"
                size="mini"
                placeholder="请输入工号"
              ></el-input>
            </el-col>
          </el-col>
          <el-col :span="5">
            <el-col class="el-col-test" :span="10">姓名:</el-col>
            <el-col :span="14">
              <el-input
                v-model="searchForm.userName"
                clearable
                maxlength="30"
                size="mini"
                placeholder="请输入姓名"
              ></el-input>
            </el-col>
          </el-col>
          <el-col :span="5">
            <el-col class="el-col-test" :span="10">职位:</el-col>
            <el-col :span="14">
              <el-select v-model="searchForm.postId" size="mini" clearable>
                <el-option
                  v-for="postItem in postList"
                  :label="postItem.name"
                  :value="postItem.id"
                  :key="postItem.id"
                ></el-option>
              </el-select>
            </el-col>
          </el-col>
          <el-col :span="5">
            <el-col class="el-col-test" :span="10">状态:</el-col>
            <el-col :span="14">
              <el-select v-model="searchForm.status" size="mini" clearable>
                <el-option label="开启" value="1"></el-option>
                <el-option label="禁用" value="2"></el-option>
              </el-select>
            </el-col>
          </el-col>
        </el-row>
      </el-row>
      <!-- 操作按钮 -->
      <el-header class="header">
        <span>人员列表</span>
        <div style="float:right;">
          <el-button v-if="buttonLimits.includes(100)" type="primary" @click='addPerson' icon="el-icon-plus">新增人员</el-button>
          <el-button v-if="buttonLimits.includes(101)" type="primary" @click='chooseMember'icon="el-icon-refresh">选择组员</el-button>
        </div>
      </el-header>
      <!-- 列表 -->
      <el-row class="main-content" v-loading="tableloading">
        <el-table :data="tableData" class="tableBtn" border style="width: 100% ;margin-top:20px">
          <el-table-column prop="jobNumber" label="工号"></el-table-column>
          <el-table-column prop="userName" label="姓名"></el-table-column>
          <el-table-column prop="mobile" label="手机号"></el-table-column>
          <el-table-column prop="sex" :formatter="formatSex" label="性别"></el-table-column>
          <el-table-column prop="thisCompany" label="所在单位"></el-table-column>
          <el-table-column prop="postName" label="岗位"></el-table-column>
          <el-table-column prop="rolaName" label="角色"></el-table-column>
          <el-table-column prop="jobStatus" :formatter="formatjobState" label="状态"></el-table-column>
          <el-table-column prop="status" :formatter="formatStatus" label="账号状态"></el-table-column>
          <el-table-column prop="entryTime" label="入职时间"></el-table-column>
          <el-table-column prop="resignationTime" label="离职时间"></el-table-column>
          <el-table-column min-width="110px" label="操作">
            <template slot-scope="{row}">
              <el-button v-if="buttonLimits.includes(102)" type="primary" @click="jumpDetail(row.id)" plain size="mini" icon="el-icon-document">详情</el-button>
              <el-button v-if="buttonLimits.includes(103)&&row.status!=3" type="warning" @click="jumpEdit(row.id)"   plain size="mini" icon="el-icon-edit">编辑</el-button>
              <el-button v-if="buttonLimits.includes(104)&&row.status!=3" type="success" @click="changeFun(row.id,1)"  plain size="mini" icon="el-icon-refresh">岗位调动</el-button>
              <el-button v-if="buttonLimits.includes(105)&&row.status!=3" type="success" @click="changeFun(row.id,2)"  plain size="mini" icon="el-icon-refresh">单位调动</el-button>
              <el-button v-if="buttonLimits.includes(106)&&row.status!=3" type="danger" @click="leaveDialog=true,rowid=row.id,jobStatus=row.jobStatus"   plain size="mini" icon="el-icon-warning-outline">离职</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="page-box" style="height: 150px;">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page.sync="currentPage" :page-sizes="pageSizes" :page-size="pageSize"
          layout="total, prev, pager, next, sizes, jumper" :total="total">
          </el-pagination>
        </div>
      </el-row>

      <!-- 岗位/单位 调动弹出框 -->
      <el-dialog :title="changeDialogType==1?'岗位调动':'单位调动'" class="dialogStyle" :visible.sync="changeDialog" width="30%">
        <el-form>
          <el-form-item v-if="changeDialogType==1" label="岗位:" label-width="120px" :required="true">
            <el-select class="w8" v-model="newPost">
              <el-option
                v-for="item in newPostList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-else label="新单位:" label-width="120px" :required="true">
            <el-select class="w8" v-model="newUnit">
              <el-option
                v-for="item in newUnitList"
                :key="item.id"
                :label="item.organizationName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-row>
          <el-button type="primary" @click="changeSave(changeDialogType)">保存</el-button>
          <el-button @click="changeDialog=false">取消</el-button>
        </el-row>
      </el-dialog>
      <!-- 离职模态框 -->
      <el-dialog title="离职" class="dialogStyle" :visible.sync="leaveDialog" width="30%">
        <el-form>
          <el-form-item label="离职原因:" label-width="120px" :required="true">
            <el-input type="textarea" class="w8" v-model="leaveBak" maxlength="30" placeholder="请输入内容" style="resize: none"></el-input>
          </el-form-item>
          <div class="red" style="text-align:center;">离职后，同步注销登录账号</div>
        </el-form>
        <el-row class="center">
          <el-button type="primary" @click="leaveSave">确认离职</el-button>
          <el-button @click="leaveDialog=false">取消</el-button>
        </el-row>
      </el-dialog>
      <!-- 选择组员模态框 -->
      <el-dialog title="选择组员" class="dialogStyle" :visible.sync="chooseMemberDialog">
        <el-table v-loading="loading" :data="memberTable" class="tableBtn" border style="width: 100% ;margin-top:20px">
          <el-table-column align="center">
            <template slot-scope='{row}'>
              <el-checkbox v-model="row.flag" @change="addCheckedList(row)"/>
            </template> 
          </el-table-column>
          <el-table-column prop="userName" label="姓名"></el-table-column>
          <el-table-column prop="mobile" label="手机号"></el-table-column>
          <el-table-column prop="postName" label="岗位"></el-table-column>
          <el-table-column prop="rolaName" label="角色"></el-table-column>
          <el-table-column prop="jobStatus" :formatter="formatjobState" label="状态"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="page-box" style="height: 50px;">
          <el-pagination @size-change="memberhandleSizeChange" @current-change="memberhandleCurrentChange"
          :current-page.sync="membercurrentPage" :page-sizes="memberpageSizes" :page-size="memberpageSize"
          layout="total, prev, pager, next, sizes, jumper" :total="membertotal">
          </el-pagination>
        </div>
        <el-row class="center">
          <el-button type="primary" @click="memberSave">确认</el-button>
          <el-button @click="chooseMemberDialog=false">取消</el-button>
        </el-row>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      buttonLimits: [],
      // 查询条件
      searchForm: {
        jobNumber: '',
        userName: '',
        postId: '',
        status: ''
      },
      rowid: '', // 列表id
      jobStatus: '', // 列表职位状态
      newUnit: '', // 新单位
      newPost: '', // 新岗位
      leaveBak: '', //离职原因
      // 下拉
      firstorg: [],
      secondOrg: [],
      postList: [],
      newUnitList: [],
      newPostList: [],
      // 列表
      tableData: [],
      currentPage: 1,
      pageNo: 1,
      pageSizes: [5,10,15,20],
      total: 0,
      pageSize: 10,
      // 选择组员
      memberTable: [],
      membercurrentPage: 1,
      memberpageNo: 1,
      memberpageSizes: [5,10,15,20],
      membertotal: 0,
      memberpageSize: 5,
      //选择组员数据
      middledata: [], // 暂存数据
      enddata: [],
      // dialog数据
      changeDialogType: '',
      changeDialog: false,
      leaveDialog: false,
      chooseMemberDialog: false,
      loading: false,
      tableloading: false
    }
  },
  created() {
    this.buttonLimits = this.$route.meta.button //根据buttonKey判断按钮权限
    console.log(this.buttonLimits)
  },
  mounted() {
    this.load();
    this.quserySystemPostDealersList() // 岗位下拉
    this.queryGroupList() // 单位下拉
  },
  watch: {
    changeDialog(val) { // 清空岗位 单位
      if (val == false) {
        this.newUnit = ''
        this.newPost = ''
      }
    },
    leaveDialog(val) { // 清空离职原因
      if (val == false) {
        this.leaveBak = ''
      }
    },
    chooseMemberDialog(val) { // 选择组员 模态框 清空 暂存组员list
      if (val == false) {
        this.middledata = []
      }
    }
  },
  methods: {
    // 加载列表
    load() {
      this.tableloading = true
      var params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        systemUserInfoDealers: {
          ...this.searchForm
        },
      };
      this.$axios
        .post(this.pathItem.querySystemUserInfoDealersMenuPage, params)
        .then((res) => {
          this.tableloading = false
          if (res.code == 0) {
            this.tableData = res.result.records;
            this.total = res.result.total;
          } else {
            this.$message("error", res.message);
          }
        })
        .catch((res) => {
          this.$message("error", res.message);
        });
    },
    // 获取岗位下拉
    quserySystemPostDealersList() {
      this.$axios.post(this.pathItem.quserySystemPostDealersList, {})
        .then((res) => {
          if (res.code == 0) {
            this.newPostList = res.result.systemPostDealersList
            this.postList = res.result.systemPostDealersList
          } else {
            this.errorMsg(res.message)
          }
        })
        .catch((res) => {
          this.errorMsg(res.message)
        });
    },
    // 获取岗位下拉
    queryGroupList() {
      this.$axios.post(this.pathItem.queryGroupList, {})
        .then((res) => {
          if (res.code == 0) {
            this.newUnitList = res.result.systemOrganizationDealersList
          } else {
            this.errorMsg(res.message)
          }
        })
        .catch((res) => {
          this.errorMsg(res.message)
        });
    },
    // 调动保存
    changeSave(eve) {
      let params = {}
      let postName = ''
      let UnitName = ''
      if (eve == 1) {
        if (this.newPost == '') {
          this.errorMsg("请选择岗位")
          return;
        }
        this.newPostList.forEach(item => {
          if (item.id == this.newPost) {
            postName = item.name
          }
        })
        params = {id: this.rowid,postId: this.newPost,postName: postName}
      } else {
        if (this.newUnit == '') {
          this.errorMsg("请选择单位")
          return;
        }
        this.newUnitList.forEach(item => {
          if (item.id == this.newUnit) {
            UnitName = item.organizationName
          }
        })
        params = {id: this.rowid,organizationId: this.newUnit,thisCompany: UnitName}
      }
      this.$axios.post(this.pathItem.updateupDealerUserInfo, params)
        .then((res) => {
          if (res.code == 0) {
            this.successMsg("修改成功")
            this.changeDialog = false
            this.load()
          } else {
            this.errorMsg(res.message)
          }
        })
        .catch((res) => {
          this.errorMsg(res.message)
        });
    },
    // 离职保存
    leaveSave() {
      if (this.leaveBak == '') {
        this.errorMsg("请填写离职原因")
        return;
      }
      this.$axios.post(this.pathItem.dimission, {id: this.rowid,leaveReason: this.leaveBak,jobStatus: this.jobStatus})
        .then((res) => {
          if (res.code == 0) {
            this.successMsg("修改成功")
            this.leaveDialog = false
            this.load()
          } else {
            this.errorMsg(res.message)
          }
        })
        .catch((res) => {
          this.errorMsg(res.message)
        });
    },
    // 打开选择组员模态框
    chooseMember(intoType) {
      this.loading = true
      this.chooseMemberDialog = true
      this.getmemberList(1)
      
    },
    // 选择组员 列表
    async getmemberList(intoType){
      this.loading = true
      let issuccess = false
      await this.$axios.post(this.pathItem.querySystemUserInfoDealersByRole, {
        pageNum: this.memberpageNo,
        pageSize: this.memberpageSize
      })
        .then((res) => {
          this.loading = false
          if (res.code == 0) {
            issuccess = true
            this.memberTable = res.result.records
            this.membertotal = res.result.total
            this.memberTable.forEach((item,index) => { // 每条数据 增加一条flag  默认多选框
              this.$set(this.memberTable[index],'flag',false)
            })

            if ( intoType == 1 && this.enddata.length != 0 ) {  // 如果保存的 组员list 有值 就回显   (只有初次打开运行此操作!!)
              this.middledata.push.apply(this.middledata,this.enddata) // 将保存的组员list  与 暂存组员list 合并
            }

            if (this.middledata.length != 0) {  // 对暂存 组员list 进行反显
              let idlist = this.memberTable.map( tableitem => { // 将该页所有的组员id组成一个新数组
                return tableitem.id
              })
              this.middledata.forEach((item,index)=>{  
                if ( idlist.indexOf(item) != -1) {
                  this.$set(this.memberTable[idlist.indexOf(item)], 'flag', true)
                }
              })
            }
            
          } else {
            this.errorMsg(res.message)
          }
        })
        .catch((res) => {
          this.errorMsg(res.message)
        })
        return issuccess;
    },
    // 选择组员
    addCheckedList(row) {
      let _this = this
      let id = row.id
      if (row.flag == true) { 
        _this.middledata.push(row.id) // 如果选中 存到 middledata 集合里
      } else {
        _this.middledata.forEach((item,index)=>{  // 如果取消选中 检查 middledata 集合里 有没有该编号 如果有就删除
          if (item == id) {
            _this.middledata.splice(index,1)
          }
        })
      }
      console.log(_this.middledata)
    },
    // 选择组员 保存
    memberSave() {
      if (this.middledata.length == 0) {
        this.errorMsg("请先选择组员再确认")
        return;
      }
      this.$axios.post(this.pathItem.updateupDealerUserInfo, {
        id: JSON.parse(window.localStorage.user).id,
        jurisdictionIds: this.middledata.join()+','+JSON.parse(window.localStorage.user).id,
      })
        .then((res) => {
          if (res.code == 0) {
            this.enddata = this.middledata //将选择的 组员list  保存
            this.chooseMemberDialog = false
            this.successMsg("选择组员成功")
            this.load()
          } else {
            this.errorMsg(res.message)
          }
        })
        .catch((res) => {
          this.errorMsg(res.message)
        });
    },
    
    // 格式化数据
    formatjobState(row, col, cellValue) {
      if (cellValue == 1) {
        return "在职";
      }
      return "离职";
    },
    // 格式化数据
    formatStatus(row, col, cellValue) {
      if (cellValue == 1) {
        return "开启";
      } else if (cellValue == 2) {
        return "禁用";
      } else if (cellValue == 3) {
        return "注销";
      }
      
    },
    // 格式化数据
    formatSex(row, col, cellValue) {
      if (cellValue == 1) {
        return "男";
      }
      if(cellValue == 2){
        return "女";
      }
      return "--"
      
    },
    // 查询
    search() {
      this.currentPage = 1
      this.pageNo = 1
      this.load()
    },
    // 清空
    resetSearch(){
      this.searchForm ={
          jobNumber:"",
          userName:"",
          organizationId:"",
          postId:"",
          status:""
      }
    },
    // 人员列表分页
    handleSizeChange(val){ 
      this.pageSize = val
      this.load()
    },
    handleCurrentChange(val){ 
      this.pageNo = val
      this.load()
    },
    // 选择组员列表分页
    memberhandleSizeChange(val){ 
      this.memberpageSize = val
      this.getmemberList(2)
    },
    memberhandleCurrentChange(val){ 
      this.memberpageNo = val
      this.getmemberList(2)
    },
    // 详情
    jumpDetail(id) {
      this.$router.push({
        path: "/personDetail",
        query:{
          id: id
        }
      });
    },
    // 编辑
    jumpEdit(id) {
      this.$router.push({
        path: "/personEdit",
        query:{
          id: id
        }
      });
    },
    // 新增
    addPerson() {
      this.$router.push("/personAdd");
    },
    // 调动
    changeFun(id,e) {
      this.rowid = id
      this.changeDialogType = e
      this.changeDialog = true;
    },
    // 确认离职
    sureLeave() {
      this.$alert("有关联的车辆或客户信息，不能离职", {
        confirmButtonText: "知道了",
      });
    },
    // 错误提醒	
    errorMsg(msg) {this.$alert(msg, '提示', {confirmButtonText: '确定',type:'warning',})},
    // 成功提醒	
    successMsg(msg) {this.$message({message:msg, type:'success'})}
  }
}
</script>
<style lang="scss" scoped>
.personList {
  background: #fff;
  & /deep/ textarea{
    resize: none !important;
  }
  .main-content {
    padding: 15px 30px;
    margin-bottom: 10px;
    font-size: 13px;
    background-color: #ffffff;
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
.red {
  color: red;
}
.mt15 {
  margin-top: 15px;
}

// .selectStyle .miniSelect /deep/ .el-input {
//   width: 120px;
// }
// .el-input {
// //   width: 200px;
// }
/* 表格样式 */
.tableBtn .el-button {
  margin: 5px;
}
/* 分页 */
.right {
  float: right;
}
.block {
  padding: 10px 0;
  height: 110px;
}
.el-main::-webkit-scrollbar {
  display: none;
}
.el-table td,
.el-table th {
  text-align: center;
}
/* 弹出框样式 */
.dialogStyle .el-row {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 10px;
}
.dialogStyle .el-row span {
  display: inline-block;
  width: 100px;
}
.dialogStyle .el-input,
.dialogStyle .el-select {
  width: 240px;
}
.dialogStyle .el-button {
  margin: 10px 20px 0;
}
.w8 {
  width: 80%;
}
</style>