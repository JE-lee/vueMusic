import {getLynic} from 'api/song.js'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'
export default class Song{
    constructor({id,mid,singer,name,album,duration,image,url}){
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
    }
    /** 
    *返回一个promise对象
    */
    getLynic(){
        if(this.lyric){
            return Promise.resolve(this.lyric)
        }
        //发送ajax请求获取歌词
        return new Promise((resolve,reject)=>{
            getLynic(this.mid ).then((res)=>{
                if(res.retcode === ERR_OK){
                    this.lyric = Base64.decode(res.lyric)
                    resolve(this.lyric)
                }
            }).catch(()=>{
                reject('no lynic')
            })
        })
    }
}

export function createSong(musicData){
    return new Song({
        id:musicData.songid,
        mid:musicData.songmid,
        singer:filterSinger(musicData.singer),
        name:musicData.songname,
        album:musicData.albumname,
        duration:musicData.interval,
        image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url:`http://isure.stream.qqmusic.qq.com/C100${musicData.strMediaMid}.m4a?fromtag=32`
    })
}

function filterSinger(singerList){
    let ret = []
    singerList.forEach((singer)=>{
        ret.push(singer.name)
    })
    return ret.join('/')
}