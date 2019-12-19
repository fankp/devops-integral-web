import Vue from 'vue'
import App from './App.vue'
import { router } from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 全局过滤器
import * as filters from './filters'
// 导入全局样式
import '@/styles/variables.scss'
import '@/styles/common.scss'
// 阿里图标库css
import '@/assets/icon-fonts/iconfont.css'
// vuex存储数据
import store from './store'
import SearchPanel from '@/components/SearchPanel'
import Pagination from '@/components/Pagination'

Vue.use(ElementUI)
// 全局注册公共组件
Vue.use(SearchPanel)
Vue.component('search-panel', SearchPanel)
Vue.use(Pagination)
Vue.component('pagination', Pagination)

Vue.config.productionTip = false

// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 自定义指令，用于按钮鉴权，判断是否要展示按钮
Vue.directive('hasEntity', {
  inserted: function (el, binding, vnode) {
    let entityCode = binding.value
    // 判断是否有权限
    if (!Vue.prototype.$_hasEntity(entityCode, vnode.context.$route.meta.entities)) {
      // 没有权限，当前元素从页面上删除
      if (el.parentNode) {
        el.parentNode.removeChild(el)
      }
    }
  }
})

// 权限检查方法
Vue.prototype.$_hasEntity = function (val, entities) {
  if (!val) {
    return true
  }
  if (!entities) {
    return false
  }
  let entityCode = val.trim()
  for (var i=0; i<entities.length; i++) {
    if (entityCode === entities[i].entityCode) {
      return true
    }
  }
  return false
}


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
