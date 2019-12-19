import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import token from './modules/token'
import privilege from './modules/privilege'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    token,
    privilege
  },
  getters
})

export default store
