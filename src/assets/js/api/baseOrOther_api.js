//基础/其他
const pathItem = process.env.pathItem;

const baseOrOtherApi = {
  // 登录
  login: pathItem + '/dealers/login', //登录
  updatePassword: pathItem + '/dealers/dealer/updatePassword', //修改密码

  securityCode: pathItem + "/login/securityCode",
  getCarModelByCarSetId: pathItem + '/dealers/car/getCarModelByCarSetId',
  getRoutesList: 'static/routersList.json', //获取用户权限
  findDealerMenuButtonByThis: pathItem + "/dealers/sys/findDealerMenuButtonByThis", //获取用户权限
  findUserRedisInfo: pathItem + "/dealers/dealer/findUserRedisInfo", // 查询当前登陆人信息

  // 文件类接口

  // 批量添加或修改文件信息
  addOrUpdateFileList: pathItem + "/dealers/car/addOrUpdFileList",
  // 根据模块名称和主表记录id查询文件记录信息
  getFileListByTableAndMainKey: pathItem + "/dealers/car/getFileListByTableNameAndMainKeyAndType",
  // 主表记录id和子类型List 查询文件记录信息
  getFileListByMainKeyAndTypeList: pathItem + "/dealers/car/getFileListByMainKeyAndTypeList",
  //查询城市
  querySystemCityList: pathItem + "/dealers/dealer/querySystemCityList",
  querySystemUserInfoDealersList: pathItem + '/dealers/dealer/querySystemUserInfoDealersList', //查询销售顾问list
  imagesUpload:pathItem + "/dealers/car/imagesUpload"  // 图片上传
}

export default baseOrOtherApi;
