//车辆管理
const pathItem = process.env.pathItem;

const carManagementApi = {
  //公共
  findAreaList: pathItem + "/dealers/dealer/querySystemCityList", //查询城市名称
  getOrgNameList: pathItem + "/dealers/dealer/queryGroupList", //获取经销商
  getAllOpactor: pathItem + "/dealers/dealer/querySystemUserInfoDealersListOneTable", //查询操作人
  uploadImgFile: pathItem + "/dealers/car/addOrUpdFileList", //上传文件

  addOrUpdCar: pathItem + '/dealers/car/addOrUpdCar', //保存或修改建卡信息
  checkUserCar: pathItem + '/dealers/car/findCarByReportStatusAndBookPhone', //手机号查询是否有未评估/中车辆
  findAppraiserList: pathItem + "/dealers/dealer/querySystemUserInfoDealersList", //查询评估师
  findCarList: pathItem + "/dealers/car/findCarByJointCondition", //查询车辆列表
  findCarOperator: pathItem + "/dealers/dealer/querySystemUserInfoDealersListOneTable", //查询门店
  findCarInfoById: pathItem + "/dealers/car/findCarById", //通过id 查询车辆信息
  saveCarProcedure: pathItem + "/dealers/car/addCarProcedure", //保存手续信息
  findCarProcedureByCarId: pathItem + "/dealers/car/findCarProcedureByCarId", //通过车辆id 查手续信息
  carputStorage: pathItem + "/dealers/car/addStorageOrUpdCar", //入库
  deleteCar: pathItem + "/dealers/car/deleteCar", //删除车辆

  // 车辆详情
  findParticularsById: pathItem + "/dealers/car/findParticulars", // 车辆详情
  queryCarOrderList: pathItem + "/dealers/order/queryCarOrderList", // 根据车id 查询订单

  // 在库
  addOrUpdSalesPrice: pathItem + "/dealers/car/addOrUpdSalesPricing", //销售定价
  findCarPeiceByCondition: pathItem + "/dealers/car/findCarPeiceByCondition", //查询定价
  putawayCarById: pathItem + "/dealers/car/putawayById", //上架
  soldOutCarById: pathItem + "/dealers/car/soldOutById", //下架
  saveCarWorkOrder: pathItem + "/dealers/car/saveCarWorkOrder", //发起整备
  getHostlingList: pathItem + "/dealers/car/queryCarHostlingProject", //查询整备项目

  // 整备
  findWorkCarList: pathItem + "/dealers/car/carWorkOrderPage", //查询整备工单
  gethostInfo: pathItem + "/dealers/car/carWorkOrderInfo", //查看整备工单详情
  editHostlingInfo: pathItem + "/dealers/car/editCarWorkOrder", //编辑整备工单
  invalidHostlingItem: pathItem + "/dealers/car/cancellationWorkOrder", //作废整备工单
  recallHostling: pathItem + "/dealers/car/withdrawWorkOrder", //撤回整备工单
  agreeAndRejectWorkOrder: pathItem + "/dealers/car/passOrRejectWorkOrder", //.同意整备工单 || 驳回待验收工单
  rejectWorkOrder: pathItem + "/dealers/car/rejectWorkOrder", //审批驳回整备工单
  completeWorkOrder: pathItem + "/dealers/car/forAcceptanceWorkOrder", //整备完成待验收
  checkAndAcceptWorkOrder: pathItem + "/dealers/car/checkAndAcceptPassWorkOrder", //整备工单验收通过
  reSubmitOrder: pathItem + "/dealers/car/submitWorkOrder", //提交整备工单
  checkOrderLog: pathItem + "/dealers/car/queryCarWorkLogList", //查询流转记录
  addCarWorkAccont: pathItem + "/dealers/car/saveCarWorkAccount", //保存结算单
  checkOrderSettlement: pathItem + "/dealers/car/carWorkAccountInfoByWorkId", //根据整备工单id查询结算清单

  //过户
  saveOrEditCarTransferInfo: pathItem + "/dealers/car/saveOrEditCarTransferInfo", //过户
  carTransferInfoByCarId: pathItem + "/dealers/car/carTransferInfoByCarId", //根据车Id查详情

  // 车辆详情
  findItemAndCarBaseInfoByTypeAndCarId: pathItem + "/dealers/car/findItemAndCarBaseInfoByTypeAndCarId", //检测报告
  getLogByTypeAndMainId: pathItem + "/dealers/car/getLogByTypeAndMainId",
  // 检测报告
  carExamineProject: 'static/carExamineProject.json', //检测报告坐标点数据
}
export default carManagementApi;
