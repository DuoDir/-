<template>
  <div class="navMenu">
    <label v-for="navMenu in navMenus" :key="navMenu.id">
      <el-menu-item v-if="!navMenu.children" :data="navMenu" :index="navMenu.url">
        <i :class="navMenu.icon"></i>
        <span slot="title">{{navMenu.name}}</span>
      </el-menu-item>
      <el-submenu v-if="navMenu.children" :index="navMenu.id+''" :data="navMenu">
        <template slot="title">
          <i :class="navMenu.icon"></i>
          <span slot="title">{{navMenu.name}}</span>
        </template>
        <NavMenu :navMenus="navMenu.children"></NavMenu>
      </el-submenu>
    </label>
  </div>
</template>
<script>
export default {
  name: "NavMenu",
  props: {
    navMenus: Array,
  },
};
</script>