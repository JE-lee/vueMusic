<template>
  <div id="app">
   <m-header></m-header>
   <tab></tab>
   <router-view></router-view>
  </div>
</template>

<script >
	import MHeader from 'components/m-header/m-header'
	import Tab from 'components/tab/tab'
	export default {
	  name: 'app',
	  components:{
	  	MHeader,
	  	Tab
	  }
}
</script>
/* eslint-disable no-new */
<style scoped rel="stylesheet/stylus" lang="stylus">
    @import "~common/stylus/variable"
    
    
   
</style>
