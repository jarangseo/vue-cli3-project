import Vue from 'vue'
import Vuex from 'vuex'
import { commonModule } from './modules/commonModule'
import { noticeModule } from './modules/noticeModule'
import { glossaryModule } from './modules/glossaryModule'
import { projectModule } from './modules/projectModule'
import { reportModule } from './modules/reportModule'
import { menuModule } from './modules/menuModule'
import { chartModule } from './modules/chartModule'
import { dashboardModule } from './modules/dashboardModule'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    common: commonModule,
    notice: noticeModule,
    glossary: glossaryModule,
    project: projectModule,
    report: reportModule,
    menu: menuModule,
    chart: chartModule,
    dashboard: dashboardModule
  }
})
