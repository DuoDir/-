//认证模块接口
const pathItem = process.env.pathItem;
const certificationApi = {
  // 认证车辆多条件查询
  findCertificateList: pathItem + '/dealers/car/selectCarCertifiedByParam',
  //查询全部品牌
  certiAllCarName:pathItem + "/dealers/car/getAllCarName",
  //根据品牌查车系
  certiAllCarModel:pathItem + "/dealers/car/getCarSetByCarId",
  //查询车型
  certiCarModelList:pathItem + "/dealers/car/getCarModelByCarSetId",
  // 新增或修改认证  // 删除/撤销认证信息
  certiSaveAndEdit:pathItem + "/dealers/car/saveCarAndCertified",
  // 根据id 查认证信息
  certiCarInfo: pathItem + "/dealers/car/selectCarCertifiedById",
  // 根据车辆属性查询车辆集合
  certiFindCarInfo:pathItem + "/dealers/car/findCarByParam",
  // 根据车辆vin 查车辆信息
  certiindeCarInfoByVin:pathItem + "/dealers/car/selectCarByVin",
  certiQueryLog:pathItem + "/dealers/car/queryCarWorkLogList",//流转记录
  downLoadPdf:pathItem +"/dealers/car/downloadPDF",//下载认证报道
  cerFindCar:pathItem + "/dealers/car/selectCarCerByVinNoStatus",//查询车辆信息
  // 查询认证证书pdf
  getPdfData:pathItem +"/dealers/car/getDownloadPdfData"
}


export default certificationApi;
