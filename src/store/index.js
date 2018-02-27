import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'
import state from './state'
import createLogger from 'vuex/dist/logger'
//用来在控制台打印每次的mutition的改变
const debug = process.env.NODE_ENV == 'development'

Vue.use(Vuex)
export default  new Vuex.Store({
    actions,
    getters,
    mutations,
    state,
    strict:debug,//调试vuex
    plugins:debug ? [createLogger()] : []
})