/**
 * 获取歌曲信息，例如歌词
 */
import axios from 'axios'
import { commonParams } from './config';
export function getLynic(mid){
    const url = '/api/lyric'
    const data = Object.assign({},commonParams,{
        songmid: mid,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        categoryId: 10000000,
        pcachetime: +new Date(),
        format: 'json'
    })
    return new axios.get(url,{
        params:data
    }).then((res)=>{
        return Promise.resolve((res.data))
    })
}