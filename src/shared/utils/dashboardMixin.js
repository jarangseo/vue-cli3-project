import * as types from '@/shared/stores/types'
import _ from 'lodash'
import moment from 'moment'
import { util } from '@/shared/utils/util'
import { mapState, mapActions, mapMutations } from 'vuex'
export const dashboardMixin = {
  watch: {
    _currentDates (newDates, oldDates) {
      if (newDates !== oldDates && oldDates.selectedDates && !this.exceptMixinWatch) this.init()
    }
  },
  computed: {
    ...mapState({
      me: state => state.common._me,
      _isOpenMenu: state => state.menu._isOpenMenu, // <-- 이 state 값은 menu 상수 입니다.
      _menuList: state => state.menu._menuList,
      isDaily: state => state.dashboard.isDaily,
      hasRevenue: state => state.dashboard.hasRevenue,
      _currentDates: state => state.dashboard._currentDates,
      _apiReqObjIdList: state => state.dashboard._apiReqObjIdList,
      _nickNames: state => state.dashboard._nickNames,
      navMenuTransitionDuration: state => state.dashboard.navMenuTransitionDuration,
      _aboutChart: state => state.dashboard._aboutChart,
      _env: state => state.dashboard._env,
      _nowCallApiList: state => state.dashboard._nowCallApiList,
      dataBySelectedLang: state => state.common._lang.dataBySelectedLang,
      moreDetail: state => state.dashboard.moreDetail,
      _glossaryBase: state => state.dashboard.glossaryBase
    })
  },
  created () {
    window.addEventListener('resize', this.windowResize)
  },
  methods: {
    ...mapActions([
      types.GET_BASIC_INFO_DATA,
      types.GET_DOWNLOAD_REPORT,
      types.GET_DASHBOARD_GROSSARY_INFO
    ]),
    ...mapMutations([
      types.INIT_COLOR_CNT,
      types.SET_DASHBOARD_STATE
    ]),
    mixinCallBasicInfoApi (route, items) {
      if (route && items) items.forEach(item => this[types.GET_BASIC_INFO_DATA]({ route: route, type: item }))
    },
    mixinGetChartData (data) {
      return (!data || !data.actionsName) ? null : this[data.actionsName]({route: data.routeName, req: (data.req) ? data.req : null})
    },
    mixinMakeChart (data) {
      if (data.loader) this[data.loader] = false
      if (data.actionsName && data.actionsData && !_.isEmpty(data.actionsData.chartData)) {
        this[types.INIT_COLOR_CNT]()
        data.actionsData.chartData['currencyUnit'] = this.mixinGetSignTxt()
        return this[data.actionsName](data.actionsData).then(
          (result) => (data.options) ? (this[data.options] = _.merge(_.cloneDeep(this[data.options]), result)) : result
        )
      } else {
        return
      }
    },
    mixinReq (apiParam) {
      const dateFormat = this._currentDates.dateFormat.replace(/-/gi, '')
      const beforeYmd = (apiParam.range) ? moment(this._currentDates.endDate[0].replace(/-/gi, ''), dateFormat)
                                          .subtract(apiParam.range,
                                            (apiParam.objectId === this._apiReqObjIdList[7] || apiParam.objectId === '07_01')
                                              ? (this.isDaily ? 'day' : 'months')
                                              : (this.isDaily ? 'months' : 'year'))
                                          .add(1, this.isDaily ? 'day' : 'months')
                                          .format(dateFormat) : null
      let hasCurrency = false
      if (_.includes([
        this._apiReqObjIdList[1],
        this._apiReqObjIdList[2][1],
        this._apiReqObjIdList[3][1], this._apiReqObjIdList[3][2], this._apiReqObjIdList[3][3],
        this._apiReqObjIdList[3][4], this._apiReqObjIdList[3][5], this._apiReqObjIdList[3][6],
        this._apiReqObjIdList[4], this._apiReqObjIdList[5], this._apiReqObjIdList[6], this._apiReqObjIdList[7],
        this._apiReqObjIdList[10][1], this._apiReqObjIdList[10][2],
        this._apiReqObjIdList[11][1], this._apiReqObjIdList[11][2],
        this._apiReqObjIdList[12]
      ], apiParam.objectId)) {
        hasCurrency = true
      }
      let requestJson = {
        pService: this.$route.params.projectId,
        dashboardId: this.isDaily ? 1 : 2,
        pDate: this._currentDates.startDate[0].replace(/-/gi, ''),
        beforeYmd: beforeYmd,
        // baseYmd: this.isDaily ? '20190501' : '201712',
        // beforeYmd: apiParam.beforeYmd ? apiParam.beforeYmd : apiParam.range ? (this.isDaily ? '20190402' : '201612') : null,
        currencyCd: hasCurrency ? (this.me.currency ? this.me.currency : 'jpy') : null,
        objectId: apiParam.objectId,
        serviceType: ''
      }
      if (_.has(apiParam, 'filterNm1')) requestJson['filterNm1'] = apiParam.filterNm1
      if (_.has(apiParam, 'filterNm2')) requestJson['filterNm2'] = apiParam.filterNm2
      if (_.has(apiParam, 'filterVal1')) requestJson['filterVal1'] = apiParam.filterVal1
      if (_.has(apiParam, 'filterVal2')) requestJson['filterVal2'] = apiParam.filterVal2
      return requestJson
    },
    mixinNumberWithCommas (num) {
      if (_.toString(num).split('.')[0] !== '0') {
        const tmpNum = this.mixinGetAbsNumber(num)
        // return (tmpNum >= 1.0e+6) ? _.round(tmpNum / 1.0e+6, 2)
        //         : (tmpNum >= 1.0e+3) ? _.round(tmpNum / 1.0e+3, 1) : this.mixinNumberWithCommasToString(Number(num))
        return (tmpNum >= 1.0e+6) ? _.round(tmpNum / 1.0e+6, 2) : this.mixinNumberWithCommasToString(Number(num))
      } else {
        return num
      }
    },
    mixinNumberWithCommasToString (x) {
      if (_.toString(x).split('.')[0] !== '0') {
        return (x) ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : x
      } else {
        return x
      }
    },
    mixinGetUnitTxt (num) {
      const tmpNum = this.mixinGetAbsNumber(num)
      // return (tmpNum >= 1.0e+6) ? 'M' : (tmpNum > 1.0e+3) ? 'K' : ''
      return (tmpNum >= 1.0e+6) ? 'M' : ''
    },
    mixinGetAbsNumber (num) {
      const _num = Number(num)
      return Math.abs(_.isNaN(_num) ? 0 : _num)
    },
    mixinGetSignTxt () {
      return (this.me.currency === 'usd') ? '$' : (this.me.currency === 'jpy') ? '¥' : '₩'
    },
    mixinChangeDateForm (date, inputForm, outputForm) {
      return moment(date, (inputForm || 'YYYYMMDD')).format(outputForm || 'MM/DD')
    },
    mixinChangeDateFormYesterday (date, inputForm, outputForm) {
      return moment(date, (inputForm || 'YYYYMMDD')).subtract(1, 'd').format(outputForm || 'MM/DD')
    },
    mixinCheckNavMenuTransitionDuration () {
      if (document.getElementsByClassName('include_nav')) {
        const navMenuObject = document.getElementsByClassName('include_nav')
        if (navMenuObject.length > 0 && window.getComputedStyle(navMenuObject[0], null).hasOwnProperty('transition-duration')) {
          const navMenuTransitionDurationValue = window.getComputedStyle(navMenuObject[0], null).getPropertyValue('transition-duration')
          this[types.SET_DASHBOARD_STATE]({
            stateName: 'navMenuTransitionDuration',
            stateValue: Number(navMenuTransitionDurationValue.replace('s', '')) * 1000
          })
        }
      }
    },
    async mixinResize (area) {
      setTimeout(async () => {
        this[area.name].isLoading = await true
        // this[area.name].width = await `${document.getElementsByClassName(area.className)[0].offsetWidth}px`
        this[area.name].isLoading = await false
      }, this.navMenuTransitionDuration)
    },
    async mixinWindowResize (area) {
      setTimeout(async () => {
        this[area.name].isLoading = await true
        // this[area.name].width = await `${document.getElementsByClassName(area.className)[0].offsetWidth}px`
        this[area.name].isLoading = await false
      }, this.navMenuTransitionDuration)
    },
    async mixinToggleAboutThisChart (data) {
      await this[types.SET_DASHBOARD_STATE]({
        stateName: '_aboutChart',
        stateValue: {
          isOpen: !data.data || data.data !== this._aboutChart.data ? true : !_.cloneDeep(this._aboutChart.isOpen),
          type: !_.isEmpty(data.type) ? data.type : '',
          data: !_.isEmpty(data.data) ? data.data : { dimension: {}, kpi: [] }
        }
      })
    },
    mixinDownloadReport () {
      // queryString form -> baseYmd&beforeYmd&currencyCd&dashboardId&merged&objectId&prjId&serviceType&objectName
      const queryString = this._env[this.isDaily ? 'daily' : 'monthly'][this.hasRevenue ? 'userAndRevenue' : 'user'].downloadReport.trim()
                          .replace(/_startDate_/gi, moment(this._currentDates.endDate, this.isDaily ? 'YYYY-MM-DD' : 'YYYY-MM')
                                                    .format(this.isDaily ? 'YYYYMMDD' : 'YYYYMM'))
                          .replace(/_endDate_/gi, moment(this._currentDates.endDate, this.isDaily ? 'YYYY-MM-DD' : 'YYYY-MM')
                                                    .subtract(this.isDaily ? 30 : 12, this.isDaily ? 'days' : 'months')
                                                    .format(this.isDaily ? 'YYYYMMDD' : 'YYYYMM'))
                          .replace(/_currency_/gi, this.me.currency ? this.me.currency : 'krw')
                          .replace(/_dashboardId_/gi, this.isDaily ? '1' : '2')
                          .replace(/_projectId_/gi, this.$route.params.projectId)
      this[types.GET_DOWNLOAD_REPORT]({queryString: encodeURIComponent(queryString)})
    },
    mixinMoreDetails (areaName) {
      const {depth, idx, menuId, parentMenuId} = util.findMenuWithReportId(this._menuList, Number(this.moreDetail[areaName]))
      // const {depth, idx, menuId, parentMenuId} = util.findMenuWithReportId(this._menuList, this.isDaily ? 737 : 738)
      if (location.host === 'analytics.growthy.game.line-alpha.me' || location.host === 'analytics.growthy.game.line-alpha.me:8889') console.log(`[이 메시지는 알파에서만 보임] more detail call > reportId: ${this.moreDetail[areaName]} and depth: ${depth}, idx: ${idx}, menuId: ${menuId}, parentMenuId: ${parentMenuId}`)
      // console.log(`more detail call > reportId: ${this.moreDetail[areaName]} and depth: ${depth}, idx: ${idx}, menuId: ${menuId}, parentMenuId: ${parentMenuId}`)
      const projectId = this.$route.params.projectId
      if (depth === 2) {
        this.$router.replace({name: 'basic', params: {projectId}, query: { parentMenuId, menuId, threeDepth: '0', from: 'relatedReport' }})
      } else if (depth === 3) {
        this.$router.replace({name: 'basic', params: {projectId}, query: { parentMenuId, menuId, threeDepth: idx + '', from: 'relatedReport' }})
      }
    },
    mixinLegendItemClick (info) {
      const that = info.that
      return {
        events: {
          legendItemClick: function (e) {
            if (this.visible && that[info.name].chartLength === 1) {
              util.toastr().error(that.dataBySelectedLang.analytics_error_msg_notselectkpi)
              return false
            }
            this.visible ? that[info.name].chartLength -- : that[info.name].chartLength ++
          }
        }
      }
    },
    mixinGetGlossary (info) {
      return this[types.GET_DASHBOARD_GROSSARY_INFO]({ids: this.mixinMakeGlossaryIdsRequestParameter(info.ids)})
    },
    mixinMakeGlossaryIdsRequestParameter (payload) {
      return _.isArray(payload) ? payload.map(item => `ids=${item}`).join('&') : `ids=${payload}`
    },
    mixinGetTooltip (info) {
      if (!_.isEmpty(this._glossaryBase[info.areaName])) {
        this[info.areaName].tooltip.chartName = this._glossaryBase[info.areaName].chartName
        if (this._glossaryBase[info.areaName].kpi.ids.length > 0) {
          this.mixinGetGlossary({ids: this._glossaryBase[info.areaName].kpi.ids}).then(res => {
            this[info.areaName].tooltip.kpi = res
          })
        }
        if (this._glossaryBase[info.areaName].dimension.ids.length > 0) {
          this.mixinGetGlossary({ids: this._glossaryBase[info.areaName].dimension.ids}).then(res => {
            this[info.areaName].tooltip.dimension = res
          })
        }
      }
    }
  }
}
