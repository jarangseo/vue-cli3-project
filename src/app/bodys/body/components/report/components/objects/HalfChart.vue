<template>
  <div class="chart_section">
    <loading-bar :isShowLoading="isChartReady" style="min-height: 500px !important;"></loading-bar>
    <div class="chart_info_area" v-if="isChartReady">
      <div class="chart_top_info">
        <!-- [D] chart_name는 최대 40자 까지만 노출 -->
        <p class="chart_name">
          {{ _halfChartData.chartName }}
          <a @click.prevent="toggleRightPanel" class="btn_ico_help">
            <span class="blind">help</span>
          </a>
        </p>
        <div class="chart_elapsed" v-for="(value, key) in initialFilterData" v-if="value.use" :key="`active-${key}`" style="margin-left:10px;white-space:normal;">
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
      <div class="chart_middle_gride" v-if="!isShowNoData">
        <div class="inner_chart_area">
          <!-- [D] 실제 chart 가 적용되는 영역(img tag 삭제 후 적용 부탁드립니다.) -->
          <!-- <img src="./img/@img_dummy_chart.png" width="100%" height="318" alt=""> -->
          <highcharts :options="chartOptions" ref="highcharts"></highcharts>
        </div>
      </div>
      <div class="chart_middle_gride no_data" style="display:block" v-if="isShowNoData">
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
    <div class="chart_bottom_kpi" v-if="!isShowNoData">
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
            >{{ kpi.name }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from "lodash"
  import { mapState } from 'vuex'
  import * as types from "@/shared/stores/types"
  import Highcharts from "highcharts"
  import { genComponent } from "vue-highcharts"
  import ElapsedDaySelector from "../../common/ElapsedDaySelector"
  import InitialFilter from "../../common/InitialFilter"
  import LoadingBar from "../../../common/LoadingBar"
  import { util } from "@/shared/utils/util"

  export default {
    name: 'HalfChart',
    components: {
      Highcharts: genComponent("Highcharts", Highcharts),
      ElapsedDaySelector,
      InitialFilter,
      LoadingBar
    },
    props: {
      _halfChartData: Object,
      objectInfo: Object,
      isSecond: Boolean,
      isDataLoadError: Boolean,
      isCompleteLoad: Boolean,
      initialFilterData: Object,
      displayDimension: Array,
      isErrorFromPresto: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        halfChartData: {},
        chartOptions: {},
        isChartReady: false,
        isShowNoData: false,
        isOnlyPieChart: false,
        isChangingKpi: false,
        isUpdate: false,
        objectId: -1,
        selectedElapsedDay: "",
        isShowElapsedDayList: false,
        kpiExpression: {},
        kpis: [],
        prevKpis: [],
        chartLegends: [],
        defaultHideList: [],
        pieLegendCount: -1,
        pieLegendInitialCount: -1,
        defaultChartType: {
          chart: {
            height: 300
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
    watch: {
      _halfChartData (d) {
        let currencyUnit = this.getCurrencyUnit(this._me.currency ? this._me.currency : util.getLanguageAndCurrency().currency)
        this.chartLegends = _.map(this.chartLegends, o => {
          return o.replace(/\((￦|￥|\$)\)/, currencyUnit)
        })
        _.forEach(this.prevKpis, o => {
          o.name = o.name.replace(/\((￦|￥|\$)\)/, currencyUnit)
        })
        this.kpiExpression = this.replaceCurrencyString(d.kpiExpression, currencyUnit)
        this.isUpdate = true
        this.halfChartData = _.cloneDeep(d)
      },
      isDataLoadError (d) {
        this.isChartReady = d
      },
      halfChartData: {
        handler (d) {
          if (this.isUpdate && !_.isEmpty(this.kpiExpression)) {
            d.kpiExpression = _.cloneDeep(this.kpiExpression)
          }
          this.isUpdate = false
          this.kpiExpression = d.kpiExpression
          this.setHiddenInitilFilterObj()
          if (!_.isEmpty(this.initialFilterData)) {
            this.makeChartWithInitialFilter()
          } else {
            this.makeChart(d)
          }
        },
        deep: true
      },
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
              used: (!this.isChangingKpi && prevUsed !== null) ? prevUsed : !val.defaultHide && val.used
            })
            val.type = this.getChartTypeInfo(val.chartCode)
          }
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
      _isTransitionEnd (d) {
      if (this.$refs.highcharts && this.$refs.highcharts.chart) {
          this.$refs.highcharts.chart.reflow()
        }
      },
      initialFilterArr (d) {
        if(!_.isEmpty(this.halfChartData)) {
          this.chartLegends = []
          this.makeChartWithInitialFilter()
        }
      }
    },
    computed: {
      ...mapState({
        _isTransitionEnd: state => state.menu.isTransitionEnd,
        _me: state => state.common._me,
        dataBySelectedLang: state => state.common._lang.dataBySelectedLang,
        prestoErrorMessage: state => state.common.prestoErrorMessage
      }),
      _() {
        return _
      }
    },
    methods: {
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
      setElapsedDay (day) {
        this.selectedElapsedDay = day
        this.toggleElapsedDate()
      },
      toggleElapsedDate () {
        this.isShowElapsedDayList = !this.isShowElapsedDayList
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
        const chartOptions = []
        const otherChartOptions = []
        const pieChartOptions = []

        _.map(chartTypes, (type, i) => {
          const chartObj = _.cloneDeep(chartData)
          chartObj.chartDataList = chartObj.chartDataList.filter(chart => {
            return chart.kpi.kpiName === type.kpi
          })
          _.forEach(chartObj.chartDataList, chartData => {
            if (chartObj.kpiExpression[chartData.kpi.kpiName] && chartObj.kpiExpression[chartData.kpi.kpiName].axisUsed) {
              chartData.yAxis = 1
            }
          })
          chartObj.chartType = this.getChartTypeInfo(type.chartCode)
          type.chartObj = chartObj
          chartOptions.push(
            this.getChartOptions(
              type.chartCode,
              chartObj,
              this.getChartTypeInfo(type.chartCode),
              false
            )
          )
        })
        _.map(chartTypes, (chart, idx) => {
          if (chart.chartCode !== 'CHART05') {
            otherChartOptions.push(chartOptions[idx])
          } else {
            pieChartOptions.push(chartOptions[idx])
          }
        })
        return {otherChartOptions, pieChartOptions}
      },
      makeChart (d) {
        let chartTypes = []
        let chartOptions = {}
        let pieChartDatas = []
        let otherChartOptions = []
        let pieChartOptions = []

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
        this.pieLegendInitialCount = d.xAxisList.length
        this.pieLegendCount = this.pieLegendInitialCount

        chartTypes = this.getChartTypes(d)
        chartOptions = this.makeChartOptions(chartTypes, d)
        otherChartOptions = chartOptions.otherChartOptions
        pieChartOptions = chartOptions.pieChartOptions

        this.isOnlyPieChart = chartTypes.filter(o => {
          return o.chartCode === 'CHART05'
        }).length === chartTypes.length

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
          this.chartOptions = this.makeHighChartOptions(res, d)
          const seriesList = this.chartOptions.series
          this.isChartReady = true
          this.isShowNoData = seriesList.length === 0
        })
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

        if (response.length > 0) {
          defaultChartOptions.plotOptions = response[0].plotOptions

          // Here, 'this' is chart option object and 'that' is vue component
          const that = this
          if (response[0] && response[0].chart.type === 'pie') {
            defaultChartOptions.plotOptions.pie.point = {
              events: {
                legendItemClick: function () {
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
        return _.cloneDeep(defaultChartOptions)
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
            type = "column"
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
      getChartOptions (chartType, _charAPIData, typeName, isSecond = false) {
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
            isSecond
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
        let chartInfo = _.cloneDeep(this.halfChartData)

        _.map(chartInfo.kpiExpression, (o, key) => {
          if (o.alias === name) {
            o.defaultHide = true
          }
        })
        this.halfChartData = chartInfo
      },
      addKpiAtChartData (name) {
        let chartInfo = _.cloneDeep(this.halfChartData)

        _.map(chartInfo.kpiExpression, (o, key) => {
          if (o.alias === name) {
            o.defaultHide = false
          }
        })
        this.isChangingKpi = true
        this.halfChartData = chartInfo
      },
      toggleRightPanel () {
        this.$emit('toggleRightPanel', !this.isSecond)
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
        if(this.$refs.highcharts){
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
        if(this.$refs.highcharts){
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
        let chartInfo = _.cloneDeep(this.halfChartData)
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
      setHiddenInitilFilterObj () {
        let hiddenInitialFilterObj = {}
        _.map(this.initialFilterData, (v,i) => {
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
    }
  }
</script>

<style scoped>

</style>
