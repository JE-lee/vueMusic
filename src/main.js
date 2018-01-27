/* eslint-disable no-new */

import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import vueLazyload from 'vue-lazyload'
import 'common/stylus/index.styl'

Vue.config.productionTip = false;
Vue.use(vueLazyload,{
	loading:require('common/image/default.png'),
	attempt:1
})
fastclick.attach(document.body);

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
