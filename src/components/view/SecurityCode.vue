<template>
  <div class="SecurityCode" style="width:100%;height:40px;" @click="getSecurityCode">
    <span v-for="(item,index) in codeList" :key="index" :style="getStyle(item)">{{item.securityCode}}</span>
  </div>
</template>
<script>
export default {
  name: "SecurityCode",
  data() {
    return {
      codeList: [],
      securityCode: "",
    };
  },
  mounted() {
    this.getSecurityCode();
  },
  methods: {
    getSecurityCode() {
      this.$axios.post(this.pathItem.securityCode).then((res) => {
        this.securityCode = res.result;
        this.createCode();
      });
    },
    createCode() {
      this.codeList = [];
      for (let i = 0; i < this.securityCode.length; i++) {
        let rgb = [
          Math.round(Math.random() * 220),
          Math.round(Math.random() * 240),
          Math.round(Math.random() * 200),
        ];
        let codeItem = {
          securityCode: this.securityCode[i], //验证码
          color: `rgb(${rgb})`, //随机颜色
          fontSize: `1${[Math.floor(Math.random() * 10)]}px`, //随机字号
          padding: `${[Math.floor(Math.random() * 10)]}px`, //随机内边距
          transform: `rotate(${
            Math.floor(Math.random() * 90) - Math.floor(Math.random() * 90)
          }deg)`, //随机旋转角度
        };
        this.codeList.push(codeItem);
      }
    },
    getStyle(data) {
      return `color:${data.color};font-size:${data.fontSize};padding:${data.padding};transform:${data.transform}`;
    },
  },
};
</script>
<style lang="scss" scoped>
.SecurityCode {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f3f3f3;
  cursor: pointer;
  span {
    display: inline-block;
  }
}
</style>