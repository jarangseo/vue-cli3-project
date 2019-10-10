<template>
  <div class="inner_chart_grid">
    <div class="chart_area type_ratio">
      <ul>
        <!-- [D] li에 차트 width 330px인 경우 ratio_one, 680px인 경우 raio_two 클래스 추가해주세요 -->
        <li class="ratio_one type_horizon">
          <div class="chart_section">
            <div class="chart_info_area type_realtime">
              <div class="chart_middle_gride">
                <ul>
                  <li>
                      <basic-info-chart
                      :data="options[0]"
                      :direction="'horizon'"
                      :hasTrend="false"
                      :name="'HAU'"/>
                  </li>
                  <li>
                    <ul class="equal_division">
                      <li>
                        <basic-info-chart 
                        :data="options[1]"
                        :direction="'horizon'"
                        :hasTrend="false"
                        :name="'Min HAU'"/>
                      </li>
                      <li>
                        <basic-info-chart 
                        :data="options[2]"
                        :direction="'horizon'"
                        :hasTrend="false"
                        :name="'Max HAU'"/>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </li>
        <li class="ratio_two type_horizon">
          <div class="chart_section">
            <div class="chart_info_area type_realtime">
              <div class="chart_middle_gride">
                <ul>
                  <li>
                    <ul class="equal_division">
                      <li>
                        <basic-info-chart 
                          :data="options[3]"
                          :direction="'horizon'"
                          :name="hasRevenue ? 'DTH Revenue' : 'DTH AU'"/>
                      </li>
                      <li>
                        <basic-info-chart 
                          :data="options[4]"
                          :direction="'horizon'"
                          :name="hasRevenue ? 'DTH PU' : 'DTH First Open Count'"/>
                      </li>
                      <li>
                        <basic-info-chart 
                          :data="options[5]"
                          :direction="'horizon'"
                          :name="hasRevenue ? 'DTH Pay Count' : 'DTH NRU'"/>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <ul class="equal_division">
                      <li>
                        <basic-info-chart 
                          :data="options[6]"
                          :direction="'horizon'"
                          :name="hasRevenue ? 'DTH AU' : 'DTH Access Count'"/>
                      </li>
                      <li>
                        <basic-info-chart 
                          :data="options[7]"
                          :direction="'horizon'"
                          :name="hasRevenue ? 'DTH First Open Count' : 'DTH Access Time'"/>
                      </li>
                      <li>
                        <basic-info-chart 
                          :data="options[8]"
                          :direction="'horizon'"
                          :name="hasRevenue ? 'DTH NRU' : 'DTH PV'"/>
                      </li>
                    </ul>
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
  import LoadingBar from '@/app/bodys/body/components/common/LoadingBar'
  import Highcharts from 'highcharts'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'
  import moment from 'moment'
  import TimeLineSelector from '../common/TimeLineSelector'
  
  export default {
    name: 'RealtimeHourlyNumberArea',
    mixins: [ dashboardMixin ],
    props: {
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
      }
    },
    components: {
      BasicInfoChart,
      LoadingBar,
      TimeLineSelector
    },
    watch: {},
    data () {
      return {
        exceptMixinWatch: true,
        options: []
      }
    },
    computed: {
      ...mapState({
      })
    },
    created () {
      this.init()
    },
    mounted () {
    },
    methods: {
      ...mapActions([
        types.GET_REALTIME_TABLE_DATA
      ]),
      init () {
        this.getRealtimeHourlyData()
      },
      getRealtimeHourlyData () {
        // this.isLoading = true
        const endDate = moment(this._currentDates.selectedDates ? this._currentDates.selectedDates : new Date(), 'YYYY-MM-DD HH:mm').format('YYYYMMDD HHmm')
        const startDate = moment(endDate, 'YYYYMMDD HHmm').subtract(2, 'd').format('YYYYMMDD HHmm')
        const req = {
          "byDimension":"",
          "endDate": endDate,
          "filter":{},
          "merged":true,
          "objectId": this.objectId,
          "projectId": this.projectId,
          "reportId": this.reportId,
          "settings":{},
          "startDate": startDate
        }
        this[types.GET_REALTIME_TABLE_DATA]({req: req}).then(res => {
          // this.tableData.header.column = [...res.data.headerInfo.rowList, ...res.data.headerInfo.colCombinationList]
          // this.tableData.body.data = res.data.dataList
          // this.isLoading = false
          if (!_.isEmpty(res) && !_.isEmpty(res.data.dataList) && !_.isEmpty(res.data.headerInfo.colCombinationList)) {
            const columns = _.cloneDeep(res.data.headerInfo.colCombinationList)
            const dataList = _.cloneDeep(res.data.dataList[0]).slice(1, res.data.dataList[0].length)
            for ( let i = 0; i < 9; i ++ ) {
              this.options.push({
                name: columns[i],
                signTxt: '',
                trendData: [],
                unitTxt: '',
                value: Number(dataList[i])
              })
              if (i > 2) {
                this.options[i].trendData = [{
                  code:"D",
                  days: moment(this._currentDates.selectedDates, 'YYYY-MM-DD HH:mm').subtract(1, 'd'),
                  over: _.toString(Number(dataList[i + 6])),
                  status: Number(dataList[i]) > Number(dataList[i + 6]) ? 'increase' : Number(dataList[i]) < Number(dataList[i + 6]) ? 'decrease' : 'maintain',
                  type: "daily",
                  value: _.toString(Number(dataList[i + 12]))
                }]
              }
            }
            this.$emit('dateTime', res.data.dataList[0][0])
          } else {
            console.error('GET_REALTIME_TABLE_DATA - API 결과 데이터 존재 하지 않음.')
            for ( let i = 0; i < 9; i ++ ) {
              this.options.push({
                name: '',
                signTxt: '',
                trendData: [],
                unitTxt: '',
                value: 0
              })
              if (i > 2) {
                this.options[i].trendData = [{
                  code:"D",
                  days: '',
                  over: '',
                  status: 'maintain',
                  type: "daily",
                  value: ''
                }]
              }
            }
            if (window.location.port === '8889') debugger
          }
        })
      }
    }
  }
</script>
