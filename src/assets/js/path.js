import baseOrOtherApi from '@/assets/js/api/baseOrOther_api.js';//基础/其他
import customApi from '@/assets/js/api/customManagementApi.js';//客户模块
import carManagementApi from '@/assets/js/api/carManagementApi.js'; //车辆管理
import carOrderManagementApi from '@/assets/js/api/carOrderManagement_api.js'; //订单管理
import certificationApi from '@/assets/js/api/certificate_api.js'; //工单模块
import dealerManagementApi from '@/assets/js/api/dealerManagementApi.js'; //经销商管理
//接口路径
let pathList = {
  //基础/其他
  ...baseOrOtherApi,

  //客户模块
  ...customApi,

  //经销商模块
  ...dealerManagementApi,
        
  //车辆管理
  ...carManagementApi,
  // 订单管理
  ...carOrderManagementApi,
  // 认证页面相关接口   
  ...certificationApi,
}
export default {
  pathList
}
