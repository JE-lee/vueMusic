<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'
  //better-scroll 只对{'wrapper'}中的第一个子元素滚动，后面的元素不滚动
  export default {
    data(){
      return {
        dots:[],
        currentPageIndex:0
      }
    },
    props:{
      loop:{
        type:Boolean,
        default:true
      },
      autoPlay:{
        type:Boolean,
        default:true
      },
      interval:{
        type:Number,
        default:2000
      }
    },
    mounted(){
      //初始化better-scroll
      setTimeout(()=>{
        this._setSliderWidth();
        this._initDots();
        this._initSlider();
        if(this.autoPlay){
          this._play();
        }
      },20);
      
      window.addEventListener('resize',(e)=>{
        if(!this.slider) return ;
        this._setSliderWidth(true);
        this.slider.refresh();
      })
    },
    methods:{
      _setSliderWidth(isResize){
          this.children = this.$refs.sliderGroup.children;
          let slider = this.$refs.slider;
          let sliderWidth = slider.clientWidth;
          let sliderGroupWidth = 0;
          for(let i =0;i<this.children.length;i++){
            var item = this.children[i];
            addClass(item,'slider-item');
            item.style.width = sliderWidth + 'px';
            sliderGroupWidth += sliderWidth;
          }
          //isResize == true的时候，this.children的长度已经加了2了，也就是说上面slider-group的子元素的个数
          //在第一次初始化slider之后+2le，所以这里就不加2倍了。
          if(this.loop && !isResize){
            sliderGroupWidth += sliderWidth*2;
          }
          
          this.$refs.sliderGroup.style.width = sliderGroupWidth + 'px';
      },
      _initSlider(){
          this.slider = new BScroll(this.$refs.slider,{
            scrollX:true,
            scrollY:false,
            momentum:false,
            snap:{
              loop:this.loop,
              threshold:0.3,
             // speed:400
            },
            click:true
          })
          this.slider.on('scrollEnd',({x,y})=>{
            let current = this.slider.getCurrentPage().pageX
            this.currentPageIndex = current;
            if(this.autoPlay){
              clearTimeout(this.timer)
              this._play();
            }
          })
      },
      _initDots(){
        //这个如果在resize之后在调用这个方法，会增加多两个点
        this.dots = new Array(this.children.length)
      },
      _play(){
          this.timer = setTimeout(()=>{
            let index = (++this.currentPageIndex)%this.dots.length;
            this.slider.goToPage(index,0,400);
          },this.interval)
      }
    },
    destroyed(){
      clearTimeout(this.timer);
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
      img.slider-item.special
        width:auto
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>