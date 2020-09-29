<template>
  <div class="lookAprovalLogDialog">
    <el-dialog title="审批记录" :visible.sync="dialogVisible" width="60%" @close="closeDialog()">
      <el-table :data="tableData" border :header-cell-style="{background:'#f5f7fa',color:'#606266'}" style="width: 100%">
        <el-table-column v-for="item in tableHead" :key="item.prop" :prop="item.prop" :label="item.title" align="center">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialog">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/*********************************************************************************************
 *                                车辆整备审批详情
 ** @function getOrderLogInfo() 获取审批记录
 ** @function closeDialog() 关闭弹窗
 ** @function showMessageBox() 页面弹窗
 *
 *********************************************************************************************/
export default {
    props: {
      orderId: "",
    },
  data() {
    return {
      dialogVisible: true,
      tableData: [],
      tableHead: [
        {
          prop: "actionItems",
          title: "操作项",
        },
        {
          prop: "createdAt",
          title: "操作时间",
        },
        {
          prop: "operator",
          title: "操作人",
        },
        {
          prop: "remark",
          title: "备注",
        },
      ],
    };
  },
  methods: {
    closeDialog() {
      this.$emit("closedDialog");
    },
    getOrderLogInfo(){
      var params = {
        operatorId:this.orderId,
        operatorType:"1",
      }
      this.$axios.post(this.pathItem.checkOrderLog,params)
      .then(res=>{
        if(res.code == 0){
          this.tableData= res.result
        }
      })
      .catch(res=>{
  
      })

    }
  },
  created(){
    this.getOrderLogInfo();
  }
};
</script>