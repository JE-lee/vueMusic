import * as types from './mutation-types'
import { SET_FULL_SCREEN, SET_CURRENT_INDEX, SET_PLAY_STATE } from './mutation-types';
export const selectPlay = function({commit,state},{list,index}){
    commit(types.SET_PLAY_LIST,list)
    commit(types.SET_SEQUENCE_LIST,list)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_CURRENT_INDEX,index)
    commit(types.SET_PLAY_STATE,true)
}