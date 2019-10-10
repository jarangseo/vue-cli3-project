<template>
  <div class="inner_chart_grid">
    <!-- [D] 100% chart 일 경우, chart_area에 추가 클래스 없음. -->
    <!-- [D] 50% chart 2개 일 경우, chart_area에 half 클래스 추가 필요 -->
    <!-- [D] 33.3%, 66,7% chart 일 경우, chart_area에 type_ratio 클래스 추가 필요 -->
    <!-- [D] 33.3% chart 3개일 경우 chart_area에 triple 클래스 추가 필요 -->
    <!-- [D] user&revenue 최상단 차트는 summary 클래스 추가 필요 -->
    <div class="chart_area summary get_height_summary_area">
      <ul>
        <li v-for="(item, index) in summaryApiList.vertical"
          :key="`summary-vertical-${index}`">
          <div class="chart_section" :style="`height:${height} !important`">
            <div class="chart_info_area type_revenue">
              <div class="chart_middle_gride">
                <basic-info-chart
                  :data="_summaryData.vertical[item]"
                  :direction="'vertical'"
                  :name="item"
                  :objId="_apiReqObjIdList[1]" />
              </div>
            </div>
          </div>
        </li>
        <!-- [D] 영역내 챠트가 상하로 나눠질 경우 type_horizon 클래스 추가필요 -->
        <li class="type_horizon">
          <div class="chart_section">
            <div class="chart_info_area type_revenue">
              <div class="chart_middle_gride">
                <ul>
                  <li v-for="(item, index) in summaryApiList.horizon"
                    :key="`summary-horizon-${index}`">
                    <!-- :class="{'notPaddingLeft': isNotReadyChartData(item, index)}" -->
                    <basic-info-chart 
                      :data="_summaryData.horizon[item]"
                      :name="item"
                      :direction="'horizon'" />
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
  import _ from 'lodash'
  import { mapActions, mapState } from 'vuex'
  import BasicInfoChart from '../charts/BasicInfoChart'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'
  export default {
    name: 'SummaryArea',
    mixins: [ dashboardMixin ],
    props: {
      summaryApiList: {
        type: Object,
        required: false,
        default: []
      }
    },
    components: {
      BasicInfoChart
    },
    watch: {
    },
    data () {return {
      height: ''
    }},
    computed: {
      ...mapState({
        _summaryData: state => state.dashboard._numberTypeData['summary'],
        _apiReqObjIdList: state => state.dashboard._apiReqObjIdList
      }),
    },
    created () {
      this.init()
    },
    mounted () {
      this.height = `${document.getElementsByClassName('get_height_summary_area')[0].offsetHeight}px`
    },
    methods: {
      init () {
        this.initVertical()
        this.initHorizon()
      },
      initVertical () {
        // this._summaryData.vertical = {}
        this.summaryApiList.vertical.forEach( (item, index) => {
          this._summaryData.vertical[item] = {}
        })
        this.getSummaryVerticalData()
      },
      initHorizon () {
        // this._summaryData.horizon = {}
        this.summaryApiList.horizon.forEach( (item, index) => {
          this._summaryData.horizon[item] = {}
        })
        this.getSummaryHorizonData()
      },
      getSummaryVerticalData () {
        this[types.GET_BASIC_INFO_DATA]({
          route: 'summary', type: 'vertical', req: this.mixinReq({objectId: this._apiReqObjIdList[1]})
        })
      },
      getSummaryHorizonData () {
        this[types.GET_BASIC_INFO_DATA]({
          route: 'summary', type: 'horizon', req: this.mixinReq({objectId: this._apiReqObjIdList[2][1]})
        })
      },
      isNotReadyChartData (item, index) {
        return _.isEmpty(this._summaryData.horizon[item])
      },
    }
  }
</script>
<style scoped>
.notPaddingLeft {
  padding-left: 0% !important;
}
</style>
