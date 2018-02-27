<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs" :rank=true></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {getMusicList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {mapGetters} from 'vuex'
  import {createSong} from 'common/js/song'

  export default {
    data(){
      return {
        songs:[]
      }
    },
    created(){
      if(!this.topList.id){
        this.$router.push('/rank')
      }
      getMusicList(this.topList.id).then((res)=>{
        console.log('res',res)
        if(ERR_OK === res.code){
          this.songs= this._normalizeList(res.songlist)
        }
        
      })
    },
    methods:{
      _normalizeList(list){
        let ret = []
        console.log('list',list)
        list.forEach((item)=>{
          const musicData = item.data
          if(musicData.songid && musicData.albumid){
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
    },
    computed:{
      ...mapGetters([
        'topList'
      ]),
      title(){
        return this.topList.topTitle
      },
      bgImage(){
        if(this.songs.length > 0){
          return this.songs[0].image
        }
        return ''
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>