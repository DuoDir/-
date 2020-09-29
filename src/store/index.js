import Vue from 'vue'
import Vuex from 'vuex'
import tagsview from './modules/tagsView.js'
import getters from './getter.js'
import routesListData from './modules/routerList'
// import workOrderStatus from './modules/workOrderStatus'

Vue.use(Vuex)

//创建vuex实例
const store=new Vuex.Store({
	modules:{
		tagsview,
		routesListData
	}, 
	getters
})

export default store