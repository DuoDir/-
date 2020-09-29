'use strict'

let params = process.argv[2];
let pathItem = "";

switch (params) {
  case "dev":
    pathItem = '"http://dev.gwm.com.cn"'; //阿里云开发
    break;
  case "test":
    pathItem = '"https://test-ums-api.gwm.com.cn"'; //阿里云测试
    break;
  case "uat":
    pathItem = '"https://uat-ums-api.gwm.com.cn"'; //阿里云UAT
    break;
  case "prod":
    pathItem = '"https://ums-api.gwm.com.cn"'; //阿里云生产
    break;
  default:
    pathItem = '"https://ums-api.gwm.com.cn"'; //阿里云生产
    break;
}

module.exports = {
  NODE_ENV: '"production"',
  pathItem
}
