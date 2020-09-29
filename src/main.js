// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from '@/store'
import router from './router'
import axios from './assets/js/axios_reset.js'
import path from './assets/js/path.js'
import ElementUI from 'element-ui';
import formatDate from './assets/js/format_date.js'
import htmlToPdf from '@/assets/js/htmlToPdf.js'; //html转pdf
import Clipboard from 'clipboard'; //点击复制文本
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/public_style.css';

Vue.use(ElementUI);
Vue.use(htmlToPdf);
Vue.config.productionTip = false

Vue.prototype.$axios = axios;
Vue.prototype.pathItem = path.pathList;
Vue.prototype.formatDate = formatDate;
Vue.prototype.clipboard = Clipboard;
/* eslint-disable no-new */
Vue.filter('formatDate', formatDate);
new Vue({
  el: '#app',
  store,
  router,
  components: {
    App
  },
  template: '<App/>'
})
