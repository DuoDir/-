<template>
  <el-container class="GroupEdit" v-loading="loading">
    <el-header class="header">
      <span>编辑集团</span>
    </el-header>
    <el-main> 
      <el-form label-width="100px" class="demo-ruleForm" size="mini" style="padding: 20px 20px;">
        <el-row class="el_row">
          <el-col :span="6">
            <el-form-item label="集团编号:" :required="true">
              <el-input v-model="groupNum" disabled  placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="集团简称:" :required="true">
              <el-input v-model="form.shortName" maxlength="30" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="集团全称:" :required="true">
              <el-input v-model="form.organizationName" maxlength="30" placeholder="请输入营业执照名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="集团电话:" :required="true">
              <el-input v-model="form.storeMobile" maxlength="12" @input="handlemoney($event, 'storeMobile', 'form')"  placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el_row">
          <el-col :span="6">
            <el-form-item label="集团城市:" :required="true">
              <el-col :span="8">
                <el-select v-model="form.provinceId" placeholder="省" @change="getCity('provinceId','CityOptions')">
                  <el-option v-for="item in ProvinceOptions" :label="item.label" :value="item.value" :key="item.index"/>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="form.cityId"  placeholder="市" @change="getCity('cityId','CountyOptions')">
                  <el-option v-for="item in CityOptions" :label="item.label" :value="item.value" :key="item.index"/>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="form.countyId" placeholder="县">
                  <el-option v-for="item in CountyOptions" :label="item.label" :value="item.value" :key="item.index"/>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="详细地址:" :required="true">
              <div class="all">
                <el-input id="suggestId" v-model="form.address" maxlength="30" placeholder="详细地址"></el-input>
                <div id="allmap"></div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="集团邮箱:" :required="true">
              <el-input v-model="form.email"  maxlength="30" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="负责人:" :required="true">
              <el-input v-model="form.principalName"  maxlength="30" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el_row">
          <el-col :span="6">
            <el-form-item label="联系电话:" :required="true">
              <el-input v-model="form.phoneNumber" maxlength="11" @input="handlemoney($event,'phoneNumber', 'form')" placeholder="请输入负责人手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="合作时间:" :required="true">
              <el-date-picker v-model="form.cooperationTime" type="date" placeholder="与长城集团合作开始时间" style="width:100%"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="银行账户:" :required="true">
              <el-input v-model="form.bankAccount" maxlength="30" @input="handlemoney($event, 'bankAccount', 'form')" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开户银行:" :required="true">
              <el-input v-model="form.bankName" maxlength="30"  placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el_row">
          <el-col :span="6">
            <el-form-item label="联行号:" :required="true">
              <el-input v-model="form.bankRelationNo" maxlength="30" @input="handlemoney($event, 'bankRelationNo', 'form')" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el_row">
          <el-form-item label="营业执照:" :required="true">
            <Uploadfile :echoImg="echobusinessImage" intoFormName='businessImage' removeEchoName="echobusinessImage" @getImgInfo="getImgInfo" @removeImgUrl="removeImgUrl"></Uploadfile>
          </el-form-item>
        </el-row>
        <el-row class="page-box">
          <el-button type="primary" @click="addCheck('form')">提 交</el-button>
          <el-button @click="close">取 消</el-button>
        </el-row>
      </el-form>
    </el-main>
  </el-container>
</template>
<script>
  import Uploadfile from '@/components/person/personUpload'
  export default {
    data() {
      return {
        groupNum: '',
        loading: false,
        form: {
          id: '',
          shortName: '',
          organizationName: '',
          storeMobile: '',
          provinceId: '',
          cityId: '',
          countyId: '',
          address: '',
          longitude: '',
          latitude: '',
          email: '',
          principalName: '',
          phoneNumber: '',
          cooperationTime: '',
          bankAccount: '',
          bankName: '',
          bankRelationNo: '',
          businessLicense: ""
        },
        ProvinceOptions: [],
        CityOptions: [],
        CountyOptions: [],
        businessImage: [], // 上传的文件
        echobusinessImage: [] // 回显的文件
      }
    },
    components: { Uploadfile },
    watch: {
      "form.address"(val) {
        if (val == '') {
          this.form.longitude = ''
          this.form.latitude = ''
        }
      }
    },
    created() {
      this.form.id = this.$route.query.id
      this.groupNum = this.$route.query.groupNum
    },
    mounted() {
      this.getProvince()
      this.echo()
      // 创建地图实例
      this.$nextTick(function () {
        var th = this
        // 创建Map实例
        var map = new BMap.Map("allmap");
        // 初始化地图,设置中心点坐标，
        var point = new BMap.Point(0,0);
        // // 创建点坐标，汉得公司的经纬度坐标
        map.centerAndZoom(point, 15);
        map.enableScrollWheelZoom();
		
        //建立一个自动完成的对象
        var ac = new BMap.Autocomplete({
          "input": "suggestId" ,
          "location": map
        })
        var myValue
        //鼠标点击下拉列表后的事件
        ac.addEventListener("onconfirm", function (e) { 
          var _value = e.item.value
          myValue = _value.province + _value.city + _value.district + _value.street + _value.business
          th.form.address = myValue
          console.log(myValue)
          setPlace(e)
        })
        function setPlace(e) {
          //清除地图上所有覆盖物
          map.clearOverlays()
          function myFun() {
            //获取第一个智能搜索的结果
              th.userlocation = local.getResults().getPoi(0).point
              map.centerAndZoom(th.userlocation, 18)
              //添加标注
              map.addOverlay(new BMap.Marker(th.userlocation))
              console.log(e.target.map.re)
              console.log(e) 
              let newpoint = e.target.map.re // 点击下拉选择地址 输出 经纬度
              th.form.longitude = newpoint.lng
              th.form.latitude = newpoint.lat
          }
          
          //智能搜索
          var local = new BMap.LocalSearch(map, {
            onSearchComplete: myFun
          });
          local.search(myValue)
          
        }
      })
    },
    methods: {
      // 回显
      echo() {
        this.loading = true
        this.$axios.post(this.pathItem.querySystemOrganizationDealer,{id: this.form.id})
        .then(res=>{
          this.loading = false
          if(res.code == 0){
            if (res.result.provinceId) {
              this.getCity(res.result.provinceId, 'CityOptions', 1)
            }
            if (res.result.cityId) {
              this.getCity(res.result.cityId, 'CountyOptions', 1)
            }
            Object.keys(this.form).forEach( item => {
              if (res.result[item]) {
                this.form[item] = res.result[item]
              }
            })
            if (res.result.businessLicense) {
              this.echobusinessImage = (res.result.businessLicense).split(',') //回显的图片
            }
          }else{
            this.errorMsg(res.message)
          }
        })
      },
      // 提交检查
      addCheck(formName) {
        if (
          this.form.shortName == ''||
          this.form.organizationName == ''||
          this.form.storeMobile == ''||
          this.form.provinceId == ''||
          this.form.cityId == ''||
          this.form.countyId == ''||
          this.form.address == ''||
          this.form.email == ''||
          this.form.principalName == ''||
          this.form.phoneNumber == ''||
          this.form.cooperationTime == ''||
          this.form.cooperationTime == null ||
          this.form.bankAccount == ''||
          this.form.bankName == ''||
          this.form.bankRelationNo == ''
        ) {
          this.errorMsg("请填写必填项")
          return;
        }
        if (this.form.storeMobile.length != 11 && this.form.storeMobile.length != 12) {
          this.errorMsg("集团电话只可输入11位或12位纯数字")
          return;
        }
        if (this.form.longitude == ''&&this.form.latitude == '') {
          this.errorMsg("请选择检索出的详细地址")
          return;
        }
        if (this.businessImage.length == 0 && this.echobusinessImage.length == 0) {
          this.errorMsg("请上传营业执照")
          return;
        }
        this.imagesUpload()
      },
      // 获取上传的图片信息
      getImgInfo(obj) {
        let name = obj.intoFormName
        let Fileinfo = obj.fileList
        if (Fileinfo.length > 0){
          this[name] = []
          Fileinfo.forEach( item=> {
            if (item.name != '1') { //将新添加的图片 添加到 businessImage里
              this[name].push( item.raw )
            }
          })
        }
      },
      // 如果删除回显照片
      removeImgUrl(obj) {
        let removeUrl = obj.url // 要删除的url
        let removeEchoName = obj.removeEchoName // 要删除 叫removeEchoName 的 数组里的url
        let removeIndex = this[removeEchoName].indexOf(removeUrl)
        this[removeEchoName].splice(removeIndex,1)
      },
      // 上传图片
      imagesUpload() {
        this.loading = true
        let formData = new FormData()
        this.businessImage.forEach( item => {
          formData.append('multipartFiles',item)
        })
        this.$axios.post(this.pathItem.imagesUpload, formData).then((res) => {
          if (res.code == 0) {
            let urlList = res.result.map( item => {
              return item.objectUrl
            })
            if (this.echobusinessImage.length > 0) { // 将回显的图片 与 上传的图片 合并
              urlList = urlList.concat(this.echobusinessImage) 
            }
            this.form.businessLicense = urlList.join()
            this.submit()
          } else {
            this.loading = false
            this.errorMsg(res.message)
          }
        }).catch( res => {
          this.loading = false
          this.errorMsg('上传失败')
        })
      },
      //提交
      submit() {
        this.form.cooperationTime = this.timestampToTime(this.form.cooperationTime)
        this.$axios.post(this.pathItem.upSystemOrganizationDealers,this.form)
        .then(res=>{
          this.loading = false
          if(res.code == 0){
            this.successMsg("编辑成功");
            let GroupEdit = {
              name: "GroupEdit",
            };
            this.$store.dispatch("delVisitedViews", GroupEdit).then(() => {
              this.$router.push({
                path: "/DealerGroup",
              });
            });
          }else{
            this.errorMsg(res.message);
          }
        }).catch( res => {
          this.loading = false
          this.errorMsg('编辑失败')
        })
      },
      // 获取省
      getProvince() {
        this.$axios.post(this.pathItem.querySystemCityList,{}).then((res) => {
          let data = res.result.systemCityList
          data.forEach( (item,index) => {
            let List = {
              label: item.name,
              value: item.code,
              index: index
            }
            this.ProvinceOptions.push(List)
          })
        });
      },
      // 获取市
      getCity(idname, Optionname ,n) {
        this[Optionname] = []
        let parentId = this.form[idname]
        if (n) {
          parentId = idname
        }
        this.$axios.post(this.pathItem.querySystemCityList,{parentId: parentId}).then((res) => {
          let data = res.result.systemCityList
          data.forEach( (item,index) => {
            let List = {
              label: item.name,
              value: item.code,
              index: index
            }
            this[Optionname].push(List)
          })
        });
      },
      uploadImgchange(file, fileList) {
        this.form.file = []
        fileList.forEach(ele => {
          this.form.file.push( ele )
        })
      },
      removeImgchange(file, fileList) {
        this.form.file = []
        fileList.forEach(ele => {
          this.form.file.push( ele )
        })
      },
      uploadrequest() {
        console.log(12)
      },
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      // 纯数字
      handlemoney(eve, name, form) {
        let neweve = eve.replace(/[^\d.]/g, "")
        this[form][name] = neweve
      },
      // 关闭页面
      close() {
        let GroupEdit = {
          name: "GroupEdit",
        };
        this.$store.dispatch("delVisitedViews", GroupEdit).then(() => {
          this.$router.push({
            path: '/DealerGroup'
          })
        });
      },
      // 时间戳转换时间
      timestampToTime(t) {
          if (t == null || t == '') {
          return ''
          }
          var date = new Date(t) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
          var Y = date.getFullYear() + "-"
          var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-"
          var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
          // var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours() + ":"
          // var m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes() + ":"
          // var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
          return Y + M + D;
      },
      // 错误提醒	
      errorMsg(msg) {this.$alert(msg, '提示', {confirmButtonText: '确定',type:'warning',})},
      // 成功提醒	
      successMsg(msg) {this.$message({message:msg, type:'success'})}}
  }
</script>
<style lang="scss" scoped>
  .GroupEdit{
    background: #fff;
    & /deep/  .el-input.is-disabled .el-input__inner {
      color: #000000;
    }
  }
  .el_row{
    line-height: 32px;
    margin-bottom: 10px;
  }
  .el-main{
    font-size: 14px;
  }
  .secText{
    display: inline-block;
    width: 70px;
    text-align: right;
    padding-right: 10px;
  }
  .el-input--small,.el-select--small,.el-cascader--small{/* small状态下input和select宽度 */
	  width: 200px;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  .w9{
    width: 90%;
  }
  .map{
    position: absolute;
    z-index: 1;
  }
</style>