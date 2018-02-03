<template>
  <div class="player" v-show="playList.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave = "afterLeave"
                appear>
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" >
            <i class="icon-back" @click="back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="imgClass">
                <img class="image" :src="currentSong.image" >
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :persent="persent" @persentChange="onPersentChange" :clickDelay="150"></progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" >
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left" :class="disableCls" >
              <i  @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playClass"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i  class="icon-favorite" ></i>
            </div>
          </div>
        </div>
        
      </div>
		</transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="showFullPlayer">
        <div class="icon">
          <img  width="40" height="40" :src="currentSong.image" :class="imgClass">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i @click.stop="togglePlaying" :class="playClass"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentSong.url " @canplay="ready" @error="error" @timeupdate="updateTime"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
	import {prefixStyle} from 'common/js/dom'
  import {mapGetters,mapMutations} from 'vuex'
  import animation from 'create-keyframe-animation'
  import ProgressBar from 'base/progress-bar/progress-bar'
  const transform = prefixStyle('transform')
	const transitionDuration = prefixStyle('transitionDuration')
  export default {
    data(){
      return {
        audioReady:false,
        currentTime:0,
  
      }
    },
    computed:{
      persent(){
       
        return this.currentTime / this.currentSong.duration 
      },
      disableCls(){
        return this.audioReady ? '' : 'disable'
      },
      imgClass(){
        return this.playing ? 'play' :'pause'
      },
      playClass(){
        return this.playing ? 'icon-pause' : 'icon-play'
      },
			...mapGetters([
				'playList',
				'fullScreen',
        'currentSong',
        'playing',
        'currentIndex'
			]),
    },
    methods:{
      onPersentChange(persent){
        let audio = this.$refs.audio
        if(this.playing)
          audio.pause()
        let time = this.currentSong.duration * persent
        this.$refs.audio.currentTime = time
        if(this.playing){
          this.$nextTick(()=>{
            audio.play()
          })
        }
      },
      formatTime(number){
        let time = number | 0
        let minute = (time / 60) | 0
        let second = time % 60
        return `${this._completeNumber(minute)}:${this._completeNumber(second)}`
      },
      updateTime(e){
        this.currentTime = e.target.currentTime | 0
      },
      error(){
        this.audioReady = true
      },
      ready(){
        this.audioReady = true
      },
      prev(){
        if(!this.audioReady)
          return 
        let index = this.currentIndex - 1
        //循环播放
        if(index < 0){
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        if(!this.playing){
          this.togglePlaying()
        }
        this.audioReady = false
      },
      next(){
        if(!this.audioReady)
          return 
        let index = this.currentIndex + 1
        if(index > this.playList - 1){
          index = 0
        }
        this.setCurrentIndex(index)
        if(!this.playing){
          this.togglePlaying()
        }
        this.audioReady = false

      },
      togglePlaying(){
        this.setPlayingState(!this.playing)
      },
      enter(el,done){
        let {x,y,scale} = this._getPosAndDemasion()
        animation.registerAnimation({
          name:'move',
          presets:{
            duration:400,
            easing:'linear',
          },
          animation:{
            0:{
              transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
            },
            60:{
              transform:`translate3d(0,0,0) scale(1.1)`
            },
            100:{
              transform:`translate3d(0,0,0) scale(1.0)`
            }
          }
        })

        animation.runAnimation(this.$refs.cdWrapper,'move',done)
      
      },
      afterEnter(){
        this.$refs.cdWrapper.style.animation = ''
        animation.unregisterAnimation('move')
      },
      leave(el,done){
        let {x,y,scale} = this._getPosAndDemasion()
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend',done)
      },
      afterLeave(){
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      _completeNumber(num,n=2){
        let length = num.toString().length
        let result = num
        while(length < n){
          result = '0' + result
          length++
        }
        return result
      },
      _getPosAndDemasion(){
        const windowHeight = window.innerHeight
        const windowWidth = window.innerWidth
        const cdWidth = windowWidth * 0.8
        const x = -(windowWidth / 2 - 40)
        const y = windowHeight - 80 - cdWidth /2 - 30
        const scale = 40/cdWidth
        return {
          x,
          y,
          scale
        }

      },
      ...mapMutations({
        setFullScreen:'SET_FULL_SCREEN',
        setPlayingState:'SET_PLAY_STATE',
        setCurrentIndex:'SET_CURRENT_INDEX'
      }),
      back(){
        //隐藏大的播放组件
        this.setFullScreen(false)
      },
      showFullPlayer(){
        this.setFullScreen(true)
      }
    },
    watch:{
      currentSong(){
        this.$nextTick(()=>{
         this.$refs.audio.play()
        })
      },
      playing(n,o){
        const audio = this.$refs.audio
        this.$nextTick(()=>{
          n ? audio.play() : audio.pause()
        })
      }

    },
    components:{
      ProgressBar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            box-sizing:border-box
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
                

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>