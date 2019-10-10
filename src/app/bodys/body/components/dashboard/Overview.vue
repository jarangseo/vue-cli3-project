<template>
   <div class="content">
    <div class="inner_content">
      <dashboard-header />
      <dashboard-right-panel />
      <div class="content_section">
        <div class="inner_content_section">
          <daily-board v-if="!isLoading && isDaily && isReady && !isResize"
            :revenue="$route.query.revenue === 'true' ? true : false"/>
          <monthly-board v-else-if="!isLoading && !isDaily && isReady && !isResize"
            :revenue="$route.query.revenue === 'true' ? true : false"/>
        </div>
      </div>
      <footer-panel />
    </div>
  </div>
</template>

<script>
  import * as types from '@/shared/stores/types'
  import { mapActions, mapState, mapMutations } from 'vuex'
  import Highcharts from 'highcharts'
  import DashboardHeader from './components/common/DashboardHeader'
  import DashboardRightPanel from './components/common/DashboardRightPanel'
  import DailyBoard from './components/DailyBoard'
  import MonthlyBoard from './components/MonthlyBoard'
  import FooterPanel from '@/app/bodys/body/layout/FooterPanel'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'
  import '@/assets/css/tooltip/vtooltip.css'
  Highcharts.setOptions({ chart: { style: { fontFamily: 'Roboto' }, spacingBottom: 20 } });
  export default {
    name: 'Overview',
    mixins: [ dashboardMixin ],
    props: {},
    components: {
      DashboardHeader,
      DashboardRightPanel,
      DailyBoard,
      MonthlyBoard,
      FooterPanel,
    },
    watch: {
      me (newMe, oldMe) {
        if (newMe !== oldMe) this.init()
      },
      '$route.params.projectId' (d, n) {
        // this.isHeaderShow = false
        this.init()
        // setTimeout( () => {
        //   this.isHeaderShow = true
        // }, 200)
      },
      '$route.query.menuId' (d, n) {
        this.init()
      },
      '$route.name' (d) {
        // this.init()
      }
    },
    data () {return {
      isLoading: true,
      isResize: false,
      isHeaderShow: true,
      exceptMixinWatch: true
    }},
    computed: {
      ...mapState({
        me: state => state.common._me,
        isDaily: state => state.dashboard.isDaily,
        hasRevenue: state => state.dashboard.hasRevenue,
        _currentDates: state => state.dashboard._currentDates,
      }),
      isReady () {
        // return !_.isEmpty(this.language) && !_.isEmpty(this.currency)
        return !_.isEmpty(this._currentDates.endDate)
      }
    },
    created () {
      // this.$route
      this.init()
    },
    mounted () {
      this.mixinCheckNavMenuTransitionDuration()
    },
    methods: {
      ...mapMutations([
        types.SET_DASHBOARD
      ]),
      async init () {
        this.isLoading = await true
        await this[types.SET_DASHBOARD]({
          isDaily: (this.$route.query.daily) ? (this.$route.query.daily === 'true') : false,
          hasRevenue: (this.$route.query.revenue) ? (this.$route.query.revenue === 'true') : false
        })
        await setTimeout( () => {
          this.isLoading = false
        }, 100)
      },
    }
  }
</script>
