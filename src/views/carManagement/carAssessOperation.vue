<template>
  <div class="carAssessOperation">
    <!-- 评估信息 -->
    <el-header class="header">
      <span>评估信息</span>
    </el-header>
    <!-- 车主信息 -->
    <el-main style="padding-bottom: 15px;">
      <el-row class="main-content">
        <div class="subHead">车主信息</div>
        <el-row>
          <el-col class="col-text-right" :span="3">车主姓名：{{carInfo.bookName}}</el-col>
          <el-col class="col-text-right" :span="5">联系电话：{{carInfo.bookPhone}}</el-col>
          <el-col class="col-text-right" :span="8">
            <el-col :span="12" style="margin-top:0">评估师：</el-col>
            <el-col :span="12" style="margin-top:0">
              <el-select v-model="carInfo.assessorId" @change="choseAssessor" size="mini">
                <el-option
                  v-for="role in roleTypes"
                  :key="role.id"
                  :label="role.userName"
                  :value="role.id"
                ></el-option>
              </el-select>
            </el-col>
          </el-col>
        </el-row>
      </el-row>
      <el-row class="main-content">
        <div class="subHead">车辆信息</div>
        <el-row>
          <el-col class="col-text-right" :span="3">
            <span class="cRed">*</span>VIN码：
          </el-col>
          <el-col :span="5">
            <el-input v-model="carInfo.vin" size="mini" maxlength="20"></el-input>
          </el-col>
          <el-col class="col-text-right" :span="3">厂牌：</el-col>
          <el-col :span="5">
            <el-input v-model="carInfo.brand" size="mini"></el-input>
          </el-col>
          <el-col class="col-text-right" :span="3">新车指导价：</el-col>
          <el-col :span="5">
            <el-input v-model="carInfo.guidancePrice" size="mini"></el-input>
          </el-col>

          <el-col class="col-text-right" :span="3">
            <span class="cRed">*</span>品牌型号：
          </el-col>
          <el-col :span="5">
            <el-input v-model="carInfo.brandModel" size="mini"></el-input>
          </el-col>

          <el-col class="col-text-right" :span="3">
            <span class="cRed">*</span>品牌车型：
          </el-col>
          <el-col :span="5">
            <carBrandSerise
              style="margin-top:-12px;"
              @seriseChangeVal="seriseFilterChangeVal"
              @brandChangeVal="brandFilterChangeVal"
              @modelChangeVal="modelFilterChangeVal"
              :oldBrandId="carInfo.brandId"
              :oldSeriseId="carInfo.seriesId"
              :oldModelId="carInfo.modelId"
              :hasModel="true"
            ></carBrandSerise>
          </el-col>
          <el-col class="col-text-right" :span="3">
            <span class="cRed">*</span>是否上牌：
          </el-col>
          <el-col :span="5" style="padding-top:6px;">
            <el-radio-group v-model="carInfo.ifRegistered" style="height:26px;">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </el-col>

          <el-col class="col-text-right" :span="3">环保标准：</el-col>
          <el-col :span="5">
            <el-select v-model="carInfo.emissionStandard" size="mini">
              <el-option
                :label="emissionStandardItem.name"
                :value="emissionStandardItem.id"
                v-for="emissionStandardItem in emissionStandardList"
                :key="emissionStandardItem.id"
              ></el-option>
            </el-select>
          </el-col>

          <el-col class="col-text-right" :span="3">
            <span class="cRed" v-if="carInfo.ifRegistered == 1">*</span>车牌号：
          </el-col>
          <el-col :span="5">
            <el-input v-model="carInfo.carNo" size="mini" maxlength="10"></el-input>
          </el-col>
          <el-col class="col-text-right" :span="3">
            <span class="cRed" v-if="carInfo.ifRegistered == 1">*</span>注册日期：
          </el-col>
          <el-col :span="5">
            <el-date-picker
              v-model="carInfo.registeredDate"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="month"
              placeholder="年/月"
              size="mini"
              format="yyyy-MM"
              style="width:100%"
            ></el-date-picker>
          </el-col>
          <el-col class="col-text-right" :span="3">
            <span class="cRed" v-if="carInfo.ifRegistered == 1">*</span>车牌注册地：
          </el-col>
          <el-col :span="5">
            <areaList
              style="margin-top:-12px;"
              :hasCount="false"
              :oldProvinceId="carInfo.carNoProvince"
              :oldCityId="carInfo.carNoCity"
              @provinceChangeVal="carNoProvinceChangeVal"
              @cityChangeVal="carNoCityChangeVal"
            ></areaList>
          </el-col>
          <el-col class="col-text-right" :span="3">车辆来源：</el-col>
          <el-col :span="5">
            <el-select v-model="carInfo.carSource" size="mini">
              <el-option
                v-for="item in carSources"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col class="col-text-right" :span="3">车辆所在地：</el-col>
          <el-col :span="5">
            <areaList
              style="margin-top:-12px;"
              :hasCount="false"
              :oldProvinceId="carInfo.carProvince"
              :oldCityId="carInfo.carCity"
              @provinceChangeVal="sourceProvinceChangeVal"
              @cityChangeVal="sourceCityChangeVal"
            ></areaList>
          </el-col>
          <el-col class="col-text-right" :span="3">发动机号：</el-col>
          <el-col :span="5">
            <el-input v-model="carInfo.engineNumber"  size="mini" maxlength="20"></el-input>
          </el-col>
          <el-col class="col-text-right" :span="3">变速箱：</el-col>
          <el-col :span="5">
            <el-select v-model="carInfo.gearbox" size="mini">
              <el-option label="自动" value="1"></el-option>
              <el-option label="手动" value="2"></el-option>
            </el-select>
          </el-col>
          <el-col class="col-text-right" :span="3">车辆颜色：</el-col>
          <el-col :span="5">
            <el-select v-model="carInfo.color" size="mini">
              <el-option
                v-for="item in colorList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col class="col-text-right" :span="3">排气量：</el-col>
          <el-col :span="5">
            <el-input v-model="carInfo.displacement" size="mini" style="width:60%" maxlength="10"></el-input>
            <el-select v-model="carInfo.displacementUnit" size="mini" style="width:35%">
              <el-option label="L" value="L"></el-option>
              <el-option label="T" value="T"></el-option>
            </el-select>
          </el-col>
          <el-col class="col-text-right" :span="3">行驶里程：</el-col>
          <el-col :span="5">
            <el-input
              v-model="carInfo.mileage"
              size="mini"
              style="width:80%"
              @input="validatorPrice"
            ></el-input>公里
          </el-col>
          <el-col class="col-text-right" :span="3">
            <span class="cRed">*</span>出厂年份：
          </el-col>
          <el-col :span="5">
            <el-date-picker
              v-model="carInfo.outDate"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM"
              type="month"
              placeholder="年/月"
              size="mini"
              style="width:100%;"
            ></el-date-picker>
          </el-col>
          <el-col class="col-text-right" :span="3">使用性质：</el-col>
          <el-col :span="5">
            <el-select v-model="carInfo.useType" size="mini">
              <el-option label="营运" value="1"></el-option>
              <el-option label="非营运" value="2"></el-option>
              <el-option label="营转非" value="3"></el-option>
            </el-select>
          </el-col>
          <el-col class="col-text-right" :span="3">燃料类型：</el-col>
          <el-col :span="5">
            <el-select v-model="carInfo.fuelType" size="mini">
              <el-option
                v-for="item in fuelType"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col class="col-text-right" :span="3" maxlength="10">过户次数：</el-col>
          <el-col :span="5">
            <el-input v-model="carInfo.transferTimes" size="mini"></el-input>
          </el-col>
          <el-col class="col-text-right" :span="3">钥匙数量(把)：</el-col>
          <el-col :span="5">
            <el-input v-model="carInfo.keyNum" size="mini"></el-input>
          </el-col>
          <el-col class="col-text-right" :span="3">
            <span class="cRed" v-if="carInfo.carSource==5">*</span>车辆属性：
          </el-col>
          <el-col :span="5">
            <el-select v-model="carInfo.carType" size="mini">
              <el-option
                v-for="item in carProperties"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col class="col-text-right" :span="3">
            <span class="cRed" v-if="carInfo.carSource==5">*</span>驱动形式：
          </el-col>
          <el-col :span="5">
            <el-select v-model="carInfo.driveType" size="mini">
              <el-option
                v-for="item in driveType"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col class="col-text-right" :span="3">
            <span class="cRed" v-if="carInfo.carSource==5">*</span>车辆自重：
          </el-col>
          <el-col :span="5">
            <el-input v-model="carInfo.weight" size="mini" maxlength="20"></el-input>
          </el-col>
          <el-col class="col-text-right" :span="3">
            <span class="cRed" v-if="carInfo.carSource==5">*</span>车辆载重：
          </el-col>
          <el-col :span="5">
            <el-input v-model="carInfo.carLoad" size="mini" maxlength="20"></el-input>
          </el-col>
          <el-col class="col-text-right" :span="3">
            <span class="cRed" v-if="carInfo.carSource==5">*</span>发动机型号：
          </el-col>
          <el-col :span="5">
            <el-input v-model="carInfo.engineType" size="mini" maxlength="20"></el-input>
          </el-col>
          <el-col class="col-text-right" :span="3">
            <span class="cRed" v-if="carInfo.carSource==5">*</span>马力：
          </el-col>
          <el-col :span="5">
            <el-input v-model="carInfo.horsepower" size="mini" maxlength="20"></el-input>
          </el-col>
          <el-col class="col-text-right" :span="3">事故检查：</el-col>
          <el-col :span="5">
            <el-select v-model="accident" multiple size="mini">
              <el-option label="非事故车" value="1"></el-option>
              <el-option label="非火烧车" value="2"></el-option>
              <el-option label="非泡水车" value="3"></el-option>
            </el-select>
          </el-col>
          <el-col class="col-text-right" :span="3">车况描述：</el-col>
          <el-col :span="5">
            <el-select v-model="carDetail" multiple size="mini">
              <el-option label="非走私车" value="1"></el-option>
              <el-option label="非盗抢车" value="2"></el-option>
              <el-option label="非海关罚没车" value="3"></el-option>
              <el-option label="非涉及法律纠纷车" value="4"></el-option>
            </el-select>
          </el-col>
          <el-col class="col-text-right" :span="3">
            <span class="cRed">*</span>车辆改装：
          </el-col>
          <el-col :span="5" style="padding-top:6px;">
            <el-radio-group v-model="carInfo.carConverted">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="col-text-right" :span="3">座位数量：</el-col>
          <el-col :span="5">
            <el-input v-model="carInfo.seatNum" size="mini"></el-input>
          </el-col>
        </el-row>
        <el-row v-if="carInfo.carConverted==1">
          <el-col class="col-text-right" :span="3">
            <span class="cRed">*</span>改装项目：
          </el-col>
          <el-col :span="12">
            <el-input type="textarea" v-model="carInfo.convertedItem" maxlength="100"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="col-text-right" :span="3">车辆配置：</el-col>
          <el-col :span="12">
            <el-popover placement="bottom" width="500" trigger="click" v-model="popVisible">
              <div class="chose-box" style="width:100%;">
                <el-row
                  class="chose-head"
                  type="flex"
                  justify="between"
                  style="margin-bottom:10px;"
                >
                  <el-col style="text-align:left;color:#409EFF">请选择</el-col>
                  <el-col style="text-align:right">
                    <i class="el-icon-close" style="cursor:pointer" @click="closePop"></i>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="20">
                    <el-row style="margin-bottom:10px;">
                      <el-col :span="6" style="cursor:pointer;">
                        <span @click="choseBtnList(0)">GPS导航</span>
                      </el-col>
                      <el-col :span="6" style="cursor:pointer;">
                        <span @click="choseBtnList(1)">倒车雷达</span>
                      </el-col>
                      <el-col :span="6" style="cursor:pointer;">
                        <span @click="choseBtnList(2)">倒车影像</span>
                      </el-col>
                      <el-col :span="6" style="cursor:pointer;">
                        <span @click="choseBtnList(3)">定速巡航</span>
                      </el-col>
                    </el-row>
                    <el-row style="margin-bottom:10px;">
                      <el-col :span="6" style="cursor:pointer;">
                        <span @click="choseBtnList(4)">胎压监测</span>
                      </el-col>
                      <el-col :span="6" style="cursor:pointer;">
                        <span @click="choseBtnList(5)">油电混动</span>
                      </el-col>
                      <el-col :span="6" style="cursor:pointer;">
                        <span @click="choseBtnList(6)">无钥匙进入</span>
                      </el-col>
                      <el-col :span="6" style="cursor:pointer;">
                        <span @click="choseBtnList(7)">座椅加热</span>
                      </el-col>
                    </el-row>
                    <el-row style="margin-bottom:10px;">
                      <el-col :span="6" style="cursor:pointer;">
                        <span @click="choseBtnList(8)">LED大灯</span>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="4">
                    <el-button type="text" style="padding-top:0;" @click="clearTextArea">[清空]</el-button>
                  </el-col>
                </el-row>
              </div>
              <el-input
                slot="reference"
                type="textarea"
                v-model="carInfo.carAllocation"
                maxlength="100"
              ></el-input>
            </el-popover>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="col-text-right" :span="3">内部车况描述：</el-col>
          <el-col :span="12">
            <el-input type="textarea" v-model="carInfo.carInsideDetail" maxlength="100"></el-input>
          </el-col>
        </el-row>
      </el-row>
      <el-row class="main-content">
        <div class="subHead">手续信息</div>
        <el-row>
          <!-- <el-col class="text-right" :span="4">
            <span class="cRed">*</span>登记证：
          </el-col>
          <el-col :span="4" style="padding-top:2px;">
            <el-radio v-model="carInfo.certificate" label="1">有</el-radio>
            <el-radio v-model="carInfo.certificate" label="2">无</el-radio>
          </el-col>-->
          <el-col class="text-right" :span="3">
            <span class="cRed">*</span>出险记录：
          </el-col>
          <el-col :span="4" style="padding-top:2px;">
            <el-radio-group v-model="procedureInfo.upInsurance">
              <el-radio :label="1">已核查</el-radio>
              <el-radio :label="2">未核查</el-radio>
            </el-radio-group>
          </el-col>
          <el-col class="text-right" :span="4">
            <span class="cRed">*</span>车船税：
          </el-col>
          <el-col :span="5" style="padding-top:2px;">
            <el-radio-group v-model="procedureInfo.carTax">
              <el-radio label="1">有</el-radio>
              <el-radio label="2">无</el-radio>
            </el-radio-group>
          </el-col>
          <el-col class="text-right" :span="4">
            <span class="cRed">*</span>购置税：
          </el-col>
          <el-col :span="4" style="padding-top:2px;">
            <el-radio-group v-model="procedureInfo.buyTax">
              <el-radio label="1">有</el-radio>
              <el-radio label="2">无</el-radio>
            </el-radio-group>
          </el-col>
          <el-col class="text-right" :span="3">
            <span class="cRed">*</span>违章：
          </el-col>
          <el-col :span="4" style="padding-top:2px;">
            <el-radio-group v-model="procedureInfo.violation">
              <el-radio label="1">有</el-radio>
              <el-radio label="2">无</el-radio>
            </el-radio-group>
          </el-col>
          <el-col class="text-right" :span="4">
            <span class="cRed">*</span>达到国家强制报废标准：
          </el-col>
          <el-col :span="5" style="padding-top:2px;">
            <el-radio-group v-model="procedureInfo.scrappingStandard">
              <el-radio label="1">是</el-radio>
              <el-radio label="2">否</el-radio>
            </el-radio-group>
          </el-col>
          <el-col class="text-right" :span="4">
            <span class="cRed">*</span>手续合法及车辆合法状态：
          </el-col>
          <el-col :span="4" style="padding-top:2px;">
            <el-radio-group v-model="procedureInfo.legal">
              <el-radio label="1">合法</el-radio>
              <el-radio label="2">不合法</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px;">
          <el-col class="col-text-right" :span="4">交强险到期：</el-col>
          <el-col :span="5">
            <el-date-picker
              v-model="procedureInfo.compulsoryInsuranceDate"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM"
              type="month"
              placeholder="年/月"
              size="mini"
              style="width:100%;"
            ></el-date-picker>
          </el-col>
          <el-col class="col-text-right" :span="3">交强险公司：</el-col>
          <el-col :span="2">
            <el-select v-model="procedureInfo.compulsoryInsuranceCompany" size="mini">
              <el-option
                :label="insuranceCompanyItem.name"
                :key="insuranceCompanyItem.id"
                :value="insuranceCompanyItem.id"
                v-for="insuranceCompanyItem in insuranceCompany"
              ></el-option>
            </el-select>
          </el-col>
          <el-col
            :span="3"
            v-if="procedureInfo.compulsoryInsuranceCompany == 11"
            style="padding-left:15px;"
          >
            <el-input
              size="mini"
              v-model="procedureInfo.compulsoryInsuranceCompanyElse"
              placeholder="请输入商业险公司"
            ></el-input>
          </el-col>
          <el-col class="col-text-right" :span="2">交强险所在地：</el-col>
          <el-col :span="5">
            <areaList
              style="margin-top:-12px"
              :oldProvinceId="procedureInfo.compulsoryInsuranceProvince"
              :oldCityId="procedureInfo.compulsoryInsuranceCity"
              @provinceChangeVal="procedureProvinceChangeVal"
              @cityChangeVal="procedureCityChangeVal"
              :hasCounty="false"
            ></areaList>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="col-text-right" :span="4">商业险到期：</el-col>
          <el-col :span="5">
            <el-date-picker
              v-model="procedureInfo.commercialInsuranceDate"
              type="month"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM"
              placeholder="月"
              size="mini"
              style="width:100%;"
            ></el-date-picker>
          </el-col>
          <el-col class="col-text-right" :span="3">商业险公司：</el-col>
          <el-col :span="2">
            <el-select v-model="procedureInfo.commercialInsuranceCompany" size="mini">
              <el-option
                :label="insuranceCompanyItem.name"
                :key="insuranceCompanyItem.id"
                :value="insuranceCompanyItem.id"
                v-for="insuranceCompanyItem in insuranceCompany"
              ></el-option>
            </el-select>
          </el-col>
          <el-col
            :span="3"
            v-if="procedureInfo.commercialInsuranceCompany == 11"
            style="padding-left:15px;"
          >
            <el-input
              size="mini"
              v-model="procedureInfo.commercialInsuranceCompanyElse"
              placeholder="请输入商业险公司"
            ></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="col-text-right" :span="4">车联网到期：</el-col>
          <el-col :span="5">
            <el-date-picker
              v-model="procedureInfo.carNetworkDate"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM"
              type="month"
              placeholder="月"
              size="mini"
              style="width:100%;"
            ></el-date-picker>
          </el-col>
          <el-col class="col-text-right" :span="3">
            <span class="cRed" v-if="procedureInfo.isCarNumber==1">*</span>年检到期：
          </el-col>
          <el-col :span="5">
            <el-date-picker
              v-model="procedureInfo.inspectionDate"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM"
              type="month"
              placeholder="年/月"
              size="mini"
              style="width:100%;"
            ></el-date-picker>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="col-text-right" :span="4">最后一次保养日期：</el-col>
          <el-col :span="5">
            <el-date-picker
              v-model="procedureInfo.maintenanceDate"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd"
              type="date"
              size="mini"
            ></el-date-picker>
          </el-col>
          <el-col class="col-text-right" :span="3">最后一次保养里程：</el-col>
          <el-col :span="5">
            <el-input v-model="procedureInfo.maintenanceMileage" size="mini"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="col-text-right" :span="4">
            4S维修和保养历史记录：
            <p>（最多15张）</p>
          </el-col>
          <el-col :span="20">
            <uploadImg
              ref="uploadImg"
              :type="1"
              @imgUpload="choseIMG"
              :limit="15"
              :tableName="3"
              :typeFile="301"
              :carId="id"
            ></uploadImg>
          </el-col>
        </el-row>
      </el-row>
      <div class="text-right" style="padding-right:40px;">
        <el-button @click="operationAssessWindow(0)">关 闭</el-button>
        <el-button type="primary" @click="operationAssessWindow(1)">保 存</el-button>
      </div>
    </el-main>
  </div>
</template>

<script>
/*********************************************************************************************
 **                                 车辆评估方法说明
 ** @function getCarInfo() 获取车辆详情
 ** @function getCarProcedure() 获取车辆手续信息
 ** @function findAppraiserList() 获取评估师
 ** @function choseAssessor(val) 选择评估师   @param val  选择结果
 ** @function brandFilterChangeVal(selectName) 车品牌选择回调 @param selectName  选择信息
 ** @function seriseFilterChangeVal(selectName) 车系选择回调 @param selectName  选择信息
 ** @function modelFilterChangeVal(selectName) 车型选择回调 @param selectName  选择信息
 ** @function validatorPrice() 校验行驶里程
 ** @function operationAssessWindow(type) 验证评估信息必填  @param type：0关闭  1保存
 ** @function validatorAssessInfo() 校验填写信息
 ** @function showMessageBox() 页面弹窗
 ** @function submitAssessment() 保存车辆信息
 ** @function saveCarProcedure() 保存车辆手续信息
 ** @function sourceProvinceChangeVal(val) 选择车辆来源省回调 @param val 选择的省信息
 ** @function sourceCityChangeVal(val) 选择车辆来源市回调 @param val 选择的市信息
 ** @function carNoProvinceChangeVal(val) 选择车牌所在省回调 @param val 选择的省信息
 ** @function carNoCityChangeVal(val) 选择车牌所在市回调 @param val 选择的市信息
 ** @function procedureProvinceChangeVal(val) 选择车辆手续省回调 @param val 选择的省信息
 ** @function procedureCityChangeVal(val) 选择车辆手续市回调 @param val 选择的市信息
 ** @function choseBtnList(index) 车辆配置点击btn选择  @param index 点击的次序
 ** @function clearTextArea() 清空车辆配置信息
 ** @function closePop() 关闭车辆配置提示
 ** @function closePage() 关闭页面
 *
 *
 *********************************************************************************************/
import carBrandSerise from "../../components/certification/selectCarBrand";
import areaList from "../../components/carManagement/areaList";
import uploadImg from "../../components/certification/uploadImg";
export default {
  components: {
    carBrandSerise,
    areaList,
    uploadImg,
  },
  data() {
    return {
      id: "",
      // 车辆信息
      carInfo: {},
      //评估人
      roleTypes: [],
      // 车辆来源
      carSources: [
        {
          id: 1,
          label: "外采",
        },
        {
          id: 2,
          label: "寄售",
        },
        {
          id: 3,
          label: "置换",
        },
        {
          id: 4,
          label: "退换车",
        },
        {
          id: 5,
          label: "出口",
        },
      ],
      // 燃油类型
      fuelType: [
        {
          id: "1",
          label: "汽油",
        },
        {
          id: "2",
          label: "柴油",
        },
        {
          id: "3",
          label: "电动",
        },
        {
          id: "4",
          label: "油电混合",
        },
        {
          id: '5',
          label: "天然气",
        },
      ],
      // 车辆使用性质
      carProperties: [
        {
          id: "1",
          label: "乘用车",
        },
        {
          id: "2",
          label: "商用车",
        },
        {
          id: "3",
          label: "工程车",
        },
        {
          id: "4",
          label: "特种车",
        },
      ],
      // 驱动类型
      driveType: [
        {
          id: "1",
          label: "前驱",
        },
        {
          id: "2",
          label: "后驱",
        },
        {
          id: "3",
          label: "四驱",
        },
      ],
      // 颜色
      colorList: [
        {
          id: "1",
          label: "黑色",
        },
        {
          id: "2",
          label: "红色",
        },
        {
          id: "3",
          label: "白色",
        },
        {
          id: "4",
          label: "蓝色",
        },
        {
          id: "5",
          label: "黄色",
        },
        {
          id: "6",
          label: "绿色",
        },
        {
          id: "7",
          label: "银色",
        },
        {
          id: "8",
          label: "深灰色",
        },
        {
          id: "9",
          label: "香槟色",
        },
        {
          id: "10",
          label: "彩色",
        },
      ],
      // 环保标准
      emissionStandardList: [
        {
          id: "6",
          name: "国VI",
        },
        {
          id: "5",
          name: "国V",
        },
        {
          id: "4",
          name: "国IV",
        },
        {
          id: "3",
          name: "国III",
        },
        {
          id: "2",
          name: "国II",
        },
        {
          id: "1",
          name: "国I",
        },
        {
          id: "7",
          name: "其他",
        },
      ],
      // 保险公司list
      insuranceCompany: [
        {
          id: "1",
          name: "人保汽车保险",
        },
        {
          id: "2",
          name: "太平汽车保险",
        },
        {
          id: "3",
          name: "平安车险",
        },
        {
          id: "4",
          name: "太平洋汽车保险",
        },
        {
          id: "5",
          name: "天安车险",
        },
        {
          id: "6",
          name: "中华联合车险",
        },
        {
          id: "7",
          name: "安邦车险",
        },
        {
          id: "8",
          name: "阳光汽车保险",
        },
        {
          id: "9",
          name: "永安车险",
        },
        {
          id: "10",
          name: "大地车险",
        },
        {
          id: "11",
          name: "其他",
        },
      ],
      // 事故检查
      accident: [],
      // 车况描述
      carDetail: [],
      // 手续信息
      procedureInfo: {},
      // 车辆配置提示
      popVisible: false,
      buttonList: [
        "GPS导航 ",
        "倒车雷达 ",
        "倒车影像 ",
        "定速巡航 ",
        "胎压监测 ",
        "油电混动 ",
        "无钥匙进入 ",
        "座椅加热 ",
        "LED大灯 ",
      ],
      resName: "workOrder",
    };
  },
  computed: {
    //获取vuex存储的已预览标签页
  },
  mounted() {
    if (this.$route.query.params) {
      this.id = this.$route.query.params;
      this.getCarInfo();
      this.getCarProcedure();
      this.findAppraiserList();
    }
  },
  methods: {
    getCarInfo() {
      var that = this;
      var params = {
        id: this.id,
      };
      this.$axios
        .post(this.pathItem.findCarInfoById, params)
        .then((res) => {
          if (res.code == 0) {
            this.carInfo = res.result;
            if (this.carInfo.accident) {
              if (this.carInfo.accident.indexOf(",") > -1) {
                this.accident = this.carInfo.accident.split(",");
              } else {
                this.accident = [this.carInfo.accident];
              }
            }
            if (this.carInfo.carDetail) {
              if (this.carInfo.carDetail.indexOf(",") > -1) {
                this.carDetail = this.carInfo.carDetail.split(",");
              } else {
                this.carDetail = [this.carInfo.carDetail];
              }
            }
          }
        })
        .catch((res) => {});
    },
    getCarProcedure() {
      var params = {
        carId: this.id,
      };
      this.$axios
        .post(this.pathItem.findCarProcedureByCarId, params)
        .then((res) => {
          if (res.code == 0) {
            if (res.result) {
              this.procedureInfo = res.result;
            } else {
              this.procedureInfo = {};
            }
          }
        })
        .catch((res) => {});
    },
    findAppraiserList() {
      var params = {
        roleTypes: 2,
      };
      this.$axios.post(this.pathItem.findAppraiserList, params).then((res) => {
        if (res.code == 0) {
          this.roleTypes = res.result.systemUserInfoDealersList;
        }
      });
    },
    choseAssessor(val) {
      if (val) {
        var choseItem = this.roleTypes.filter((item) => {
          return item.id == val;
        });
        this.carInfo.assessor = choseItem[0].userName;
      } else {
        this.carInfo.assessor = "";
      }
    },
    brandFilterChangeVal(selectName) {
      this.carInfo.brandName = selectName.carBrandName;
      this.carInfo.brandId = selectName.carBrandId;
      // this.filterBrandId = Number(selectName.carBrandId);
    },

    seriseFilterChangeVal(selectName) {
      this.carInfo.seriesName = selectName.carSeriesName;
      this.carInfo.seriesId = selectName.carSeriesId;
      // this.filterSeriesId = Number(selectName.carSeriesId);
    },
    modelFilterChangeVal(selectName) {
      this.carInfo.modelName = selectName.carModelName;
      this.carInfo.modelId = selectName.carModelId;
      // this.filterModelId = Number(selectName.carModelId);
    },

    //校验采购价格
    validatorPrice(val) {
      var reg = /^([1-9]\d{0,10})|10000000000|0/;
      if (!reg.test(val)) {
        this.dialogStorageInfo.price = val.substring(0, val.length - 1);
      }
    },

    // 对话框确认操作   type：0关闭  1保存
    operationAssessWindow(type) {
      let message = "";
      let thenOperation = "";
      var that = this;
      if (type == 0) {
        message = "若直接关闭当前窗口，所有信息将不能保存，请再次确认！";
        thenOperation = () => {
          this.closePage();
        };
      } else {
        message = "车辆照片、评估信息请于手机端APP继续完善！";
        thenOperation = () => {
          that.submitAssessment();
        };
      }
      this.$confirm(message, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(thenOperation)
        .catch(() => {});
    },

    validatorAssessInfo() {
      let isValidator = true;
      let validatorList = [
        {
          index: this.carInfo.vin,
          msg: "请输入VIN码",
        },
        {
          index: this.carInfo.brandModel,
          msg: "请输入品牌型号",
        },
        {
          index: this.carInfo.brandId,
          msg: "请选择品牌车型",
        },
        {
          index: this.carInfo.seriesId,
          msg: "请选择品牌车型",
        },
        {
          index: this.carInfo.modelId,
          msg: "请选择品牌车型",
        },

        {
          index: this.carInfo.ifRegistered,
          msg: "请选择是否上牌",
        },
        
        
        {
          index: this.carInfo.outDate,
          msg: "请选择出厂年份",
        },
        {
          index: this.carInfo.carConverted,
          msg: "请选择是否改装",
        },
        {
          index: this.procedureInfo.upInsurance,
          msg: "请选择是否核查出险记录",
        },
        {
          index: this.procedureInfo.carTax,
          msg: "请选择是否有车船税",
        },
        {
          index: this.procedureInfo.buyTax,
          msg: "请选择是否有购置税",
        },
        {
          index: this.procedureInfo.violation,
          msg: "请选择是否有违章",
        },
        {
          index: this.procedureInfo.scrappingStandard,
          msg: "请选择是否达到国家报废标准",
        },
        {
          index: this.procedureInfo.legal,
          msg: "请选择手续和车辆是否合法",
        },
      ];
      var addList = [
        {
          index: this.carInfo.carType,
          msg: "请选择车辆属性",
        },
        {
          index: this.carInfo.driveType,
          msg: "请选择驱动形式",
        },
        {
          index: this.carInfo.weight,
          msg: "请选择车辆自重",
        },
        {
          index: this.carInfo.engineType,
          msg: "请选择发动机型号",
        },
        {
          index: this.carInfo.horsepower,
          msg: "请选择马力",
        },
      ];
      var changeList = [
        {
          index: this.carInfo.convertedItem,
          msg: "请输入改装项目",
        },
      ];
      var registorList = [
        {
          index: this.carInfo.carNo,
          msg: "请输入车牌",
        },
        {
          index: this.carInfo.registeredDate,
          msg: "请选择注册日期",
        },
        {
          index: this.carInfo.carNoProvince,
          msg: "请选择车牌注册地",
        },
        {
          index: this.carInfo.carNoCity,
          msg: "请选择车牌注册地",
        },
      ];
      if (this.carInfo.ifRegistered == 1) {
        validatorList = validatorList.concat(registorList);
      }
      console.log(this.carInfo.carSources);
      if (this.carInfo.carSource == 5) {
        validatorList = validatorList.concat(addList);
      }
      if (this.carInfo.carConverted == 1) {
        validatorList = validatorList.concat(changeList);
      }
      for (var i in validatorList) {
        if (!validatorList[i].index) {
          isValidator = false;
          this.showMessageBox("error", validatorList[i].msg);
          break;
        }
      }
      return isValidator;
    },
    showMessageBox(type, message) {
      this.$message({
        type: type,
        message: message,
        offset: 400,
        duration: 1000,
      });
    },

    submitAssessment() {
      this.$refs.uploadImg.saveImg();
    },
    choseIMG(saveSucces) {
      var params = {
        ...this.carInfo
      };
      // for (var key in this.carInfo) {
      //   if (this.carInfo[key]) {
      //     params[key] = this.carInfo[key];
      //   }
      // }
      if (this.accident.length > 0) {
        params.accident = this.accident.join(",");
      }
      if (this.carDetail.length > 0) {
        params.carDetail = this.carDetail.join(",");
      }
      if (!this.validatorAssessInfo()) {
        return;
      }
      if (saveSucces.status) {
        if (saveSucces.carFileList && saveSucces.carFileList.length) {
          this.$axios
            .post(this.pathItem.addOrUpdateFileList, {
              carFileList: saveSucces.carFileList,
            })
            .then((imgRes) => {
              if (imgRes.code != 0) {
                this.$message.error(imgRes.message);
              } else {
                this.$axios
                  .post(this.pathItem.addOrUpdCar, params)
                  .then((res) => {
                    if (res.code == 0) {
                      this.saveCarProcedure();
                    } else {
                      this.showMessageBox("error", res.message);
                    }
                  })
                  .catch((res) => {
                    this.showMessageBox("error", res.message);
                  });
              }
            })
            .catch((imgCatres) => {
              this.$message.error(imgCatres.message);
            });
        } else {
          this.$axios
            .post(this.pathItem.addOrUpdCar, params)
            .then((res) => {
              if (res.code == 0) {
                this.saveCarProcedure();
              } else {
                this.showMessageBox("error", res.message);
              }
            })
            .catch((res) => {
              this.showMessageBox("error", res.message);
            });
        }
      }
    },
    saveCarProcedure() {
      var params = {};
      for (var key in this.procedureInfo) {
        if (this.procedureInfo[key]) {
          params[key] = this.procedureInfo[key];
        }
      }
      params.carId = this.id;
      this.$axios
        .post(this.pathItem.saveCarProcedure, params)
        .then((res) => {
          if (res.code == 0) {
            this.showMessageBox("success", "保存成功");
            this.closePage();
          }
        })
        .catch((res) => {});
    },
    sourceProvinceChangeVal(val) {
      this.carInfo.carProvince = val.provinceId;
      this.carInfo.carProvinceName = val.provinceName;
    },
    sourceCityChangeVal(val) {
      this.carInfo.carCity = val.cityId;
      this.carInfo.carCityName = val.cityName;
    },
    carNoProvinceChangeVal(val) {
      this.carInfo.carNoProvince = val.provinceId;
    },
    carNoCityChangeVal(val) {
      this.carInfo.carNoCity = val.cityId;
    },
    procedureProvinceChangeVal(val) {
      this.procedureInfo.compulsoryInsuranceProvince = val.provinceId;
    },
    procedureCityChangeVal(val) {
      this.procedureInfo.compulsoryInsuranceCity = val.cityId;
    },
    choseBtnList(index) {
      var oldVal = this.carInfo.carAllocation ? this.carInfo.carAllocation : "";
      if(oldVal.indexOf(this.buttonList[index].trim()) > -1){
        
      }else{
        this.carInfo.carAllocation = oldVal + this.buttonList[index];
      }
      
      //  this.carInfo.carAllocation = "09999999999999"
    },
    clearTextArea() {
      this.carInfo.carAllocation = "";
    },
    closePop() {
      this.popVisible = false;
    },
    closePage() {
      var createWorkList = {
        name: "carAssessOperation",
        query: this.$route.query,
      };

      this.$store.dispatch("delVisitedViews", createWorkList).then(() => {
        this.$router.back();
      });
    },
    handlePictureCardPreview() {},
    // 移除维修保养记录照片
    handlePictureRemove(val) {},
  },
};
</script>

<style lang="scss" scoped>
.carAssessOperation {
  padding-bottom: 100px;
  .main-content {
    background-color: #fff;
    padding: 15px 30px;
    margin-bottom: 10px;
    font-size: 13px;
    .form-content {
      margin: auto 30px;
    }
    .price-style {
      margin-left: 10px;
      padding: 5px 10px;
      &.price-active {
        background: #67c23a;
        color: #fff;
        border-radius: 4px;
      }
    }

    .col-width {
      width: 41%;
    }
  }
}

.dialog-footer {
  text-align: center;
}
</style>
<style>
.carAssessOperation .el-col {
  margin-top: 12px;
}
</style>