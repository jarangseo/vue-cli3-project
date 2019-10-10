<template>
  <div class="inner_chart_grid">
    <div class="chart_area type_ratio">
      <ul>
        <!-- [D] li에 차트 width 330px인 경우 ratio_one, 680px인 경우 raio_two 클래스 추가해주세요 -->
        <li class="ratio_two type_horizon">
          <div class="chart_section">
            <div class="chart_info_area type_revenue">
              <div class="chart_top_info">
                <p class="chart_name">
                  <span>Revenue KPI</span>
                  <a class="btn_ico_help" @click="mixinToggleAboutThisChart({ type: 'chart', data: revenueKpi.tooltip })"><span class="blind">help</span></a>
                </p>
              </div>
              <div class="chart_middle_gride">
                <ul>
                  <li v-for=" (item, index) in revenueApiList" :key="`revenue_kpi_${index}`">
                    <basic-info-chart
                      :data="_revenueKpiData[item]"
                      :name="item"
                      :chartType="item === 'pur' ? 'line' : 'column'"
                      :direction="'horizon'"/>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </li>
        <li class="ratio_one">
          <div class="chart_section">
            <div class="chart_info_area type_revenue custom_padding_edit">
              <div class="chart_top_info">
                <!-- [D] chart_name는 최대 18자 까지만 노출 -->
                <p class="chart_name">
                  <span>Paying User</span>
                  <a class="btn_ico_help" @click="mixinToggleAboutThisChart({ type: 'chart', data: payingUser.tooltip })"><span class="blind">help</span></a>
                </p>
              </div>
              <div class="chart_middle_gride type_lowest get_height_payinguser_area">
                <loading-bar 
                  :is-show-loading="!payingUser.isLoading" 
                  style="min-height: 250px !important;"/>
                <div v-if="!payingUser.isLoading && payingUser.options.length > 0"
                  class="inner_chart_area paying_user_chart_background">
                  <div class="paying_user_chart_title_common paying_user_chart_title_left">NPU</div>
                  <div class="paying_user_chart_title_common paying_user_chart_title_right">RPU</div>
                </div>
                <div
                  v-if="!payingUser.isLoading"
                  class="inner_chart_area" style="paddingTop:20px;">
                  <div
                    v-if="!payingUser.isLoading && payingUser.options.length === 0"
                    :style="`height:${payingUser.height};text-align:center;line-height:${payingUser.height};`">
                    NoData
                  </div>
                  <!-- [D] 실제 chart 가 적용되는 영역(img tag 삭제 후 적용 부탁드립니다.) -->
                  <!-- chart.inverted: true 옵션을 주도록 함 -->
                  <template v-for=" (item, index) in payingUser.options">
                    <custom-stacked-percentage-bar-chart
                      :key="`payingUser_${index}`"
                      :name="item.xAxis.categories[0]"
                      :height="payingUser.height"
                      :options="item"/>
                  </template>
                </div>
              </div>
              <div class="chart_more_view">
                <a class="more_link" @click="mixinMoreDetails(payingUser.name)">More Details</a>
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
  import CustomStackedPercentageBarChart from '../charts/CustomStackedPercentageBarChart'
  import LoadingBar from '@/app/bodys/body/components/common/LoadingBar'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'

  export default {
    name: 'RevenueKpiAndPayingUserArea',
    mixins: [ dashboardMixin ],
    props: {
      revenueApiList: {
        type: Array,
        required: false,
        default: () => { return [] }
      }
    },
    components: {
      BasicInfoChart,
      CustomStackedPercentageBarChart,
      LoadingBar
    },
    watch: {
      _isOpenMenu (isOpen) {
        this.mixinResize({ name: 'payingUser', className: 'get_height_payinguser_area' })
      }
    },
    data () {
      return {
        revenueKpi: {
          name: 'revenueKpi',
          tooltip: { chartName: '', dimension: [], kpi: [] },
        },
        payingUser: {
          name: 'payingUser',
          isLoading: false,
          height: '',
          tooltip: { chartName: '', dimension: [], kpi: [] },
          optionsTemplate: {
            chart: {
              type: 'bar',
              height: '60px'
            },
            title: {
                text: ''
            },
            xAxis: {
              visible: false,
              categories: []
            },
            yAxis: {
              visible: false,
              min: 0
            },
            legend: '',
            plotOptions: {
              series: {
                stacking: 'percent'
              },
              bar: {
                dataLabels: {
                  enabled: true,
                  inside: true,
                  algign: 'center',
                  style: {
                    textOutline: undefined
                  },
                  formatter: function () {
                    const numberWithCommas = (value) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    return  ( this.y > 1000000) ? numberWithCommas(_.round(this.y / 1000000, 2)) + ' M' :
                            (this.y > 1000) ? numberWithCommas(_.round(this.y / 1000, 1)) + ' K' : numberWithCommas(this.y)
                  }
                },
                pointWidth: 60,
                pointPadding: 0.1
              }
            },
            tooltip: {
              formatter: function () {
                return `${_.round(this.point.percentage, 2)}%`
              },
            },
            colors: ['#52afff', '#6fc765'],
            series: []
          },
          options: []
        }
      }
    },
    computed: {
      ...mapState({
        _revenueKpiData: state => state.dashboard._numberTypeData.revenue,
        _apiReqObjIdList: state => state.dashboard._apiReqObjIdList
      }),
    },
    created () {
      this.init()
    },
    mounted () {
      this.payingUser.height = `${document.getElementsByClassName('get_height_payinguser_area')[0].offsetHeight / 3}px`
    },
    methods: {
      ...mapActions([
        types.GET_CHART_DATA,
        types.MAKE_STACKED_PERCENTAGE_BAR_CHART
      ]),
      init () {
        this.initRevenueKpi()
        if (!this.payingUser.isLoading) this.initPayingUser()
      },
      initRevenueKpi () {
        this.mixinGetTooltip({ areaName: 'revenueKpi'})
        this.revenueApiList.forEach( item => {
          this._revenueKpiData[item] = {}
        })
        this.getRevenueKpiData()
      },
      initPayingUser () {
        this.mixinGetTooltip({ areaName: 'payingUser'})
        this.payingUser.isLoading = true
        this.payingUser.options = []
        this.getPayingUserChartData()
      },
      getRevenueKpiData () {
        setTimeout( () => {
          this.revenueApiList.forEach( (item, index) => {
            this[types.GET_BASIC_INFO_DATA]({
              req: this.mixinReq({objectId: this._apiReqObjIdList[10][index + 1], range: 1}),
              route: 'revenue',
              type: item,
              currency: (this.me.currency === 'usd') ? '$' : (this.me.currency === 'jpy') ? '¥' : '₩'
            })
          })
        }, 1500)
      },
      getPayingUserChartData () {
        this.payingUser.options = []
        this.mixinGetChartData({
            req: this.mixinReq({objectId: this._apiReqObjIdList[11][1]}),
            actionsName: types.GET_CHART_DATA,
            routeName: 'payingUser'
          }).then((result) => {
            if (!_.isEmpty(result) && !_.isEmpty(result.data) && !_.isEmpty(result.data.chartDataList)){
              ['pu', 'sale'].forEach( (item, index) => {
                const copyApiResult = _.cloneDeep(result.data)
                const copyChartDataList = _.cloneDeep(copyApiResult.chartDataList)
                const tmp = _.cloneDeep(copyApiResult)
                tmp.chartDataList = _.cloneDeep(copyApiResult.chartDataList)
                                    .filter( fItem => {
                                      const displayNameParticles = fItem.kpi.displayName.split('_')
                                      return displayNameParticles[1] === item
                                          && displayNameParticles.pop() !== 'rate'
                                    })
                tmp.chartDataList.reverse()
                tmp.xAxisList = item === 'pu' ? ['PU'] : [`Revenue (${this.mixinGetSignTxt()})`]
                this.mixinMakeChart({
                  actionsName: types.MAKE_STACKED_PERCENTAGE_BAR_CHART,
                  actionsData: { chartData: tmp, typeName: null },
                }).then( item => {
                  item.plotOptions.bar.dataLabels.enabled = true
                  this.payingUser.options.push(
                    _.cloneDeep(_.merge(this.payingUser.optionsTemplate, item))
                  )
                  this.payingUser.isLoading = false
                })
              })
            } else {
              this.payingUser.isLoading = false
            }
        })
      }
    }
  }
</script>
<style scoped>
.paying_user_chart_background {
  /* background-color: #000000B3; */
  position: absolute;
  /* z-index: 5; */
  width: calc(100% - 40px) !important;
  height: 180px !important;
  display: flex !important;
}
.paying_user_chart_title_common {
  flex: 1;
  text-align: center;
  color: #9e9e9e;
  font-family: Roboto;
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
}
.paying_user_chart_title_left {
  height:100%;
  border-right: 1px dashed #dcdcdc !important;
}
.custom_padding_edit {
  padding: 22px 20px 20px 20px !important;
}
</style>

