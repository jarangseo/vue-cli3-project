<template>
  <!-- [D] 50% chart 일 경우, chart_area에 half 클래스 추가 필요 -->
  <!-- [D] 차트 노출시 display:block 로 변경 필요 -->
  <div class="chart_area half" style="display:block;">
    <ul>
      <li>
        <!-- initialFilter 데이터 설정하는 코드가 따로 없어서 우선 삭제함 -->
        <half-chart :_halfChartData="firstChartObj"
                    :objectInfo="objectInfo.values[0]"
                    :initialFilterData="objectInfo.values[0].initialFilter"
                    :displayDimension="objectInfo.values[0].displayDimension"
                    :isSecond="false"
                    :isDataLoadError="isDataLoadError"
                    :isCompleteLoad="isCompleteLoad"
                    :isErrorFromPresto="isErrorFromPresto"
                    @toggleRightPanel="toggleRightPanel"
        ></half-chart>
      </li>
      <li>
        <half-chart :_halfChartData="secondChartObj"
                    :objectInfo="objectInfo.values[1]"
                    :initialFilterData="objectInfo.values[1].initialFilter"
                    :displayDimension="objectInfo.values[1].displayDimension"
                    :isSecond="true"
                    :isDataLoadError="isDataLoadError"
                    :isCompleteLoad="isCompleteLoad"
                    :isErrorFromPresto="isErrorFromPresto"
                    @toggleRightPanel="toggleRightPanel"
        ></half-chart>
      </li>
    </ul>
    <!-- [D] View Grid 클릭 후 하단 차트 open시 folid_title_area에 open 클래스 추가 필요-->
    <!-- [D] open 적용시  btn_folid 텍슽 변경 필요 (View Grid <-> Hide Grid)-->
    <div class="grid-wrapper" v-if="isCompleteLoad">
      <div class="folid_title_area" v-if="_initReportData.reportTemplateType === 'TE02'">
        <a @click="toggleGrid" class="btn_folid" v-if="!isOpenGrid">
          <span>View Grid</span>
        </a>
        <a @click="toggleGrid" class="btn_folid" v-if="isOpenGrid">
          <span>Hide Grid</span>
        </a>
        <a class="btn_go_report" v-if="relatedReportId > -1" @click="goToRelativeReport(relatedReportId)">
          <span>Go to Related Report</span>
        </a>
      </div>
      <!-- [D] 차트 open시 display:block 로 변경 필요 -->
      <!--  table_grid -->
      <div
        class="grid_area pivot-wrapper"
        style="display:block"
        v-if="_initReportData.reportTemplateType === 'TE02' && isOpenGrid"
      >
        <pivot-header-controller
          :totalRecords="totalRecords"
          :filters="filters"
          :showType="'grid'"
          :toggleRightPannel="() => {}"
          :goToFullScreen="() => {}"
          :goToTableTop="goToTableTop"
          :objectInfo="objectInfo"
          :pivotSettingData="chartInfoObj"
          :loadInitObjectData="loadInitObjectData"
          :resetTablesTooltip="resetTablesTooltip"
          :objType="objType"
        ></pivot-header-controller>
        <!-- fixed_table -->
        <new-pivot-table
          :isNoData="isGridNoData"
          :pivotData="gridData"
          :setTotalCnt="setTotalCnt"
          :isGoToTableTop="isGoToTableTop"
          :initPivotFlag="initPivotFlag"
          :setGoToTableTop="setGoToTableTop"
          :pivotIdx="pivotIdx"
          :changePivotData="changeGridData"
          :isResetPopupContent="isResetPopupContent"
          :isErrorFromPresto="isErrorFromPresto"
        ></new-pivot-table>
        <!-- //fixed_table -->
      </div>
      <!--  //table_grid -->
    </div>
  </div>
</template>

<script>
  import * as types from "@/shared/stores/types"
  import { mapState } from "vuex"
  import { util } from "@/shared/utils/util"
  import moment from "moment"
  import _ from "lodash"
  import HalfChart from './HalfChart'
  import NewPivotTable from '../../common/NewPivotTable'
  import PivotHeaderController from "../../common/PivotHeaderController"

  export default {
    name: 'IndependentHalfChartPannel',
    components: {
      HalfChart,
      NewPivotTable,
      PivotHeaderController
    },
    props: {
      objectInfo: Object,
      byDimension: String,
      objType: String,
      saveLastReportSetting: Function,
      settings: Object,
      alreadySetFilters: Object,
      currentDates: Array,
      pivotIdx: Number,
      basicBackupCommonCondition: Object
    },
    watch: {
      _me() {
        this.initObject(this.backupCommonCondition)
      },
      _chartData: {
        handler(d) {
          this.makeChart(d)
        },
        deep: true
      },
      halfChartData: {
        handler (d) {
          this.firstChartObj = _.cloneDeep(d[0])
          this.secondChartObj = _.cloneDeep(d[1])

          if (this._initReportData.reportTemplateType === 'TE02') {
            this.gridData = d[0].gridData
            this.isGridNoData = this.gridData.dataList.length === 0
          }
        },
        deep: true
      }
    },
    data() {
      return {
        isErrorFromPresto: false,
        isResetPopupContent: false,
        isCompleteLoad: false,
        isNoData: false,
        isDataLoadError: false,
        isGridNoData: false,
        isGoToTableTop: false,
        initPivotFlag: false,
        relatedReportId: -1,
        totalRecords: "0",
        filters: "",
        firstChartObj: {},
        secondChartObj: {},
        gridData: {},
        halfChartData: [],
        backupCommonCondition: {},
        chartInfoObj: {
          byDimension: "",
          endDate: moment("2019-02-10").format("YYYYMMDD"),
          filter: {},
          merged: true,
          objectId: 0,
          projectId: "string",
          reportId: 0,
          settings: {},
          startDate: moment("2019-01-01").format("YYYYMMDD")
        },
        objectIds: [],
        isOpenGrid: false
      }
    },
    computed: {
      ...mapState({
        _projectInfo: state => state.project._projectInfo,
        _menuList: state => state.menu._menuList,
        _initReportData: state => state.report._initReportData,
        _chartData: state => state.report._halfChartData,
        _currentDates: state => state.report._currentDates,
        dataBySelectedLang: state => state.common._lang.dataBySelectedLang,
        _me: state => state.common._me
      }),
      _() {
        return _
      }
    },
    methods: {
      resetPopupComponent () {
        this.isResetPopupContent = !this.isResetPopupContent
      },
      changeGridData (gridData) {
        this.gridData = gridData
      },
      setGoToTableTop () {
        this.isGoToTableTop = false
      },
      resetTablesTooltip () {
        _.forEach(this.$children, component => {
          if (component.hideToolTip) {
            component.hideToolTip()
          }
        })
      },
      goToTableTop () {
        this.isGoToTableTop = !this.isGoToTableTop
      },
      loadInitObjectData () {
        this.initPivotFlag = !this.initPivotFlag
      },
      setTotalCnt (cnt) {
        this.totalRecords = cnt + ""
        this.$forceUpdate()
      },
      toggleGrid () {
        this.isOpenGrid = !this.isOpenGrid
      },
      updateObject (commonCondition) {
        const dateType = this._initReportData.dataHandlerType.dateType
        let condition = commonCondition || this.basicBackupCommonCondition

        this.isCompleteLoad = false
        this.isDataLoadError = false
        this.isNoData = false
        this.backupCommonCondition = condition || {}
        let firstChartObj = _.cloneDeep(this.chartInfoObj)
        let secondChartObj = _.cloneDeep(this.chartInfoObj)

        firstChartObj.byDimension = this.byDimension
        firstChartObj.objectId = this.objectInfo.values[0].id
        firstChartObj.reportId = this.objectInfo.values[0].reportId
        firstChartObj.projectId = window.localStorage.setProjectId
        firstChartObj.startDate = dateType === 'DA05' ? moment(this.currentDates[0]).format('YYYYMMDD HHmm') : this.currentDates[0]
        firstChartObj.endDate = dateType === 'DA05' ? moment(this.currentDates[1]).format('YYYYMMDD HHmm') : this.currentDates[1]

        secondChartObj.byDimension = this.byDimension
        secondChartObj.objectId = this.objectInfo.values[1].id
        secondChartObj.reportId = this.objectInfo.values[1].reportId
        secondChartObj.projectId = window.localStorage.setProjectId
        secondChartObj.startDate = dateType === 'DA05' ? moment(this.currentDates[0]).format('YYYYMMDD HHmm') : this.currentDates[0]
        secondChartObj.endDate = dateType === 'DA05' ? moment(this.currentDates[1]).format('YYYYMMDD HHmm') : this.currentDates[1]

        this.objectIds = [firstChartObj.objectId, secondChartObj.objectId]
        if (condition && !_.isEmpty(condition)) {
          firstChartObj.filter = condition.filter || {}
          firstChartObj.startDate = dateType === 'DA05' ? moment(condition.startDate || firstChartObj.startDate).format('YYYYMMDD HHmm') : condition.startDate || firstChartObj.startDate
          firstChartObj.endDate = dateType === 'DA05' ? moment(condition.endDate || firstChartObj.endDate).format('YYYYMMDD HHmm') : condition.endDate || firstChartObj.endDate

          secondChartObj.filter = condition.filter || {}
          secondChartObj.startDate = dateType === 'DA05' ? moment(condition.startDate || secondChartObj.startDate).format('YYYYMMDD HHmm') : condition.startDate || secondChartObj.startDate
          secondChartObj.endDate = dateType === 'DA05' ? moment(condition.endDate || secondChartObj.endDate).format('YYYYMMDD HHmm') : condition.endDate || secondChartObj.endDate
        }
        const isPreview = this.$route.path.indexOf('preview') > 0
        Promise.all([
          this.$store.dispatch(types.UPDATE_DOUBLE_HALF_CHART_DATA, {isPreview: isPreview, reqBody: [firstChartObj, secondChartObj]})
        ]).then(res => {
          this.isCompleteLoad = true
          this.relatedReportId = res[0][0].relatedReportId
          this.isNoData = (res[0][0].chartDataList.length === 0)
          this.halfChartData = res[0]

          if (this.halfChartData.gridData && !_.isEmpty(this.halfChartData.gridData)) {
            this.$store.commit(types.UPDATE_PIVOT_DATA, {
              pivotData: this.halfChartData.gridData,
              pivotIdx: this.pivotIdx
            })
          }
        }).catch(err => {
          // HalfChart의 root에 있는 isChartReady가 데이터로드 에러일 경우 false로 셋팅되어 no data화면도 나오지 않아서 추가 합니다
          this.isDataLoadError = true
          this.isCompleteLoad = true
          this.isNoData = true
          if (err.response.data.code === 500500) {
            this.isErrorFromPresto = true
          } else {
            this.isErrorFromPresto = false
          }
        })
      },
      goToRelativeReport (reportId) {
        let {depth, idx, menuId, parentMenuId} = util.findMenuWithReportId(this._menuList, reportId)
        let projectId = this._projectInfo.projectId
        if (depth === 2) {
          this.$router.replace({name: 'basic', params: {projectId}, query: { parentMenuId, menuId, threeDepth: '0', from: 'relatedReport' }})

        } else if (depth === 3) {
          this.$router.replace({name: 'basic', params: {projectId}, query: { parentMenuId, menuId, threeDepth: idx + '', from: 'relatedReport' }})
        }
      },
      toggleRightPanel (isLeft) {
        this.$store.commit(types.TOGGLE_RIGHT_PANEL)
        this.$store.commit(types.CHECK_RIGHT_PANNEL, 'about_chart')
        this.$store.commit(types.RIGHT_PANNEL_OBJECT_ID, { objectId: isLeft ? this.objectIds[0] : this.objectIds[1], isLeft: true })
      },
      initObject (commonCondition) {
        let condition = {}
        if (!_.isEmpty(commonCondition)) {
          condition = commonCondition
        }
        if (!_.isEmpty(this.alreadySetFilters)) {
          condition.filter = this.alreadySetFilters
        }
        if (!_.isEmpty(this.settings)) {
          condition.settings = this.settings
        }
        if (!_.isEmpty(condition)) {
          this.updateObject(condition)
        } else {
          this.updateObject()
        }
      }
    },
    mounted() {
      this.initObject()
    }
  }
</script>

<style lang="scss" scoped>
.grid-wrapper {
  .grid_area {
    margin-top: 0 !important;
  }
}
</style>
