<template>
  <div class="player" v-show="playList.length>0">
    <transition name="normal"         
    >
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
        <div class="middle" 
          @touchstart.prevent='onMiddleTouchStart'
          @touchmove.prevent='onMiddleTouchMove'
          @touchend.prevent='onMiddleTouchEnd'>
          <div class="middle-l" ref="middleL" @click.stop.prevent="onMiddleLClick">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="imgClass">
                <img class="image" :src="currentSong.image" >
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current': currentLineNum ===index}"
                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :persent="persent" @persentChange="onPersentChange" :clickDelay="150"></progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changePlayMode">
              <i :class="iconPlayMode"></i>
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
          <progress-circle :percent="persent" :radius="32" class="progress-circle" >
            <i @click.stop="togglePlaying" :class="playClass" class="icon-mini"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentSong.url " @canplay="ready" @error="error" @timeupdate="updateTime"
    @ended="end" autoplay></audio>
  </div>
</template>

<script type="text/ecmascript-6">
	import {prefixStyle} from 'common/js/dom'
  import {mapGetters,mapMutations} from 'vuex'
  import animation from 'create-keyframe-animation'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import {playMode} from 'common/js/config'
  import {shuffle} from 'common/js/util'
  import Lyric from 'lyric-parser'
  import Scroll from 'base/scroll/scroll'
  import {audioAutoplay} from 'common/js/audioAutoplay'
  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')

  
  export default {
    data(){
      return {
        audioReady:false,
        currentTime:0,
        currentLyric:null,
        currentLineNum:0,
        currentShow:'cd',
        playingLyric:'',
        first__:true //移动端audio无法自动播放，所以在用户交互事件中执行audio.play()
      }
    },
    computed:{
      iconPlayMode(){
        return this.playMode === playMode.sequence ? 'icon-sequence' : this.playMode === playMode.loop ? 
              'icon-loop' : 'icon-random'
      },
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
        'currentIndex',
        'playMode',
        'sequenceList'
			]),
    },
    created(){
      this.touch = {}
    },
    mounted(){
      audioAutoplay(this.$refs.audio,()=>{
        console.log('autoplay')
        this.$refs.audio.currentTime = 0
      })
    },
    methods:{
      onMiddleLClick(e){
        if('cd' === this.currentShow){
          let lyric = this.$refs.lyricList.$el
          let cd = this.$refs.middleL
          lyric.style.transform = `translate3d(${-window.innerWidth}px,0,0)`
          lyric.style.transitionDuration = `300ms`
          cd.style.opacity = 0
          cd.style.transitionDuration = '300ms' 
          this.currentShow = 'lyric'
          this.touch = {}
        }
      },
      //middle 部分的左右滑动
      onMiddleTouchStart(e){
        
        this.touch.startX = e.touches[0].pageX
        this.touch.startY = e.touches[0].pageY
      },
      onMiddleTouchMove(e){
        
        let detalX = e.touches[0].pageX - this.touch.startX
        let detalY = e.touches[0].pageY - this.touch.startY
        if(Math.abs(detalY) - Math.abs(detalX) > 0){
          this.touch.initialed = false
          return 
        }
        this.touch.initialed = true
        let x = 0
        let lyric = this.$refs.lyricList.$el
        let cd = this.$refs.middleL
        let windowWidth = window.innerWidth
       
        if('cd' === this.currentShow){
           if(detalX < -windowWidth * 0.1){
             this.touch.over = true
           }else{
             this.touch.over = false
           }
           x = Math.max(-windowWidth,Math.min(0,detalX))
        }else{
          if(detalX > windowWidth * 0.1){
            this.touch.over = true
          }else{
            this.touch.over = false
          }
          x = -windowWidth + Math.max(Math.min(detalX,windowWidth),0)
        }

        let persent = Math.abs(x) / windowWidth
       
        lyric.style.transform = `translate3d(${x}px,0,0)`
        lyric.style.transitionDuration = `0ms`
        cd.style.opacity = 1 - persent
        cd.style.transitionDuration = '0ms'
      },
      onMiddleTouchEnd(e){
        
        if(!this.touch.initialed){
          this.touch.over = false
          return 
        }
        let lyric = this.$refs.lyricList.$el
        let cd = this.$refs.middleL
        let x = 0
        let time = 600
        let windowWidth = window.innerWidth
        let opacity = 0
        if(this.touch.over){
          if('cd' === this.currentShow){
            x = -windowWidth
            this.currentShow = 'lyric'
            opacity = 0
          }else{
            x = 0
            this.currentShow = 'cd'
            opacity = 1
          }
        }else{
          if('cd' === this.currentShow){
            x = 0
            opacity = 1
          }else{
            x = -windowWidth
            opacity = 0 
          }
        }

        lyric.style.transform = `translate3d(${x}px,0,0)`
        lyric.style.transitionDuration = `300ms`
        cd.style.opacity = opacity
        cd.style.transitionDuration = '300ms'
        this.touch = {}
        
      },
      changePlayMode(){
        let mode = (this.playMode + 1 ) % 3
        this.setPlayMode(mode)
        let lyric = this.$refs.lyricList.$el
        let list = this.sequenceList
         //如果是随机模式
        if(mode === playMode.random){
          list = shuffle(list)
        }else{
          list = this.sequenceList
        }
        //重设index
        this._resetCurrentIndex(this.currentSong,list)
        this.setPlayList(list)
      },
      _resetCurrentIndex(song,list){
        let index = list.findIndex((item)=>{
          return item.id === song.id
        })
        this.setCurrentIndex(index || 0)
      },
      onPersentChange(persent){
        let audio = this.$refs.audio
        if(this.playing)
          audio.pause()
        let time = this.currentSong.duration * persent
        audio.currentTime = time
        if(this.playing){
          this.$nextTick(()=>{
            audio.play()
            //console.log("this.currentLyric,time",this.currentLyric,time*1000)
            if(this.currentLyric){
              this.currentLyric.seek(time*1000)
            }
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
        this.currentTime = e.target.currentTime 
      },
      error(){
        this.audioReady = true
      },
      ready(){
        this.audioReady = true
      },
      end(){
        //歌曲播放完毕
        setTimeout(()=>{
          if(this.playMode === playMode.loop){
            this.loop()
            
          }else{
            this.next()
          }
        },50)
        
      },
      loop(){
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if(this.currentLyric){
          this.currentLyric.seek(0)
        }
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
        if(index > this.playList.length - 1){
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
        this.currentLyric.togglePlay()
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
        animation.runAnimation(this.$refs.cdWrapper,'move',()=>{
          done()
        })
      
      },
      afterEnter(){
        this.$refs.cdWrapper.style.animation = ''
        animation.unregisterAnimation('move')
      },
      leave(el,done){
        let {x,y,scale} = this._getPosAndDemasion()
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        clearTimeout(this.timer__)
        this.timer__ = setTimeout(()=>{
          done()
        },400)
       
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
        setCurrentIndex:'SET_CURRENT_INDEX',
        setPlayMode : 'SET_PLAY_MODE',
        setPlayList: 'SET_PLAY_LIST'
      }),
      back(){
        //隐藏大的播放组件
        this.setFullScreen(false)
      },
      showFullPlayer(){
        this.setFullScreen(true)
      },
      _getLyric(){
        this.currentSong.getLynic().then((lyric)=>{
          this.currentLyric = new Lyric(lyric,this._handleLyric)
         
          if(this.playing){
            this.currentLyric.play()
            this.currentLyric.seek(this.currentTime)
          }
        },(err)=>{
          console.log('player get lynic error:',err)
        })
      },
      _handleLyric({lineNum,txt}){
        this.currentLineNum = lineNum
        //始终让歌词列表滚动在中间
        //console.log('lineNum',lineNum)
        this.playingLyric = txt
        if(lineNum > 5){
          this.$refs.lyricList.scrollToElement(this.$refs.lyricLine[lineNum -5],1000)
        }else{
          this.$refs.lyricList.scrollToElement(0,0,1000)
        }
      }
    },
    watch:{
      currentSong(){
        //console.log('currentSong',this.currentSong)
        if(this.currentLyric){
          this.currentLyric.stop()
        }
        clearTimeout(this.timer)
        this.timer = setTimeout(()=>{
          this.$refs.audio.play()
          //获取歌词
          this._getLyric()
        },1000)
      },
      playing(n,o){
        const audio = this.$refs.audio
        this.$nextTick(()=>{
          n ? audio.play() : audio.pause()
        })
      }

    },
    components:{
      ProgressBar,
      ProgressCircle,
      Scroll
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
        .progress-circle
          position:relative
          .icon-mini
            font-size: 24px
            position: absolute
            left: 50%
            top: 50%
            transform:translate3d(-50%,-50%,0)
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>