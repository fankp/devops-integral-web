import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import token from './modules/token'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    token
  },
  getters
})

export default store
