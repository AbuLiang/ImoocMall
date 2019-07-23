import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex) // 单页面需要vue.use使用插件， 多页面通过script标签引入则不需要Vue.use

export default new Vuex.Store({
  state: {
    cartCount: 0,
    string: '测试'
  },
  mutations: { // 只能同步
    updateCartCount (state, cartCount) {
      state.cartCount += cartCount
    },
    initCartCount (state, cartCount) {
      state.cartCount = cartCount
    }
  },
  getters: { // 类似计算属性，add是计算值不是方法、是对state中的值 处理并重命名
    add (state) {
      return state.string + 'getters'
    }
  },
  actions: { // 对mutations封装，可以异步
    initCartCount (context, cartCount) {
      context.commit('initCartCount', cartCount)
    }
  }
})
