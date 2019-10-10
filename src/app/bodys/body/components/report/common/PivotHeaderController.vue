<template>
<div style="border-right: 1px solid #ddd;border-left: 1px solid #ddd;">
  <!-- OGPQA-1071 수정중 유저 정보 팝업이 header에 가려지는 이슈가 있어서 z-index 55 -> 10 -->
  <div class="grid_records" style="z-index: 10;">
    <div class="records_info">
      <span class="records_count"><strong>{{totalRecords}}</strong> Records</span>
      <span class="setting_filter" v-if="objType === 'OB05'">{{ selectedFilterString.length > 0 ? `Filter : ${selectedFilterString.toString()}` : '' }}</span>
    </div>
    <div class="records_regulate">
      <div class="regulate_group">
        <ul>
          <li><a @click="loadInitObjectData" class="records_btn initial_sorting"><span class="blind">Initial Sorting</span></a></li>
          <li>
            <a @click="toggleDownloadPanel"  class="records_btn download"><span class="blind">Download</span></a>
            <!-- [D] 드롭 리스트 open시, display:block 로 변경 필요 (default - display:none) -->
            <div class="drop_list_layer" style="width:200px;display:block;" v-if="isShowDownloadPanel">
              <div class="inner_drop_list">
                <ul>
                  <li><a @click="downloadExcel()">Merged Excel</a></li>
                  <li><a @click="downloadSplitExcel()">Split Excel</a></li>
                  <li><a  @click="downloadCSV()">CSV</a></li>
                </ul>
              </div>
            </div>
          </li>
          <li><a @click="toggleScreenSizeController()"  class="records_btn full_screen" v-if="showType === 'pivot'"><span class="blind">Full Screen</span></a></li>
          <li><a @click="goToTableTop()" class="records_btn move_top"><span class="blind">Top</span></a></li>
        </ul>
      </div>
      <a @click="openPivotSetting" class="pivot_setting" v-if="showType === 'pivot'"><span>PIVOT SETTING</span></a>
    </div>
  </div>
</div>
</template>
<script>
import * as types from '@/shared/stores/types'
import { mapState } from 'vuex'
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'PivotHeaderController',
  props: {
    totalRecords: String,
    filters: String,
    showType: {
      type: String,
      default: 'grid'
    },
    toggleRightPanel: Function,
    goToFullScreen: Function,
    objectInfo: Object,
    pivotSettingData: Object,
    loadInitObjectData: Function,
    resetTablesTooltip: Function,
    goToTableTop: {
      type: Function,
      default: () => {}
    },
    objType: String,
    pivotIdx: Number
  },
  computed: {
    ...mapState({
      _initReportData: state => state.report._initReportData
    }),
    _ () {
      return _
    },
    selectedFilterString() {
      return Object.keys(this.pivotSettingData.filter)
    }
  },
  watch: {
    pivotSettingData: {
      handler: (d) => {
        console.log(d)
      },
      deep: true
    }
  },
  data () {
    return {
      isShowDownloadPanel: false,
      pivotDataObj: {
        byDimension: '',
        endDate: '20190220',
        filter: {},
        merged: true,
        objectId: 0,
        projectId: 0,
        reportId: 0,
        settings: {},
        startDate: '20190101'
      }
    }
  },
  methods: {
    toggleDownloadPanel () {
      this.resetTablesTooltip()
      this.isShowDownloadPanel = !this.isShowDownloadPanel
    },
    downloadExcel () {
      let downloadData = _.cloneDeep(this.pivotSettingData)
      let dateType = this._initReportData.dataHandlerType.dateType
      this.resetTablesTooltip()
      downloadData.objectId = this.objectInfo.id
      downloadData.reportId = this.objectInfo.reportId
      downloadData.projectId = window.localStorage.setProjectId
      if (dateType === 'DA05') {
        downloadData.startDate = moment(downloadData.startDate).format('YYYYMMDD HHmm')
        downloadData.endDate = moment(downloadData.endDate).format('YYYYMMDD HHmm')
      }
      this.$store.dispatch(types.DOWNLOAD_EXCEL, downloadData)
      this.toggleDownloadPanel()
    },
    downloadSplitExcel () {
      let downloadData = _.cloneDeep(this.pivotSettingData)
      let dateType = this._initReportData.dataHandlerType.dateType
      this.resetTablesTooltip()
      downloadData.objectId = this.objectInfo.id
      downloadData.reportId = this.objectInfo.reportId
      downloadData.projectId = window.localStorage.setProjectId
      if (dateType === 'DA05') {
        downloadData.startDate = moment(downloadData.startDate).format('YYYYMMDD HHmm')
        downloadData.endDate = moment(downloadData.endDate).format('YYYYMMDD HHmm')
      }
      downloadData.merged = false
      this.$store.dispatch(types.DOWNLOAD_EXCEL, downloadData)
      this.toggleDownloadPanel()

    },
    downloadCSV () {
      let downloadData = _.cloneDeep(this.pivotSettingData)
      let dateType = this._initReportData.dataHandlerType.dateType

      this.resetTablesTooltip()
      downloadData.objectId = this.objectInfo.id
      downloadData.reportId = this.objectInfo.reportId
      downloadData.projectId = window.localStorage.setProjectId
      if (dateType === 'DA05') {
        downloadData.startDate = moment(downloadData.startDate).format('YYYYMMDD HHmm')
        downloadData.endDate = moment(downloadData.endDate).format('YYYYMMDD HHmm')
      }
      this.$store.dispatch(types.DOWNLOAD_CSV, downloadData)
      this.toggleDownloadPanel()
    },
    toggleScreenSizeController () {
      this.goToFullScreen(this.pivotIdx)
    },
    openPivotSetting () {
      this.$store.commit(types.SET_ACTIVE_MODAL, this.$options.name)
      if (_.isEmpty(this._initReportData.dataHandlerType.filterList)) {
        this.$store.commit(types.SET_HANDLER_FILTER_LIST, this.objectInfo.filterList)
      }
      this.toggleRightPanel()
    }
  }
}
</script>
