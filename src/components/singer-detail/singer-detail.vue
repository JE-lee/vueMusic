<template>
	<transition name="slide">
		<div class="detail">
			singer-detail
		</div>
	</transition>
</template>
<script>
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
export default {
	data(){
		return {
			songlist:[]
		}
	},
  computed:{
	  ...mapGetters(['singer'])
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
				console.log(res)
			  if(ERR_OK === res.code){
					let list = res.data.list
					console.log(this._normalizeSongs(list))
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
  }
}
</script>
<style lang="stylus" scoped>
	@import '~common/stylus/variable'
	.detail
		position:fixed
		left:0
		right:0
		top:0
		bottom:0
		background-color:$color-background
		z-index:100
	.slide-enter-active,.slide-leave-active
		transition:all 0.3s
	.slide-enter,.slide-leave-to
		transform:translate3d(100%,0,0)
</style>

