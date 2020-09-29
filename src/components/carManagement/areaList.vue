<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="hasArea ? 8 : 12">
        <el-select
          placeholder="省"
          filterable
          v-model="provinceId"
          size="mini"
          :multiple="hasMult"
          @change="provinceChange"
        >
          <el-option
            :label="provinceItem.name"
            :value="provinceItem.code"
            v-for="provinceItem in province"
            :key="provinceItem.code"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="hasArea ? 8 : 12">
        <el-select
          placeholder="市"
          filterable
          size="mini"
          :disabled="cityDisabled"
          v-model="cityId"
          @change="cityChange"
        >
          <el-option
            :label="cityItem.name"
            :value="cityItem.code"
            v-for="cityItem in city"
            :key="cityItem.code"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="8" v-if="hasArea">
        <el-select placeholder="县" filterable size="mini" v-model="countyId" @change="countyChange">
          <el-option
            :label="countyItem.name"
            :value="countyItem.code"
            v-for="countyItem in carModel"
            :key="countyItem.code"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/*********************************************************************************************
 *                                省市县三级联动
 ** @function findProvince() 获取省
 ** @function findCity() 获取市
 ** @function findCounty() 获取区
 ** @function provinceChange() 选择省
 ** @function cityChange() 选择市
 ** @function countyChange() 选择区

 *********************************************************************************************/
export default {
  name: "areaList",
  props: {
    hasArea: {
      type: Boolean,
      default: false,
    },
    hasMult: {
      type: Boolean,
      default: false,
    },
    oldProvinceId: {
      type: String,
      default: "",
    },
    oldCityId: {
      type: String,
      default: "",
    },
    oldCountyId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      province: [],
      provinceId: "",
      provinceName: "",
      city: [],
      cityId: "",
      cityName: "",
      county: [],
      countyId: "",
      countyName: "",
      hasCityChange: false,
      hasCountyChange: false,
      cityDisabled: false,
    };
  },
  watch: {
    oldProvinceId(newVal) {
      this.provinceId = newVal;
      this.findCity();
    },
    oldCityId(newVal) {
      this.cityId = newVal;
       this.hasCityChange = true
      this.findCounty();
     
    },
    oldCountyId(newVal) {
      this.hasCountyChange = true;
      this.countyId = newVal;
      
    },
    provinceId(newValue, oldValue) {
     
      // if (this.hasMult) {
      //   if (newValue.length > 1) {
      //     this.cityDisabled = true;
      //     this.cityId = "";
      //     this.cityName = "";
      //   } else {
      //     this.cityDisabled = false;
      //   }
      // }
    },
  },
  methods: {
    findProvince() {
      var that = this;
      this.$axios
        .post(this.pathItem.findAreaList, {})
        .then((res) => {
          let r = res;
          this.province = res.result.systemCityList;
        })
        .catch((res) => {
          this.$alert(res.message, "提示", {
            confirmButtonText: "确定",
            type: "error",
          });
        });
    },

    findCity() {
      var that = this;
      var params = {
        parentId: this.provinceId,
      };
      this.city = [];
      this.$axios
        .post(this.pathItem.findAreaList, params)
        .then((res) => {
          let r = res;
          if (!this.hasCityChange) {
            this.cityId = "";
            this.cityName = "";
          }
          this.city = res.result.systemCityList;
          this.hasCountyChange = true;
        })
        .catch((res) => {
          this.$alert(res.message, "提示", {
            confirmButtonText: "确定",
            type: "error",
          });
        });
    },
    findCounty() {
      var that = this;
      var params = {
        parentId: this.cityId,
      };
      this.county = [];
      this.$axios
        .post(this.pathItem.findAreaList, params)
        .then((res) => {
          let r = res;
          if (!this.hasCountyChange) {
            this.countyId = "";
            this.countyName = "";
          }

          this.county = res.result.systemCityList;
          this.hasCountyChange = true;
        })
        .catch((res) => {
          this.$alert(res.message, "提示", {
            confirmButtonText: "确定",
            type: "error",
          });
        });
    },
    provinceChange(selectId) {
      if (selectId) {
        var choseItem = this.province.filter((item) => {
          return item.code == selectId;
        });

        this.provinceName = choseItem[0].name;
        this.findCity();
      } else {
        this.provinceName = "";
        this.city = [];
        this.cityId = "";
        this.cityName = "";
      }
      var provinceObj = {
        provinceId: this.provinceId,
        provinceName: this.provinceName,
      };
      var cityObj = {
        cityId: this.cityId,
        cityName: this.cityName,
      };
      var countyObj = {
        countyId: this.countyId,
        countyName: this.countyName,
      };
      this.$emit("provinceChangeVal", provinceObj);
      this.$emit("cityChangeVal", cityObj);
      this.$emit("countyChangeVal", countyObj);
    },
    cityChange(selectId) {
      if (selectId) {
        var choseItem = this.city.filter((item) => {
          return item.code == selectId;
        });
        this.cityName = choseItem[0].name;
        this.findCounty();
      } else {
        this.cityId = "";
        this.cityName = "";
      }

      var cityObj = {
        cityId: this.cityId,
        cityName: this.cityName,
      };
      var countyObj = {
        countyId: this.countyId,
        countyName: this.countyName,
      };
      this.$emit("cityChangeVal", cityObj);
      this.$emit("countyChangeVal", countyObj);
    },
    countyChange(selectId) {
      if (selectId) {
        var choseItem = this.county.filter((item) => {
          return item.code == selectId;
        });
        this.countyName = choseItem[0].name;
      } else {
        this.countyId = "";
        this.countyName = "";
      }

      var countyObj = {
        countyId: this.countyId,
        countyName: this.countyName,
      };
      this.$emit("countyChangeVal", countyObj);
    },
  },
  mounted() {
    
    if (this.oldProvinceId) {
      this.provinceId = this.oldProvinceId;
      this.findCity();
    }
    if (this.oldCityId) {
      this.cityId = this.oldCityId;
      this.findCounty();
    }
    if (this.oldCountyId) {
      this.countyId = this.oldCountyId;
    }
  },
  created() {
    this.findProvince();
  },
};
</script>

<style>
</style>