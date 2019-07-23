import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
// import Vuex from 'vuex'
// import { currency } from './util/currency'

import './assets/CSS/base.css'
import './assets/CSS/checkout.css'
import './assets/CSS/product.css'

Vue.config.productionTip = false

// Vue.filter('currency', currency) // 全局过滤器
// Vue.use(Vuex)
Vue.use(infiniteScroll)

Vue.use(VueLazyLoad, {
  loading: '/image/loading-svg/loading-bars.svg'
})
/* eslint-disable no-new */
new Vue({
  // el: '#app',
  router, // key-value相同时可以省略value  router:router
  store, // key-value相同时可以省略value   store:store
  // template: '<App/>', // template 配合 el:
  // components: { App }
  render: h => h(App) // 使用render()需要配合$mount   template底层也会调用 render()
}).$mount('#app')
