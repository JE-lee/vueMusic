<template>
	<scroll
		ref="scroll"
		class="listview"
    :listenScroll=true
    :probeType=3
    @scroll="onScroll"
		>
		<ul>
      <li v-for="group in data" class="list-group" ref="listGroup" >
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <li  v-for="(item,index) in group.items" class="list-group-item" @click="selectItem(index,item)">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>
    
    <div class="list-shortcut"
    		 @touchstart.stop.prevent="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" :data-index="index" class="item"
            :class="{'current':currentIndex===index}">
            {{item}}
        </li>
      </ul>
    </div>
    <!--顶部-->
    <div class="list-fixed" ref="fixed" v-show="showFixedTitle">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>

	</scroll>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
const SHORTCUT_HEIGHT = 18
const FIXEDTITLE_HEIGHT = 30
export default {
	props:{
		data:{
			type: Array,
			default: [],
		}
	},
	components:{
		Scroll,
    Loading
	},
	data(){
		return {
			currentIndex:-1,
      fixedTitle:'',
      showFixedTitle:false
		}
		
	},
	created(){
		this.touch={}
	},
	computed:{
		shortcutList(){
			return this.data.map((item)=>{
				return item.title.substr(0,1)
			})
		}
	},
  mounted(){
   
  },
	methods:{
    selectItem(index,item){
      this.$emit('select',item)
    },
    onScroll(position){
      let scrollY = 0 - position.y
      if(scrollY < 0){
        this.showFixedTitle =false
      }else{
        this.showFixedTitle = true
      }
      this.currentIndex = this._getIndexFromY(scrollY)
      let upperLimit = this.range[this.currentIndex + 1]
       if(scrollY >= (upperLimit - FIXEDTITLE_HEIGHT) && scrollY < upperLimit){
        this.$refs.fixed.style.transform = `translate3d(0,-${ FIXEDTITLE_HEIGHT + scrollY-upperLimit}px,0)`
      }else{
        this.$refs.fixed.style.transform = `translate3d(0,0,0)`
      }

    },
		onShortcutTouchStart(e){
			let index = e.target.getAttribute('data-index')
			//因为得到的是一个字符串
			this.touch.index = parseInt(index)
			this.touch.y = this._getPageY(e)
			this._scrollTo(this.touch.index)
		},
		onShortcutTouchMove(e){
      //有可能是点到了padding上面
			if(isNaN(this.touch.index)){
				let index = this._getTargetFromPoint(e).getAttribute('data-index')
				this.touch.index = parseInt(index)
				return
			}
     
			let y = this._getPageY(e)
			let delta = Math.floor( (y - this.touch.y) / SHORTCUT_HEIGHT)
			let index = (this.touch.index  ? this.touch.index : 0) + delta
			this._scrollTo(index)
      
		},
    _initListRange(){
      this.range = [0]
      let y = 0
      let listgroups = this.$refs.listGroup
      listgroups.forEach((ele,index)=>{
        y += ele.offsetHeight
        this.range.push(y)
      })
      if( this.currentIndex < 0) this.currentIndex = 0
    },
    _getIndexFromY(scrollY){
      let range = this.range
          length = this.range.length
      if(scrollY < 0) return 0
      if(scrollY > range[length - 1]) return (length - 2)
      for(let i = 0;i<length - 1 ; i++){
        if(scrollY >= range[i] && scrollY < range[i+1]){
          return i
        }
      }
      return 0
    },
		_scrollTo(index){
			if(index < 0 || isNaN(index)){
        return 
      }
      if(index > this.shortcutList.length - 1){
        index  = this.shortcutList.length - 1
      }
      
			//这里最好给scrollToElement一个动画时间。vue-lazyload组件能够响应
			let listGroups = this.$refs.listGroup
			this.$refs.scroll.scrollToElement(listGroups[index],1)
      this.currentIndex = index
		},
		_getPageY(e){
			return e.touches[0].pageY
		},
		_getTargetFromPoint(e){
			let x = e.touches[0].pageX
			let y = e.touches[0].pageY
			return document.elementFromPoint(x,y)
    },
    refresh(){
      this.$refs.scroll.refresh()
    }
		
	},
  watch:{
    data:function(n,o){
      setTimeout(()=>{
        this._initListRange();
      },20)
    },
    currentIndex:function(n,o){
      if(n < 0){
        this.fixedTitle = ''
        return 
      }
      this.fixedTitle = this.data[n].title
    }
  },

}
</script>
<style type="text/stylus" rel='stylesheet/sytlus' lang='stylus' scoped>
@import "~common/stylus/variable"
.listview
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  background: $color-background
  .list-group
    padding-bottom: 30px
    .list-group-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
    .list-group-item
      display: flex
      align-items: center
      padding: 20px 0 0 30px
      .avatar
        width: 50px
        height: 50px
        border-radius: 50%
      .name
        margin-left: 20px
        color: $color-text-l
        font-size: $font-size-medium
  .list-shortcut
    position: absolute
    z-index: 30
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d
    font-family: Helvetica
    .item
      padding: 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .list-fixed
    position: absolute
    top: 0
    left: 0
    width: 100%
    .fixed-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>