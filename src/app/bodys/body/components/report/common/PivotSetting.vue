<template>
  <div class="pivot_setting_section">
    <div class="pivot_setting_title">
      <span>Setting</span>
      <a @click.stop.prevent="toggleRightPanel()" class="close_pivot_setting">
        <span class="blind">close</span>
      </a>
    </div>
    <div
      class="pivot_setting_area"
      :style="{ 'overflow-y': isOpenPivotCalender ? 'visible' : 'auto' }"
    >
      <div class="date_pivot_setting">
        <dl>
          <dt v-if="_pivotDataHandlerType.dateType !== 'DA06'">
            <span>Date</span>
          </dt>
          <dd v-if="_pivotDataHandlerType.dateType !== 'DA06'">
            <div class="date_set_area">
              <i class="fn-map-018-date_range fn-18 fn-map"></i>
              <!--<a >2018-06-18 ~ 2018-08-18</a>-->
              <div v-for="(calender, calenderIndex) in pivotData" :key="calenderIndex">
                <handler-date-picker
                  v-if="calenderIndex === pivotIndex"
                  :dateCode="_initReportData.dataHandlerType.dateType"
                  :setHandlerDate="setHandlerDate"
                  :selectedDates="selectedDates"
                  :startDate="startDate[pivotIndex]"
                  :endDate="endDate[pivotIndex]"
                  :showingFormat="showingFormat"
                  :from="_initReportData.dataHandlerType.defaultDate.from"
                  :maxRange="_initReportData.dataHandlerType.defaultDate.maxRange"
                  :to="_initReportData.dataHandlerType.defaultDate.to"
                  :date="_initReportData.dataHandlerType.defaultDate.date"
                  :isOpenPivotCalender="isOpenPivotCalender"
                  :availableDates="availableDates"
                  :parent="'pivotSetting'"
                ></handler-date-picker>
              </div>
            </div>
          </dd>
          <dt>
            <span>Pivot</span>
          </dt>
          <dd>
            <div class="pivot_set_area">
              <div class="set_item colum">
                <div class="set_count">
                  <span>Column</span>
                  <span class="set_count_number">{{ pivotData[pivotIndex].settings.columnList.length }}</span>
                </div>
                <div class="set_item_list">
                  <div class="inner_set_item">
                    <ul>
                      <draggable
                        v-model="pivotData[pivotIndex].settings.columnList"
                        group="pivotSettingList"
                        @start="drag=true"
                        @end="drag=false"
                        :move="checkMove"
                        id="columnList"
                      >
                        <li
                          v-for="(name, index) in pivotData[pivotIndex].settings.columnList"
                          :key="index"
                          @mouseleave="() => { isMovedKPI = false }"
                        >
                          <div
                            style="min-width: 66px;margin-right: 5px;"
                            class="set_article filter"
                            @click="() => { toggleFilterDropBox(name); }"
                            @mouseover="() => { showMoreIcon = name }"
                            @mouseleave="() => { showMoreIcon = '' }"
                            :class="{ 'more' : showMoreIcon === name, 'selected' : isPivotDropBoxShow[`_${name}`] }"
                            :style="{ 'padding-right' : '3px' }"
                          >
                            <span>{{ name }}</span>
                            <template v-for="filter in filterInfoList[pivotIndex]">
                              <template v-if="filter.name === name && filter.isFilter">
                                <a class="btn filter">
                                  <span class="blind">filter</span>
                                </a>
                              </template>
                            </template>
                            <!--<a @click.stop.prevent="" class="btn filter"><span class="blind">filter</span></a>-->
                            <a v-if="showMoreIcon === name" class="btn more">
                              <span class="blind">more</span>
                            </a>
                            <a v-else class="btn"></a>
                            <div
                              class="drop_list_layer"
                              style="width: 112px;right: -5px;"
                              v-if="isPivotDropBoxShow[`_${name}`]"
                            >
                              <div
                                class="inner_drop_list"
                                @click="common.layerPopupInClick($event)"
                              >
                                <ul>
                                  <!-- [D] 메뉴 선택 상태일 경우, a 태그에 on 클래스 추가 필요 -->
                                  <!-- [D] 메뉴 비활성화시 a 태그를 span 태그로 변경 필요 -->
                                  <li>
                                    <span>Move to Column</span>
                                  </li>
                                  <li>
                                    <a
                                      @click.prevent="changePivotItem('columnList', 'rowList', index)"
                                      :class="{ 'on' : addClassRowOn }"
                                      @mouseover="() => { addClassRowOn = true }"
                                      @mouseleave="() => { addClassRowOn = false }"
                                    >Move to Row</a>
                                  </li>
                                  <li v-if="name !== 'KPI' ">
                                    <a
                                      @click.prevent="changePivotItem('columnList', 'notDisplayList', index)"
                                      :class="{ 'on' : addClassNotDisplayOn }"
                                      @mouseover="() => { addClassNotDisplayOn = true }"
                                      @mouseleave="() => { addClassNotDisplayOn = false }"
                                      class="two_row"
                                    >
                                      Move to Not
                                      <br>Display
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <!-- [D] 미 노출시 삭제 가능 -->
                              <div v-if="name === 'KPI'" class="add_menu_area">
                                <a
                                  @click.stop.prevent="toggleKpiFilter"
                                  class="btn_add_menu select_kpi"
                                >
                                  <span>Select KPI</span>
                                </a>
                              </div>
                              <div v-if="name !== 'KPI' && !isDateDimension(name)" class="add_menu_area">
                                <a
                                  @click.stop.prevent="toggleFilterEditor(name)"
                                  class="btn_add_menu add_filter"
                                >
                                  <span>Add Filter</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </li>
                      </draggable>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="set_btn_area">
                <a @click.stop.prevent="changeColumnsAndRows" class="btn_set_change">
                  <span class="blind">column and row setting change</span>
                </a>
              </div>
              <div class="set_item row">
                <div class="set_count">
                  <span>Row</span>
                  <span class="set_count_number">{{ pivotData[pivotIndex].settings.rowList.length }}</span>
                </div>
                <div class="set_item_list">
                  <div class="inner_set_item">
                    <ul>
                      <draggable
                        v-model="pivotData[pivotIndex].settings.rowList"
                        group="pivotSettingList"
                        @start="drag=true"
                        @end="drag=false"
                        :move="checkMove"
                        id="rowList"
                      >
                        <li
                          v-for="(name, index) in pivotData[pivotIndex].settings.rowList"
                          :key="index"
                          @mouseleave="() => { isMovedKPI = false }"
                        >
                          <div
                            style="min-width: 66px;margin-right: 5px;"
                            class="set_article filter"
                            @click="() => { toggleFilterDropBox(name);  }"
                            @mouseover="() => { showMoreIcon = name }"
                            @mouseleave="() => { showMoreIcon = '' }"
                            :class="{ 'more' : showMoreIcon === name, 'selected' : isPivotDropBoxShow[`_${name}`] }"
                            :style="{ 'padding-right' : '3px' }"
                          >
                            <span>{{ name }}</span>
                            <template v-for="filter in filterInfoList[pivotIndex]">
                              <template v-if="filter.name === name && filter.isFilter">
                                <a class="btn filter">
                                  <span class="blind">filter</span>
                                </a>
                              </template>
                            </template>
                            <!--<a @click.stop.prevent="" class="btn filter"><span class="blind">filter</span></a>-->
                            <a v-if="showMoreIcon === name" class="btn more">
                              <span class="blind">more</span>
                            </a>
                            <a v-else class="btn"></a>
                            <div
                              class="drop_list_layer"
                              style="width: 112px;right: -5px;"
                              v-if="isPivotDropBoxShow[`_${name}`]"
                            >
                              <div
                                class="inner_drop_list"
                                @click="common.layerPopupInClick($event)"
                              >
                                <ul>
                                  <!-- [D] 메뉴 선택 상태일 경우, a 태그에 on 클래스 추가 필요 -->
                                  <!-- [D] 메뉴 비활성화시 a 태그를 span 태그로 변경 필요 -->
                                  <li>
                                    <a
                                      @click.prevent="changePivotItem('rowList', 'columnList', index)"
                                      :class="{ 'on' : addClassColumnOn }"
                                      @mouseover="() => { addClassColumnOn = true }"
                                      @mouseleave="() => { addClassColumnOn = false }"
                                    >Move to Column</a>
                                  </li>
                                  <li>
                                    <span>Move to Row</span>
                                  </li>
                                  <li v-if="name !== 'KPI'">
                                    <a
                                      @click.prevent="changePivotItem('rowList', 'notDisplayList', index)"
                                      :class="{ 'on' : addClassNotDisplayOn }"
                                      @mouseover="() => { addClassNotDisplayOn = true }"
                                      @mouseleave="() => { addClassNotDisplayOn = false }"
                                      class="two_row"
                                    >
                                      Move to Not
                                      <br>Display
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <!-- [D] 미 노출시 삭제 가능 -->
                              <div v-if="name === 'KPI'" class="add_menu_area">
                                <a
                                  @click.stop.prevent="toggleKpiFilter"
                                  class="btn_add_menu select_kpi"
                                >
                                  <span>Select KPI</span>
                                </a>
                              </div>
                              <div v-if="name !== 'KPI' && !isDateDimension(name)" class="add_menu_area">
                                <a
                                  @click.stop.prevent="toggleFilterEditor(name)"
                                  class="btn_add_menu add_filter"
                                >
                                  <span>Add Filter</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </li>
                      </draggable>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="set_item not_display">
                <div class="set_count">
                  <span>Not Display</span>
                  <span class="set_count_number">{{ pivotData[pivotIndex].settings.notDisplayList.length }}</span>
                </div>
                <div class="set_item_list">
                  <div class="inner_set_item">
                    <ul>
                      <draggable
                        v-model="pivotData[pivotIndex].settings.notDisplayList"
                        group="pivotSettingList"
                        @start="drag=true"
                        @end="drag=false"
                        :move="checkMove"
                        id="notDisplayList"
                      >
                        <li
                          v-for="(name, index) in pivotData[pivotIndex].settings.notDisplayList"
                          :key="index"
                          @mouseleave="() => { isMovedKPI = false }"
                        >
                          <div
                            style="min-width: 66px;margin-right: 5px;"
                            class="set_article filter"
                            @click="() => { toggleFilterDropBox(name); }"
                            @mouseover="() => { showMoreIcon = name }"
                            @mouseleave="() => { showMoreIcon = '' }"
                            :class="{ 'more' : showMoreIcon === name, 'selected' : isPivotDropBoxShow[`_${name}`] }"
                            :style="{ 'padding-right' : '3px' }"
                          >
                            <span>{{ name }}</span>
                            <template v-for="filter in filterInfoList[pivotIndex]">
                              <template v-if="filter.name === name && filter.isFilter">
                                <a class="btn filter">
                                  <span class="blind">filter</span>
                                </a>
                              </template>
                            </template>
                            <!--<a @click.stop.prevent="" class="btn filter"><span class="blind">filter</span></a>-->
                            <a v-if="showMoreIcon === name" class="btn more">
                              <span class="blind">more</span>
                            </a>
                            <a v-else class="btn"></a>
                            <div
                              class="drop_list_layer"
                              style="width: 112px;right: -5px;"
                              v-if="isPivotDropBoxShow[`_${name}`]"
                            >
                              <div
                                class="inner_drop_list"
                                @click="common.layerPopupInClick($event)"
                              >
                                <ul>
                                  <!-- [D] 메뉴 선택 상태일 경우, a 태그에 on 클래스 추가 필요 -->
                                  <!-- [D] 메뉴 비활성화시 a 태그를 span 태그로 변경 필요 -->
                                  <li>
                                    <a
                                      @click.prevent="changePivotItem('notDisplayList', 'columnList', index)"
                                      :class="{ 'on' : addClassColumnOn }"
                                      @mouseover="() => { addClassColumnOn = true }"
                                      @mouseleave="() => { addClassColumnOn = false }"
                                    >Move to Column</a>
                                  </li>
                                  <li>
                                    <a
                                      @click.prevent="changePivotItem('notDisplayList', 'rowList', index)"
                                      :class="{ 'on' : addClassRowOn }"
                                      @mouseover="() => { addClassRowOn = true }"
                                      @mouseleave="() => { addClassRowOn = false }"
                                    >Move to Row</a>
                                  </li>
                                  <li>
                                    <span class="two_row">
                                      Move to Not
                                      <br>Display
                                    </span>
                                  </li>
                                </ul>
                              </div>
                              <!-- [D] 미 노출시 삭제 가능 -->
                              <div v-if="name !== 'KPI' && !isDateDimension(name)" class="add_menu_area">
                                <a
                                  @click.stop.prevent="toggleFilterEditor(name)"
                                  class="btn_add_menu add_filter"
                                >
                                  <span>Add Filter</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </li>
                      </draggable>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </dd>
        </dl>
        <div class="set_btn_grop">
          <ul>
            <li>
              <a @click.stop.prevent="clearPivotInfo" class="btn_refresh">
                <i class="fn-map-049-refresh fn-18 fn-map"></i>
              </a>
            </li>
            <li>
              <a @click.prevent="toggleDownloadDropBox" class="btn_download">
                <i class="fn-map-025-file_download fn-18 fn-map"></i>
              </a>
              <!-- [D] 드롭 리스트 open시, display:block 로 변경 필요 (default - display:none) -->
              <div class="drop_list_layer" style="width: 105px;" v-if="isDownloadDropBoxShow">
                <div class="inner_drop_list" @click="common.layerPopupInClick($event)">
                  <ul>
                    <li>
                      <a @click.stop.prevent="downloadExcel(true)">Merged Excel</a>
                    </li>
                    <li>
                      <a @click.stop.prevent="downloadExcel(false)">Split Excel</a>
                    </li>
                    <li>
                      <a @click.stop.prevent="downloadCSV">CSV</a>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
          <a @click.stop.prevent="updatePivotGrid" class="btn_update_setting">
            <span>UPDATE GRID</span>
          </a>
        </div>
      </div>
      <div class="kpi_filter_info">
        <dl>
          <dt>
            <div class="info_header">
              <span class="title">KPI Info</span>
              <a class="btn_ico_help">
                <span class="blind">help</span>
              </a>
              <span class="number_count">
                <em>{{ pivotData[pivotIndex].settings.selectedKpi.length }}</em>
                /{{ pivotData[pivotIndex].settings.selectedKpi.length + pivotData[pivotIndex].settings.unSelectedKpi.length }}
              </span>
            </div>
            <a @click.stop.prevent="toggleKpiFilter" class="btn_type select_kpi">Select KPI</a>
          </dt>
          <dd>
            <div class="set_status">
              <ul>
                <li>
                  <span class="item_title">Selected</span>
                  <p
                    class="item_detail_info"
                  >{{ pivotData[pivotIndex].settings.selectedKpi.length > 0 ? _.join(pivotData[pivotIndex].settings.selectedKpiAlias, ', ') : ''}}</p>
                </li>
                <li v-if="pivotData[pivotIndex].settings.unSelectedKpi.length > 0">
                  <span class="item_title">Unselected</span>
                  <p
                    class="item_detail_info"
                  >{{ pivotData[pivotIndex].settings.unSelectedKpi.length > 0 ? _.join(pivotData[pivotIndex].settings.unSelectedKpiAlias, ', ') : '' }}</p>
                </li>
              </ul>
            </div>
          </dd>
          <template v-if="customFilterList[pivotIndex] && customFilterList[pivotIndex].length > 0">
            <dt>
              <div class="info_header">
                <span class="title">Applied Filter Info</span>
                <a class="btn_ico_help">
                  <span class="blind">help</span>
                </a>
                <span class="number_count">
                  <em>{{ totalLengthAppliedFilterInfo[pivotIndex] }}</em>
                </span>
              </div>
              <a @click.stop.prevent="toggleFilterEditor()" class="btn_type add_filter">Add Filter</a>
            </dt>
            <dd>
              <div class="set_status">
                <ul>
                  <li v-for="(item, index) in customFilterList[pivotIndex]" :key="index">
                    <span class="item_title">{{ item.name }}</span>
                    <p class="item_detail_info">{{ showFilterListDetailInfo(item) }}</p>
                  </li>
                </ul>
              </div>
            </dd>
          </template>
        </dl>
      </div>
    </div>
    <!-- panel inner layer -->
    <filter-editor
      :isOpenFilterEditor="isOpenFilterEditor"
      :toggleFilterEditor="toggleFilterEditor"
      :applyFilter="applyFilter"
      :alreadySetFilter="customFilterList[pivotIndex]"
      :currentActiveFilterName="currentActiveFilterName"
      :type="'pivotSetting'"
      :pivotFilterList="pivotFilterList[pivotIndex]"
    ></filter-editor>
    <!-- KPI layer -->
    <kpi-filter
      v-if="isOpenKpiFilter"
      :selectedKpiList="pivotData[pivotIndex].settings.selectedKpi"
      :unSelectedKpiList="pivotData[pivotIndex].settings.unSelectedKpi"
      :selectedKpiListAlias="pivotData[pivotIndex].settings.selectedKpiAlias"
      :unSelectedKpiListAlias="pivotData[pivotIndex].settings.unSelectedKpiAlias"
      :toggleKpiFilter="toggleKpiFilter"
      :kpiLayerData="kpiLayerData"
    ></kpi-filter>
    <div class="filter-modal-dimmed-layer" v-if="isOpenKpiFilter" @click="toggleKpiFilter()"></div>
    <div class="filter-modal-dimmed-layer" v-if="isOpenFilterEditor" @click="toggleFilterEditor()"></div>
    <div class="filter-modal-dimmed-layer" v-if="isOpenPivotCalender" @click="toggleDatepicker()"></div>
  </div>
</template>
<script>
import * as types from "@/shared/stores/types"
import { mapState } from "vuex"
import KpiFilter from "./KpiFilter"
import draggable from "vuedraggable"
import _ from "lodash"
import { common } from "@/shared/utils/common"
import FilterEditor from "./FilterEditor"
import { util } from "@/shared/utils/util"
import HandlerDatePicker from "../../common/GrowthyDatepicker/HandlerDatePicker"
import moment from "moment"

export default {
  name: 'PivotSetting',
  props: {
    toggleRightPanel: Function,
    pivotSettingData: Object,
    setPivotFilterList: Function,
    saveLastReportSetting: Function
  },
  components: {
    KpiFilter,
    draggable,
    FilterEditor,
    HandlerDatePicker
  },
  data() {
    return {
      isOpenPivotCalender: false,
      isOpenFilterEditor: false,
      isOpenKpiFilter: false,
      isMovedKPI: false,
      showMoreIcon: '',
      isPivotDropBoxShow: {},
      isDownloadDropBoxShow: false,
      addClassColumnOn: false,
      addClassRowOn: false,
      addClassNotDisplayOn: false,
      currentActiveFilterName: '',
      customFilterList: [],
      totalLengthAppliedFilterInfo: [0],
      filterInfoList: [],
      availableDates: [],
      originFilterInfoList: [],
      initStatePivotData: {},
      pivotIndex: 0,
      pivotData: [{
        byDimension: '',
        endDate: '20190220',
        filter: {},
        merged: true,
        objectId: 0,
        projectId: 0,
        reportId: 0,
        settings: {
          columnList: [],
          notDisplayList: [],
          rowList: [],
          selectedKpi: [],
          unSelectedKpi: []
        },
        startDate: '20190101'
      }],
      originPivotPanelInfo: [],
      dateType: '',
      sendingDateFormat: '',
      startDate: [],
      endDate: [],
      maxRange: 30,
      showingFormat: '',
      pivotFilterList: [],
      selectedDates: []
    }
  },
  watch: {
    _isRightPanelOpen (isOpen) {
      let dateFormat = this.getDateFormat(this._initReportData.dataHandlerType.dateType)
      if (isOpen) {
        this.selectedDates = []
        this.setInitDate(this._initReportData.initCodeList.dateList, this._initReportData.dataHandlerType.defaultDate, dateFormat)
      }
    },
    pivotSettingData (data) {
      this.sendingDateFormat = this.getDateFormat(this._initReportData.dataHandlerType.dateType)
      this.initPivotPannelInfo(0, data)
    },
    isMovedKPI (d) {
      if (d === true) {
        util.toastr().success('KPI는 Column과 Row로만 이동 가능합니다.')
      }
    }
  },
  computed: {
    ...mapState({
      _isRightPanelOpen: state => state.report._isRightPanelOpen,
      _initReportData: state => state.report._initReportData,
      _pivotDataHandlerType: state => state.report._pivotDataHandlerType,
      _byOverallObjectList: state => state.report._byOverallObjectList,
      _byDemensionObjectList: state => state.report._byDemensionObjectList,
      _originFilterList: state => state.report._initReportData.dataHandlerType.filterList,
      _currentDimension: state => state.report._currentDimension
    }),
    _() {
      return _
    },
    common() {
      return common
    }
  },
  methods: {
    showFilterListDetailInfo (item) {
      let filterType = this._originFilterList[item.name] === null ? 'string' : 'code'
      if( filterType === 'string' ) {
        return item.filterValues.toString()
      } else {
        return _.map(item.filterValues, o => o.value ).toString()
      }
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
        case 'DA05':
          format = 'YYYYMMDDTHHmm'
          this.showingFormat = 'YYYY-MM-DD HH:mm'
          break
      }
      return format
    },
    setInitDate (dateList, defaultDate, dateFormat) {
      let toCode = defaultDate.date || defaultDate.month || defaultDate.to
      let dateType = this._initReportData.dataHandlerType.dateType
      let rangeType = 'days'
      let startDate
      let endDate
      let endFormat
      switch (toCode) {
        case 'Now':
          endDate = moment().format(dateFormat)
          rangeType = dateType === 'DA05' ? 'minutes' : 'days'
          endFormat = endDate
          break
        case 'SD01':
          endDate = moment().format(dateFormat)
          rangeType = dateType === 'DA05' ? 'minutes' : 'days'
          endFormat = endDate
          break
        case 'SD02':
          endDate = moment().subtract(1, 'days').format(dateFormat)
          rangeType = dateType === 'DA05' ? 'minutes' : 'days'
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
      this.startDate[0] = startDate
      this.endDate[0] = moment(endFormat).format(dateFormat)
      this.selectedDates = [this.startDate[0], this.endDate[0]]
      this.$forceUpdate()
    },
    isDateDimension (name) {
      let isDate = false
      let metaManageData = this._initReportData.metaDataList
      switch (name) {
        case 'BaseDate':
          isDate = true
          break
        case 'BaseMonth':
          isDate = true
          break
        case 'BaseTime':
          isDate = true
          break
      }
      if (metaManageData.indexOf(name) > -1) {
        isDate = true
      }
      return isDate
    },
    checkMove (evt) {
      common.layerPopupClose()
      if (evt.draggedContext.element === 'KPI' && evt.relatedContext.component.$el.id === 'notDisplayList') {
        this.isMovedKPI = true
        return false
      }
    },
    changeColumnsAndRows () {
      common.layerPopupClose()
      let columnList = _.cloneDeep(this.pivotData[0].settings.columnList)
      let rowList = _.cloneDeep(this.pivotData[0].settings.rowList)
      this.pivotData[0].settings.columnList = rowList
      this.pivotData[0].settings.rowList = columnList
      this.$forceUpdate()
    },
    clearPivotInfo () {
      this.pivotData[0].startDate = moment(this.originPivotPanelInfo[0].startDate).format(this.sendingDateFormat)
      this.pivotData[0].endDate = moment(this.originPivotPanelInfo[0].endDate).format(this.sendingDateFormat)
      this.startDate[0] = moment(this.originPivotPanelInfo[0].startDate).format(this.showingFormat)
      this.endDate[0] = moment(this.originPivotPanelInfo[0].endDate).format(this.showingFormat)
      this.selectedDates = [this.startDate[0], this.endDate[0]]
      this.pivotData[0].settings.columnList = _.cloneDeep(
        this.originPivotPanelInfo[0].settings.columnList
      )
      this.pivotData[0].settings.rowList = _.cloneDeep(
        this.originPivotPanelInfo[0].settings.rowList
      )
      this.pivotData[0].settings.notDisplayList = _.cloneDeep(
        this.originPivotPanelInfo[0].settings.notDisplayList
      )
      this.pivotData[0].settings.selectedKpi = _.cloneDeep(
        this.originPivotPanelInfo[0].settings.selectedKpi
      )
      this.pivotData[0].settings.unSelectedKpi = _.cloneDeep(
        this.originPivotPanelInfo[0].settings.unSelectedKpi
      )
      this.pivotData[0].filter = {}
      this.filterInfoList[0] = _.cloneDeep(this.originFilterInfoList[0])
      this.customFilterList[0] = []
      if (this.pivotData[0].settings.unSelectedKpi.length > 0) {
        this.toggleFilterIcon("KPI", true)
      }
      this.$forceUpdate()
    },
    updatePivotGrid () {
      this.$store.commit(types.TOGGLE_UPDATE_GRID, {
        boolean: true,
        pivotObjForUpdate: this.pivotData[0]
      })
      if (!this.pivotData[0].filter) {
        this.pivotData[0].filter = {}
      } else {
        this.pivotData[0].pivotFilters = []
        _.map(this.pivotData[0].filter, (f, k) => {
          this.pivotData[0].pivotFilters.push(k)
        })
        this.pivotData[0].filter = this.getOnlyFilterValues(this.pivotData[0].filter)
      }
      let lastPivotState = _.cloneDeep(this.pivotData[0])
      if (lastPivotState.filter && !_.isEmpty(lastPivotState.filter) || !_.isEqual(lastPivotState.settings, this.initStatePivotData.settings)) {
        this.saveLastReportSetting ? this.saveLastReportSetting(lastPivotState, 'OB05') : ''
      }
      this.$nextTick(() => {
        this.toggleRightPanel()
      })
    },
    kpiLayerData (data) {
      this.toggleKpiFilter()
      this.pivotData[0].settings.selectedKpi = data.checkedList
      this.pivotData[0].settings.unSelectedKpi = data.unCheckedList
      this.pivotData[0].settings.selectedKpiAlias = data.checkedListAlias
      this.pivotData[0].settings.unSelectedKpiAlias = data.unCheckedListAlias

      if (this.pivotData[0].settings.unSelectedKpi.length > 0) {
        this.toggleFilterIcon('KPI', true)
      } else {
        this.toggleFilterIcon('KPI', false)
      }
    },
    toggleKpiFilter () {
      common.layerPopupClose()
      this.showMoreIcon = ''
      this.isOpenKpiFilter = !this.isOpenKpiFilter
    },
    toggleFilterEditor (name) {
      common.layerPopupClose()
      this.currentActiveFilterName = name || ''
      this.showMoreIcon = ''
      this.isOpenFilterEditor = !this.isOpenFilterEditor
    },
    toggleDatepicker () {
      this.isOpenPivotCalender = false
    },
    getOnlyFilterValues (filters) {
      let filterObj = {}
      _.forEach(filters, (filterValue, filterName) => {
        let filterType = typeof filterValue === 'object' ? 'code' : 'string'
        let fValues = []
        if (filterType !== 'string') {
          fValues = filterValue.map(o => {
            return o.code || o
          })
        } else {
          fValues = filterValue
        }
        filterObj[filterName] = fValues
      })
      return filterObj
    },
    applyFilter (filters) {
      let filterList = []
      _.forEach(filters, filter => {
        let filterType = typeof filter.filterValues[0] === 'string' ? 'string' : 'code'
        let fValues = []
        if (filterType !== 'string') {
          fValues = filter.filterValues.map(o => {
            return o.code
          })
        } else {
          fValues = filter.filterValues
        }
        filterList.push({
          name: filter.name,
          filterValues: fValues
        })
      })
      this.totalLengthAppliedFilterInfo[0] = 0
      let filter = {}
      _.forEach(filterList, item => {
        filter[item.name] = item.filterValues
        this.totalLengthAppliedFilterInfo[0] += item.filterValues.length
      })
      this.pivotData[0].filter = filter
      _.forEach(this.filterInfoList[0], i => {
        if (i.name !== 'KPI') {
          this.toggleFilterIcon(i.name, false)
        }
        _.forEach(filterList, v => {
          if (i.name === v.name) {
            this.toggleFilterIcon(v.name, true)
          }
        })
      })
      this.addToCustomCodeFilter(filters)
      this.setPivotFilterList(filterList)
      this.toggleFilterEditor()
    },
    addToCustomCodeFilter (filters) {
      this.customFilterList[0] = filters
    },
    deleteFilter (idx) {
      this.customFilterList[0].splice(idx, 1)
    },
    changePivotItem (oldList, newList, idx) {
      if (oldList === 'columnList') {
        if (newList === 'rowList') {
          this.pivotData[0].settings.rowList.push(
            this.pivotData[0].settings.columnList[idx]
          )
        } else if (newList === 'notDisplayList') {
          this.pivotData[0].settings.notDisplayList.push(
            this.pivotData[0].settings.columnList[idx]
          )
        }
        this.pivotData[0].settings.columnList.splice(idx, 1)
      }
      if (oldList === 'rowList') {
        if (newList === 'columnList') {
          this.pivotData[0].settings.columnList.push(
            this.pivotData[0].settings.rowList[idx]
          )
        } else if (newList === 'notDisplayList') {
          this.pivotData[0].settings.notDisplayList.push(
            this.pivotData[0].settings.rowList[idx]
          )
        }
        this.pivotData[0].settings.rowList.splice(idx, 1)
      }
      if (oldList === 'notDisplayList') {
        if (newList === 'columnList') {
          this.pivotData[0].settings.columnList.push(
            this.pivotData[0].settings.notDisplayList[idx]
          )
        } else if (newList === 'rowList') {
          this.pivotData[0].settings.rowList.push(
            this.pivotData[0].settings.notDisplayList[idx]
          )
        }
        this.pivotData[0].settings.notDisplayList.splice(idx, 1)
      }
      this.addClassColumnOn = false
      this.addClassRowOn = false
      this.addClassNotDisplayOn = false
      common.layerPopupClose()
    },
    toggleFilterIcon (name, isShow) {
      _.map(this.filterInfoList[0], i => {
        if (i.name === name) {
          i.isFilter = isShow
        }
      })
    },
    setHandlerDate (cDates) {
      this.startDate[this.pivotIndex] = cDates[0]
      this.endDate[this.pivotIndex] = cDates[1]
      this.pivotData[0].startDate = moment(cDates[0]).format(this.sendingDateFormat)
      this.pivotData[0].endDate = moment(cDates[1]).format(this.sendingDateFormat)
      this.startDate[0] =  moment(cDates[0]).format(this.showingFormat)
      this.endDate[0] = moment(cDates[1]).format(this.showingFormat)
    },
    makeParamForDownload () {
      let downloadParam = _.cloneDeep(this.pivotData[0])
      if (!downloadParam.filter) {
        downloadParam.filter = {}
      } else {
        downloadParam.pivotFilters = Object.keys(downloadParam.filter)
        downloadParam.filter = this.getOnlyFilterValues(downloadParam.filter)
      }
      return downloadParam
    },
    downloadExcel(isMerged) {
      let downloadParam = this.makeParamForDownload()
      if (isMerged) {
        downloadParam.merged = true
      }
      this.$store.dispatch(types.DOWNLOAD_EXCEL, downloadParam)
      common.layerPopupClose()
    },
    downloadCSV () {
      let downloadParam = this.makeParamForDownload()
      this.$store.dispatch(types.DOWNLOAD_CSV, downloadParam)
      common.layerPopupClose()
    },
    toggleDownloadDropBox () {
      common.layerPopupToggle(this, 'isDownloadDropBoxShow')
    },
    toggleFilterDropBox (name) {
      common.layerPopupToggles(this, 'isPivotDropBoxShow', `_${name}`)
    },
    initPivotPannelInfo (pivotIndex, d) {
      let objectList = this._byOverallObjectList
      if (d.startDate && d.startDate.length === 6) {
        d.startDate = d.startDate + '01'
      }
      if (d.endDate && d.endDate.length === 6) {
        d.endDate = d.endDate + '01'
      }
      this.originPivotPanelInfo[pivotIndex] = _.cloneDeep(d)
      this.pivotData[pivotIndex] = {settings: {}}
      this.pivotData[pivotIndex].startDate = moment(d.startDate).format(this.sendingDateFormat)
      this.pivotData[pivotIndex].endDate = moment(d.endDate).format(this.sendingDateFormat)
      this.startDate[pivotIndex] = moment(d.startDate).format(this.showingFormat)
      this.endDate[pivotIndex] = moment(d.endDate).format(this.showingFormat)
      this.selectedDates = [this.startDate[pivotIndex], this.endDate[pivotIndex]]
      this.pivotData[pivotIndex].objectId = d.objectId
      this.pivotData[pivotIndex].reportId = d.reportId
      this.pivotData[pivotIndex].projectId = window.localStorage.setProjectId
      this.pivotData[pivotIndex].settings.columnList = d.settings.columnList
      this.pivotData[pivotIndex].settings.notDisplayList = d.settings.notDisplayList
      this.pivotData[pivotIndex].settings.rowList = d.settings.rowList
      this.pivotData[pivotIndex].settings.selectedKpi = d.settings.selectedKpi
      this.pivotData[pivotIndex].settings.unSelectedKpi = d.settings.unSelectedKpi
      this.pivotData[pivotIndex].settings.selectedKpiAlias = d.settings.selectedKpiAlias
      this.pivotData[pivotIndex].settings.unSelectedKpiAlias = d.settings.unSelectedKpiAlias

      if (this._currentDimension !== 'overall') {
        objectList = this._byDemensionObjectList
      }

      this.pivotFilterList[pivotIndex] = _.find(objectList, { id: d.objectId }).pivotInfo.filterList
      let filterInfoList = []
      filterInfoList[pivotIndex] = [
        ...this.pivotData[pivotIndex].settings.columnList,
        ...this.pivotData[pivotIndex].settings.notDisplayList,
        ...this.pivotData[pivotIndex].settings.rowList
      ]
      // this.pivotFilterList[pivotIndex] = filterInfoList[pivotIndex]
      let filterItems = {}
      _.map(this.pivotFilterList[pivotIndex], (filterItem, filterName) => {
        if (filterInfoList[pivotIndex].indexOf(filterName) > -1) {
          filterItems[filterName] = filterItem
        }
      })
      this.pivotFilterList[pivotIndex] = filterItems
      this.customFilterList[pivotIndex] = []
      this.totalLengthAppliedFilterInfo[pivotIndex] = 0
      this.filterInfoList[pivotIndex] = []
      _.map(filterInfoList[pivotIndex], item => {
        this.filterInfoList[pivotIndex].push({ name: item, isFilter: false })
      })
      this.originFilterInfoList[pivotIndex] = _.cloneDeep(this.filterInfoList[pivotIndex])
      if (this.pivotData[pivotIndex].settings.unSelectedKpi.length > 0) {
        this.toggleFilterIcon('KPI', true)
      }
      if (!_.isEmpty(this.pivotSettingData.filter)) {
        _.forEach(this.pivotSettingData.filter, (value, key) => {
          let filterValuesObjs = []
          let filterType = this._originFilterList[key] === null ? 'string' : 'code'
          if (filterType === 'string') {
            filterValuesObjs = [...value]
          } else {
            _.forEach(value, o => {
              let valueObj = this._originFilterList[key].filter(obj => {
                return obj.code === o
              })[0]
              filterValuesObjs.push(valueObj)
            })
          }
          this.customFilterList[0].push({name: key, filterValues: filterValuesObjs})
        })
        let filter = {}
        _.forEach(this.customFilterList[0], item => {
          filter[item.name] = item.filterValues
           this.totalLengthAppliedFilterInfo[0] += item.filterValues.length
        })
        this.pivotData[pivotIndex].filter = filter
        _.forEach(this.filterInfoList[0], i => {
          _.forEach(this.customFilterList[0], v => {
            if (i.name === v.name) {
              this.toggleFilterIcon(v.name, true)
            }
          })
        })
      }
      this.initStatePivotData = _.cloneDeep(this.pivotData[pivotIndex])
      this.$forceUpdate()
    }
  },
  mounted () {
    let dateFormat = this.getDateFormat(this._initReportData.dataHandlerType.dateType)
    this.selectedDates = []
    this.setInitDate(this._initReportData.initCodeList.dateList, this._initReportData.dataHandlerType.defaultDate, dateFormat)
  },
  created() {
    this.$root.componentsName.PivotSetting = this
  }
}
</script>
<style lang="scss">
.include_right_panel .drop_list_layer .inner_drop_list li span.two_row {
  line-height: 14px;
  height: 42px;
  padding-top: 7px;
}
.set_layer.filter {
  z-index: 110;
}
.filter-modal-dimmed-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: #000;
  opacity: 0.5;
  -moz-opacity: 0.7;
}
.pivot_setting_area
  .date_pivot_setting
  .date_set_area
  .datepicker-popup.datepicker-popup-da03 {
  width: 760px;
  left: -800px !important;
  top: 35px;
  z-index: 110;
}
.pivot_setting_area
  .date_pivot_setting
  .date_set_area
  .datepicker-popup.datepicker-popup-da04 {
  width: 760px;
  left: -800px !important;
  top: 35px;
  z-index: 110;
}
.set_layer_growthy .btn_group {
  text-align: right;
  .action_btn .btn {
    display: inline-block !important;
    vertical-align: top !important;
    height: 28px !important;
    width: 80px !important;
    line-height: 28px !important;
    font-size: 11px !important;
    color: #fff !important;
    text-align: center !important;
    font-family: robotoMedium !important;
    border-radius: 4px !important;
    -webkit-border-radius: 4px !important;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
      0 2px 1px -1px rgba(0, 0, 0, 0.06), 0 1px 1px 0 rgba(0, 0, 0, 0.1) !important;
    padding-left: 0px !important;
  }
}
.include_right_panel .drop_list_layer .inner_drop_list li a,
.include_right_panel .drop_list_layer .inner_drop_list li span {
  font-size: 11px !important;
}
</style>
