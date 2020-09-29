import login from '@/views/base/login.vue'
import error404 from '@/views/base/error404'
const baseRouter = [{
  path: '/login', //模拟登录页，测试后删除
  name: 'login',
  component: login,
  meta: {
    title: '登录'
  }
}, {
  path: '*', //404
  name: '404',
  component: error404,
  meta: {
    title: '404-未找到该页面1'
  }
}]


export default baseRouter;
