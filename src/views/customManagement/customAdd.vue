<template>
  <el-container class="customAdd" v-loading="loading">
    <el-header class="header">客户建卡</el-header>
    <el-main>
      <p><span class="pageTitle">客户信息</span></p>
      <el-form :model="form" ref="form" :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-row  class="el_row">
          <el-col :span="6" >
            <el-form-item label="客户名称:" >
              <el-input v-model="form.name"  maxlength="30"  placeholder="请输入客户名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户电话:" prop="phone">
              <el-input v-model="form.phone" @input="handlemoney($event,'phone')"  maxlength="11"  placeholder="请输入客户电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份证号:" >
              <el-input v-model="form.idcard"  maxlength="18" @blur="checkoutIDcard" @input="handlemoney($event,'idcard',3)" placeholder="请输入身份证号"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户生日:" >
              <el-input v-model="form.birthday"  maxlength="15"  placeholder="客户生日(xx月xx日)"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  class="el_row">
          <el-col :span="6" >
            <el-form-item label="微信号:" >
              <el-input v-model="form.wx"  maxlength="30"  placeholder="请输入微信号"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户性别:" >
              <el-select v-model="form.sex"  placeholder="请选择">
                <el-option label="男" value="1"/>
                <el-option label="女" value="2"/>
                <el-option label="保密" value="3"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户分类:" >
              <el-select v-model="form.classify"  placeholder="请选择">
                <el-option label="直客" value="1"/>
                <el-option label="车商" value="2"/>
                <el-option label="平台" value="3"/>
                <el-option label="中间人" value="4"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="接待/来电时间:" >
              <el-date-picker v-model="form.callTime"  type="datetime" placeholder="选择日期时间" style="width:100%;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  class="el_row">
          <el-col :span="6" >
            <el-form-item label="客户性质:" >
              <el-select v-model="form.nature"  placeholder="请选择">
                <el-option label="个人" value="1"/>
                <el-option label="企业" value="2"/>
                <el-option label="其他" value="3"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="form.nature==2">
            <el-form-item label="企业名称:" >
              <el-input v-model="form.businessName"  maxlength="30"  placeholder="请输入客户名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户等级:" >
              <el-select v-model="form.level"  placeholder="请选择">
                <el-option label="H (2日内跟进)"  value="5"/>
                <el-option label="A (7日内跟进)"  value="1"/>
                <el-option label="B (15日内跟进)" value="2"/>
                <el-option label="C (30日内跟进)" value="3"/>
                <el-option label="N (45日内跟进)" value="4"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户来源:" >
              <el-col :span="12" style="padding:0px;">
                <el-select v-model="form.source"  @change="form.sourceBak=''" placeholder="请选择">
                  <el-option label="主动来电" value="1"/>
                  <el-option label="主动到店" value="2"/>
                  <el-option label="朋友介绍" value="3"/>
                  <el-option label="公司网站" value="4"/>
                  <el-option label="报纸广告" value="5"/>
                  <el-option label="汽车之家" value="6"/>
                  <el-option label="58同城" value="7"/>
                  <el-option label="易车网" value="8"/>
                  <el-option label="展会促销" value="9"/>
                  <el-option label="淘车网" value="10"/>
                  <el-option label="51汽车网" value="11"/>
                  <el-option label="赶集网" value="12"/>
                </el-select>
              </el-col>
              <el-col :span="12" style="padding:0px;">
                <el-input v-model="form.sourceBak" @input="form.source=''"  placeholder="其他途径"/>
              </el-col>
            </el-form-item>
          </el-col>
          
        </el-row>
        <el-row  class="el_row">
          <el-col :span="6"  >
            <el-form-item label="介绍人:" >
              <el-input v-model="form.sponsor"  maxlength="30"  placeholder="请输入介绍人"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="经销商:" >
              <el-input v-model="form.storeName"  disabled maxlength="30"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="销售顾问:" >
              <el-select v-model="form.salesAdvisorId"  placeholder="请选择">
                <el-option v-for="(item,index) in salesAdvisorOptions" :label="item.label" :value="item.value" :key="index"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="已看车型:" >
              <el-input v-model="form.vehicleModel"  placeholder="请输入已看车型"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  class="el_row">
            <el-col :span="20" >
            <el-form-item label="联系地址:" >
              <span style="display:inline-block;width:10%;">
                <el-select v-model="form.provinceCode" @change="getCity($event)"  placeholder="省">
                  <el-option v-for="(item,index) in ProvinceOptions" :label="item.name" :value="item.code" :key="index"/>
                </el-select>
              </span>
              <span style="display:inline-block;width:10%;">
                <el-select v-model="form.cityCode"  placeholder="市">
                  <el-option v-for="(item,index) in cityOptions" :label="item.name" :value="item.code" :key="index"/>
                </el-select>
              </span>
              <span style="display:inline-block;width:40%;">
                <el-input v-model="form.detail"  maxlength="50" placeholder="详细地址"/>
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  class="el_row">
          <el-col :span="10" >
            <el-form-item label="备注信息:" >
              <el-input type="textarea" v-model="form.bak" maxlength="200" placeholder="请输入客户备注信息"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 客户需求 -->
        <p><span class="pageTitle">客户需求</span></p>
        <el-row  class="el_row">
          <el-col :span="6">
            <el-form-item label="需求类型:" >
              <el-select v-model="form.needType"  placeholder="请选择">
                <el-option label="轿车" value="1"/>
                <el-option label="SUV" value="2"/>
                <el-option label="MVP" value="3"/>
                <el-option label="跑车" value="4"/>
                <el-option label="新能源" value="5"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="变速器要求:" >
              <el-select v-model="form.transmission"  placeholder="请选择">
                <el-option label="自动" value="1"/>
                <el-option label="手动" value="2"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排气量要求:" >
              <el-col :span="6" style="padding:0px;">
                <el-input v-model="form.airDisplacementLow" @input="handlemoney($event,'airDisplacementLow',1)" />
              </el-col>
              <el-col :span="1" style="padding-left:5px;padding-right:5px;">-</el-col>
              <el-col :span="6" style="padding:0px;padding-left:5px;">
                <el-input v-model="form.airDisplacementUp" @input="handlemoney($event,'airDisplacementUp',1)" />
              </el-col>
              <el-col :span="6" style="padding:0px;padding-left:5px;">
                <el-select v-model="form.airDisplacementUnit"  placeholder="L/T">
                  <el-option label="L" value="L"/>
                  <el-option label="T" value="T"/>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="意向品牌车型:" >
              <el-col :span="5">
                <el-select v-model="form.brandId" multiple collapse-tags  @change="getCarSetByCarId" placeholder="品牌">
                  <el-option v-for='(item,index) in carBrandList' :label="item.label" :value="item.value" :key="index"/>
                </el-select>
              </el-col>
              <el-col :span="7">
                <el-select v-model="form.seriesId"  multiple collapse-tags @change="getCarModelByCarSetId" :disabled="form.brandId.length>1?true:false" placeholder="车系">
                  <el-option v-for='(item,index) in carSetList' :label="item.label" :value="item.value" :key="index"/>
                </el-select>
              </el-col>
              <el-col :span="10">
                <el-select v-model="form.modelId" multiple collapse-tags :disabled="(form.brandId.length>1)||(form.seriesId.length>1)?true:false"  placeholder="车型">
                  <el-option v-for='(item,index) in carModelList' :label="item.label" :value="item.value" :key="index"/>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  class="el_row">
          <el-col :span="22" >
              <el-form-item label="颜色要求:" >
                  <span v-for="(item,index) in colorList" :class="{'orange':item.flag==true}" :key="index"  @click="changeColor(item.index)" class="colorblock">
                    <img :src="item.img" style="position:relative;left: 10px;top: 4.5px;display:inline-block;width:15px;height:15px;border:1px solid #dedede;"></img>
                    <span style="position:relative;left: 12px;top: 1px;display:inline-block;">{{item.label}}</span>
                  </span>
                  <span style="display:inline-block;">
                    <el-input v-model="form.colorBak"   @input="changeOtherColor"  placeholder="其他颜色"/>
                  </span>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row  class="el_row">
          <el-col :span="6" >
            <el-form-item label="车龄要求:" >
              <el-col :span="10" style="padding:0px;">
                <el-input v-model="form.ageLow" maxlength="2" @input="handlemoney($event,'ageLow',1)" />
              </el-col>
              <el-col :span="1" style="padding-left:5px;padding-right:5px;">-</el-col>
              <el-col :span="10" style="padding:0px;padding-left:5px;">
                <el-input v-model="form.ageUp" maxlength="2" @input="handlemoney($event,'ageUp',1)" />
              </el-col>
              <el-col :span="1" style="padding:0px;padding-left:5px;">
                年
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="里程要求:" >
              <el-col :span="8" style="padding:0px;">
                <el-input v-model="form.mileageLow" @input="handlemoney($event,'mileageLow',2)" />
              </el-col>
              <el-col :span="1" style="padding-left:5px;padding-right:5px;">-</el-col>
              <el-col :span="8" style="padding:0px;padding-left:5px;">
                <el-input v-model="form.mileageUp" @input="handlemoney($event,'mileageUp',2)" />
              </el-col>
              <el-col :span="6" style="padding:0px;padding-left:5px;">
                公里
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="价格要求:" >
              <el-col :span="10" style="padding:0px;">
                <el-input v-model="form.priceLow"  @input="handlemoney($event,'priceLow',2)" ></el-input>
              </el-col>
              <el-col :span="1" style="padding-left:5px;padding-right:5px;">-</el-col>
              <el-col :span="10" style="padding:0px;padding-left:5px;">
                <el-input v-model="form.priceUp"  @input="handlemoney($event,'priceUp',2)" ></el-input>
              </el-col>
              <el-col :span="1" style="padding:0px;padding-left:5px;">
                元
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否分期:" >
              <el-radio v-model="form.isStage" label="1">是</el-radio>
              <el-radio v-model="form.isStage" label="2">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  class="el_row">
          <el-col :span="6" >
            <el-form-item label="首付比例:" >
              <el-input v-model="form.downPaymentRatio" maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="page-box" style="height: 150px;">
        <el-button type="primary" @click="SaveCheck('form')">保 存</el-button>
        <el-button @click="closePage">关 闭</el-button>
      </div>
    </el-main>
  </el-container>
</template>
<script>
/*********************************************************************************************
 **                                  客户建卡数据方法说明 
 ** @function queryCustomerBrandAndCarSeries 查询客户已看品牌和车系（二维数组）
 ** @function checkoutIDcard 根据身份证号 查出生日 
 ** @function timestampToTime 转换时间格式
 ** @function handlemoney 限制数字
 ** @function changeColor 更换颜色
 ** @function Save 保存
 *********************************************************************************************/
export default {
    data() {
        return {
          userinfo: {},
          form: {
            // 客户信息
            name: '',
            phone: '',
            idcard: '',
            birthday: '',
            wx: '',
            sex: '',
            classify: '1',
            callTime: '',
            nature: '',
            businessName: '',
            level: '',
            source: '',
            sourceBak: '',
            sponsor: '',
            storeName: '',
            storeId: '',
            salesAdvisorId: '',
            salesAdvisorName: '',
            vehicleModel: '',
            province: '',
            provinceCode: '',
            city: '',
            cityCode: '',
            detail: '',
            bak: '',
            // 客户需求
            customerId: '', // 客户id
            needType: '', // 需求类型
            transmission: '1', // 变速器要求
            airDisplacementLow: '', // 排气量 低
            airDisplacementUp: '', // 排气量 高
            airDisplacementUnit: '', // 排气量单位
            color: "", // 颜色
            colorBak: '', // 其他颜色
            ageLow: '', // 车龄 低
            ageUp: '', // 车龄 高
            mileageLow: '', // 里程 低
            mileageUp: '', // 里程 高
            priceLow: '', // 价格 低
            priceUp: '', // 价格 高
            isStage: '', // 是否分期
            downPaymentRatio: '', // 首付比例
            needAudi: [],//意向车系|
            needCarmodel: [], // 意向车型 |
            needBrand: [],//意向品牌|
            brandId: [], // 品牌id
            seriesId: [], // 车系id
            modelId: [] // 车型id
          },
          // 下拉
          carBrandList: [],
          carSetList: [],
          carModelList: [],
          ProvinceOptions: [],
          cityOptions: [],
          salesAdvisorOptions: [],
          colorList: [
              {
                  label: '黑色',
                  index:'黑色',
                  img: require('../../assets/images/black.jpg'),
                  flag: false
              },
              {
                  label: '红色',
                  index:'红色',
                  img: require('../../assets/images/red.jpg'),
                  flag: false
              },
              {
                  label: '白色',
                  index:'白色',
                  img: require('../../assets/images/white.jpg'),
                  flag: false
              },
              {
                  label: '蓝色',
                  index:'蓝色',
                  img: require('../../assets/images/blue.jpg'),
                  flag: false
              },
              {
                  label: '黄色',
                  index:'黄色',
                  img: require('../../assets/images/yellow.jpg'),
                  flag: false
              },
              {
                  label: '绿色',
                  index:'绿色',
                  img: require('../../assets/images/green.jpg'),
                  flag: false
              },
              {
                  label: '银色',
                  index:'银色',
                  img: require('../../assets/images/gray.jpg'),
                  flag: false
              },
              {
                  label: '深灰色',
                  index:'深灰色',
                  img: require('../../assets/images/deepgray.jpg'),
                  flag: false
              },
              {
                  label: '香槟色',
                  index:'香槟色',
                  img: require('../../assets/images/beige.jpg'),
                  flag: false
              },
              {
                  label: '彩色',
                  index:'彩色',
                  img: require('../../assets/images/colour.jpg'),
                  flag: false
              },
          ],
          loading: false,
          rules: {
            phone: [
              { required: true, message: '请填写完整', trigger: 'blur' },
            ],
          }
        }
    },
    watch: {
      'form.nature'(val) { // 客户性质不为企业时 清空企业名称
        if (val != 2) {
          this.form.businessName = ''
        }
      },
      'form.provinceCode'(val){
        this.ProvinceOptions.forEach(item => {
          if (item.code === val) {
            this.form.province = item.name
          }
        })
        this.form.city = ''
        this.form.cityCode = ''
      },
      'form.cityCode'(val){
        this.cityOptions.forEach(item => {
          if (item.code === val) {
            this.form.city = item.name
          }
        })
      }
    },
    created() {
      const organizationInfo = JSON.parse(window.localStorage.organizationInfo) // 获取用户组织信息
      this.userinfo = JSON.parse(window.localStorage.user) // 获取用户组织信息
      this.form.storeName = organizationInfo.organizationName // 获取组织名称
      this.form.storeId = organizationInfo.id // 经销商id
    },
    mounted() {
      this.getAllCarName() //获取意向品牌车型
      this.getProvince() // 获取省数据
      this.querySystemUserInfoDealersListOneTable() // 销售顾问
    },
    methods: {
      // 根据身份证号 查出生日  
      checkoutIDcard() {
          if (this.form.idcard == '' || (this.form.idcard).length !== 18) { this.form.birthday = ''; return; }
          let msg = this.form.idcard
          let birthday = msg.substring(10, 14)
          let M = birthday.substring(0, 2)
          let D = birthday.substring(2, 4)
          this.form.birthday = M+'月'+D+'日'
      },
      // 选择车的颜色
      changeColor(name) {
        let colorIndex = '' //选中颜色的索引
        this.colorList.forEach( (item,index) => {
          if (item.label == name) {
            colorIndex = index
          }
        })
        this.colorList[colorIndex].flag = !(this.colorList[colorIndex].flag)
        this.form.colorBak = ''
      },
      //输入其他颜色
      changeOtherColor() {
        this.colorList.forEach( (item,index) => {
          this.colorList[index].flag = false
        })
      },
      // 保存检查
      SaveCheck(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.Save()
          } else {
            this.errorMsg("请把客户信息填写完整。")
            return false;
          }
        });
      },
      // 保存
      Save() {
        this.loading = true
        let params = {
          name: this.form.name,
          phone: this.form.phone,
          idcard: this.form.idcard==''?'':(this.form.idcard).toUpperCase(),
          birthday: this.form.birthday,
          wx: this.form.wx,
          sex: this.form.sex,
          classify: this.form.classify,
          callTime: this.form.callTime,
          nature: this.form.nature,
          businessName: this.form.businessName,
          sponsor: this.form.sponsor,
          storeId: this.form.storeId,
          storeName: this.form.storeName,
          source: this.form.source,
          sourceBak: this.form.sourceBak,
          level: this.form.level,
          province: this.form.province,
          provinceCode: this.form.provinceCode,
          city: this.form.city,
          cityCode: this.form.cityCode,
          detail: this.form.detail,
          salesAdvisorId: this.form.salesAdvisorId,
          salesAdvisorName: this.form.salesAdvisorName,
          vehicleModel: this.form.vehicleModel,
          bak: this.form.bak,
        }
        if (this.form.source == '' && this.form.sourceBak != '') {
          params.source = '13'
        }
        params.callTime = this.timestampToTime(params.callTime)
        this.$axios.post(this.pathItem.saveCustomer,params).then((res) => {
          if (res.code == 0) {
            this.form.customerId = res.result
            this.saveCustomerNeed()
          } else {
            this.loading = false
            this.errorMsg(res.message)
          }
        });
      },
      // 客户需求保存
      saveCustomerNeed() {
        let data = {
          customerId: this.form.customerId,
          needType: this.form.needType,
          needAudi: "",
          seriesId: this.form.seriesId,
          needCarmodel: "",
          modelId: this.form.modelId,
          needBrand: "",
          brandId: this.form.brandId,
          color: this.form.color,
          colorBak: this.form.colorBak,
          transmission: this.form.transmission,
          airDisplacementLow: this.form.airDisplacementLow,
          airDisplacementUp: this.form.airDisplacementUp,
          airDisplacementUnit: this.form.airDisplacementUnit,
          ageLow: this.form.ageLow,
          ageUp: this.form.ageUp,
          mileageLow: this.form.mileageLow,
          mileageUp: this.form.mileageUp,
          priceLow: this.form.priceLow,
          priceUp: this.form.priceUp,
          isStage: this.form.isStage,
          downPaymentRatio: this.form.downPaymentRatio
        }
        let BrandName = [] //品牌 名字集合
        let SetName = [] //车系 名字集合
        let ModuleName = [] //车型 名字集合
        if (data.brandId.length > 0) { // 获取 品牌汉字
          data.brandId.forEach( item => {
            this.carBrandList.forEach( items => {
              if (item == items.value) {
                BrandName.push( items.label )
              }
            })
          })
        }
        if (data.seriesId.length > 0) { // 获取 车系汉字
          data.seriesId.forEach( item => {
            this.carSetList.forEach( items => {
              if (item == items.value) {
                SetName.push( items.label )
              }
            })
          })
        }
        if (data.modelId.length > 0) { // 获取 车型汉字
          data.modelId.forEach( item => {
            this.carModelList.forEach( items => {
              if (item == items.value) {
                ModuleName.push( items.label )
              }
            })
          })
        }
        // 颜色
        let colorsList = []
        this.colorList.forEach( (item,index) => {
          if (item.flag == true) {
            colorsList.push(item.label)
          }
        })
        data.color = colorsList.join()
        // 品牌车型车系
        data.needBrand = BrandName.join()
        data.needAudi = SetName.join()
        data.needCarmodel = ModuleName.join()
        data.brandId = data.brandId.join()
        data.seriesId = data.seriesId.join()
        data.modelId = data.modelId.join()
        console.log(data)
        this.$axios.post(this.pathItem.saveCustomerNeed,data).then((res) => {
          this.loading = false
          if (res.code == 0) {
            this.successMsg('保存成功')
            let customAdd = {
              name: "customAdd",
            }
            this.$store.dispatch("delVisitedViews", customAdd).then(() => {
              this.$router.push({
                path: '/customDetail',
                query: {id: this.form.customerId}
              })
            });
          } else {
            this.errorMsg(res.message)
          }
        });
      },
      // 获取省
      getProvince() {
        this.$axios.post(this.pathItem.querySystemCityList,{}).then((res) => {
          if (res.code == 0) {
            let data = res.result.systemCityList
            this.ProvinceOptions = data
          } else {
            this.errorMsg(res.message)
          }
        });
      },
      // 获取市
      getCity(id) {
        this.$axios.post(this.pathItem.querySystemCityList,{parentId:id}).then((res) => {
          if (res.code == 0) {
            let data = res.result.systemCityList
            this.cityOptions = data 
          } else {
            this.errorMsg(res.message)
          }
        });
      },
      // 查询全部品牌信息
      getAllCarName() {
        this.$axios.post(this.pathItem.certiAllCarName,{}).then((res) => {
          if (res.code == 0) {
            res.result.forEach(item => {
              this.carBrandList.push({
                label: item.makeName,
                value: item.makeId,
              })
            })
          } else {
            this.errorMsg(res.message)
          }
        });
      },
      // 根据品牌获取车系
      getCarSetByCarId() {
        if (this.form.brandId.length > 1) {
          this.form.seriesId = []
          this.form.modelId = []
          return;
        }
        if(this.form.brandId.length == 0) {
          return;
        }
        this.carSetList = []
        this.$axios.post(this.pathItem.certiAllCarModel,{makeId: this.form.brandId[0]}).then((res) => {
          if (res.code == 0) {
            res.result.forEach(item => {
              this.carSetList.push({
                label: item.modelName,
                value: item.modelId,
              })
            })
          } else {
            this.errorMsg(res.message)
          }
        });
      },
      // 根据车系获取车型
      getCarModelByCarSetId() {
        if (this.form.seriesId.length > 1) {
          this.form.modelId = []
          return;
        }
        if(this.form.seriesId.length == 0) {
          return;
        }
        this.carModelList = []
        this.$axios.post(this.pathItem.certiCarModelList,{modelId: this.form.seriesId[0]}).then((res) => {
          if (res.code == 0) {
            res.result.forEach(item => {
              this.carModelList.push({
                label: item.styleYear + item.styleName,
                value: item.styleId,
              })
            })
          } else {
            this.errorMsg(res.message)
          }
        });
      },
      // 获取销售顾问   
      querySystemUserInfoDealersListOneTable() {
        this.$axios.post(this.pathItem.querySystemUserInfoDealersListOneTable,{}).then((res) => {
          if (res.code == 0) {
            res.result.systemUserInfoDealersList.forEach( item => {
              this.salesAdvisorOptions.push({
                label: item.userName,
                value: item.id
              })
            })
            if (this.salesAdvisorOptions.length>0) {
              this.form.salesAdvisorId = this.salesAdvisorOptions[0].value  
              this.form.salesAdvisorName = this.salesAdvisorOptions[0].label

              this.salesAdvisorOptions.forEach( item => {
                if (item.value == this.userinfo.id) { // 销售顾问id  默认等于 登陆者的id
                  this.form.salesAdvisorId = item.value  // 根据id 获取销售顾问名称
                  this.form.salesAdvisorName = item.label  // 根据id 获取销售顾问名称
                }
              })
            }
            
          } else {
            this.errorMsg(res.message)
          }
        })
      },
      // 限制数字
      handlemoney(eve, name, type) {
        let neweve = eve.replace(/[^\d.]/g, "") //电话号 (只能数字) 
        if (type == 3) { neweve = eve.replace(/[^\w]/g,'') } // 身份证号  (只能输入字母与数字) 
        if (type==1 && neweve>100) { this.form[name] = '100'; return; }
        if (type==2 && neweve>100000000) { this.form[name] = '100000000'; return; }
        this.form[name] = neweve
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
      // 关闭页面
      closePage() {
        let customAdd = {
          name: "customAdd",
        };
        this.$store.dispatch("delVisitedViews", customAdd).then(() => {
          this.$router.back();
        });
      },
      // 错误提醒	
      errorMsg(msg) {this.$alert(msg, '提示', {confirmButtonText: '确定',type:'warning',})},
      // 成功提醒	
      successMsg(msg) {this.$message({message:msg, type:'success'})},
    }
}
</script>
<style lang="scss" scoped>
    .customAdd{
      background: #fff;
      & /deep/  .el-input.is-disabled .el-input__inner {
        color: #000000;
      }
      .pageTitle{
        margin-left: 35px;
        padding-left:10px;
        border-left: 5px solid #409EFF;
      }
      .colorblock{
        display:inline-block;
        width:80px;
        height:40px;
        border:1px solid #dedede;
        margin-right:5px;
        position: relative;
        cursor: pointer;
      }
    }
    .link{
      cursor: pointer;
      color: #409EFF;
      text-decoration: underline;
    }
    .el_row{
        line-height: 30px;
        margin-bottom: 10px;
    }
    .customAdd /deep/ textarea{
      resize: none !important;
    }
    .orange{
      border: 2px solid #FF7F00 !important;
    }
    
</style>