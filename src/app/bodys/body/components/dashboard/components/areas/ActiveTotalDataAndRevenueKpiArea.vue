<template>
  <div class="inner_chart_grid">
    <div class="chart_area type_ratio">
      <ul>
        <li class="ratio_one type_horizon">
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
        <li class="ratio_two type_horizon">
          <div class="chart_section">
            <div class="chart_info_area type_revenue">
              <div class="chart_top_info">
                <p class="chart_name">
                  <span>Revenue KPI</span>
                  <a class="btn_ico_help" @click="mixinToggleAboutThisChart({type: 'chart', data: revenueKpi.tooltip,})"><span class="blind">help</span></a>
                </p>
              </div>
              <div class="chart_middle_gride">
                <ul>
                  <li class="custom_padding_edit" v-for=" (item, index) in revenueApiList" :key="`userType_${index}`">
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
      </ul>
    </div>
  </div>
</template>
<script>
  import * as types from '@/shared/stores/types'
  import { mapActions, mapState } from 'vuex'
  import BasicInfoChart from '../charts/BasicInfoChart'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'

  export default {
    name: 'ActiveTotalDataAndRevenueKpiArea',
    mixins: [ dashboardMixin ],
    props: {
      activeApiList: {
        type: Array,
        required: false,
        default: []
      },
      revenueApiList: {
        type: Array,
        required: false,
        default: []
      }
    },
    components: {
      BasicInfoChart
    },
    watch: {},
    data () {
      return {
        revenueKpi: {
          name: 'revenueKpi',
          tooltip: { chartName: '', dimension: [], kpi: [] },
        },
        activeData: {name: 'activeData'}
      }
    },
    computed: {
      ...mapState({
        _activeData: state => state.dashboard._numberTypeData['active'],
        _revenueKpiData: state => state.dashboard._numberTypeData.revenue,
        _apiReqObjIdList: state => state.dashboard._apiReqObjIdList
      }),
    },
    created () {
      this.init()
    },
    mounted () {},
    methods: {
      ...mapActions([
        types.GET_BASIC_INFO_DATA,
        types.GET_CHART_DATA,
      ]),
      init () {
        this.initActiveTotal()
        this.initRevenueKpi()
      },
      initActiveTotal () {
        // this._activeData.total = {}
        this.activeApiList.forEach( (item, index) => {
          this._activeData.total[item] = {}
        })
        this.getActiveTotalData()
      },
      initRevenueKpi () {
        this.mixinGetTooltip({ areaName: 'revenueKpi'})
        this.revenueApiList.forEach( item => {
          this._revenueKpiData[item] = {}
        })
        this.getRevenueKpiData()
      },
      getActiveTotalData () {
        this[types.GET_BASIC_INFO_DATA]({
          req: this.mixinReq({objectId: this._apiReqObjIdList[2][2]}),
          route: 'active',
          type: 'total'
        })
      },
      getRevenueKpiData () {
        this.revenueApiList.forEach( (item, index) => {
          this[types.GET_BASIC_INFO_DATA]({
            req: this.mixinReq({objectId: this._apiReqObjIdList[10][index + 1], range: 1}),
            route: 'revenue',
            type: item,
            currency: (this.me.currency === 'usd') ? '$' : (this.me.currency === 'jpy') ? '¥' : '₩'
          })
        })
      }
    }
  }
</script>
<style scoped>
.custom_padding_edit {
  padding: 21px 20px 20px 50% !important;
}
</style>
