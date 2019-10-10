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
                <p class="chart_name">
                  <span v-tooltip.auto="'tooltip'">OS</span>
                  <a class="btn_ico_help" @click="mixinToggleAboutThisChart({name: os.name,})"><span class="blind">help</span></a>
                </p>
                <div class="chart_elapsed">
                  <!-- [D] 아이콘이 아닌 문자형 버튼일 경우, btn_group에 text 클래스 추가 필요 -->
                  <common-button-group v-show="hasRevenue"
                    :button-item-list="os.buttonList"
                    @changeButtonItem="changeOsButtonItem"/>
                </div>
              </div>
              <div class="chart_middle_gride get_height_os_area">
                <loading-bar 
                  :is-show-loading="isOsShow" 
                  style="min-height: 250px !important;"/>
                <div class="inner_chart_area">
                  <!-- [D] 실제 chart 가 적용되는 영역(img tag 삭제 후 적용 부탁드립니다.) -->
                  <basic-highchart 
                    v-if="isOsShow"
                    :height="os.height"
                    :options="os.options"/>
                </div>
              </div>
              <div class="chart_more_view">
                <a class="more_link" @click="mixinMoreDetails()">More Details</a>
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
                  <span v-tooltip.auto="'tooltip'">Top App Version</span>
                  <a class="btn_ico_help" @click="mixinToggleAboutThisChart({name: topAppVersion.name,})"><span class="blind">help</span></a>
                </p>
                <div class="chart_elapsed">
                  <!-- [D] 아이콘이 아닌 문자형 버튼일 경우, btn_group에 text 클래스 추가 필요 -->
                  <common-button-group
                    v-if="!topAppVersion.isLoading"
                    :button-item-list="topAppVersion.osButtonList"
                    :selectButtonItem="topAppVersion.selectedOsBtnName"
                    @changeButtonItem="changeTopAppVersionButtonItem"/>
                  <common-button-group
                    v-if="!topAppVersion.isLoading && hasRevenue"
                    :button-item-list="topAppVersion.buttonList"
                    :selectButtonItem="topAppVersion.selectedBtnName"
                    @changeButtonItem="changeTopAppVersionButtonItem"/>
                </div>
              </div>
              <div class="chart_middle_gride get_height_topAppVersion_area">
                <loading-bar 
                  :is-show-loading="isTopAppVersionShow" 
                  style="min-height: 250px !important;"/>
                <div class="inner_chart_area" style="width:66%;float:left;">
                  <!-- [D] 실제 chart 가 적용되는 영역(img tag 삭제 후 적용 부탁드립니다.) -->
                  <basic-highchart 
                    v-if="isTopAppVersionShow"
                    :height="topAppVersion.height"
                    :options="topAppVersion.options" />
                </div>
                <div 
                  v-if="isTopAppVersionShow && topAppVersion.progressInfoData.length > 0"
                  class="inner_chart_area" 
                  :style="`width: 30%;float:right;height:${topAppVersion.height};overflow-y: auto;`">
                  <!-- [D] 실제 chart 가 적용되는 영역(img tag 삭제 후 적용 부탁드립니다.) -->
                  <template v-for="(item, index) in topAppVersion.progressInfoData" >
                    <custom-progress-info 
                      :key="`progress_topApp_${index}`"
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
                <a class="more_link" @click="mixinMoreDetails()">More Details</a>
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
  import BasicHighchart from  '../charts/BasicHighchart'
  import CommonButtonGroup from '../common/CommonButtonGroup'
  import CustomProgressInfo from '../charts/CustomProgressInfo'
  import LoadingBar from '@/app/bodys/body/components/common/LoadingBar'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'
  export default {
    name: 'OsAndTopAppVersionArea',
    mixins: [ dashboardMixin ],
    props: {
    },
    components: {
      BasicHighchart,
      CommonButtonGroup,
      CustomProgressInfo,
      LoadingBar
    },
    watch: {
      _isOpenMenu (isOpen) {
        this.mixinResize({ name: 'os', className: 'get_height_os_area' })
        this.mixinResize({ name: 'topAppVersion', className: 'get_height_topAppVersion_area' })
      }
    },
    data () {
      return {
        common: {
          colors: ['#faa466', '#fbae5f', '#fbb757', '#fcc050', '#fcc949', '#fcc949', '#fcc949', '#fcc949', '#fcc949']
        },
        os: {
          name: 'os',
          isLoading: true,
          height: '',
          buttonList: [this.isDaily ? 'DAU' : 'MAU', 'Sales'],
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
              itemMarginTop: 10,
              labelFormatter: function () {
                return this.name.split(';')[1]
              }
            }
          },
          tooltip: {
            formatter: function () {
              return  this.key.split(';')[1] + '<br/>' +
                      (this.series.name.includes('sale') ? this.point.currencyUnit : '') + ' ' + this.point.v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' (' + this.point.y + '%)'
            },
            shared: false
          },
          apiResults: {'DAU': {}, 'Sales': {}, 'DAU_rate': {}, 'Sales_rate': {}}
        },
        topAppVersion: {
          name: 'topAppVersion',
          isLoading: true,
          height: '',
          buttonList: [this.isDaily ? 'DAU' : 'MAU', 'Sales'],
          osButtonList: ['iOS', 'Android'],
          selectedBtnName: 'DAU',
          selectedOsBtnName: 'iOS',
          filterNm1List: { ALL: 'ALL', DAU: 'DAURANK', MAU: 'MAURANK', Sales: 'SALESRANK'},
          tooltip: {
            formatter: function () {
              const numberWithCommas = (value) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              const userOptions = this.point.series.userOptions
              if (userOptions.name.split(',')[3].includes('dau')) {
                return `<b>${this.x}</b><br/> ${userOptions.name.split(',')[1]} ${userOptions.name.split(',')[2]}: ${numberWithCommas(this.y)}`
              } else {
                return `<b>${this.x}</b><br/> ${userOptions.name.split(',')[1]} ${userOptions.name.split(',')[2]}: ${userOptions.currencyUnit}${numberWithCommas(this.y)}`
              }
            },
            shared: false
          },
          legend: {
            // align: 'center',
            // verticalAlign: 'center',
            enabled: false,
            labelFormatter: function () {
              return this.name.split(',')[1]
            }
          },
          options: {
            series: [{
              data: []
            }],
          },
          progressInfoData: [],
          apiResults: this.isDaily ? {
            'iOS': { 'DAU': {}, 'Sales': {}},
            'Android': { 'DAU': {}, 'Sales': {}}
          } : {
            'iOS': { 'MAU': {}, 'Sales': {}},
            'Android': { 'MAU': {}, 'Sales': {}}
          },
        }
      }
    },
    computed: {
      ...mapState({
        _apiReqObjIdList: state => state.dashboard._apiReqObjIdList
      }),
      isOsShow () {
        return !this.os.isLoading && !_.isEmpty(this.os.options) && this.os.options.series[0].data.length > 0
      },
      isTopAppVersionShow () {
        return !this.topAppVersion.isLoading && this.topAppVersion.options.series[0].data.length > 0
      },
    },
    created () {
      this.os.buttonList = [this.isDaily ? 'DAU' : 'MAU', 'Sales']
      this.topAppVersion.buttonList = [this.isDaily ? 'DAU' : 'MAU', 'Sales']
      this.init()
    },
    mounted () {
      this.os.height = `${document.getElementsByClassName('get_height_os_area')[0].offsetHeight}px`
      this.topAppVersion.height = `${document.getElementsByClassName('get_height_topAppVersion_area')[0].offsetHeight}px`
    },
    methods: {
      ...mapActions([
        types.GET_CHART_DATA,
        types.MAKE_PIE_CHART,
        types.MAKE_LINE_CHART
      ]),
      init () {
        this.initOs()
        this.initTopAppVersion()
      },
      initOs () {
        this.os.isLoading = true
        this.os.selectedBtnName = this.os.buttonList[0]
        this.getOsChartData()
      },
      initTopAppVersion () {
        this.topAppVersion.selectedBtnName = this.topAppVersion.buttonList[0]
        this.topAppVersion.selectedOsBtnName = this.topAppVersion.osButtonList[0]
        this.topAppVersion.progressInfoData = []
        this.topAppVersion.isLoading = true
        this.getTopAppVersionChartData({ filterNm1: this.topAppVersion.filterNm1List[this.topAppVersion.selectedBtnName] })
      },
      async getOsChartData () {
        this.os.isLoading = await true
        await this.mixinGetChartData({
          req: this.mixinReq({objectId: this._apiReqObjIdList[6]}),
          actionsName: types.GET_CHART_DATA,
          routeName: 'os'
        }).then((result) => {
          this.os.buttonList.forEach((btnName, index) => {
            const copyApiResult = _.cloneDeep(result.data)
            const copyChartDataList = _.cloneDeep(copyApiResult.chartDataList)
            const prefix = btnName === 'DAU' ? 'dau' : btnName === 'MAU'? 'mau' : 'sale'
            const tmp = _.cloneDeep(copyApiResult)
            tmp.chartDataList = _.cloneDeep(copyApiResult.chartDataList).filter( item => {
              return item.kpi.displayName.split('_')[0] === prefix
            })
            this.os.apiResults[btnName] = _.cloneDeep(tmp)

            const tmpRate = _.cloneDeep(copyApiResult)
            tmpRate.chartDataList = _.cloneDeep(copyApiResult.chartDataList).filter( item => {
              return item.kpi.displayName.split('_').pop() === 'rate'
            })
            this.os.apiResults[`${btnName}_rate`] = _.cloneDeep(tmpRate)
          })
        })
        await this.getOsChartOption()
        this.os.isLoading = false
      },
      async getTopAppVersionChartData (reqParam) {
        this.topAppVersion.isLoading = await true
        await this.mixinGetChartData({
          req: this.mixinReq({objectId: this._apiReqObjIdList[7], range: 7, filterNm1: 'ALL'}),
          actionsName: types.GET_CHART_DATA,
          routeName: 'topAppVersion'
        }).then(async (result) => {
          await this.topAppVersion.buttonList.forEach((btnName, index) => {
            const copyApiResult = _.cloneDeep(result.data)
            const copyChartDataList = _.cloneDeep(copyApiResult.chartDataList)
            copyApiResult.chartDataList = copyChartDataList.filter( item => {
              return item.kpi.kpiName.includes(!index ? (this.isDaily ? 'dau' : 'mau') : 'sale')
            })
            // copyApiResult.chartDataList = editedChartDataList.filter( item => {
            //   return !item.kpi.kpiName.includes('rate')
            // })
            const iosData = _.cloneDeep(copyApiResult)
            iosData.chartDataList = _.cloneDeep(copyApiResult.chartDataList).filter( item => {
              return item.kpi.displayName.split(',')[0] === 'IOS'
            })
            this.topAppVersion.apiResults[this.topAppVersion.osButtonList[0]][btnName] = _.cloneDeep(iosData)

            const androidData = _.cloneDeep(copyApiResult)
            androidData.chartDataList = _.cloneDeep(copyApiResult.chartDataList).filter( item => {
              return item.kpi.displayName.split(',')[0] === 'AOS'
            })
            this.topAppVersion.apiResults[this.topAppVersion.osButtonList[1]][btnName] = _.cloneDeep(androidData)
          })
        })
        await this.getTopAppVersionChartOption(reqParam)
        this.topAppVersion.isLoading = await false
      },
      getOsChartOption () {
        const item = this.os.apiResults[this.os.selectedBtnName]
        if (!_.isEmpty(item)) {
          this.mixinMakeChart({
            actionsName: types.MAKE_PIE_CHART,
            actionsData: { chartData: item, typeName: types.DASHBOARD, cnt: -0.3 },
          }).then( (data) => {
            const tmp = _.merge(_.cloneDeep(this.os.options), data)
            tmp.series[0].center = ['50%', '40%']
            tmp.tooltip = this.os.tooltip
            this.os.options = tmp
          })
        }
      },
      getTopAppVersionChartOption (reqParam) {
        const item = _.cloneDeep(this.topAppVersion.apiResults[this.topAppVersion.selectedOsBtnName][this.topAppVersion.selectedBtnName])
        if (!_.isEmpty(item)) {
          const rateDataList = _.cloneDeep(item.chartDataList).filter( item => {
            return item.kpi.kpiName.includes('rate')
          })
          const rankDataList = _.cloneDeep(item.chartDataList).filter( item => {
            return item.kpi.kpiName.includes('rank')
          })
          item.chartDataList = _.cloneDeep(item.chartDataList).filter( item => {
            return !item.kpi.kpiName.includes('rate') && !item.kpi.kpiName.includes('rank')
          })
          item.chartDataList.forEach( (chartItem, index) => {
            item.chartDataList[index]['rate'] = rateDataList[index].dataList[rateDataList[index].dataList.length - 1]
            item.chartDataList[index]['rank'] = rankDataList[index].dataList[rankDataList[index].dataList.length - 1]
          })
          const tmpProgressInfoData = item.chartDataList.sort((a, b) => b.rate - a.rate).map( (subItem, index) => {
            return {
              name: subItem.kpi.displayName.split(',')[2],
              value: item.chartDataList[index].dataList[item.chartDataList[index].dataList.length - 1].toString(),
              percent: subItem.rate,
              // value: '50',
              // percent: 50,
              unit: '%',
              color: this.common.colors[index],
              isSales: reqParam.filterNm1 === this.topAppVersion.filterNm1List['Sales'] ? true : false
            }
          })
          this.topAppVersion.progressInfoData = tmpProgressInfoData //임시
          this.mixinMakeChart({
            actionsName: types.MAKE_LINE_CHART,
            actionsData: { chartData: item, typeName: null }
          }).then( (data) => {
            if (data && data.series.length > 0) {
              data.title = { text: '' }
              data.legend = this.topAppVersion.legend
              data.tooltip = this.topAppVersion.tooltip
              data.yAxis = { title: null }
              data.xAxis.categories = _.cloneDeep(data.xAxis.categories).map( item => item.split(';')[0])
              this.topAppVersion.options = data
              setTimeout( () => {
                this.topAppVersion.isLoading = false
              }, 500)
            }
          })
        }
      },
      async changeOsButtonItem (item) {
        if (this.os.selectedBtnName !== item) {
          this.os.isLoading = await true
          this.os.selectedBtnName = item
          this.getOsChartOption()
          this.os.isLoading = await false
        }
      },
      async changeTopAppVersionButtonItem (item) {
        if (_.includes(this.topAppVersion.buttonList, item)) {
          if (this.topAppVersion.selectedBtnName !== item) {
            this.topAppVersion.isLoading = await true
            this.topAppVersion.selectedBtnName = item
            this.getTopAppVersionChartData({ filterNm1: this.topAppVersion.filterNm1List[this.topAppVersion.selectedBtnName] })
            this.topAppVersion.isLoading = await false
          }
        } else if (_.includes(this.topAppVersion.osButtonList, item)){
          if (this.topAppVersion.selectedOsBtnName !== item) {
            this.topAppVersion.isLoading = await true
            this.topAppVersion.selectedOsBtnName = item
            this.getTopAppVersionChartData({ filterNm1: this.topAppVersion.filterNm1List[this.topAppVersion.selectedBtnName] })
            this.topAppVersion.isLoading = await false
          }
        }
      },
      async windowResize () {
        this.os.isLoading = await true
        this.os.isLoading = await false
        // setTimeout( async () => {
        //   this.topAppVersion.isLoading = await true
        //   this.topAppVersion.isLoading = await false
        // }, 500)
      }
    }
  }
</script>
