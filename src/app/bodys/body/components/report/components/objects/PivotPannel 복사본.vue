<template>
<div :class="{ 'grid-pivot-with-setting-wrapper' : true , 'full-screen-pivot': isFullScreenOpened && _fullScreenPivotIdx === pivotIdx}">
  <div class="grid_area pivot-wrapper" :ref="'grid_area'" id="grid_area">
      <loading-bar :isShowLoading="loadComplete"></loading-bar>
      <div class="grid_title" v-if="_initReportData.reportTemplateType === 'TE02' && loadComplete && gridName">
          <!-- gridName은 Semidashboard (TE02) 에서만 노출 -->
          <p>{{gridName}}</p>
      </div>
      <pivot-header-controller
        :ref="'pivotHeaderController'"
        v-if="loadComplete"
        :totalRecords="totalRecords"
        :filters="filters"
        :showType="'pivot'"
        :toggleRightPanel="toggleRightPanel"
        :goToFullScreen="goToFullScreen"
        :objectInfo="objectInfo"
        :pivotSettingData="pivotDataObj"
        :loadInitObjectData="loadInitObjectData"
        :setTotalCnt="setTotalCnt"
        :goToTableTop="goToTableTop"
        :resetTablesTooltip="resetTablesTooltip"
        :filterList="filterList"
        :objType="objType"
        :pivotIdx="pivotIdx"
      ></pivot-header-controller>
      <new-pivot-table
        v-if="loadComplete"
        :ref="'pivotTables'"
        :isNoData="isNoData"
        :pivotData="pivotData"
        :setTotalCnt="setTotalCnt"
        :initPivotFlag="initPivotFlag"
        :isGoToTableTop="isGoToTableTop"
        :setGoToTableTop="setGoToTableTop"
        :scrollTop="scrollTop"
        :loadComplete="loadComplete"
        :pivotIdx="pivotIdx"
        :isResetPopupContent="isResetPopupContent"
        :changePivotData="changePivotData"
      ></new-pivot-table>
  </div>
</div>
</template>
<script>
import * as types from '@/shared/stores/types'
import { mapState } from 'vuex'
import _ from 'lodash'
import NewPivotTable from '../../common/NewPivotTable'
import LoadingBar from '../../../common/LoadingBar'
import PivotHeaderController from '../../common/PivotHeaderController'
import moment from 'moment'
import { util } from '@/shared/utils/util'

export default {
  name: 'PivotPannel',
  components: {
    LoadingBar,
    NewPivotTable,
    PivotHeaderController
  },
  props: {
    objectInfo: Object,
    byDimension: String,
    pivotIdx: Number,
    setPivotSettingInfo: Function,
    scrollTop: Number,
    objType: String,
    filterList: Array,
    saveLastReportSetting: Function,
    alreadySetFilters: Object,
    settings: Object,
    currentDates: Array,
    gridName: String,
    basicBackupCommonCondition: Object
  },
  watch: {
    objectInfo (d) {
      if (d.settings && !_.isEmpty(d.settings)) {
        this.pivotDataObj.settings = d.settings
      }
    },
    colCombinationList (d) {
      _.map(d, o => {
        this.firstCombinationHeader = o.split(',')[0]
        this.headerList.push(o.split(',')[1])
      })
    },
    dataList (d) {
      if (d.length === 0) {
        this.loadComplete = true
        this.isNoData = true
        this.dataCount = 0
        this.setTotalCnt(0)
        return
      }
      _.map(d, o => {
        let exceptionDateList = []
        this.dateList.push(o[0])
        _.forEach(o, (value, idx) => {
          if (idx !== 0) {
            exceptionDateList.push(value)
            this.dataCount++
          }
        })
        this.series.push(exceptionDateList)
      })
      _.map(this.dateList, (u, i) => {
        if (i === 0) {
          this.leftInfos[0] = {
            left: this.rowList[0],
            date: u
          }
        } else {
          this.leftInfos[i] = {
            left: null,
            date: u
          }
        }
      })
    },
    _isCompletePivotLoad (d) {
      this.$forceUpdate()
    },
    _isUpdateGrid (isUpdateGrid) {
      let pivotObj = {}
      if (isUpdateGrid && this._updateGridIdx === this.pivotIdx) {
        pivotObj = {...this.pivotDataObj, ...this._pivotObjForUpdate}
        this.pivotDataObj = pivotObj
        this.updateObject()
      }
    },
    _me (meObj) {
      // pivot의 경우 pivotSetting에 의해 바뀌는 경우가 있으므로 updateObject를 통해 commonCondition을 전역으로 저장 후 확인할 수 있도록 변경
      this.pivotDataObj.settings.selectedKpi = this.getChangedCurrencyKpi(meObj)
      if (!_.isEmpty(this.commonCondition)) {
        this.updateObject(this.commonCondition)
      } else {
        this.updateObject()
      }
    }
  },
  data () {
    return {
      isResetPopupContent: false,
      isShowDownloadPanel: false,
      loadComplete: false,
      initPivotFlag: false,
      isGoToTableTop: false,
      isNoData: false,
      fullScreenPivotIdx: -1,
      commonCondition: {},
      firstCombinationHeader: '',
      pivotTitle: 'Pivot Table',
      totalRecords: '0',
      dataCount: 0,
      headerList: [],
      dateList: [],
      series: [],
      leftInfos: [],
      pivotData: {},
      filters: '',
      backupOriginSize: 0,
      dataList: [],
      rowFields: [{
        getter: item => item.country,
        label: 'Country'
      }, {
        getter: item => item.gender,
        label: 'Gender',
        headerSlotName: 'genderHeader'
      }],
      colFields: [{
        getter: item => item.year,
        label: 'Year'
      }],
      reducer: (sum, item) => sum + item.count,
      startDate: undefined,
      endDate: undefined,
      pivotDataObj: {
        byDimension: '',
        endDate: '',
        filter: {},
        merged: true,
        objectId: 0,
        projectId: 0,
        reportId: 0,
        settings: {},
        startDate: ''
      }
    }
  },
  computed: {
    ...mapState({
      _initReportData: state => state.report._initReportData,
      _pivotData: state => state.report._pivotData,
      columnList: state => state.report._pivotData.headerInfo.columnList,
      colCombinationList: state => state.report._pivotData.headerInfo.colCombinationList,
      rowList: state => state.report._pivotData.headerInfo.rowList,
      _currentDates: state => state.report._currentDates,
      _isCompletePivotLoad: state => state.report._isCompletePivotLoad,
      _isRightPanelOpen: state => state.report._isRightPanelOpen,
      _isUpdateGrid: state => state.report._isUpdateGrid,
      _updateGridIdx: state => state.report._updateGridIdx,
      _pivotObjForUpdate: state => state.report._pivotObjForUpdate,
      isFullScreenOpened: state => state.common.isFullScreenOpened,
      _fullScreenPivotIdx: state => state.common._fullScreenPivotIdx,
      _currentDimension: state => state.report._currentDimension,
      _me: state => state.common._me
    }),
    windowWidth() {
      return this.getWindowWidth()
    }
  },
  methods: {
    getChangedCurrencyKpi (meObj) {
      let currency = this.getCurrencyShortenCharacter(meObj.currency)
      let kpis = []
      let currencyKpis = this.pivotDataObj.settings.selectedKpi.filter(kpi => {
        return kpi.indexOf('(￦)') > -1 || kpi.indexOf('(￥)') > -1 || kpi.indexOf('($)') > -1
      })
      _.forEach(this.pivotDataObj.settings.selectedKpi, kpi => {
        if (currencyKpis.indexOf(kpi) > -1) {
          let newCurrencyKpi = kpi.split('(')[0] + currency
          kpis.push(newCurrencyKpi)
        } else {
          kpis.push(kpi)
        }
      })
      return kpis
    },
    getCurrencyShortenCharacter (currency) {
      let shortenCharacter = ''
      switch (currency) {
        case 'krw':
          shortenCharacter = '(￦)'
          break
        case 'jpy':
          shortenCharacter = '(￥)'
          break
        case 'usd':
          shortenCharacter = '($)'
          break
      }
      return shortenCharacter
    },
    changeDimensionName (pivotDataObj) {
      let rowList = pivotDataObj.settings.rowList
      let columnList = pivotDataObj.settings.columnList
      let notDisplayList = pivotDataObj.settings.notDisplayList
      let rowDimensionIdx = rowList.indexOf('@ByDimension')
      let columnDimensionIdx = columnList.indexOf('@ByDimension')
      let notDisplayDimensionIdx = notDisplayList.indexOf('@ByDimension')
      if (rowDimensionIdx > -1) {
        rowList[rowDimensionIdx] = this._currentDimension
      }
      if (columnDimensionIdx > -1) {
        columnList[columnDimensionIdx] = this._currentDimension
      }
      if (notDisplayDimensionIdx > -1) {
        notDisplayList[notDisplayDimensionIdx] = this._currentDimension
      }
    },
    changePivotData (pivotData) {
      this.pivotData = pivotData
    },
    resetPopupComponent () {
      this.isResetPopupContent = !this.isResetPopupContent
    },
    getWindowWidth (event) {
      let commonCondition = {}
      commonCondition.filter = this.pivotDataObj.filter
      commonCondition.startDate = this.pivotDataObj.startDate
      commonCondition.endDate = this.pivotDataObj.endDate

      this.updateObject(commonCondition)
    },
    getDateFormat (dateType) {
      let format
      switch (dateType) {
        case 'DA01':
          format = 'YYYYMMDD'
          this.showingFormat = 'YYYY-MM-DD'
          break
        case 'DA02':
          format = 'YYYYMM'
          this.showingFormat = 'YYYY-MM'
          break
        case 'DA03':
          format = 'YYYYMMDD'
          this.showingFormat = 'YYYY-MM-DD'
          break
        case 'DA04':
          format = 'YYYYMM'
          this.showingFormat = 'YYYY-MM'
          break
      }
      return format
    },
    loadInitObjectData () {
      this.resetTablesTooltip()
      this.initPivotFlag = !this.initPivotFlag
    },
    setTotalCnt (cnt) {
      this.totalRecords = cnt + ''
      this.$forceUpdate()
    },
    goToTableTop () {
      this.resetTablesTooltip()
      this.isGoToTableTop = !this.isGoToTableTop
    },
    setGoToTableTop () {
      this.isGoToTableTop = false
    },
    toggleRightPanel () {
      this.resetTablesTooltip()
      this.$store.commit(types.TOGGLE_RIGHT_PANEL)
      this.$store.commit(types.CHECK_RIGHT_PANNEL, 'pivot')
      if (this._currentDimension !== 'overall') {
        this.changeDimensionName(this.pivotDataObj)
      }
      this.$nextTick(() => {
        if (this._isRightPanelOpen) {
          this.setPivotSettingInfo(this.pivotDataObj)
          this.$store.commit(types.SET_PIVOT_IDX, this.pivotIdx)
        }
      })
    },
    setOriginDates (iscommon, commonCondition) {
      // 기본 date value 저장 전용
      const dateType = this._initReportData.dataHandlerType.dateType
      let startDate = this._isUpdateGrid ? this.pivotDataObj.startDate : this.currentDates[0]
      let endDate = this._isUpdateGrid ? this.pivotDataObj.endDate : this.currentDates[1]
      if (iscommon) {
        startDate = commonCondition.startDate
        endDate = commonCondition.endDate
      }

      return [startDate, endDate]
    },
    initDefaultPivotDateObj (originDates) {
      let settings = this.pivotDataObj.settings
      let startDate = originDates[0]
      let endDate = originDates[1]
      this.loadComplete = false
      this.pivotDataObj.byDimension = this.byDimension
      this.pivotDataObj.objectId = this.objectInfo.id
      this.pivotDataObj.reportId = this.objectInfo.reportId
      this.pivotDataObj.projectId = window.localStorage.setProjectId

      this.pivotDataObj.startDate = startDate + ''
      this.pivotDataObj.endDate = endDate + ''
      settings = _.isEmpty(settings) ? (_.cloneDeep(!_.isEmpty(this._pivotObjForUpdate) ? this._pivotObjForUpdate.settings : this.objectInfo.settings)) : settings
      this.pivotDataObj.settings = settings
    },
    setCommonFilterAndSetting (commonCondition) {
      const dateType = this._initReportData.dataHandlerType.dateType
      let startDate = commonCondition.startDate
      let endDate = commonCondition.endDate
      let filter = {}
      if (!_.isEmpty(this.pivotDataObj.filter) && !_.isEmpty(commonCondition.filter)) {
        filter = {...this.pivotDataObj.filter, ...commonCondition.filter}
      } else {
        filter = commonCondition.filter || {}
      }
      this.pivotDataObj.settings = commonCondition.settings || this.pivotDataObj.settings || {}
      if (startDate && endDate) {
        this.pivotDataObj.startDate = startDate
        this.pivotDataObj.endDate = endDate
      }
      return filter
    },
    updateObject (commonCondition) {

      let originDates = []
      let pivotDataObj
      let filters
      let condition = commonCondition || this.basicBackupCommonCondition
      const dateType = this._initReportData.dataHandlerType.dateType
      originDates = this.setOriginDates(false)
      this.commonCondition = condition || {}
      this.initDefaultPivotDateObj(originDates)
      if (condition && !_.isEmpty(condition)) {
        if (!this._isUpdateGrid) {
          filters = this.setCommonFilterAndSetting(condition)
          if (condition.startDate && condition.endDate) {
            originDates = this.setOriginDates(true, condition)
          }
        }
      }
      // [OGPQA-1519] time picker를 동반할때 T가 붙는 현상 수정을 위해 아래 내용 추가 ( 다른 pannel들과는 다르게 pivotsetting에서 새롭게 date를 셋팅할 수 있으므로 originDates를 사용함)
      pivotDataObj = {...this.pivotDataObj}
      pivotDataObj.startDate = dateType === 'DA05' ? moment(originDates[0]).format('YYYYMMDD HHmm') : originDates[0]
      pivotDataObj.endDate = dateType === 'DA05' ? moment(originDates[1]).format('YYYYMMDD HHmm') : originDates[1]
      pivotDataObj.filter = filters

      const isPreview = this.$route.path.indexOf('preview') > 0
      Promise.all([this.$store.dispatch(types.UPDATE_PIVOT_DATA, {isPreview: isPreview, reqBody: pivotDataObj})]).then(res => {
        this.pivotDataObj.startDate = pivotDataObj.startDate
        this.pivotDataObj.endDate = pivotDataObj.endDate
        this.pivotData = res[0]
        this.dataList = this.pivotData.dataList
        this.loadComplete = true
        this.isNoData = false
        this.$store.commit(types.TOGGLE_UPDATE_GRID, false)
        this.$store.commit(types.SET_PIVOT_IDX, -1)
        this.$store.commit(types.UPDATE_PIVOT_DATA, {
          pivotData: this.pivotData,
          pivotIdx: this.pivotIdx
        })
      }).catch(err => {
        if (err.response.data.code === 500104) {
          util.toastr().error(err.response.data.message)
        }
        this.pivotDataObj = pivotDataObj
        this.errorUpdateGrid()
        this.setTotalCnt(0)
      })
    },
    errorUpdateGrid () {
      this.loadComplete = true
      this.isNoData = true
        this.$store.commit(types.TOGGLE_UPDATE_GRID, false)
        this.$store.commit(types.SET_PIVOT_IDX, -1)
    },
    toggleDownloadPanel () {
      this.isShowDownloadPanel = !this.isShowDownloadPanel
    },
    downloadExcel () {
      this.$store.dispatch(types.DOWNLOAD_EXCEL, this.pivotDataObj)
      this.toggleDownloadPanel()
    },
    downloadCSV () {
      this.$store.dispatch(types.DOWNLOAD_CSV, this.pivotDataObj)
      this.toggleDownloadPanel()
    },
    goToFullScreen (idx) {
      this.resetTablesTooltip()
      this.$store.commit(types.TOGGLE_FULL_PIVOT, {
        bool: !this.isFullScreenOpened,
        pivotIdx: idx
      })
      this.$store.commit(types.SET_SHOW_TOP, false)
    },
    resetTablesTooltip () {
      _.forEach(this.$children, component => {
        if (component.hideToolTip) {
          component.hideToolTip()
        }
      })
    },
    initObject () {
      let condition = {}
      if (!_.isEmpty(this.alreadySetFilters)) {
        condition.filter = this.alreadySetFilters
      }
      if (!_.isEmpty(this.settings)) {
        condition.settings = this.settings
      }
      if (!_.isEmpty(condition)) {
        this.updateObject(condition)
      } else {
        this.updateObject()
      }
    }
  },
  mounted () {
    let dateFormat = this.getDateFormat(this._initReportData.dataHandlerType.dateType)
    this.initObject()
  }
}
</script>
<style lang="scss" scoped>
.grid_area {
  box-shadow: none !important;
}
.download-pannel-dimmed-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 80;
}
.full-screen-pivot {
    position: fixed;
    z-index: 999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    margin-top: 0;
}
</style>
