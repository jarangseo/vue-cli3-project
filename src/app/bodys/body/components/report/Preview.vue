<template>
<div class="content" style="margin-left:0px">
  <div class="inner_content" :ref="'inner_content'" v-if="$route.query.fullPage !== 'pivot'" @scroll="handleScroll($event)">
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
                  <div class="inner_chart_grid">
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
                        :currentDates="currentDates"
                      ></component>
                  </div>
              </div>
        </div>
    </div>
  </div>
  <right-pivot-panel
    v-if="!isNoData && !isLoading"
    :pivotSettingData="pivotSettingData"
    :setPivotFilterList="setPivotFilterList"
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
import KpiHalfChartPannel from './components/objects/KpiHalfChartPannel'
import IndependentHalfChartPannel from './components/objects/IndependentHalfChartPannel'
import TablePannel from './components/objects/TablePannel'
import DataHandler from './components/DataHandler'
import RightPivotPanel from './components/RightPivotPanel'
import { POINT_CONVERSION_COMPRESSED, POINT_CONVERSION_UNCOMPRESSED } from 'constants';

export default {
  name: 'Preview',
  components: {
    DataHandler,
    ChartPannel,
    PivotPannel,
    KpiHalfChartPannel,
    IndependentHalfChartPannel,
    TablePannel,
    RightPivotPanel
  },
  watch: {
    _initReportData (d) {
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
    scrollTop (top) {
      if (this._isNoticeShow && top > 178) {
        this.$store.commit(types.SET_SHOW_TOP, true)
      } else if (!this._isNoticeShow && top > 172) {
        this.$store.commit(types.SET_SHOW_TOP, true)
      } else {
        this.$store.commit(types.SET_SHOW_TOP, false)
      }
    },
    _projectInfo (d) {
      if (d) {
        localStorage.setItem('setProjectId', d.projectId)
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
      isAnnounceShow: true,
      scrollTop: 0,
      alreadySetFilterList: [],
      filterList: [],
      currentDates: []
    }
  },
  computed: {
    ...mapState({
      _projectInfo: state => state.project._projectInfo,
      _initReportData: state => state.report._initReportData,
      _activeSecondMenu: state => state.menu._activeSecondMenu,
      _twoDepthMenuInfo: state => state.menu._twoDepthMenuInfo,
      categoryMenuId: state => state.menu.menuId,
      dataBySelectedLang: state => state.common._lang.dataBySelectedLang,
      isShowToTop: state => state.common.isShowToTop,
      isFullScreenOpened: state => state.common.isFullScreenOpened,
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
      let alreadyProjectId = window.localStorage.getItem('setProjectId')
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
    notFoundProject () {
      this.$router.push({ name: 'NoProject' })
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
    updateObjects (commonCondition) {
      let objects = []
      let filterList = []
      this.isNotDeployed = false
      _.map(this.$children, (child, idx) => {
        _.map(child.$el.classList, (className, i) => {
          if (className === 'child-objects') {
            objects.push(child)
          }
        })
      })
      if (commonCondition && commonCondition.filter && !_.isEmpty(commonCondition.filter)) {
        _.map(commonCondition.filter, (f, k) => {
          filterList.push({name: k})
        })
        this.setPivotFilterList(filterList)
      }
      _.map(objects, u => {
        u.updateObject(commonCondition)
      })
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
      this.reportType = type
      this.objectList = []
      if (byDimension) {
        this.byDimension = byDimension
        this.$store.commit(types.CHANGE_DIMENSION, byDimension)
        this.makeObjectListByGroupedObject(this._initReportData.groupedByDemensionObjectList)
      } else {
        this.byDimension = ''
        this.$store.commit(types.CHANGE_DIMENSION, 'overall')
        this.makeObjectListByGroupedObject(this._initReportData.groupedByOverallObjectList)
      }
      this.$forceUpdate()
      this.$nextTick(() => {
        this.updateObjects()
      })
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
    goToTop () {
      this.$refs['inner_content'].scrollTop = 0
    },
    initData () {
      this.isNoData = false
      this.isLoading = true
      this.isNotDeployed = false
      const queryObj = this.$route.query
      /* /preview?reportId=122&projectId=0000222211111 */
      this.$store.dispatch(types.GET_PROJECT_INIT, {projectId: queryObj.projectId, thisComponent: this})
      this.$store.dispatch(types.INIT_PREVIEW_INFO, {
        projectId: queryObj.projectId,
        reportId: queryObj.reportId,
        thisComponent: this
      })
    }
  },
  mounted () {
    this.initData()
  }
}
</script>
