<template>
  <el-container class="carDetails">
    <el-header class="header">客户信息</el-header>
    <el-main>
      <table class="table-vertical" style="width:100%">
        <tr>
          <td class="column">客户编号</td>
          <td>{{form.code}}</td>
          <td class="column">客户类型</td>
          <td>{{form.type}}</td>
          <td class="column">客户名称</td>
          <td>{{form.name}}</td>
        </tr>
        <tr>
          <td class="column">客户电话</td>
          <td>{{form.phone}}</td>
          <td class="column">身份证号</td>
          <td>{{form.idcard}}</td>
          <td class="column">客户生日</td>
          <td>{{form.birthday}}</td>
        </tr>
        <tr>
          <td class="column">微信号</td>
          <td>{{form.wx}}</td>
          <td class="column">客户性别</td>
          <td>{{form.sex}}</td>
          <td class="column">客户分类</td>
          <td>{{form.classify}}</td>
        </tr>
        <tr>
          <td class="column">接待/来电时间</td>
          <td>{{form.callTime}}</td>
          <td class="column">客户性质</td>
          <td>{{form.nature}}</td>
          <td class="column">企业名称</td>
          <td>{{form.businessName}}</td>
        </tr>
        <tr>
          <td class="column">客户等级</td>
          <td>{{form.level}}</td>
          <td class="column">介绍人</td>
          <td>{{form.sponsor}}</td>
          <td class="column">经销商</td>
          <td>{{form.storeName}}</td>
        </tr>
        <tr>
          <td class="column">客户来源</td>
          <td>{{form.source}}</td>
          <td class="column">联系地址</td>
          <td>{{form.province}}{{form.city}}{{form.detail}}</td>
          <td class="column">销售顾问</td>
          <td>{{form.salesAdvisorName}}</td>
        </tr>
        <tr>
          <td class="column">创建人</td>
          <td>{{form.createUserName}}</td>
          <td class="column">创建时间</td>
          <td>{{form.createTime}}</td>
          <td class="column">备注信息</td>
          <td>{{form.bak}}</td>
        </tr>
      </table>
      <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top:50px;">
        <el-tab-pane label="需求信息" name="first">
          <table class="table-vertical" style="width:100%">
            <tr>
              <td class="column">需求类型</td>
              <td>{{form.needType}}</td>
              <td class="column">意向品牌车型</td>
              <td>{{form.needBrand}}-{{form.needAudi}}-{{form.needCarmodel}}</td>
              <td class="column">颜色要求</td>
              <td>{{form.color}}</td>
            </tr>
            <tr>
              <td class="column">变速箱要求</td>
              <td>{{form.transmission}}</td>
              <td class="column">排气量要求(L/T)</td>
              <td>{{form.airDisplacementLow}}-{{form.airDisplacementUp}}{{form.airDisplacementUnit}}</td>
              <td class="column">车龄要求(年)</td>
              <td>{{form.ageLow}}-{{form.ageUp}}</td>
            </tr>
            <tr>
              <td class="column">里程要求(公里)</td>
              <td>{{form.mileageLow}}-{{form.mileageUp}}</td>
              <td class="column">价格要求(元)</td>
              <td>{{form.priceLow}}-{{form.priceUp}}</td>
              <td class="column">客户来源地</td>
              <td>{{form.province}}{{form.city}}{{form.detail}}</td>
            </tr>
            <tr>
              <td class="column">是否分期</td>
              <td>{{form.isStage}}</td>
              <td class="column">首付比例</td>
              <td>{{form.downPaymentRatio}}</td>
              <td class="column">已看车型</td>
              <td>{{form.vehicleModel}}</td>
            </tr>
          </table>
        </el-tab-pane>
        <el-tab-pane label="跟进记录" name="second">
          <el-table class="tableBox" :data="followRecord" border style="width: 100%">
            <el-table-column prop="status" label="跟进状态" />
            <el-table-column prop="contact" label="联系方式" />
            <el-table-column prop="reasonDefeat" label="战败原因" />
            <el-table-column prop="bak" label="跟进内容" />
            <el-table-column prop="followUpPeople" label="跟进人" />
            <el-table-column prop="time" label="跟进时间" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="订单详情" name="third">
          <el-table class="tableBox" :data="carDetailInfo" border style="width: 100%">
            <el-table-column prop="orderNo" label="订单号" />
            <el-table-column prop="organiztionName" label="经销商" />
            <el-table-column prop="brandModels" label="品牌型号" />
            <el-table-column prop="carSource" label="车辆来源" />
            <el-table-column prop="authenticationStatus" label="是否认证车" />
            <el-table-column prop="salesConsultantName" label="销售顾问" />
            <el-table-column prop="orderStatus" label="订单状态" />
            <el-table-column prop="createdAt" label="创建时间" />
            <el-table-column label="操作">
              <template slot-scope='{row}'>
                <el-button size="mini" type="primary" @click="jumpDetail(row.id)" plain icon="el-icon-document">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div class="page-box" style="height: 150px;"></div>
    </el-main>
  </el-container>
</template>

<script>
/*********************************************************************************************
 **                                  客户详情数据方法说明
 ** @function handleClick 切换选项卡
 ** @function jumpDetail 订单详情跳转
 ** @function echo 回显
 *********************************************************************************************/
export default {
  data() {
    return {
      activeName: "first",
      carDetailInfo: [],
      followRecord: [],
      form: {
        // 客户信息
        id: "",
        code: "",
        type: "",
        name: "",
        phone: "",
        idcard: "",
        birthday: "",
        wx: "",
        sex: "",
        classify: "直客",
        callTime: "",
        nature: "",
        businessName: "",
        level: "",
        source: "", // 客户来源
        sponsor: "", // 介绍人
        storeName: "", // 经销商
        salesAdvisorName: "", // 销售顾问
        province: "",
        city: "",
        detail: "",
        bak: "",
        // 客户需求
        needType: "", // 需求类型
        transmission: "", // 变速器要求
        airDisplacementLow: "", // 排气量 低
        airDisplacementUp: "", // 排气量 高
        airDisplacementUnit: "", // 排气量单位
        color: "", // 颜色
        ageLow: "", // 车龄 低
        ageUp: "", // 车龄 高
        mileageLow: "", // 里程 低
        mileageUp: "", // 里程 高
        priceLow: "", // 价格 低
        priceUp: "", // 价格 高
        isStage: "", // 是否分期
        downPaymentRatio: "", // 首付比例
        vehicleModel: "", //已看车型
        needAudi: "", //意向车系|
        needCarmodel: "", // 意向车型 |
        needBrand: "", //意向品牌|
      },
    };
  },
  created() {
    this.form.id = this.$route.query.id; // 客户id
  },
  mounted() {
    this.echo();
  },
  methods: {
    // 回显
    echo() {
      this.loading = true;
      // 客户信息
      this.$axios
        .post(this.pathItem.customerInfo, { id: this.form.id })
        .then((res) => {
          this.loading = false;
          if (res.code == 0) {
            this.form.code = res.result.code == null ? "" : res.result.code; //客户编号
            this.form.name = res.result.name == null ? "" : res.result.name; // 客户名称
            this.form.phone = res.result.phone == null ? "" : res.result.phone; // 客户电话
            this.form.idcard =
              res.result.idcard == null ? "" : res.result.idcard; // 身份证号
            this.form.birthday =
              res.result.birthday == null ? "" : res.result.birthday; // 客户生日
            this.form.wx = res.result.wx == null ? "" : res.result.wx; // 微信号
            this.form.callTime =
              res.result.callTime == null ? "" : res.result.callTime; // 接待时间
            this.form.businessName =
              res.result.businessName == null ? "" : res.result.businessName; // 企业名称
            this.form.sponsor =
              res.result.sponsor == null ? "" : res.result.sponsor; // 介绍人
            this.form.createUserName =
              res.result.createUserName == null
                ? ""
                : res.result.createUserName; // 创建人
            this.form.createTime =
              res.result.createTime == null ? "" : res.result.createTime; // 创建时间
            this.form.storeName =
              res.result.storeName == null ? "" : res.result.storeName; // 经销商
            this.form.salesAdvisorName =
              res.result.salesAdvisorName == null
                ? ""
                : res.result.salesAdvisorName; // 销售顾问
            this.form.province =
              res.result.province == null ? "" : res.result.province; // 省
            this.form.city = res.result.city == null ? "" : res.result.city; // 市
            this.form.detail =
              res.result.detail == null ? "" : res.result.detail; // 详细地址
            this.form.bak = res.result.bak == null ? "" : res.result.bak; // 备注信息
            this.form.vehicleModel =
              res.result.vehicleModel == null ? "" : res.result.vehicleModel; // 已看车型
            this.form.sex = res.result.sex == null ? "" : res.result.sex; // 客户性别
            if (this.form.sex == "1") {
              this.form.sex = "男";
            } else if (this.form.sex == "2") {
              this.form.sex = "女";
            } else if (this.form.sex == "3") {
              this.form.sex = "保密";
            }
            this.form.type = res.result.type == null ? "" : res.result.type; // 客户类型
            if (this.form.type == "1") {
              this.form.type = "潜在";
            } else if (this.form.type == "2") {
              this.form.type = "有效";
            } else if (this.form.type == "3") {
              this.form.type = "战败";
            }
            this.form.classify =
              res.result.classify == null ? "1" : res.result.classify; // 客户分类
            if (this.form.classify == "1") {
              this.form.classify = "直客";
            } else if (this.form.classify == "2") {
              this.form.classify = "车商";
            } else if (this.form.classify == "3") {
              this.form.classify = "平台";
            } else if (this.form.classify == "4") {
              this.form.classify = "中间人";
            }
            this.form.nature =
              res.result.nature == null ? "" : res.result.nature; // 客户性质
            if (this.form.nature == "1") {
              this.form.nature = "个人";
            } else if (this.form.nature == "2") {
              this.form.nature = "企业";
            } else if (this.form.nature == "3") {
              this.form.nature = "其他";
            }
            this.form.level = res.result.level == null ? "" : res.result.level; // 客户等级
            if (this.form.level == "1") {
              this.form.level = "A";
            } else if (this.form.level == "2") {
              this.form.level = "B";
            } else if (this.form.level == "3") {
              this.form.level = "C";
            } else if (this.form.level == "4") {
              this.form.level = "N";
            } else if (this.form.level == "5") {
              this.form.level = "H";
            }
            if (res.result.source != "" && res.result.source != null) {
              // 客户来源
              this.form.source = res.result.source;
              switch (this.form.source) {
                case "1":
                  this.form.source = "主动来电";
                  break;
                case "2":
                  this.form.source = "主动到店";
                  break;
                case "3":
                  this.form.source = "朋友介绍";
                  break;
                case "4":
                  this.form.source = "公司网站";
                  break;
                case "5":
                  this.form.source = "报纸广告";
                  break;
                case "6":
                  this.form.source = "汽车之家";
                  break;
                case "7":
                  this.form.source = "58同城";
                  break;
                case "8":
                  this.form.source = "易车网";
                  break;
                case "9":
                  this.form.source = "展会促销";
                  break;
                case "10":
                  this.form.source = "淘车网";
                  break;
                case "11":
                  this.form.source = "51汽车网";
                  break;
                case "12":
                  this.form.source = "赶集网";
                  break;
              }
            } else if (
              res.result.sourceBak != "" &&
              res.result.sourceBak != null
            ) {
              this.form.source = res.result.sourceBak;
            }
          } else {
            this.errorMsg(res.message);
          }
        });
      // 客户需求
      this.$axios
        .post(this.pathItem.customerNeedInfo, { customerId: this.form.id })
        .then((res) => {
          if (res.code == 0) {
            this.form.airDisplacementLow =
              res.result.airDisplacementLow == null
                ? ""
                : res.result.airDisplacementLow; // 排气量 低
            this.form.airDisplacementUp =
              res.result.airDisplacementUp == null
                ? ""
                : res.result.airDisplacementUp; // // 排气量 高
            this.form.airDisplacementUnit =
              res.result.airDisplacementUnit == null
                ? ""
                : res.result.airDisplacementUnit; // 排气量 单位

            this.form.ageLow =
              res.result.ageLow == null ? "" : res.result.ageLow; // 车龄要求 低
            this.form.ageUp = res.result.ageUp == null ? "" : res.result.ageUp; // 车龄要求 高
            this.form.mileageLow =
              res.result.mileageLow == null ? "" : res.result.mileageLow; // 里程 低
            this.form.mileageUp =
              res.result.mileageUp == null ? "" : res.result.mileageUp; // 里程 高
            this.form.priceLow =
              res.result.priceLow == null ? "" : res.result.priceLow; // 价格 低
            this.form.priceUp =
              res.result.priceUp == null ? "" : res.result.priceUp; // 价格 高
            this.form.downPaymentRatio =
              res.result.downPaymentRatio == null
                ? ""
                : res.result.downPaymentRatio; // 首付比例

            this.form.needBrand =
              res.result.needBrand == null ? "" : res.result.needBrand; // 品牌
            this.form.needAudi =
              res.result.needAudi == null ? "" : res.result.needAudi; // 车系
            this.form.needCarmodel =
              res.result.needCarmodel == null ? "" : res.result.needCarmodel; // 车型
            this.form.needType =
              res.result.needType == null ? "" : res.result.needType; // 需求类型
            if (this.form.needType == "1") {
              this.form.needType = "轿车";
            } else if (this.form.needType == "2") {
              this.form.needType = "SUV";
            } else if (this.form.needType == "3") {
              this.form.needType = "MVP";
            } else if (this.form.needType == "4") {
              this.form.needType = "跑车";
            } else if (this.form.needType == "5") {
              this.form.needType = "新能源";
            }
            this.form.transmission =
              res.result.transmission == null ? "" : res.result.transmission; // 变速器要求
            if (this.form.transmission == "1") {
              this.form.transmission = "自动";
            } else if (this.form.transmission == "2") {
              this.form.transmission = "手动";
            }
            if (res.result.color != "" && res.result.color != null) {
              // 颜色要求
              this.form.color = res.result.color;
            } else if (
              res.result.colorBak != "" &&
              res.result.colorBak != null
            ) {
              this.form.color = res.result.colorBak;
            }
            this.form.isStage =
              res.result.isStage == null ? "" : res.result.isStage; // 是否分期
            if (this.form.isStage == "1") {
              this.form.isStage = "是";
            } else if (this.form.isStage == "2") {
              this.form.isStage = "否";
            }
          } else {
            this.errorMsg(res.message);
          }
        });
    },
    // 获取跟进记录
    getcustomerFollowUpList() {
      this.$axios
        .post(this.pathItem.customerFollowUpList, { customerId: this.form.id })
        .then((res) => {
          if (res.code == 0) {
            this.followRecord = [];
            res.result.forEach((item) => {
              let List = {
                status: item.status,
                contact: item.contact,
                reasonDefeat: item.reasonDefeat,
                bak: item.bak,
                followUpPeople: item.followUpPeople,
                time: this.timestampToTime(item.time),
              };
              if (item.status == 1) {
                List.status = "初步沟通";
              } else if (item.status == 2) {
                List.status = "意向";
              } else if (item.status == 3) {
                List.status = "预定";
              } else if (item.status == 4) {
                List.status = "成交";
              } else if (item.status == 5) {
                List.status = "战败";
              }
              if (item.contact == 1) {
                List.contact = "电话联系";
              } else if (item.contact == 2) {
                List.contact = "当面沟通";
              } else if (item.contact == 3) {
                List.contact = "邮件联系";
              } else if (item.contact == 4) {
                List.contact = "客户回访";
              } else if (item.contact == 5) {
                List.contact = "微信";
              } else if (item.contact == 6) {
                List.contact = "其他方式";
              } else if (item.contact == 7) {
                List.contact = "短信";
              }
              if (item.reasonDefeat == 1) {
                List.reasonDefeat = "未知";
              } else if (item.reasonDefeat == 2) {
                List.reasonDefeat = "买新车";
              } else if (item.reasonDefeat == 3) {
                List.reasonDefeat = "从别处购车";
              } else if (item.reasonDefeat == 4) {
                List.reasonDefeat = "不感兴趣";
              } else if (item.reasonDefeat == 5) {
                List.reasonDefeat = "其他原因";
              }
              this.followRecord.push(List);
            });
          } else {
            this.errorMsg(res.message);
          }
        });
    },
    // 获取订单信息
    getqueryCarOrderPage() {
      this.$axios
        .post(this.pathItem.queryCarOrderPage, {
          pageNum: 1,
          pageSize: 10,
          carOrder: {
            customerId: this.form.id,
          },
        })
        .then((res) => {
          if (res.code == 0) {
            this.carDetailInfo = [];
            res.result.records.forEach((item) => {
              let List = {
                id: item.id,
                orderNo: item.orderNo,
                organiztionName: item.organiztionName,
                brandModels: item.brandModels,
                carSource: item.carSource,
                authenticationStatus: item.authenticationStatus,
                salesConsultantName: item.salesConsultantName,
                orderStatus: item.orderStatus,
                createdAt: item.createdAt,
              };
              if (item.carSource == 1) {
                // 车辆来源
                List.carSource = "外采";
              } else if (item.carSource == 2) {
                List.carSource = "寄售";
              } else if (item.carSource == 3) {
                List.carSource = "置换";
              } else if (item.carSource == 4) {
                List.carSource = "退换车";
              } else if (item.carSource == 5) {
                List.carSource = "出口";
              }
              if (item.authenticationStatus == 1) {
                // 是否认证车
                List.authenticationStatus = "已经认证";
              } else if (item.authenticationStatus == 2) {
                List.authenticationStatus = "未认证";
              }
              if (item.orderStatus == 1) {
                // 订单状态
                List.orderStatus = "已预定";
              } else if (item.orderStatus == 2) {
                List.orderStatus = "已成交";
              } else if (item.orderStatus == 3) {
                List.orderStatus = "已取消";
              } else if (item.orderStatus == 4) {
                List.orderStatus = "已退车";
              }
              this.carDetailInfo.push(List);
            });
            console.log(this.carDetailInfo);
          } else {
            this.errorMsg(res.message);
          }
        });
    },
    // 切换选项卡
    handleClick(tab, event) {
      if (tab.name == "second") {
        this.getcustomerFollowUpList();
      } else if (tab.name == "third") {
        this.getqueryCarOrderPage();
      }
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
      var D =
        date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
      var h =
        date.getHours() < 10
          ? "0" + date.getHours() + ":"
          : date.getHours() + ":";
      var m =
        date.getMinutes() < 10
          ? "0" + date.getMinutes() + ":"
          : date.getMinutes() + ":";
      var s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    },
    // 跳转订单详情
    jumpDetail(id) {
      this.$router.push({
        path: "/carOrderDetail",
        query: { orderId: id },
      });
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
.carDetails {
  background: #fff;
}
.el-main {
  padding: 0px 30px;
}
.table-vertical {
  border-collapse: collapse;
  margin-top: 50px;
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

.tableBox {
  margin-top: 50px;
}
.tableBox /deep/ th {
  background: #f5f7fa;
  color: #000;
}
</style>