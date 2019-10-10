<template>
   <div class="content">
    <div v-if="!isLoading"
      class="inner_content">
      <realtime-header />
      <dashboard-right-panel />
      <div class="content_section">
        <div class="inner_content_section">
          <div class="chart_grid_section">
            <div class="update_notice">
              <span class="badge_text">Realtime</span>
              <span class="time_info">{{ this._realtimeEnv.realtimeDateTime }}</span>
              <!-- <span class="time_info">{{ this._currentDates.selectedDates }}</span> -->
              <!-- <p class="notice_txt"><span class="ico_refresh"></span><a href="">데이터가 업데이트 되었습니다.페이지를 리로드하여 최신 데이터를 확인하세요.</a></p> -->
              <div class="notice_txt">
                <a class="ico_refresh" style="text-decoration: none;" @click="refreshLiveCharts"><span class="blind">refresh</span></a>
                <div class="tooltip">
                  <div class="tooltip_item">
                    Refresh
                    <!-- 데이터가 업데이트 되었습니다.<br />
                    페이지를 리로드하여 최신 데이터를 확인하세요. -->
                  </div>
                </div>
              </div>
            </div>
            <!-- 
            <realtime-au-area />
            <realtime-active-count-area v-if="!hasRevenue"/>
            <realtime-sales-area v-if="hasRevenue"/>
            <realtime-download-area />
            -->
            <realtime-live-data-area v-if="isReady && !refreshLiveChart && objectIds[0]"
              :chartName="'Realtime AU'"
              :projectId="projectId"
              :reportId="reportId"
              :glossaryId="199"
              :objectId="objectIds[0]"/>
            <realtime-live-data-area v-if="isReady && !refreshLiveChart && objectIds[1] && !hasRevenue"
              :chartName="'Realtime Access Count'"
              :projectId="projectId"
              :reportId="reportId"
              :glossaryId="203"
              :objectId="objectIds[1]"/>
            <realtime-live-data-area v-if="isReady && !refreshLiveChart && objectIds[1] && hasRevenue"
              :chartName="'Realtime Revenue'"
              :projectId="projectId"
              :reportId="reportId"
              :glossaryId="200"
              :objectId="objectIds[1]"/>
            <realtime-live-data-area v-if="isReady && !refreshLiveChart && objectIds[2]"
              :chartName="'Realtime First Open Count'"
              :projectId="projectId"
              :reportId="reportId"
              :glossaryId="201"
              :objectId="objectIds[2]"/>
          </div>

          <div class="chart_grid_section">
            <div class="update_notice">
              <span class="badge_text">Hourly</span>
              <span class="time_info">{{ `${this.hourlyTime}${this.hourlyTime ? ':00' : ''}` }}</span>
              <!-- <p class="notice_txt"><span class="ico_refresh"></span><a href="">데이터가 업데이트 되었습니다.페이지를 리로드하여 최신 데이터를 확인하세요.</a></p> -->
              <div class="notice_txt">
                <a class="ico_refresh" style="text-decoration: none;" @click="refreshHourlyCharts"><span class="blind">refresh</span></a>
                <div class="tooltip">
                  <div class="tooltip_item">
                    Refresh
                    <!-- 데이터가 업데이트 되었습니다.<br />
                    페이지를 리로드하여 최신 데이터를 확인하세요. -->
                  </div>
                </div>
              </div>
            </div>
            <!-- <realtime-user-today-area v-if="!refreshHourlyChart && !hasRevenue && _currentDates.selectedDates && objectIds[3]"
              :projectId="projectId"
              :reportId="reportId"
              :objectId="objectIds[3]"/> -->
            <realtime-hourly-number-area v-if="isReady && !refreshHourlyChart && _currentDates.selectedDates !== '' && objectIds[3]"
              :projectId="projectId"
              :reportId="reportId"
              :objectId="objectIds[3]"
              @dateTime="dateTime"/>
            <realtime-hourly-table-area v-if="isReady && !refreshHourlyChart && _currentDates.selectedDates !== '' && objectIds[4]"
              :projectId="projectId"
              :reportId="reportId"
              :objectId="objectIds[4]"/>
          </div>
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
  import RealtimeHeader from './components/common/RealtimeHeader'
  import DashboardRightPanel from './components/common/DashboardRightPanel'
  import RealtimeLiveDataArea from './components/areas/RealtimeLiveDataArea'
  import RealtimeHourlyNumberArea from './components/areas/RealtimeHourlyNumberArea'
  import RealtimeHourlyTableArea from './components/areas/RealtimeHourlyTableArea'
  import FooterPanel from '@/app/bodys/body/layout/FooterPanel'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'
  import '@/assets/css/tooltip/vtooltip.css'
  import moment from 'moment'
  import _ from 'lodash'
  Highcharts.setOptions({ chart: { style: { fontFamily: 'Roboto' }, spacingBottom: 20 } });
  export default {
    name: 'Realtime',
    mixins: [ dashboardMixin ],
    props: {},
    components: {
      RealtimeHeader,
      DashboardRightPanel,
      RealtimeLiveDataArea,
      RealtimeHourlyNumberArea,
      RealtimeHourlyTableArea,
      FooterPanel,
    },
    watch: {
      me (newMe, oldMe) {
        if (newMe !== oldMe && oldMe.currency) this.init()
      },
      '$route.query.revenue' (d) {
        this.init()
      },
      '$route.params.projectId' (d, n) {
        this.init()
      },
    },
    data () {return {
      isLoading: true,
      exceptMixinWatch: true,
      projectId: '',
      reportId: 0,
      objectIds: [],
      refreshLiveChart: false,
      refreshHourlyChart: false,
      hourlyTime: '',
      glossaryBaseRealtime: {
        user: {
          'Realtime AU': {
            chartName: 'Realtime AU',
            dimension: { ids: [] },
            kpi: { ids: [199] }
          },
          'Realtime Access Count': {
            chartName: 'Realtime Access Count',
            dimension: { ids: [] },
            kpi: { ids: [203] }
          },
          'Realtime First Open Count': {
            chartName: 'Realtime First Open Count',
            dimension: { ids: [] },
            kpi: { ids: [201] }
          },
        },
        userRevenue: {
          'Realtime AU': {
            chartName: 'Realtime AU',
            dimension: { ids: [] },
            kpi: { ids: [199] }
          },
          'Realtime Revenue': {
            chartName: 'Realtime Revenue',
            dimension: { ids: [] },
            kpi: { ids: [200] }
          },
          'Realtime First Open Count': {
            chartName: 'Realtime First Open Count',
            dimension: { ids: [] },
            kpi: { ids: [201] }
          },
        }
      },
    }},
    computed: {
      ...mapState({
        me: state => state.common._me,
        _projectInfo: state => state.project._projectInfo,
        hasRevenue: state => state.dashboard.hasRevenue,
        _currentDates: state => state.dashboard._currentDates,
        _realtimeEnv: state => state.dashboard._realtimeEnv,
      }),
      isReady () {
        return true
        // return !_.isEmpty(this.me.language) && !_.isEmpty(this.me.currency)
        // && !_.isEmpty(this.$route.params.projectId)
        // && !_.isEmpty(this.$route.query.menuId)
      }
    },
    created () {
      this.init()
    },
    mounted () {
      this.mixinCheckNavMenuTransitionDuration()
    },
    destroyed () {
      this.objectIds = []
    },
    methods: {
      ...mapActions([
        types.GET_REALTIME_PROJECT_INFO,
        types.GET_REALTIME_OBJECT_IDS,
      ]),
      ...mapMutations([
        types.SET_DASHBOARD,
        types.SET_DASHBOARD_CURRENT_DATES,
        types.SET_DASHBOARD_STATE,
      ]),
      async init () {
        this.isLoading = await true
        this.projectId = this.$route.params.projectId
        let query = _.cloneDeep(this.$route.query)
        if (this.projectId && query.menuId) {
          await this.setDateTime()
          this.objectIds = []
          this[types.GET_REALTIME_PROJECT_INFO]({
            projectId: this.$route.params.projectId,
            realTimeDataParam: this.$route.query.revenue === 'true' ? 'USERREVENUE' : 'USER'
          }).then( res => {
             if (!_.isEmpty(res)) {
              this.reportId = res.reportId
              this.objectIds = []
              res.byOverallObjectList.forEach( item => {
                this.objectIds.push(Number(item.id))
              })
            } else {
              console.error('types.GET_REALTIME_OBJECT_IDS API 결과 데이터가 존재 하지 않음.')
              if (window.location.port === '8889') debugger
            }
          })
          // this[types.GET_REALTIME_OBJECT_IDS]({projectId: this.$route.params.projectId, menuId: query.menuId, depth: 2}).then( res => {
          //   if (!_.isEmpty(res)) {
          //     this.reportId = res.reportId
          //     this.objectIds = []
          //     res.byOverallObjectList.forEach( item => {
          //       this.objectIds.push(Number(item.id))
          //     })
          //   } else {
          //     console.error('types.GET_REALTIME_OBJECT_IDS API 결과 데이터가 존재 하지 않음.')
          //     if (window.location.port === '8889') debugger
          //   }
          // })
          this[types.SET_DASHBOARD]({
            isDaily: true,
            hasRevenue: (this.$route.query.revenue) ? (this.$route.query.revenue === 'true') : false,
            language: this.me.language,
            currency: this.me.currency
          })
        } else {
          console.error('Realtime init() 실패 > projectId: ', this._projectInfo.projectId, ' / menuId: ', query.menuId)
          if (window.location.port === '8889') debugger
        }
        this.isLoading = await false
      },
      setDateTime () {
        this[types.SET_DASHBOARD_CURRENT_DATES]({
          dateCode: [],
          startDate: [],
          endDate: [],
          selectedDates: moment().format('YYYY-MM-DD HH:mm'),
          dateFormat: 'YYYY-MM-DD'
        })
      },
      async refreshLiveCharts () {
        // console.log('refresh')
        await this.setDateTime()
        this.refreshLiveChart = await true
        await setTimeout( () => {
          this.refreshLiveChart = false
        }, 200)
      },
      async refreshHourlyCharts () {
        await this.setDateTime()
        this.refreshHourlyChart = await true
        await setTimeout( () => {
          this.refreshHourlyChart = false
        }, 200)
      },
      dateTime (date) {
        this.hourlyTime = date
      }
    }
  }
</script>
