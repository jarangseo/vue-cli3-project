<template>
  <div class="grid_area pivot-wrapper">
    <loading-bar :isShowLoading="loadCompelete"></loading-bar>
    <div class="grid_title" v-if="_initReportData.reportTemplateType === 'TE02' && loadCompelete && gridName">
      <!-- gridName은 Semidashboard (TE02) 에서만 노출 -->
      <p>{{gridName}}</p>
    </div>
    <pivot-header-controller
      v-if="loadCompelete"
      :totalRecords="totalRecords"
      :filters="filters"
      :resetTablesTooltip="resetTablesTooltip"
      :showType="'grid'"
      :toggleRightPanel="() => {}"
      :goToFullScreen="() => {}"
      :objectInfo="objectInfo"
      :pivotSettingData="tableDataObj"
      :loadInitObjectData="loadInitObjectData"
      :setTotalCnt="setTotalCnt"
      :goToTableTop="goToTableTop"
      :objType="objType"
    ></pivot-header-controller>
    <new-pivot-table
      v-if="loadCompelete"
      :ref="'pivotTables'"
      :pivotData="tableData"
      :setTotalCnt="setTotalCnt"
      :initPivotFlag="initPivotFlag"
      :isGoToTableTop="isGoToTableTop"
      :changePivotData="changePivotData"
      :isNoData="isNoData"
      :pivotIdx="pivotIdx"
      :isResetPopupContent="isResetPopupContent"
      :isErrorFromPresto="isErrorFromPresto"
    ></new-pivot-table>
  </div>
</template>
<script>
import * as types from "@/shared/stores/types"
import { mapState } from "vuex"
import pivotData from "@/shared/utils/data.js"
import _ from "lodash"
import LoadingBar from "../../../common/LoadingBar"
import TableGrid from "../../common/TableGrid"
import PivotHeaderController from "../../common/PivotHeaderController"
import NewPivotTable from '../../common/NewPivotTable'
import moment from 'moment'

export default {
  name: "PivotPannel",
  components: {
    LoadingBar,
    TableGrid,
    PivotHeaderController,
    NewPivotTable
  },
  props: {
    objectInfo: Object,
    byDimension: String,
    objType: String,
    saveLastReportSetting: Function,
    alreadySetFilters: Object,
    settings: Object,
    currentDates: Array,
    gridName: String,
    pivotIdx: Number,
    basicBackupCommonCondition: Object
  },
  watch: {
    objectInfo (d) {
      if (d.settings && !_.isEmpty(d.settings)) {
        this.tableDataObj.settings = d.settings
      }
    },
    dataList(d) {
      _.map(d, o => {
        let exceptionDateList = []
        this.dateList.push(o[0])
        _.forEach(o, (value, idx) => {
          if (idx !== 0) {
            exceptionDateList.push(value)
            this.dataCount++
          }
        })
        this.series.push(exceptionDateList)
      })
      _.map(this.dateList, (u, i) => {
        if (i === 0) {
          this.leftInfos[0] = {
            left: this.rowList[0],
            date: u
          }
        } else {
          this.leftInfos[i] = {
            left: null,
            date: u
          }
        }
      })
    },
    _me () {
      this.initObject(this.backupCommonCondition)
    }
  },
  data() {
    return {
      isErrorFromPresto: false,
      isResetPopupContent: false,
      initPivotFlag: false,
      isGoToTableTop: false,
      totalRecords: "0",
      firstCombinationHeader: "",
      filters: "",
      isNoData: false,
      tableName: "Table Table",
      dataCount: 0,
      headerList: [],
      dateList: [],
      series: [],
      leftInfos: [],
      filterList: [],
      tableData: {},
      backupCommonCondition: {},
      rowFields: [
        {
          getter: item => item.country,
          label: "Country"
        },
        {
          getter: item => item.gender,
          label: "Gender",
          headerSlotName: "genderHeader"
        }
      ],
      colFields: [
        {
          getter: item => item.year,
          label: "Year"
        }
      ],
      reducer: (sum, item) => sum + item.count,
      tableDataObj: {
        byDimension: "",
        endDate: "20190220",
        filter: {},
        merged: true,
        objectId: 0,
        projectId: 0,
        reportId: 0,
        settings: {},
        startDate: "20190101"
      },
      loadCompelete: false
    }
  },
  computed: {
    ...mapState({
      _initReportData: state => state.report._initReportData,
      _tableData: state => state.report._tableData,
      _currentDates: state => state.report._currentDates,
      _isCompleteTableLoad: state => state.report._isCompleteTableLoad,
      _me: state => state.common._me
    }),
    pivotData() {
      return pivotData
    }
  },
  methods: {
    resetTablesTooltip () {
      _.forEach(this.$children, component => {
        if (component.hideToolTip) {
          component.hideToolTip()
        }
      })
    },
    resetPopupComponent () {
      this.isResetPopupContent = !this.isResetPopupContent
    },
    changePivotData (pivotData) {
      this.tableData = pivotData
    },
    loadInitObjectData () {
      this.initPivotFlag = !this.initPivotFlag
    },
    setTotalCnt (cnt) {
      this.totalRecords = cnt + ""
      this.$forceUpdate()
    },
    goToTableTop () {
      this.isGoToTableTop = !this.isGoToTableTop
    },
    updateObject (commonCondition) {
      const dateType = this._initReportData.dataHandlerType.dateType
      const condition = commonCondition || this.basicBackupCommonCondition
      this.loadCompelete = false
      this.isNoData = false
      this.tableDataObj.byDimension = this.byDimension
      this.tableDataObj.objectId = this.objectInfo.id
      this.tableDataObj.reportId = this.objectInfo.reportId
      this.tableDataObj.projectId = window.localStorage.setProjectId
      this.tableDataObj.startDate = dateType === 'DA05' ? moment(this.currentDates[0]).format('YYYYMMDD HHmm') : this.currentDates[0]
      this.tableDataObj.endDate = dateType === 'DA05' ? moment(this.currentDates[1]).format('YYYYMMDD HHmm') : this.currentDates[1]
      this.backupCommonCondition = condition || {}
      if (condition && !_.isEmpty(condition)) {
        this.tableDataObj.filter = condition.filter || {}
        this.tableDataObj.startDate = dateType === 'DA05' ? moment(condition.startDate || this.tableDataObj.startDate).format('YYYYMMDD HHmm') : condition.startDate || this.tableDataObj.startDate
        this.tableDataObj.endDate = dateType === 'DA05' ? moment(condition.endDate || this.tableDataObj.endDate).format('YYYYMMDD HHmm') : condition.endDate || this.tableDataObj.endDate
        this.tableDataObj.settings = condition.settings || this.tableDataObj.settings || {}
      }
      this.saveLastReportSetting ? this.saveLastReportSetting(this.tableDataObj,'OB04') : ''
      const isPreview = this.$route.path.indexOf('preview') > 0
      Promise.all([
        this.$store.dispatch(types.UPDATE_TABLE_DATA, {isPreview: isPreview, reqBody: this.tableDataObj})
      ]).then(res => {
        this.tableData = res[0]
        this.loadCompelete = true
        if (this.tableData.dataList.length === 0) {
          this.isNoData = true
        } else {
          this.isNoData = false
        }
        this.$store.commit(types.UPDATE_PIVOT_DATA, {
          pivotData: this.tableData,
          pivotIdx: this.pivotIdx
        })
      }).catch(err => {
        this.loadCompelete = true
        this.isNoData = true
        if (err.response.data.code === 500500) {
          this.isErrorFromPresto = true
        } else {
          this.isErrorFromPresto = false
        }
      })
    },
    initObject () {
      let condition = {}
      if (!_.isEmpty(this.backupCommonCondition)) {
        condition = this.backupCommonCondition
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
    this.loadCompelete = false
    this.initObject()
  }
};
</script>
<style lang="scss" scoped>
.grid_area {
  box-shadow: none !important;
}
</style>
