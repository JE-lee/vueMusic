import * as types from './mutation-types'
import { SET_FULL_SCREEN, SET_CURRENT_INDEX, SET_PLAY_STATE } from './mutation-types';
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
export const selectPlay = function({commit,state},{list,index}){
    if(playMode.random === state.playMode){
        let song = list[index]
        let randomList = shuffle(list)
        let randomIndex = randomList.findIndex((item)=>{
            return item.id === song.id
        })
        commit(types.SET_PLAY_LIST,randomList)
        commit(types.SET_CURRENT_INDEX,randomIndex)
    }else{
        commit(types.SET_PLAY_LIST,list)
        commit(types.SET_CURRENT_INDEX,index)
    }
    commit(types.SET_SEQUENCE_LIST,list.slice())
    commit(types.SET_FULL_SCREEN,true)
    
    commit(types.SET_PLAY_STATE,true)
}
export const randomPlay = function({commit},{list}){
    console.log("randomPlay",list)
    commit(types.SET_PLAY_MODE,playMode.random)
    commit(types.SET_SEQUENCE_LIST,list)
    commit(types.SET_PLAY_LIST,shuffle(list))
    commit(types.SET_CURRENT_INDEX,0)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAY_STATE,true)
}