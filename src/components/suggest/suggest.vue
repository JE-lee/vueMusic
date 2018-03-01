<template>
  <scroll ref="suggest"
          class="suggest"
          :data="result"
          :pullup=true
          @scrollToEnd="searchMore"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in result" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item.type)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading  title="" v-show="hasMore"></loading>
    </ul>
    <div  class="no-result-wrapper" v-show="!result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import NoResult from 'base/no-result/no-result'
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {Song,createSong} from 'common/js/song'
  import {mapMutations, mapActions} from 'vuex'
  import Singer from 'common/js/singer'
  
 
  const TYPE_SINGER = 'singer'
  const perpage = 20

  export default {
    props: {
      showSinger: {
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        page: 1,
        pullup: true,
        beforeScroll: true,
        hasMore: true,
        result: []
      }
    },
    methods:{
      selectItem(item){
        if(item.type === TYPE_SINGER){
         
          const singer = new Singer(item.singermid,item.singername)
          this.$router.push({
            path:`/search/${singer.id}`
          })
          this.setSinger(singer)
        }else{
          //点击的是一首歌曲
          this.insertSong({song:item})
          
        }
      },
      searchMore(){
        if(!this.hasMore) return
        this.page ++ 
        search(this.query,this.page,this.showSinger,perpage).then((res)=>{
          if(ERR_OK === res.code){
            
            this.result = this.result.concat(this._genResult(res.data))
            this._checkMore(res.data)
          }
        })

      },
      search(){
        search(this.query,this.page,this.showSinger,perpage).then((res)=>{
          if(ERR_OK === res.code){
            this.result = this._genResult(res.data)
            this._checkMore(res.data)
            
          }
        })
      },
      _checkMore(data){
        const song = data.song
        if(!song.list.length || (song.curnum + song.curpage *perpage) >= song.totalnum ){
          this.hasMore = false
        }else{
          this.hasMore = true
        }
      },
      _genResult(data){
        let ret = []
        if(data.zhida && data.zhida.singerid){
          ret.push({...data.zhida,...{type:TYPE_SINGER}})
        }
        
        if(data.song){
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs(list){
        let ret = []
        list.forEach((musicData)=>{
          if(musicData.songid && musicData.albumid){
            let song = createSong(musicData)
            //这里使用另外一个音源
            song = Object.assign(song,{
              url:`http://thirdparty.gtimg.com/C100${musicData.songmid}.m4a?fromtag=38`
            })
            
            ret.push(song)
          }
        })
        
        return ret
      },
      getIconCls(type){
        return type === TYPE_SINGER ? 'icon-mine' : 'icon-music'
      },
      getDisplayName(item){
        if(item.type === TYPE_SINGER){
          return item.singername
        }else{
          return `${item.name}-${item.singer}`
        }

      },
      ...mapMutations({
        setSinger:'SET_SINGER'
      }),
      ...mapActions(['insertSong'])
    },
    watch:{
        query(){
          this.page = 1
          this.search()
        }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>