<template>
  <div class="content_title_section">
    <span class="service_depth">Dashboard</span>
    <div class="service_depth_info">
      <h2>Overview</h2>
      <a class="btn_ico_help" @click="getTooltip()"><span class="blind">help</span></a>
    </div>
    <div class="gnb_menu">
      <ul>
        <!-- [D] 메뉴 선택시 li에 on 추가 필요 -->
        <li :class="{on: isDaily}" @click="selectedGnbMenu(menuName.Daily)"><a class="btn_menu one">Daily</a></li>
        <li :class="{on: !isDaily}" @click="selectedGnbMenu(menuName.Monthly)"><a class="btn_menu two">Monthly</a></li>
      </ul>
      <div class="add_info">
        <div class="date_area data_area_dashboard" >
          <handler-date-picker
            v-if="isShowDatePicker"
            :dateCode="dateCode"
            :setHandlerDate="setHandlerDate"
            :selectedDates="selectedDates"
            :showingFormat="showingFormat"
            :parent="'dataHandler'"
            :date="'DASHBOARD'" />
            <!-- date는 기본값이 SD01인데, SD01로 할 경우, 오늘 날짜까지 선택 할 수 있기 때문에 오늘을 선택 못하게 하기 위해서 아무텍스트나 보냄 -->
            <!-- <input type="text" class="set_date_val" value="2018-09" style="width:180px"> -->
        </div>
        <a @click="mixinDownloadReport()" class="download_report">Download Report</a>
      </div>
    </div>
  </div>
</template>

<script>
  import * as types from '@/shared/stores/types'
  import { mapActions, mapState, mapMutations } from 'vuex'
  import HandlerDatePicker from '@/app/bodys/body/components/common/GrowthyDatepicker/HandlerDatePicker'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'
  import moment from "moment"
  export default {
    name: 'DashboardHeader',
    mixins: [ dashboardMixin ],
    components: {
      HandlerDatePicker
    },
    watch: {
      '$route.params.projectId' (d, n) {
        this.init()
      },
      '$route.query.revenue' (d, n) {
        this.getHeaderTooltip()
      },
    },
    data () {return {
      menuName: { Daily: 'Daily', Monthly: 'Monthly'},
      dateCode: '',
      startDate: '',
      endDate: '',
      showingFormat: '',
      selectedDates: '',
      isShowDatePicker: false,
      overview: {
        name: 'overview',
        tooltip: { chartName: '', dimension: [], kpi: [], tooltip: '', description: '' },
      },
      glossaryBaseHeader: {
        daily: {
          user: {
            overview: {
              chartName: 'Overview',
              dimension: { ids: [13, 6, 5, 75, 7, 9, 43] },
              kpi: { ids: [63, 46, 45, 44, 65, 66, 71, 73, 72, 18, 22, 24, 25, 26] }
            },
          },
          userRevenue: {
            overview: {
              chartName: 'Overview',
              dimension: { ids: [13, 6, 5, 75, 7, 9, 16, 43, 51] },
              kpi: { ids: [63, 46, 45, 44, 65, 71, 73, 72, 31, 79, 29, 35, 37, 36, 192, 81, 193, 82, 22, 24, 25, 26] }
            },
          }
        },
        monthly: {
          user: {
            overview: {
              chartName: 'Overview',
              dimension: { ids: [13, 6, 5, 7, 9, 91] },
              kpi: { ids: [107, 94, 93, 92, 20, 18, 194, 22, 24, 25, 26] }
            },
          },
          userRevenue: {
            overview: {
              chartName: 'Overview',
              dimension: { ids: [13, 6, 5, 7, 9, 16, 91, 96] },
              kpi: { ids: [107, 94, 93, 92, 20, 31, 32, 29, 35, 37, 36, 25, 26] }
            },
          }
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
      this.init()
    },
    mounted () {
    },
    destroyed () {
      // debugger
      this.selectedGnbMenu(this.menuName.Daily)
    },
    methods: {
      ...mapMutations([
        types.SET_DASHBOARD_CURRENT_DATES,
        types.SET_DASHBOARD_STATE
      ]),
      async init () {
        this.isShowDatePicker = false
        const isDailyLocalStorage = window.localStorage.getItem('isDaily') === 'true'
        this.dateCode = isDailyLocalStorage ? 'DA01' : 'DA02',
        this.showingFormat = isDailyLocalStorage ? 'YYYY-MM-DD' : 'YYYY-MM'
        this.selectedDates = isDailyLocalStorage
                            ? [moment(new Date()).subtract(1, 'd').format(this.showingFormat)]
                            : [moment(new Date()).subtract(1, 'months').format(this.showingFormat)]
        setTimeout( () => {
          this.setHandlerDate(this.selectedDates)
        }, 100)
        // this.getHeaderTooltip()
      },
      async selectedGnbMenu (menuName) {
        if (!this._nowCallApiList.length) {
          this.isShowDatePicker = false
          window.localStorage.setItem('isDaily', menuName === this.menuName.Daily ? 'true' : 'false')
          this.$router.push({ query: Object.assign({}, this.$route.query, { daily: menuName === this.menuName.Daily ? 'true' : 'false' }) });
          await this.setDateData(menuName === this.menuName.Daily)
          await setTimeout( () => {
            this[types.SET_DASHBOARD_STATE]({
              stateName: 'isDaily',
              stateValue: menuName === this.menuName.Daily
            })
            // let tmpQuery = _.cloneDeep(this.$route.query)
            // tmpQuery.daily = menuName === this.menuName.Daily ? 'true' : 'false'
            // this.$router.replace({query: Object.assign({}, tmpQuery)})
            this.setHandlerDate(this.selectedDates)
            // this.getHeaderTooltip()
          }, 100)
        }
      },
      setHandlerDate (cDates) {
        const isDailyLocalStorage = window.localStorage.getItem('isDaily') === 'true'
        if (cDates && cDates[0]) {
          // Daily -> Monthly 선택 시.
          if (!isDailyLocalStorage && cDates[0].length > 7) {
            cDates[0] = moment().subtract(1, 'months').format('YYYY-MM')
            if (cDates[1]) {
              cDates[1] = moment().subtract(1, 'months').format('YYYY-MM')
            }
          }
          // Monthly -> Daily 선택 시.
          if (isDailyLocalStorage && cDates[0].length < 8) {
            cDates[0] = moment().subtract(1, 'd').format('YYYY-MM-DD')
            if (cDates[1]) {
              cDates[1] = moment().subtract(1, 'd').format('YYYY-MM-DD')
            }
          }
          // [!] - 실제 사용하는 아래 코드 3줄은 주석 처리함(추후사용)
          // [!] - 데이터가 특정일 밖에 없어서 강제함.
          this.startDate = [cDates[0]]
          this.endDate = [(cDates[1]) ? cDates[1] : cDates[0]]
          this.selectedDates = [cDates[0]]
          // this.startDate = [this.isDaily ? '2019-08-11' : '2017-12']
          // this.endDate = [this.isDaily ? '2019-08-11' : '2017-12']
          // this.selectedDates = [this.isDaily ? '2019-08-11' : '2017-12']
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
        // if (isDailyTmp && this.selectedDates[0].length < 8 ) {
        //   this.selectedDates = [_.cloneDeep(this.selectedDates[0])+'-01']
        // }
        this.dateCode = isDailyTmp ? 'DA01' : 'DA02',
        this.showingFormat = isDailyTmp ? 'YYYY-MM-DD' : 'YYYY-MM'
      },
      getTooltip () {
        this.getHeaderTooltip()
        this.mixinToggleAboutThisChart({ type: 'report', data: this.overview.tooltip })
      },
      getHeaderTooltip () {
        this.overview.tooltip = { chartName: '', dimension: [], kpi: [], tooltip: '', description: '' }
        const isDailyLocalStorage = window.localStorage.getItem('isDaily') === 'true'
        const glossaryTmp = this.glossaryBaseHeader[isDailyLocalStorage ? 'daily' : 'monthly'][ this.$route.query.revenue === 'true' ? 'userRevenue' : 'user']
        this.overview.tooltip.chartName = glossaryTmp.overview.chartName
        this.mixinGetGlossary({ids: isDailyLocalStorage ? 204 : 205}).then(res => {
          this.overview.tooltip.tooltip = res[0].tooltip
          this.overview.tooltip.description = res[0].description
        })
        if (glossaryTmp.overview.kpi.ids.length > 0) {
          this.mixinGetGlossary({ids: glossaryTmp.overview.kpi.ids}).then(res => {
            this.overview.tooltip.kpi = res
          })
        }
        if (glossaryTmp.overview.dimension.ids.length > 0) {
          this.mixinGetGlossary({ids: glossaryTmp.overview.dimension.ids}).then(res => {
            this.overview.tooltip.dimension = res
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
