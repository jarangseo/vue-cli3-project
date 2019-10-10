<template>
  <div class="chart-wrapper" :ref="'chartWrapper'">
    <div class="chart_area">
      <ul>
        <li>
          <div class="chart_section">
            <loading-bar
              :isShowLoading="isLoading"
              style="min-height: 350px !important;"
            ></loading-bar>
            <div class="chart_info_area" v-if="isLoading">
              <div class="chart_top_info">
                <!-- [D] chart_name는 최대 40자 까지만 노출 -->
                <p class="chart_name">
                  {{_chartData.leftChartName}}
                  <a @click.prevent="toggleRightPanel" class="btn_ico_help">
                    <span class="blind">help</span>
                  </a>
                </p>

                <div class="chart_elapsed">
                  <span v-if="!_.isEmpty(objectInfo.initialFilter)" class="criteria">Elapsed Days</span>
                  <elapsed-day-selector
                    v-if="!_.isEmpty(objectInfo.initialFilter)"
                    :isShowDropDownList="isShowElapsedDayList"
                    :toggleElapsedDate="toggleElapsedDate"
                    :setElapsedDay="setElapsedDay"
                    :alreadySetElapsedDate="''"
                    :elipsedDateList="[]"
                  ></elapsed-day-selector>
                  <div class="btn_group" v-if="false">
                    <ul>
                      <!-- [D] 선택된 항목의 경우, a에 on 클래스 추가 필요 -->
                      <li>
                        <a
                          @click="changeChartType('CHART03')"
                          class="chart_type stick"
                          :class="{'on': chartType === 'CHART02' || chartType === 'CHART03'}"
                        >
                          <span class="blind">막대형 그래프</span>
                        </a>
                      </li>
                      <li>
                        <a
                          @click="changeChartType('CHART01')"
                          class="chart_type line"
                          :class="{'on': chartType === 'CHART01'}"
                        >
                          <span class="blind">선형 그래프</span>
                        </a>
                      </li>
                      <li>
                        <a
                          @click="changeChartType('CHART04')"
                          class="chart_type field"
                          :class="{'on': chartType === 'CHART04'}"
                        >
                          <span class="blind">영역형 그래프</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="chart_middle_gride">
                <div class="inner_chart_area">
                  <div class="nodata" v-if="isNoData">
                    <div class="nodata-text">No Data!</div>
                  </div>
                  <highcharts :options="options" v-else></highcharts>
                </div>
              </div>
            </div>
            <div class="chart_bottom_kpi" v-if="isLoading">
              <span class="set_info">Selected KPI</span>
              <div class="set_item_group">
                <ul>
                  <!-- [D] 선택 상태일 경우 a에 on 클래스 추가 필요 -->
                  <li v-for="(kpi, key) in kpis" :key="key">
                    <a
                      class="set_item"
                      :class="{on: kpi.used}"
                      @click="toggleKpi(kpi, kpis)"
                      style="margin-left: 5px;"
                    >{{kpi.name}}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import * as types from '@/shared/stores/types'
import Highcharts from "highcharts"
import { genComponent } from "vue-highcharts"
import { util } from '@/shared/utils/util'
import LoadingBar from "../../../common/LoadingBar"
import ElapsedDaySelector from "../../common/ElapsedDaySelector"
import moment from 'moment'
import _ from 'lodash'
export default {
  name: 'NewChart',
  components: {
    Highcharts: genComponent("Highcharts", Highcharts),
    LoadingBar,
    ElapsedDaySelector
  },
  watch: {
    _chartData: {
      handler (d) {
        _.forEach(d.kpiExpression, (val, key) => {
          if (
            this.kpis.filter(o => {
              return o.name === key
            }).length === 0
          ) {
            this.kpis.push({
              name: key,
              used: val.used
            })
          }
        })
        console.log('_chartData')
        this.initChartOption()
        this.setChartData('init', d)
        this.chartTypeMap = _.cloneDeep(d.chartList)
      },
      deep: true
    }
  },
  props: {
    objectInfo: Object,
    byDimension: String
  },
  data () {
    return {
      kpis: [],
      customOptions: {},
      chartTypeMap: [],
      chartKpiButtons: [],
      isLoading: false,
      isNoData: false,
      chartData: {},
      options: {},
      containerHeight: 420,
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
      }
    }
  },
  computed: {
    ...mapState({
      _lineChartDataType: state => state.chart._lineChartDataType,
      _stackColumnDataType: state => state.chart._stackColumnDataType,
      _areaDataType: state => state.chart._areaDataType,
      _chartData: state => state.report._chartData,
      leftTitle: state => state.report._chartData.leftTitle,
      kpiExpression: state => state.report._chartData.kpiExpression,
      dataList: state => state.report._chartData.chartDataList.dataList,
      xAxisList: state => state.report._chartData.chartDataList.xAxisList,
      chartList: state => state.report._chartData.chartList,
      chartDataList: state => state.report._chartData.chartDataList,
      _isCompleteChartLoad: state => state.report._isCompleteChartLoad,
      _initReportData: state => state.report._initReportData,
      _defaultChartType: state => state.chart._defaultChartType,
      _currentDates: state => state.report._currentDates,
      categoryColor: state => state.chart.categoryColor,
      chartLegendPaginationActiveColor: state => state.chart.chartLegendPaginationActiveColor,
      chartLegendPaginationInactiveColor: state => state.chart.chartLegendPaginationInactiveColor
    }),
    moment () {
      return moment
    },
    _ () {
      return _
    }
  },
  methods: {
    checkAllHideOrShow(chart) {
      let key=chart.options.kpiName
      let $kpiButton=this.$$el.find('.kpi-button').filter(`[value='${key}']`)
      let $checkboxGroup=this.$$el.find('.chart-legend-checkbox').filter(`[data-group='${key}']`)
      let status=$checkboxGroup.filter(":checked").length
      if(status){
        $kpiButton.removeClass('off')
      }else{
        $kpiButton.addClass('off')
        this.applyChartSetting()
      }
      this.config.config.kpiMap[key].hide=!status
      this.$$el.find('.chart-setting-info').trigger('render')
    },
    loadInitObjectData () {
      this.updateObject({
        filter: [],
        startDate: "20190101",
        endDate: "20190220"
      })
    },
    updateObject (commonCondition) {
      this.chartInfoObj.byDimension = this.byDimension
      this.chartInfoObj.objectId = this.objectInfo.id
      this.chartInfoObj.reportId = this.objectInfo.reportId
      this.chartInfoObj.projectId = window.localStorage.setProjectId
      if (commonCondition) {
        this.chartInfoObj.filter = commonCondition.filter
        this.chartInfoObj.startDate = this._currentDates[0]
        this.chartInfoObj.endDate = this._currentDates[1]
      }
      Promise.all([
        this.$store.dispatch(types.UPDATE_CHART_DATA, this.chartInfoObj)
      ]).then(res => {
        console.log(res)
        this.$store.commit(types.UPDATE_CHART_DATA, res[0])
      })
    },
    initChartOption () {
      this.customOptions = {
        chart: {
          width: this.$refs.chartWrapper.clientWidth,// container width
          renderTo: undefined,// container
          spacingBottom: 1
        },
        colors: this.categoryColor,
        tooltip: {
          useHTML: true,
          padding: 1
        },
        legend: {
          navigation: {
            activeColor: this.chartLegendPaginationActiveColor,
            inactiveColor: this.chartLegendPaginationInactiveColor,
            style: {
              fontWeight: 'normal',
              color: '#666',
              fontSize: '12px'
            }
          },
          itemDistance: -20,
          itemMarginTop: 5,
          useHTML: true,
          labelFormatter: (e) => {
            let html = ''
            let obj = this
            let uuClass = ''
            let visible = true
            let kpiName = ''
            let kpi = null
            let name = this.name
            if (this.series && this.series.options.type === 'pie') {
              obj = this.series
              let time = this.chartData.xAxis
              let index = this.index
              name = obj.name + ' ' + time.categories[index]
            }
            kpiName = obj.options.kpiName
            visible = this.visible
            uuClass = `${util.kpiTOClass(name)}-${this.index}`
            return html=`<span class="chart-legend-item chart-legend-item-${uuClass} mcheckbox chart-checkbox">
              <input data-group='${kpiName}' class="chart-legend-checkbox chart-legend-checkbox-${uuClass}" type="checkbox"  ${visible?'checked':''}>
              <i style="background-color:${this.color}"></i><span
              class="chart-legend-text chart-legend-text-${this.index}">${name}</span>
            </span>`
          }
        },
        plotOptions: {
          series: {
            events: {
              legendItemClick (e) {
                this.isLoding = true
                let legendItemObj = this
                setTimeout (() => {
                  let classNames=`.chart-legend-checkbox-${util.kpiTOClass(legendItemObj.name)}-${legendItemObj.index}`
                  that.checkAllHideOrShow(legendItemObj)
                  that.isLoading = true
                }, 0)
              }
            }
          }
        }
      }
    },
    getFilterInfo(customOpts={}, fromDataHandler=false) {
      return com.methods.getFilterInfo(this, customOpts, fromDataHandler);
    },
    customDataOptions(data) {
      // data.xAxis.labels = {
      //   style: {
      //     fontSize: '9px'
      //   }
      // }
    },
    setChartData (type, data, customOpts = {}) {
      let options = {}
      let params = null
      this.chartKpiButtons = []
      this.isLoading = true
      this.initButtons()
      this.setChartTickZero(data)
      this.customDataOptions(data)
      this.chartData = {...data, ...this.customOptions}
      this.applyChartSetting()
    },
    applyChartSetting(){
      this.isLoading = true
      this.$nextTick(() => {
        console.log('in nextTick')
        this.renderChart()
        this.isLoading = false
      })
    },
    initButtons() {
      let kpiMap = this._chartData.kpiExpression
      let keys = Object.keys(kpiMap)
      keys.forEach(item=>{
        this.chartKpiButtons.push(kpiMap[item])
      })
    },
    setChartTickZero(data) {
      let hasNegative = false
      for (let i = 0; i < data.chartDataList.length; i++) {
        for (let j = 0; j < data.chartDataList[i].dataList.length; j++) {
          if (!data.chartDataList[i].dataList[j]) {
            data.chartDataList[i].dataList[j] = 0
            break
          }
        }
      }
      for (let i = 0; i < data.chartDataList.length; i++) {
        for (let j = 0; j < data.chartDataList[i].dataList.length; j++) {
          if (data.chartDataList[i].dataList[j] < 0) {
            hasNegative = true
            break
          }
        }
        if (hasNegative) {
          break
        }
      }
      if (!hasNegative) {
        // data.yAxis.forEach(item => {
        //   item.min = 0
        // })
      }
    },
    margeLocalChartData() {
      let chartData = _.cloneDeep(this.chartData)
      let pieData = []
      let pieDataLegend = 1
      let height = this.containerHeight
      let setSortIndex = function(type,text){
        let index = 0
        if(type === 'line'||type === 'spline'){
          index = 50
        }else if(type === 'column'||type === 'bar'){
          index = 42
          switch (text){
            case 'column':
              index = 42
              break
            case 'stacked column':
              index = 41
              break
            case 'stacked Bar':
              index = 41
              break
            case 'stacked percentage column':
              index = 40
              break
          }
        }else if( type == 'area'){
          index = 30
          switch(text){
            case 'area':
              index = 34
              break
            case 'time series':
              index = 33
              break
            case 'stacked area':
              index = 32
              break
            case 'percentage area':
              index = 31
              break
          }
        }else if(type=='pie'){
          index = 20
        }
        return index
      }
      if (chartData.chartDataList) {
        chartData.chartDataList.forEach(item=>{
          let name = item.kpi.kpiName
          let kpi = this._chartData.kpiExpression[name]
          item.visible=!kpi.defaultHide
        })
        chartData.chartDataList = chartData.chartDataList.filter(item => item.visible)
        chartData.chartDataList.forEach((item,i) => {
          let name = item.kpi.displayKpiName
          let kpi = item.kpi.kpiName
          let kpiObj = this._chartData.kpiExpression[kpi]
          let chartCode = this._chartData.kpiExpression[kpi].chartCode
          let options = this.customChartTypeMappingToNormal(chartCode)
          let data = this.chartTypeMap.filter(o => {
            return o.code === chartCode
          })[0]
          let colorLength = this.categoryColor.length
          let colorIndex = i%colorLength
          item.type = data.codeType
          item.visible = true
          item.zIndex = setSortIndex(item.type,kpi.type)
          item.legendIndex = i
          item.color = this.categoryColor[colorIndex]

          if (kpiObj.chartCode.indexOf('percentage') !== -1){
            chartData.yAxis[item.yAxis].labels = {
              formatter: function() {
                return this.value+"%"
              }
              }
          }
          if(kpiObj.type=='time series'){
            options.fillColor.stops=[
              [0, item.color],
              [1, Highcharts.Color( item.color ).setOpacity(0).get('rgba')]
            ]
          }
          // $.extend(true,item,options)
          _.assignIn(true, item, options)
          item.showInLegend = !kpiObj.defaultHide
        })
        pieData=chartData.chartDataList.filter(item=>item.type=='pie')
        pieDataLegend=pieData.length
        pieData.forEach((item,i)=>{
          item.size=100-(i/pieDataLegend)*100+"%"
        })
      }
      return chartData
    },
    hideChartLegendSymbol(chart) {
      var series = chart.series;
      $(series).each(function(i, serie) {
        if (serie.legendSymbol) {
          serie.legendSymbol.hide()
        };
        if (serie.legendLine) {
          serie.legendLine.hide()
        };
      });
    },
    renderChart () {
      let chartData = {}
      if (!this.chartData.chartDataList || (this.chartData.chartDataList && this.chartData.chartDataList.length === 0)) {
        this.isNoData = true
      } else {
        this.chartData.chart.width = this.$refs.chartWrapper.clientWidth - 20
        chartData = this.margeLocalChartData()
        console.log(chartData)
      }
    },
    customChartTypeMappingToNormal (chartCode) {
      let options = {}
      switch(chartCode) {
        case 'CHART01':
          options = {
            tooltip: {
              split: false,
              headerFormat: null,
              pointFormat: null,
              tag:"line bar other",
              pointFormatter(){
                let formated = util.dataDisplayFormatter(this.series.options.kpi, this.y)
                let html = `<p style="line-height:22px;padding:0;margin:0;">${this.category}</p>
                  <span style="color:${this.color};"> \u25CF </span>
                  <span>${this.series.name} : </span>
                  <span style="font-weight:bold;">${formated}</span>`;
                return html;
              },
              shared: false,
            }
          }
          break
        case 'CHART02':
          break
        case 'CHART03':
          break
        case 'CHART04':
          break
        case 'CHART05':
          break
        case 'CHART07':
          break
        case 'CHART08':
          break
      }
      return options
    }
  },
  mounted() {
    this.updateObject()
  }
}
</script>
