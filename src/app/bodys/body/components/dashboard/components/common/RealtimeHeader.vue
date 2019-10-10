<template>
  <div class="content_title_section">
    <span class="service_depth">Dashboard</span>
    <div class="service_depth_info">
      <h2>Realtime</h2>
      <a class="btn_ico_help" @click="getTooltip()"><span class="blind">help</span></a>
      <!-- <div class="add_info">
        <a href="" class="download_report">Download Report</a>
      </div> -->
    </div>
  </div>
</template>

<script>
  import * as types from '@/shared/stores/types'
  import { mapActions, mapState, mapMutations } from 'vuex'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'
  export default {
    name: 'RealtimeHeader',
    mixins: [ dashboardMixin ],
    components: {},
    watch: {},
    data () {return {
      menuName: { Daily: 'Daily', Monthly: 'Monthly'},
      dateCode: '',
      startDate: '',
      endDate: '',
      showingFormat: '',
      selectedDates: '',
      realtime: {
        name: 'realtime',
        tooltip: { chartName: '', dimension: [], kpi: [] }
      },
      glossaryBaseHeader: {
        user: {
          realtime: {
            chartName: 'Realtime',
            dimension: { ids: [197, 198] },
            kpi: { ids: [199, 200, 201, 112, 111, 110, 113, 196, 114, 115, 116, 202] }
          },
        },
        userRevenue: {
          realtime: {
            chartName: 'Realtime',
            dimension: { ids: [197, 198] },
            kpi: { ids: [199, 200, 201, 112, 111, 110, 118, 117, 119, 113, 196, 114] }
          },
        }
      },
      exceptMixinWatch: true,
    }},
    computed: {
      ...mapState({
        isDaily: state => state.dashboard.isDaily,
        _currentDates: state => state.dashboard._currentDates,
        _nowCallApiList: state => state.dashboard._nowCallApiList,
      })
    },
    created () {
      // this.init()
      // this.getHeaderTooltip()
    },
    mounted () {
    },
    methods: {
      ...mapMutations([
        types.SET_DASHBOARD_CURRENT_DATES,
        types.SET_DASHBOARD_STATE
      ]),
      init () {
        this.dateCode = this.isDaily ? 'DA01' : 'DA02',
        this.showingFormat = this.isDaily ? 'YYYY-MM-DD' : 'YYYY-MM'
        this.selectedDates = [moment(new Date()).subtract(1, 'd').format(this.showingFormat)]
        this.setHandlerDate(this.selectedDates)
      },
      async selectedGnbMenu (menuName) {
        if (!this._nowCallApiList.length) {
          this.isShowDatePicker = false
          await this.setDateData(menuName === this.menuName.Daily)
          this[types.SET_DASHBOARD_STATE]({
            stateName: 'isDaily',
            stateValue: menuName === this.menuName.Daily
          })
          this.setHandlerDate(this.selectedDates)
        }
      },
      setHandlerDate (cDates) {
        if (cDates && cDates[0]) {
          // [!] - 실제 사용하는 아래 코드 3줄은 주석 처리함(추후사용)
          // [!] - 데이터가 특정일 밖에 없어서 강제함.
          // this.startDate = cDates[0]
          // this.endDate = (cDates[1]) ? cDates[1] : cDates[0]
          // this.selectedDates = [cDates[0]]
          this.startDate = '2019-05-01'
          this.endDate = '2019-05-01'
          this.selectedDates = '2019-05-01'
          this[types.SET_DASHBOARD_CURRENT_DATES]({
            dateCode: this.dateCode,
            startDate: this.startDate,
            endDate: this.endDate,
            selectedDates: this.selectedDates,
            dateFormat: this.showingFormat
          })
          this.isShowDatePicker = true
        }
      },
      setDateData (isDailyTmp) {
        if (isDailyTmp && this.selectedDates[0].length < 8 ) {
          this.selectedDates = [_.cloneDeep(this.selectedDates[0])+'-01']
        }
        this.dateCode = isDailyTmp ? 'DA01' : 'DA02',
        this.showingFormat = isDailyTmp ? 'YYYY-MM-DD' : 'YYYY-MM'
      },
      getTooltip () {
        this.getHeaderTooltip()
        this.mixinToggleAboutThisChart({ type: 'report', data: this.realtime.tooltip })
      },
      getHeaderTooltip () {
        this.realtime.tooltip = { chartName: '', dimension: [], kpi: [], tooltip: '', description: '' }
        const glossaryTmp = this.glossaryBaseHeader[ this.$route.query.revenue === 'true' ? 'userRevenue' : 'user']
        this.realtime.tooltip.chartName = glossaryTmp.realtime.chartName
        this.mixinGetGlossary({ids: 206}).then(res => {
          this.realtime.tooltip.tooltip = res[0].tooltip
          this.realtime.tooltip.description = res[0].description
        })
        if (glossaryTmp.realtime.kpi.ids.length > 0) {
          this.mixinGetGlossary({ids: glossaryTmp.realtime.kpi.ids}).then(res => {
            this.realtime.tooltip.kpi = res
          })
        }
        if (glossaryTmp.realtime.dimension.ids.length > 0) {
          this.mixinGetGlossary({ids: glossaryTmp.realtime.dimension.ids}).then(res => {
            this.realtime.tooltip.dimension = res
          })
        }
      },
    }
  }
</script>
<style>
.data_area_dashboard {
  width: 180px !important;
  height: 34px !important;
  border-radius: 4px !important;
  border: solid 1px #cccccc !important;
  background-color: #ffffff !important;
}
.data_area_dashboard .growthy-datepicker-wrapper .handler-datepicker .date_area > a {
  margin-left: 40px !important;
  line-height: 30px !important;
}

.data_area_dashboard .growthy-datepicker-wrapper .handler-picker .date_area > a {
  margin-left: 40px !important;
  line-height: 30px !important;
}
</style>
