<template>
  <div class="carHostlingDialog">
    <el-dialog
      title="整备明细"
      :visible.sync="dialogHostling"
      width="80%"
      @close="closeDialog()"
      :showClose="false"
    >
      <span class="button-slot">
        <el-button
          type="primary"
          v-if="hostlingData.workStatus == 1 && optionBtn && buttonLimits.includes(168)"
          @click="ApplyButtonOperation(0)"
        >编 辑</el-button>
        <el-button
          type="primary"
          v-if="hostlingData.workStatus == 1  && optionBtn && buttonLimits.includes(168)"
          @click="ApplyButtonOperation(1)"
        >提 交</el-button>
        <el-button
          type="danger"
          v-if="(hostlingData.workStatus == 1 || hostlingData.workStatus == 4 || hostlingData.workStatus == 3) && optionBtn   && buttonLimits.includes(170)"
          @click="ApplyButtonOperation(2)"
        >作 废</el-button>

        <el-button
          type="danger"
          v-if="hostlingData.workStatus == 2  && optionBtn   && buttonLimits.includes(169)"
          @click="ApplyButtonOperation(3)"
        >撤 回</el-button>

        <el-button
          type="primary"
          v-if="hostlingData.workStatus == 2  && optionBtn  && buttonLimits.includes(172)"
          @click="ApplyButtonOperation(4)"
        >同 意</el-button>
        <el-button
          type="danger"
          v-if="(hostlingData.workStatus == 2 || hostlingData.workStatus == 5)  && optionBtn  && buttonLimits.includes(173)"
          @click="ApplyButtonOperation(5)"
        >驳 回</el-button>

        <el-button
          type="primary"
          v-if="hostlingData.workStatus == 4  && optionBtn  && buttonLimits.includes(175)"
          @click="ApplyButtonOperation(6)"
        >追加项目</el-button>
        <el-button
          type="primary"
          v-if="hostlingData.workStatus == 4  && optionBtn && buttonLimits.includes(174)"
          @click="ApplyButtonOperation(7)"
        >整备完成</el-button>

        <el-button
          type="primary"
          v-if="hostlingData.workStatus == 5  && optionBtn && buttonLimits.includes(177)"
          @click="ApplyButtonOperation(8)"
        >生成验收报告</el-button>

        <el-button
          type="primary"
          v-if="(hostlingData.workStatus == 6 || hostlingData.workStatus == 7)  && optionBtn "
          @click="ApplyButtonOperation(9)"
        >查看验收报告</el-button>

        <el-button
          type="primary"
          v-if="hostlingData.workStatus == 3  && optionBtn && buttonLimits.includes(171)"
          @click="ApplyButtonOperation(10)"
        >重新提交</el-button>

        <el-button
          type="primary"
          v-if="hostlingData.workStatus == 6 && !(settlementInfo && settlementInfo.length)  && optionBtn&& buttonLimits.includes(178)"
          @click="ApplyButtonOperation(11)"
        >录入结算单</el-button>
      </span>
      <table class="table-vertical" style="width:100%">
        <tr v-for="index in 2" :key="index">
          <td class="column">{{hostlingTableKeys[index*3-3].title}}</td>
          <td>{{formatHostling(hostlingTableKeys[index*3-3].prop)}}</td>
          <td class="column">{{hostlingTableKeys[index*3-2].title}}</td>
          <td>{{formatHostling(hostlingTableKeys[index*3-2].prop)}}</td>
          <td class="column">{{hostlingTableKeys[index*3-1].title}}</td>
          <td>{{formatHostling(hostlingTableKeys[index*3-1].prop)}}</td>
        </tr>
      </table>
      <el-row style="margin:30px auto">
        <div class="subHead">整备项目信息</div>
        <el-row style="margin-bottom:10px;">
          <el-col :span="4">整备工单号：{{hostlingData.workNum}}</el-col>
          <el-col :span="3">整备状态：{{formatHostStatus(hostlingData.workStatus)}}</el-col>
          <el-col :span="3">整备项目：共{{hostlingData.itemNum}}项</el-col>
          <el-col :span="3">整备预算：共{{hostlingData.workFee}}元</el-col>
          <el-col :span="3">创建人：{{hostlingData.creator}}</el-col>
          <el-col :span="5">创建时间：{{hostlingData.createdAt}}</el-col>
          <el-col :span="3">
            <a class="color-blue" @click="openAppovalLogDialog(hostlingData.id)">查看审批记录</a>
          </el-col>
        </el-row>
        <el-table
          :data="hostlingList"
          border
          :header-cell-style="{background:'#f5f7fa',color:'#606266'}"
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" align="center" width="80px"></el-table-column>
          <el-table-column
            v-for="item in tableHeader"
            :key="item.prop"
            :prop="item.prop"
            :label="item.title"
            align="center"
          ></el-table-column>
        </el-table>
        <div v-if="additionalList && additionalList.length">
          <div
            v-for="additionalItem in  additionalList"
            :key="additionalItem.id"
            style="margin-top:20px"
          >
            <div style="float:right;margin-top:-5px" v-if="additionalList&&additionalList.length">
              <el-button
                type="primary"
                v-if="(additionalItem.workStatus == 1 || additionalItem.workStatus == 4 || additionalItem.workStatus == 3) && optionBtn"
                @click="invalidChildOrder(additionalItem.id)"
              >作 废</el-button>
            </div>
            <div class="subHead" v-if="additionalList&&additionalList.length">追加项目信息</div>
            <el-row style="margin-bottom:10px;" v-if="additionalList&&additionalList.length">
              <el-col :span="4">整备工单号：{{additionalItem.workNum}}</el-col>
              <el-col :span="3">整备状态:{{formatHostStatus(additionalItem.workStatus)}}</el-col>
              <el-col :span="3">整备项目：共{{additionalItem.itemNum}}项</el-col>
              <el-col :span="3">整备预算：共{{additionalItem.workFee}}元</el-col>
              <el-col :span="3">创建人：{{additionalItem.creator}}</el-col>
              <el-col :span="5">创建时间：{{additionalItem.createdAt}}</el-col>
              <el-col :span="3">
                <a class="color-blue" @click="openAppovalLogDialog(additionalItem.id)">查看审批记录</a>
              </el-col>
            </el-row>

            <el-table
              :data="JSON.parse(additionalItem.items)"
              border
              :header-cell-style="{background:'#f5f7fa',color:'#606266'}"
              style="width: 100%"
            >
              <el-table-column type="index" label="序号" align="center" width="80px"></el-table-column>
              <el-table-column
                v-for="item in tableHeader"
                :key="item.prop"
                :prop="item.prop"
                :label="item.title"
                align="center"
              ></el-table-column>
            </el-table>
          </div>
        </div>
        <div style="margin-top:20px;" v-if="settlementInfo && settlementInfo.length">
          <div class="subHead">结算信息</div>
          <el-table
            :data="settlementInfo"
            border
            :header-cell-style="{background:'#f5f7fa',color:'#606266'}"
            style="width: 100%"
          >
            <el-table-column
              v-for="item in tableSettlementHeader"
              :key="item.prop"
              :prop="item.prop"
              :label="item.title"
              align="center"
            ></el-table-column>
            <el-table-column label="附件" align="center" width="80px">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="goSettle(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-row>
      <span slot="footer">
        <el-button type="primary" @click="closeDialog">关 闭</el-button>
      </span>
    </el-dialog>
    <LookApprovalLogDialog
      v-if="showAppovalLogDialog"
      @closedDialog="closeApprovalLogDialog"
      :orderId="orderId"
    ></LookApprovalLogDialog>
    <!-- 录入结算单 -->
    <el-dialog title="录入结算单" :visible.sync="finalDialog" width="80%">
      <el-row style=" line-height:40px;">
        <el-col :span="3" :offset="2">维修厂名称</el-col>
        <el-col :span="6">
          <el-input v-model="finalDialogData.repairName" size="mini"></el-input>
        </el-col>
        <el-col :span="3" :offset="2">整备实际金额</el-col>
        <el-col :span="6">
          <el-input v-model="finalDialogData.workTotalFee" size="mini"></el-input>
        </el-col>
        <el-col :span="3" :offset="2">整备开始时间</el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="finalDialogData.startTime"
            type="datetime"
            size="mini"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择整备开始时间"
          ></el-date-picker>
        </el-col>
        <el-col :span="3" :offset="2">整备结束时间</el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="finalDialogData.endTime"
            type="datetime"
            size="mini"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择整备结束时间"
          ></el-date-picker>
        </el-col>
        <el-col :span="3" :offset="2">附件</el-col>
        <el-col :span="6">
          <el-upload
            class="upload-demo"
            action
            ref="uploadSettlement"
            :multiple="true"
            :limit="15"
            :on-exceed="handleExceed"
            :auto-upload="false"
            :http-request="uploadfile"
            :file-list="fileList"
            :before-upload="beforeUpload"
            list-type="picture"
          >
            <el-button size="small" type="primary">上传结算单</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button type="primary" @click="saveImg">提 交</el-button>
        <el-button @click="finalDialog=false">返 回</el-button>
      </span>
    </el-dialog>
    <!-- 追加整备项目 -->
    <el-dialog title="追加整备项目" :visible.sync="dialogPushHostling" width="80%">
      <el-row
        v-for="(item,index) in dialogAdditionalHostlingInfo"
        :key="index"
        style="margin:30px auto"
      >
        <el-col :span="2" class="col-text-right">项目名称：</el-col>
        <el-col :span="3">
          <el-cascader
            size="mini"
            v-model="item.name"
            :show-all-levels="false"
            :options="editHostlingList"
            :props="hostlingCascaderProps"
            @change="(val)=>{additionalhostlingChange(val,index)}"
          ></el-cascader>
        </el-col>
        <el-col :span="3" class="col-text-right">费用（元）：</el-col>
        <el-col :span="3">
          <el-input class="dialog-input" v-model="item.estimateMoney" maxlength="10" size="small"></el-input>
        </el-col>
        <el-col :span="2" class="col-text-right">备注：</el-col>
        <el-col :span="7">
          <el-input class="dialog-input" v-model="item.remark" maxlength="10" size="small"></el-input>
        </el-col>
        <el-button
          v-if="dialogAdditionalHostlingInfo.length!=1"
          type="danger"
          size="small"
          style="border:none;margin-left:10px;"
          @click="deleteAdditionDialogHostlingInfo(index)"
        >删除</el-button>
        <el-button
          v-if="index==(dialogAdditionalHostlingInfo.length-1)  && index < 19"
          type="primary"
          size="small"
          style="border:none;margin-left:10px;"
          @click="additionalDialogHostlingInfo"
        >添加</el-button>
      </el-row>
      <span class="cRed">注：提交后，整备单会重新进入审核队列里，等待二手车经理审核！ 审批通过前，整备师无法看到此信息。</span>
      <span slot="footer">
        <el-button type="primary" @click="dialogAddConfirmSave(0)">提 交</el-button>
        <el-button @click="dialogPushHostling=false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 发起整备 -->
    <el-dialog title="整备申请" :visible.sync="editDialogHostling" width="80%">
      <table class="table-vertical" style="width:100%">
        <tr v-for="index in 2" :key="index">
          <td class="column">{{dialogHostlingTableKeys[index*3-3].title}}</td>
          <td>{{formatWorkData(dialogHostlingTableKeys[index*3-3].prop)}}</td>
          <td class="column">{{dialogHostlingTableKeys[index*3-2].title}}</td>
          <td>{{formatWorkData(dialogHostlingTableKeys[index*3-2].prop)}}</td>
          <td class="column">{{dialogHostlingTableKeys[index*3-1].title}}</td>
          <td>{{formatWorkData(dialogHostlingTableKeys[index*3-1].prop)}}</td>
        </tr>
      </table>
      <el-row style="margin:30px auto">
        <div class="subHead">整备项目信息</div>
        <el-row v-for="(item,index) in dialogHostlingInfo" :key="index" style="margin-bottom:10px;">
          <el-col :span="2" class="col-text-right">项目名称：</el-col>
          <el-col :span="3">
            <el-cascader
              size="mini"
              v-model="item.name"
              :show-all-levels="false"
              :options="editHostlingList"
              :props="hostlingCascaderProps"
              @change="(val)=>{hostlingChange(val,index)}"
            ></el-cascader>
          </el-col>
          <el-col :span="3" class="col-text-right">费用（元）：</el-col>
          <el-col :span="3">
            <el-input class="dialog-input" v-model="item.estimateMoney" maxlength="10" size="small"></el-input>
          </el-col>
          <el-col :span="2" class="col-text-right">备注：</el-col>
          <el-col :span="7">
            <el-input class="dialog-input" v-model="item.remark" maxlength="10" size="small"></el-input>
          </el-col>
          <el-button
            v-if="dialogHostlingInfo.length!=1"
            type="danger"
            size="small"
            style="border:none;margin-left:10px;"
            @click="deleteDialogHostlingInfo(index)"
          >删除</el-button>
          <el-button
            v-if="index==(dialogHostlingInfo.length-1) && index < 19"
            type="primary"
            size="small"
            style="border:none;margin-left:10px;"
            @click="addDialogHostlingInfo"
          >添加</el-button>
        </el-row>
      </el-row>
      <span slot="footer">
        <div class="dialog-footer">
          <span>整备项目：共{{dialogHostlingInfo.length}}项</span>
          <span>整备预算：共{{totalMoney}}元</span>
        </div>
        <el-button @click="editDialogHostling = false">关 闭</el-button>
        <el-button type="primary" @click="dialogEditConfirmSave(2)">提 交</el-button>
        <el-button type="primary" @click="dialogEditConfirmSave(1)">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog :visible="imgPreview" width="80%" @close="imgPreview=false">
      <el-carousel :autoplay="false" arrow="always" height="500px">
        <el-carousel-item v-for="item in imgPreviewList" :key="item">
          <el-image style="width: 100%; height: 100%" :src="item"></el-image>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
/*********************************************************************************************
 *                                车辆整备子订单信息详情
 ** @function closeApprovalLogDialog() 关闭流转记录
 ** @function openAppovalLogDialog(id) 打开流转记录  @param id 流转id
 ** @function closeDialog() 关闭弹窗
 ** @function closeHostlingDialog() 关闭父整备弹窗
 ** @function openCarFirstHost() 打开父整备弹窗
 ** @function getHostLingInfo() 获取整备信息
 ** @function formatHostling(val) 格式化整备信息 @param val value
 ** @function formatHostStatus(val) 格式化整备状态  @param val value
 ** @function formatWorkData(val) 格式化整备信息  @param val value
 ** @function invalidChildOrder(id) 作废整备单操作  @param id 整备单id
 ** @function ApplyButtonOperation(type) 正被单操作  @param type 操作类型
 ** @function confirmDialog() 确认弹窗
 ** @function showMessageBox() 页面弹窗
 *
 *********************************************************************************************/
import LookApprovalLogDialog from "@/components/carManagement/LookApprovalLogDialog"; //查看审批记录
export default {
  components: {
    LookApprovalLogDialog,
  },
  props: {
    hostlingId: "",
    optionBtn: {
      type: Boolean,
      default: true,
    },
    workNumber: "",
  },
  data() {
    return {
          buttonLimits: [],
      hostlingList: [],
      additionalList: [],
      auditLogData: [], //审核记录
      dialogHostling: true,
      showAppovalLogDialog: false, //查看审批记录
      dialogPushHostling: false, //追加整备项目
      dialogAdditionalHostlingInfo: [
        {
          name: "",
          estimateMoney: "",
          remark: "",
        },
      ],

      finalDialog: false, //结算单弹框
      finalDialogData: {},
      roleTypes: [],

      hostlingTableKeys: [
        {
          prop: "carId",
          title: "车辆ID",
        },
        {
          prop: "brandType",
          title: "品牌车型",
        },
        {
          prop: "vin",
          title: "VIN码",
        },
        {
          prop: "carNo",
          title: "车牌号",
        },
        {
          prop: "mileage",
          title: "行驶里程",
        },
        {
          prop: "inTime",
          title: "入库时间",
        },
      ],
      tableHeader: [
        {
          prop: "name",
          title: "整备项目",
        },
        {
          prop: "estimateMoney",
          title: "整备费用（元）",
        },
        {
          prop: "remark",
          title: "备注",
        },
      ],
      auditTableHeader: [
        {
          prop: "operation",
          title: "操作项",
        },
        {
          prop: "operationTime",
          title: "操作时间",
        },
        {
          prop: "people",
          title: "操作人",
        },
        {
          prop: "remark",
          title: "备注",
        },
      ],
      hostlingData: "",
      editDialogHostling: false,
      dialogHostlingInfo: [
        {
          name: "",
          estimateMoney: "",
          remark: "",
        },
      ],
      dialogHostlingData: {},
      dialogHostlingTableKeys: [
        {
          prop: "carId",
          title: "车辆ID",
        },
        {
          prop: "brandType",
          title: "品牌车型",
        },
        {
          prop: "vin",
          title: "VIN码",
        },
        {
          prop: "carNo",
          title: "车牌号",
        },
        {
          prop: "mileage",
          title: "行驶里程",
        },
        {
          prop: "inTime",
          title: "入库时间",
        },
      ],
      hostlingCascaderProps: {
        label: "hostlingName",
        value: "hostlingName",
        children: "hostlingProjectList",
      },
      editHostlingList: [],
      orderId: "",
      tableSettlementHeader: [
        {
          prop: "repairName",
          title: "维修厂名称",
        },
        {
          prop: "workTotalFee",
          title: "整备实际费用（元）",
        },
        {
          prop: "startTime",
          title: "整备开始时间",
        },
        {
          prop: "endTime",
          title: "结束时间",
        },
      ],
      settlementInfo: "",
      fileList: [],
      picValue: "",
      accountUrl: "",
      imgPreview: false,
      imgPreviewList: [],
    };
  },
  computed: {
    //获取vuex存储的已预览标签页
    totalMoney() {
      var totalMoney = 0;
      for (let index = 0; index < this.dialogHostlingInfo.length; index++) {
        const element = this.dialogHostlingInfo[index];
        totalMoney =
          Number(totalMoney) +
          Number(element.estimateMoney ? element.estimateMoney : 0);
      }
      return Number(totalMoney).toFixed(2);
    },
  },
  methods: {
    closeApprovalLogDialog() {
      this.showAppovalLogDialog = false;
    },
    openAppovalLogDialog(id) {
      this.orderId = id;
      this.showAppovalLogDialog = true;
    },
    closeDialog() {
      this.$emit("closedDialog");
    },
    getHostLingInfo() {
      var parmas = {
        id: this.hostlingId,
        workNum: this.workNumber,
      };
      this.$axios
        .post(this.pathItem.gethostInfo, parmas)
        .then((res) => {
          if (res.code == 0) {
            this.hostlingData = res.result;
            this.hostlingList = JSON.parse(res.result.items);
            this.additionalList = res.result.carWorkOrderList;
          }
        })
        .catch((res) => {});
    },
    getSettlementInfo() {
      var that = this;
      this.$axios
        .post(this.pathItem.checkOrderSettlement, { workId: this.hostlingId })
        .then((res) => {
          if (res.code == 0) {
            if (res.result) {
              this.settlementInfo = [res.result];
            }
          }
        })
        .catch((res) => {});
    },
    goSettle(row) {
      console.log(row);
      if (!row.accountUrl) {
        this.$message.error("暂无附件信息");
        return;
      }
      this.imgPreview = true;
      this.imgPreviewList = row.accountUrl.split(",");
    },
    formatHostling(val) {
      if (val == "brandType") {
        return (
          this.hostlingData.brandName +
          this.hostlingData.seriesName +
          this.hostlingData.modelName
        );
      }
      if (val == "mileage") {
        return this.hostlingData.mileage + "公里";
      }

      return this.hostlingData[val] ? this.hostlingData[val] : "--";
    },
    formatHostStatus(workStatus) {
      switch (workStatus) {
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
          return "验收完成";
          break;
        case 8:
          return "已作废";
          break;
        default:
          return "--";
          break;
      }
    },
    // 编辑整备
    editHostLing() {
      this.editDialogHostling = true;

      var elementData = JSON.parse(JSON.stringify(this.hostlingData));
      this.dialogHostlingData = elementData;
      const editList = JSON.parse(this.dialogHostlingData.items);
      this.dialogHostlingInfo = editList.map((item) => {
        item.name = this.returnHostLingArr(item.name);
        return item;
      });
    },
    formatWorkData(val) {
      if (val == "brandType") {
        return (
          this.dialogHostlingData.brandName +
          this.dialogHostlingData.seriesName +
          this.dialogHostlingData.modelName
        );
      }
      return this.dialogHostlingData[val] ? this.dialogHostlingData[val] : "";
    },
    getHostLingList() {
      this.$axios
        .post(this.pathItem.getHostlingList)
        .then((res) => {
          if (res.code == 0) {
            this.editHostlingList = res.result;
          }
        })
        .catch((res) => {});
    },
    hostlingChange(val, index) {
      if (val) {
        for (var i = 0; i < this.dialogHostlingInfo.length; i++) {
          if (val[1] == this.dialogHostlingInfo[i].name[1] && i !== index) {
            this.showMessageBox("error", "已添加该整备项目，请重新选择");
            this.dialogHostlingInfo[index].name = [];
            return false;
          }
        }
      }
    },
    additionalhostlingChange(val, index) {
      if (val) {
        for (var i = 0; i < this.dialogAdditionalHostlingInfo.length; i++) {
          if (
            val[1] == this.dialogAdditionalHostlingInfo[i].name[1] &&
            i !== index
          ) {
            this.showMessageBox("error", "已添加该整备项目，请重新选择");
            this.dialogAdditionalHostlingInfo[index].name = [];
            return false;
          }
        }
      }
    },
    returnHostLingArr(itemName) {
      for (var i = 0; i < this.editHostlingList.length; i++) {
        const element = this.editHostlingList[i];
        let isOk = element.hostlingProjectList.filter((item) => {
          return item.hostlingName == itemName;
        });
        if (isOk.length > 0) {
          return [element.hostlingName, itemName];
        }
      }
    },
    //添加整备项目信息
    addDialogHostlingInfo() {
      if (this.dialogHostlingInfo.length >= 20) {
        this.showMessageBox("error", "请注意：整备项目信息最多可添加20条！");
        return;
      }
      let info = {
        name: "",
        estimateMoney: "",
        remark: "",
      };
      this.dialogHostlingInfo.push(info);
    },
    //删除整备项目信息
    deleteDialogHostlingInfo(index) {
      this.dialogHostlingInfo.splice(index, 1);
    },

    dialogEditConfirmSave(type) {
      var that = this;
      var params = [];
      for (let index = 0; index < this.dialogHostlingInfo.length; index++) {
        const element = this.dialogHostlingInfo[index];
        if (!element.name) {
          this.showMessageBox("error", "请填写整备项目");
          return;
        }
        if (!element.estimateMoney) {
          this.showMessageBox("error", "请填写整备项目金额");
          return;
        }
        params.push({
          name: element.name[1],
          estimateMoney: element.estimateMoney,
          remark: element.remark,
        });
      }
      var hostlingParams = {
        id: this.hostlingId,
        carId: this.dialogHostlingData.carId,
        items: JSON.stringify(params),
        workStatus: type,
        workNumParent: this.dialogHostlingData.workNumParent,
        itemNum: this.dialogHostlingInfo.length,
        workFee: this.totalMoney,
      };
      this.$axios
        .post(this.pathItem.editHostlingInfo, hostlingParams)
        .then((res) => {
          if (res.code == 0) {
            this.showMessageBox("success", "提交成功");
            this.editDialogHostling = false;
            this.closeDialog();
          }
        })
        .catch((res) => {});
    },

    // 整备申请操作  type:  0---撤回  1---同意   2---驳回   8---录入结算单
    invalidChildOrder(id) {
      this.$prompt("请再次确认要作废此追加项目", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          var params = {};
          params.id = id;
          params.remark = value;
          this.$axios
            .post(this.pathItem.invalidHostlingItem, params)
            .then((res) => {
              if (res.code == 0) {
                this.showMessageBox("success", "操作成功");
                this.closeDialog();
              }
            });
        })
        .catch(() => {});
    },
    ApplyButtonOperation(type) {
      if (type == 0) {
        this.editHostLing();
      }
      if (type == 1) {
        let confirmFun = () => {
          var params = {};
          params.id = this.hostlingData.id;
          this.$axios
            .post(this.pathItem.reSubmitOrder, params)
            .then((res) => {
              if (res.code == 0) {
                this.showMessageBox("success", "提交成功");
                this.closeDialog();
              } else {
                this.showMessageBox("error", res.message);
              }
            })
            .catch((res) => {
              this.showMessageBox("error", res.message);
            });
        };
        let cancelFun = () => {};
        this.confirmDialog(
          "是否提交整备信息",
          confirmFun,
          cancelFun,
          "确定",
          "取消"
        );
      }
      if (type == 2) {
        this.$prompt(
          "请再次确认要作废此工单，其追加项目也会一并作废？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          }
        )
          .then(({ value }) => {
            var params = {};

            params.id = this.hostlingData.id;
            params.remark = value;
            this.$axios
              .post(this.pathItem.invalidHostlingItem, params)
              .then((res) => {
                if (res.code == 0) {
                  this.showMessageBox("success", "操作成功");
                  this.closeDialog();
                } else {
                  this.showMessageBox("error", res.message);
                }
              })
              .catch((res) => {
                this.showMessageBox("error", res.message);
              });
          })
          .catch(() => {});
      }
      if (type == 3) {
        let confirmFun = () => {
          var params = {};
          params.id = this.hostlingData.id;

          this.$axios
            .post(this.pathItem.recallHostling, params)
            .then((res) => {
              if (res.code == 0) {
                this.showMessageBox("success", "工单撤回成功");
                this.closeDialog();
              } else {
                this.showMessageBox("error", res.message);
              }
            })
            .catch((res) => {
              this.showMessageBox("error", res.message);
            });
        };
        let cancelFun = () => {};
        this.confirmDialog(
          "请再次确认要撤回此工单",
          confirmFun,
          cancelFun,
          "确定",
          "取消"
        );
      }
      if (type == 4) {
        let confirmFun = () => {
          var params = {};
          params.id = this.hostlingData.id;
          this.$axios
            .post(this.pathItem.agreeAndRejectWorkOrder, params)
            .then((res) => {
              if (res.code == 0) {
                this.showMessageBox("success", "车辆整备申请已通过");
                this.closeDialog();
              } else {
                this.showMessageBox("error", res.message);
              }
            })
            .catch((res) => {
              this.showMessageBox("error", res.message);
            });
        };
        let cancelFun = () => {};
        this.confirmDialog(
          "请再次确认要同意此工单",
          confirmFun,
          cancelFun,
          "确定",
          "取消"
        );
      }
      if (type == 5) {
        this.$prompt("请再次确认要驳回此工单", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputValidator: (val) => {
            if (val) {
              return true;
            }
            return false;
          },
          inputErrorMessage: "请输入驳回原因",
        })
          .then(({ value }) => {
            var params = {};

            params.id = this.hostlingData.id;
            params.remark = value;
            var url =
              this.hostlingData.workStatus == 2
                ? this.pathItem.rejectWorkOrder
                : this.pathItem.agreeAndRejectWorkOrder;

            this.$axios
              .post(url, params)
              .then((res) => {
                if (res.code == 0) {
                  this.closeDialog();
                } else {
                  this.showMessageBox("error", res.message);
                }
              })
              .catch((res) => {
                this.showMessageBox("error", res.message);
              });
          })
          .catch(() => {});
      }
      if (type == 6) {
        this.dialogPushHostling = true;
      }
      if (type == 7) {
        let confirmFun = () => {
          var params = {};
          params.id = this.hostlingData.id;
          this.$axios
            .post(this.pathItem.completeWorkOrder, params)
            .then((res) => {
              if (res.code == 0) {
                this.showMessageBox("success", "车辆整备完成");
                this.closeDialog();
              } else {
                this.showMessageBox("error", res.message);
              }
            })
            .catch((res) => {
              this.showMessageBox("error", res.message);
            });
        };
        let cancelFun = () => {};
        this.confirmDialog(
          "请再次确认要同意此工单",
          confirmFun,
          cancelFun,
          "确定",
          "取消"
        );
      }
      if (type == 8) {
        let confirmFun = () => {
          // var params = {};
          // params.id = this.hostlingData.id;
          // this.$axios
          //   .post(this.pathItem.checkAndAcceptWorkOrder, params)
          //   .then((res) => {
          //     if (res.code == 0) {
          //       this.showMessageBox(
          //         "success",
          //         "车辆验收成功，"
          //       );
          //       this.closeDialog();
          //     }
          //   });
        };
        let cancelFun = () => {};
        this.confirmDialog(
          "请于手机APP里生成验收报告",
          confirmFun,
          cancelFun,
          "确定",
          "取消"
        );
      }
      if (type == 9) {
        this.$router.push({
          path: "/carExamineReport",
          query: {
            carId: this.hostlingData.carId,
            reportType: 3,
          },
        });
      }
      if (type == 10) {
        let confirmFun = () => {
          var params = {};
          params.id = this.hostlingData.id;
          this.$axios
            .post(this.pathItem.reSubmitOrder, params)
            .then((res) => {
              if (res.code == 0) {
                this.showMessageBox("success", "车辆提交完成");
                this.closeDialog();
              } else {
                this.showMessageBox("error", res.message);
              }
            })
            .catch((res) => {
              this.showMessageBox("error", res.message);
            });
        };
        let cancelFun = () => {};
        this.confirmDialog(
          "请再次确认要重新提交此工单",
          confirmFun,
          cancelFun,
          "确定",
          "取消"
        );
      }
      if (type == 11) {
        this.finalDialog = true;
      }
    },
    confirmDialog(
      message,
      confirmFun,
      cancelFun,
      confirmButtonText = "确定",
      cancelButtonText = "取消"
    ) {
      this.$confirm(message, "提示", {
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
      })
        .then(confirmFun)
        .catch(cancelFun);
    },
    //添加追加整备项目信息
    additionalDialogHostlingInfo() {
      if (this.dialogAdditionalHostlingInfo.length == 20) {
        this.showMessageBox("error", "请注意：整备项目信息最多可添加20条！");
        return;
      }
      let info = {
        name: "",
        estimateMoney: "",
        remark: "",
      };
      this.dialogAdditionalHostlingInfo.push(info);
    },
    //删除追加整备项目信息
    deleteAdditionDialogHostlingInfo(index) {
      this.dialogAdditionalHostlingInfo.splice(index, 1);
    },
    dialogAddConfirmSave() {
      var that = this;
      var params = [];
      var addTotal = 0;
      for (
        let index = 0;
        index < this.dialogAdditionalHostlingInfo.length;
        index++
      ) {
        const element = this.dialogAdditionalHostlingInfo[index];

        if (!element.name) {
          this.showMessageBox("error", "请填写整备项目");
          return;
        }
        if (!element.estimateMoney) {
          this.showMessageBox("error", "请填写整备项目金额");
          return;
        }
        addTotal += Number(element.estimateMoney);
        params.push({
          name: element.name[1],
          estimateMoney: element.estimateMoney,
          remark: element.remark,
        });
      }
      var hostlingParams = {
        carId: this.hostlingData.carId,
        items: JSON.stringify(params),
        workStatus: 2,
        workNumParent: this.hostlingData.workNum,
        itemNum: this.dialogAdditionalHostlingInfo.length,
        workFee: Number(addTotal).toFixed(2),
      };
      this.$axios
        .post(this.pathItem.saveCarWorkOrder, hostlingParams)
        .then((res) => {
          if (res.code == 0) {
            this.showMessageBox("success", "提交成功");
            this.dialogPushHostling = false;
            this.closeDialog();
          } else {
            this.showMessageBox("error", res.message);
          }
        })
        .catch((res) => {});
    },

    // 结算
    addCarWorkAccont() {
      var params = {
        ...this.finalDialogData,
        workId: this.hostlingData.id,
        accountUrl: this.accountUrl,
      };
      this.$axios
        .post(this.pathItem.addCarWorkAccont, params)
        .then((res) => {
          if (res.code == 0) {
            this.showMessageBox("success", "添加成功");
            this.finalDialog = false;
            this.closeDialog();
          } else {
            this.showMessageBox("error", res.message);
          }
        })
        .catch((res) => {
          this.showMessageBox("error", res.message);
        });
    },
    beforeUpload(file) {
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      console.log(fileSuffix);
      if (
        fileSuffix == "jpg" ||
        fileSuffix == "png" ||
        fileSuffix == "jpeg" ||
        fileSuffix == "JPG" ||
        fileSuffix == "JPEG"
      ) {
        return true;
      } else {
        this.$message.error("只能添加jpg或png 的图片");
        return false;
      }
    },
    handleExceed(files, fileList) {
      this.$message.error(`最多上传15个文件`);
    },
    uploadfile(param) {
      this.picValue.append("multipartFiles", param.file);
    },
    saveImg() {
      this.picValue = new FormData();
      this.$refs.uploadSettlement.submit();
      if (!this.finalDialogData.repairName) {
        this.showMessageBox("error", "请输入维修厂名称");
        return;
      }
      if (!this.finalDialogData.workTotalFee) {
        this.showMessageBox("error", "请输入实际整备费用");
        return;
      }
      if (!this.finalDialogData.startTime) {
        this.showMessageBox("error", "请输入维修开始时间");
        return;
      }
      if (!this.finalDialogData.endTime) {
        this.showMessageBox("error", "请输入维修结束时间");
        return;
      }
      if (this.$refs.uploadSettlement.uploadFiles.length > 0) {
        this.$axios
          .post(this.pathItem.imagesUpload, this.picValue, {
            headers: {
              "Content-Type": "multipart/form-data",
              enctype: "multipart/form-data",
            },
          })
          .then((res) => {
            if (res.code == 0) {
              if (res.result.length > 0 && res.result) {
                var carFileList = [];
                res.result.forEach((item) => {
                  carFileList.push(item.objectUrl);
                });
                this.accountUrl = carFileList.join(",");
                this.addCarWorkAccont();
              }
            } else {
              this.$message.error(res.message);
            }
          })
          .catch((res) => {
            this.$message.error(res.message);
          });
      } else {
        this.addCarWorkAccont();
      }
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
  mounted() {},
  created() {
     this.buttonLimits = this.$route.meta.button;
    this.getHostLingInfo();
    this.getHostLingList();
    this.getSettlementInfo();
  },
};
</script>
<style lang="scss" scoped>
.carHostlingDialog {
  .button-slot {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
.table-vertical {
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
.dialog-footer {
  float: left;

  line-height: 42px;
  padding-right: 20px;
  span {
    color: red;
    margin-right: 40px;
  }
}
</style>