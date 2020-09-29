import {getRoutesList} from '../../middleware/base_mid'

const routesListData = {
	state: {
		routesList: {}, //routes列表
	},
	mutations: {
		//存储列表信息
		ADD_ROUTESLIST_MSG(state, info) {	
			state.routesList=info
		}
	},
	actions: {
		async addRoutesListMsg({commit}) {
			//动态注入数据看板路由
			let data = await getRoutesList();
			commit('ADD_ROUTESLIST_MSG',data)
		},

	}
}

export default routesListData