// 订单管理
const pathItem = process.env.pathItem;

const carOrderManagementApi = {
  queryCarOrderPage: pathItem + '/dealers/order/queryCarOrderPage', //查询订单信息
  findCarInfo: pathItem + '/dealers/car/findCarInfoByOr', //条件查询车辆信息
  queryCustomerPage: pathItem + '/dealers/customer/queryCustomerPage', //客户列表
  addCarOrder: pathItem + '/dealers/order/addCarOrder', //新增订单信息
  updateCarOrder: pathItem + '/dealers/order/updateCarOrder', //编辑订单信息
  queryCarOrderById: pathItem + '/dealers/order/queryCarOrderById', //.查询订单信息（根据ID）
  cancellationOrder: pathItem + '/dealers/order/CancellationOrder', //取消订单
  BackCar: pathItem + '/dealers/order/BackCar', //退车
  additionalPayment: pathItem + '/dealers/order/additionalPayment', //追加尾款
  uploadSalesContract: pathItem + '/dealers/order/uploadSalesContract', //上传合同
  orderHint: pathItem + '/dealers/order/OrderHint', //订单提示（当编辑订单和新增订单时提示）
  findCarInfoAndPriceByVin: pathItem + "/dealers/car/findCarInfoAndPriceByVin" //根据VIN查询车辆信息和挂牌价
}
export default carOrderManagementApi
