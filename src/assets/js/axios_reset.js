/*
 * axios封装
 * 请求拦截   相应拦截   错误统一处理
 */
import axios from 'axios';
import qs from 'qs'; //引入qs模块，用来序列化post类型的数据 
import router from '../../router/index'
//post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json';

//设置请求超时
axios.defaults.timeout = 60000;
//配置允许跨域携带cookie
axios.defaults.crossDomain = true;
axios.defaults.withCredentials = true; // 允许携带cookie


// http request 请求拦截器，为请求添加token
axios.interceptors.request.use(
  config => {
    let storage = window.localStorage;

    if (storage.token) {
      config.headers.common['token'] = storage.token;
    }
    return config;
  }, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

//响应拦截器
axios.interceptors.response.use(
  response => {
    //如果返回的状态码是200,说明接口请求成功，可以正常拿到数据
    //否则抛出错误
    if (response.data.code === 10002) {
      router.push({
        path: '/login',
        query: {
          redirect: router.currentRoute.fullPath
        } //从哪个页面跳转
      })

      return;
    } else {
      return response
    }
  }, error => {
    return Promise.reject(error.response.data);
  }
)

export default {
  /*
   * get请求
   * @param {String} url [请求的url地址]
   * @param {Object} params[请求时携带的参数]
   */
  get: (url, params) => {
    return new Promise((resolve, reject) => {
      axios.get(url, {
          params: params
        })
        .then(res => resolve(res.data))
        .catch(err => reject(err.data))
    })
  },
  /*
   * post请求
   * @param {String} url[请求的url]
   * @param {Object} 
   */
  post: (url, params, headers) => {
    return new Promise((resolve, reject) => {
      //{arrayFormat:'brackets'}  参数转换成字符串数组形式  string[]=1&string[]=2&string[]=3
      axios.post(url, params, headers).then(res => {
        resolve(res.data);
      }).catch(err => {
        //无网络时跳转无网络页面
        reject(err.data)
      })
    })
  },
}
