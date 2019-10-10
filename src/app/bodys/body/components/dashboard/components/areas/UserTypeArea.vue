<template>
  <div class="inner_chart_grid">
    <div class="chart_area type_ratio">
      <ul>
        <!-- [D] li에 차트 width 330px인 경우 ratio_one, 680px인 경우 raio_two 클래스 추가해주세요 -->
        <li class="ratio_one">
          <div class="chart_section">
            <div class="chart_info_area type_revenue">
              <div class="chart_top_info">
                <!-- [D] chart_name는 최대 18자 까지만 노출 -->
                <p class="chart_name custom_chart_name">
                  <span>User Access Type (%)</span>
                  <a class="btn_ico_help" @click="mixinToggleAboutThisChart({ type: 'chart', data: userTypePercent.tooltip })"><span class="blind">help</span></a>
                </p>
              </div>
              <div class="chart_middle_gride type_lowest get_height_userTypePercent_area">
                <loading-bar 
                  :is-show-loading="!userTypePercent.isLoading" 
                  style="min-height: 250px !important;"/>
                <div class="inner_chart_area">
                  <div
                    v-if="!userTypePercent.isLoading && userTypePercent.options.series.length === 0"
                    :style="`height:${userTypePercent.height};text-align:center;line-height:${userTypePercent.height};`">
                    NoData
                  </div>
                  <!-- [D] 실제 chart 가 적용되는 영역(img tag 삭제 후 적용 부탁드립니다.) -->
                  <basic-highchart
                    v-if="isUserTypePercentShow"
                    :height="userTypePercent.height"
                    :options="userTypePercent.options"/>
                </div>
              </div>
              <div class="chart_more_view">
                <a class="more_link" @click="mixinMoreDetails(userTypePercent.name)">More Details</a>
              </div>
            </div>
          </div>
        </li>
        <li class="ratio_two type_horizon">
          <div class="chart_section">
            <div class="chart_info_area type_revenue">
              <div class="chart_top_info">
                <p class="chart_name">
                  <span>User Access Type</span>
                  <a class="btn_ico_help" @click="mixinToggleAboutThisChart({ type: 'chart', data: userTypeBasic.tooltip })"><span class="blind">help</span></a>
                </p>
              </div>
              <div class="chart_middle_gride">
                <ul>
                  <li v-for=" (item, index) in userTypeApiList" :key="`userTypeBasic_${index}`">
                    <basic-info-chart
                      v-if="_userTypeData[item]"
                      :data="_userTypeData[item]"
                      :name="item"
                      :chartType="'line'"
                      :direction="''"/>
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
  import * as types from '@/shared/stores/types'
  import { mapActions, mapState, mapMutations } from 'vuex'
  import BasicInfoChart from '../charts/BasicInfoChart'
  import BasicHighchart from '../charts/BasicHighchart'
  import Highcharts from 'highcharts'
  import LoadingBar from '@/app/bodys/body/components/common/LoadingBar'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'

  export default {
    name: 'UserTypeArea',
    mixins: [ dashboardMixin ],
    props: {
      userTypeApiList: {
        type: Array,
        required: false,
        default: []
      }
    },
    components: {
      BasicInfoChart,
      BasicHighchart,
      LoadingBar
    },
    watch: {
     _isOpenMenu (isOpen) {
        this.mixinResize({ name: 'userTypePercent', className: 'get_height_userTypePercent_area' })
      }
    },
    data () {
      return {
        userTypePercent: {
          name: 'userTypePercent',
          isLoading: true,
          height: '',
          tooltip: { chartName: '', dimension: [], kpi: [] },
          chartLength: -1,
          options: {
            chart: {
              type: 'column'
            },
            title: {
                text: null
            },
            xAxis: {
              visible: false,
              categories: []
            },
            yAxis: {
              visible: false
            },
            legend: {
              layout: 'vertical',
              align: 'right',
              x: 0,
              verticalAlign: 'middle',
              y: 0,
              floating: false,
              backgroundColor:'#ffffffff',
              borderColor: '',
              borderWidth: 0,
              shadow: false,
              reversed: false,
              itemMarginBottom: 15,
              labelFormatter: function () {
                // console.log('this: ', this)
                return this.name + ' <span style="fill:' + this.color + '">' + this.yData + '%</span>'
              }
            },
            // responsive: {
            //   rules: [{
            //     condition: {
            //       maxWidth: 320,
            //     },
            //     chartOptions: {
            //       legend: {
            //         align: 'left'
            //       }
            //     }
            //   }]
            // },
            tooltip: {
              formatter: function () {
                return  this.series.name + '<br/>'
                        + _.round(this.point.percentage, 2) + '% ' + this.point.series.userOptions.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              },
              shared: false
            },
            colors: ['#be62e7', '#52afff', '#6fc765'],
            plotOptions: {
              series: {
                pointWidth: 80
              },
              column: {
                stacking: 'percent'
              },
            },
            series: [
            ]
          }
        },
        userTypeBasic: {
          name: 'userTypeBasic',
          tooltip: { chartName: '', dimension: [], kpi: [] },
        }
      }
    },
    computed: {
      ...mapState({
        _userTypeData: state => state.dashboard._numberTypeData.userType,
        _apiReqObjIdList: state => state.dashboard._apiReqObjIdList
      }),
      isUserTypePercentShow () {
        return !this.userTypePercent.isLoading && this.userTypePercent.options.series.length > 0
      },
    },
    created () {
      this.init()
    },
    mounted () {
      this.userTypePercent.height = `${document.getElementsByClassName('get_height_userTypePercent_area')[0].offsetHeight}px`
    },
    methods: {
      ...mapActions([
        types.GET_CHART_DATA,
        types.MAKE_STACKED_PERCENTAGE_COLUMN_CHART
      ]),
      init () {
        this.initUserTypePercent()
        this.initUserType()
      },
      initUserTypePercent () {
        this.mixinGetTooltip({ areaName: 'userTypePercent'})
        this.userTypePercent.isLoading = true
        this.getUserTypePercentData()
      },
      initUserType () {
        this.mixinGetTooltip({ areaName: 'userTypeBasic'})
        this.userTypeApiList.forEach( item => {
          this._userTypeData[item] = {}
        })
        this.getUserTypeData()
      },
      getUserTypeData () {
        this.userTypeApiList.forEach( (item, index) => {
          this[types.GET_BASIC_INFO_DATA]({
            req: this.mixinReq({objectId: this._apiReqObjIdList[8][index + 2], range: 1}),
            route: 'userType',
            type: item,
          })
        })
      },
      getUserTypePercentData () {
        this.userTypePercent.options.series = []
        this.mixinGetChartData({
          req: this.mixinReq({objectId: this._apiReqObjIdList[8][1]}),
          actionsName: types.GET_CHART_DATA,
          routeName: 'userType'
        }).then((result) => {
          if (!_.isEmpty(result) && !_.isEmpty(result.data) && !_.isEmpty(result.data.chartDataList)){
            const chartValueData = []
            const chartRateData = []
            _.cloneDeep(result.data.chartDataList).forEach(item => {
              if (item.kpi.kpiName.includes('_rate')) {
                item.kpi.displayName = _.upperCase(_.cloneDeep(item.kpi.displayName).split('_')[0])
                item.kpi.aliasDisplayName = _.upperCase(_.cloneDeep(item.kpi.displayName).split('_')[0])
                chartRateData.push(item)
              } else {
                chartValueData.push(item)
              }
            })
            result.data.chartDataList = chartValueData
            result.data.chartDataRateList = chartRateData
            this.mixinMakeChart({
              actionsName: types.MAKE_STACKED_PERCENTAGE_COLUMN_CHART,
              actionsData: { chartData: result.data, typeName: null },
            }).then((data) => {
              this.userTypePercent.options = _.merge(_.cloneDeep(this.userTypePercent.options), data)
              this.userTypePercent.options.plotOptions.column = this.mixinLegendItemClick({ that: this, name: 'userTypePercent' })
              this.userTypePercent.options.plotOptions.column.stacking = 'percent'
              this.userTypePercent.chartLength = this.userTypePercent.options.series.length
              this.userTypePercent.isLoading = false
            })
          } else {
            this.userTypePercent.isLoading = false
          }
        })
      },
      async windowResize () {
        this.userTypePercent.isLoading = await true
        this.userTypePercent.isLoading = await false
      }
    }
  }
</script>
<style>
  .green { fill: #6fc765 !important; }
  .custom_chart_name { 
    height: 26px !important;
  }
</style>
