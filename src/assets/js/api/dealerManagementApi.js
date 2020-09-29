//经销商

const pathItem = process.env.pathItem;
// const pathItem = '';
// dealers  这个模块 线上加上 本地测试去掉
const dealerManagementApi = {
  // 经销商集团
  querySystemOrganizationDealersPage: pathItem + '/dealers/dealer/querySystemOrganizationDealersPage', // 查询经销商集团数据page 
  querySystemOrganizationDealer: pathItem + '/dealers/dealer/querySystemOrganizationDealer', // 查询经销商集团详情（根据ID） 
  upSystemOrganizationDealers: pathItem + '/dealers/dealer/upSystemOrganizationDealers', // 编辑经销商集团 
  querySystemCityList: pathItem + '/dealers/dealer/querySystemCityList', // 查询城市list(根据ID) 


  // 经销商专营店
  upSystemOrganizationDealer: pathItem + '/dealers/dealer/upSystemOrganizationDealer', // 编辑专营店
  queryDealerPage: pathItem + '/dealers/dealer/queryDealerPage', // 查询经专营店信息（page） 

  // 人员
  querySystemUserInfoDealersPage: pathItem + '/dealers/dealer/querySystemUserInfoDealersPage', // 查询员工的信息（page） 
  querySystemUserInfoDealersMenuPage: pathItem + '/dealers/dealer/querySystemUserInfoDealersMenuPage', // 人员列表查询
  queryDealerUserInById: pathItem + '/dealers/dealer/queryDealerUserInById', // 查询员工的信息（根据ID查询）
  addDealerUserInfo: pathItem + '/dealers/dealer/addDealerUserInfo', // 新增经销商角色信息
  querySystemUserInfoDealersByRole: pathItem + '/dealers/dealer/querySystemUserInfoDealersByRole', // 全部组员
  
  quserySystemPostDealersList: pathItem + '/dealers/dealer/quserySystemPostDealersList', // 获取岗位信息
  queryGroupList: pathItem + '/dealers/dealer/queryGroupList', // 获取单位信息
  updateupDealerUserInfo: pathItem + '/dealers/dealer/updateupDealerUserInfo', // 单位 岗位  选择组员  编辑人员保存  编辑登陆账号
  dimission: pathItem + '/dealers/dealer/dimission', // 离职
  
  querySubOrganizationsTree: pathItem + '/dealers/dealer/querySubOrganizationsTree', // 查询组织结构树（treeList）
  querySystemRoleDealersList: pathItem + '/dealers/dealer/querySystemRoleDealersList', // 查询经销商角色信息（list）
  
}


export default dealerManagementApi
