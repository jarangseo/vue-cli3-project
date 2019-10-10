<template>
  <div class="inner_chart_grid">
    <div class="grid_area" v-if="isLoading" >
      <div class="grid_title">
        <p>Realtime Event Count</p>
      </div>
      <loading-bar/>
    </div>
    <div class="grid_area" v-if="!isLoading && tableData.header.column.length === 0 && tableData.body.data.length === 0" >
      <div class="grid_title">
        <p>Realtime Event Count</p>
      </div>
      <div class="normalTable" style="height:500px;text-align:center;line-height:500px;">
        NoData
      </div>
    </div>
    <normal-table-chart v-if="!isLoading && tableData && tableData.header.column.length > 0 && tableData.body.data.length > 0"
      :tableData="tableData"/>
    <!-- <div class="folid_title_area nomargin">
      <a href="" class="btn_go_report"><span>Go to Related Report</span></a>
    </div> -->
  </div>
</template>
<script>
  import * as types from '@/shared/stores/types'
  import { mapActions, mapState, mapMutations } from 'vuex'
  import NormalTableChart from '../charts/NormalTableChart'
  import LoadingBar from '@/app/bodys/body/components/common/LoadingBar'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'
  import moment from 'moment'
  
  export default {
    name: 'RealtimeHourlyTableArea',
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
      NormalTableChart,
      LoadingBar,
    },
    watch: {},
    data () {
      return {
        isLoading: true,
        exceptMixinWatch: true,
        tableData: {
          header: {
            rate: ['33%', '', '22%'],
            column: [],
            data: [
              {name: 'Event Type', column: 'type'},
              {name: 'Event Name', column: 'name'},
              {name: 'Count', column: 'count'},
            ]
          },
          body: {
            rate: ['33%', '', '22%'],
            data: [
              // {type: 'Predefine', name: 'Action', count: 100},
              // {type: 'Predefine', name: 'Money', count: 110},
              // {type: 'Predefine', name: 'Played', count: 100},
              // {type: 'Custom', name: 'LevelUp', count: 500},
              // {type: 'Custom', name: 'CharacterEnhance', count: 50},
              // {type: 'Predefine', name: 'CharacterEnhance CharacterEnhance CharacterEnhance', count: 100},
              // {type: 'Predefine', name: 'Action', count: 110},
              // {type: 'Predefine', name: 'Money', count: 100},
              // {type: 'Custom', name: 'Played', count: 500},
              // {type: 'Custom', name: 'LevelUp', count: 50},
            ]
          }
        }
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
        this.getRealtimeTableData()
      },
      getRealtimeTableData () {
        this.isLoading = true
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
          // console.log('res: ', res)
          if (!_.isEmpty(res) && !_.isEmpty(res.data.dataList) && !_.isEmpty(res.data.headerInfo.colCombinationList)) {
            this.tableData.header.column = [...res.data.headerInfo.rowList, ...res.data.headerInfo.colCombinationList]
            this.tableData.body.data = res.data.dataList
            this.isLoading = false
          } else {
            this.isLoading = false
            if (window.location.port === '8889') console.error('GET_REALTIME_TABLE_DATA - API 결과 데이터 존재 하지 않음.')
          }
        })
      }
    }
  }
</script>

