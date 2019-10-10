<template>
  <div class="inner_chart_grid">
    <div class="chart_area">
      <ul>
        <li>
          <div class="chart_section">
            <div class="chart_info_area type_revenue">
              <div class="chart_top_info type_inline">
                <!-- [D] chart_name는 최대 45자 까지만 노출 -->
                <p class="chart_name">
                  <span>Retention (%)</span>
                  <a class="btn_ico_help" @click="mixinToggleAboutThisChart({ type: 'chart', data: retentionRate.tooltip })"><span class="blind">help</span></a>
                </p>
                <div class="chart_elapsed type_left">
                  <common-drop-list 
                    :drop-list-option="retentionRate.dropListOption"
                    @dropListLabel="changeDropListLabel"/>
                </div>
                <div class="chart_elapsed">
                  <!-- [D] 아이콘이 아닌 문자형 버튼일 경우, btn_group에 text 클래스 추가 필요 -->
                  <common-button-group 
                    :button-item-list="retentionRate.buttonList"
                    @changeButtonItem="changeButtonItem"/>
                </div>
              </div>
              <div class="chart_middle_gride get_height_retentionRate_area">
                <loading-bar 
                  :is-show-loading="!retentionRate.isLoading" 
                  style="min-height: 250px !important;"/>
                <div class="inner_chart_area">
                  <!-- [D] 실제 chart 가 적용되는 영역(img tag 삭제 후 적용 부탁드립니다.) -->
                  <!-- <img src="@/img/@img_dummy_chart.png" width="100%" height="280" alt=""> -->
                  <div v-if="!retentionRate.isLoading && this.retentionRate.options.series.length === 0"
                    :style="`height:${retentionRate.height};text-align:center;line-height:${retentionRate.height};`">
                    No Data
                  </div>
                  <basic-highchart 
                    v-if="isRetentionRateShow"
                    :height="retentionRate.height"
                    :options="retentionRate.options"/>
                </div>
              </div>
              <div class="chart_more_view">
                <a class="more_link" @click="mixinMoreDetails(retentionRate.name)">More Details</a>
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
  import BasicHighchart from '../charts/BasicHighchart'
  import CommonDropList from '../common/CommonDropList'
  import CommonButtonGroup from '../common/CommonButtonGroup'
  import LoadingBar from '@/app/bodys/body/components/common/LoadingBar'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'
  export default {
    name: 'RetentionRateArea',
    mixins: [ dashboardMixin ],
    props: {
    },
    components: {
      BasicHighchart,
      CommonDropList,
      CommonButtonGroup,
      LoadingBar
    },
    watch: {
      _isOpenMenu (isOpen) {
        this.mixinResize({ name: 'retentionRate', className: 'get_height_retentionRate_area' })
      }
    },
    data () {
      return {
        retentionRate: {
          name: 'retentionRate',
          isLoading: true,
          height: '',
          tooltip: { chartName: '', dimension: [], kpi: [] },
          chartLength: -1,
          buttonList: ['NRU', 'CBU', 'STU'],
          selectedBtnName: 'NRU',
          selectedDropListIndex: 0,
          dropListLabel: null,
          dropListOption: [],
          dropListItemRange: [1, 3, 6],
          tooltip: {
            formatter: function () {
              const userOptions = this.series.userOptions
              // D001 : RR_1 ( RU_1)
              // console.log('this: ', this)
              const numberWithCommas = (value) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              return `${userOptions.name} : ${this.y} ( ${numberWithCommas(userOptions.ru[this.point.index])} )`
              // return  this.key.split(';')[1] + '<br/>' +
              //         (this.series.name.includes('sale') ? this.point.currencyUnit : '') + ' ' + this.point.v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' (' + this.point.y + '%)'
            },
            shared: false
          },
          options: {
            series: [{
              data: []
            }],
          },
          progressInfoData: [],
          apiResults: { 'NRU': {}, 'CBU': {}, 'STU': {} },
        }
      }
    },
    computed: {
      ...mapState({
        _apiReqObjIdList: state => state.dashboard._apiReqObjIdList
      }),
      isRetentionRateShow () {
        return !this.retentionRate.isLoading
                && this.retentionRate.options.series.length > 0
                && this.retentionRate.options.series[0].data.length > 0
      }
    },
    created () {
      this.init()
    },
    mounted () {
      this.retentionRate.height = `${document.getElementsByClassName('get_height_retentionRate_area')[0].offsetHeight}px`
    },
    methods: {
      ...mapActions([
        types.GET_CHART_DATA,
        types.MAKE_LINE_CHART
      ]),
      init () {
        this.mixinGetTooltip({ areaName: 'retentionRate'})
        this.retentionRate.isLoading = true
        this.retentionRate.selectedBtnName = this.retentionRate.buttonList[0]
        this.initCommonDropList()
        this.getRetentionRateData()
      },
      initCommonDropList () {
        this.retentionRate.dropListOption = this.retentionRate.dropListItemRange.map( item => {
          return item + (this.isDaily ? 'Month' : 'Year')
        })
      },
      getRetentionRateData () {
        this.retentionRate.options.series = []
        this.retentionRate.apiResults = { 'NRU': {}, 'CBU': {}, 'STU': {} }
        this.retentionRate.selectedDropListIndex
        this.mixinGetChartData({
          req: this.mixinReq({
          objectId: this._apiReqObjIdList[9],
          range: this.retentionRate.dropListItemRange[this.retentionRate.selectedDropListIndex]
        }),
          actionsName: types.GET_CHART_DATA,
          routeName: 'retentionRate'
        }).then((result) => {
          if (!_.isEmpty(result) && !_.isEmpty(result.data) && !_.isEmpty(result.data.chartDataList)){
            this.retentionRate.buttonList.forEach((btnName, index) => {
              const copyApiResult = _.cloneDeep(result.data)
              // const copyChartDataList = _.cloneDeep(copyApiResult.chartDataList)
              // copyApiResult.chartDataList = copyChartDataList.filter( item => {
              //   return item.kpi.kpiName.includes('rr_')
              // })
              const tmp = _.cloneDeep(copyApiResult)
              tmp.chartDataList = _.cloneDeep(copyApiResult.chartDataList).filter( item => {
                return item.kpi.displayName.split(',')[0] === btnName
              })
              this.retentionRate.apiResults[btnName] = tmp
            })
            this.getChartOption()
          } else {
            this.retentionRate.isLoading = false
          }
        })
      },
      getChart () {
        this.retentionRate.isLoading = true
        this.getRetentionRateData()
      },
      changeDropListLabel (labelName, labelIndex) {
        this.retentionRate.selectedDropListIndex = labelIndex
        const beforeDropListLabel = this.retentionRate.dropListLabel
        this.retentionRate.dropListLabel = labelName
        if (beforeDropListLabel) this.getChart()
      },
      async changeButtonItem (item) {
        if (this.retentionRate.selectedBtnName !== item) {
          this.retentionRate.isLoading = await true
          this.retentionRate.selectedBtnName = item
          this.getChartOption()
          this.retentionRate.isLoading = await false
        }
      },
      getChartOption () {
        if (!_.isEmpty(this.retentionRate.apiResults[this.retentionRate.selectedBtnName].chartDataList)) {
          const item = this.retentionRate.apiResults[this.retentionRate.selectedBtnName]
          if (!_.isEmpty(item) && !_.isEmpty(item.chartDataList)) {
            this.mixinMakeChart({
              actionsName: types.MAKE_LINE_CHART,
              actionsData: { chartData: item, typeName: null }
            }).then((data) => {
              data.legend = { layout: 'vertical', align: 'right', verticalAlign: 'middle' }
              data.yAxis = { title: {text: null} }
              const ruList = data.series.filter( item => item.name.includes('ru_'))
              data.series = data.series.filter( item => item.name.includes('rr_'))
              _.cloneDeep(data.series).forEach( (item, index) => {
                const numbers = this.pad(Number(item.name.split('rr_')[1]), 3)
                data.series[index]['name'] = `D${numbers}`
                data.series[index]['data'] = item.data.filter( item => item !== null )
                // data.series[index]['data'] = item.data.filter( item => item > 0)
              })
              ruList.forEach( (item, index) => {
                data.series[index]['ru'] = item.data
              })
              data.tooltip = this.retentionRate.tooltip
              this.retentionRate.options = data
              this.retentionRate.options.plotOptions.line = this.mixinLegendItemClick({ that: this, name: 'retentionRate' })
              this.retentionRate.chartLength = this.retentionRate.options.series.length
              this.retentionRate.isLoading = false
            })
          }
        } else {
          this.retentionRate.options = {
            series: [],
          }
        }
      },
      pad(n, width) {
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
      },
      async windowResize () {
        this.retentionRate.isLoading = await true
        this.retentionRate.isLoading = await false
      }
    }
  }
</script>
