<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
		
    <h1 class="title" v-html="title"></h1>
		
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" id="playBtn" @click="random" >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
		
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs" @scroll="scroll"
            :listen-scroll="listenScroll" :probe-type="probeType" class="list" ref="list">
      <div class="song-list-wrapper" ref="listwrapper">
        <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
	import SongList from 'base/song-list/song-list'
	import Scroll from 'base/scroll/scroll'
	import Loading from 'base/loading/loading'
	import {prefixStyle} from 'common/js/dom'
	import {mapActions} from 'vuex'
	import {playListMixin} from 'common/js/mixin'
	const transform = prefixStyle('transform')
	const REVERSED_HEIGHT = 48
	export default {
		mixins:[playListMixin],
		props:{
			songs:{
				type:Array,
				default:[]
			},
			rank:{
				type:Boolean,
				default:false
			},
			title:{
				type:String,
				default:''
			},
			bgImage:{
				type:String,
				default:''
			}
		},
		
		data(){
			return {
				scrollY:0
			}
		},
		created(){
			this.probeType = 3 //实时派发scroll事件
			this.listenScroll = true
			
		},
		mounted(){
			//计算bgImage 的高度，然后将list这个滚动区域的top值设为bgImage的高度
			this.imageHeight = this.$refs.bgImage.clientHeight
			this.minTranslateY = this.imageHeight - REVERSED_HEIGHT
			this.$refs.list.$el.style.top = this.imageHeight + 'px'
		},
		destroyed(){
			clearInterval(this.timer)
		},
		computed:{
			bgStyle(){
				return `background-image:url('${this.bgImage}')`
			}
		},
		methods:{
			handlePlayList(playlist){
				const bottom = playlist.length > 0 ? '60px' : ''
				this.$refs.list.$el.style.bottom = bottom
				this.$refs.list.refresh()
			},
			back(){
				this.$router.back()
			},
			scroll(pos){
				this.scrollY = pos.y
			},
			selectItem(item,index){
				//action
				this.selectPlay({
					list:this.songs,
					index:index
				})
			},
			...mapActions([
				'selectPlay',
				'randomPlay'
			]),
			random(){
				this.randomPlay({list:this.songs})
			}
		},
		watch:{
			scrollY(newY){
				
				let zIndex = 0
				let translateY = Math.max(-this.minTranslateY,newY)
				let percent = Math.abs(newY / this.imageHeight) + 1
				if(newY < 0){
					//向上滑动
					if(-this.minTranslateY <= newY){
						zIndex = 100
						this.$refs.bgImage.style.paddingTop = '70%'
						this.$refs.playBtn.style.display = ''
						this.$refs.bgImage.style.height = 0
					}else{
						//歌曲已经滚动处layer层了
						zIndex = 0
						this.$refs.bgImage.style.paddingTop = 0
						this.$refs.bgImage.style.height = `${REVERSED_HEIGHT}px`
						this.$refs.playBtn.style.display = 'none'
					}
				}else{
					//向下拖动//图片变大
					zIndex = 0
					this.$refs.bgImage.style[transform] = `scale(${percent})`
				}
				this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`	
				this.$refs.layer.style.zIndex = zIndex
				this.$refs.list.$el.style.zIndex = zIndex
			},
			
		},
		components:{
			SongList,
			Scroll,
			Loading
		},
	}
  
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.music-list
	position: fixed
	z-index: 100
	top: 0
	left: 0
	bottom: 0
	right: 0
	background: $color-background
	.back
		position absolute
		top: 0
		left: 6px
		z-index: 50
		.icon-back
			display: block
			padding: 10px
			font-size: $font-size-large-x
			color: $color-theme
	.title
		position: absolute
		top: 0
		left: 10%
		z-index: 40
		width: 80%
		no-wrap()
		text-align: center
		line-height: 40px
		font-size: $font-size-large
		color: $color-text
	.bg-image
		position: relative
		width: 100%
		height: 0
		padding-top: 70%
		transform-origin: top
		background-size: cover
		z-index:10
		.play-wrapper
			position: absolute
			bottom: 20px
			z-index: 50
			width: 100%
			.play
				box-sizing: border-box
				width: 135px
				padding: 7px 0
				margin: 0 auto
				text-align: center
				border: 1px solid $color-theme
				color: $color-theme
				border-radius: 100px
				font-size: 0
				.icon-play
					display: inline-block
					vertical-align: middle
					margin-right: 6px
					font-size: $font-size-medium-x
				.text
					display: inline-block
					vertical-align: middle
					font-size: $font-size-small
		.filter
			position: absolute
			top: 0
			left: 0
			width: 100%
			height: 100%
			background: rgba(7, 17, 27, 0.4)
	.bg-layer
		position: relative
		height: 100%
		background: $color-background
	.list
		position: fixed
		top: 0
		bottom: 0
		width: 100%
		background: $color-background
		.song-list-wrapper
			padding: 20px 30px
			
		.loading-container
			position: absolute
			width: 100%
			top: 50%
			transform: translateY(-50%)
</style>