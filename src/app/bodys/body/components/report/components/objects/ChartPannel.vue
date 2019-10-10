<template>
  <div class="chart-wrapper">
    <div class="chart_area">
      <ul>
        <li>
          <div class="chart_section">
            <div class="chart_info_area">
              <div class="chart_top_info">
                <!-- [D] chart_name는 최대 40자 까지만 노출 -->
                <p class="chart_name">
                  {{chartData.leftChartName}}
                  <a @click.prevent="toggleRightPanel" class="btn_ico_help">
                    <span class="blind">help</span>
                  </a>
                </p>
                <div class="chart_elapsed" v-for="(value, key) in objectInfo.initialFilter" v-if="value.use" :key="`active-${key}`" style="margin-left:10px;white-space:normal;">
                  <span class="criteria">{{key}}</span>
                  <initial-filter
                    :type="key"
                    :initialFilterList="value.list"
                    :changeInitialFilter="changeInitialFilter"
                    :initialFilterObj="initialFilterObj"
                    :isCompleteLoad="isCompleteLoad"
                  ></initial-filter>
                </div>
              </div>
              <loading-bar
                :isShowLoading="isCompleteLoad"
                style="min-height: 350px !important;"
              ></loading-bar>
              <div class="chart_middle_gride" v-if="isCompleteLoad && !isNoData">
                <div class="inner_chart_area">
                  <highcharts :options="options" ref="highcharts"></highcharts>
                </div>
              </div>
              <div class="chart_middle_gride no_data" style="display:block" v-if="isNoData">
                  <div class="inner_chart_area">
                      <span class="ico_nodata"><span class="blind">데이터 없음</span></span>
                      <p style="margin-bottom:0px" v-if="!isErrorFromPresto">
                          {{dataBySelectedLang.analytics_object_msg_nodata}}
                      </p>
                      <p v-else>
                        {{ prestoErrorMessage[_me['language'] || 'kr'] }}
                      </p>
                  </div>
              </div>
            </div>
            <div class="chart_bottom_kpi" v-if="isCompleteLoad">
              <span class="set_info">Selected KPI</span>
              <div class="set_item_group">
                <ul>
                  <!-- [D] 선택 상태일 경우 a에 on 클래스 추가 필요 -->
                  <li v-for="(kpi, key) in kpis" :key="key">
                    <a
                      class="set_item"
                      :class="{on: kpi.used}"
                      @click="isOnlyPieChart ? changeKpi(kpi, kpis) : toggleKpi(kpi, kpis)"
                      style="margin-left: 5px;"
                    >{{kpi.name}}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <!-- [D] View Grid 클릭 후 하단 차트 open시 folid_title_area에 open 클래스 추가 필요-->
      <!-- [D] open 적용시  btn_folid 텍슽 변경 필요 (View Grid <-> Hide Grid)-->
      <div class="grid-wrapper">
        <div class="folid_title_area" v-if="_initReportData.reportTemplateType === 'TE02'">
          <a @click="toggleGrid" class="btn_folid" v-if="!isOpenGrid">
            <span>View Grid</span>
          </a>
          <a @click="toggleGrid" class="btn_folid" v-if="isOpenGrid">
            <span>Hide Grid</span>
          </a>
          <a class="btn_go_report" v-if="relatedReportId > -1" @click="goToRelativeReport(relatedReportId)">
            <span>Go to Related Report</span>
          </a>
        </div>
        <!-- [D] 차트 open시 display:block 로 변경 필요 -->
        <!--  table_grid -->
        <div
          class="grid_area pivot-wrapper"
          style="display:block"
          v-if="_initReportData.reportTemplateType === 'TE02' && isOpenGrid"
        >
          <!-- <div class="grid_title">
            <p>Retention Table Name</p>
          </div> -->
          <pivot-header-controller
            :totalRecords="totalRecords"
            :filters="filters"
            :showType="'grid'"
            :toggleRightPannel="() => {}"
            :goToFullScreen="() => {}"
            :goToTableTop="goToTableTop"
            :objectInfo="objectInfo"
            :pivotSettingData="chartInfoObj"
            :resetTablesTooltip="resetTablesTooltip"
            :loadInitObjectData="loadInitObjectData"
            :objType="objType"
          ></pivot-header-controller>
          <!-- fixed_table -->
          <new-pivot-table
            :isNoData="isGridNoData"
            :pivotData="gridData"
            :setTotalCnt="setTotalCnt"
            :setGoToTableTop="setGoToTableTop"
            :initPivotFlag="initPivotFlag"
            :isGoToTableTop="isGoToTableTop"
            :pivotIdx="pivotIdx"
            :changePivotData="changeGridData"
            :isResetPopupContent="isResetPopupContent"
            :isErrorFromPresto="isErrorFromPresto"
          ></new-pivot-table>
          <!-- //fixed_table -->
        </div>
        <!--  //table_grid -->
      </div>
    </div>
  </div>
</template>
<script>
import Highcharts from "highcharts"
import { genComponent } from "vue-highcharts"
import * as types from "@/shared/stores/types"
import { mapState } from "vuex"
import { util } from "@/shared/utils/util"
import _ from "lodash"
import moment from "moment"
import LoadingBar from "../../../common/LoadingBar"
import InitialFilter from "../../common/InitialFilter"
import NewPivotTable from '../../common/NewPivotTable'
import PivotHeaderController from "../../common/PivotHeaderController"

export default {
  name: "ChartPannel",
  components: {
    Highcharts: genComponent("Highcharts", Highcharts),
    LoadingBar,
    InitialFilter,
    NewPivotTable,
    PivotHeaderController
  },
  props: {
    objectInfo: Object,
    byDimension: String,
    objType: String,
    saveLastReportSetting: Function,
    alreadySetFilters: Object,
    settings: Object,
    currentDates: Array,
    pivotIdx: Number,
    basicBackupCommonCondition: Object
  },
  watch: {
    kpiExpression(d) {
      this.kpis = []
      _.forEach(d, (val, key) => {
        if (
          this.kpis.filter(o => {
            return o.name === val.alias
          }).length === 0
        ) {
          let prevUsed = null
          _.map(this.prevKpis, kpi => {
            if (kpi.name === val.alias) {
              prevUsed = kpi.used
            }
          })
          this.kpis.push({
            name: val.alias,
            used: (!this.isOnlyPieChart && prevUsed !== null) ? prevUsed : !val.defaultHide && val.used
          })
        }
        val.type = this.getChartTypeInfo(val.chartCode)
        this.chartType = val.chartCode
      })
      this.isChangingKpi = false
    },
    kpis: {
      handler (d) {
        this.prevKpis = _.cloneDeep(this.kpis)
      },
      deep: true
    },
    chartData: {
      handler(d) {
        let currencyUnit = this.getCurrencyUnit(this._me.currency ? this._me.currency : util.getLanguageAndCurrency().currency)
        this.chartLegends = _.map(this.chartLegends, o => {
          return o.replace(/\((￦|￥|\$)\)/, currencyUnit)
        })
        _.forEach(this.prevKpis, o => {
          o.name = o.name.replace(/\((￦|￥|\$)\)/, currencyUnit)
        })
        this.kpiExpression = this.replaceCurrencyString(d.kpiExpression, currencyUnit)
        if (this.isUpdate && !_.isEmpty(this.kpiExpression)) {
          d.kpiExpression = _.cloneDeep(this.kpiExpression)
        }
        this.isUpdate = false
        this.kpiExpression = d.kpiExpression
        this.setHiddenInitilFilterObj()
        if (!_.isEmpty(this.objectInfo.initialFilter)) {
          this.makeChartWithInitialFilter()
        } else {
          this.makeChart(d)
        }
      },
      deep: true
    },
    _isCompleteChartLoad(d) {
      this.$forceUpdate()
    },
    _isTransitionEnd (d) {
      if (this.$refs.highcharts && this.$refs.highcharts.chart) {
        this.$refs.highcharts.chart.reflow()
      }
    },
    _me(d) {
      this.initObject(this.backupCommonCondition)
    },
    initialFilterArr () {
      if(!_.isEmpty(this.chartData)) {
        this.chartLegends = []
        this.makeChartWithInitialFilter()
      }
    }
  },
  data() {
    return {
      kpis: [],
      prevKpis: [],
      chartLegends: [],
      options: {},
      chartType: "",
      isErrorFromPresto: false,
      isResetPopupContent: false,
      initPivotFlag: false,
      isShowLoading: true,
      isNoData: false,
      isShowElapsedDayList: false,
      isCompleteLoad: false,
      isOpenGrid: false,
      isGoToTableTop: false,
      isOnlyPieChart: false,
      isGridNoData: false,
      isChangingKpi: false,
      isUpdate: false,
      defaultHideList: [],
      relatedReportId: -1,
      selectedElapsedDay: "",
      filters: '',
      totalRecords: "0",
      gridData: {},
      chartData: {},
      kpiExpression: {},
      startDate: '',
      endDate: '',
      pieLegendCount: -1,
      pieLegendInitialCount: -1,
      chartInfoObj: {
        byDimension: "",
        endDate: moment("2019-02-10").format("YYYYMMDD"),
        filter: {},
        merged: true,
        objectId: 0,
        projectId: "string",
        reportId: 0,
        settings: {},
        startDate: moment("2019-01-01").format("YYYYMMDD")
      },
      backupChartData: {},
      backupCommonCondition: {},
      defaultChartType: {
        chart: {
          height: ''
        },
        title: {
          text: ""
        },
        xAxis: {
          categories: []
        },
        yAxis: [
          {
            title: {
              text: "",
              style: {
                color: Highcharts.getOptions().colors[1]
              }
            }
          },
          {
            // Secondary yAxis
            title: {
              text: "",
              style: {
                color: Highcharts.getOptions().colors[0]
              }
            },
            opposite: true
          }
        ],
        legend: {
          padding: 5,
          margin: 10,
          maxHeight: 65,
          symbolHeight: 10
        },
        colors: [
          "#6FC765",
          "#52AFFF",
          "#BE62E7",
          "#F093B4",
          "#FAA466",
          "#A8DA6A",
          "#76D8E5",
          "#F46C7C",
          "#CD9059",
          "#FCC949"
        ],
        series: []
      },
      initialFilterObj: {},
      initialFilterArr: [],
      clickedHiddenLegends: [],
      hiddenInitialFilterObj: {},
      selectedInitialFilterObj: {}
    }
  },
  computed: {
    ...mapState({
      _projectInfo: state => state.project._projectInfo,
      _menuList: state => state.menu._menuList,
      _lineChartDataType: state => state.chart._lineChartDataType,
      _stackColumnDataType: state => state.chart._stackColumnDataType,
      _areaDataType: state => state.chart._areaDataType,
      _chartData: state => state.report._chartData,
      leftTitle: state => state.report._chartData.leftTitle,
      dataList: state => state.report._chartData.chartDataList.dataList,
      xAxisList: state => state.report._chartData.chartDataList.xAxisList,
      chartList: state => state.report._chartData.chartList,
      chartDataList: state => state.report._chartData.chartDataList,
      _isCompleteChartLoad: state => state.report._isCompleteChartLoad,
      _initReportData: state => state.report._initReportData,
      _defaultChartType: state => state.chart._defaultChartType,
      _currentDates: state => state.report._currentDates,
      dataBySelectedLang: state => state.common._lang.dataBySelectedLang,
      _isTransitionEnd: state => state.menu.isTransitionEnd,
      _me: state => state.common._me,
      prestoErrorMessage: state => state.common.prestoErrorMessage
    }),
    _() {
      return _
    }
  },
  methods: {
    resetPopupComponent () {
      this.isResetPopupContent = !this.isResetPopupContent
    },
    getCurrencyUnit (currency) {
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
    replaceCurrencyString (target, currencyUnit) {
      return JSON.parse(JSON.stringify(target).replace(/\((￦|￥|\$)\)/, currencyUnit))
    },
    changeGridData (gridData) {
      this.gridData = gridData
    },
    makeChart(d) {
      let chartTypes = []
      let pieChartDatas = []
      let otherChartOptions = []
      let pieChartOptions = []
      let chartOptions = {}
      this.backupChartData = _.cloneDeep(d)
      this.kpiExpression = d.kpiExpression
      if (this._initReportData.reportTemplateType === 'TE02') {
        this.gridData = this.chartData.gridData
        this.isGridNoData = _.isEmpty(this.gridData) || this.gridData.dataList.length === 0
      }
      chartTypes = this.getChartTypes(d)

    if (this.chartLegends.length === 0) {
      _.map(d.chartDataList, data => {
        _.map(d.kpiExpression, (val, key) => {
          if (this.checkLegendNameIncludesKpi(data.kpi.aliasDisplayName, val.alias) && val.defaultHide === false) {
            this.chartLegends.push(data.kpi.aliasDisplayName)
          }
        })
      })
      this.chartLegends = _.uniq(this.chartLegends)
    }
      this.pieLegendInitialCount = d.xAxisList ? d.xAxisList.length : null
      this.pieLegendCount = this.pieLegendInitialCount

      chartOptions = this.makeChartOptions(chartTypes, d)
      pieChartOptions = chartOptions.pieChartOptions
      otherChartOptions = chartOptions.otherChartOptions

      if (pieChartOptions.length > 0) {
        pieChartDatas = _.map(chartOptions, chartOption => {
          return chartOption.chartType === 'pie'
        })
        pieChartDatas = _.map(pieChartDatas, pieData => {
          return pieData.chartDataList
        })
        pieChartOptions[0].chartDataList = pieChartDatas
        pieChartOptions[0].kpiExpression = _.map(pieChartOptions[0].kpiExpression, u => {
          return u.chartCode === 'CHART05'
        })
        otherChartOptions.push(pieChartOptions[0])
      }

      this.$store.commit(types.INIT_COLOR_CNT)
      Promise.all(otherChartOptions).then(res => {
        this.options = this.makeHighChartOptions(res, d)
        const seriesList = this.options.series
        this.isCompleteLoad = true
        this.isNoData = seriesList.length === 0
      }).catch(err => {
        this.isCompleteLoad = true
        this.isNoData = true
      })
    },
    setGoToTableTop () {
      this.isGoToTableTop = false
    },
    getChartTypes (chartData) {
      let chartTypes = []
      _.map(chartData.kpiExpression, (u, key) => {
        if (u.used) {
          if (u.chartCode === 'CHART05') {
            if (!u.defaultHide) {
              chartTypes.push({
                chartCode: u.chartCode,
                kpi: key,
                isUseAxis: u.axisUsed
              })
            }
          } else {
            if (u.defaultHide) {
              this.defaultHideList.push(key)
            }
            chartTypes.push({
              chartCode: u.chartCode,
              kpi: key,
              isUseAxis: u.axisUsed
            })
          }
        }
      })
      return chartTypes
    },
    makeChartOptions (chartTypes, chartData) {
      let chartOptions = []
      let otherChartOptions = []
      let pieChartOptions = []

      this.isOnlyPieChart = false

      this.isOnlyPieChart = chartTypes.filter(o => {
        return o.chartCode === 'CHART05'
      }).length === chartTypes.length

      _.map(chartTypes, (type, i) => {
        let chartObj = _.cloneDeep(chartData)
        chartObj.chartDataList = chartObj.chartDataList.filter(chart => {
          return chart.kpi.kpiName === type.kpi
        })
        _.forEach(chartObj.chartDataList, chartData => {
          if (chartObj.kpiExpression[chartData.kpi.kpiName].axisUsed) {
            chartData.yAxis = 1
          }
        })
        chartObj.chartType = this.getChartTypeInfo(type.chartCode)
        if (this.isOnlyPieChart) {
          chartObj.maxLength = chartTypes.length
        }
        chartOptions.push(
          this.getChartOptions(
            type.chartCode,
            chartObj,
            this.getChartTypeInfo(type.chartCode),
            i,
            false,
            chartTypes.length
          )
        )
      })
      otherChartOptions = chartOptions.filter(chart => {
        return chart.chartType !== 'pie'
      })
      pieChartOptions = chartOptions.filter(chart => {
        return chart.chartType === 'pie'
      })
      return {otherChartOptions, pieChartOptions}
    },
    makeHighChartOptions (response, chartData) {
      let seriesList = []
      let defaultChartOptions = _.cloneDeep(this.defaultChartType)
      let hideKpiList = this.kpis.filter(kpi => !kpi.used).map(kpi => kpi.name)
      _.map(response, o => {
        seriesList = [...seriesList, ...o.series]
      })
      _.map(seriesList, (v, i) => {
        v.visible = true
        if (v.name) {
          let nameArr = v.name.split('|')
          _.map(hideKpiList, (o) => {
            if(nameArr.indexOf(o) > -1){
              v.visible = false
            }
          })
        }
        if (this.clickedHiddenLegends.indexOf(i) > -1) {
          v.visible = false
          this.chartLegends = _.filter(this.chartLegends, o => {
            return o !== v.name
          })
        }
      })
      defaultChartOptions.series = seriesList
      defaultChartOptions.yAxis[0].title.text = chartData.leftAxisName
      defaultChartOptions.yAxis[1].title.text = chartData.rightAxisName
      defaultChartOptions.xAxis.categories = chartData.xAxisList
      defaultChartOptions.credits = { enabled: false }
      defaultChartOptions.chart.height = document.getElementsByClassName('inner_chart_area')[0].offsetHeight

      if (response.length > 0) {
        defaultChartOptions.plotOptions = response[0].plotOptions

        // Here, 'this' is chart option object and 'that' is vue component
        const that = this
        if (response[0] && response[0].chart.type === 'pie') {
          defaultChartOptions.plotOptions.pie.point = {
            events: {
              legendItemClick: function (e) {
                if (this.visible && that.pieLegendCount === 1) {
                  util.toastr().error(that.dataBySelectedLang.analytics_error_msg_notselectkpi)
                  return false
                }
                if (this.visible) {
                  that.pieLegendCount--
                } else {
                  that.pieLegendCount++
                }
              }
            }
          }
        } else {
          defaultChartOptions.plotOptions.series.events = {
            legendItemClick(e) {
              const targetIdx = e.target.index
              if (this.visible && that.chartLegends.length === 1) {
                util.toastr().error(that.dataBySelectedLang.analytics_error_msg_notselectkpi)
                return false
              }
              let kpiName
              _.map(this.name.split('|'), s => {
                _.map(that.kpis, kpi => {
                  if (kpi.name === s) {
                    kpiName = s
                  }
                })
              })
              if (this.visible) {
                that.clickedHiddenLegends.push(targetIdx)
                _.pull(that.chartLegends, this.name)
                if (_.filter(that.chartLegends, legend => that.checkLegendNameIncludesKpi(legend, kpiName)).length === 0) {
                  _.map(that.kpis, kpi => {
                    if (_.eq(kpi.name, kpiName)) {
                      kpi.used = false
                    }
                  })
                }
              } else {
                that.clickedHiddenLegends.splice(that.clickedHiddenLegends.indexOf(targetIdx), 1)
                that.chartLegends.push(this.name)
                _.map(that.kpis, kpi => {
                  if (_.eq(kpi.name, kpiName)) {
                    kpi.used = true
                  }
                })
              }
            }
          }
        }
      }
      return defaultChartOptions
    },
    goToTableTop () {
      this.isGoToTableTop = !this.isGoToTableTop
    },
    resetTablesTooltip () {
      _.forEach(this.$children, component => {
        if (component.hideToolTip) {
          component.hideToolTip()
        }
      })
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
      this.initPivotFlag = !this.initPivotFlag
    },
    updateChartType (type) {
      let chartType = type
      let chartInfo = _.cloneDeep(this.chartData)
      _.map(chartInfo.kpiExpression, (kpi, key) => {
        kpi.chartCode = chartType
      })
      this.$store.commit(types.UPDATE_CHART_DATA, chartInfo)
    },
    setTotalCnt (cnt) {
      this.totalRecords = cnt + ""
    },
    toggleGrid () {
      this.isOpenGrid = !this.isOpenGrid
    },
    toggleRightPanel () {
      this.$store.commit(types.TOGGLE_RIGHT_PANEL)
      this.$store.commit(types.CHECK_RIGHT_PANNEL, "about_chart")
      this.$store.commit(types.RIGHT_PANNEL_OBJECT_ID, { objectId: this.chartInfoObj.objectId, isLeft: true })
    },
    updateObject (commonCondition) {
      const dateType = this._initReportData.dataHandlerType.dateType
      let condition = commonCondition || this.basicBackupCommonCondition
      this.backupCommonCondition = commonCondition || {}
      this.isCompleteLoad = false
      this.isNoData = false
      this.isUpdate = true

      this.chartInfoObj.byDimension = this.byDimension
      this.chartInfoObj.objectId = this.objectInfo.id
      this.chartInfoObj.reportId = this.objectInfo.reportId
      this.chartInfoObj.projectId = window.localStorage.setProjectId
      this.chartInfoObj.startDate = dateType === 'DA05' ? moment(this.currentDates[0]).format('YYYYMMDD HHmm') : this.currentDates[0]
      this.chartInfoObj.endDate = dateType === 'DA05' ? moment(this.currentDates[1]).format('YYYYMMDD HHmm') : this.currentDates[1]

      if (condition && !_.isEmpty(condition)) {
        this.chartInfoObj.filter = condition.filter
        this.chartInfoObj.startDate = dateType === 'DA05' ? moment(condition.startDate || this.chartInfoObj.startDate).format('YYYYMMDD HHmm') : condition.startDate || this.chartInfoObj.startDate
        this.chartInfoObj.endDate = dateType === 'DA05' ? moment(condition.endDate || this.chartInfoObj.endDate).format('YYYYMMDD HHmm') : condition.endDate || this.chartInfoObj.endDate
        this.chartInfoObj.settings = condition.settings || this.chartInfoObj.settings || {}
      }
      const isPreview = this.$route.path.indexOf('preview') > 0
      // save last report setting 설정이 되어있을 경우 모든 update 내용을 save
      Promise.all([
        this.$store.dispatch(types.UPDATE_CHART_DATA, {isPreview: isPreview, reqBody: this.chartInfoObj})
      ]).then(res => {
        this.chartData = _.cloneDeep(res[0])
        this.relatedReportId = this.chartData.relatedReportId
        this.isNoData = this.chartData.chartDataList.length === 0
        this.isCompleteLoad = true
        this.chartData.gridData.glossaryList = _.cloneDeep(this.chartData.glossaryList)

        if (this.chartData.gridData && !_.isEmpty(this.chartData.gridData)) {
          this.$store.commit(types.UPDATE_PIVOT_DATA, {
            pivotData: this.chartData.gridData,
            pivotIdx: this.pivotIdx
          })
        }
      }).catch(err => {
        this.isCompleteLoad = true
        this.isNoData = true
        if (err.response && err.response.data.code === 500500) {
          this.isErrorFromPresto = true
        } else {
          this.isErrorFromPresto = false
        }
      })
    },
    changeChartType (type) {
      this.updateChartType(type)
    },
    toggleElapsedDate() {
      this.isShowElapsedDayList = !this.isShowElapsedDayList
    },
    setElapsedDay (day) {
      this.selectedElapsedDay = day
      this.toggleElapsedDate()
    },
    toggleKpi (kpi, kpis) {
      let unUsedKpis = []
      kpi.used = !kpi.used
      if (!kpi.used) {
        unUsedKpis = kpis.filter(o => {
          return !o.used
        })
        if (unUsedKpis.length === kpis.length) {
          util.toastr().error(this.dataBySelectedLang.analytics_error_msg_notselectkpi)
          kpi.used = true
        } else {
          this.hideKpiAtChartData(kpi.name)
        }
      } else {
        this.showKpiAtChartData(kpi.name)
      }
    },
    hideKpiAtChartData (name) {
      if (this.$refs.highcharts) {
        _.map(this.$refs.highcharts.chart.series, series => {
          if (this.checkLegendNameIncludesKpi(series.name, name)) {
            series.hide()
            _.pull(this.chartLegends, series.name)
            !_.includes(this.clickedHiddenLegends, series.index) ? this.clickedHiddenLegends.push(series.index) : ''
          }
        })
      }
    },
    showKpiAtChartData (name) {
      if (this.$refs.highcharts) {
        _.map(this.$refs.highcharts.chart.series, series => {
          if (this.checkLegendNameIncludesKpi(series.name, name)) {
            series.show()
            _.pull(this.clickedHiddenLegends, series.index)
            if (this.chartLegends.indexOf(series.name) === -1) {
              this.chartLegends.push(series.name)
            }
          }
        })
      }
    },
    checkLegendNameIncludesKpi (legendName, kpiName) {
      const kpiOrder = _.filter(this.objectInfo.displayDimension, {dimensionName: 'KPI'})[0].order
      return legendName.split('|')[kpiOrder] === kpiName
    },
    changeKpi (kpi, kpis) {
      if (kpi.used) {
        util.toastr().error(this.dataBySelectedLang.analytics_error_msg_notselectkpi)
        return
      }

      _.map(kpis, k => {
        k.used = kpi.used
      })
      kpi.used = !kpi.used
      if (kpi.used) {
        _.map(kpis, k => {
          this.removeKpiAtChartData(k.name)
        })
        this.addKpiAtChartData(kpi.name)
      }
      this.pieLegendCount = this.pieLegendInitialCount
    },
    removeKpiAtChartData (name) {
      let chartInfo = _.cloneDeep(this.chartData)
      this.backupChartData = _.cloneDeep(this.chartData)
      _.forEach(chartInfo.kpiExpression, (value, key) => {
        if (value.alias === name) {
          value.defaultHide = true
        }
      })
      this.chartData = _.cloneDeep(chartInfo)
    },
    addKpiAtChartData (name) {
      let chartInfo = _.cloneDeep(this.chartData)
      _.forEach(chartInfo.kpiExpression, (value, key) => {
        if (value.alias === name) {
          value.defaultHide = false
        }
      })
      this.isChangingKpi = true
      this.chartData = _.cloneDeep(chartInfo)
    },
    changeInitialFilter (type, selectedFilter) {
        this.initialFilterArr = []
        this.initialFilterObj[type] = selectedFilter
        _.map(this.initialFilterObj, (value,index) => {
          this.initialFilterArr.push(value) //ex) ['App','NRU']
        })
        this.selectedInitialFilterObj[type] = []
        this.selectedInitialFilterObj[type].push(selectedFilter)
      },
    makeChartWithInitialFilter () {
      let chartInfo = _.cloneDeep(this.chartData)
      let tempChartDataList = []
      let nameValueObj = {}
      // make finalFilterObj by merging hiddenInitialFilterObj & selectedInitialFilterObj
      let finalFilterObj = {...this.hiddenInitialFilterObj, ...this.selectedInitialFilterObj}

      // nameValueObj know each index of each displayName
      _.map(finalFilterObj, (arr, name) => {
        _.map(this.objectInfo.displayDimension, (v,i) => {
          if (v.dimensionName === name) {
            nameValueObj[v.order] = name
          }
        })
      })

      // filter chartDataList with finalFilterObj
      _.map(chartInfo.chartDataList, data => {
        const displayNameArr = data.kpi.displayName.split('|')
        let boolArr = []
        _.map(nameValueObj, (v,i) => {
          boolArr.push(finalFilterObj[v].indexOf(displayNameArr[i]) === -1)
        })
        if(boolArr.indexOf(true) < 0){
          tempChartDataList.push(data)
        }
      })
      chartInfo.chartDataList = tempChartDataList
      this.makeChart(chartInfo)
    },
    goToRelativeReport (reportId) {
      let {depth, idx, menuId, parentMenuId} = util.findMenuWithReportId(this._menuList, reportId)
      let projectId = this._projectInfo.projectId
      if (depth === 2) {
        this.$router.replace({name: 'basic', params: {projectId}, query: { parentMenuId, menuId, threeDepth: '0', from: 'relatedReport' }})

      } else if (depth === 3) {
        this.$router.replace({name: 'basic', params: {projectId}, query: { parentMenuId, menuId, threeDepth: idx + '', from: 'relatedReport' }})
      }
    },
    getChartTypeInfo (chartType) {
      let type = ""
      switch (chartType) {
        case "CHART01":
          type = "line"
          break
        case "CHART02":
          type = "column"
          break
        case "CHART03":
          type = "stacked column"
          break
        case "CHART04":
          type = "area"
          break
        case "CHART05":
          type = "pie"
          break
        case "CHART06":
          type = "gauge"
          break
        case "CHART07":
          type = "bar"
          break
        case "CHART08":
          type = "stackedBar"
          break
      }
      return type
    },
    getChartOptions (chartType, _charAPIData, typeName, cnt, isSecond, chartLength) {
      if (chartType === "CHART01") {
        return this.$store.dispatch(types.MAKE_LINE_CHART, {
          chartData: _charAPIData,
          typeName,
          isSecond
        })
      } else if (chartType === "CHART02") {
        return this.$store.dispatch(types.MAKE_COLUMN_CHART, {
          chartData: _charAPIData,
          typeName,
          isSecond
        })
      } else if (chartType === "CHART03") {
        return this.$store.dispatch(types.MAKE_STACKED_COLUMN_CHART, {
          chartData: _charAPIData,
          typeName,
          isSecond
        })
      } else if (chartType === "CHART04") {
        return this.$store.dispatch(types.MAKE_AREA_CHART, {
          chartData: _charAPIData,
          typeName,
          isSecond
        })
      } else if (chartType === "CHART05") {
        return this.$store.dispatch(types.MAKE_PIE_CHART, {
          chartData: _charAPIData,
          typeName,
          cnt,
          isSecond,
          chartLength
        })
      } else if (chartType === "CHART06") {
        return this.$store.dispatch(types.MAKE_GAUGE_CHART, {
          chartData: _charAPIData,
          typeName,
          isSecond
        })
      } else if (chartType === "CHART07") {
        return this.$store.dispatch(types.MAKE_BAR_CHART, {
          chartData: _charAPIData,
          typeName,
          isSecond
        })
      } else {
        return this.$store.dispatch(types.MAKE_STACKED_BAR_CHART, {
          chartData: _charAPIData,
          typeName,
          isSecond
        })
      }
    },
    initObject (commonCondition) {
      let condition = {}
      if (!_.isEmpty(commonCondition)) {
        condition = commonCondition
      }
      if (!_.isEmpty(this.alreadySetFilters)) {
        condition.filter = this.alreadySetFilters
      }
      if (!_.isEmpty(condition)) {
        this.updateObject(condition)
      } else {
        this.updateObject()
      }
    },
    setHiddenInitilFilterObj () {
      let hiddenInitialFilterObj = {}
      _.map(this.objectInfo.initialFilter, (v,i) => {
        let arr = []
        if(!v.use) {
          // initialFilter가 off상태
          v.list.forEach(o => {
            arr.push(o.value)
          })
          hiddenInitialFilterObj[i] = arr
        }
      })
      this.hiddenInitialFilterObj = _.cloneDeep(hiddenInitialFilterObj)
    }
  },
  mounted() {
    let dateFormat = this.getDateFormat(this._initReportData.dataHandlerType.dateType)
    this.initObject()
  }
}
</script>
<style lang="scss" scoped>
.grid-wrapper {
  .grid_area {
    margin-top: 0 !important;
    box-shadow: none !important;
  }
}
</style>
