// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import Icon from 'vue-awesome/components/Icon'
import { store } from '@/shared/stores/store'
import { http } from '@/shared/utils/httpaxios'
import { routes } from './routes'
import { util } from '@/shared/utils/util'
import i18next from 'i18next'
import VueI18Next from '@panter/vue-i18next'
import VueMasonry from 'vue-masonry-css'
import VueHighCharts from 'vue-highcharts'
import HighchartsVue from 'highcharts-vue'
import VTooltip from 'v-tooltip'
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'

Vue.prototype.$http = http

Vue.use(VueRouter)
Vue.use(VueMasonry)
Vue.use(VueI18Next)
Vue.use(VueHighCharts)
Vue.use(HighchartsVue)
Vue.use(VTooltip)
Vue.use(PerfectScrollbar)

const router = new VueRouter({
  routes,
  mode: 'history'
})

i18next.init({
  lng: util.getI18nextLanguage(),
  resources: {
    en: {
      translation: {}
    },
    kr: {
      translation: {}
    },
    jp: {
      translation: {}
    }
  }
})

const i18n = new VueI18Next(i18next)

Vue.component('icon', Icon)

router.beforeEach((to, from, next) => {
  // if (util.sessionChecker())
  // else {
  //   util.toastr().warning('Your session has been expired.')
  //   next(false)
  // }
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  i18n,
  render: h => h(App)
})
