const index = () => import('@/views/base/index'),
  DealerGroup = () => import('@/views/DealerManage/DealerGroup/DealerGroup'),
  GroupDetail = () => import('@/views/DealerManage/DealerGroup/GroupDetail'),
  GroupEdit = () => import('@/views/DealerManage/DealerGroup/GroupEdit'),
  StoreList = () => import('@/views/DealerManage/Store/StoreList'),
  StoreDetail = () => import('@/views/DealerManage/Store/StoreDetail'),
  StoreEdit = () => import('@/views/DealerManage/Store/StoreEdit'),
  personList = () => import('@/views/DealerManage/person/personList'),
  personAdd = () => import('@/views/DealerManage/person/personAdd'),
  personEdit = () => import('@/views/DealerManage/person/personEdit'),
  personDetail = () => import('@/views/DealerManage/person/personDetail'),
  carsAssessList = () => import('@/views/carManagement/carsAssessList'),
  carAssessOperation = () => import('@/views/carManagement/carAssessOperation'),
  carAssessDetail = () => import('@/views/carManagement/carAssessDetail'),
  carOutStorageList = () => import('@/views/carManagement/carOutStorageList'),
  carsInventoryList = () => import('@/views/carManagement/carsInventoryList'),
  carOrderHostling = () => import('@/views/carManagement/carOrderHostling'),
  carExamineReport = () => import('@/views/carManagement/carExamineReport'),
  sellTransferEdit = () => import('@/views/carManagement/sellTransferEdit'),
  carOrderList = () => import('@/views/carOrderManagement/carOrderList'),
  carOrderDetail = () => import('@/views/carOrderManagement/carOrderDetail'),
  createCarOrderInfo = () => import('@/views/carOrderManagement/createCarOrderInfo'),
  customList = () => import('@/views/customManagement/customList'),
  customAdd = () => import('@/views/customManagement/customAdd'),
  customEdit = () => import('@/views/customManagement/customEdit'),
  customDetail = () => import('@/views/customManagement/customDetail'),
  certification = () => import('@/views/basicService/certification'),
  certificationDetails = () => import('@/views/basicService/certificationDetails'),
  certificationReport = () => import('@/views/basicService/certificationReport'),
  downloadCertificate = () => import('@/views/basicService/downloadCertificate'),
  carList = () => import("@/views/carManagement/carList"),
  applyCertification = () => import('@/views/basicService/applyCertification');

export default {
  index,
  DealerGroup,
  GroupDetail,
  GroupEdit,
  StoreList,
  StoreDetail,
  StoreEdit,
  personList,
  personAdd,
  personEdit,
  personDetail,
  carsAssessList,
  carAssessOperation,
  carAssessDetail,
  carOutStorageList,
  carsInventoryList,
  sellTransferEdit,
  carOrderHostling,
  carExamineReport,
  carOrderList,
  carOrderDetail,
  createCarOrderInfo,
  customList,
  customAdd,
  customEdit,
  customDetail,
  certification,
  certificationDetails,
  certificationReport,
  applyCertification,
  downloadCertificate,
  carList
}
