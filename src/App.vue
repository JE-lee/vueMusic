<template>
  <div id="app">
   <m-header></m-header>
   <tab></tab>
   <keep-alive>
   		<router-view></router-view>
   </keep-alive>
  </div>
</template>

<script >
	import MHeader from 'components/m-header/m-header';
	import Tab from 'components/tab/tab';
	
	export default {
	  name: 'app',
	  components:{
	  	MHeader,
	  	Tab
	  },
	  created(){
	  }
}
</script>
/* eslint-disable no-new */
<style scoped rel="stylesheet/stylus" lang="stylus">
    @import "~common/stylus/variable"
    
    
   
</style>
