<template>
  <div class="inner_chart_grid">
    <div class="chart_area">
      <ul>
        <li>
          <div class="chart_section">
            <div class="chart_info_area type_revenue">
              <!-- [D] 차트네임 옆에 드롭박스 영역 추가시 type_inline 추가 필요 -->
              <div class="chart_top_info type_inline">
                <!-- [D] chart_name는 최대 45자 까지만 노출 -->
                <p class="chart_name">
                  <!-- <span v-tooltip.auto="'tooltip'">{{ `${isDaily ? 'Daily' : 'Monthly'} Trend` }}</span> -->
                  <span>{{ `${isDaily ? 'Daily' : 'Monthly'} Trend` }}</span>
                  <a class="btn_ico_help" @click="mixinToggleAboutThisChart({ type: 'chart', data: trend.tooltip })"><span class="blind">help</span></a>
                </p>
                <div class="chart_elapsed type_left">
                  <common-drop-list
                    v-if="isDaily"
                    :drop-list-option="trend.dropListOption"
                    @dropListLabel="changeDropListLabel"/>
                </div>
                <div
                  v-if="trend.selectedMenuName !== menuNameList[0]"
                  class="chart_elapsed">
                  <!-- [D] 아이콘이 아닌 문자형 버튼일 경우, btn_group에 text 클래스 추가 필요 -->
                  <common-button-group
                    v-if="!trend.isLoading"
                    :button-item-list="trend.chartButtonList"
                    @changeButtonItem="changeChartButtonItem"/>
                  <common-button-group
                    v-if="!trend.isLoading"
                    v-show="hasRevenue"
                    :button-item-list="trend.buttonList"
                    :selectButtonItem="trend.selectedBtnName"
                    @changeButtonItem="changeButtonItem"/>
                </div>
              </div>
              <div class="chart_main_tab">
                <ul>
                  <!-- [D] 메뉴 선택시 li에 on 추가 필요 -->
                  <li v-for=" (item, index) in menuNameList" :key="`menu-${index}`"
                    :class="{ on: trend.selectedMenuName === item }"> 
                    <a class="btn_menu" @click="selectMenu(item)">{{ item }}</a>
                  </li>
                </ul>
              </div>
              <div class="chart_middle_gride get_height_trend_chart_area" >
                <loading-bar 
                  :is-show-loading="!trend.isLoading" 
                  style="min-height: 250px !important;"/>
                <div
                  v-if="!trend.isLoading && trend.options.series[0].data.length === 0"
                  :style="`height:${trend.height};text-align:center;line-height:${trend.height};`">
                  NoData
                </div>
                <basic-highchart 
                  v-if="!trend.isLoading && trend.options.series[0].data.length > 0" 
                  :height="trend.height"
                  :options="trend.options"/>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import * as types from '@/shared/stores/types'
  import { mapActions, mapState, mapMutations } from 'vuex'
  import BasicHighchart from '../charts/BasicHighchart'
  import CommonDropList from '../common/CommonDropList'
  import CommonButtonGroup from '../common/CommonButtonGroup'
  import LoadingBar from '@/app/bodys/body/components/common/LoadingBar'
  import Highcharts from 'highcharts'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'
  import { util } from '@/shared/utils/util'
  import moment from 'moment'
  
  export default {
    name: 'TrendChartArea',
    mixins: [ dashboardMixin ],
    props: {
      menuNameList: {
        type: Array,
        required: true,
        default: () => {
          return ['Basic', 'Country', 'Platform', 'OS', 'User Access Type', 'User Purchase Type']
        }
      }
    },
    components: {
      BasicHighchart,
      CommonButtonGroup,
      CommonDropList,
      LoadingBar
    },
    watch: {
      _isOpenMenu (isOpen) {
        this.mixinResize({ name: 'trend', className: 'get_height_trend_chart_area' })
      }
    },
    data () {
      return {
        trend: {
          name: 'trend',
          isLoading: true,
          height: '',
          tooltip: { chartName: '', dimension: [], kpi: [] },
          chartLength: -1,
          chartButtonList: ['123', '%'],
          buttonList: [this.isDaily ? 'DAU' : 'MAU', 'Revenue'],
          selectedChartBtnName: '123',
          selectedBtnName: this.isDaily ? 'DAU' : 'MAU',
          selectedMenuName: this.menuNameList[0],
          selectedDropListIndex: 0,
          dropListLabel: null,
          dropListOption: [],
          dropListItemRange: [1, 3, 6],
          optionsPatch: {
            xAxis: {
              basic: {
                // min: 1,
                // tickInterval: 5, // one week
                // gridLineWidth: 1,
                // gridLineDashStyle: 'dash',
                plotLines: []
              }
            },
            yAxis: {
              basic: [
                { // Primary yAxis
                  labels: {
                    formatter: function () {
                      let label = this.axis.defaultLabelFormatter.call(this)
                      // Use thousands separator for four-digit numbers too
                      if (/^[0-9]{4}$/.test(label)) {
                          return Highcharts.numberFormat(this.value, 0)
                      }
                      return label;
                    },
                    style: {
                      color: Highcharts.getOptions().colors[1]
                    }
                  },
                  title: {
                    text: '',
                    style: {
                      color: Highcharts.getOptions().colors[1]
                    }
                  },
                }
              ],
              dual: [
                { // Primary yAxis
                  title: {
                    text: '',
                    style: {
                      color: Highcharts.getOptions().colors[1]
                    }
                  },
                  labels: {
                     formatter: function () {
                        let label = this.axis.defaultLabelFormatter.call(this)
                        // if (!['k', 'K', 'm', 'M'].includes(label)) {
                        //   const tmpNum = Number(this.value)
                        //   label = (tmpNum >= 1.0e+6) ? _.round(tmpNum / 1.0e+6, 2) : (tmpNum >= 1.0e+3) ? _.round(tmpNum / 1.0e+3, 1) : tmpNum
                        //   label += (tmpNum >= 1.0e+6) ? 'M' : (tmpNum > 1.0e+3) ? 'K' : ''
                        // }
                        // Use thousands separator for four-digit numbers too
                        if (/^[0-9]{4}$/.test(label)) {
                            return Highcharts.numberFormat(this.value, 0)
                        }
                        return label
                    },
                    style: {
                      color: Highcharts.getOptions().colors[1]
                    }
                  }
                },
                { // Secondary yAxis
                  opposite: true,
                  title: {
                    text: '',
                    style: {
                      color: Highcharts.getOptions().colors[1]
                    }
                  },
                  labels: {
                     formatter: function () {
                        let label = this.axis.defaultLabelFormatter.call(this)
                        // Use thousands separator for four-digit numbers too
                        if (/^[0-9]{4}$/.test(label)) {
                            return Highcharts.numberFormat(this.value, 0);
                        }
                        return label;
                    },
                    style: {
                      color: Highcharts.getOptions().colors[1]
                    }
                  }
                }
              ]
            },
            tooltip: {
              basic: {
                formatter: function () {
                  return _.reverse(this.points).reduce(function (s, point) {
                    return '<span style="fontWeight:bolder;">' + s  + '</span><br/>'
                            + _.upperCase(point.series.name.split('_')[0]).replace(/SALE/gi, 'Revenue')
                            + ': ' + (point.series.name.includes('sale') ? point.series.userOptions.currencyUnit : '') + point.y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }, '<b>' + this.x + '</b>');
                },
                shared: true
              },
              others: {
                formatter: function () {
                  const numberWithCommas = (value) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  return this.points.reduce(function (s, point) {
                    // console.log('point: ', point)
                    return  `<span>${s}</span><br/><br/>
                            <span style="color:${point.color};">${point.series.name.split('_')[0].split(',')[1]} :</span>
                            ${(point.series.name.includes('sale') ? point.series.userOptions.currencyUnit : '')}${numberWithCommas(point.y)} ${point.series.userOptions.rate != undefined ? `(${point.series.userOptions.rate[_.findIndex(point.series.xAxis.categories, item => item === point.x)]}%)` : ''}`
                  },
                  `<b> ${this.x}</b><br/>
                  <span>${this.points[0].point.series.yAxis.axisTitle.textStr}
                    Total: ${numberWithCommas(this.points[0].point.total)}
                  </span>`
                  // '<b>' + this.x + '</b><br/>' + `<b>${this.points[0].point.series.name.split('_')[0].split(',')[1]} Total: ${this.points[0].point.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>`
                  )
                },
                shared: true,
                outside: true
              },
            },
            legend: {
              basic: {
                enabled: true,
                layout: 'vertical',
                align: 'right',
                x: 0,
                verticalAlign: 'middle',
                floating: false,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '',
                borderWidth: 0,
                itemMarginBottom: 10,
                shadow: false,
                labelFormatter: function () {
                  return this.name.split(',')[1]
                }
              },
              standard: {
                labelFormatter: function () {
                  // console.log('this: ', this)
                  return this.name.includes('sale') ? 'Revenue' : _.upperCase(this.name)
                  // return this.name.split(',')[1]
                }
              }
            },
            plotOptions: {
              basic: {
                series: {
                  pointWidth: 20,
                  marker: {
                    fillColor: '#FFFFFF',
                    lineWidth: 1,
                    lineColor: null
                  }
                },
                line: {
                  // animation: false
                },
                column: {
                  stacking: 'normal',
                  // animation: false
                }
              }
            },
            plotLines: {
              color: '#dbdbdb',
              width: 1,
              value: '',
              dashStyle: 'dash'
            }
          },
          options: {
            chart: {
              type: 'line'
            },
            title: {
              text: ''
            },
            xAxis: {
              gridLineDashStyle: 'dash',
              min: 1,
              tickInterval: 5,
              gridLineWidth: 1,
              categories: [],
              grid: {
                enabled: true
              }
            },
            yAxis: {
              gridLineWidth: 1,
              min: 0,
              title: {
                text: '',
                style: {
                  color: Highcharts.getOptions().colors[1]
                }
              },
              stackLabels: {
                enabled: false,
                style: {
                  fontWeight: 'bold',
                  color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
              }
            },
            colors: ['#be62e7', '#52afff', '#6fc765'],
            series: [{
              data: []
            }]
          },
          apiResults: this.isDaily ? { 'DAU': {}, 'Revenue': {}} : { 'MAU': {}, 'Revenue': {}},
        }
      }
    },
    computed: {
      ...mapState({
        isDaily: state => state.dashboard.isDaily,
        hasRevenue: state => state.dashboard.hasRevenue,
        _apiReqObjIdList: state => state.dashboard._apiReqObjIdList,
        dataBySelectedLang: state => state.common._lang.dataBySelectedLang,
        _nowCallApiList: state => state.dashboard._nowCallApiList,
      })
    },
    created () {
      this.init()
    },
    mounted () {
      this.trend.height = `${document.getElementsByClassName('get_height_trend_chart_area')[0].offsetHeight}px`
      // this.trend.width = `${document.getElementsByClassName('get_height_trend_chart_area')[0].offsetWidth}px`
    },
    methods: {
      ...mapActions([
        types.MAKE_LINE_CHART,
        types.MAKE_COLUMN_CHART,
        types.GET_CHART_DATA
      ]),
      init() {
        this.initTrendChart()
      },
      initTrendChart () {
        this.mixinGetTooltip({ areaName: 'trend'})
        this.initCommonDropList()
        this.trend.isLoading = true
        this.trend.name = (this.isDaily ? 'Daily' : 'Monthly') + ' Trend',
        this.trend.selectedBtnName = this.isDaily ? 'DAU' : 'MAU',
        this.trend.buttonList = [this.isDaily ? 'DAU' : 'MAU', 'Revenue']
        this.trend.buttonList.forEach((item, index) => this.trend.optionsPatch.yAxis.dual[index].title.text = item)
        this.getTrendChartData()
        // this.trend.selectedMenuName ? this.getTrendChartData() : this.selectMenu(this.menuNameList[0])
      },
      initCommonDropList () {
        this.trend.dropListOption = this.trend.dropListItemRange.map( item => item + (this.isDaily ? 'Month' : 'Year'))
      },
      getTrendChartData () {
        this.trend.options.series = [{ data: [] }]
        this.mixinGetChartData({
          req: this.mixinReq({
            objectId: this.getApiId(),
            range: this.trend.dropListItemRange[this.trend.selectedDropListIndex],
          }),
          actionsName: types.GET_CHART_DATA,
        }).then((result) => {
          if (!_.isEmpty(result) && !_.isEmpty(result.data)) {
            if (this.trend.selectedMenuName === this.menuNameList[0]) {
              this.mixinMakeChart({
                actionsName: types.MAKE_LINE_CHART,
                actionsData: { chartData: result.data, typeName: null },
              }).then( (data) => {
                if (data && data.series.length > 0) {
                  if (!this.hasRevenue) {
                    data.series = _.remove(_.cloneDeep(data.series), item => {
                      return !item.name.includes('sale')
                    })
                    data.series[0].color = data.colors[0]
                  }
                  const tmpXaxis = _.cloneDeep(data.xAxis)
                  this.setPlotLines(tmpXaxis.categories)
                  data.xAxis = _.merge(_.cloneDeep(this.trend.optionsPatch.xAxis.basic), tmpXaxis)
                  data.title = { text: '' }
                  data.series[0].type = 'column'
                  data.series[0].yAxis = this.hasRevenue ? 1 : 0
                  if (data.series[1]) data.series[1].yAxis = 0
                  data.tooltip = _.cloneDeep(this.trend.optionsPatch.tooltip.basic)
                  data.legend.enabled = true
                  data.legend = this.trend.optionsPatch.legend.standard
                  data.plotOptions = _.cloneDeep(this.trend.optionsPatch.plotOptions.basic)
                  if (!this.hasRevenue) {
                    this.trend.optionsPatch.yAxis.basic[0].title.text = this.trend.selectedBtnName
                  }
                  // if (this.hasRevenue) data.yAxis = _.cloneDeep(this.trend.optionsPatch.yAxis.dual)
                  data.yAxis = _.cloneDeep(this.hasRevenue ? this.trend.optionsPatch.yAxis.dual : this.trend.optionsPatch.yAxis.basic)
                  this.trend.options = data
                  this.trend.chartLength = this.trend.options.series.length
                  this.trend.options.plotOptions.column = this.trend.options.series.length > 1 ? this.trendLegendItemClick() : this.mixinLegendItemClick({ that: this, name: 'trend' })
                  this.trend.options.plotOptions.line = this.trend.options.series.length > 1 ? this.trendLegendItemClick() : this.mixinLegendItemClick({ that: this, name: 'trend' })
                  this.trend.isLoading = false
                  // debugger
                }
              })
            } else {
              // else => BASIC이 아닌 메뉴 선택 시
              this.trend.buttonList.forEach((btnName, index) => {
                const copyApiResult = _.cloneDeep(result.data)
                const copyChartDataList = _.cloneDeep(copyApiResult.chartDataList)
                const editedChartDataList = copyChartDataList.filter( item => {
                  return item.kpi.kpiName.includes(!index ? 'au' : 'sale')
                })
                // 리스트에서 토탈값을 갖는 object 필터링 함.
                copyApiResult.chartDataList = editedChartDataList.filter( item => {
                  return !item.kpi.kpiName.includes('tot') && !item.kpi.kpiName.includes('rate')
                })
                // tooltip에서 사용할 토탈 데이터 값을 준비 함.
                try {
                  copyApiResult['totalData'] = editedChartDataList.filter( item => {
                    return item.kpi.kpiName.includes('tot')
                  })[0].dataList
                } catch (e) {
                  console.log(e.message)
                }
                try {
                  copyApiResult['rateData'] = []
                  editedChartDataList.filter( item => {
                    if (item.kpi.kpiName.includes('rate')) copyApiResult['rateData'].push(item.dataList)
                  }).dataList
                  // copyApiResult['rateData'] = editedChartDataList.filter( item => {
                  //   return item.kpi.kpiName.includes('rate')
                  // }).dataList
                } catch (e) {
                  console.log(e.message)
                }
                this.trend.apiResults[btnName] = copyApiResult
              })
              this.getTrendChartOption()
            }
            this.trend.isLoading = false
          } else {
            this.trend.isLoading = false
          }
        })
      },
      getChart () {
        this.trend.isLoading = true
        this.getTrendChartData()
      },
      selectMenu (menuName) {
        this.trend.selectedMenuName = menuName
        this.trend.selectedBtnName = this.trend.buttonList[0]
        this.trend.apiResults = this.isDaily ? { 'DAU': {}, 'Revenue': {}} : { 'MAU': {}, 'Revenue': {}}
        this.getChart()
      },
      changeDropListLabel (labelName, labelIndex) {
        this.trend.selectedDropListIndex = labelIndex
        const beforeDropListLabel = this.trend.dropListLabel
        this.trend.dropListLabel = labelName
        if (beforeDropListLabel) this.getChart()
      },
      async changeButtonItem (item) {
        if (this.trend.selectedBtnName !== item) {
          this.trend.isLoading = await true
          this.trend.selectedBtnName = item
          this.getTrendChartOption()
          this.trend.isLoading = await false
        }
      },
      getApiId () {
        return  this.trend.selectedMenuName === 'Basic' ? this._apiReqObjIdList[3][1] :
                this.trend.selectedMenuName === 'Country' ? this._apiReqObjIdList[3][2] :
                this.trend.selectedMenuName === 'Platform' ? this._apiReqObjIdList[3][3] :
                this.trend.selectedMenuName === 'OS' ? this._apiReqObjIdList[3][4] :
                this.trend.selectedMenuName === 'User Access Type' ? this._apiReqObjIdList[3][5] :
                this.trend.selectedMenuName === 'User Purchase Type' ? this._apiReqObjIdList[3][6] :
                console.log('해당 메뉴에 API ID가 존재 하지 않습니다. > 메뉴명: ', this.trend.selectedMenuName)
      },
      setPlotLines (categories) {
        this.trend.optionsPatch.xAxis.basic.plotLines = []
        categories.forEach((item, index) => {
          if (this.isDaily && moment(item, 'YYYYMMDD').day() === 0) { // 일요일: 0 / 일요일만 GRID 그림
            const plotLines = _.cloneDeep(this.trend.optionsPatch.plotLines)
            plotLines.value = index
            this.trend.optionsPatch.xAxis.basic.plotLines.push(plotLines)
          }
          if (!this.isDaily && moment(item, 'YYYYMM').month() === 0) { // 1월: 0 / 1월만 GRID 그림
            const plotLines = _.cloneDeep(this.trend.optionsPatch.plotLines)
            plotLines.value = index
            this.trend.optionsPatch.xAxis.basic.plotLines.push(plotLines)
          }
        })
      },
      getTrendChartOption () {
        const item = this.trend.apiResults[this.trend.selectedBtnName]
        if (!_.isEmpty(item)) {
          this.mixinMakeChart({
            actionsName: types.MAKE_COLUMN_CHART,
            actionsData: { chartData: item, typeName: 'DASHBOARD_OBJ_O3_SERIES' }
          }).then( (data) => {
            if (data && data.series.length > 0) {
              this.trend.optionsPatch.yAxis.basic[0].title.text = this.trend.selectedBtnName
              const tmpXaxis = _.cloneDeep(data.xAxis)
              this.setPlotLines(tmpXaxis.categories)
              data.xAxis = _.merge(_.cloneDeep(this.trend.optionsPatch.xAxis.basic), tmpXaxis)
              data.title = { text: '' }
              data.plotOptions.column = this.trend.selectedChartBtnName == this.trend.chartButtonList[0] ? { stacking: 'normal' } : { stacking: 'percent' }
              data.tooltip = this.trend.optionsPatch.tooltip.others
              data.legend = this.trend.optionsPatch.legend.basic
              data.yAxis = this.trend.optionsPatch.yAxis.basic
              this.trend.options = data
              this.trend.chartLength = this.trend.options.series.length
              this.trend.options.plotOptions.column = this.mixinLegendItemClick({ that: this, name: 'trend' })
              this.trend.options.plotOptions.column.stacking = 'normal'
              this.trend.isLoading = false
            }
          })
        }
      },
      changeChartButtonItem (chartName) {
        if (chartName && this.trend.selectedChartBtnName !== chartName) {
          this.trend.selectedChartBtnName = chartName
          const tmp = _.cloneDeep(this.trend.options)
          if (chartName === this.trend.chartButtonList[0]) {
            tmp.plotOptions.column.stacking = 'normal'
          } else if (chartName === this.trend.chartButtonList[1]) {
            tmp.plotOptions.column.stacking = 'percent'
          }
          this.trend.options = tmp
        }
      },
      trendLegendItemClick () {
        const that = this
        return {
          events: {
            legendItemClick: function (e) {
              console.log(`this.visible: ${this.visible}, this.trend.chartLength: ${that.trend.chartLength}`)
              if (this.visible && that.trend.chartLength === 1) {
                util.toastr().error(that.dataBySelectedLang.analytics_error_msg_notselectkpi)
                return false
              }
              this.visible ? that.trend.chartLength -- : that.trend.chartLength ++
            }
          }
        }
        // if (this.visible) {
        //   if (that[info.name].chartLength === 1) {
        //     util.toastr().error(that.dataBySelectedLang.analytics_error_msg_notselectkpi)
        //     return false
        //   } else {
        //     that[info.name].chartLength --
        //   }
        // } else {
        //   if (that[info.name].chartLengthMax > 0) {
        //     if (that[info.name].chartLengthMax === that[info.name].chartLength) return false
        //     else if (that[info.name].chartLengthMax < that[info.name].chartLength) that[info.name].chartLegth = that[info.name].chartLengthMax
        //     else if (that[info.name].chartLengthMax > that[info.name].chartLength) that[info.name].chartLength ++
        //   } else {
        //     that[info.name].chartLength ++
        //   }
        // }
      },
      async windowResize () {
        this.trend.isLoading = await true
        this.trend.isLoading = await false
      }
    }
  }
</script>

