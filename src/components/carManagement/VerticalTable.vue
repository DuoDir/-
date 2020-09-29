<template>
  <!-- 竖向表格 -->
  <div class="VerticalTable">
    <table class="table-vertical">
      <tr v-for="index in rowsNum" :key="index">
        <template v-if="columnsNum>=5">
          <td class="column" v-if="tableKeys[index*columnsNum-5].title">
            <span>{{tableKeys[index*columnsNum-5].title}}</span>
          </td>
          <td class="colWidth" v-if="tableKeys[index*columnsNum-5].prop">
            <span>{{formatTopVal(tableKeys[index*columnsNum-5].prop)}}</span>
          </td>
          <td class="colWidth" v-if="tableKeys[index*columnsNum-5].icon">
            <img :src="formatIcon(tableKeys[index*columnsNum-5].icon)" />
          </td>
        </template>
        <template v-if="columnsNum>=4">
          <td class="column" v-if="tableKeys[index*columnsNum-4].title">
            <span>{{tableKeys[index*columnsNum-4].title}}</span>
          </td>
          <td class="colWidth" v-if="tableKeys[index*columnsNum-4].prop">
            <span>{{formatTopVal(tableKeys[index*columnsNum-4].prop)}}</span>
          </td>
          <td class="colWidth" v-if="tableKeys[index*columnsNum-4].icon">
            <img :src="formatIcon(tableKeys[index*columnsNum-4].icon)" />
          </td>
        </template>
        <template v-if="columnsNum>=3">
          <td class="column" v-if="tableKeys[index*columnsNum-3].title">
            <span>{{tableKeys[index*columnsNum-3].title}}</span>
          </td>
          <td class="colWidth" v-if="tableKeys[index*columnsNum-3].prop">
            <span>{{formatTopVal(tableKeys[index*columnsNum-3].prop)}}</span>
          </td>
          <td class="colWidth" v-if="tableKeys[index*columnsNum-3].icon">
            <img :src="formatIcon(tableKeys[index*columnsNum-3].icon)" />
          </td>
        </template>
        <template v-if="columnsNum>=2">
          <td class="column" v-if="tableKeys[index*columnsNum-2].title">
            <span>{{tableKeys[index*columnsNum-2].title}} </span>
          </td>
          <td class="colWidth" v-if="tableKeys[index*columnsNum-2].prop">
            <span>{{formatTopVal(tableKeys[index*columnsNum-2].prop)}}</span>
          </td>
          <td class="colWidth" v-if="tableKeys[index*columnsNum-2].icon">
            <img :src="formatIcon(tableKeys[index*columnsNum-2].icon)" />
          </td>
        </template>
        <template v-if="columnsNum>=1">
          <td class="column" v-if="tableKeys[index*columnsNum-1].title">
            <span>{{tableKeys[index*columnsNum-1].title}}</span>
          </td>
          <td class="colWidth" v-if="tableKeys[index*columnsNum-1].prop">
            <span>{{formatTopVal(tableKeys[index*columnsNum-1].prop)}}</span>
          </td>
          <td class="colWidth" v-if="tableKeys[index*columnsNum-1].icon">
            <img :src="formatIcon(tableKeys[index*columnsNum-1].icon)" />
          </td>
        </template>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
  props: {
    tableData: Object, //表格数据
    tableKeys: Array, //表格key
    columnsNum: Number, //显示列数
  },
  data() {
    return {
      rowsNum: 0, //行数
      rightIcon: require("@/assets/images/icon_right@3x.png"),
      wrongIcon: require("@/assets/images/icon_wrong@3x.png"),
    };
  },
  mounted() {
    this.rowsNum = this.tableKeys.length / this.columnsNum;
  },
  methods: {
    formatTopVal(val) {
      return this.tableData[val];
    },
    formatIcon(val) {
      return val == 1 ? this.rightIcon : this.wrongIcon;
    },
  },
};
</script>
<style lang="scss" scoped>
.VerticalTable {
  border: 0.5px solid #ebeef5;
  .table-vertical {
    border-collapse: collapse;
    width: 100%;
    tr {
      td {
        border: 0.5px solid #ebeef5;
        text-align: center;
        // width: 10%;
        padding: 10px;
        &.column {
          background: #f5f7fa;
        }
        &.colWidth {
          min-width: 40px;
        }
        img {
          width: 15px;
          height: 15px;
        }
      }
    }
  }
}
</style>