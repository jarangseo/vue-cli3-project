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
                <p class="chart_name" >
                  <span>Platform</span>
                  <a class="btn_ico_help" @click="mixinToggleAboutThisChart({ type: 'chart', data: platform.tooltip })"><span class="blind">help</span></a>
                </p>
                <div class="chart_elapsed">
                  <!-- [D] 아이콘이 아닌 문자형 버튼일 경우, btn_group에 text 클래스 추가 필요 -->
                  <common-button-group v-show="hasRevenue"
                    :button-item-list="platform.buttonList"
                    @changeButtonItem="changePlatformButtonItem"/>
                </div>
              </div>
              <div class="chart_middle_gride get_height_platform_area">
                <loading-bar 
                  :is-show-loading="!platform.isLoading" 
                  style="min-height: 250px !important;"/>
                <div class="inner_chart_area">
                  <div
                    v-if="!platform.isLoading && platform.options.series[0].data.length === 0"
                    :style="`height:${platform.height};text-align:center;line-height:${platform.height};`">
                    NoData
                  </div>
                  <!-- [D] 실제 chart 가 적용되는 영역(img tag 삭제 후 적용 부탁드립니다.) -->
                  <basic-highchart 
                    v-if="isPlatformShow"
                    :height="platform.height"
                    :options="platform.options"/>
                </div>
              </div>
              <div class="chart_more_view">
                <a class="more_link" @click="mixinMoreDetails(platform.name)">More Details</a>
              </div>
            </div>
          </div>
        </li>
        <li class="ratio_two">
          <div class="chart_section">
            <div class="chart_info_area type_revenue">
              <div class="chart_top_info">
                <!-- [D] chart_name는 최대 45자 까지만 노출 -->
                <p class="chart_name">
                  <span>Country</span>
                  <a class="btn_ico_help" @click="mixinToggleAboutThisChart({ type: 'chart', data: country.tooltip })"><span class="blind">help</span></a>
                </p>
                <div class="chart_elapsed">
                  <!-- [D] 아이콘이 아닌 문자형 버튼일 경우, btn_group에 text 클래스 추가 필요 -->
                  <common-button-group
                    v-if="!country.isLoading"
                    v-show="isCountryShow && hasRevenue"
                    :button-item-list="country.buttonList"
                    :selectButtonItem="country.selectedBtnName"
                    @changeButtonItem="changeCountryButtonItem"/>
                </div>
              </div>
              <div class="chart_middle_gride get_height_country_area">
                <loading-bar
                  :is-show-loading="!country.isLoading"
                  style="min-height: 250px !important;"/>
                <div
                  v-if="!country.isLoading && country.options.series[0].data.length === 0"
                  :style="`height:${country.height};text-align:center;line-height:${country.height};`">
                  NoData
                </div>
                <div class="inner_chart_area" style="width:66%;float:left;">
                  <!-- [D] 실제 chart 가 적용되는 영역(img tag 삭제 후 적용 부탁드립니다.) -->
                  <worldmap-chart
                    v-if="isCountryShow"
                    :options="country.options"
                    :height="country.height" />
                </div>
                <div
                  v-if="isCountryShow && country.progressInfoData.length > 0"
                  class="inner_chart_area"
                  :style="`width: 30%;float:right;height:${country.height};overflow-y: auto;`">
                  <div style="display:flex;width:100%;height:16px;marginBottom:20px;">
                    <div class="country_progress_title">Top Countries</div>
                    <!-- <div class="country_progress_icon_area">
                      <div class="rectangle18"></div>
                      <div class="rectangle6"></div>
                    </div> -->
                  </div>
                  <!-- [D] 실제 chart 가 적용되는 영역(img tag 삭제 후 적용 부탁드립니다.) -->
                  <template v-for="(item, index) in country.progressInfoData" >
                    <custom-progress-info
                      :key="`progress_country_${index}`"
                      :name="item.name"
                      :value="item.value"
                      :unit="item.unit"
                      :color="item.color"
                      :percent="item.percent"
                      :isSales="item.isSales"/>
                  </template>
                </div>
              </div>
              <div class="chart_more_view">
                <a class="more_link" @click="mixinMoreDetails(country.name)">More Details</a>
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
  import WorldmapChart from '../charts/WorldmapChart'
  import CustomProgressInfo from '../charts/CustomProgressInfo'
  import CommonButtonGroup from '../common/CommonButtonGroup'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'
  import Highcharts from 'highcharts'
  import mapInit from 'highcharts/modules/map'
  import {worldmap} from '@/shared/utils/worldmap'
  import LoadingBar from '@/app/bodys/body/components/common/LoadingBar'
  import { util } from '@/shared/utils/util'
  export default {
    name: 'PlatformAndCountryArea',
    mixins: [ dashboardMixin ],
    props: {},
    components: {
      CommonButtonGroup,
      BasicHighchart,
      WorldmapChart,
      CustomProgressInfo,
      LoadingBar
    },
    watch: {
      _isOpenMenu (isOpen) {
        this.mixinResize({ name: 'platform', className: 'get_height_platform_area' })
      }
    },
    data () {
      return {
        common: {
          colors: ['#faa466', '#fbae5f', '#fbb757', '#fcc050', '#fcc949', '#fcc949', '#fcc949', '#fcc949', '#fcc949'],
        },
        platform: {
          name: 'platform',
          isLoading: true,
          height: '',
          tooltip: { chartName: '', dimension: [], kpi: [] },
          buttonList: [this.isDaily ? 'DAU' : 'MAU', 'Revenue'],
          chartLength: -1,
          selectedBtnName: 'DAU',
          options: {
            chart: {
              type: 'pie'
            },
            title: {
              text: ''
            },
            subtitle: {
              text: ''
            },
            plotOptions: {
              pie: {
                size: 190,
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                  enabled: false
                },
                showInLegend: true,
                colors: ['#6fc765', '#52afff', '#be62e7', '#f093b4', '#faa466', '#a8da6a', '#d2d2d2']
              }
            },
            tooltip: {
            },
            series: [{
              name: "Browsers",
              center: ['50%', '30%'],
              colorByPoint: true,
              data: []
            }],
            legend: {
              floating: true,
              y: 15,
              itemMarginTop: 10
            }
          },
          tooltip: {
            formatter: function () {
              return  this.key + '<br/>' +
                      (this.series.name.includes('sale') ? this.point.currencyUnit : '') + ' ' + this.point.v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' (' + this.point.y + '%)'
            },
            shared: false
          },
          apiResults: this.isDaily ? {'DAU': {}, 'Revenue': {}, 'DAU_rate': {}, 'Revenue_rate': {}} : {'MAU': {}, 'Revenue': {}, 'MAU_rate': {}, 'Revenue_rate': {}}
        },
        country: {
          name: 'country',
          isLoading: false,
          height: '',
          tooltip: { chartName: '', dimension: [], kpi: [] },
          buttonList: [ this.isDaily ? 'DAU' : 'MAU', 'Revenue'],
          selectedBtnName: 'DAU',
          filterNm1List: { ALL: 'ALL', DAU: 'DAURANK', MAU: 'MAURANK', Revenue: 'SALESRANK'},
          options: {
            chart: {
              map: 'Country'
            },
            title: {
              text: null
            },
            subtitle: {
              text: null
            },
            mapNavigation: {
              enabled: true,
              enableMouseWheelZoom: true,
              buttonOptions: {
                alignTo: 'spacingBox'
              }
            },
            colorAxis: {
              minColor: '#fbf7e1',
              maxColor: '#faa466'
            },
            tooltip: {
              formatter: function () {
                const isSales = _.includes(_.lowerCase(this.point.series.userOptions.name), 'sale')
                const currency = this.point.series.userOptions.currency
                const value = this.point.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                return `${this.point.name}: ${isSales? currency : ''}${value}`
                // return `${this.point.name}(${this.point['hc-key']}): ${isSales? currency : ''}${value}`
              },
            },
            series: [{
              name: '',
              animation: false,
              states: {
                hover: {
                  color: '#BADA55'
                }
              },
              dataLabels: {
                enabled: false,
                format: '{point.name}'
              },
              allAreas: false,
              data: []
            }]
          },
          progressInfoData: {},
          apiResults: this.isDaily ? {'DAU': {}, 'Revenue': {}, 'DAU_rate': {}, 'Revenue_rate': {}}
                                    : {'MAU': {}, 'Revenue': {}, 'MAU_rate': {}, 'Revenue_rate': {}},
        }
      }
    },
    computed: {
      ...mapState({
        countryData: state => state.dashboard._worldmapTypeData.country,
        _apiReqObjIdList: state => state.dashboard._apiReqObjIdList,
        _worldmapTypeData: state => state.dashboard._worldmapTypeData,
        // moreDetail: state => state.dashboard.moreDetail,
      }),
      isPlatformShow () {
        return !this.platform.isLoading && this.platform.options.series[0].data.length > 0
      },
      isCountryShow () {
        return !this.country.isLoading && this.country.options.series[0].data.length > 0
      }
    },
    created () {
      this.platform.buttonList = [this.isDaily ? 'DAU' : 'MAU', 'Revenue']
      this.country.buttonList = [this.isDaily ? 'DAU' : 'MAU', 'Revenue']
      mapInit(Highcharts)
      Highcharts.maps['Country'] = worldmap
      this.init()
    },
    mounted () {
      this.platform.height = `${document.getElementsByClassName('get_height_platform_area')[0].offsetHeight}px`
      this.country.height = `${document.getElementsByClassName('get_height_country_area')[0].offsetHeight}px`
    },
    methods: {
      ...mapActions([
        types.GET_CHART_DATA,
        types.GET_WORLD_MAP_DATA,
        types.MAKE_PIE_CHART
      ]),
      init () {
        this.initPlatform()
        if (!this.country.isLoading) this.initCountry()
      },
      initPlatform () {
        this.mixinGetTooltip({ areaName: 'platform'})
        this.platform.selectedBtnName = this.platform.buttonList[0]
        this.platform.isLoading = true
        this.getPlatformChartData()
      },
      initCountry () {
        this.mixinGetTooltip({ areaName: 'country'})
        this.country.selectedBtnName = this.country.buttonList[0]
        this.country.progressInfoData = []
        this.country.isLoading = true
        this.getCountryChartData({ filterNm1: this.country.filterNm1List['ALL']})
        // this.getCountryChartData({ filterNm1: 'DAURANK'})
        // this.getCountryChartData({ filterNm1: 'SALESRANK'})
      },
      async getPlatformChartData () {
        this.platform.isLoading = await true
        this.platform.options.series[0].data = []
        this.platform.apiResults = this.isDaily ? {'DAU': {}, 'Revenue': {}, 'DAU_rate': {}, 'Revenue_rate': {}} : {'MAU': {}, 'Revenue': {}, 'MAU_rate': {}, 'Revenue_rate': {}}
        await this.mixinGetChartData({
          req: this.mixinReq({objectId: this._apiReqObjIdList[4]}),
          actionsName: types.GET_CHART_DATA,
          routeName: 'platform'
        }).then((result) => {
          if (!_.isEmpty(result) && !_.isEmpty(result.data) && !_.isEmpty(result.data.chartDataList)){
            this.platform.buttonList.forEach((btnName, index) => {
              const copyApiResult = _.cloneDeep(result.data)
              const copyChartDataList = _.cloneDeep(copyApiResult.chartDataList)
              const prefix = btnName === 'DAU' ? 'dau' : btnName === 'MAU' ? 'mau' : 'sale'
              const tmp = _.cloneDeep(copyApiResult)
              tmp.chartDataList = _.cloneDeep(copyApiResult.chartDataList).filter( item => {
                return item.kpi.displayName.split('_')[0] === prefix
              })
              this.platform.apiResults[btnName] = _.cloneDeep(tmp)
  
              const tmpRate = _.cloneDeep(copyApiResult)
              tmpRate.chartDataList = _.cloneDeep(copyApiResult.chartDataList).filter( item => {
                return item.kpi.displayName.split('_').pop() === 'rate'
              })
              this.platform.apiResults[`${btnName}_rate`] = _.cloneDeep(tmpRate)
            })
          }else {
            this.platform.isLoading = false
          }
        })
        await this.getPlatformChartOption()
        this.platform.isLoading = false
      },
      async getCountryChartData (reqParam) {
        this.country.isLoading = await true
        this.country.options.series[0].data = []
        this.country.apiResults = this.isDaily  ? {'DAU': {}, 'Revenue': {}, 'DAU_rate': {}, 'Revenue_rate': {}}
                                                : {'MAU': {}, 'Revenue': {}, 'MAU_rate': {}, 'Revenue_rate': {}}
        await this[types.GET_WORLD_MAP_DATA]({
          req: this.mixinReq({objectId: this._apiReqObjIdList[5], filterNm1: reqParam.filterNm1}),
          route: 'country',
        }).then((result) => {
          if (!_.isEmpty(result)) {
            // 1. ALL {ctry_cd / ctry_nm / dau / dau_rate / sale_krw / sale_krw_rate }
            this.country.buttonList.forEach((btnName, btnIndex) => {
              this.country.apiResults[btnName] = _.cloneDeep(result.data._worldmapData).map(item => {
                return [_.lowerCase(item[0]), Number(item[btnIndex*2 + 2])]
              })
              this.country.apiResults[`${btnName}_rate`] = _.cloneDeep(result.data._worldmapData).map(item => {
                return [_.lowerCase(item[0]), Number(item[btnIndex*2 + 3])]
              })
            })
          } else {
            setTimeout( () => {
              this.country.isLoading = false
            }, 200 )
          }
        })
        await this.getProgressData({filterNm1: this.country.filterNm1List[this.country.selectedBtnName]})
        setTimeout( () => {
          this.country.isLoading = false
        }, 200 )
      },
      getPlatformChartOption () {
        if (!_.isEmpty(this.platform.apiResults[this.platform.selectedBtnName])) {
          const item = this.platform.apiResults[this.platform.selectedBtnName]
          this.mixinMakeChart({
            actionsName: types.MAKE_PIE_CHART,
            actionsData: { chartData: item, typeName: types.DASHBOARD, cnt: -0.3 },
          }).then( (data) => {
            const tmp = _.merge(_.cloneDeep(this.platform.options), data)
            tmp.series[0].center = ['50%', '40%']
            tmp.tooltip = this.platform.tooltip
            this.platform.options = tmp
            this.platform.options.plotOptions.pie.point = this.mixinLegendItemClick({ that: this, name: this.platform.name })
            this.platform.chartLength = this.platform.options.series.length
          })
        }
      },
      getCountryChartOption () {
        if (!_.isEmpty(this.country.apiResults[this.platform.selectedBtnName])) {
          const item = _.cloneDeep(this.country.apiResults[this.country.selectedBtnName])
          const itemRate = _.cloneDeep(this.country.apiResults[`${this.country.selectedBtnName}_rate`])
          if (item && itemRate) {
            this.country.options.series[0].data = item
            this.country.options.series[0].name = this.country.selectedBtnName
            this.country.options.series[0].currency = this.mixinGetSignTxt()
            const countryHasData = _.transform(item, (result, n) => { result.push(n[0]); return n }, [])
            _.pullAll(_.cloneDeep(this._worldmapTypeData.template), countryHasData).forEach(item => this.country.options.series[0].data.push([item, 0]))
            // this.country.progressInfoData = itemRate.sort((a, b) => b[1] - a[1]).filter((o, i) => i < 5).map((item, index) => {
            //   return {name: item[0], value: item[1].toString(), percent: item[1], unit: '%', color: this.common.colors[index]}
            // })
          }
        }
      },
      getProgressData (reqParam) {
        this.country.progressInfoData = []
        this[types.GET_WORLD_MAP_DATA]({
          req: this.mixinReq({objectId: this._apiReqObjIdList[5], filterNm1: reqParam.filterNm1}),
          route: 'country',
        }).then((result) => {
          if (!_.isEmpty(result) && !_.isEmpty(result.data._worldmapData)) {
            // 2. DAURANK {ctry_cd / ctry_nm / dau_rank/ dau / dau_rate / sale_krw / sale_krw_rate }
            // 3. SALESRANK {ctry_cd / ctry_nm / sales_rank / dau / dau_rate / sale_krw / sale_krw_rate
            this.country.progressInfoData = _.cloneDeep(result.data._worldmapData).sort((a, b) => a[2] - b[2]).map( (item, index) => {
              return {
                name: item[1],
                value: item[ reqParam.filterNm1 === this.country.filterNm1List['Revenue'] ? 5 : 3 ].toString(),
                percent: item[ reqParam.filterNm1 === this.country.filterNm1List['Revenue'] ? 6 : 4 ],
                unit: '%',
                color: this.common.colors[index],
                isSales: reqParam.filterNm1 === this.country.filterNm1List['Revenue'] ? true : false
              }
            })
          }
        })
        this.getCountryChartOption()
      },
      async changePlatformButtonItem (item) {
        if (this.platform.selectedBtnName !== item) {
          this.platform.isLoading = await true
          this.platform.selectedBtnName = item
          this.getPlatformChartOption()
          this.platform.isLoading = await false
        }
      },
      async changeCountryButtonItem (item) {
        if (this.country.selectedBtnName !== item) {
          this.country.isLoading = await true
          this.country.selectedBtnName = await item
          this.getProgressData({ filterNm1: this.country.filterNm1List[this.country.selectedBtnName] })
          await setTimeout( () => {
            this.country.isLoading = false
          }, 200 )
        }
      },
      async windowResize () {
        this.platform.isLoading = await true
        this.platform.isLoading = await false
        // setTimeout( async () => {
        //   this.country.isLoading = await true
        //   this.country.isLoading = await false
        // }, 500)
      }
    }
  }
</script>

<style scoped>
.country_progress_title {
  flex:10;
  font-family: Roboto;
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #9e9e9e;
}
.country_progress_icon_area {
  flex:1;
  display: flex;
  margin: auto;
}

.rectangle18 {
  flex: 3;
  width: 18px;
  height: 6px;
  border-radius: 4px;
  background-color: #89c6ff;
}

.rectangle6 {
  flex: 1;
  width: 6px;
  height: 6px;
  border-radius: 4px;
  background-color: #bdbdbd;
  margin-left: 3px;
}
</style>
