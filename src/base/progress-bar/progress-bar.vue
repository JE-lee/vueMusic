<template>
  <div class="progress-bar" ref="progressBar" @click="onProgressBarClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent="onProgressBtnStart"
        @touchmove.prevent="onProgressBtnMove"
        @touchend.prevent="onProgressBtnEnd"
        >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom'
  import {antiShake as AntiShake} from 'common/js/util'
  const transform = prefixStyle('transform')
  let antiShake = AntiShake()
  export default {
    props:{
      persent:{
        type:Number,
        default:0
      },
      clickDelay:{
        type:Number,
        default:100
      }
    },
    created(){
      this.touch = {}
    },
    methods:{
      onClick1(e){
        console.log("btn click")
      },
      onProgressBarClick(e){
        const progressbarWidth = this.$refs.progressBar.clientWidth  - 16
        let persent = e.offsetX / progressbarWidth
        //这里当我们点击progressBtn的时候，e.offsetX获取不对
        //在progressBtn 的touch事件中禁用了默认行为，则btn的点击不会冒泡到progress中，
        //具体表现为点击progressBtn没有任何反应
        //console.log("e click",e.offsetX)
        this._offset(e.offsetX)
        antiShake(()=>{
          this.$emit('persentChange',persent)
        },this.clickDelay)
      },
      onProgressBtnStart(e){
        this.touch.initinal = true
        this.touch.start = e.touches[0].clientX
        this.touch.progressWidth = this.$refs.progress.clientWidth
      },
      onProgressBtnMove(e){
        const progressbarWidth = this.$refs.progressBar.clientWidth  - 16
        let x = e.touches[0].clientX
        let delta = x - this.touch.start
        let progressWidth = Math.max(0 , Math.min(progressbarWidth,delta + this.touch.progressWidth))
        this._offset(progressWidth)
        //发送persentchange事件
        let persent = progressWidth / progressbarWidth
        antiShake(()=>{
          this.$emit('persentChange',persent)
        },this.clickDelay)
        
      },
      onProgressBtnEnd(e){
        this.touch.initinal = false
      },
      _offset(progressWidth){
        this.$refs.progress.style.width = `${progressWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${progressWidth}px,0,0)`
      }
    },
    watch:{
      persent(n,o){
        if(this.touch.initinal) return
        const progressbarWidth = this.$refs.progressBar.clientWidth  - 16
        let progressWidth = progressbarWidth * n
        this._offset(progressWidth)
      }
    }
    
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>