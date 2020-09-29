//客户模块
const pathItem = process.env.pathItem;
const customApi = {
    findCustomerFactoryByParam: pathItem + '/dealers/customer/findCustomerDealerByParam',// 客户列表
    getCustomerTemplate: pathItem + '/dealers/customer/getCustomerTemplate',// 下载导入模板
    exportCustomerResultByParam: pathItem + '/dealers/customer/exportCustomerResultByParam',// 导出
    importExcel: pathItem + '/dealers/customer/importExcel',// 导入
    getCheckoutPlan: pathItem + '/dealers/customer/getCheckoutPlan',// 获取校验数据进度
    getImportPlan: pathItem + '/dealers/customer/getImportPlan',// 获取导入的进度 提示出现的错误
    importCustomer: pathItem + '/dealers/customer/importCustomer',// 往数据库插入数据
    getImportPlan: pathItem + '/dealers/customer/getImportPlan',// 获取导入的进度
    cancelCheckoutPlan: pathItem + '/dealers/customer/cancelCheckoutPlan',// 取消数据校验
    queryGroupList: pathItem + '/dealers/dealer/queryGroupList', // 获取经销商下拉 
    getAllCarName: pathItem + '/dealers/car/getAllCarName',// 查询全部品牌信息
    getCarSetByCarId: pathItem + '/dealers/car/getCarSetByCarId',// 根据品牌id查询车系信息
    getCarModelByCarSetId: pathItem + '/dealers/car/getCarModelByCarSetId',// 根据车系id查询车型信息
    querySystemCityList: pathItem + '/dealers/dealer/querySystemCityList',// 省市
    querySystemUserInfoDealersList: pathItem + '/dealers/dealer/querySystemUserInfoDealersList',// 根据条件查询用户的信息list(根据任意条件)
    querySystemUserInfoDealersListOneTable : pathItem + '/dealers/dealer/querySystemUserInfoDealersListOneTable',// 查询用户的信息list
    saveCustomer: pathItem+ '/dealers/customer/saveCustomer',// 客户保存
    saveCustomerNeed: pathItem+ '/dealers/customer/saveCustomerNeed',// 客户需求保存
    editCustomer: pathItem + '/dealers/customer/editCustomer',// 客户编辑保存
    editCustomerNeed: pathItem + '/dealers/customer/editCustomerNeed',// 客户需求编辑保存
    customerInfo: pathItem + '/dealers/customer/customerInfo',// 客户信息回显
    customerNeedInfo: pathItem + '/dealers/customer/customerNeedInfo',// 客户需求回显

    saveCustomerFollowUp: pathItem + '/dealers/customer/saveCustomerFollowUp',// 客户跟进保存
    saveCustomerChanges: pathItem + '/dealers/customer/saveCustomerChanges',// 客户转移保存

    customerFollowUpList: pathItem + '/dealers/customer/customerFollowUpList',// 跟进记录
    queryCarOrderPage: pathItem + '/dealers/order/queryCarOrderPage',// 订单详情
    
}


export default customApi;