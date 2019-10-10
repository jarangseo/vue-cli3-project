<template>
  <div class="inner_chart_grid">
    <div class="chart_area">
      <ul>
        <li>
          <div class="chart_section">
            <div class="chart_info_area type_realtime">
              <!-- [D] 차트네임 옆에 드롭박스 영역 추가시 type_inline 추가 필요 -->
              <div class="chart_top_info type_inline">
                <!-- [D] chart_name는 최대 45자 까지만 노출 -->
                <p class="chart_name">
                  <span>{{ chartName }}</span>
                  <a class="btn_ico_help" @click="mixinToggleAboutThisChart({ type: 'chart', data: realtimeLive.tooltip })"><span class="blind">help</span></a>
                </p>
                <basic-info-simple-chart
                  v-if="realtimeLive.infoData.trendData[0]"
                  :data="realtimeLive.infoData"/>
              </div>
              <div class="chart_middle_gride">
                <loading-bar 
                  :is-show-loading="!realtimeLive.isLoading" 
                  class="inner_chart_area get_height_realtime_au_area"
                  style="min-height: 250px !important;"/>
                <div
                  v-if="!realtimeLive.isLoading"
                  class="inner_chart_area get_height_realtime_au_area">
                  <div
                    v-if="!realtimeLive.isLoading && realtimeLive.options.series[0].data.length === 0"
                    :style="`height:${realtimeLive.height};text-align:center;line-height:${realtimeLive.height};`">
                    NoData
                  </div>
                  <!-- [D] 실제 chart 가 적용되는 영역(img tag 삭제 후 적용 부탁드립니다.) -->
                  <live-data-chart
                    v-if="!realtimeLive.isLoading && realtimeLive.height
                    && realtimeLive.options.series[0].data && realtimeLive.options.series[1].data"
                    :options="realtimeLive.options"
                    :height="realtimeLive.height"/>
                </div>
                <time-line-selector
                  v-if="!realtimeLive.isLoading && realtimeLive.req.endDate && !realtimeLive.timeLineLoading
                  && realtimeLive.options.series[0].data && realtimeLive.options.series[1].data"
                  class="time_line"
                  :newDate="realtimeLive.req.endDate"
                  :initTimeType="realtimeLive.timeLineStart.type"
                  :initTimeValue="realtimeLive.timeLineStart.value"
                  :parent="parentName"
                  @changeTimeLineRange="changeTimeLineRange"/>
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
  import LiveDataChart from '../charts/LiveDataChart'
  import BasicInfoSimpleChart from '../charts/BasicInfoSimpleChart'
  import LoadingBar from '@/app/bodys/body/components/common/LoadingBar'
  import Highcharts from 'highcharts'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'
  import moment from 'moment'
  import TimeLineSelector from '../common/TimeLineSelector'
  import { util } from '@/shared/utils/util'
  import { setInterval } from 'timers';
  
  export default {
    name: 'RealtimeLiveDataArea',
    mixins: [ dashboardMixin ],
    props: {
      chartName: {
        type: String,
        required: true,
        default: 'noName'
      },
      projectId: {
        type: String,
        required: true,
        default: () => {
          return ''
        }
      },
      reportId: {
        type: Number,
        required: true,
        default: () => {
          return 0
        }
      },
      objectId: {
        type: Number,
        required: true,
        default: () => {
          return 0
        }
      },
      glossaryId: {
        type: Number,
        required: true,
        default: () => {
          return 0
        }
      }
    },
    components: {
      LiveDataChart,
      BasicInfoSimpleChart,
      LoadingBar,
      TimeLineSelector
    },
    watch: {
      async _isOpenMenu (isOpen) {
        this.mixinResize({ name: this.realtimeLive.name, className: 'get_height_realtime_au_area' })
      }
    },
    data () {
      return {
        exceptMixinWatch: true,
        realtimeLive: {
          name: 'realtimeLive',
          isLoading: false,
          timeLineLoading: false,
          tooltip: { chartName: '', dimension: [], kpi: [] },
          beforeTimeLineStart: {type: 'h', value: 2},
          timeLineStart: {type: 'h', value: 2}, // 초기 설정은 2시간 범위.
          dataRange: 60 * 2,
          height: '',
          dateFormat: 'YYYYMMDD HHmm', // [주의] 서버 스펙 상, YYYYMMDD 와 HHmm 사이에 공백이 필요하다고 함.
          req: {
            byDimension: '',
            endDate: '',
            filter: {},
            merged: true,
            objectId: this.objectId,
            projectId: this.projectId,
            reportId: this.reportId,
            settings: {},
            startDate: ''
          },
          resp: {},
          infoData: {
            name: '',
            signTxt: '',
            trendData: [
              // {
              // code:"D",
              // days:"20190401",
              // over:"71995",
              // status:"increase",
              // type:"daily",
              // value:"17.84"
              // }
            ],
            unitTxt: '',
            value: -1
          },
          options: {
            chart: {
              type: 'spline',
              // animation: false
              // width: 0,
            },
            title: {
              text: null
            },
            series: [
              {
                type: 'spline',
                dashStyle: 'solid',
                lineWidth: 1,
                lineColor: '#52afff',
                marker: {
                  enabled: false,
                  radius: 3
                },
                zIndex: 2,
                data: []
              },
              {
                dashStyle: 'dash',
                lineWidth: 1,
                lineColor: '#52afff',
                marker: {
                  enabled: false
                },
                zIndex: 1,
                data: []
              }
            ],
            // data: {
            //   // csvURL: this.csv ? 'https://demo-live-data.highcharts.com/time-data.csv' : '',
            //   csv: '',
            //   enablePolling: false,
            //   dataRefreshRate: 3
            // },
            yAxis: {
              title: '',
              visible: true
            },
            xAxis: {
              type: 'category', //datetime, category
              labels: {
                formatter: function () {
                  // console.log('this: ', this)
                  // return `${moment(this.value.trim()).format('MM/DD HH:mm')}`
                  try {
                    return `${moment(this.value.trim()).format('MM/DD HH:mm')}`
                  } catch (e) {
                    return `${moment(new Date(this.value)).format('MM/DD HH:mm')}`
                  }
                }
              },
              tickInterval: 10,
              tickPositions: []
            },
            legend: {
              enabled: false,
            },
            tooltip: {
              formatter: function () {
                const numberWithCommas = (value) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                return `<b>${moment(this.key, 'YYYY-MM-DD HH:mm').subtract(this.colorIndex ? 1 : 0, 'd').format('YYYY-MM-DD HH:mm')}</b><br/>${this.series.userOptions.currency}${numberWithCommas(this.y)}`
              }
            }
          }
        }
      }
    },
    computed: {
      ...mapState({
      }),
      parentName () {
        return `${this.chartName.replace(/ /gi, '')}_${util.generateUUID()}`
      }
    },
    created () {
      this.init()
    },
    mounted () {
      if (document.getElementsByClassName('get_height_realtime_au_area').length > 0) {
        this.realtimeLive.height = `${document.getElementsByClassName('get_height_realtime_au_area')[0].offsetHeight}px`
      }
    },
    methods: {
      ...mapActions([
        types.GET_REALTIME_LIVE_DATA
      ]),
      init () {
        this.initLiveDataChart()
        // setInterval(() => { this.initLiveDataChart() }, 10000) // [to-do] 테스트 코드
        this.mixinGetGlossary({ids: this.glossaryId}).then(res => {
          this.realtimeLive.tooltip.chartName = this.chartName
          this.realtimeLive.tooltip.kpi = res
        })
      },
      initLiveDataChart () {
        if (this.reportId && this.objectId) {
          // this.realtimeLive.req = _.merge(_.cloneDeep(this.realtimeLive.req), _.cloneDeep(this.propsReq))
          // this.realtimeLive.req.objectId = this.objectId
          this.realtimeLive.req.endDate = moment(this._currentDates.selectedDates ? this._currentDates.selectedDates : new Date(), 'YYYY-MM-DD HH:mm').format('YYYYMMDD HHmm')
          // this.realtimeLive.req.endDate = `20190808 ${ moment(new Date()).format('HHmm') }` // 현재 실시간 데이터가 존재 하지 않아서, 강제로 날짜 지정 함. (추후 수정, 윗줄 코드 사용)
          this.getRealtimeLiveChartOption()
        }
      },
      async getRealtimeLiveChartOption () {
        this.realtimeLive.infoData.trendData = []
        this.realtimeLive.isLoading = await true
        await this.setRequestStartDate()
        await this[types.GET_REALTIME_LIVE_DATA]({req: this.realtimeLive.req}).then( res => {
          if (res.data) {
            this.resp = _.cloneDeep(res)
            this.setObjectDataByRange()
          } else {
            this.realtimeLive.isLoading = false
            console.error('res.data is not exist - res: ', res)
          }
        })
        this.realtimeLive.isLoading = await false
      },
      changeTimeLineRange(data) {
        if (this.realtimeLive.timeLineStart.type !== data.type || this.realtimeLive.timeLineStart.value !== data.value) {
          this.realtimeLive.beforeTimeLineStart = _.cloneDeep(this.realtimeLive.timeLineStart)
          this.realtimeLive.timeLineStart = data
          this.setObjectDataByRange()
          // this.getRealtimeLiveChartOption()
        }
      },
      async setObjectDataByRange () {
        if (!_.isEmpty(this.resp) && !_.isEmpty(this.resp.data.xAxisList) && _.last(this.resp.data.xAxisList) !== null) {
          const res = _.cloneDeep(this.resp)
          this.realtimeLive.infoData.trendData = []
          this.realtimeLive.req.endDate = moment(_.last(res.data.xAxisList), this.realtimeLive.dateFormat).format('YYYYMMDD HHmm')
          this[types.SET_DASHBOARD_STATE]({
            stateName: ['_realtimeEnv', 'realtimeDateTime'],
            stateValue: moment(this.realtimeLive.req.endDate, this.realtimeLive.dateFormat).format('YYYY-MM-DD HH:mm')
          })
          const startDate = moment(_.last(res.data.xAxisList), this.realtimeLive.dateFormat)
                            .subtract(this.realtimeLive.timeLineStart.value, _.lowerCase(this.realtimeLive.timeLineStart.type))
                            .format(this.realtimeLive.dateFormat)
          // let startIndex = _.findIndex(res.data.xAxisList, (item) => item === startDate)
          const tmp = res.data.xAxisList.filter( item => item.trim() >= startDate.trim())
          let startIndex = _.findIndex(res.data.xAxisList, (item) => item === tmp[0])
          // 선택한 날짜 범위 데이터가 없으면, 직전 범위 데이터로 되돌아가도록 함.
          if (startIndex < 0) {
            this.realtimeLive.timeLineStart = this.realtimeLive.beforeTimeLineStart
            this.realtimeLive.timeLineLoading = await true
            startIndex = 0
            // if (startDate) await this.setObjectDataByRange()
            return false
            // console.log(`[개발 임시메시지] 선택한 범위에 데이터가 존재하지 않음. LOG-> 가장 오래된 데이터가 존재하는 날짜: ${moment(res.data.xAxisList[0], this.realtimeLive.dateFormat).format('YYYY-MM-DD HH:mm')}`)
          }
          const endIndex = res.data.xAxisList.length
          // const totalRangeMinute = this.realtimeLive.timeLineStart.value * (this.realtimeLive.timeLineStart.type === 'h' ? 60 : 1440)
          // console.log('this.realtimeLive.timeLineStart.type: ', this.realtimeLive.timeLineStart.type)
          // console.log('this.realtimeLive.timeLineStart.value: ', this.realtimeLive.timeLineStart.value)
          // console.log('totalRangeMinute: ', totalRangeMinute)

          // this.realtimeLive.options.xAxis.tickInterval = this.realtimeLive.timeLineStart.type === 'h' || this.realtimeLive.timeLineStart.type === 'now'?
          //                                               (this.realtimeLive.timeLineStart.value < 12 ? 10 : 60) : 60 * 12
          if (this.realtimeLive.timeLineStart.type === 'h' || this.realtimeLive.timeLineStart.type === 'now') {
            this.realtimeLive.options.xAxis.tickInterval = this.realtimeLive.timeLineStart.value < 12 ? 10 : 30
            this.realtimeLive.options.xAxis.tickPositions = null
          }
          else if (this.realtimeLive.timeLineStart.type === 'm') {
            this.realtimeLive.options.xAxis.tickInterval = 2
            this.realtimeLive.options.xAxis.tickPositions = null
          }else {
            this.realtimeLive.options.xAxis.tickInterval = null
            this.realtimeLive.options.xAxis.tickPositions = []
            res.data.xAxisList.forEach( (item, index) => {
              // if (item.includes(' 0000')) console.log('item: ', item)
              (item.includes(' 0000') || item.includes(' 0600') || item.includes(' 1200') || item.includes(' 1800')) ? this.realtimeLive.options.xAxis.tickPositions.push(index) : false
            })
            // console.log('this.realtimeLive.options.xAxis.tickPositions: ', this.realtimeLive.options.xAxis.tickPositions)
          }
          // 초기화
          if (res.data.chartDataList.length < 3) {
            if (res.data.chartDataList[2]) {
              res.data.chartDataList[2] = _.slice(_.cloneDeep(res.data.chartDataList[2].dataList), startIndex, endIndex)
            }
            res.data.chartDataList[1] = []
          }
          // X축 이름
          if (res.data.xAxisList) {
            this.realtimeLive.options.xAxis.categories = _.slice(res.data.xAxisList, startIndex, endIndex)
          } else {
            if (window.location.port === '8889') console.error('res.data.xAxisList is not exist - res.data: ', res.data)
          }
          // 오늘 데이터
          if (res.data.chartDataList[0].dataList) {
            this.realtimeLive.options.series[0].data = _.slice(res.data.chartDataList[0].dataList, startIndex, endIndex)
            this.realtimeLive.options.series[0]['currency'] = res.data.leftChartName.includes('Revenue') ? this.mixinGetSignTxt() : ''
          } else {
            if (window.location.port === '8889') console.error('res.data.chartDataList[0].dataList is not exist - res.data: ', res.data)
          }
          // 어제 데이터
          if (res.data.chartDataList[1].dataList) {
            this.realtimeLive.options.series[1].data = _.slice(res.data.chartDataList[1].dataList, startIndex, endIndex)
            this.realtimeLive.options.series[1]['currency'] = res.data.leftChartName.includes('Revenue') ? this.mixinGetSignTxt() : ''
          } else {
            if (window.location.port === '8889') console.error('res.data.chartDataList[1].dataList is not exist - res.data: ', res.data)
          }
          // 비율 데이터 - 툴팁데이터 세팅
          if (res.data.chartDataList[2] && res.data.chartDataList[2].dataList) {
            const todayTrendDataValue = _.last(this.realtimeLive.options.series[0].data)
            const todayTrendDataRate = _.last(_.slice(res.data.chartDataList[2].dataList, startIndex, endIndex))
            const yesterdayTrendDataValue = _.last(this.realtimeLive.options.series[1].data)
            this.realtimeLive.infoData.value = todayTrendDataValue
            this.realtimeLive.infoData.signTxt = res.data.leftChartName.includes('Revenue') ? this.mixinGetSignTxt() : ''
            this.realtimeLive.infoData.trendData.push({
              code: "D",
              days: _.toString(_.last(res.data.xAxisList)),
              over: _.toString(yesterdayTrendDataValue),
              status: todayTrendDataRate > 0 ? "increase" :
                      todayTrendDataRate < 0 ? "decrease" : "maintain",
              type: "daily",
              value: _.toString(todayTrendDataRate ? todayTrendDataRate : 0),
              signTxt: res.data.leftChartName.includes('Revenue') ? this.mixinGetSignTxt() : ''
            })
          } else {
            this.realtimeLive.infoData.value = ''
            this.realtimeLive.infoData.trendData.push({
              code: "D",
              days: _.toString(_.last(res.data.xAxisList)),
              over: '',
              status: "maintain",
              type: "daily",
              value: '',
              signTxt: res.data.leftChartName.includes('Revenue') ? this.mixinGetSignTxt() : ''
            })
            if (window.location.port === '8889') console.error('res.data.chartDataList[2].dataList is not exist - res.data: ', res.data)
          }
          this.realtimeLive.timeLineLoading = await false
        } else {
          if (window.location.port === '8889') {
            if (_.isEmpty(this.resp)) console.error('setObjectDataByRange 작동 실패 / !_.isEmpty(this.resp) - this.resp: ', this.resp)
            if (_.isEmpty(this.resp.data.xAxisList)) console.error('setObjectDataByRange 작동 실패 / !_.isEmpty(this.resp.data.xAxisList)  - this.resp: ', this.resp)
            if (_.last(this.resp.data.xAxisList)) console.error('setObjectDataByRange 작동 실패 / !_.last(this.resp.data.xAxisList) - this.resp: ', this.resp)
          }
        }
      },
      setRequestStartDate () {
        this.realtimeLive.req.startDate = moment(this.realtimeLive.req.endDate, this.realtimeLive.dateFormat)
                                          .subtract(this.realtimeLive.timeLineStart.value, _.lowerCase(this.realtimeLive.timeLineStart.type))
                                          .format(this.realtimeLive.dateFormat)
      },
      async windowResize () {
        this.realtimeLive.isLoading = await true
        this.realtimeLive.isLoading = await false
      }
    }
  }
</script>

