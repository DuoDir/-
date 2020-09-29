import Vue from 'vue'
import Router from 'vue-router'
import baseRouter from '@/router/base_router' //系统基础相关路由
import store from '../store'

Vue.use(Router)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

let routes = []

routes = new Set([...routes, ...baseRouter]);
const router = new Router({
  mode: 'hash',
  routes
})

router.beforeEach((to, from, next) => {
  let list = store.state.routesListData.routesList;
  let token = window.localStorage.token
  if (Object.keys(list).length === 0 && token) {
    store.dispatch('addRoutesListMsg').then(() => {
      next({
        path: to.fullPath || to.path
      })
    })
  } else {
    store.dispatch("addVisitedViews", to);
    next();
  }
})

export default router
