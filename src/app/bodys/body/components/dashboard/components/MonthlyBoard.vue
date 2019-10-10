<template>
  <div class="chart_grid_section">
    <summary-area
      :summaryApiList="env.apiList.summary"/>
    <trend-chart-area
      :menuNameList="env.trendChartMenuNameList" />
    <platform-and-country-area />
    <os-and-top-app-version-area />
    <user-type-area
      :userTypeApiList="env.apiList.userType"/>
    <active-total-data-and-revenue-kpi-area v-if="revenue"
      :activeApiList="env.apiList.active"
      :revenueApiList="env.apiList.revenue" />
    <active-total-data-and-per-user-type-area v-else
      :activeApiList="env.apiList.active" />
    <paying-user-and-product-top-ten-area v-if="revenue" />
    <!-- <active-user-monthly-trend-area />
    <paying-user-monthly-trend-area v-if="hasRevenue" /> -->
  </div>
</template>

<script>
  import * as types from '@/shared/stores/types'
  import { mapActions, mapState } from 'vuex'
  import SummaryArea from './areas/SummaryArea'
  import TrendChartArea from  './areas/TrendChartArea'
  import PlatformAndCountryArea from './areas/PlatformAndCountryArea'
  import OsAndTopAppVersionArea from './areas/OsAndTopAppVersionArea'
  import UserTypeArea from './areas/UserTypeArea'
  import ActiveTotalDataAndPerUserTypeArea from './areas/ActiveTotalDataAndPerUserTypeArea'
  import ActiveTotalDataAndRevenueKpiArea from './areas/ActiveTotalDataAndRevenueKpiArea'
  import PayingUserAndProductTopTenArea from './areas/PayingUserAndProductTopTenArea'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'
  export default {
    name: 'MonthlyBoard',
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
      ActiveTotalDataAndRevenueKpiArea,
      PayingUserAndProductTopTenArea
    },
    watch: {},
    data () {return {
      env: {},
      exceptMixinWatch: true,
    }},
    computed: {
      ...mapState({
        _env: state => state.dashboard._env.monthly,
      })
    },
    created () {
      this.env = this.revenue ? this._env.userAndRevenue : this._env.user
      this[types.SET_DASHBOARD_STATE]({ stateName: 'moreDetail', stateValue: this.env.moreDetail })
      this[types.SET_DASHBOARD_STATE]({ stateName: 'glossaryBase', stateValue: this.env.glossaryBase })
    },
    mounted () {},
    methods: {}
  }
</script>
