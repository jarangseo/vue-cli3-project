<template>
  <div class="inner_chart_grid">
    <div class="chart_area triple">
      <ul>
        <li class="type_horizon">
          <div class="chart_section">
            <div class="chart_info_area type_revenue">
              <div class="chart_middle_gride">
                <ul>
                   <li v-for="(item, index) in activeApiList"
                    :key="`active-${index}`">
                    <basic-info-chart 
                      :data="_activeData.total[item]"
                      :name="item"
                      :direction="'horizon'" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </li>
        <li>
          <div class="chart_section">
            <div class="chart_info_area type_revenue">
              <div class="chart_top_info">
                <!-- [D] chart_name는 최대 18자 까지만 노출 -->
                <p class="chart_name">
                  <span>Access Count Details</span>
                  <a class="btn_ico_help" @click="mixinToggleAboutThisChart({ type: 'chart', data: activeCount.tooltip })"><span class="blind">help</span></a>
                </p>
              </div>
              <div class="chart_middle_gride type_low get_height_activeCount_area">
                <loading-bar 
                  :is-show-loading="!activeCount.isLoading" 
                  style="min-height: 250px !important;"/>
                <div class="inner_chart_area">
                  <div
                    v-if="!activeCount.isLoading && activeCount.options.series[0].data.length === 0"
                    :style="`height:${activeCount.height};text-align:center;line-height:${activeCount.height};`">
                    NoData
                  </div>
                  <!-- [D] 실제 chart 가 적용되는 영역(img tag 삭제 후 적용 부탁드립니다.) -->
                  <basic-highchart 
                    v-if="isActiveCountShow"
                    :options="activeCount.options"
                    :height="activeCount.height" />
                </div>
              </div>
            </div>
          </div>
        </li>
        <li>
          <div class="chart_section">
            <div class="chart_info_area type_revenue">
              <div class="chart_top_info">
                <!-- [D] chart_name는 최대 18자 까지만 노출 -->
                <p class="chart_name">
                  <span>Access Time Details</span>
                  <a class="btn_ico_help" @click="mixinToggleAboutThisChart({ type: 'chart', data: activeTime.tooltip })"><span class="blind">help</span></a>
                </p>
              </div>
              <div class="chart_middle_gride type_lowest get_height_activeTime_area">
                <loading-bar 
                  :is-show-loading="!activeTime.isLoading" 
                  style="min-height: auto !important;"/>
                <div class="inner_chart_area">
                  <div
                    v-if="!activeTime.isLoading && activeTime.options.series.length === 0"
                    :style="`height:${activeTime.height};text-align:center;line-height:${activeTime.height};`">
                    NoData
                  </div>
                  <!-- [D] 실제 chart 가 적용되는 영역(img tag 삭제 후 적용 부탁드립니다.) -->
                  <activity-gauge-chart
                    v-if="isActiveTimeShow"
                    :options="activeTime.options"
                    :height="'auto'"/>
                </div>
              </div>
              <div class="chart_more_view">
                <a class="more_link" @click="mixinMoreDetails(activeTime.name)">More Details</a>
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
  import { mapActions, mapState } from 'vuex'
  import BasicInfoChart from '../charts/BasicInfoChart'
  import BasicHighchart from '../charts/BasicHighchart'
  import ActivityGaugeChart from '../charts/ActivityGaugeChart'
  import Highcharts from 'highcharts'
  import LoadingBar from '@/app/bodys/body/components/common/LoadingBar'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'

  export default {
    name: 'ActiveTotalDataAndPerUserTypeArea',
    mixins: [ dashboardMixin ],
    props: {
      activeApiList: {
        type: Array,
        required: false,
        default: []
      }
    },
    components: {
      BasicInfoChart,
      BasicHighchart,
      ActivityGaugeChart,
      LoadingBar
    },
    watch: {
      _isOpenMenu (isOpen) {
        this.mixinResize({ name: this.activeCount.name, className: 'get_height_activeCount_area' })
        this.mixinResize({ name: this.activeTime.name, className: 'get_height_activeTime_area' })
      }
    },
    data () {
      return {
        activeCount: {
          name: 'activeCount',
          isLoading: true,
          height: '',
          tooltip: { chartName: '', dimension: [], kpi: [] },
          chartLength: -1,
          options: {
            chart: {
              type: 'bar',
              marginRight: 50
            },
            title: {
              text: ''
            },
            xAxis: {
            },
            yAxis: {
              min: 0,
              tickAmount: 12
              // breaks: [{
              //   from: 30000,
              //   to: 900000
              // }],
              // events: {
              //   pointBreak: function (e) {
              //       var point = e.point,
              //           brk = e.brk,
              //           shapeArgs = point.shapeArgs,
              //           x = shapeArgs.x,
              //           y = this.translate(brk.from, 0, 1, 0, 1),
              //           w = shapeArgs.width,
              //           key = ['brk', brk.from, brk.to],
              //           path = ['M', x, y, 'L', x + w * 0.25, y + 4, 'L', x + w * 0.75, y - 4, 'L', x + w, y];

              //       if (!point[key]) {
              //           point[key] = this.chart.renderer.path(path)
              //               .attr({
              //                   'stroke-width': 2,
              //                   stroke: point.series.options.borderColor
              //               })
              //               .add(point.graphic.parentGroup);
              //       } else {
              //           point[key].attr({
              //               d: path
              //           });
              //       }
              //   }
              // }
            },
            legend: '',
            tooltip: {
              valueSuffix: ' millions',
              formatter: function () {
                return `${_.upperCase(this.key.split('conncnt_v')[0])}: ${this.y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
              },
            },
            plotOptions: {
              series: {
                stacking: 'normal'
              },
              bar: {
                dataLabels: {
                  enabled: true,
                  crop: false,
                  inside: false,
                  overflow: 'none',
                  style: {
                    textOutline: undefined
                  },
                  formatter: function () {
                    const numberWithCommas = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    return ( this.y > 1000000000)
                      ? _.round(this.y / 1000000000, 2) + ' G'
                      : ( this.y > 1000000)
                        ? _.round(this.y / 1000000, 2) + ' M'
                        : numberWithCommas(this.y)
                    // if ( this.y > 1000000) {
                    //   return _.round(numberWithCommas(this.y) / 1000000, 2) + ' M'
                    // } else {
                    //   return numberWithCommas(this.y)
                    // }
                  }
                },
                pointWidth: 25,
                pointPadding: 0.1
              }
            },
            series: [{
              data: []
            }]
          }
        },
        activeTime: {
          name: 'activeTime',
          isLoading: true,
          height: '',
          tooltip: { chartName: '', dimension: [], kpi: [] },
          options: {
            chart: {
              type: 'solidgauge',
              height: '200px',
              marginTop: 0
            },
            title: {
              text: ''
            },
            yAxis: {
              min: 0,
              max: 100,
              lineWidth: 0,
              tickPositions: [],
            },
            legend: {
              colors: ['#6FC765', '#52AFFF', '#BE62E7', '#F093B4'],
              squareSymbol: true,
              layout: 'vertical',
              align: 'right',
              x: 0,
              verticalAlign: 'middle',
              y: 0,
              floating: true,
              backgroundColor:'#ffffff',
              borderColor: '',
              borderWidth: 0,
              shadow: false,
              reversed: false,
              itemMarginBottom: 10,
              labelFormatter: function () {
                const numberWithCommas = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                return _.upperCase(this.name.split('conntm_v')[0]) + ' <span style="fill:' + this.color + '">' + numberWithCommas(this.yData) + 'h</span>';
              }
            },
            tooltip: {
              formatter: function () {
                return `${_.upperCase(this.point.series.name.split('conntm_v')[0])}: ${this.y}h`
              },
            },
            plotOptions: {
              solidgauge: {
              }
            },
            series: []
          },
        }
      }
    },
    computed: {
      ...mapState({
        _activeData: state => state.dashboard._numberTypeData['active'],
        _apiReqObjIdList: state => state.dashboard._apiReqObjIdList
      }),
      isActiveCountShow () {
        return !this.activeCount.isLoading && this.activeCount.options.series[0].data.length > 0
      },
      isActiveTimeShow () {
        return !this.activeTime.isLoading && this.activeTime.options.series.length > 0
      }
    },
    created () {
      this.init()
    },
    mounted () {
      this.activeCount.height = `${document.getElementsByClassName('get_height_activeCount_area')[0].offsetHeight}px`
      this.activeTime.height = `${document.getElementsByClassName('get_height_activeTime_area')[0].offsetHeight}px`
    },
    methods: {
      ...mapActions([
        types.GET_CHART_DATA,
        types.MAKE_GROUP_BAR_CHART,
        types.MAKE_GAUGE_CHART
      ]),
      init () {
        this.initActiveTotal()
        this.initActiveSomethingPerUserType()
      },
      initActiveTotal () {
        // this._activeData.total = {}
        this.activeApiList.forEach( (item, index) => {
          this._activeData.total[item] = {}
        })
        this.getActiveTotalData()
      },
      initActiveSomethingPerUserType() {
        this.mixinGetTooltip({ areaName: 'activeCount'})
        this.mixinGetTooltip({ areaName: 'activeTime'})
        this.activeCount.options.series[0].data = []
        this.activeTime.options.series = []
        this.getActiveSomethingPerUserTypeChartData()
      },
      getActiveTotalData () {
        this[types.GET_BASIC_INFO_DATA]({
          req: this.mixinReq({objectId: this._apiReqObjIdList[2][2]}),
          route: 'active',
          type: 'total',
          currency: (this.me.currency === 'usd') ? '$' : (this.me.currency === 'jpy') ? '¥' : '₩'
        })
      },
      getActiveSomethingPerUserTypeChartData () {
        this.activeCount.options.series[0].data = []
        this.activeTime.options.series = []
          this.mixinGetChartData({
            req: this.mixinReq({objectId: this._apiReqObjIdList[2][3]}),
            actionsName: types.GET_CHART_DATA,
            routeName: 'activeCount'
          }).then((result) => {
            if (!_.isEmpty(result) && !_.isEmpty(result.data) && !_.isEmpty(result.data.chartDataList)){
              const apiResultArray = []
              const countApiResult = _.cloneDeep(result)
              const timeApiResult = _.cloneDeep(result)
              countApiResult.data.chartDataList = []
              timeApiResult.data.chartDataList = []
              _.cloneDeep(result.data.chartDataList).forEach( item => {
                if (item.kpi.kpiName.includes('conncnt')) {
                  countApiResult.data.chartDataList.push(item)
                } else if(item.kpi.kpiName.includes('conntm')) {
                  timeApiResult.data.chartDataList.push(item)
                }
              })
              this.getActiveCountPerTypeChart(countApiResult)
              this.getActiveTimePerTypeChart(timeApiResult)
            } else {
              this.activeCount.isLoading = false
              this.activeTime.isLoading = false
            }
          })
      },
      getActiveCountPerTypeChart (countApiResult) {
        this.mixinMakeChart({
          actionsName: types.MAKE_GROUP_BAR_CHART,
          actionsData: { chartData: countApiResult.data, typeName: null },
        }).then( chartData => {
          const tmp = _.merge(_.cloneDeep(this.activeCount.options), chartData)
          tmp.legend.enabled = false
          tmp.yAxis.title = null
          tmp.xAxis.categories = countApiResult.data.chartDataList.map(item => _.upperCase(item.kpi.kpiName.split('conncnt_v')[0]))
          tmp.plotOptions.bar.dataLabels.enabled = true
          this.activeCount.options = tmp
          // this.activeCount.options.series[0].data[0].y = 333305337400000
          // this.activeCount.options.series[0].data[1].y = 933305337400000
          // this.activeCount.options.series[0].data[2].y = 533305337400000
          // this.activeCount.options.series[0].data[3].y = 0
          this.activeCount.isLoading = false
        })
      },
      getActiveTimePerTypeChart (timeApiResult) {
        this.mixinMakeChart({
          actionsName: types.MAKE_GAUGE_CHART,
          actionsData: { chartData: timeApiResult.data, typeName: null },
        }).then( chartData => {
          const tmp = _.merge(_.cloneDeep(this.activeTime.options), chartData)
          tmp.legend.floating = false
          this.activeTime.options = tmp
          this.activeTime.options.plotOptions.solidgauge.events = this.mixinLegendItemClick({ that: this, name: 'activeTime' }).events
          this.activeTime.chartLength = this.activeTime.options.series.length
          this.activeTime.isLoading = false
        })
      },
      async windowResize () {
        this.activeCount.isLoading = await true
        this.activeCount.isLoading = await false
        this.activeTime.isLoading = await true
        this.activeTime.isLoading = await false
      }
    }
  }
</script>
