<template>
	<transition name="slide">
		<music-list :songs="songList" :title="title" :bg-image="bgImage"></music-list>
	</transition>
</template>
<script>
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import MusicList from 'components/music-list/music-list'
export default {
	data(){
		return {
			songList:[],
		}
	},
  computed:{
		...mapGetters(['singer']),
		title(){
			return this.singer.name
		},
		bgImage(){
			return this.singer.avatar
		}
  },
  created(){
		this._getSingerDetail()
  },
  methods:{
	  _getSingerDetail(){
		  if(!this.singer.id){
			  this.$router.push('/singer')
			  return 
		  }
		  getSingerDetail(this.singer.id).then((res)=>{
			
			  if(ERR_OK === res.code){
					let list = res.data.list
					this.songList = this._normalizeSongs(list)
					//console.log("this.songlist",this.songList)
				}
			})
		},
		_normalizeSongs(list){
			let ret = []
			list.forEach((item)=>{
				let {musicData} = item
				if(musicData.songid && musicData.albummid)
					ret.push(createSong(musicData))
			})
			return ret
		}
	},
	components:{
		MusicList
	}
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable'
.slide-enter-active,.slide-leave-active
	transition:all 0.3s
.slide-enter,.slide-leave-to
	transform:translate3d(100%,0,0)
</style>

