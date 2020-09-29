<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="hasModel ? 8 : 12">
        <el-select :clearable="canClear" placeholder="品牌" filterable :multiple="hasBrandMult" v-model="carBrandId" size="mini" @change="brandChange">
          <el-option :label="carBrandItem.makeName" :value="carBrandItem.makeId" v-for="carBrandItem in carBrand" :key="carBrandItem.makeId"></el-option>
        </el-select>
      </el-col>
      <el-col :span="hasModel ? 8 : 12">
        <el-select :clearable="canClear" placeholder="车系" filterable size="mini" :multiple="hasSeriesMult" :disabled="seriesDisable" v-model="carSeriesId" @change="seriseChange">
          <el-option :label="carSeriesItem.modelName" :value="carSeriesItem.modelId" v-for="carSeriesItem in carSeries" :key="carSeriesItem.modelId"></el-option>
        </el-select>
      </el-col>
      <el-col :span="8" v-if="hasModel">
        <el-select :clearable="canClear" placeholder="车型" filterable size="mini" :multiple="hasModelMult" :disabled="modelDisable" v-model="carModelId" @change="modelChange">
          <el-option :label="`${carModelItem.styleYear}${carModelItem.styleName}`" :value="carModelItem.styleId" v-for="carModelItem in carModel" :key="carModelItem.styleId"></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/*********************************************************************************************
 *                               选择车品牌车系车型说明
 ** @function findCarBrand() 获取车辆品牌
 ** @function findCarSerise() 获取车系
 ** @function findCarModel() 获取车型
 ** @function brandChange() 车辆品牌改变
 ** @function seriseChange() 选择车系
 ** @function modelChange() 选择车型
 *
 *********************************************************************************************/
export default {
  name: "carBrandSerise",
  props: {
    hasModel: {
      //是否有车型
      type: Boolean,
      default: false,
    },
    canClear:false,
    oldBrandId: "", //回显车品牌id
    oldSeriseId: "", //回显车系id
    oldModelId: "", //回显车型id
    hasBrandMult: {
      type: Boolean,
      default: false, //是否品牌多选
    },
    hasSeriesMult: {
      type: Boolean,
      default: false, //是否车系多选
    },
    hasModelMult: {
      type: Boolean,
      default: false, //是否车型多选
    },
  },
  data() {
    return {
      carBrand: [],
      carBrandId: "",
      carBrandName: "",
      carSeries: [],
      carSeriesId: "",
      carSeriesName: "",
      carModel: [],
      carModelId: "",
      carModelName: "",
      hasModelChange: false,
      hasSeriesChange: false,
      modelDisable: false,
      seriesDisable: false,
    };
  },
  watch: {
    oldBrandId(newVal,oldVal) {  
      this.carBrandId = this.hasBrandMult ? (newVal ? newVal :  []) : (newVal ? String(newVal) :  "") ;
      this.findCarSerise();
    },
    oldSeriseId(newVal) {
      this.carSeriesId =this.hasSeriesMult ? (newVal ? newVal :  []) : (newVal ? String(newVal) :  "") ;
      this.hasSeriesChange = true;
      this.findCarModel();
    },
    oldModelId(newVal) {
      this.carModelId = this.hasModelMult ? (newVal ? newVal :  []) : (newVal ? String(newVal) :  "") ;
      this.hasModelChange = true;
    },
    carBrandId(newValue) {
      //是否品牌多选
      if (this.hasBrandMult) {
        if (newValue.length > 1) {
          this.seriesDisable = true;
          this.carSeriesId = "";
          this.carSeriesName = "";
          this.modelDisable = true;
          this.carModelName = "";
          this.carModelId = "";
        } else {
          this.seriesDisable = false;
          this.modelDisable = false;
          
        }
      }
    },
    carSeriesId(newValue) {
      //是否车系多选
      if (this.hasSeriesMult) {
        if (this.carBrandId.length > 1) {
          this.modelDisable = true;
          this.carModelName = "";
          this.carModelId = "";
        } else {
          if (newValue.length > 1) {
            this.modelDisable = true;
            this.carModelName = "";
            this.carModelId = "";
          } else {
            this.modelDisable = false;
          }
        }
      }
    },
  },

  methods: {
    findCarBrand() {
      var that = this;
      this.$axios
        .post(this.pathItem.certiAllCarName)
        .then((res) => {
          let r = res;
          this.carBrand = res.result;
        })
        .catch((res) => {
          this.loading = false;
          this.$alert(res.message, "提示", {
            confirmButtonText: "确定",
            type: "error",
          });
        });
    },

    findCarSerise() {
      var that = this;

      var params = {
        makeId: this.hasBrandMult ? this.carBrandId[0] : this.carBrandId,
      };
      this.carSeries = [];
      this.$axios
        .post(this.pathItem.certiAllCarModel, params)
        .then((res) => {
          let r = res;
          if (!this.hasSeriesChange) {
            this.carSeriesId = "";
            this.carSeriesName = "";
          }
          // if (!this.hasModelChange) {
          //   this.carModelId = "";
          //   this.carModelName = "";
          // }

          this.carSeries = res.result;
          this.hasSeriesChange = false;
        })
        .catch((res) => {
          this.$alert(res.message, "提示", {
            confirmButtonText: "确定",
            type: "error",
          });
        });
    },
    findCarModel() {
      var that = this;
      var params = {
        modelId: this.hasSeriesMult ? this.carSeriesId[0] : this.carSeriesId,
      };
      this.carModel = [];
      this.$axios
        .post(this.pathItem.certiCarModelList, params)
        .then((res) => {
          let r = res;
          if (!this.hasModelChange) {
            this.carModelId = "";
            this.carModelName = "";
          }
          this.carModel = res.result;
          this.hasModelChange = false;
        })
        .catch((res) => {
          this.$alert(res.message, "提示", {
            confirmButtonText: "确定",
            type: "error",
          });
        });
    },
    brandChange(selectId) {
      var carBrandName = "";
      var carBrandId = "";
      if (selectId) {
        if (!this.hasBrandMult) {
          var choseItem = this.carBrand.filter((item) => {
            return item.makeId == selectId;
          });

          carBrandName = choseItem[0].makeName;
          carBrandId = this.carBrandId;
          this.findCarSerise();
        } else {
          var lastString = "";
          this.carBrand.filter((item) => {
            selectId.map((valItem) => {
              if (item.makeId == valItem) {
                lastString =
                  lastString + (lastString ? "," : "") + item.makeName;
              }
            });
          });

          if (this.carBrandId.length == 1) {
            this.findCarSerise();
          }
          carBrandName = lastString;
          carBrandId = selectId.join(",");
        }
      } else {
        this.carBrandName = "";
        this.carBrandId = "";

        this.carSeries = [];
        this.carSeriesId = "";
        this.carSeriesName = "";

        this.carModel = [];
        this.carModelId = "";
        this.carModelName = "";
      }
      this.carSeries = [];
      this.carSeriesId = "";
      this.carSeriesName = "";

      this.carModel = [];
      this.carModelId = "";
      this.carModelName = "";
      var brandObj = {
        carBrandId: carBrandId,
        carBrandName: carBrandName,
      };
      var seriseObj = {
        carSeriesId: this.carSeriesId,
        carSeriesName: this.carSeriesName,
      };
      var modelObj = {
        carModelId: this.carModelId,
        carModelName: this.carModelName,
      };
      this.$emit("brandChangeVal", brandObj);
      this.$emit("seriseChangeVal", seriseObj);
      this.$emit("modelChangeVal", modelObj);
    },
    seriseChange(selectId) {
      var carSeriesName = "";
      var carSeriesId = "";
      if (selectId) {
        if (!this.hasSeriesMult) {
          var choseItem = this.carSeries.filter((item) => {
            return item.modelId == selectId;
          });
          carSeriesName = choseItem[0].modelName;
          carSeriesId = this.carSeriesId;
          this.findCarModel();
        } else {
          var lastString = "";

          this.carSeries.filter((item) => {
            selectId.map((valItem) => {
              if (item.modelId == valItem) {
                lastString =
                  lastString + (lastString ? "," : "") + item.modelName;
              }
            });
          });
          if (this.carSeriesId.length == 1) {
            this.findCarModel();
          }
          carSeriesName = lastString;
          carSeriesId = selectId.join(",");
        }
      } else {
        this.carSeriesId = "";
        this.carSeriesName = "";
        this.carModel = [];
        this.carModelId = "";
        this.carModelName = "";
      }

      var seriseObj = {
        carSeriesId: carSeriesId,
        carSeriesName: carSeriesName,
      };
      var modelObj = {
        carModelId: this.carModelId,
        carModelName: this.carModelName,
      };
      this.$emit("seriseChangeVal", seriseObj);
      this.$emit("modelChangeVal", modelObj);
    },
    modelChange(selectId) {
      var carModelName = "";
      var carModelId = "";
      if (selectId) {
        if (!this.hasModelMult) {
          var choseItem = this.carModel.filter((item) => {
            return item.styleId == selectId;
          });

          carModelName = choseItem[0].styleYear + choseItem[0].styleName;
          carModelId = this.carModelId;
        } else {
          var lastString = "";
          this.carModel.filter((item) => {
            selectId.map((valItem) => {
              if (item.styleId == valItem) {
                lastString =
                  lastString + (lastString ? "," : "") + item.styleYear + item.styleName;
              }
            });
          });
          carModelName = lastString;
          carModelId = selectId.join(",");
        }
      } else {
        this.carModelId = "";
        this.carModelName = "";
      }

      var modelObj = {
        carModelId: carModelId,
        carModelName: carModelName,
      };
      console.log(modelObj);
      this.$emit("modelChangeVal", modelObj);
    },
  },
  mounted() {
    if (this.oldBrandId) {
      this.carBrandId = this.oldBrandId;
      this.findCarSerise();
    }
    if (this.oldSeriseId) {
      this.carSeriesId = this.oldSeriseId;
      this.findCarModel();
    }
    if (this.oldModelId) {
      this.carModelId = this.oldModelId;
    }
  },
  created() {
    this.findCarBrand();
  },
};
</script>

<style>
</style>