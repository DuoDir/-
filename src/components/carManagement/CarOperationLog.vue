<template>
  <div class="carOperationLog">
    <el-table :data="waterCarData" border v-loading="loading">
      <el-table-column type="index" width="80px" align="center" label="序号"></el-table-column>
      <template v-for="(item,index) in waterCarTable">
        <el-table-column :key="index" :prop="item.prop" :label="item.label" :width="item.width" show-overflow-tooltip align="center"></el-table-column>
      </template>
    </el-table>
    <div class="page-box" v-if="!loading">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
  </div>
</template>
<script>
/*********************************************************************************************
 *                                车辆操作日志详情
 ** @function getLogData() 获取操作日志
 ** @function handleSizeChange() 获取操作日志分页
 ** @function handleCurrentChange() 获取操作日志分页
 *
 *********************************************************************************************/
export default {
  props:{
    carInfo:""
  },
  data() {
    return {
      loading: false,
      waterCarData: [
        
      ],
      waterCarTable: [
        
        {
          prop: "createdAt",
          label: "操作时间",
        },
        {
          prop: "operator",
          label: "操作人",
        },
        {
          prop: "content",
          label: "操作内容",
        },
      ],
      total:0,
      currentPage:1,
      pageSize:10
    };
  },
  methods: {
    getLogData(){
      this.$axios.post(this.pathItem.getLogByTypeAndMainId,{
        mainId:this.carInfo.id,
        pageNo:this.currentPage,
        pageSize:this.pageSize,
        operateType:1,
      }).then(res=>{
        if(res.code == 0){
           this.waterCarData = res.result.records;
           this.total = res.result.total;
        }
      }).catch(res=>{
        this.$message.error(res.message)
      })
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.handleCurrentChange(1)
    },
    handleCurrentChange(val){
      this.currentPage = val;
      this.getLogData();
    }

  },
  mounted(){
    this.getLogData()
  }
};
</script>