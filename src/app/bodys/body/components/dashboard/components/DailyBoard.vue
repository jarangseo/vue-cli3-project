<template>
  <div class="chart_grid_section">
    <summary-area
      :summaryApiList="env.apiList.summary" />
    <trend-chart-area
      :menuNameList="env.trendChartMenuNameList" />
    <platform-and-country-area />
    <os-and-top-app-version-area />
    <user-type-area
      :userTypeApiList="env.apiList.userType" />
    <active-total-data-and-per-user-type-area
      :activeApiList="env.apiList.active" />
    <retention-rate-area />
    <revenue-kpi-and-paying-user-area v-if="revenue"
      :revenueApiList="env.apiList.revenue" />
    <product-top-ten-and-paying-user-details-area v-if="revenue"
      :payingUserDetailsApiList="env.apiList.payingUserDetails" />
  </div>
</template>

<script>
  import * as types from '@/shared/stores/types'
  import { mapActions, mapState, mapMutations } from 'vuex'
  import SummaryArea from './areas/SummaryArea'
  import TrendChartArea from  './areas/TrendChartArea'
  import PlatformAndCountryArea from './areas/PlatformAndCountryArea'
  import OsAndTopAppVersionArea from './areas/OsAndTopAppVersionArea'
  import UserTypeArea from './areas/UserTypeArea'
  import ActiveTotalDataAndPerUserTypeArea from './areas/ActiveTotalDataAndPerUserTypeArea'
  import RetentionRateArea from './areas/RetentionRateArea'
  import RevenueKpiAndPayingUserArea from './areas/RevenueKpiAndPayingUserArea'
  import ProductTopTenAndPayingUserDetailsArea from './areas/ProductTopTenAndPayingUserDetailsArea'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'
  export default {
    name: 'DailyBoard',
    mixins: [ dashboardMixin ],
    props: {
      revenue: {
        type: Boolean,
        required: false,
        default: true
      }
    },
    components: {
      SummaryArea,
      TrendChartArea,
      PlatformAndCountryArea,
      OsAndTopAppVersionArea,
      UserTypeArea,
      ActiveTotalDataAndPerUserTypeArea,
      RetentionRateArea,
      RevenueKpiAndPayingUserArea,
      ProductTopTenAndPayingUserDetailsArea
    },
    watch: {},
    data () {return {
      env: {},
      exceptMixinWatch: true
    }},
    computed: {
      ...mapState({
        _env: state => state.dashboard._env.daily,
        moreDetail: state => state.dashboard.moreDetail,
        glossaryBase: state => state.dashboard.glossaryBase,
      })
    },
    created () {
      this.env = this.revenue ? this._env.userAndRevenue : this._env.user
      this[types.SET_DASHBOARD_STATE]({ stateName: 'moreDetail', stateValue: this.env.moreDetail })
      this[types.SET_DASHBOARD_STATE]({ stateName: 'glossaryBase', stateValue: this.env.glossaryBase })
    },
    mounted () {},
    methods: {
      ...mapMutations([
        types.SET_DASHBOARD_STATE
      ])
    }
  }
</script>
