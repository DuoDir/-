import axios from '../assets/js/axios_reset'
import path from '../assets/js/path.js'
import router from '../router'
import routerConfig from '@/assets/js/routerConfig'

const pathItem = path.pathList;

const formatRoutes = (routes) => {
  // 首页路由
  let routeData = {
    name: 'index',
    path: '/',
    redirect: "",
    component: routerConfig['index'],
    children: []
  }
  let organizationInfo = JSON.parse(localStorage.organizationInfo);
  routes.length && routes.map(route => {
    route.button = []
    let newRoute;
    routes.length && routes.map(button => {
      if (button.type == 3 && route.id == button.parentId) {
        route.button.push(button.buttonKey)
      }
    })
    if (route.type == 1 || (route.type == 3 && route.url)) {
      newRoute = {
        path: '/' + route.url,
        name: route.url,
        component: routerConfig[route.url],
        meta: {
          title: route.name,
          button: route.button,
          buttonKey: route.buttonKey
        }
      }
      routeData.children.push(newRoute)
    }
    if (!routeData.redirect) {
      if (organizationInfo.isPerfect === 0 && organizationInfo.storeType === 1) { // 1 集团 2 专营店
        routeData.redirect = {
          path: "GroupEdit",
          query: {
            id: organizationInfo.id,
            groupNum: organizationInfo.number
          }
        }
      } else if (organizationInfo.isPerfect === 0 && organizationInfo.storeType === 2) {
        routeData.redirect = {
          path: "StoreEdit",
          query: {
            id: organizationInfo.id,
            number: organizationInfo.number
          }
        }
      } else if (route.type == 1 && route.url) {
        routeData.redirect = route.url
      }
    }
  })
  return routeData;
};
const menuSideBarFormat = (data, parentData) => {
  for (let i = 0; i < parentData.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (parentData[i].id == data[j].parentId && data[j].type != 3) {
        if (
          parentData[i].children &&
          parentData[i].children.indexOf(data[j]) == -1
        ) {
          parentData[i].children.push(data[j]);
        } else {
          let childArr = [data[j]];
          parentData[i].children = childArr;
        }
        menuSideBarFormat(data, parentData[i].children);
      }
    }
  }
  if (parentData.length == 0) {
    parentData = data
  }
  return parentData
}

//获取当前用户路由权限
export const getRoutesList = async () => {
  let response;
  let routeArr = []
  await axios.post(pathItem.findDealerMenuButtonByThis, {})
    .then(res => {
      if (res.code == 0 && res.result.length > 0) {
        response = res.result;

        let routerData = formatRoutes(response, '')
        router.addRoutes([routerData])
        response.map(item => {
          if (item.parentId == 0) {
            routeArr.push(item)
          }
        })
        response = menuSideBarFormat(response, routeArr)
      } else {
        if (res.result.length == 0) {
          alert("您暂无任何权限，请联系管理员")
        }
        localStorage.removeItem('token')
        router.push("login")
      }
    })
  return response;
}
