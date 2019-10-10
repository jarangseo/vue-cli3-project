<template>
<div v-if="showDataHandler" class="inner_data_handler" :style="isFixed ? fixedStyleObject : ''">
    <!-- [D] set_dimension_area 영역 미노출시 구조 삭제 필요 -->
    <!-- [D] 반드시 구조를 삭제해야 css style 적용이 가능함.(촤측 여백차이있음) -->
    <dimension-list
      v-if="_initReportData.dataHandlerType.dataHandlerType !== 'DH01'"
      :setReportType="setReportType"
      :selectedDimension="alreadySetDataType"
    ></dimension-list>
    <div class="set_filter_area">
        <div class="inner_set_filter">
            <!-- <handler-date-picker
              :dateCode="dateType"
            ></handler-date-picker> -->
            <handler-date-picker
              :dateCode="_initReportData.dataHandlerType.dateType"
              :setHandlerDate="setHandlerDate"
              :selectedDates="selectedDates"
              :availableDates="availableDates"
              :startDate="startDate"
              :endDate="endDate"
              :showingFormat="showingFormat"
              :from="_initReportData.dataHandlerType.defaultDate.from"
              :maxRange="_initReportData.dataHandlerType.defaultDate.maxRange"
              :to="_initReportData.dataHandlerType.defaultDate.to"
              :date="_initReportData.dataHandlerType.defaultDate.date"
              :setUpdatedFlag="setUpdatedFlag"
            ></handler-date-picker>
            <div v-if="showFilterArea" class="set_filter">
                <div class="filter_area">
                    <ul>
                        <!-- 최대 2줄까지만 노출 (최대 높이값 제한 - css처리완료) -->
                        <!-- [D] 상태에 따른 클래스 및 구조 변경 필요 -->
                        <li>
                            <div class="filter_item_add">
                                <i class="fn-map-063-filter fn-16 fn-map"><span>FILTER</span>
                                    <a @click="toggleFilterEditor" class="btn_add_filter"><span class="blind">addition</span></a>
                                </i>
                            </div>
                        </li>
                        <!-- [D] 적용 필터가 없을경우 노출 -->
                        <!-- 2019.08.27 https://wiki.linecorp.com/pages/viewpage.action?pageId=1525278027 내용에 따라 제거 -->
                        <li>
                            <div class="no_filter" v-if="false">
                                <span> {{ dataBySelectedLang.analytics_handler_msg_nofilter }} </span>
                            </div>
                        </li>
                        <!-- [D] 적용 필터가 없을경우 filter_select_item가 적용된 li는 모두 삭제필요 -->
                        <li v-for="(filter, key) in filterObjectList" :key="key">
                            <div class="filter_select_item" v-tooltip="{content: `${lineBreakedFilterString(filter)}`}" style="cursor:pointer;">
                                <span>{{filter.name}}</span>
                                <a class="btn_delete_filter" @click="deleteFilter(key)">
                                    <span class="blind">delete</span>
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- data handler setting layer -->
            <!-- [D] 노출시 display:block 적용 필요 -->
            <!-- filter-->
            <filter-editor
              :isOpenFilterEditor="isOpenFilterEditor"
              :toggleFilterEditor="toggleFilterEditor"
              :applyFilter="applyFilter"
              :alreadySetFilter="filterObjectList"
              :parent="'handler'"
            ></filter-editor>
            <div class="filter-editor-dimmed-layer" v-if="isOpenFilterEditor" @click="toggleFilterEditor()"></div>
            <!-- date-->
            <!--
                [D] date layer는 총 5개 타입 존재,
                1. Start time ~ End time => class="set_layer start_end_time"
                2. Start date ~ End date => class="set_layer start_end_date"
                3. Start month ~ End month => class="set_layer start_end_month"
                4. Date => class="set_layer date"
                5. Month => class="set_layer month"
            -->
            <!-- [D] 노출시 display:block 로 변경 필요 -->
            <!-- //data handler setting layer -->
        </div>
    </div>
    <div class="update_area">
        <!-- [D] 활성화시 p 테그를 a 태그로 변경 필요 -->
        <!-- <p class="btn_set_update"><span>UPDATE</span></p> -->
        <a @click="updateObject()" class="btn_set_update" :class="{'disabled':!isUpdated}" style="cursor: pointer;"><span>UPDATE</span></a>
    </div>
</div>
</template>
<script>
import DimensionList from '../common/DimensionList'
import FilterEditor from '../common/FilterEditor'
import { mapState } from 'vuex'
import moment from 'moment'
import _ from 'lodash'
import * as types from '@/shared/stores/types'
import HandlerDatePicker from '../../common/GrowthyDatepicker/HandlerDatePicker'
import '@/assets/css/tooltip/vtooltip.css'
import { POINT_CONVERSION_COMPRESSED, POINT_CONVERSION_UNCOMPRESSED } from 'constants';
import { util } from '@/shared/utils/util'

export default {
  name: 'DataHandler',
  components: {
    DimensionList,
    FilterEditor,
    HandlerDatePicker
  },
  watch: {
    _initReportData (reportData) {
      let dateFormat
      dateFormat = this.getDateFormat(reportData.dataHandlerType.dateType)
      this.setInitDate(reportData.dataHandlerType.defaultDate, dateFormat)
      this.showFilterArea = !_.isEmpty(reportData.dataHandlerType.filterList)
      this.showDataHandler = this.showFilterArea || reportData.dataHandlerType.dateType !== 'DA06'
    },
    scrollTop (top) {
      if (this.isAnnounceShow && top > 178) {
        this.isFixed = true
      } else if (!this.isAnnounceShow && top > 172) {
        this.isFixed = true
      } else {
        this.isFixed = false
      }
    },
    alreadySetFilterList (filterList) {
      let filterObjects = []
      _.forEach(filterList, filter => {
        let filterType = this._originFilterList[filter.name] === null ? 'string' : 'code'
        let filterValueObjects = []
        if (filterType === 'code') {
          _.forEach(filter.filterValues, val => {
            let obj = this._originFilterList[filter.name].filter(of => {
              return of.code === val
            })[0]
            filterValueObjects.push(obj)
          })
          filterObjects.push({
            name: filter.name,
            filterValues: filterValueObjects
          })
        } else {
          filterObjects.push(filter)
        }
      })
      this.filterObjectList = filterObjects
      this.filterList = this.getFilterValueString(filterObjects)
    },
    _activeModal (activeModal) {
      activeModal !== this.$options.name ? this.isOpenFilterEditor = false : ''
    },
    filterList () {
      this.setUpdatedFlag(true)
    }
  },
  props: {
    projectId: String,
    setReportType: Function,
    alreadySetDataType: String,
    updateObjects: Function,
    isAnnounceShow: Boolean,
    scrollTop: Number,
    alreadySetFilterList: Array,
    saveLastReportSetting: Function
  },
  data () {
    return {
      isOpenFilterEditor: false,
      filterList: [],
      filterObjectList: [],
      availableDates: [],
      defaultChartAndTableObj: {
        byDimension: '',
        endDate: '',
        filter: {},
        merged: true,
        objectId: -1,
        projectId: -1,
        reportId: -1,
        settings: {},
        startDate: ''
      },
      dateFormat: 'YYYYMMDD',
      defaultPivotObj: {
        byDimension: '',
        endDate: '',
        filter: {

        },
        merged: true,
        objectId: -1,
        projectId: '',
        reportId: -1,
        settings: {
          columnList: [],
          rowList: [],
          notDisplayList: [],
          selectedKpi: []
        },
        startDate: ''
      },
      selectedDates: [],
      showingFormat: '',
      startDate: '',
      endDate: '',
      showDataHandler: true,
      showFilterArea: true,
      isFixed: false,
      isUpdated: false
    }
  },
  computed: {
    ...mapState({
      _initReportData: state => state.report._initReportData,
      dateType: state => state.report._initReportData.dataHandlerType.dateType,
      objectList: state => state.report._initReportData.byOverallObjectList,
      _activeModal: state => state.common._activeModal,
      dataBySelectedLang: state => state.common._lang.dataBySelectedLang,
      _isOpenMenu: state => state.menu._isOpenMenu,
      _originFilterList: state => state.report._initReportData.dataHandlerType.filterList
    }),
    moment () {
      return moment
    },
    fixedStyleObject () {
      // width of window browsers' scrollbar is 17
      return {
        position: 'fixed !important',
        top: this.isAnnounceShow ? '74px' : '35px',
        zIndex: '49',
        width: this._isOpenMenu ? `calc(100% - ${util.isWindow() ? 137 : 120}px) !important` : `calc(100% - ${util.isWindow() ? 337 : 320}px) !important`,
        height: '64px !important'
      }
    }
  },
  methods: {
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
        case 'DA05':
          format = 'YYYYMMDDTHHmm'
          this.showingFormat = 'YYYY-MM-DD HH:mm'
          break
      }
      return format
    },
    setInitDate (defaultDate, dateFormat) {
      let toCode = defaultDate.date || defaultDate.month || defaultDate.to
      let dateType = this._initReportData.dataHandlerType.dateType
      let rangeType = 'days'
      let startDate
      let endDate
      let endFormat
      switch (toCode) {
        case 'Now':
          endDate = moment().format(dateFormat)
          rangeType = dateType === 'DA05' ? 'hours' : 'days'
          endFormat = endDate
          break
        case 'SD01':
          endDate = moment().format(dateFormat)
          rangeType = dateType === 'DA05' ? 'hours' : 'days'
          endFormat = endDate
          break
        case 'SD02':
          endDate = moment().subtract(1, 'days').format(dateFormat)
          rangeType = dateType === 'DA05' ? 'hours' : 'days'
          endFormat = endDate
          break
        case 'SD03':
          endDate = moment().format(dateFormat)
          rangeType = 'months'
          endFormat = endDate + '01'
          break
        case 'SD04':
          endDate = moment().subtract(1, 'months').format(dateFormat)
          rangeType = 'months'
          endFormat = endDate + '01'
          this.availableDates = [startDate, endDate]
          break
      }
      startDate = moment(endFormat).subtract(defaultDate.from, rangeType).format(dateFormat)
      this.startDate = startDate
      this.endDate = moment(endFormat).format(dateFormat)
      this.selectedDates = [this.startDate, this.endDate]
      this.$forceUpdate()
    },
    toggleFilterEditor () {
      this.isOpenFilterEditor = !this.isOpenFilterEditor
      this.$store.commit(types.SET_ACTIVE_MODAL, this.$options.name)
    },
    applyFilter (filters) {
      this.filterObjectList = filters
      this.filterList = this.getFilterValueString(filters)
      this.toggleFilterEditor()
    },
    getFilterValueString (filters) {
      let tempFilterList = _.cloneDeep(filters)
      _.map(tempFilterList, o => {
        o.filterValues = _.map(o.filterValues, u => {
          return typeof u === 'string' ? u : u.value
        })
      })
      return tempFilterList
    },
    lineBreakedFilterString (filter) {
      let output = []
      let tooltipStrArr = `${filter.name} filters: ${this.getFilterValueString([filter])[0].filterValues.toString()}`.split('')
      const maxLength = 100
      const totalRepeat = tooltipStrArr.length / maxLength

      for( let i = 0; i<totalRepeat; i++ ) {
        output.push(tooltipStrArr.splice(0,maxLength).join(''))
      }
      return output.join('<br />')
    },
    deleteFilter (idx) {
      this.filterList.splice(idx, 1)
      this.filterObjectList.splice(idx, 1)
    },
    setChartAndTableData (obj, reportId) {
      let data = _.cloneDeep(this.defaultChartAndTableObj)
      data = { ...data, ...obj }
      data.projectId = this.projectId
      data.objectId = obj.id
      data.reportId = reportId
      data.startDate = moment().format('YYYYMMDD')
      data.endDate = moment().format('YYYYMMDD')
      return data
    },
    setPivotData (obj, reportId) {
      let data = _.cloneDeep(this.defaultPivotObj)
      data = { ...data, ...obj }
      data.projectId = this.projectId
      data.objectId = obj.id
      data.reportId = reportId
      data.filter = data.filterList
      data.startDate = moment().format('YYYYMMDD')
      data.endDate = moment().format('YYYYMMDD')
      return data
    },
    settingUpdateObject (type, obj) {
      let objectInfo = {}
      switch (type) {
        case 'OB01':
          objectInfo = this.setChartAndTableData(obj.chartInfo, obj.reportId)
          break
        case 'OB02':
          objectInfo = this.setChartAndTableData(obj.chartInfo, obj.reportId)
          break
        case 'OB03':
          objectInfo = this.setChartAndTableData(obj.chartInfo, obj.reportId)
          break
        case 'OB04':
          objectInfo = this.setChartAndTableData(obj.tableInfo, obj.reportId)
          break
        case 'OB05':
          objectInfo = this.setPivotData(obj.pivotInfo, obj.reportId)
          break
      }
      return objectInfo
    },
    setHandlerDate (cDates) {
      this.startDate = cDates[0]
      this.endDate = cDates[1]
      this.$store.commit(types.SET_CURRENT_DATES, {
        dateCode: this.dateType,
        startDate: this.startDate,
        endDate: this.endDate
      })
    },
    updateObject () {
      let filterObj = {}
      let initialFilters = this._initReportData.dataHandlerType.filterList
      if (!this.isUpdated) {
        return
      }
      this.setUpdatedFlag(false)
      if (this.filterList.length > 0) {
        _.map(this.filterList, u => {
          let codeList = []
          if (initialFilters[u.name]) {
            _.forEach(u.filterValues, fVal => {
              let filterObj = initialFilters[u.name].filter(o => {
                return o.value === fVal
              })[0]
              codeList.push(filterObj.code)
            })
            filterObj[u.name] = codeList
          } else {
            filterObj[u.name] = u.filterValues
          }
        })
      }
      this.$store.commit(types.SET_CURRENT_DATES, {
        dateCode: this.dateType,
        startDate: this.startDate,
        endDate: this.endDate
      })
      this.updateObjects({
        filter: filterObj,
        startDate: moment(this.startDate).format(this.dateFormat),
        endDate: moment(this.endDate).format(this.dateFormat)
      })
    },
    setUpdatedFlag (bool) {
      this.isUpdated = bool
    }
  },
  mounted () {
    this.dateFormat = this.getDateFormat(this._initReportData.dataHandlerType.dateType)
    this.selectedDates = []
    this.setInitDate(this._initReportData.dataHandlerType.defaultDate, this.dateFormat)
    this.showFilterArea = !_.isEmpty(this._initReportData.dataHandlerType.filterList)
    this.showDataHandler = this.showFilterArea || this._initReportData.dataHandlerType.dateType !== 'DA06'
    this.$store.commit(types.SET_CURRENT_DATES, {
      dateCode: this.dateType,
      startDate: this.startDate,
      endDate: this.endDate
    })
  }
}
</script>
<style lang="scss" scoped>
.fixed-top {
  position: fixed !important;
  top: 74px;
  z-index: 99;
  width: calc(100% - 330px) !important;
  height: 64px !important;
}
.non-announce-fixed-top {
  position: fixed !important;
  top: 35px;
  z-index: 99;
  width: calc(100% - 330px) !important;
  height: 64px !important;
}
.filter-editor-dimmed-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}
.disabled {
  background-color: rgba(0, 0, 0, 0.3) !important;
  cursor: not-allowed !important;
}
</style>
