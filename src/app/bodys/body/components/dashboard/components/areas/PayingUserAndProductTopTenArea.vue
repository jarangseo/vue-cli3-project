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
                  <span>Paying User</span>
                  <a class="btn_ico_help" @click="mixinToggleAboutThisChart({ type: 'chart', data: payingUser.tooltip })"><span class="blind">help</span></a>
                </p>
              </div>
              <div class="chart_middle_gride get_height_payinguser_area">
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
        <li class="ratio_two">
          <div class="chart_section">
            <div class="chart_info_area type_revenue">
              <div class="chart_top_info type_inline">
                <!-- [D] chart_name는 최대 45자 까지만 노출 -->
                <p class="chart_name">
                  <span>Product Top 10</span>
                  <a class="btn_ico_help" @click="mixinToggleAboutThisChart({ type: 'chart', data: productTopTen.tooltip })"><span class="blind">help</span></a>
                </p>
                <div class="chart_elapsed type_left">
                  <div class="drop_list" style="min-width: 86.05px !important;">
                    <div class="drop_list_label">
                      <a @click="toggleDropListLayerDisplay">{{ productTopTen.dropListLabel }}</a>
                    </div>
                    <!-- [D] 드롭 리스트 open시, display:block 로 변경 필요 (default - display:none) -->
                    <div 
                      v-show="productTopTen.isShowDropListLayer"
                      class="drop_list_layer" style="display:block;">
                      <div class="inner_drop_list" style="max-height:256px;">
                        <ul>
                          <!-- [D] 선택된 항목의 경우, a에 on 클래스 추가 필요 -->
                          <li v-for="(item, index) in productTopTen.dropListOption" :key="`option-${index}`" style="text-align: left !important;">
                            <a
                              :class="{ on: productTopTen.dropListLabel === item }"
                              @click="changeDropListLabel(item, index)">{{ item }}</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="chart_elapsed">
                  <!-- [D] 아이콘이 아닌 문자형 버튼일 경우, btn_group에 text 클래스 추가 필요 -->
                  <common-button-group
                    v-if="!productTopTen.isLoading"
                    :button-item-list="productTopTen.buttonList"
                    :selectButtonItem="productTopTen.selectedBtnName"
                    @changeButtonItem="changeButtonItem"/>
                </div>
              </div>
              <div class="chart_middle_gride get_height_producttopten_area">
                <loading-bar 
                  :is-show-loading="!productTopTen.isLoading" 
                  style="min-height: 250px !important;"/>
                <div class="inner_chart_area">
                  <div
                    v-if="!productTopTen.isLoading && productTopTen.options.series[0].data.length === 0"
                    :style="`height:${productTopTen.height};text-align:center;line-height:${productTopTen.height};`">
                    NoData
                  </div>
                  <!-- [D] 실제 chart 가 적용되는 영역(img tag 삭제 후 적용 부탁드립니다.) -->
                  <!-- <treemap-chart v-if="!isProductTopTenLoading" :options="productTopTenOptions"/> -->
                  <treemap-chart
                    v-if="!productTopTen.isLoading && productTopTen.options.series[0].data"
                    :options="productTopTen.options"
                    :height="productTopTen.height"/>
                </div>
              </div>
              <div class="chart_more_view">
                <a class="more_link" @click="mixinMoreDetails(productTopTen.name)">More Details</a>
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
  import CustomStackedPercentageBarChart from '../charts/CustomStackedPercentageBarChart'
  import TreemapChart from '../charts/TreemapChart'
  import CommonButtonGroup from '../common/CommonButtonGroup'
  import LoadingBar from '@/app/bodys/body/components/common/LoadingBar'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'
  export default {
    name: 'PayingUserAndProductTopTenArea',
    mixins: [ dashboardMixin ],
    props: {
    },
    components: {
      TreemapChart,
      CustomStackedPercentageBarChart,
      CommonButtonGroup,
      LoadingBar
    },
    watch: {
      _isOpenMenu (isOpen) {
        this.mixinResize({ name: 'payingUser', className: 'get_height_payinguser_area' })
        this.mixinResize({ name: 'productTopTen', className: 'get_height_producttopten_area' })
      }
    },
    data () {
      return {
        common: {
          colors: ['#6FC765', '#52AFFF', '#BE62E7', '#F093B4', '#FAA466', '#A8DA6A', '#76D8E5', '#F46C7C', '#CD9059', '#FCC949']
        },
        payingUser: {
          name: 'payingUser',
          isLoading: false,
          height: '',
          tooltip: { chartName: '', dimension: [], kpi: [] },
          optionsTemplate: {
            chart: {
              type: 'bar',
              height: '100px'
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
                pointWidth: 200,
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
        },
        productTopTen: {
          name: 'productTopTen',
          isLoading: false,
          height: '',
          tooltip: { chartName: '', dimension: [], kpi: [] },
          buttonList: ['All', 'NPU', 'RPU'],
          dropListOption: ['PU', 'Revenue'],
          dropListLabel: 'PU',
          dropListIndex: 0,
          isShowDropListLayer: false,
          selectedBtnName: 'All',
          apiResults: {
            'Revenue': {'All': {}, 'NPU': {}, 'RPU': {}},
            'PU': {'All': {}, 'NPU': {}, 'RPU': {}},
          },
          options: {
            title: { text: '' },
            tooltip: {
              formatter: function () {
                return `${this.key}: ${this.point.rate}% (${this.point.currency}${this.point.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')})`
              },
            },
            series: [{
              type: 'treemap',
              layoutAlgorithm: 'sliceAndDice', // "sliceAndDice", "stripes", "squarified", "strip"
              alternateStartingDirection: true,
              animation: false,
              dataLabels: {
                enabled: true,
                align: 'center',
                verticalAlign: 'middle',
                style: {
                  fontFamily: 'Roboto',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#ffffff',
                  borderColor: '#ffffff',
                  textOutline: ''
                }
              },
              levels: [
                {
                  level: 1,
                  layoutStartingDirection: 'vertical',
                  layoutAlgorithm: 'sliceAndDice'
                },
                {
                  level: 2,
                  layoutStartingDirection: 'vertical', // "vertical", "horizontal"
                  layoutAlgorithm: 'sliceAndDice'
                }
              ],
              data: []
            }],
          },
        }
      }
    },
    computed: {
      ...mapState({
        _apiReqObjIdList: state => state.dashboard._apiReqObjIdList
      }),
    },
    created () {
      this.init()
    },
    mounted () {
      this.payingUser.height = `${document.getElementsByClassName('get_height_payinguser_area')[0].offsetHeight / 3}px`
      this.productTopTen.height = `${document.getElementsByClassName('get_height_producttopten_area')[0].offsetHeight}px`
    },
    methods: {
      ...mapActions([
        types.GET_CHART_DATA,
        types.MAKE_STACKED_PERCENTAGE_BAR_CHART,
        types.MAKE_TREEMAP_CHART
      ]),
      init () {
        if (!this.payingUser.isLoading) this.initPayingUser()
        if (!this.productTopTen.isLoading) this.initProductTopTen()
      },
      initPayingUser () {
        this.mixinGetTooltip({ areaName: 'payingUser'})
        this.payingUser.isLoading = true
        this.payingUser.options = []
        this.getPayingUserChartData()
      },
      initProductTopTen () {
        this.mixinGetTooltip({ areaName: 'productTopTen'})
        this.productTopTen.isLoading = true
        this.productTopTen.selectedBtnName = this.productTopTen.buttonList[0]
        this.productTopTen.dropListLabel = this.productTopTen.dropListOption[0]
        this.productTopTen.dropListIndex = 0
        this.productTopTen.isShowDropListLayer = false
        this.productTopTen.options.series[0].data = []
        this.getTreemapChartData()
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
                // const copyChartDataList = _.cloneDeep(copyApiResult.chartDataList)
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
      },
      getTreemapChartData () {
        this.productTopTen.options.series[0].data = []
        this.mixinGetChartData({
            req: this.mixinReq({
              objectId: this._apiReqObjIdList[12],
              filterNm1: 'D02',
              filterNm2: 'D03',
              filterVal1: this.productTopTen.dropListLabel === 'Revenue' ? 'Sales' : this.productTopTen.dropListLabel,
              filterVal2: this.productTopTen.selectedBtnName
            }),
            actionsName: types.GET_CHART_DATA,
            routeName: 'treemap'
          }).then(async (result) => {
            if (!_.isEmpty(result) && !_.isEmpty(result.data) && !_.isEmpty(result.data.chartDataList)){
              await this.productTopTen.dropListOption.forEach((dropName, index) => {
                const copyApiResult = _.cloneDeep(result.data)
                // const copyChartDataList = _.cloneDeep(copyApiResult.chartDataList)
                const tmpData = _.cloneDeep(copyApiResult)
  
                tmpData.chartDataList = _.cloneDeep(copyApiResult.chartDataList).filter( item => {
                  return item.kpi.displayName.split('_')[0] === (!index ? 'pu' : 'sale')
                })
                this.productTopTen.buttonList.forEach((btnName, btnIndex) => {
                  const tmp = _.cloneDeep(tmpData)
                  tmp.chartDataList = _.cloneDeep(tmpData.chartDataList).filter( item => {
                    return _.upperCase(item.kpi.displayName.split('_')[1]) === _.upperCase(btnName)
                  })
                  this.productTopTen.apiResults[dropName][btnName] = tmp
                })
              })
              await this.getChartOption()
              await setTimeout( () => {
                this.productTopTen.isLoading = false
              }, 100)
            } else {
              await setTimeout( () => {
                this.productTopTen.isLoading = false
              }, 100)
            }
        })
      },
      async changeButtonItem (item) {
        if (this.productTopTen.selectedBtnName !== item) {
          this.productTopTen.isLoading = await true
          setTimeout( async () => {
            this.productTopTen.selectedBtnName = item
            await this.getTreemapChartData()
            // this.productTopTen.isLoading = await false
          }, 100)
        }
      },
      async changeDropListLabel (item, index) {
        if (this.productTopTen.dropListLabel !== item && this.productTopTen.dropListIndex !== index) {
          this.productTopTen.isLoading = await true
          setTimeout( async () => {
            this.productTopTen.dropListLabel = item
            this.productTopTen.dropListIndex = index
            this.productTopTen.selectedBtnName = this.productTopTen.buttonList[0]
            this.getTreemapChartData()
            this.toggleDropListLayerDisplay()
            // this.productTopTen.isLoading = await false
          }, 100)
        }
      },
      toggleDropListLayerDisplay () {
        this.productTopTen.isShowDropListLayer = this.productTopTen.isShowDropListLayer ? false : true
      },
      getChartOption () {
        const item = this.productTopTen.apiResults[this.productTopTen.dropListLabel][this.productTopTen.selectedBtnName]
        const tmpSeries = []
        if (!_.isEmpty(item) && item.chartDataList.length > 0 && item.chartDataList[0].dataList) {
          item.chartDataList[1].dataList.forEach( (value, index) => {
            tmpSeries.push({
              id: item.xAxisList[index],
              name: item.xAxisList[index],
              value: value,
              color: this.common.colors[index],
              rank: item.chartDataList[0].dataList[index],
              rate: item.chartDataList[2].dataList[index],
              currency: this.productTopTen.dropListLabel === this.productTopTen.dropListOption[1] ? this.mixinGetSignTxt() : ''
            })
          })
          this.productTopTen.options.series[0].data = tmpSeries
        }
      },
      async windowResize () {
        this.payingUser.isLoading = await true
        this.payingUser.isLoading = await false
        this.productTopTen.isLoading = await true
        this.productTopTen.isLoading = await false
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
  height: 300px !important;
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
.custom_chart_name { 
  height: 28px !important;
}
</style>
