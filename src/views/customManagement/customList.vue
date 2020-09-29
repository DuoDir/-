<template>
  <el-container class="customList">
    <!-- 信息筛选 -->
    <el-header class="header">
      <span>信息筛选</span>
      <div style="float:right;">
        <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="clear" plain  icon="el-icon-delete">清空</el-button>
      </div>
    </el-header>
    <el-main>
      <!-- 筛选内容 -->
      <el-row class="main-content">
        <el-row class="el_row">
          <el-col class="el-col-test" :span="2">
            心理价格:
          </el-col>
          <el-col :span="22">
            <label class="label-style" v-for="priceItem in priceSection" :key="priceItem.id" :class="{'label-active':searchForm.carprice==priceItem.id}" @click="searchForm.carprice=priceItem.id">{{priceItem.label}}</label>
            <el-input v-model="searchForm.upprice" @input="handlemoney($event,'upprice')" size="mini" style="width:70px;"></el-input> 万 -
            <el-input v-model="searchForm.downprice" @input="handlemoney($event,'downprice')" size="mini" style="width:70px;"></el-input> 万
            </el-col>
          </el-col>
        </el-row>
        <el-row class="el_row">
          <el-col class="el-col-test" :span="2">
            跟进状态:
          </el-col>
          <el-col :span="22">
            <label class="label-style" v-for="typeItem in typeList" :key="typeItem.id" :class="{'label-active':searchForm.GJtype==typeItem.id}" @click="searchForm.GJtype=typeItem.id">{{typeItem.label}}</label>
          </el-col>
        </el-row>
        <el-row class="el_row">
          <el-col class="el-col-test" :span="2">经销商:</el-col>
          <el-col :span="3">
            <el-select v-model="searchForm.dealer" clearable size="mini">
              <el-option v-for="(item,index) in dealerOption" :label="item.label" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-col>
          <el-col class="el-col-test" :span="2">销售顾问:</el-col>
          <el-col :span="3">
            <el-select v-model="searchForm.salesAdvisor" clearable size="mini">
              <el-option v-for="(item,index) in salesAdvisorOptions" :label="item.label" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-col>
          <el-col class="el-col-test" :span="2">客户名称:</el-col>
          <el-col :span="3">
            <el-input v-model="searchForm.customName" maxlength="50" clearable size="mini"></el-input>
          </el-col>
          <el-col class="el-col-test" :span="2">客户电话:</el-col>
          <el-col :span="3">
            <el-input v-model="searchForm.customPhone" maxlength="12" @input="handlemoney($event,'customPhone')" clearable size="mini"></el-input>
          </el-col>
          <el-col class="el-col-test" :span="2">客户类型:</el-col>
          <el-col :span="2">
            <el-select v-model="searchForm.customType" clearable size="mini">
              <el-option label="潜在" value="1"></el-option>
              <el-option label="有效" value="2"></el-option>
              <el-option label="战败" value="3"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="el_row">
          <el-col class="el-col-test" :span="2">客户等级:</el-col>
          <el-col :span="3">
            <el-select v-model="searchForm.customLevel" clearable size="mini">
              <el-option label="A" value="1"></el-option>
              <el-option label="B" value="2"></el-option>
              <el-option label="C" value="3"></el-option>
              <el-option label="N" value="4"></el-option>
              <el-option label="H" value="5"></el-option>
            </el-select>
          </el-col>
          <el-col class="el-col-test" :span="2">客户分类:</el-col>
          <el-col :span="3">
            <el-select v-model="searchForm.customSort" clearable size="mini">
              <el-option label="直客" value="1"></el-option>
              <el-option label="车商" value="2"></el-option>
              <el-option label="平台" value="3"></el-option>
              <el-option label="中间人" value="4"></el-option>
            </el-select>
          </el-col>
          <el-col class="el-col-test" :span="2">客户范围:</el-col>
          <el-col :span="5">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <el-checkbox-group class="checkGroupStyle" v-model="searchForm.checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="customItem in customSection" :label="customItem.index" :key="customItem.index">{{customItem.label}}</el-checkbox>
              </el-checkbox-group>
          </el-col>
        </el-row>
      </el-row>
      <!-- 操作按钮 -->
      <el-header class="header">
        <span>客户列表</span>
        <div style="float:right;">
          <!-- <el-button type="primary" @click="dataLeadModel=true">导入</el-button>
          <el-button type="primary" @click="jumpAdd">新增客户</el-button> -->
          <el-button type="primary" v-if="buttonLimits.includes(122)" @click="dataLeadModel=true">导入</el-button>
          <el-button type="primary" v-if="buttonLimits.includes(121)" @click="exportFun">导出</el-button>
          <el-button type="primary" v-if="buttonLimits.includes(123)" @click="customChange">批量客户转移</el-button>
          <el-button type="primary" v-if="buttonLimits.includes(120)" @click="jumpAdd">新增客户</el-button>
        </div>
      </el-header>
      <!-- 客户列表 -->
      <el-row>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column fixed align="center">
              <template slot-scope='{row}'>
                <el-checkbox v-model="row.flag" @change="addCheckedList(row)"/>
              </template> 
            </el-table-column>
            <el-table-column prop="code" label="客户编号" width="150" fixed> </el-table-column>
            <el-table-column prop="name" label="客户名称" width="150" fixed> </el-table-column>
            <el-table-column prop="phone" label="客户电话" width="150" fixed> </el-table-column>
            <el-table-column prop="storeName" label="经销商" width="150"> </el-table-column>
            <el-table-column prop="classifyName" label="客户分类" width="150"> </el-table-column>
            <el-table-column prop="needs" label="需求" width="150">
              <template slot-scope='{row}'>
                <span>{{row.needBrand}} {{row.needAudi}} {{row.needCarmodel}}</span>
              </template> 
            </el-table-column>
            <el-table-column label="可匹配车辆" width="150">
              <template slot-scope='{row}'>
                <span  class="link" @click="jumpcarList">{{row.matchCar}}</span>
              </template> 
            </el-table-column>
            <el-table-column prop="salesAdvisorName" label="销售顾问" width="150"> </el-table-column>
            <el-table-column prop="typeName" label="客户类型" width="150"> </el-table-column>
            <el-table-column prop="levelName" label="客户等级" width="150"> </el-table-column>
            <el-table-column prop="statusName" label="跟进状态" width="150"> </el-table-column>
            <el-table-column prop="lastTime" label="最后跟进时间" width="200"> </el-table-column>
            <el-table-column prop="followUpTimes" label="跟进次数" width="150"> </el-table-column>
            <el-table-column prop="noFollowUpTimes" label="未跟进天数" width="150"> </el-table-column>
            <el-table-column prop="createDay" label="已建天数" width="150"> </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="200"> </el-table-column>
            <el-table-column label="操作" width="300" fixed="right">
              <template slot-scope='{row}'>
                <!-- <el-button size="mini" type="warning" @click="jumpEdit(row)" plain icon="el-icon-edit">编辑</el-button> -->
                <el-button v-if="buttonLimits.includes(124)" size="mini" type="primary" @click="jumpDetail(row)" plain icon="el-icon-document">详情</el-button>
                <el-button v-if="buttonLimits.includes(125)" size="mini" type="success" @click="followUp(row)" plain icon="el-icon-wind-power">跟进</el-button>
                <el-button v-if="buttonLimits.includes(126)" size="mini" type="warning" @click="jumpEdit(row)" plain icon="el-icon-edit">编辑</el-button>
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
      <!-- 导入 -->
      <el-dialog title="数据导入" :visible.sync="dataLeadModel" width="50%">
        <el-form>
          <el-form-item label="下载导入模板:" label-width="200px" >
            <span class="link" @click="downloadModel">下载模板</span>
          </el-form-item>
          <el-form-item label="选择需要导入的数据:" label-width="200px" >
            <el-upload
              ref="uploadFile"
              class="upload-demo"
              action="#"
              multiple
              :limit="1"
              :before-upload="beforeupload"
              :http-request="uploadrequest"
              :on-change="handleChangeFile"
              :on-remove="handleRemove"
              :on-exceed="handleExceed"
              >
              <el-button size="small" type="primary">选择文件</el-button>
              <div slot="tip" class="el-upload__tip">注：请严格按照模板中格式上传数据，模板中表头不可更改和删除</div>
            </el-upload>
          </el-form-item>
          <el-row style="background:#dedede;padding: 13px;width: 90%;margin: 0 auto;">
            <el-col :span="24">
              特别提示：
            </el-col>
            <el-col :span="24">
              每次最多导入5000条数据，客户手机号为唯一，不允许重复，如导入过程发现有相同手机号，则导入不成功。
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dataLeadModel = false">取 消</el-button>
          <el-button type="primary" @click="leadSave">导 入</el-button>
        </div>
      </el-dialog>
      <!-- 加载进度条 -->
      <el-dialog title="批量导入" :visible.sync="leadProgressModel" width="40%">
        <el-row style="margin-top:90px">
          <el-progress :text-inside="true" :stroke-width="26" :percentage="leadLoading.percentage"></el-progress>
          <el-col :span="10" :offset="9" style="margin-top:50px;margin-bottom:100px;">
            正在导入数据 ( {{leadLoading.successSum}} / {{leadLoading.totality}} )
          </el-col>
        </el-row>
      </el-dialog>
      <!-- 校验模态框 兼  导入异常 -->
      <el-dialog title="批量导入校验" :visible.sync="leadDetailModel" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="(leadfailData.doneSum==leadfailData.totality)" width="40%">
        <el-row style="margin-top:30px;">
          <el-progress :text-inside="true" :stroke-width="26" :percentage="leadfailData.percentage"></el-progress>
          <el-row style="text-align:center;">
            <el-col v-if="leadfailData.doneSum==leadfailData.totality">校验完成</el-col>
            <el-col v-else>数据校验中...,请稍后</el-col>
          </el-row>
          <el-col :span="20" :offset="2" style="border:1px solid #dedede;padding: 15px;margin-top:30px">
            <el-col :span="24">
              总数据条数: <span style="color:green;">{{leadfailData.totality}}条</span>
            </el-col>  
            <el-col :span="24">
              异常数据条数: <span style="color:red;">{{leadfailData.errorSum}}条</span>
            </el-col>              
          </el-col>
        </el-row>
        <el-row style="margin-top:20px;">
          <el-col :span="20" :offset="2" style="border:1px solid #dedede;padding: 15px;">
            <span style="color:red;">异常提示</span>:
            <p v-for="item in leadfailData.messages">{{item}}</p>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button v-show="leadfailData.doneSum==leadfailData.totality" type="primary" @click="leadDetailModel=false">关 闭</el-button>
        </div>
      </el-dialog>
      <!-- 跟进 -->
      <el-dialog title="新增跟进" :visible.sync="followUpModel" width="55%">
        <el-form :model="followUpFrom" ref="followUpFrom">
          <el-row :gutter="20" class="el_row">
            <el-col :span="8">
              <el-form-item label="客户名称:" label-width="100px" >
                {{followUpFrom.name}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户电话:" label-width="100px" >
                {{followUpFrom.phone}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户等级:" label-width="100px" >
                <el-select v-model="followUpFrom.customLevel" size="mini">
                  <el-option label="A" value="1"></el-option>
                  <el-option label="B" value="2"></el-option>
                  <el-option label="C" value="3"></el-option>
                  <el-option label="N" value="4"></el-option>
                  <el-option label="H" value="5"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="el_row">
            <el-col>
              <el-form-item label="跟进状态:" label-width="100px" :required="true">
                <!-- <el-steps :space="200" :active="followUpFrom.followUpType" finish-status="success">
                  <el-step v-for="(item,index) in followType" :key="index"  :title="item.label" @click.native="changeFollowType(item)" style="cursor:pointer;"></el-step>
                </el-steps> -->
                <el-radio-group v-model="followUpFrom.followUpType">
                  <el-radio :label="1">初步沟通</el-radio>
                  <el-radio :label="2">意向</el-radio>
                  <el-radio :label="3">预定</el-radio>
                  <el-radio :label="4">成交</el-radio>
                  <el-radio :label="5">战败</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="el_row">
            <el-col>
              <el-form-item label="联系方式:" label-width="100px">
                <el-radio-group v-model="followUpFrom.contact">
                  <el-radio :label="1">电话联系</el-radio>
                  <el-radio :label="5">微信</el-radio>
                  <el-radio :label="2">当面沟通</el-radio>
                  <el-radio :label="4">客户回访</el-radio>
                  <el-radio :label="7">短信</el-radio>
                  <el-radio :label="3">邮件联系</el-radio>
                  <el-radio :label="6">其他方式</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="el_row" v-show="followUpFrom.followUpType==5">
            <el-col>
              <el-form-item label="战败原因:" label-width="100px" :required="true">
                <el-radio-group v-model="followUpFrom.loseReason">
                  <el-radio :label="1">未知</el-radio>
                  <el-radio :label="2">买新车</el-radio>
                  <el-radio :label="3">从别处购车</el-radio>
                  <el-radio :label="4">不感兴趣</el-radio>
                  <el-radio :label="5">其他原因</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="el_row">
            <el-col>
              <el-form-item label="跟进内容:" label-width="100px" >
                <el-input type="textarea":rows="5" maxlength="200" placeholder="请输入内容" v-model="followUpFrom.content"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="el_row">
            <el-col :span="8">
              <el-form-item label="跟进时间:" label-width="100px" >
                <el-date-picker v-model="followUpFrom.time" type="datetime" placeholder="选择日期时间"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="followUpModel = false">取 消</el-button>
          <el-button type="primary" @click="followUpSave">保存<span v-show="followUpFrom.followUpType==4">,创建订单</span></el-button>
        </div>
      </el-dialog>
      <!-- 客户转移 -->
      <el-dialog title="客户转移" :visible.sync="customChangeModel" width="40%">
        <el-row :gutter="20" class="el_row">
          <el-col :span="20">
            <el-col :span="13">
              共转移客户数量:<span class="red"> {{addCheckedLists.length}}</span>个,转移到员工
            </el-col>
            <el-col :span="10">
              <el-select v-model="changePersonname" size="mini" placeholder="请选择">
                <el-option v-for="item in personOption" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top:30px;">
          <el-col>
            <el-table class="tableBox" :data="changeCustomData" border style="width: 100%">
              <el-table-column prop="name" label="客户姓名"/>
              <el-table-column prop="phone" label="客户电话"/>
              <el-table-column prop="salesAdvisorName" label="所属员工"/>
            </el-table>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="customChangeModel = false">取 消</el-button>
          <el-button type="primary" @click="saveCustomerChanges">保 存</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
/*********************************************************************************************
 **                                  客户列表数据方法说明 
 ** @function getPageKey() 获取页面key
 ** @function load() 加载列表
 ** @function search() 查询列表
 ** @function querySystemUserInfoDealersList() 获取销售顾问  员工下拉
 ** @function handleSizeChange() 每页条数改变时触发事件
 ** @function handleCurrentChange() 当前页码改变时触发事件
 ** @function addCheckedList(row) 选中列表的项 @params 选中列表的单行数据
 ** @function customChange() 批量客户转移 
 ** @function saveCustomerChanges() 客户转移保存
 ** @function clear() 清空
 ** @function downloadModel() 下载导入模板
 ** @function exportFun() 导出
 ** @function customChange() 批量客户转移
 
 *********************************************************************************************/
export default {
    data() {
        return {
            buttonLimits: [],
            pagebuttonkey: '', // 页面key
            checked: true,
            rowData: {},
            addCheckedLists: [], // 选中列表的项
            // 列表
            tableData: [],
            currentPage: 1,
            pageNo: 1,
            pageSizes: [5,10,15,20],
            total: 0,
            pageSize: 10,
            // 选项数据
            changeCustomData: [],
            priceSection: [
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
            typeList: [
                {
                    label: '全部',
                    id: ''
                },
                {
                    label: '初步沟通',
                    id: 1
                },
                {
                    label: '意向',
                    id: 2
                },
                {
                    label: '预定',
                    id: 3
                },
                {
                    label: '成交',
                    id: 4
                },
                {
                    label: '战败',
                    id: 5
                }
            ],
            
            customSection: [
              {
                index: 1,
                label: '我的客户'
              }
            ],
            // 跟进状态
            followType: [
              {
                label: '初步沟通',
                id: '1'
              },
              {
                label: '意向',
                id: '2'
              },
              {
                label: '预定',
                id: '3'
              },
              {
                label: '成交',
                id: '4'
              },
              {
                label: '战败',
                id: '5'
              },
            ],
            personOption: [], // 客户转移 员工List
            salesAdvisorOptions: [], //销售顾问
            dealerOption: [], // 经销商
            // 查询条件
            searchForm: {
              carprice: '1',//心理价格选择
              upprice: '',//心理价格低
              downprice: '',//心理价格高
              GJtype: '',//跟进状态
              dealer: '',//经销商
              salesAdvisor: '',//销售顾问
              customName: '',//客户名称
              customPhone: '',//客户电话
              customType: '',//客户类型
              customLevel: '',//客户等级
              customSort: '',//客户分类
              checkedCities: [],//客户范围
            },
            // 跟进模态框数据
            followUpFrom: {
              name: '',
              phone: '',
              customLevel: '',
              followUpType: 0,
              contact: '',
              loseReason: '',
              content: '',
              time: ''
            },
            // 客户转移数据
            changePersonname: '', //转移员工
            // 模态框
            loading: false, //加载数据
            checkAll: false,
            isIndeterminate: true,
            dataLeadModel: false,
            leadProgressModel: false,
            leadDetailModel: false,
            followUpModel: false,
            customChangeModel: false,
            // 导入文件
            leadInFile: [],
            // 导入需要的bak
            leadBak: '',
            // 校验bak
            checkBak: '',
            // 导入失败信息
            leadfailData: {
              totality: 0, //总条数
              doneSum: 0, // 已校验条数
              errorSum: 0, //异常条数
              percentage: 0, //百分比
              messages: [] // 异常结果
            },
            // 导入过程
            leadLoading: {
              totality: 0, //总条数
              successSum: 0, // 成功条数
              percentage: 0 //百分比
            },
        }
    },
    watch: {
      //评估价格
      'searchForm.carprice'(val) {
        this.searchForm.upprice = ''
        this.searchForm.downprice = ''
        switch(val) {
          case 1:  
                this.searchForm.upprice = '' ,this.searchForm.downprice = '';
          break;
          case 2:  
                this.searchForm.upprice = '0' ,this.searchForm.downprice = '5';
          break;
          case 3:  
                this.searchForm.upprice = '5' ,this.searchForm.downprice = '10';
          break;
          case 4:  
                this.searchForm.upprice = '10' ,this.searchForm.downprice = '20';
          break;
          case 5:  
                this.searchForm.upprice = '20' ,this.searchForm.downprice = '30';
          break;
          case 6:  
                this.searchForm.upprice = '30' ,this.searchForm.downprice = '40';
          break;
          case 7:  
                this.searchForm.upprice = '40' ,this.searchForm.downprice = '';
          break;
        }
      },
      // 导入
      dataLeadModel(val) {
        if (val === false && this.$refs.uploadFile) {
          this.leadInFile = []
          this.$refs.uploadFile.clearFiles()
        }
      },
      // 导入进度条
      leadProgressModel(val) {
        if (val == false) {
          this.leadLoading = {
            totality: 0, //总条数
            successSum: 0, // 成功条数
            percentage: 0//百分比
          }
          this.dataLeadModel = false
          this.load()
        }
      },
      // 校验模态框
      leadDetailModel(val) {
        if (val == false) {
          // 导入失败信息
          this.leadfailData = {
            totality: 0, //总条数
            doneSum: 0, // 已校验条数
            errorSum: 0, //异常条数
            percentage: 0, //百分比
            messages: [] // 异常结果
          }
          // this.cancelCheckoutPlan() // 调用取消检验接口
        }
      },
      // 跟进模态框
      followUpModel(val) {
        if (val == false) {
          this.followUpFrom.followUpType = 0
          this.followUpFrom.contact = ''
          this.followUpFrom.loseReason = ''
          this.followUpFrom.content = ''
          this.followUpFrom.time = ''
        }
      },
      // 客户转移模态框
      customChangeModel(val) {
        if (val == false) {
          this.changePersonname = ''
        }
      },
    },
    created() {
      this.buttonLimits = this.$route.meta.button //根据buttonKey判断按钮权限
      this.pagebuttonkey = this.$route.meta.buttonKey // 获取页面key
    },
    mounted() {
      this.load() // 列表加载
      this.querySystemUserInfoDealersListOneTable() // 获取销售顾问下拉
      this.queryGroupList() // 获取经销商
    },
    methods: {
      //加载列表
      async load() {
        let isSuccess = false // 是否运行成功
        this.loading = true
        await this.$axios.post(this.pathItem.findCustomerFactoryByParam,{
          size: this.pageSize,
          page: this.pageNo,
          priceLow: this.searchForm.upprice==''?'':this.searchForm.upprice*10000,// 心理价格 低
          priceUp: this.searchForm.downprice==''?'':this.searchForm.downprice*10000, // 心理价格 高
          status: this.searchForm.GJtype, // 跟进状态
          storeId: this.searchForm.dealer,//经销商id
          salesAdvisorId: this.searchForm.salesAdvisor,//销售顾问id
          name: this.searchForm.customName,//客户姓名
          phone: this.searchForm.customPhone,//客户电话
          type: this.searchForm.customType,// 客户类型
          level: this.searchForm.customLevel,//客户等级
          classify: this.searchForm.customSort,//客户分类
          scope: this.searchForm.checkedCities.length!=0?1:0,//客户范围
          buttonKey: this.pagebuttonkey
        }).then((res) => {
          this.loading = false
          if (res.code == 0) {
            isSuccess = true
            this.tableData = res.result.list
            this.total =  res.result.total
            this.tableData.forEach((item,index) => {
              this.$set(this.tableData[index],'flag',false)
            })
            console.log(this.tableData)
          } else {
            this.errorMsg(res.message)
          }
        });
        return isSuccess
      },
      // 查询
      search() {
        this.currentPage = 1
        this.pageNo = 1
        this.load()
      },
      // 获取销售顾问下拉  员工下拉
      querySystemUserInfoDealersListOneTable() {
        this.$axios.post(this.pathItem.querySystemUserInfoDealersListOneTable,{}).then((res) => {
          if (res.code == 0) {
            res.result.systemUserInfoDealersList.forEach( item => {
              this.salesAdvisorOptions.push({
                label: item.userName,
                value: item.id
              })
              this.personOption.push({
                label: item.userName,
                value: item.id
              })
            })
          } else {
            this.errorMsg(res.message)
          }
        })
      },
      // 获取经销商下拉
      queryGroupList() {
        this.$axios.post(this.pathItem.queryGroupList,{}).then((res) => {
          if (res.code == 0) {
            res.result.systemOrganizationDealersList.forEach( item => {
              this.dealerOption.push({
                label: item.organizationName,
                value: item.id
              })
            })
          } else {
            this.errorMsg(res.message)
          }
        })
      },
      //每页条数改变时触发事件
      handleSizeChange(val) {
        this.pageSize = val
        this.load().then(res => {
          if (res) {
            let customNoList = _this.tableData.map( (tableitem,tableindex) => { // 将该页所有的客户编号组成一个新数组
              return tableitem.code
            })
            console.log(customNoList)
            _this.addCheckedLists.forEach( (item,index) => { // 将这些编号与 存在addCheckedLists集合里的编号 作比较  如果有 变成选中状态
              if (customNoList.indexOf(item.code) != -1) {
                _this.tableData[customNoList.indexOf(item.code)].flag = true
              }
            })
          }
        })
      },
      //当前页码改变时触发事件
      handleCurrentChange(val){ 
        this.pageNo = val
        let _this = this
        this.load().then(res => {
          if (res) {
            let customNoList = _this.tableData.map( (tableitem,tableindex) => { // 将该页所有的客户编号组成一个新数组
              return tableitem.code
            })
            console.log(customNoList)
            _this.addCheckedLists.forEach( (item,index) => { // 将这些编号与 存在addCheckedLists集合里的编号 作比较  如果有 变成选中状态
              if (customNoList.indexOf(item.code) != -1) {
                _this.tableData[customNoList.indexOf(item.code)].flag = true
              }
            })
          }
        })
      },
      // 选中列表的项
      addCheckedList(row) {
        var _this = this
        let code = row.code // 客户编号
        if (row.flag == true) { 
          _this.addCheckedLists.push(row) // 如果选中 存到 addCheckedLists 集合里
        } else {
          _this.addCheckedLists.forEach((item,index)=>{  // 如果取消选中 检查 addCheckedLists 集合里 有没有该编号 如果有就删除
            if (item.code == code) {
              _this.addCheckedLists.splice(index,1)
            }
          })
        }
      },
      // 批量客户转移
      customChange() {
        if (this.addCheckedLists.length != 0) {
          this.customChangeModel = true
          this.changeCustomData = this.addCheckedLists
        } else {
          this.errorMsg('请选择要转移的客户')
        }
      },
      // 客户转移保存
      saveCustomerChanges() {
        if (this.changePersonname == '') {
          this.errorMsg("请选择要转移到哪个员工")
          return;
        }
        let ids = this.addCheckedLists.map(item => {return item.id})
        let salesAdvisorName = ''
        let userinfo = JSON.parse(window.localStorage.user)
        this.personOption.forEach( item => {
          if (this.changePersonname == item.value) {
            salesAdvisorName = item.label
          }
        })
        this.$axios.post(this.pathItem.saveCustomerChanges,{
          ids: ids,
          salesAdvisorId: this.changePersonname,
          salesAdvisorName: salesAdvisorName,
          userId: userinfo.id
        }).then((res) => {
          if (res.code == 0) {
            this.successMsg("转移成功")
            this.customChangeModel = false
            this.addCheckedLists = []
            this.load()
          } else {
            this.errorMsg(res.message)
          }
        })
      },
      // 清空
      clear() {
        this.searchForm =  {
          carprice: '1',
          upprice: '',
          downprice: '',
          GJtype: '',
          dealer: '',
          salesAdvisor: '',
          customName: '',
          customPhone: '',
          customType: '',
          customLevel: '',
          customSort: '',
          checkedCities: [],
        }
        this.checkAll = false
      },
      // 下载导入模板
      downloadModel() {
        let url = this.pathItem.getCustomerTemplate;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true); // 也可以使用POST方式，根据接口
        // xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.setRequestHeader("Content-Type", 'application/json;charset=UTF-8');
        xhr.setRequestHeader('token', window.localStorage.token);
        xhr.withCredentials = true;
        xhr.responseType = "blob"; // 返回类型blob，XMLHttpRequest支持二进制流类型
        xhr.onload = function() {
          if (this.status === 200) {
            let blob = this.response; //使用response作为返回，而非responseText
            let reader = new FileReader();
            reader.readAsDataURL(blob); // 转换为base64，可以直接放入a标签href
            reader.onload = function(e) {
              // 转换完成，创建一个a标签用于下载
              let a = document.createElement("a");
              a.target="_blank";
              a.download = "客户导入模板.xlsx";
              a.href = e.target.result;
              // a.click();
              var evt = document.createEvent("MouseEvents");  
              evt.initEvent("click", true, true);  
              a.dispatchEvent(evt);
            };
          }
        };
        xhr.send(JSON.stringify({}));
      },
      // 导出
      exportFun(){ 
        //使用封装的axios请求
        let params = {
          priceLow: this.searchForm.upprice==''?'':this.searchForm.upprice*10000,// 心理价格 低
          priceUp: this.searchForm.downprice==''?'':this.searchForm.downprice*10000, // 心理价格 高
          status: this.searchForm.GJtype, // 跟进状态
          storeId: this.searchForm.dealer,//经销商id
          salesAdvisorId: this.searchForm.salesAdvisor,//销售顾问id
          name: this.searchForm.customName,//客户姓名
          phone: this.searchForm.customPhone,//客户电话
          type: this.searchForm.customType,// 客户类型
          level: this.searchForm.customLevel,//客户等级
          classify: this.searchForm.customSort,//客户分类
          scope: this.searchForm.checkedCities.length!=0?1:0,//客户范围
          buttonKey: this.pagebuttonkey
        }
        this.$axios.post(this.pathItem.exportCustomerResultByParam,params)
          .then(res=>{
            let blob = new Blob(["\uFEFF" + res], { type: "text/plain" });
            let aTag = document.createElement("a");
            aTag.href = URL.createObjectURL(blob);
            aTag.download = "客户列表.csv";
            var evt = document.createEvent("MouseEvents");
            evt.initEvent("click", true, true);
            aTag.dispatchEvent(evt);
          })
      },
      // 全选
      handleCheckAllChange(val) {
        this.searchForm.checkedCities = val ? [1] : [];
        this.isIndeterminate = false;
      },
      // 全选
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.customSection.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.customSection.length;
      },
      // 限制文件上传类型
      beforeupload(file) {
        console.log(file.name)
        if (file.name.indexOf('xlsx') === -1 || file.name.indexOf('xls') === -1){            
          this.errorMsg("选择的文件不是表格形式,或者格式不是xls文件格式!")
          this.leadInFile = []
          this.$refs.uploadFile.clearFiles()
          return;
        }               
      },
      // 上传文件
      handleChangeFile(file, fileList) {
        console.log(fileList)
        this.leadInFile = fileList
      },
      uploadrequest() {
        console.log("上传")
      },
      // 删除文件
      handleRemove(file, fileList) {
        console.log(fileList)
        this.leadInFile = fileList
      },
      // 文件超出限制
      handleExceed(files, fileList) {
        this.$message.warning(`最多上传一个文件`);
      },
      // 导入上传 校验导入用户数据
      leadSave() {
        if (this.leadInFile.length === 0) {
          this.errorMsg("请先上传需要导入的数据")
          return;
        }
        let formData = new FormData()
        formData.append('file',this.leadInFile[0].raw)
        this.$axios.post(this.pathItem.importExcel,formData).then((res) => {
          if (res.code == 0) {
            this.checkBak = res.result // 校验的bak
            this.leadDetailModel = true // 打开校验模态框
            this.callgetCheckoutPlan()
          } else {
            this.errorMsg(res.message)
          }
        })
      },
      // 实时调取校验数据进度接口
      callgetCheckoutPlan() {
        this.getCheckoutPlan().then(res => {
          if (res) {
            this.callgetCheckoutPlan()
          }
        })
      },
      // 获取校验数据进度
      async getCheckoutPlan() {
        let isSuccess = false
        await this.$axios.post(this.pathItem.getCheckoutPlan,{bak: this.checkBak}).then((res) => {
          if (res.code == 0) {
            isSuccess = true
            if (res.result.data == null) {
              this.errorMsg("校验数据异常,请重新导入校验")
              this.leadDetailModel = false
              isSuccess = false
              return isSuccess
            }
            this.leadfailData.totality = res.result.data.totality // 总条数
            this.leadfailData.doneSum = res.result.data.doneSum // 已校验条数
            this.leadfailData.errorSum = res.result.data.errorSum // 异常条数
            this.leadfailData.percentage =  parseInt((res.result.data.doneSum/res.result.data.totality)*100)//百分比
            if(res.result.data.errorSum != 0) { //如果检测有错误
              this.leadfailData.messages = res.result.data.messages
            }
            if (res.result.data.isEnd == true) { // 如果isEnd 为true 表示 校验所有数据完成
              isSuccess = false
              if (res.result.data.isEnd == true && res.result.data.errorSum === 0) { // 如果isEnd 为true 并且上传没有错误 将插入数据
                this.leadDetailModel = false // 关闭校验模态框
                this.importCustomer()
              }
            }
          } else {
            this.errorMsg(res.message)
          }
        })
        return isSuccess;
      },
      // 数据库插入导入数据
      importCustomer() {
        this.$axios.post(this.pathItem.importCustomer,{bak: this.checkBak}).then((res) => {
          if (res.code == 0) {
            this.leadProgressModel = true //开启导入模态框
            this.checkBak = res.result // 校验的bak
            this.callgetImportPlan()
          } else {
            this.errorMsg(res.message)
          }
        })
      },
      // 实时调取导入进度接口
      callgetImportPlan() {
        this.getImportPlan().then(res => {
          if (res) {
            this.callgetImportPlan()
          }
        })
      },
      // 获取导入进度
      async getImportPlan() {
        let isSuccess = false
        await this.$axios.post(this.pathItem.getImportPlan,{bak: this.checkBak}).then((res) => {
          if (res.code == 0) {
            isSuccess = true
            if (res.result.data != null) {
              this.leadLoading.totality = res.result.data.totality //总条数
              this.leadLoading.successSum = res.result.data.successSum // 成功条数
              this.leadLoading.percentage =  parseInt((res.result.data.successSum/res.result.data.totality)*100) //百分比
              if (res.result.data.isEnd == true) {
                this.successMsg("导入数据成功")
                isSuccess = false
                // 关闭导入模态框 更新列表
                this.leadProgressModel = false //关闭导入模态框
              }
            } else {
              this.successMsg("导入数据成功")
              isSuccess = false
              // 关闭导入模态框 更新列表
              this.leadProgressModel = false //关闭导入模态框
            }
          } else {
            this.errorMsg(res.message)
          }
        })
        return isSuccess;
      },
      // 当校验模态框关闭后  取消数据校验
      cancelCheckoutPlan() {
        this.$axios.post(this.pathItem.cancelCheckoutPlan,{bak: this.checkBak}).then((res) => {
          if (res.code == 0) {
            
          } else {
            this.errorMsg(res.message)
          }
        })
      },
      // 跟进
      followUp(row) {
        this.followUpModel = true
        this.rowData = row 
        // 自动带出客户名称、客户电话、及当前客户等级
        this.followUpFrom.name = row.name
        this.followUpFrom.phone = row.phone
        this.followUpFrom.customLevel = row.level
      },
      // 跟进保存
      followUpSave() {
        if (this.followUpFrom.followUpType == 0) {
          this.errorMsg('请选择跟进状态')
          return;
        }
        if (this.followUpFrom.followUpType === 5 && this.followUpFrom.loseReason === '') {
          this.errorMsg('请选择战败原因')
          return;
        }
        this.loading = true
        this.$axios.post(this.pathItem.saveCustomerFollowUp,{
          customerId: this.rowData.id,
          level: this.followUpFrom.customLevel,
          status: this.followUpFrom.followUpType,
          reasonDefeat: this.followUpFrom.loseReason,
          contact: this.followUpFrom.contact,
          bak: this.followUpFrom.content,
          time: this.timestampToTime(this.followUpFrom.time)
        }).then((res) => {
          this.loading = false
          if (res.code == 0) {
            this.successMsg('跟进成功')
            this.followUpModel = false
            this.load()
            if (this.followUpFrom.followUpType == 4) { // 如果是跟进状态为 成交   跳转创建订单
              this.$router.push({
                path: "/createCarOrderInfo"
              })
            }
            
          } else {
            this.errorMsg(res.message)
          }
        });
        
      },
      // 新增客户
      jumpAdd() {
        this.$router.push({
          path: "/customAdd"
        });
      },
      // 客户编辑
      jumpEdit(row) {
        console.log(row)
        this.$router.push({
          path: "/customEdit",
          query: { id: row.id }
        });
      },
      // 客户详情
      jumpDetail(row) {
        this.$router.push({
          path: "/customDetail",
          query: { id: row.id }
        });
      },
      // 跳转车辆列表
      jumpcarList() {                 
        this.$router.push({
          path: '/carList'
        })
      },
      // 限制数字
      handlemoney(eve, name) {
        let neweve = eve.replace(/[^\d.]/g, "") //电话号 (只能数字) 
        this.searchForm[name] = neweve
      },
      // 时间戳转换时间
      timestampToTime(t) {
        if (t == null || t == '') {
          return ''
        }
        var date = new Date(t) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + "-"
        var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-"
        var D = date.getDate() < 10 ? "0" + date.getDate() + ' ': date.getDate() + " "
        var h = date.getHours() < 10 ? "0" + date.getHours() + ":" : date.getHours() + ":"
        var m = date.getMinutes() < 10 ? "0" + date.getMinutes() + ":" : date.getMinutes() + ":"
        var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
        return Y + M + D + h + m + s;
      },
      // 错误提醒	
      errorMsg(msg) {this.$alert(msg, '提示', {confirmButtonText: '确定',type:'warning',})},
      // 成功提醒	
      successMsg(msg) {this.$message({message:msg, type:'success'})},
    }
}
</script>
<style lang="scss" scoped>
    .customList{
      background: #fff;
      .main-content {
        padding: 15px 30px;
        margin-bottom: 10px;
        font-size: 13px;
        .el-col-test {
          padding-right: 10px;
          text-align: right;
        }
        .label-style {
          margin-left: 10px;
          padding: 3px 10px;
          &.label-active {
            background: #67c23a;
            color: #fff;
            border-radius: 4px;
            font-size: 13px;
          }
        }
      }
      .checkGroupStyle{
        display: inline-block;
        margin-left: 30px;
      }
    }
    .red {
      color: red;
    }
    .link{
      cursor: pointer;
      color: #409EFF;
      text-decoration: underline;
    }
    .upload-demo{
      display: inline-block;
      margin-right: 10px;
    }
    .el_row{
        line-height: 32px;
        margin-bottom: 10px;
    }
    .customList /deep/ .el-step.is-horizontal .el-step__line {
      top: 19px;
    }
    .customList /deep/ textarea{
      resize: none !important;
    }
</style>