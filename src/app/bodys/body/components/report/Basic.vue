<template>
<div class="content" :style="{marginLeft: $route.query.fullPage === 'pivot' ? '0px' : _isOpenMenu ? '60px' : '260px'}">
  <div class="inner_content" :ref="'inner_content'" v-if="$route.query.fullPage !== 'pivot'" @scroll="handleScroll($event)">
    <report-header
      :oneDepthName="oneDepthName"
      :twoDepthName="twoDepthName"
     ></report-header>
    <!-- [D] data_handler_section 상단 고정 시, fixed 클래스 추가 필요 -->
    <div class="data_handler_section" v-if="!isNoData && !isLoading">
        <!-- [D] 상태에 따른 추가 클래스 적용 필요 -->
        <data-handler
          :projectId="'QA_Miran_001'"
          :setReportType="setReportType"
          :alreadySetDataType="reportType"
          :updateObjects="updateObjects"
          :isAnnounceShow="_isNoticeShow"
          :scrollTop="scrollTop"
          :alreadySetFilterList="alreadySetFilterList"
        ></data-handler>
    </div>
    <div class="content_section" :style="{marginTop: isShowToTop ? '80px' : '0px'}">
        <div class="inner_content_section" :class="{'error': isNotDeployed}">
            <!-- indicator -->
            <div class="indicator_area" v-if="isLoading && !isNoData && !isNotDeployed">
              <div class="indicator big">
                <div class="preloader-wrapper active">
                  <div class="spinner-layer">
                    <div class="circle-clipper left">
                      <div class="circle"></div>
                    </div><div class="gap-patch">
                    <div class="circle"></div>
                  </div><div class="circle-clipper right">
                    <div class="circle"></div>
                  </div>
                  </div>
                </div>
              </div>
              <div class="indicator_message">
                  <span>Loading..</span>
              </div>
            </div>
            <!-- //indicator -->
            <!-- not found message -->
            <div class="error_message_section" v-if="isNotDeployed">
                  <!-- error message -->
                  <!-- [D] inner_error_message에 위치값 수정을 위한 클래스 적용 필요 -->
                  <!--
                      No Project => no_project
                      No Permission => no_permisson
                      No Page => no_page
                      No_Service_category => no_s_category
                      Not deployed Log => not_d_log
                  -->
                  <div class="inner_error_message not_d_log">
                      <span class="message">Deploy Log</span>
                      <p>{{dataBySelectedLang.analytics_error_msg_deploylog}}</p>
                      <div class="message_box">
                          <p>{{dataBySelectedLang.analytics_error_msg_deployloglist}}</p>
                          <span v-for="(item, key) in notDeployMsgArr" :key="key">
                            {{item}} <br />
                          </span>
                      </div>
                      <span class="more_info">{{dataBySelectedLang.analtyics_error_msg_nocategoryauth}}</span>
                      <a @click="goToMap()" class="btn_go_map"><span>Go to GROWTHY Map</span></a>
                  </div>
              </div>
              <div class="not_fonud_section" v-if="isNoData && !isLoading && !isNotDeployed">
                  <div class="inner_not_fonud_section">
                      <span class="message">Data not found</span>
                      <p>{{dataBySelectedLang.analytics_object_msg_nodata}}</p>
                      <a @click="initData()" class="btn_page_refresh"><span>REFRESH</span></a>
                  </div>
              </div>
              <!-- //not found message -->
              <div class="chart_grid_section" v-if="!isNoData && !isLoading && !isNotDeployed">
                  <div class="inner_chart_grid" v-if="objectList.length > 0">
                      <!-- [D] 100% chart 일 경우, chart_area에 추가 클래스 없음. -->
                      <!-- [D] 50% chart 일 경우, chart_area에 half 클래스 추가 필요 -->
                      <!-- [D] 차트 노출시 display:block 로 변경 필요 -->
                      <component
                        v-for="(obj, idx) in objectList"
                        :is="obj.component"
                        :key="idx"
                        :objectInfo="obj.value"
                        :byDimension="byDimension"
                        :setPivotSettingInfo="setPivotSettingInfo"
                        :pivotIdx="obj.idx > -1 ? obj.idx: -1"
                        :style="idx > 0 && !isFullScreenOpened ? {marginTop: '15px'} : {marginTop: '0px'}"
                        :class="'child-objects'"
                        :filterList="filterList"
                        :alreadySetFilters="obj.filter"
                        :settings="obj.settings"
                        :scrollTop="scrollTop"
                        :objType="obj.type"
                        :gridName="obj.gridName"
                        :saveLastReportSetting="saveLastReportSetting"
                        :currentDates="currentDates"
                        :basicBackupCommonCondition="backupCommonCondition"
                      ></component>
                  </div>
              </div>
        </div>
    </div>
    <!-- footer -->
    <footer-panel></footer-panel>
    <!-- //footer -->
  </div>
  <right-pivot-panel
    v-if="!isNoData && !isLoading"
    :pivotSettingData="pivotSettingData"
    :setPivotFilterList="setPivotFilterList"
    :saveLastReportSetting="saveLastReportSetting"
  ></right-pivot-panel>
  <!-- go_top_btn -->
  <a v-if="isShowToTop" class="btn_go_top" @click="goToTop"><span class="blind">Go page top</span></a>
</div>
</template>
<script>
import * as types from '@/shared/stores/types'
import { util } from '@/shared/utils/util'
import { mapState } from 'vuex'
import _ from 'lodash'
import moment from 'moment'
import PivotPannel from './components/objects/PivotPannel'
import ChartPannel from './components/objects/ChartPannel'
import ReportHeader from './components/ReportHeader'
import KpiHalfChartPannel from './components/objects/KpiHalfChartPannel'
import IndependentHalfChartPannel from './components/objects/IndependentHalfChartPannel'
import TablePannel from './components/objects/TablePannel'
import DataHandler from './components/DataHandler'
import FooterPanel from '../../layout/FooterPanel'
import RightPivotPanel from './components/RightPivotPanel'
import { POINT_CONVERSION_COMPRESSED, POINT_CONVERSION_UNCOMPRESSED } from 'constants';

export default {
  name: 'Basic',
  components: {
    FooterPanel,
    ReportHeader,
    DataHandler,
    ChartPannel,
    PivotPannel,
    KpiHalfChartPannel,
    IndependentHalfChartPannel,
    TablePannel,
    RightPivotPanel
  },
  watch: {
    '$route.query.threeDepth' (d) {
      let twoDepthType = this._twoDepthMenuInfo.type
      let no = d ? d : 0
      let threeDepthId = twoDepthType === 'TA01' ? this._twoDepthMenuInfo.menuThreeDepthList[no].id : this._twoDepthMenuInfo.id
      let depth = this._twoDepthMenuInfo.type === 'TA01' ? 3 : 2
      this.isNoData = false
      this.isLoading = true
      this.isNotDeployed = false
      if (d !== undefined) {
        if (threeDepthId) {
          this.getInitReportInfo(threeDepthId, depth)
        } else {
          this.getTwoDepthInfo()
        }
      }
    },
    '$route.query.menuId' (twoDepthId) {
      let query = _.cloneDeep(this.$route.query)
      this.initThreeDepthInfo()
      if (this.$route.query.from !== 'relatedReport') {
        query.threeDepth = 0
      }
      this.$router.push({ name: 'basic', query })
    },
    '$route.params.projectId' (projectId) {
      this.initThreeDepthInfo()
      if (projectId) {
        this.$router.replace({ name: `basic`, params: {projectId}, query: {}}).catch(err => {})
      }
    },
    _menuList (d) {
      this.checkValidMenuIds(d)
      let oneDepthMenuId = this.$route.query.parentMenuId * 1
      let threeDepthId = this.$route.query.threeDepth
      let query = this.$route.query
      let oneDepthMenuObj = d.filter(o => {
        return o.id === oneDepthMenuId
      })[0]
      if (!threeDepthId) {
        // query.threeDepth = '0' //[OGPQA-1870]
        this.goToReport(query)
      }
      if (oneDepthMenuObj) {
        this.oneDepthName = oneDepthMenuObj.name
      }
    },
    _twoDepthMenuInfo (d) {
      this.twoDepthName = d.name
      let twoDepthType = d.type
      let beforeThreeDepth = this.$route.query.threeDepth
      let threeDepthIdx
      let threeDepthId
      let depth

      threeDepthIdx = this.$route.query.threeDepth ? this.$route.query.threeDepth * 1 : 0
      if (twoDepthType !== 'TA02' && beforeThreeDepth) {
        if (d.menuThreeDepthList[beforeThreeDepth]) {
          threeDepthId = d.menuThreeDepthList[beforeThreeDepth].id
        } else {
          this.$router.push({ name: 'PageNotFound' })
        }
      } else {
        threeDepthId = (twoDepthType === 'TA01' ? d.menuThreeDepthList[threeDepthIdx].id : d.id)
      }
      depth = d.type === 'TA01' ? 3 : 2
      this.setStartLoading()
      this.getInitReportInfo(threeDepthId, depth)
      this.oneDepthName = this.$store.state.menu._oneDepthMenuName
    },
    _initReportData (d) {
      this.initReportData() //탭 혹은 메뉴 이동시 추가할 내용이 있다면 이 method에!
      this.backupCommonCondition = {}
      this.objectList = []
      let lastDateCode = d.dataHandlerType.defaultDate.to || d.dataHandlerType.defaultDate.date || d.dataHandlerType.defaultDate.month
      this.currentObjectList = d.groupedByOverallObjectList
      this.currentDates = util.getInitialDateInfo(d.dataHandlerType.dateType, lastDateCode, d.dataHandlerType.defaultDate.from )
      this.makeObjectListByGroupedObject(d.groupedByOverallObjectList)
      this.$nextTick(() => {
        this.getLastFilterList()
      })
    },
    reportType (d) {
      switch (d) {
        case 'overall':
          this.currentObjectList = this._initReportData.groupedByOverallObjectList
          break
        case 'dimension':
          this.currentObjectList = this._initReportData.groupedByDemensionObjectList
          break
      }
      this.makeObjectListByGroupedObject(this.currentObjectList)
      // this.makeObjectList(this.currentObjectList)
    },
    _isOpenMenu (isOpen) {
      // [OGPQA-1237] NavMenu 변경에 따른 update 방지 위해 주석 처리
      // this.updateObjects()
      const highchartsContainers = document.querySelectorAll('.highcharts-container ')
      _.forEach(highchartsContainers, (o) => {
        o.style.margin = 'auto'
      })
    },
    scrollTop (top) {
      if (this._isNoticeShow && top > 178) {
        this.$store.commit(types.SET_SHOW_TOP, true)
      } else if (!this._isNoticeShow && top > 172) {
        this.$store.commit(types.SET_SHOW_TOP, true)
      } else {
        this.$store.commit(types.SET_SHOW_TOP, false)
      }
    }
  },
  data () {
    return {
      oneDepthName: '',
      twoDepthName: '',
      objectList: [],
      isNoData: false,
      isLoading: true,
      isNotDeployed: false,
      reportType: 'overall',
      currentObjectList: {},
      byDimension: '',
      notDeployMsgArr: '',
      pivotSettingData: {},
      scrollTop: 0,
      alreadySetFilterList: [],
      backupCommonCondition: {},
      filterList: [],
      currentDates: []
    }
  },
  computed: {
    ...mapState({
      _me: state => state.common._me,
      _menuList: state => state.menu._menuList,
      _initReportInfo: state => state.report._initReportInfo,
      _activeSecondMenu: state => state.menu._activeSecondMenu,
      _twoDepthMenuInfo: state => state.menu._twoDepthMenuInfo,
      _normalProjectList: state => state.project._normalProjectList,
      categoryMenuId: state => state.menu.menuId,
      _initReportData: state => state.report._initReportData,
      _isOpenMenu: state => state.menu._isOpenMenu,
      dataBySelectedLang: state => state.common._lang.dataBySelectedLang,
      isShowToTop: state => state.common.isShowToTop,
      isFullScreenOpened: state => state.common.isFullScreenOpened,
      _projectInfo: state => state.project._projectInfo,
      _isNoticeShow: state => state.notice._isNoticeShow
    }),
    currentProjectId () {
      return window.localStorage.setProjectId
    },
    moment () {
      return moment
    }
  },
  methods: {
    setPivotFilterList (filterList) {
      let filters = _.map(filterList, o => {
        return o.name
      })
      this.filterList = filters
    },
    initReportData () {
      this.$store.commit(types.INIT_PIVOT_LIST)
      this.filterList = []
      this.$store.commit(types.CHANGE_DIMENSION, 'overall')
    },
    handleScroll ($event) {
      this.resetPopupComponents()
      this.scrollTop = $event.target.scrollTop
    },
    resetPopupComponents () {
      _.forEach(this.$children, child => {
        if (child.resetPopupComponent) {
          child.resetPopupComponent()
        }
      })
    },
    goToMap () {
      let phase = ((path) => {
        let p
        if (path.indexOf('analytics-beta') > -1) {
          p = 'beta'
        } else if (path.indexOf('line-alpha') > -1) {
          p = 'alpha'
        } else {
          p = 'release'
        }
        return p
      })(window.location.href)
      let projectId = ''
      let alreadyProjectId = this.$route.params.projectId
      let dataDesignId = 0
      let type = 'event'
      let sample = 'false'
      let mapPath = ''
      switch (phase) {
        case 'beta':
          mapPath = 'http://map-beta.growthy.game.line-alpha.me/datadesignlist/cards/' + alreadyProjectId
          mapPath += '?isSample=' + sample
          break
        case 'alpha':
          mapPath = 'http://map.growthy.game.line-alpha.me/datadesignlist/cards/' + alreadyProjectId
          mapPath += '?isSample=' + sample
          break
        case 'release':
          mapPath = 'https://map.growthy.game.line.me/datadesignlist/cards/' + alreadyProjectId
          mapPath += '?isSample=' + sample
          break
      }
      window.open(mapPath, '_blank')
    },
    getInitReportInfo (threeDepthId, depth) {
      let alreadyProjectId = this.$route.params.projectId
      this.$store.commit(types.RIGHT_PANNEL_DEPTH, { menuId: threeDepthId, depth })
      this.$store.dispatch(types.INIT_REPORT_INFO, {
        menuId: threeDepthId,
        depth,
        projectId: alreadyProjectId,
        reportId: undefined,
        thisComponent: this
      })
    },
    permissionError () {
      this.$router.push({ name: 'NoPermission' })
    },
    notDeployedError (msg) {
      let logsTxt = msg.split('(')[1]
      let logsArr = []
      logsTxt = logsTxt.split(')')[0]
      logsArr = logsTxt.split(':')

      this.notDeployMsgArr = logsArr
      this.isNotDeployed = true
    },
    getLastFilterList () {
      let savedReportList = JSON.parse(window.localStorage.getItem('lastReportSetting') || '[]')
      let savedCurrentReport = savedReportList.filter(report => {
        return report.reportId === this._initReportData.reportId
      })[0] || {}
      let filters = {}
      let pivotSettingsFilter = []
      _.map(this.objectList, object => {
        let objectFilterList = []
        if (object.type === 'OB05') {
          pivotSettingsFilter = savedCurrentReport[object.type] ? (savedCurrentReport[object.type].pivotFilters || []) : []
        }

        if (savedCurrentReport[object.type] && !_.isEmpty(savedCurrentReport[object.type].filter) && object.type !== 'OB05') {
            objectFilterList = Object.keys(savedCurrentReport[object.type].filter)
        }

        _.map(objectFilterList, f => {
          if (!_.findKey(filters, f)) {
            filters[f] = savedCurrentReport[object.type].filter[f]
          }
        })
      })
      if (pivotSettingsFilter.length === 0 && savedCurrentReport['OB05']) {
        _.map(savedCurrentReport['OB05'].filter, (f, k) => {
          if (!filters[k]) {
            filters[k] = f
          }
        })
      }
      if (!_.isEmpty(filters)) {
        this.alreadySetFilterList = []
        _.map(filters, (val, key) => {
          this.alreadySetFilterList.push({
            name: key,
            filterValues: val
          })
        })
      }
    },
    getCurrentShowingObj () {
      let objects = []
      _.map(this.$children, (child, idx) => {
        _.map(child.$el.classList, (className, i) => {
          if (className === 'child-objects') {
            objects.push(child)
          }
        })
      })
      return objects
    },
    updateObjects (commonCondition) {
      let objects = this.getCurrentShowingObj()
      let filterList = []
      this.isNotDeployed = false
      this.filterList = []
      if (commonCondition && commonCondition.filter && !_.isEmpty(commonCondition.filter)) {
        _.map(commonCondition.filter, (f, k) => {
          filterList.push({name: k})
        })
        this.setPivotFilterList(filterList)
      }
      _.map(objects, obj => {
        this.saveLastReportSetting({
          filter: commonCondition ? commonCondition.filter : {},
          settings: {}
        }, obj.objType)
      })
      this.backupCommonCondition = commonCondition || {}
      _.forEach(objects, u => {
        u.updateObject(commonCondition)
      })
    },
    saveLastReportSetting (data, type) {
      // reportSettingInfo : []
      // item: { reportId: id, settingData: [ /chart/data, /pivot/data ] }
      let isSetSaveLastState = this._me.reportSet || false
      let lastReportSetting = window.localStorage.getItem('lastReportSetting') || '[]'
      if (isSetSaveLastState) {
        lastReportSetting = this.makeLocalStorageReport(data, type, JSON.parse(lastReportSetting), this._initReportData.modifyDate)
        window.localStorage.setItem('lastReportSetting', JSON.stringify(lastReportSetting))
      }
    },
    makeLocalStorageReport (data, type, lastReportSetting, modifyDate) {
      let reportList = lastReportSetting
      let report = {}
      let objects = this.objectList
      let isAlreadyInLocalStorage = false
      _.map(reportList, (alreadyReport, idx) => {
        if (alreadyReport.reportId === this._initReportData.reportId) {
          report = reportList[idx]
          isAlreadyInLocalStorage = true
        }
      })
      if (_.isEmpty(report)) {
        report.reportId = this._initReportData.reportId
      }
      _.map(objects, o => {
        if (!report[o.type]) {
          report[o.type] = {}
        }
      })
      report[type] = data
      report.modifyDate = modifyDate
      if (!isAlreadyInLocalStorage) {
        reportList.push(report)
      }
      return reportList
    },
    setPivotSettingInfo (pivotData) {
      this.pivotSettingData = { ...pivotData }
    },
    makeObjectListByGroupedObject (data) {
      let groupedObjectList = data
      let pivotIdx = 0
      let alreadySetReports = util.getLastSavedReportInfo()
      let alreadySetObjects = alreadySetReports.filter (report => {
        return report.reportId === this._initReportData.reportId
      })[0] || {}
      let isNewDeploy = moment(alreadySetObjects.modifyDate).isBefore(moment(this._initReportData.modifyDate))
      let objectList = []
      if (!_.isEmpty(alreadySetObjects) && isNewDeploy) {
        alreadySetObjects = {}
        alreadySetReports.splice(_.findIndex(alreadySetReports, {'reportId': this._initReportData.reportId}), 1)
        window.localStorage.setItem('lastReportSetting', JSON.stringify(alreadySetReports))
      }
      _.map(groupedObjectList, o => {
        switch (o.type) {
          case 'OB01':
            let ob01Values = o.objectLayoutList[0].chartInfo
            ob01Values.reportId = this._initReportData.reportId
            objectList.push({
              component: ChartPannel,
              value: ob01Values,
              type: o.type,
              idx: pivotIdx,
              filter: alreadySetObjects['OB01'] ? alreadySetObjects['OB01'].filter : {},
              settings: alreadySetObjects['OB01'] ? alreadySetObjects['OB01'].settings : {}
            })
            pivotIdx += 1
            break
          case 'OB02':
            let values = [o.objectLayoutList[0].chartInfo, o.objectLayoutList[1].chartInfo]
            values[0].reportId = this._initReportData.reportId
            values[1].reportId = this._initReportData.reportId
            objectList.push({
              component: IndependentHalfChartPannel,
              value: {values},
              type: o.type,
              idx: pivotIdx,
              filter: alreadySetObjects['OB01'] ? alreadySetObjects['OB01'].filter : {},
              settings: alreadySetObjects['OB01'] ? alreadySetObjects['OB01'].settings : {}
            })
            pivotIdx += 1
            break
          case 'OB03':
            let ob03Values = o.objectLayoutList[0].chartInfo
            ob03Values.reportId = this._initReportData.reportId
            objectList.push({
              component: KpiHalfChartPannel,
              value: ob03Values,
              type: o.type,
              idx: pivotIdx,
              filter: alreadySetObjects['OB01'] ? alreadySetObjects['OB01'].filter : {},
              settings: alreadySetObjects['OB01'] ? alreadySetObjects['OB01'].settings : {}
            })
            pivotIdx += 1
            break
          case 'OB04':
            let ob04Values = o.objectLayoutList[0].tableInfo
            ob04Values.reportId = this._initReportData.reportId
            objectList.push({
              component: TablePannel,
              value: ob04Values,
              type: o.type,
              idx: pivotIdx,
              gridName: o.objectLayoutList[0].gridName,
              filter: alreadySetObjects['OB01'] ? alreadySetObjects['OB01'].filter : {},
              settings: alreadySetObjects['OB01'] ? alreadySetObjects['OB01'].settings : {}
            })
            pivotIdx += 1
            break
          case 'OB05':
            let filterList = []
            o.objectLayoutList[0].pivotInfo.reportId = this._initReportData.reportId
            objectList.push({
              component: PivotPannel,
              value: o.objectLayoutList[0].pivotInfo,
              idx: pivotIdx,
              type: o.type,
              gridName: o.objectLayoutList[0].gridName,
              filter: alreadySetObjects['OB05'] ? alreadySetObjects['OB05'].filter : {},
              settings: alreadySetObjects['OB05'] ? alreadySetObjects['OB05'].settings : {}
            })
            if (this.backupCommonCondition && !_.isEmpty(this.backupCommonCondition)) {
              _.map(this.backupCommonCondition.filter, (f, k) => {
                filterList.push({name: k})
              })
              this.setPivotFilterList(filterList)
            }
            if (alreadySetObjects['OB05'] && !_.isEmpty(alreadySetObjects['OB05'].filter)) {
              _.map(alreadySetObjects['OB05'].filter, (f, k) => {
                filterList.push({name: k})
              })
              this.setPivotFilterList(filterList)
            }
            pivotIdx += 1
            break
        }
      })
      this.$nextTick(() => {
        this.objectList = objectList
      })
    },
    setReportType (type, byDimension) {
      this.objectList = []
      this.filterList = []
      this.reportType = type
      if (byDimension) {
        this.byDimension = byDimension
        this.$store.commit(types.CHANGE_DIMENSION, byDimension)
        this.makeObjectListByGroupedObject(this._initReportData.groupedByDemensionObjectList)
      } else {
        this.byDimension = ''
        this.$store.commit(types.CHANGE_DIMENSION, 'overall')
        this.makeObjectListByGroupedObject(this._initReportData.groupedByOverallObjectList)
      }
    },
    errorLoadInitData () {
      // api수정되면..
      this.isNoData = true
      this.isLoading = false
    },
    loadComplete () {
      this.isNoData = false
      this.isLoading = false
    },
    getMenu (projectId) {
      let alreadyProjectId = projectId
      this.$store.dispatch(types.GET_MENU_LIST, {
        projectId: alreadyProjectId,
        thisComponent: this
      })
    },
    goToReport(query, projectId) {
      let alreadySetProjectId = projectId || this.$route.params.projectId || window.localStorage.setProjectId || this._projectInfo.projectId
      if (query) {
        this.$router.replace({ name: `basic`, params: {projectId: alreadySetProjectId}, query}).catch(err => {})
      } else {
        this.$router.replace({ name: `basic`, params: {projectId: alreadySetProjectId}}).catch(err => {})
      }
    },
    goToDetailReport () {
      let parentMenuId = this.$route.query.parentMenuId ||  window.localStorage.oneDepthMenuId
      let menuId = this.$route.query.menuId || window.localStorage.twoDepthMenuId
      let projectId = this.$route.params.projectId || window.localStorage.setProjectId
      let threeDepth = this.$route.query.threeDepth ? this.$route.query.threeDepth : '0'
      this.goToReport({ parentMenuId, menuId, threeDepth }, projectId)
    },
    catchCategoryError () {
      if(!['/overview', '/realtime'].includes(window.location.pathname)) this.$router.replace({ name: 'NoCategory' })
    },
    getTwoDepthInfo () {
      let alreadyProjectId = this.$route.params.projectId
      let twoDepthId = this.$route.query.menuId
      return this.$store.dispatch(types.GET_TWO_DEPTH_MENU_INFO, {
        projectId: alreadyProjectId,
        twoDepthMenuId: twoDepthId
      })
    },
    getProjects () {
      this.$store.dispatch(types.GET_PROJECT_LIST)
    },
    goToTop () {
      this.$refs['inner_content'].scrollTop = 0
    },
    setStartLoading () {
      this.isNoData = false
      this.isLoading = true
    },
    initMenuInfo (projectId) {
      this.$store.commit(types.INIT_PIVOT_LIST)
      this.getMenu(projectId)
    },
    initThreeDepthInfo () {
      let alreadyProjectId = this.$route.params.projectId
      this.setStartLoading()
      this.isNotDeployed = false
      this.$store.commit(types.INIT_PIVOT_LIST)
      if (this._normalProjectList.length === 0 && !alreadyProjectId) {
        this.getProjects()
      } else {
        this.getTwoDepthInfo().then(res => {
          if (res.data.type === 'TA03') {
            this.$router.push({name: 'Dashboard'})
          } else {
            this.$store.commit(types.GET_TWO_DEPTH_MENU_INFO, res.data)
          }
        }).catch(err => {
          if (err.response) {
            if (err.response.data.code === 500921) {
              this.permissionError()
            }
          } else {
            util.toastr().error(err.message)
          }
        })
      }
    },
    checkValidMenuIds (menuList) {
      if (menuList.length > 0) {
        const oneDepthIndex = _.findIndex(menuList, (o) => o.id === this.$route.query.parentMenuId * 1)
        const twoDepthIndex = _.findIndex(menuList[oneDepthIndex].menuTwoDepthList, (o) => o.id === this.$route.query.menuId * 1 && o.type !== 'TA04')
        if(oneDepthIndex < 0 || twoDepthIndex <0){
          this.$router.push({ name: 'PageNotFound' })
        }
      }
    }
  },
  mounted () {
    this.goToDetailReport()
    // banner showing check
    this.initThreeDepthInfo()
  }
}
</script>
