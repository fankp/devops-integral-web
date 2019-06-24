import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import route from './modules/route'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    route
  },
  getters
})

export default store
