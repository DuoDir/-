'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

let params = process.argv[4];
let pathItem = "";

switch (params) {
  case "--env=dev":
    pathItem = '"http://dev.gwm.com.cn"'; //阿里云开发
    break;
  case "--env=test":
    pathItem = '"https://test-ums-api.gwm.com.cn"'; //阿里云测试
    break;
  case "--env=uat":
    pathItem = '"https://uat-ums-api.gwm.com.cn"'; //阿里云UAT
    break;
  case "--env=prod":
    pathItem = '"https://ums-api.gwm.com.cn"'; //阿里云生产
    break;
  default:
    pathItem = '"http://dev.gwm.com.cn"'; //阿里云开发
    break;
}
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  pathItem
})
